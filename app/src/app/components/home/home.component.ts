import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoadingComponent } from '../shared/loading/loading.component';
import { PokemonService } from '../../services/pokemon.service';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, LoadingComponent, SearchComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public loading: boolean = true;
  public pokemons: any[] = [];
  public page: number = 1;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.loadPokemons(this.page).subscribe((data: any) => {
      this.pokemons = data;
      this.loading = false;
    });
  }

  private loadPokemons(page: number) {
    return this.pokemonService.getAllPokemons(page);
  }

  public nextPage() {
    this.loading = true;
    this.page++;
    this.loadPokemons(this.page).subscribe((data: any) => {
      this.pokemons = [...this.pokemons, ...data];
      this.loading = false;
    });
  }
}
