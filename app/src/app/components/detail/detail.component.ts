import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPokemon } from './pokemon.interface';

import { PokemonService } from '../../services/pokemon.service';
import { LoadingComponent } from '../shared/loading/loading.component';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [LoadingComponent],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent {
  public loading: boolean = true;
  public selectedId: number = 0;
  public pokemon: IPokemon | null = null;

  constructor(
    private pokemonService: PokemonService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.selectedId = Number(this.route.snapshot.paramMap.get('id'));
    return this.pokemonService
      .getPokemonDetail(this.selectedId)
      .subscribe((data: any) => {

        this.pokemon = {
          ...data,
          height: this.getDecimal(data.height),
          stats: this.getStats(data.stats),
          weight: this.getDecimal(data.weight),
        };

        this.loading = false;
      });
  }

  private getStats(stats: Array<any>) {
    return stats.map((s: any) => ({
      value: s.base_stat,
      name: s.stat.name,
    }));
  }

  public goBack() {
    window.history.back();
  }

  public setFavorite() {
    this.pokemonService.setFavorite(this.selectedId);
  }

  public getDecimal(value: number) {
    return value / 10;
  }
}
