import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { winstonLogger } from './common/logger/winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonLogger),
  });

  const config = new DocumentBuilder()
    .setTitle('Swiss Stage API')
    .setDescription('Swiss Stage API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app as any, config);
  SwaggerModule.setup('api/docs', app as any, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
