import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { FileTypeValidator } from '@nestjs/common';

@Injectable()
export class FileIsImageValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    const fileTypeValidator = new FileTypeValidator({ fileType: 'image/*' });

    if (!fileTypeValidator.isValid(file)) {
      throw new BadRequestException('Only image files are allowed');
    }

    return file;
  }
}
