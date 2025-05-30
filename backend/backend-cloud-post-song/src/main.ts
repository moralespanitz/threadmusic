import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('Post/Song API')   
  .setDescription('API para gestionar canciones y posts')   
  .setVersion('1.0')  
  .addTag('songs')  
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen('8001', '0.0.0.0');
  console.log(`API corriendo en http://localhost:$8001/api`);
}
bootstrap();
