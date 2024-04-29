import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ApproveEnrollmentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  courseId: number;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
