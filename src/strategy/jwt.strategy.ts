import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly config: ConfigService,
    readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const { codeId: code_id, code } = payload;
    const checkCode = await this.prisma.auth_code.findFirst({
      where: {
        code_id: code_id || -1,
        code: code || '',
      },
    });
    if (!checkCode) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
