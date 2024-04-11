import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({ default: 'test1' })
  @IsNotEmpty()
  @IsString()
  username: string;
  @ApiProperty({ default: '123123' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
