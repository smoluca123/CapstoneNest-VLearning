/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { ResponseType } from 'src/interfaces/global.interface';
import { UserLoginDto } from './dto/UserLogin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRegisterDto } from './dto/UserRegister.dto';

@Injectable()
export class AuthService {
  constructor(
    readonly prisma: PrismaService,
    readonly jwt: JwtService,
  ) {}
  async login(userLoginData: UserLoginDto): Promise<ResponseType> {
    try {
      const { username, password } = userLoginData;
      const user = await this.prisma.user.findFirst({
        where: {
          username,
          hidden: 0,
        },
        include: {
          type_user: true,
        },
      });
      if (!user) throw new BadRequestException('Invalid username');
      if (!user.status)
        throw new ForbiddenException('This user has been banned');

      if (!bcrypt.compareSync(password, user.password))
        throw new BadRequestException('Invalid password');

      const key = new Date().getTime();
      const authToken = await this.jwt.signAsync({
        id: user.id,
        username: user.username,
        key,
      });
      const refreshToken = await this.jwt.signAsync(
        {
          id: user.id,
          username: user.username,
          key,
        },
        {
          expiresIn: '30d',
        },
      );
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          refresh_token: refreshToken,
        },
      });
      const {
        password: _pw,
        type,
        hidden,
        type_user: { level, ...type_detail },
        refresh_token,
        ...resUser
      } = user;

      return {
        message: 'Successful login',
        data: { ...resUser, userType: type_detail, accessToken: authToken },
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }

  async register(userRegisterData: UserRegisterDto): Promise<ResponseType> {
    try {
      const {
        email,
        username,
        fullName: full_name,
        phone,
        password,
      } = userRegisterData;

      const checkUser = await this.prisma.user.findFirst({
        where: {
          username,
        },
      });
      if (checkUser) throw new BadRequestException('Username already exists');

      const { id: userId } = await this.prisma.user.create({
        data: {
          email,
          username,
          full_name,
          phone,
          password: bcrypt.hashSync(password, 10),
        },
      });
      const user = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          type_user: true,
        },
      });

      const key = new Date().getTime();
      const accessToken = await this.jwt.signAsync({
        id: userId,
        username: user.username,
        key,
      });
      const {
        password: _pw,
        type,
        refresh_token,
        type_user: { level, ...type_detail },
        ...resUser
      } = user;

      return {
        message: 'Successful register',
        data: { ...resUser, userType: type_detail, accessToken },
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }
}
