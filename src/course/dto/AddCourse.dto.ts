import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CourseDataDto {
  @ApiProperty()
  @IsString()
  aliases: string;
  @ApiProperty()
  @IsString()
  courseName: string;
  @ApiProperty()
  @IsString()
  description: string;
  @ApiProperty()
  @IsNumber()
  category: number;
  @ApiProperty()
  @IsDateString()
  createAt: Date;
  @ApiProperty()
  @IsString()
  courseImg: string;
  @ApiProperty({ required: false, default: 0 })
  @IsNumber()
  views: number;
  @ApiProperty({ required: false, default: 0 })
  @IsNumber()
  hidden: number;
}
