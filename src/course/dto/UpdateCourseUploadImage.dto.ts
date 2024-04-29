import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCourseUpLoadDataDto {
  @ApiProperty({ required: false })
  @IsString()
  aliases: string;
  @ApiProperty({ required: false })
  @IsString()
  courseName: string;
  @ApiProperty({ required: false })
  @IsString()
  description: string;
  @ApiProperty({ type: 'number', required: false, default: 0 })
  @IsString()
  category?: number | string;
  @ApiProperty({
    type: 'file',
    format: 'binary',
    required: true,
    description: 'Max size : 5MB, Only Accept Image File',
  })
  courseImg: any;
  @ApiProperty({ type: 'number', required: false, default: 0 })
  @IsString()
  views?: number | string;
  @ApiProperty({ type: 'number', required: false, default: 0 })
  @IsString()
  hidden?: number | string;
}
