import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/entities/user.entity';

export enum OtpStatus {
  ACTIVE = 'ACTIVE',
  VERIFIED = 'VERIFIED',
  EXPIRED = 'EXPIRED',
  BLOCKED = 'BLOCKED',
}

export type OtpDocument = HydratedDocument<Otp>;

@Schema({ timestamps: true })
export class Otp {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  user: Types.ObjectId; // Link to the user

  @Prop({ required: true })
  code: string; // Hashed OTP code

  @Prop({ enum: OtpStatus, default: OtpStatus.ACTIVE })
  status: OtpStatus;

  @Prop({ default: 0 })
  attempts: number; // Failed attempt counter

  // Auto-delete document after 300 seconds (5 minutes)
  @Prop({ type: Date, expires: 300 })
  expiresAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

// Compound index for efficient lookups
OtpSchema.index({ userId: 1, status: 1 });
