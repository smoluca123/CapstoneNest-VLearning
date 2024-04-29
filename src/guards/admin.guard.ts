import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { id, username } = request.decodedAccessToken;
      const checkAuth = await this.prisma.user.findUnique({
        where: {
          id,
          username,
        },
        include: {
          type_user: true,
        },
      });
      //! Kiểm tra xem người dùng có role là 'admin' hay không
      if (checkAuth.type_user.level >= 1) {
        return true;
      }
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    } catch (error) {
      throw new HttpException(error.message || 'Lỗi không xác định', 400);
    }
  }
}
