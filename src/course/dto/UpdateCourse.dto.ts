import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateCourseDataDto {
  @ApiProperty({ required: false })
  @IsString()
  aliases: string;
  @ApiProperty({ required: false })
  @IsString()
  courseName: string;
  @ApiProperty({ required: false })
  @IsString()
  description: string;
  @ApiProperty({ required: false })
  @IsNumber()
  category?: number;
  @ApiProperty({ required: false })
  courseImg?: string;
  @ApiProperty({ required: false })
  @IsNumber()
  views?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  hidden?: number;
}
