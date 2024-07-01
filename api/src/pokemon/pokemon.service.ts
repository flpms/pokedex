import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { IPokedex } from "../interfaces/pokedex.interfaces";

@Injectable()
export class PokemonService {
  private pokedexHost: string;
  private readonly logger = new Logger(PokemonService.name);

  constructor(private configService: ConfigService) {
    this.pokedexHost = configService.get("pokedex.host") || "";
  }

  request(method: string, path: string): Promise<any> {
    this.logger.verbose(`PokemonService::request - ${this.pokedexHost}${path}`);
    return fetch(`${this.pokedexHost}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getAll(limit: number, offset: number): Promise<IPokedex> {
    try {
      this.logger.log(`PokemonService::getAll - ${limit} - ${offset}`);
      const result = await this.request(
        "GET",
        `/pokemon?limit=${limit}&offset=${offset}`
      );

      if (!result.ok) {
        const errorMessage = await result.text();
        this.logger.error(`PokemonService::getAll - ${errorMessage}`);
        throw new Error(errorMessage);
      }

      return result.json();
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || 'Unknown error';
      this.logger.error(`PokemonService::getAll - ${errorMessage}`);
      throw error;
    }
  }

  async getByName(name: string): Promise<any> {
    try {
      this.logger.log(`PokemonService::getByName - ${name}`);
      const result = await this.request("GET", `/pokemon/${name}`);

      if (!result.ok) {
        const errorMessage = await result.text();
        this.logger.error(`PokemonService::getByName - ${errorMessage}`);
        throw new Error(errorMessage);
      }

      return result.json();
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || 'Unknown error';
      this.logger.error(`PokemonService::getByName - ${errorMessage}`);
      throw error;
    }
  }
}
