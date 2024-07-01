import { Controller, Get, Logger } from "@nestjs/common";
import { Query } from "@nestjs/common";

import { IPokedex, IPokemonPage } from "../interfaces/pokedex.interfaces";
import { IListAllPaginationParams } from "../interfaces/endpoint.interfaces";
import { PokemonService } from "./pokemon.service";

@Controller("pokemon")
export class PokemonController {
  private readonly logger = new Logger(PokemonService.name);

  constructor(private pokemonService: PokemonService) {}

  @Get()
  async listAll(
    @Query() params: IListAllPaginationParams
  ): Promise<IPokemonPage[]> {
    this.logger.log(`PokemonController::listAll - ${params.page}`);

    const pokemonService: PokemonService = this.pokemonService;

    try {
      const items: number = parseInt(params.items) || 10;
      const page: number = parseInt(params.page);
      const offset = (page - 1) * items;

      const { results }: IPokedex = await pokemonService.getAll(
        items,
        offset
      );

      const gettingPokemonsByName = results.map((pokemon) =>
        pokemonService.getByName(pokemon.name)
      );

      const pokemonsByName = await Promise.all(gettingPokemonsByName);

      return pokemonsByName;
    } catch (error) {
      throw error;
    }
  }
}
