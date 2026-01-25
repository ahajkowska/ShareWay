import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

function nestLogLevels(): LogLevel[] {
  switch (process.env.NODE_ENV) {
    case 'production':
      return ['log', 'error', 'warn'];
    default:
      return ['log', 'error', 'warn', 'debug', 'verbose'];
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: nestLogLevels(),
    rawBody: true,
  });

  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');

  // TODO: CHANGE ORIGIN FOR PRODUCTION NODE_ENV WHEN WE WOULD HAVE DEPLOYMENT
  const corsConf =
    process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'true'
      ? { origin: true, credentials: true }
      : { origin: false };

  app.enableCors(corsConf);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const PORT = process.env.API_PORT ?? 3000;
  await app.listen(PORT);

  Logger.log(`Server up on :${PORT} [${process.env.NODE_ENV}]`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
