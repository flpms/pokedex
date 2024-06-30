import { NestFactory } from '@nestjs/core';
import { PokedexApiModule } from './pokedex-api.module';

import configuration from "./config/configuration";

async function bootstrap() {
  const app = await NestFactory.create(PokedexApiModule, {
    logger: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose']
  });
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(configuration().port);
}

bootstrap();
