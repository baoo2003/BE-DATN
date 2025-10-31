import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Xác định môi trường
  const isProd = process.env.NODE_ENV === 'production';
  const enableSwagger =
    (process.env.ENABLE_SWAGGER || '').toLowerCase() === 'true';

  // Tạo app với logger giới hạn khi production để giảm CPU/RAM
  const app = await NestFactory.create(AppModule, {
    logger: isProd
      ? ['error', 'warn', 'log']
      : ['debug', 'verbose', 'log', 'warn', 'error'],
  });

  // Giới hạn payload để tránh request quá lớn (giảm rủi ro crash)
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // Validation: loại bỏ field thừa, ép kiểu an toàn
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Swagger chỉ bật nếu cho phép qua biến môi trường
  if (enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle('News API')
      .setDescription('The news API description')
      .setVersion('1.0')
      .addTag('news')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    console.log('Swagger UI enabled at /api');
  } else {
    console.log('Swagger disabled (ENABLE_SWAGGER=false)');
  }

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, '0.0.0.0');
  console.log(`Server running on port ${port}`);
}
bootstrap();
