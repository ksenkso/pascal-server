import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { SolutionModule } from './solution/solution.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { CourseModule } from './course/course.module';
import { TaskSetModule } from './task-set/task-set.module';

@Module({
  imports: [MongooseModule.forRootAsync({
    imports: [ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}.local`, `.env.${process.env.NODE_ENV}`],
    })],
    useFactory: async (configService: ConfigService) => {
      const uri = configService.get<string>('MONGODB_URI');
      console.log({ uri });
      console.log(process.env.NODE_ENV);
      return ({
        uri,
      });
    },
    inject: [ConfigService],
  }), TasksModule, SolutionModule, AuthModule, UserModule, GroupModule, CourseModule, TaskSetModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
