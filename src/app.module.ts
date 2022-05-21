import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { SolutionModule } from './solution/solution.module';

@Module({
  imports: [MongooseModule.forRootAsync({
    imports: [ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development'],
    })],
    useFactory: async (configService: ConfigService) => {
      const uri = configService.get<string>('MONGODB_URI');
      console.log({ uri });
      return ({
        uri,
      });
    },
    inject: [ConfigService],
  }), TasksModule, SolutionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
