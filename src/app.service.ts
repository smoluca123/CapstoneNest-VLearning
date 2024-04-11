import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';

type ApiInfo = {
  authorizationToken?: string;
  name: string;
  version: string;
  description: string;
  swagger: string;
  author: string;
};

@Injectable()
export class AppService {
  constructor(
    readonly jwtService: JwtService,
    readonly prisma: PrismaService,
  ) {}
  async getInfo(): Promise<ApiInfo> {
    try {
      const { code_id: codeId, code } = await this.prisma.auth_code.findFirst();
      if (!code) {
        throw new NotFoundException('Auth code not found');
      }
      const authToken = await this.jwtService.signAsync({
        codeId,
        code,
      });
      return {
        authorizationToken: authToken,
        name: 'Elearning',
        version: '1.0.0',
        description: 'Elearning API',
        swagger: '/swagger',
        author: 'Luca Dev',
      };
    } catch (error) {
      throw new BadRequestException('Undetermined error');
    }
  }
}
