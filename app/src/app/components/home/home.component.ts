import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  pokemons: any[] = [];
  public page: number = 1;

  constructor(private pokemonService: PokemonService) {}

  loadPokemons(page: number) {
    return this.pokemonService.getAllPokemons(page);
  }

  ngOnInit() {
    this.loadPokemons(this.page).subscribe(
      (data: any) => (this.pokemons = data)
    );
  }

  nextPage() {
    this.page++;
    this.loadPokemons(this.page).subscribe((data: any) => {
      this.pokemons = [...this.pokemons, ...data];
    });
  }
}
