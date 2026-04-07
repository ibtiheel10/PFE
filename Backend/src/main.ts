import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { AdminService } from './admin/admin.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global API prefix — all routes are under /api
  app.setGlobalPrefix('api');

  // Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

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
    origin: ['http://localhost:5173', 'http://localhost:3333'],
    credentials: true,
  });

  const port = process.env.PORT ?? 3333;

  // Auto-seed admin user
  try {
    const adminService = app.get(AdminService);
    await adminService.seedAdmin();
    console.log('✅ Admin user checked/seeded successfully');
  } catch (error) {
    console.error('❌ Failed to seed admin user:', error);
  }

  await app.listen(port);

  // Set timeout to 10 minutes (600,000 ms) for long-running LLM generation requests
  const server = app.getHttpServer();
  server.setTimeout(600000);
  server.keepAliveTimeout = 600000;
  server.headersTimeout = 600000;
  if ('requestTimeout' in server) {
    server.requestTimeout = 600000;
  }

  console.log(`🚀 SkillVia API is running on: http://localhost:${port}/api`);
}

bootstrap();
