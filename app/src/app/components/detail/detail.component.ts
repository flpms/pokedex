import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { IPokemon } from '../../interfaces/pokemon.interface';

import { PokemonService } from '../../services/pokemon.service';
import { LoadingComponent } from '../shared/loading/loading.component';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [LoadingComponent, RouterModule, SearchComponent],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent {
  public loading: boolean = true;
  public selectedId: number = 0;
  public pokemon: IPokemon | null = null;

  constructor(
    private pokemonService: PokemonService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.selectedId = Number(this.route.snapshot.paramMap.get('id'));
      this.pokemonService
        .getPokemonDetail(this.selectedId)
        .subscribe((data: any) => {
          const checkFavorite = this.pokemonService.getFavorite(
            this.selectedId
          );

          this.pokemon = {
            ...data,
            height: this.getDecimal(data.height),
            stats: this.getStats(data.stats),
            weight: this.getDecimal(data.weight),
            favorite: !!checkFavorite,
          };

          this.loading = false;
        });
    });
  }

  private getStats(stats: Array<any>) {
    return stats.map((s: any) => ({
      value: s.base_stat,
      name: s.stat.name,
    }));
  }

  public goBack() {
    this.router.navigate(['/']);
  }

  public toogleFavorite() {
    if (this.pokemon === null) return;

    if (this.pokemon.favorite) {
      this.pokemonService.removeFavorite(this.selectedId);
      this.pokemon.favorite = false;
      return;
    }

    this.pokemonService.setFavorite(this.selectedId);
    this.pokemon.favorite = true;
  }

  public getDecimal(value: number) {
    return value / 10;
  }
}
