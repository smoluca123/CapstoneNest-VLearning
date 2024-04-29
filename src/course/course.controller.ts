import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CourseService } from './course.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ResponseType } from 'src/interfaces/global.interface';
import { CourseDataDto } from './dto/AddCourse.dto';
import { CustomJwtVerifyGuard } from 'src/guards/customJwt.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { UpdateCourseDataDto } from './dto/UpdateCourse.dto';
import { ActionUserToCourseDto } from './dto/ActionUserToCourse.dto';
import { ApproveEnrollmentDto } from './dto/ApproveEnrollment.dto';
import { AddCourseUploadDataDto } from './dto/AddCourseUploadImage.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileIsImageValidationPipe } from 'src/pipes/ImageTypeValidator';
import { UpdateCourseUpLoadDataDto } from './dto/UpdateCourseUploadImage.dto';

@ApiBearerAuth()
@ApiTags('Course Management')
@UseGuards(AuthGuard('jwt'))
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('/add-course')
  @ApiOperation({
    summary: 'Add Course',
    description: 'Add Course, need Admin permission',
  })
  @UseGuards(CustomJwtVerifyGuard, AdminGuard)
  @ApiHeader({ name: 'accessToken', required: true })
  @ApiBody({ type: CourseDataDto })
  async addCourse(@Body() courseData: CourseDataDto): Promise<ResponseType> {
    return this.courseService.addCourse(courseData);
  }

  @Post('/add-course-upload-img')
  @ApiOperation({
    summary: 'Add Course',
    description: 'Add Course Upload Image, need Admin permission',
  })
  @UseGuards(CustomJwtVerifyGuard, AdminGuard)
  @ApiHeader({ name: 'accessToken', required: true })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: AddCourseUploadDataDto })
  @UseInterceptors(
    FileInterceptor('courseImg', {
      storage: diskStorage({
        destination: process.cwd() + '/public/img',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}_${file.originalname}`);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
      fileFilter(req, file, cb) {
        // /^.*\.(jpg|jpeg|png|gif|bmp|webp)$/i
        if (!file.mimetype.match('image/*')) {
          console.log('Cancel upload, file not support');
          // Block image upload in public/img folder
          cb(null, false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  // @UsePipes()
  async addCourseUploadImage(
    @UploadedFile(
      FileIsImageValidationPipe,
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
      }),
    )
    courseImg: Express.Multer.File,
    @Body() courseData: AddCourseUploadDataDto,
  ): Promise<ResponseType> {
    return this.courseService.addCourseUploadImage(courseData, courseImg);
  }

  @Post('/update-course-detail/:id')
  @ApiOperation({ summary: 'Update Course Detail (Admin)' })
  @UseGuards(CustomJwtVerifyGuard, AdminGuard)
  @ApiHeader({ name: 'accessToken', required: true })
  @ApiBody({
    type: UpdateCourseDataDto,
    description:
      'For fields that you do not want to update, leave them blank. Exp : {aliases: "", courseName: ""}',
  })
  @ApiParam({ name: 'id', required: true })
  updateCourseDetail(
    @Param('id') id: number | string,
    @Body() courseData: UpdateCourseDataDto,
  ): Promise<ResponseType> {
    return this.courseService.updateCourseDetail(+id, courseData);
  }

  @Post('/update-course-detail-upload/:id')
  @ApiOperation({ summary: 'Update Course Detail Upload Image (Admin)' })
  @UseGuards(CustomJwtVerifyGuard, AdminGuard)
  @ApiConsumes('multipart/form-data')
  @ApiHeader({ name: 'accessToken', required: true })
  @ApiBody({
    type: UpdateCourseUpLoadDataDto,
    description:
      'For fields that you do not want to update, leave them blank. Exp : {aliases: "", courseName: ""}',
  })
  @ApiParam({ name: 'id', required: true })
  @UseInterceptors(
    FileInterceptor('courseImg', {
      storage: diskStorage({
        destination: process.cwd() + '/public/img',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}_${file.originalname}`);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
      fileFilter(req, file, cb) {
        // /^.*\.(jpg|jpeg|png|gif|bmp|webp)$/i
        if (!file.mimetype.match('image/*')) {
          console.log('Cancel upload, file not support');
          // Block image upload in public/img folder
          cb(null, false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  updateCourseDetailUpload(
    @UploadedFile(
      FileIsImageValidationPipe,
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
      }),
    )
    courseImg: Express.Multer.File,
    @Param('id') id: number | string,
    @Body() courseData: UpdateCourseUpLoadDataDto,
  ): Promise<ResponseType> {
    return this.courseService.updateCourseDetailUpload(
      +id,
      courseData,
      courseImg,
    );
  }

  @Post('/enroll-course/:id')
  @ApiOperation({ summary: 'Enroll Course' })
  @UseGuards(CustomJwtVerifyGuard)
  @ApiHeader({ name: 'accessToken', required: true })
  @ApiParam({ name: 'id', required: true })
  enrollCourse(
    @Request() request: any,
    @Param('id') id: number | string,
  ): Promise<ResponseType> {
    const { decodedAccessToken } = request;
    return this.courseService.enrollCourse(+id, decodedAccessToken);
  }
  @Post('/unenroll-course/:id')
  @ApiOperation({ summary: 'Unenroll Course' })
  @UseGuards(CustomJwtVerifyGuard)
  @ApiHeader({ name: 'accessToken', required: true })
  @ApiParam({ name: 'id', required: true })
  unEnrollCourse(
    @Request() request: any,
    @Param('id') id: number | string,
  ): Promise<ResponseType> {
    const { decodedAccessToken } = request;
    return this.courseService.unEnrollCourse(+id, decodedAccessToken);
  }

  @Post('/add-user-to-course/:id')
  @ApiOperation({ summary: 'Add User To Course (Admin)' })
  @UseGuards(CustomJwtVerifyGuard, AdminGuard)
  @ApiBody({ type: ActionUserToCourseDto })
  @ApiHeader({ name: 'accessToken', required: true })
  @ApiParam({ name: 'id', required: true, description: 'Course ID' })
  addUserToCourse(
    @Param('id') courseId: string | number,
    @Body() payload: ActionUserToCourseDto,
  ): Promise<ResponseType> {
    return this.courseService.addUserToCourse(+courseId, payload);
  }

  @Post('/remove-user-from-course/:id')
  @ApiOperation({ summary: 'Remove User From Course (Admin)' })
  @UseGuards(CustomJwtVerifyGuard, AdminGuard)
  @ApiHeader({ name: 'accessToken', required: true })
  @ApiParam({ name: 'id', required: true, description: 'Course ID' })
  @ApiBody({ type: ActionUserToCourseDto })
  removeUserFromCourse(
    @Body() payload: ActionUserToCourseDto,
    @Param('id') courseId: string | number,
  ): Promise<ResponseType> {
    return this.courseService.removeUserFromCourse(+courseId, payload);
  }

  @Post('/approveEnrollment')
  @ApiOperation({ summary: 'Approve Enrollment (Admin)' })
  @UseGuards(CustomJwtVerifyGuard, AdminGuard)
  @ApiHeader({ name: 'accessToken', required: true })
  @ApiBody({ type: ApproveEnrollmentDto })
  approveEnrollment(
    @Body() payloadData: ApproveEnrollmentDto,
  ): Promise<ResponseType> {
    return this.courseService.approveEnrollment(payloadData);
  }

  @Get('/get-course-detail/:id')
  @ApiParam({ name: 'id', required: true })
  getCourseDetail(@Param('id') id: number | string): Promise<ResponseType> {
    return this.courseService.getCourseDetail(+id);
  }

  @Get('/get-category-course')
  @ApiOperation({ summary: 'Get Category Course List' })
  @ApiQuery({ name: 'categoryId', required: false })
  getCategoryCourse(
    @Query('categoryId') cateId: number | string,
  ): Promise<ResponseType> {
    return this.courseService.getCategoryCourse(+cateId);
  }

  @Get('/get-courses')
  @ApiOperation({ summary: 'Get Course List' })
  @ApiQuery({ name: 'courseName', required: false, type: String })
  @ApiQuery({
    name: 'categoryCourse',
    required: false,
    description: 'Category ID',
    type: Number,
  })
  getCourses(
    @Query('courseName') courseName: string,
    @Query('categoryCourse') cateId: number | string,
  ): Promise<ResponseType> {
    return this.courseService.getCourses(courseName, +cateId);
  }

  @Get('/get-courses-pagination')
  @ApiOperation({ summary: 'Get Course List Pagination' })
  @ApiQuery({ name: 'page', required: false, description: 'Default : 1' })
  @ApiQuery({ name: 'limit', required: false, description: 'Default : 3' })
  @ApiQuery({ name: 'courseName', required: false, type: String })
  @ApiQuery({ name: 'categoryCourse', required: false, type: Number })
  getCoursesPagination(
    @Query('page') page: number | string,
    @Query('limit') limit: number | string,
    @Query('courseName') courseName: string,
    @Query('categoryCourse') cateId: number | string,
  ): Promise<ResponseType> {
    return this.courseService.getCoursesPagination(
      +page,
      +limit,
      courseName,
      +cateId,
    );
  }

  @Get('/get-students-participated-course/:id')
  @UseGuards(CustomJwtVerifyGuard, AdminGuard)
  @ApiOperation({ summary: 'Get Students Participated Course (Admin)' })
  @ApiHeader({ name: 'accessToken', required: true })
  @ApiParam({ name: 'id', required: true, description: 'Course ID' })
  @ApiQuery({
    name: 'status',
    required: false,
    type: 'number',
    description: '0 : Pending (Default), 1 : Actived',
  })
  getStudentsParticipatedCourse(
    @Param('id') idCourse: string | number,
    @Query('status') status: number | string,
  ): Promise<ResponseType> {
    return this.courseService.getStudentsParticipatedCourse(+idCourse, +status);
  }

  @Get('/get-pending-courses/:id')
  @ApiOperation({ summary: 'Get Pending Courses by UserID (Admin)' })
  @UseGuards(CustomJwtVerifyGuard, AdminGuard)
  @ApiHeader({ name: 'accessToken', required: true })
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  getPendingCourses(
    @Param('id') userId: number | string,
  ): Promise<ResponseType> {
    return this.courseService.getPendingCourses(+userId);
  }

  @Get('/get-approve-courses/:id')
  @ApiOperation({ summary: 'Get Approve Courses by UserID (Admin)' })
  @UseGuards(CustomJwtVerifyGuard, AdminGuard)
  @ApiHeader({ name: 'accessToken', required: true })
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  getApproveCourses(
    @Param('id') userId: number | string,
  ): Promise<ResponseType> {
    return this.courseService.getApproveCourses(+userId);
  }

  @Delete('/delete-course/:id')
  @UseGuards(CustomJwtVerifyGuard, AdminGuard)
  @ApiOperation({ summary: 'Delete Course (Admin)' })
  @ApiHeader({ name: 'accessToken', required: true })
  @ApiParam({ name: 'id', required: true, description: 'Course ID' })
  deleteCourse(@Param('id') id: number | string): Promise<ResponseType> {
    return this.courseService.deleteCourse(+id);
  }
}
