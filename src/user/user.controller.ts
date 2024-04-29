import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseType } from 'src/interfaces/global.interface';
import { UserUpdateDto } from './dto/UserUpdate.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CustomJwtVerifyGuard } from 'src/guards/customJwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/guards/admin.guard';
import { UserDataDto } from './dto/NewUserData.dto';

@ApiBearerAuth()
@Controller('user')
@UseGuards(AuthGuard('jwt'))
@ApiTags('User Management')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/add-user')
  @ApiOperation({
    summary: 'Add User',
    description: 'Add User, need Admin permission',
  })
  @UseGuards(CustomJwtVerifyGuard, AdminGuard)
  @ApiHeader({ name: 'accessToken', required: true })
  @ApiBody({ type: UserDataDto })
  addUser(@Body() newUserData: UserDataDto): Promise<ResponseType> {
    return this.userService.addUser(newUserData);
  }

  @Get('/get-user-types')
  @ApiOperation({
    summary: 'Get List User Type',
  })
  getUserType(): Promise<ResponseType> {
    return this.userService.getUserTypes();
  }

  @Get('/get-users-pagination')
  @ApiOperation({
    summary: 'Get List Users',
    description: 'Get List Users pagination',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    description: 'Username or email, fullname',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Type ID of users',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Default: 1' })
  @ApiQuery({ name: 'limit', required: false, description: 'Default: 3' })
  getUsersPagination(
    @Query('keyword') keyword: string,
    @Query('type') typeID: string | number,
    @Query('page') page: string | number,
    @Query('limit') limit: string | number,
  ): Promise<ResponseType> {
    return this.userService.getUsersPagination(keyword, +typeID, +page, +limit);
  }

  @Get('/get-users')
  @ApiOperation({
    summary: 'Get List Users',
    description: 'Get List Users',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    description: 'Username or email, fullname',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Type ID of users',
  })
  getUsers(
    @Query('keyword') keyword: string,
    @Query('type') typeID: string | number,
  ): Promise<ResponseType> {
    return this.userService.getUsers(keyword, +typeID);
  }

  @Get('/find-users')
  @ApiOperation({
    summary: 'Get List Users by keyword',
    description: 'Get List Users pagination',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    description: 'Username or email',
    type: String,
  })
  @ApiQuery({
    name: 'fullName',
    required: false,
    description: 'Fullname',
    type: String,
  })
  @ApiQuery({
    name: 'phone',
    required: false,
    description: 'Phone number',
    type: String,
  })
  @ApiQuery({
    name: 'typeID',
    required: false,
    description: 'Type ID of users',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Default: 1' })
  @ApiQuery({ name: 'limit', required: false, description: 'Default: 3' })
  findUsers(
    @Query('keyword') keyword: string,
    @Query('fullName') fullName: string,
    @Query('phone') phone: string,
    @Query('typeID') typeID: string | number,
    @Query('page') page: string | number,
    @Query('limit') limit: string | number,
  ): Promise<ResponseType> {
    return this.userService.findUsers(
      keyword,
      fullName,
      phone,
      +typeID,
      +page,
      +limit,
    );
  }

  @Get('/get-user-info/:id')
  @ApiOperation({
    summary: 'Get User Information (Admin)',
    description: 'Get User Information by ID, need Admin permission',
  })
  @UseGuards(CustomJwtVerifyGuard, AdminGuard)
  @ApiHeader({ name: 'accessToken', required: true })
  getUserInfo(@Param('id') id: string): Promise<ResponseType> {
    return this.userService.getUserInfo(+id);
  }

  @Get('/get-account-info')
  @ApiOperation({
    summary: 'Get Account Information',
  })
  @ApiHeader({ name: 'accessToken', required: false })
  @UseGuards(CustomJwtVerifyGuard)
  getAccountInfo(@Req() request: any): Promise<ResponseType> {
    const { decodedAccessToken } = request;
    return this.userService.getAccountInfo(decodedAccessToken);
  }

  @Put('/update-account-info')
  @ApiOperation({
    summary: 'Update Account Information',
    description:
      "Updates the current user's account information. Fields that are not to be updated should be left blank.",
  })
  @ApiHeader({ name: 'accessToken', required: true })
  @ApiBody({
    type: UserUpdateDto,
    description:
      'For fields that you do not want to update, leave them blank. Exp : {email: "", password: "", fullName: "", age: "", avatar: ""}',
  })
  @UseGuards(CustomJwtVerifyGuard)
  updateAccountInfo(
    @Req() request: any,
    @Body() newUserData: UserUpdateDto,
  ): Promise<ResponseType> {
    const { decodedAccessToken } = request;
    return this.userService.updateAccountInfo(decodedAccessToken, newUserData);
  }

  @Put('/update-user-info/:id')
  @ApiOperation({
    summary: 'Update User Information (Admin)',
    description:
      "Administrators can update any user's information. Fields that are not to be updated should be left blank.",
  })
  @ApiHeader({ name: 'accessToken', required: true })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({
    type: UserUpdateDto,
    description:
      'For fields that you do not want to update, leave them blank. Exp : {email: "", password: "", fullName: "", age: "", avatar: ""}',
  })
  @UseGuards(CustomJwtVerifyGuard, AdminGuard)
  updateUser(
    @Param('id') userId: string,
    @Body() newUserData: UserUpdateDto,
  ): Promise<ResponseType> {
    return this.userService.UpdateUserInfo(+userId, newUserData);
  }

  @Delete('/delete-user/:id')
  @ApiOperation({
    summary: 'Delete User (Admin)',
    description: 'Delete User, need Admin permission',
  })
  @ApiHeader({ name: 'accessToken', required: true })
  @ApiParam({ name: 'id', description: 'User ID' })
  @UseGuards(CustomJwtVerifyGuard, AdminGuard)
  deleteUser(@Param('id') id: string): Promise<ResponseType> {
    return this.userService.deleteUser(+id);
  }
}
