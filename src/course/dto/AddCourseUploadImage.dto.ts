import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class AddCourseUploadDataDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  aliases: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  courseName: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
  @ApiProperty({ type: 'number' })
  @IsNotEmpty()
  category: number | string;
  @ApiProperty({ default: new Date() })
  @IsDateString()
  @IsNotEmpty()
  createAt: Date;
  @ApiProperty({
    type: 'file',
    format: 'binary',
    required: true,
    description: 'Max size : 5MB, Only Accept Image File',
  })
  courseImg: any;
  @ApiProperty({ type: 'number', required: false, default: 0 })
  @IsString()
  views: number | string;
  @ApiProperty({ type: 'number', required: false, default: 0 })
  @IsString()
  hidden: number | string;
}
