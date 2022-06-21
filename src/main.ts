import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { UserService } from './user/user.service';
import MongoStore from 'connect-mongo';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(
    session({
      secret: 'my-secret',
      saveUninitialized: false,
      cookie: {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        sameSite: 'none'
      },
      store: MongoStore.create({ mongoUrl: 'mongodb://pascal-server:pascal-server@mongo:27017/pascal-server' })
    }),
  );

  passport.serializeUser((user, done) => {
    try {
      console.log(user);
      const userData = (user as any).toJSON();
      done(null, userData);
    } catch (err) {
      done(err);
    }
  });

  passport.deserializeUser(async (id: string, done) => {
    const userService = app.get(UserService);
    const user = await userService.findOne(id);
    console.log(id, user);
    if (user) {
      done(null, user);
    } else {
      done(new Error('Пользователь с таким id не найден'));
    }
  });



  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors({
    origin: ['http://localhost:4001'],
    credentials: true,
  });

  await app.listen(4000);
}
bootstrap();
