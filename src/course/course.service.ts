import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import {
  DecodedAccecssTokenType,
  ResponseType,
} from 'src/interfaces/global.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourseDataDto } from './dto/AddCourse.dto';
import { UpdateCourseDataDto } from './dto/UpdateCourse.dto';
import { ActionUserToCourseDto } from './dto/ActionUserToCourse.dto';
import { ApproveEnrollmentDto } from './dto/ApproveEnrollment.dto';
import { AddCourseUploadDataDto } from './dto/AddCourseUploadImage.dto';
import { UpdateCourseUpLoadDataDto } from './dto/UpdateCourseUploadImage.dto';
import * as fs from 'fs';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async addCourse(courseData: CourseDataDto): Promise<ResponseType> {
    const {
      courseName: course_name,
      description,
      aliases,
      category,
      courseImg: course_img,
      createAt: create_at,
      views,
      hidden,
    } = courseData;
    const checkCourse = await this.prisma.course.findFirst({
      where: {
        course_name,
        hidden: 0,
      },
    });
    const checkCategory = await this.prisma.category_course.findUnique({
      where: {
        id: category,
      },
    });

    if (checkCourse) throw new HttpException('Course name already exists', 400);
    if (!checkCategory) throw new NotFoundException('Category does not exist');
    if (checkCategory.hidden === 1)
      throw new HttpException('Category is hidden', 400);

    const { id } = await this.prisma.course.create({
      data: {
        course_name,
        description,
        category,
        create_at,
        course_img,
        aliases,
        views,
        hidden,
      },
    });

    const result = await this.prisma.course.findFirst({
      where: {
        id,
      },
      include: {
        category_course: true,
      },
    });

    try {
      return {
        message: 'Course added successfully',
        data: result,
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }

  async addCourseUploadImage(
    courseData: AddCourseUploadDataDto,
    courseImg: Express.Multer.File,
  ): Promise<ResponseType> {
    try {
      const {
        courseName: course_name,
        description,
        aliases,
        category,
        createAt: create_at,
        views,
        hidden,
      } = courseData;
      const checkCourse = await this.prisma.course.findFirst({
        where: {
          course_name,
          hidden: 0,
        },
      });
      const checkCategory = await this.prisma.category_course.findUnique({
        where: {
          id: +category,
        },
      });

      const listCheck = [+category, +hidden, +views];

      listCheck.map((item) => {
        if (!item && item != 0) {
          fs.rm(courseImg.path, (err) => {
            console.log(err);
          });
          throw new HttpException('Category, Hidden and Views is invalid', 400);
        }
      });

      if (checkCourse)
        throw new HttpException('Course name already exists', 400);
      if (!checkCategory)
        throw new NotFoundException('Category does not exist');
      if (checkCategory.hidden === 1)
        throw new HttpException('Category is hidden', 400);

      const createdCourse = await this.prisma.course.create({
        data: {
          course_name,
          description,
          category: +category,
          create_at,
          course_img: `/img/${courseImg.filename}`,
          aliases,
          views: +views,
          hidden: +hidden < 0 || +hidden > 1 ? 0 : +hidden,
        },
        include: {
          category_course: {
            select: {
              id: true,
              category_name: true,
            },
          },
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hidden: _hd, category: _cate, ...result } = createdCourse;
      return {
        message: 'Course added successfully',
        data: result,
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400);
    }
  }

  async updateCourseDetail(
    id: number,
    courseData: UpdateCourseDataDto,
  ): Promise<ResponseType> {
    if (!id) throw new NotFoundException('Coruse ID is required');

    const {
      aliases,
      courseName: course_name,
      description,
      category,
      courseImg: course_img,
      hidden,
      views,
    } = courseData;

    const checkCourse = await this.prisma.course.findFirst({
      where: {
        id,
      },
    });
    const checkCategory = await this.prisma.category_course.findUnique({
      where: {
        id: category,
      },
    });
    if (!checkCourse) throw new NotFoundException('Course does not exist');
    if (!checkCategory) throw new NotFoundException('Category does not exist');

    const updatedCourse = await this.prisma.course.update({
      where: {
        id,
      },
      data: {
        aliases: aliases || undefined,
        course_name: course_name || undefined,
        description: description || undefined,
        category: category || undefined,
        course_img: course_img || undefined,
        hidden: hidden < 0 || hidden > 1 ? 0 : hidden,
        views: views,
      },
      include: {
        category_course: {
          select: {
            id: true,
            category_name: true,
          },
        },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hidden: _hd, category: _cate, ...resultCourse } = updatedCourse;

    try {
      return {
        message: 'Course updated successfully',
        data: resultCourse,
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }

  async updateCourseDetailUpload(
    id: number,
    courseData: UpdateCourseUpLoadDataDto,
    courseImg: Express.Multer.File,
  ): Promise<ResponseType> {
    if (!id) throw new NotFoundException('Coruse ID is required');

    const {
      aliases,
      courseName: course_name,
      description,
      category,
      hidden,
      views,
    } = courseData;

    const listCheck = [+category, +hidden, +views];

    listCheck.map((item) => {
      if (!item && item != 0) {
        fs.rm(courseImg.path, (err) => {
          console.log(err);
        });
        throw new HttpException('Category, Hidden and Views is invalid', 400);
      }
    });

    const checkCourse = await this.prisma.course.findFirst({
      where: {
        id,
      },
    });
    const checkCategory = await this.prisma.category_course.findUnique({
      where: {
        id: +category,
      },
    });
    if (!checkCourse) throw new NotFoundException('Course does not exist');
    if (+category && !checkCategory) {
      throw new NotFoundException('Category does not exist');
    }

    const updatedCourse = await this.prisma.course.update({
      where: {
        id,
      },
      data: {
        aliases: aliases || undefined,
        course_name: course_name || undefined,
        description: description || undefined,
        category: +category || undefined,
        course_img: `/img/${courseImg.filename}` || undefined,
        hidden: +hidden < 0 || +hidden > 1 ? 0 : +hidden,
        views: +views,
      },
      include: {
        category_course: {
          select: {
            id: true,
            category_name: true,
          },
        },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hidden: _hd, category: _cate, ...resultCourse } = updatedCourse;

    try {
      return {
        message: 'Course updated successfully',
        data: resultCourse,
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }

  async enrollCourse(
    courseId: number,
    decodedAccessToken: DecodedAccecssTokenType,
  ): Promise<ResponseType> {
    try {
      const { id: userId } = decodedAccessToken;

      if (!courseId) throw new HttpException('Course ID is required', 400);

      const checkCourse = await this.prisma.course.findFirst({
        where: {
          id: courseId,
          hidden: 0,
        },
      });
      if (!checkCourse) throw new NotFoundException('Course does not exist');

      const checkEnroll = await this.prisma.enroll_course.findFirst({
        where: {
          user_id: +userId,
          course_id: courseId,
        },
      });
      if (checkEnroll) throw new HttpException('You already enrolled', 400);

      await this.prisma.enroll_course.create({
        data: {
          user_id: +userId,
          course_id: courseId,
          status: 0,
        },
      });
      // Does not optimize performance
      // const countEnrollTotal = await this.prisma.enroll_course.count({
      //   where: {
      //     course_id: courseId,
      //   },
      // });

      const updateCourse = await this.prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          students: {
            increment: 1,
          },
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hidden, category, ...result } = updateCourse;

      return {
        message: 'Successfully enrolled in the course',
        data: result,
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }

  async unEnrollCourse(
    courseId: number,
    decodedAccessToken: DecodedAccecssTokenType,
  ): Promise<ResponseType> {
    if (!courseId) throw new HttpException('Course ID is required', 400);

    const { id } = decodedAccessToken;

    const checkCourse = await this.prisma.course.findFirst({
      where: {
        id: courseId,
        hidden: 0,
      },
      include: {
        category_course: { select: { id: true, category_name: true } },
      },
    });
    const checkEnrolled = await this.prisma.enroll_course.findFirst({
      where: {
        user_id: +id,
        course_id: courseId,
      },
    });
    if (!checkCourse) throw new NotFoundException('Course does not exist');
    if (!checkEnrolled)
      throw new NotFoundException('You are not enrolled this course');

    await this.prisma.enroll_course.delete({
      where: {
        id: checkEnrolled.id,
        user_id: +id,
        course_id: courseId,
      },
    });

    const updatedCouse = await this.prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        students: {
          decrement: 1,
        },
      },
      include: {
        category_course: { select: { id: true, category_name: true } },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hidden, category, ...result } = updatedCouse;

    try {
      return {
        message: 'Successfully unenrolled from the course',
        data: result,
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }

  async addUserToCourse(
    courseId: number,
    bodyPayload: ActionUserToCourseDto,
  ): Promise<ResponseType> {
    try {
      if (!courseId) throw new HttpException('Course ID is required', 400);

      const { userId } = bodyPayload;
      const checkCourse = await this.prisma.course.findFirst({
        where: {
          id: courseId,
          hidden: 0,
        },
      });
      const checkUser = await this.prisma.user.findFirst({
        where: {
          id: userId,
          hidden: 0,
        },
        include: {
          type_user: {
            select: {
              id: true,
              type_name: true,
            },
          },
        },
      });
      const checkEnrolled = await this.prisma.enroll_course.findFirst({
        where: {
          user_id: userId,
          course_id: courseId,
        },
      });

      if (!checkCourse) throw new NotFoundException('Course does not exist');
      if (!checkUser) throw new NotFoundException('User does not exist');
      if (checkEnrolled)
        throw new HttpException('User are already enrolled', 400);

      await this.prisma.enroll_course.create({
        data: {
          user_id: userId,
          course_id: courseId,
          status: 1,
        },
      });

      const updatedCourse = await this.prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          students: {
            increment: 1,
          },
        },
        include: {
          category_course: { select: { id: true, category_name: true } },
        },
      });

      /* eslint-disable @typescript-eslint/no-unused-vars*/
      const { hidden, category, ...courseResult } = updatedCourse;
      const {
        hidden: __hd,
        type,
        password,
        refresh_token,
        ...userResult
      } = checkUser;
      /* eslint-enable @typescript-eslint/no-unused-vars */

      return {
        message: 'Successfully added user to the course',
        data: { user: userResult, course: courseResult },
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400);
    }
  }

  async removeUserFromCourse(
    courseId: number,
    bodyPayload: ActionUserToCourseDto,
  ): Promise<ResponseType> {
    try {
      if (!courseId) throw new HttpException('Course ID is required', 400);

      const { userId } = bodyPayload;

      const checkCourse = await this.prisma.course.findFirst({
        where: {
          id: courseId,
          hidden: 0,
        },
      });
      const checkUser = await this.prisma.user.findFirst({
        where: {
          id: userId,
          hidden: 0,
        },
        include: {
          type_user: {
            select: {
              id: true,
              type_name: true,
            },
          },
        },
      });
      const checkEnrolled = await this.prisma.enroll_course.findFirst({
        where: {
          user_id: userId,
          course_id: courseId,
        },
      });

      if (!checkCourse) throw new NotFoundException('Course does not exist');
      if (!checkUser) throw new NotFoundException('User does not exist');
      if (!checkEnrolled) throw new HttpException('User are not enrolled', 400);

      await this.prisma.enroll_course.delete({
        where: {
          id: checkEnrolled.id,
        },
      });

      const updatedCourse = await this.prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          students: {
            decrement: 1,
          },
        },
        include: {
          category_course: { select: { id: true, category_name: true } },
        },
      });

      /* eslint-disable @typescript-eslint/no-unused-vars */
      const { hidden: _hd, category, ...courseResult } = updatedCourse;
      const {
        hidden: __hd,
        type,
        password,
        refresh_token,
        ...userResult
      } = checkUser;
      /* eslint-enable @typescript-eslint/no-unused-vars */

      return {
        message: 'Successfully removed user from the course',
        data: {
          user: userResult,
          course: courseResult,
        },
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400);
    }
  }

  async approveEnrollment(
    payloadData: ApproveEnrollmentDto,
  ): Promise<ResponseType> {
    try {
      const { courseId, userId } = payloadData;
      const checkCourse = await this.prisma.course.findFirst({
        where: {
          id: courseId,
          hidden: 0,
        },
      });
      const checkUser = await this.prisma.user.findFirst({
        where: {
          id: userId,
          hidden: 0,
        },
      });
      const checkEnrolled = await this.prisma.enroll_course.findFirst({
        where: {
          user_id: userId,
          course_id: courseId,
        },
      });
      if (!checkCourse) throw new NotFoundException('Course does not exist');
      if (!checkUser) throw new NotFoundException('User does not exist');
      if (!checkEnrolled) throw new NotFoundException('User are not enrolled');

      const dataResult = await this.prisma.enroll_course.update({
        where: {
          id: checkEnrolled.id,
          user_id: userId,
          course_id: courseId,
        },
        data: {
          status: 1,
        },
        select: {
          id: true,
          status: true,
          course: {
            select: {
              id: true,
              aliases: true,
              course_name: true,
              course_img: true,
              description: true,
              students: true,
              views: true,
              create_at: true,
              category_course: {
                select: {
                  id: true,
                  category_name: true,
                },
              },
            },
          },
        },
      });

      return {
        message: 'Successfully approved enrollment',
        data: dataResult,
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400);
    }
  }

  async getCourseDetail(id: number): Promise<ResponseType> {
    try {
      if (!id) throw new HttpException('Id is required', 400);
      const checkCourse = await this.prisma.course.findFirst({
        where: {
          id,
          hidden: 0,
        },
        include: {
          category_course: {
            select: {
              id: true,
              category_name: true,
            },
          },
        },
      });

      if (!checkCourse) throw new NotFoundException('Course does not exist');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hidden, category, ...courseResult } = checkCourse;

      return {
        message: 'Course details',
        data: courseResult,
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }

  async getCategoryCourse(categoryId: number): Promise<ResponseType> {
    try {
      const categoryCourseList = await this.prisma.category_course.findMany({
        where: {
          id: categoryId || undefined,
          hidden: 0,
        },
        select: {
          id: true,
          category_name: true,
        },
      });

      return {
        message: 'Get Category Course Success',
        data: categoryCourseList,
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }

  async getCourses(
    courseName: string,
    categoryId: number,
  ): Promise<ResponseType> {
    try {
      const courseList = await this.prisma.course.findMany({
        where: {
          course_name: {
            contains: courseName || undefined,
          },
          category: categoryId || undefined,
          hidden: 0,
        },
        select: {
          id: true,
          course_name: true,
          description: true,
          course_img: true,
          aliases: true,
          students: true,
          views: true,
          create_at: true,

          category_course: {
            select: {
              id: true,
              category_name: true,
            },
          },
        },
      });

      return {
        message: 'Get Course Success',
        data: courseList,
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }

  async getCoursesPagination(
    page: number,
    limit: number,
    courseName: string,
    categoryId: number,
  ): Promise<ResponseType> {
    try {
      page = page || 1;
      limit = limit || 3;

      const whereQuery = {
        course_name: {
          contains: courseName || undefined,
        },
        category: categoryId || undefined,
        hidden: 0,
      };

      const { _count } = await this.prisma.course.aggregate({
        where: whereQuery,
        _count: true,
      });

      const totalItems = parseInt(_count.toString());

      const courseList = await this.prisma.course.findMany({
        where: whereQuery,
        select: {
          id: true,
          course_name: true,
          description: true,
          course_img: true,
          aliases: true,
          students: true,
          views: true,
          create_at: true,

          category_course: {
            select: {
              id: true,
              category_name: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        message: 'Get Course Success',
        data: {
          currentPage: page,
          totalPages: Math.ceil(totalItems / limit),
          totalItems: totalItems,
          items: courseList,
        },
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }

  async getStudentsParticipatedCourse(
    courseId: number,
    status: number,
  ): Promise<ResponseType> {
    try {
      if (!courseId) throw new HttpException('Course ID is required', 400);

      const checkCourse = await this.prisma.course.findFirst({
        where: {
          id: courseId,
        },
      });

      if (!checkCourse) throw new NotFoundException('Course does not exist');

      const courseData = await this.prisma.course.findFirst({
        where: {
          id: courseId,
        },
        include: {
          enroll_course: {
            select: {
              id: true,
              status: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                  full_name: true,
                  phone: true,
                  type_user: {
                    select: {
                      id: true,
                      type_name: true,
                    },
                  },
                  status: true,
                },
              },
            },
            where: {
              status: status > 0 && status < 2 ? status : 0,
            },
          },
        },
      });

      /* eslint-disable @typescript-eslint/no-unused-vars*/
      const {
        hidden,
        enroll_course: studentList,
        ...courseResult
      } = courseData;
      /* eslint-enable @typescript-eslint/no-unused-vars*/

      return {
        message: 'Get Students Participated Course Success',
        data: { ...courseResult, studentList },
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }

  async getPendingCourses(userId: number): Promise<ResponseType> {
    try {
      if (!userId) throw new HttpException('User ID is required', 400);

      const checkUser = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!checkUser) throw new NotFoundException('User does not exist');

      const courseList = await this.prisma.enroll_course.findMany({
        where: {
          user_id: userId,
          status: 0,
        },

        select: {
          id: true,
          status: true,
          course: {
            select: {
              id: true,
              course_name: true,
              description: true,
              course_img: true,
              aliases: true,
              students: true,
              views: true,
              create_at: true,

              category_course: {
                select: {
                  id: true,
                  category_name: true,
                },
              },
            },
          },
        },
      });
      return {
        message: 'Get Pending Courses Success',
        data: courseList,
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }

  async getApproveCourses(userId: number): Promise<ResponseType> {
    try {
      if (!userId) throw new HttpException('User ID is required', 400);

      const checkUser = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!checkUser) throw new NotFoundException('User does not exist');

      const courseList = await this.prisma.enroll_course.findMany({
        where: {
          user_id: userId,
          status: 1,
        },

        select: {
          id: true,
          status: true,
          course: {
            select: {
              id: true,
              course_name: true,
              description: true,
              course_img: true,
              aliases: true,
              students: true,
              views: true,
              create_at: true,

              category_course: {
                select: {
                  id: true,
                  category_name: true,
                },
              },
            },
          },
        },
      });
      return {
        message: 'Get Approve Courses Success',
        data: courseList,
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }

  async deleteCourse(courseId: number): Promise<ResponseType> {
    try {
      if (!courseId) throw new HttpException('Course ID is required', 400);

      const checkCourse = await this.prisma.course.findFirst({
        where: {
          id: courseId,
          hidden: 0,
        },
      });

      if (!checkCourse) throw new NotFoundException('Course does not exist');

      const checkEnrolled = await this.prisma.enroll_course.findFirst({
        where: {
          course_id: courseId,
        },
      });

      if (checkEnrolled)
        throw new HttpException(
          'The course cannot be deleted because the student is already enrolled',
          400,
        );

      await this.prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          hidden: 1,
          course_name: checkCourse.course_name + `_${new Date().getTime()}`,
          aliases: checkCourse.aliases + `_${new Date().getTime()}`,
        },
      });
      return {
        message: 'Delete Course Success',
        data: {},
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Undetermined error', 400, {});
    }
  }
}
