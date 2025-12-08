import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';

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

  // TODO: CHANGE ORIGIN FOR PRODUCTION NODE_ENV WHEN WE WOULD HAVE DEPLOYMENT
  const corsConf =
    process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'true'
      ? { origin: true }
      : { origin: false };

  app.enableCors({ corsConf });
  app.useGlobalPipes(new ValidationPipe());

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);

  Logger.log(`Server up on :${PORT} [${process.env.NODE_ENV}]`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
