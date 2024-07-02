import {
  Controller,
  Get,
  Logger,
  UseInterceptors,
  Inject,
} from "@nestjs/common";
import {
  Cache,
  CACHE_MANAGER,
  CacheInterceptor,
} from "@nestjs/cache-manager";
import {
  Param,
  Query,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";

import {
  IPokedex,
  IPokemon,
  IPokemonPage,
  IPokemonPagesByName,
  IPokemonSearch,
} from "../interfaces/pokedex.interfaces";
import { IListAllPaginationParams } from "../interfaces/endpoint.interfaces";
import { PokemonService } from "./pokemon.service";

@Controller("pokemon")
export class PokemonController {
  private readonly logger = new Logger(PokemonService.name);
  private;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private pokemonService: PokemonService
  ) {}

  private imageUrl(pokemon): string {
    const image = pokemon?.sprites?.other?.home?.front_default;
    const imageUrl = image ? image : pokemon?.sprites?.front_default;
    return imageUrl;
  }

  private getTypes(types: any) {
    return types.map((t: any) => t.type.name);
  }

  private slicePokemonsPage(
    pokemons: Array<IPokemonPage>,
    page: number,
    items: number
  ) {
    const start = (page - 1) * items;
    const end = start + items;
    return pokemons.slice(start, end);
  }

  private createMapPokemonsByName(pokemons: Array<IPokemonPage>) {
    return pokemons.reduce((acc, pokemon) => {
      acc[pokemon.name] = pokemon;
      return acc;
    }, {});
  }

  // Cache pokemons by name to help on search
  private createPokemonCache(mapPokemonsByName: IPokemonPagesByName) {
    this.logger.log("PokemonController::createCache");
    this.cacheManager.set("pokemons", mapPokemonsByName);
  }

  private getAllPokemons(): Promise<IPokedex> {
    return this.pokemonService.getAll(1400, 0);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  async listAll(
    @Query() params: IListAllPaginationParams
  ): Promise<IPokemon[]> {
    this.logger.log(`PokemonController::listAll - page(${params.page})`);

    const pokemonService: PokemonService = this.pokemonService;

    try {
      const items: number = parseInt(params.items) || 10;
      const requestPage: number = parseInt(params.page);

      const { results } = await this.getAllPokemons();

      const gettingPokemonsByName = this.slicePokemonsPage(
        results,
        requestPage,
        items
      ).map((pokemon) => pokemonService.getByName(pokemon.name));

      this.createPokemonCache(this.createMapPokemonsByName(results));

      const pokemonsByName = await Promise.all(gettingPokemonsByName);

      const page: Array<IPokemon> = pokemonsByName.map(
        (pokemon): IPokemon => ({
          id: pokemon.id,
          name: pokemon.name,
          types: pokemon.types,
          image: this.imageUrl(pokemon),
          mainType: this.getTypes(pokemon.types)[0],
          height: null,
          stats: null,
          weight: null,
        })
      );

      return page;
    } catch (error) {
      this.logger.error(`PokemonController::ListAll:Exception - ${error}`);
      throw new ServiceUnavailableException();
    }
  }

  @Get("detail/:id")
  @UseInterceptors(CacheInterceptor)
  async getById(@Param("id") id: number): Promise<IPokemon> {
    this.logger.log(`PokemonController::getById - [${id}]`);

    const pokemonService: PokemonService = this.pokemonService;
    const pokemon = await pokemonService.getById(id);

    if (!pokemon) {
      this.logger.error(`PokemonController::getById - ${id} not found`);
      throw new NotFoundException();
    }

    return {
      height: pokemon.height,
      id: pokemon.id,
      image: this.imageUrl(pokemon),
      mainType: this.getTypes(pokemon.types)[0],
      name: pokemon.name,
      types: pokemon.types,
      stats: pokemon.stats,
      weight: pokemon.weight,
    };
  }

  @Get("search")
  @UseInterceptors(CacheInterceptor)
  async search(@Query("name") name: string): Promise<IPokemonSearch> {
    let pokemons = {} as IPokemonPagesByName;
    let keys: string[];
    const regex = new RegExp(name, "i");

    this.logger.log(`PokemonController::search - ${name}`);

    pokemons = await this.cacheManager.get("pokemons") || {};
    keys = Object.keys(pokemons);

    if (!keys[0]) {
      this.logger.log("PokemonController::search - cache not found");
      const { results } = await this.getAllPokemons();
      this.createPokemonCache(
        this.createMapPokemonsByName(results)
      );

      pokemons = await this.cacheManager.get("pokemons") || {};
      keys = Object.keys(pokemons);
    }

    const results = keys
      .filter(k => regex.test(k))
      .map(k => pokemons[k]);

    return {
      results,
      total: results.length,
    };
  }
}
