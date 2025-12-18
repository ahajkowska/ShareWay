import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';

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

  // ADD: Global API prefix for all routes
  app.setGlobalPrefix('api/v1');

  app.use(cookieParser());

  // CORS Configuration - handles both development and production
  const allowedOrigins =
    process.env.ALLOWED_ORIGINS?.split(',').map((o) => o.trim()) || [];

  const corsConf = {
    origin:
      process.env.NODE_ENV === 'production'
        ? (
            origin: string | undefined,
            callback: (err: Error | null, allow?: boolean) => void,
          ) => {
            if (!origin || allowedOrigins.includes(origin)) {
              callback(null, true);
            } else {
              callback(new Error('Not allowed by CORS'));
            }
          }
        : true,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  };

  app.enableCors(corsConf);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ADD: Global exception filter for consistent error format
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger API Documentation (only in development)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('ShareWay API')
      .setDescription(
        'API documentation for ShareWay trip planning application',
      )
      .setVersion('1.0')
      .addCookieAuth('access_token')
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management endpoints')
      .addTag('trips', 'Trip management endpoints')
      .addTag('planning', 'Trip planning (days/activities)')
      .addTag('finance', 'Expense and balance management')
      .addTag('engagement', 'Voting and checklists')
      .addTag('admin', 'Admin-only endpoints')
      .addTag('health', 'Health check endpoints')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    Logger.log('Swagger docs available at /api/docs');
  }

  const PORT = process.env.API_PORT ?? 3000;
  await app.listen(PORT);

  Logger.log(`Server up on :${PORT} [${process.env.NODE_ENV}]`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
