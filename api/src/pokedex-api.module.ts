import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import { PokemonController } from './pokemon/pokemon.controller';
import { PokemonService } from './pokemon/pokemon.service';

import configuration from "./config/configuration";

@Module({
  imports: [
    CacheModule.register({
      ttl: 60 * 1000, // seconds
      max: 10,
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokedexApiModule {}
