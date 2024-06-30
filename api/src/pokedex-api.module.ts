import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { PokemonController } from './pokemon/pokemon.controller';
import { PokemonService } from './pokemon/pokemon.service';

import configuration from "./config/configuration";

@Module({
  imports: [ConfigModule.forRoot({
    load: [configuration],
  })],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokedexApiModule {}
