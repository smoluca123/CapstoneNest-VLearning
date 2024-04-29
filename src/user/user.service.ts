import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DecodedAccecssTokenType,
  ResponseType,
} from 'src/interfaces/global.interface';
import { UserUpdateDto } from './dto/UserUpdate.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserDataDto } from './dto/NewUserData.dto';

@Injectable()
export class UserService {
  constructor(readonly prisma: PrismaService) {}

  async addUser(userData: UserDataDto): Promise<ResponseType> {
    try {
      const checkUser = await this.prisma.user.findFirst({
        where: {
          username: userData.username,
          hidden: 0,
        },
      });

      const checkEmail = await this.prisma.user.findFirst({
        where: {
          email: userData.email,
          hidden: 0,
        },
      });

      if (checkUser) throw new HttpException('Username is taken', 400);
      if (checkEmail) throw new HttpException('Email is taken', 400);

      const {
        email,
        fullName: full_name,
        password,
        phone,
        username,
        hidden,
        status,
        type,
      } = userData;
      const hashedPassword = await bcrypt.hash(password, 10);
      const { id: userId } = await this.prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          full_name,
          phone,
          hidden,
          status,
          type,
        },
      });

      const addedUser = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          type_user: true,
        },
      });

      /* eslint-disable @typescript-eslint/no-unused-vars */
      const {
        password: _pw,
        refresh_token,
        type: _type,
        type_user: { level, ...userType },
        ...resUser
      } = addedUser;
      /* eslint-enable @typescript-eslint/no-unused-vars */

      return {
        message: 'Add User Success',
        data: {
          ...resUser,
          userType,
        },
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }

  async updateAccountInfo(
    decodedAccessToken: DecodedAccecssTokenType,
    newUserData: UserUpdateDto,
  ): Promise<ResponseType> {
    try {
      const { id, username: _hUserName } = decodedAccessToken;
      const { email, username, password, fullName, phone } = newUserData;

      const checkUser = await this.prisma.user.findUnique({
        where: {
          id: +id,
          username: _hUserName,
          hidden: 0,
        },
      });

      if (!checkUser) throw new HttpException('User not found', 404);
      if (!checkUser.status)
        throw new ForbiddenException('User has been banned');

      //   Validate Email
      const emailRegex =
        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
      if (email && !emailRegex.test(email))
        throw new HttpException('Invalid email', 400);

      const hashPassword = password && bcrypt.hashSync(password, 10);

      const updatedUser = await this.prisma.user.update({
        data: {
          email: email || undefined,
          username: username || undefined,
          password: hashPassword || undefined,
          full_name: fullName || undefined,
          phone: phone || undefined,
        },
        where: {
          id: +id,
        },
        include: {
          type_user: true,
        },
      });

      /* eslint-disable @typescript-eslint/no-unused-vars*/
      const {
        password: _pw,
        refresh_token,
        type,
        type_user: { level, ...typeUserDetail },
        ...resUserData
      } = updatedUser;
      /* eslint-enable @typescript-eslint/no-unused-vars*/

      return {
        message: 'User updated successfully',
        data: { ...resUserData, userType: typeUserDetail },
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }

  async UpdateUserInfo(
    userId: number,
    newUserData: UserUpdateDto,
  ): Promise<ResponseType> {
    try {
      const { email, username, password, fullName, phone } = newUserData;

      const checkUser = await this.prisma.user.findUnique({
        where: {
          id: userId,
          hidden: 0,
        },
      });

      if (!checkUser) throw new HttpException('User not found', 404);
      if (!checkUser.status)
        throw new ForbiddenException('This user has been banned');

      //   Validate Email
      const emailRegex =
        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
      if (email && !emailRegex.test(email))
        throw new HttpException('Invalid email', 400);

      const hashPassword = password && bcrypt.hashSync(password, 10);

      const updatedUser = await this.prisma.user.update({
        data: {
          email: email || undefined,
          username: username || undefined,
          password: hashPassword || undefined,
          full_name: fullName || undefined,
          phone: phone || undefined,
        },
        where: {
          id: userId,
        },
        include: {
          type_user: true,
        },
      });

      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        password: _pw,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        refresh_token,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        type,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        type_user: { level, ...typeUserDetail },
        ...resUserData
      } = updatedUser;

      return {
        message: 'User updated successfully',
        data: { ...resUserData, userType: typeUserDetail },
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }

  async getUserTypes(): Promise<ResponseType> {
    try {
      const userTypeList = await this.prisma.type_user.findMany({
        select: {
          id: true,
          type_name: true,
        },
      });

      return {
        message: 'Fetch User Type successfully',
        data: userTypeList,
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }

  async getUsersPagination(
    keyword: string,
    typeID: number,
    page: number,
    limit: number,
  ): Promise<ResponseType> {
    try {
      keyword = keyword ? keyword : undefined;
      typeID = typeID ? typeID : undefined;
      page = page ? page : 1;
      limit = limit ? limit : 3;

      const whereQuery = {
        hidden: 0,
        type: typeID,
        AND: {
          OR: [
            {
              username: {
                contains: keyword,
              },
            },
            {
              email: {
                contains: keyword,
              },
            },
            {
              full_name: {
                contains: keyword,
              },
            },
          ],
        },
      };

      const { _count } = await this.prisma.user.aggregate({
        where: whereQuery,
        _count: true,
      });
      const totalItems = parseInt(_count.toString());
      const userList = await this.prisma.user.findMany({
        include: {
          type_user: {
            select: {
              id: true,
              type_name: true,
            },
          },
        },
        where: whereQuery,
        skip: (page - 1) * limit,
        take: limit,
      });

      const newArr = userList.map((user) => {
        const {
          /* eslint-disable @typescript-eslint/no-unused-vars */
          password: _pw,
          type,
          hidden,
          refresh_token,
          ...filltedUser
        } = user;
        return filltedUser;
        /* eslint-enable @typescript-eslint/no-unused-vars */
      });

      return {
        message: 'Fetch Users successfully',
        data: {
          currentPage: page,
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
          items: newArr,
        },
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }

  async getUsers(keyword: string, typeID: number): Promise<ResponseType> {
    try {
      keyword = keyword ? keyword : undefined;
      typeID = typeID ? typeID : undefined;

      const whereQuery = {
        hidden: 0,
        type: typeID,
        AND: {
          OR: [
            {
              username: {
                contains: keyword,
              },
            },
            {
              email: {
                contains: keyword,
              },
            },
            {
              full_name: {
                contains: keyword,
              },
            },
          ],
        },
      };

      const userList = await this.prisma.user.findMany({
        include: {
          type_user: {
            select: {
              id: true,
              type_name: true,
            },
          },
        },
        where: whereQuery,
      });

      const newArr = userList.map((user) => {
        const {
          /* eslint-disable @typescript-eslint/no-unused-vars */
          password: _pw,
          type,
          hidden,
          refresh_token,
          ...filltedUser
        } = user;
        return filltedUser;
        /* eslint-enable @typescript-eslint/no-unused-vars */
      });

      return {
        message: 'Fetch Users successfully',
        data: newArr,
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }

  async findUsers(
    keyword: string,
    full_name: string,
    phone: string,
    type: number,
    page: number,
    limit: number,
  ): Promise<ResponseType> {
    try {
      keyword = keyword ? keyword : undefined;
      full_name = full_name ? full_name : undefined;
      phone = phone ? phone : undefined;
      type = type ? type : undefined;
      page = page ? page : 1;
      limit = limit ? limit : 3;

      const whereQuery = {
        hidden: 0,
        type,
        AND: [
          {
            OR: [
              {
                username: {
                  contains: keyword,
                },
              },
              {
                email: {
                  contains: keyword,
                },
              },
            ],
          },
          {
            full_name: {
              contains: full_name,
            },
          },
          {
            phone: {
              contains: phone,
            },
          },
        ],
      };

      const { _count } = await this.prisma.user.aggregate({
        where: whereQuery,
        _count: true,
      });
      const totalItems = parseInt(_count.toString());
      const userList = await this.prisma.user.findMany({
        where: whereQuery,
        include: {
          type_user: {
            select: {
              id: true,
              type_name: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      // Clean data
      const newArr = userList.map((user) => {
        const {
          /* eslint-disable @typescript-eslint/no-unused-vars */
          password: _pw,
          type,
          hidden,
          refresh_token,
          ...filltedUser
        } = user;
        return filltedUser;
        /* eslint-enable @typescript-eslint/no-unused-vars */
      });

      return {
        message: 'Fetch Users successfully',
        data: {
          currentPage: page,
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
          items: newArr,
        },
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }

  async getUserInfo(id: number): Promise<ResponseType> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
        include: {
          type_user: {
            select: {
              id: true,
              type_name: true,
            },
          },
        },
      });

      if (!user) throw new NotFoundException('User not found');

      /* eslint-disable @typescript-eslint/no-unused-vars */
      const {
        password: _pw,
        type,
        hidden,
        refresh_token,
        ...filltedUser
      } = user;
      /* eslint-enable @typescript-eslint/no-unused-vars */

      return {
        message: 'Fetch User Info successfully',
        data: filltedUser,
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }

  async getAccountInfo(
    decodedAccessToken: DecodedAccecssTokenType,
  ): Promise<ResponseType> {
    try {
      const { id, username: _hUserName } = decodedAccessToken;

      const user = await this.prisma.user.findUnique({
        where: {
          id: +id,
          username: _hUserName,
          hidden: 0,
        },
        include: {
          type_user: {
            select: {
              id: true,
              type_name: true,
            },
          },
        },
      });

      if (!user.status) throw new ForbiddenException('User has been banned');

      /*eslint-disable @typescript-eslint/no-unused-vars */
      const {
        password: _pw,
        refresh_token,
        hidden,
        type,
        ...filltedUser
      } = user;
      /*eslint-enable @typescript-eslint/no-unused-vars */

      return {
        message: 'Fetch Account Info successfully',
        data: filltedUser,
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }

  async deleteUser(userId: number): Promise<ResponseType> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
          hidden: 0,
        },
      });

      if (!user) throw new NotFoundException('User not found');

      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          username: user.username + '_' + new Date().getTime(),
          hidden: 1,
        },
      });

      return {
        message: 'Delete User successfully',
        data: {},
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }
}
