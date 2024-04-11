import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty({ required: false })
  @IsString()
  email?: string;
  @ApiProperty({ required: false })
  @IsString()
  username?: string;
  @ApiProperty({ required: false })
  @IsString()
  password?: string;
  @ApiProperty({ required: false })
  @IsString()
  fullName?: string;
  @ApiProperty({ required: false })
  @IsString()
  phone?: string;
}
