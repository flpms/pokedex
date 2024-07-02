import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { PokemonService } from '../../services/pokemon.service';
import {
  IPokemonPage,
  IPokemonSearch,
} from '../../interfaces/pokedex.interfaces';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  public searchResult: IPokemonPage[] = [];
  public searchInput = new FormControl('');

  constructor(
    private pokemonService: PokemonService,
    private router: Router,
  ) {}

  public searchPokemon() {
    const query = this.searchInput.value;

    if (query === '') {
      this.searchResult = [];
      return;
    }

    this.pokemonService
      .searchPokemon(query)
      .subscribe((data: IPokemonSearch) => {
        this.searchResult = data.results.slice(0, 20).map((pokemon) => {
          const pokemonIdPage = pokemon.url.split('/').filter(Boolean).pop();
          const id = parseInt(pokemonIdPage || '0');
          return {
            id,
            name: pokemon.name,
            url: pokemon.url,
          };
        });
      });
  }

  public navPokemonDetails(pokemonId: number) {
    this.router.navigate(['/detail', pokemonId]);
    this.clearSearch();
  }

  public clearSearch() {
    this.searchInput.setValue('');
    this.searchResult = [];
  }
}
