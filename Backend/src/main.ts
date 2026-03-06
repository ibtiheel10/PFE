import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global API prefix — all routes are under /api
  app.setGlobalPrefix('api');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('SkillVia API')
    .setDescription('The SkillVia Backend API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Auto-validate request bodies using class-validator DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // Strip unknown props
      forbidNonWhitelisted: false,
      transform: true,       // Auto-transform types (string → number etc.)
    }),
  );

  // CORS for Vue.js frontend
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 SkillVia API is running on: http://localhost:${port}/api`);
}

bootstrap();
