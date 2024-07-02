import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonService } from '../../services/pokemon.service';
import { HomeComponent } from './home.component';

class PokemonServiceMock {
  getAllPokemons(page: number) {
    return [];
  }
};

describe('HomeComponent (class only)', () => {
  let component: HomeComponent;
  let pokemonService: PokemonService;
  let fixture: ComponentFixture<HomeComponent>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HomeComponent,
        {
          provide: PokemonService,
          useClass: PokemonServiceMock
        }
      ],
    });

    component = TestBed.inject(HomeComponent);
    pokemonService = TestBed.inject(PokemonService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
