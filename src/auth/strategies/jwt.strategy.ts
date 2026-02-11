import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from '../../users/entities/user.entity';

export interface AuthUser {
  userId: string;
  mobile: string;
  role: UserRole;
}

type ValidateJWTPayload = Omit<AuthUser, 'userId'> & {
  sub: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: ValidateJWTPayload): AuthUser {
    return {
      userId: payload.sub,
      mobile: payload.mobile,
      role: payload.role,
    };
  }
}
