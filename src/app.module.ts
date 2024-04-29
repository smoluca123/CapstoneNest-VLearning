import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './jwt/jwt-config.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthModule } from './auth/auth.module';
import { CustomJwtVerifyGuard } from './guards/customJwt.guard';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useClass: JwtConfigService,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 2000,
        limit: 10,
      },
    ]),
    PrismaModule,
    AuthModule,
    UserModule,
    CourseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    CustomJwtVerifyGuard,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
