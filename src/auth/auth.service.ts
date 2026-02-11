import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import { Model } from 'mongoose';

import { Otp, OtpStatus } from '../otp/entities/otp.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
    private usersService: UsersService, // Assumes you have a basic usersService
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Helper to hash OTP
  private hashOtp(otp: string): string {
    return crypto
      .createHmac('sha256', this.configService.getOrThrow<string>('OTP_SECRET'))
      .update(otp)
      .digest('hex');
  }
  async sendOtp(mobile: string) {
    let user: User | null;
    // 1. Find or Create User (Lazy Registration)
    user = await this.usersService.findOne({ mobile });

    if (!user) {
      // Register new user as BUYER by default (or determine by context)
      user = await this.usersService.create({
        mobile,
        role: UserRole.BUYER,
      });
    }

    // 2. Rate Limiting: Check for recent ACTIVE OTP for this User
    const existingActiveOtp = await this.otpModel.findOne({
      user: user._id,
      status: OtpStatus.ACTIVE,
      createdAt: { $gt: new Date(Date.now() - 60 * 1000) }, // Sent < 1 min ago
    });

    if (existingActiveOtp) {
      throw new BadRequestException(
        'Please wait 1 minute before requesting a new OTP.',
      );
    }

    // 3. Generate and Hash OTP
    const plainOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = this.hashOtp(plainOtp);

    // 4. Save OTP linked to userId
    await this.otpModel.create({
      user: user._id, // Storing UserId
      code: hashedOtp,
      status: OtpStatus.ACTIVE,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // 5. Send SMS (Mock)
    console.log(`--- SMS SENT to ${mobile}: Your OTP is ${plainOtp} ---`);

    return { message: 'OTP sent successfully', userId: user._id };
  }

  async verifyOtp(mobile: string, otpInput: string) {
    // 1. Find User
    const user = await this.usersService.findOne({ mobile });
    if (!user) throw new UnauthorizedException('User not found');

    // 2. Find ACTIVE OTP for this userId
    const record = await this.otpModel
      .findOne({
        user: user._id,
        status: OtpStatus.ACTIVE,
      })
      .sort({ createdAt: -1 });

    if (!record) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // 3. Check Expiry
    if (new Date() > record.expiresAt) {
      record.status = OtpStatus.EXPIRED;
      await record.save();
      throw new UnauthorizedException('OTP expired');
    }

    // 4. Verify Hash
    const inputHash = this.hashOtp(otpInput);
    if (record.code !== inputHash) {
      record.attempts += 1;

      // Block after 3 attempts
      if (record.attempts >= 3) {
        record.status = OtpStatus.BLOCKED;
        await record.save();
        throw new UnauthorizedException(
          'Too many failed attempts. Request new OTP.',
        );
      }

      await record.save();
      throw new UnauthorizedException('Incorrect OTP');
    }

    // 5. Success: Mark Verified
    record.status = OtpStatus.VERIFIED;
    await record.save();

    // 6. Update User Verification Status
    await this.usersService.update(user._id, {
      isVerified: true,
    });

    // 7. Generate JWT
    const payload = { sub: user._id, mobile: user.mobile, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user._id, mobile: user.mobile, role: user.role },
    };
  }
}
