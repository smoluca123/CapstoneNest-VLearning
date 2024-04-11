import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserDataDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;
  @ApiProperty({
    name: 'type',
    required: false,
    default: 1,
    description: '1 : User, 2 : Admin',
  })
  @IsNumber()
  type?: number;
  @ApiProperty({
    name: 'status',
    required: false,
    default: 1,
    description: '0 : Banned, 1 : Active',
  })
  @IsNumber()
  status?: number;
  @ApiProperty({
    name: 'hidden',
    required: false,
    default: 0,
    description: '0 : Not Hidden, 1 : Hidden (like Deleted, not query to get)',
  })
  @IsNumber()
  hidden?: number;
}
