import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ActionUserToCourseDto {
  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
