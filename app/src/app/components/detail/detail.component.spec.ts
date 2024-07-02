
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { DetailComponent } from './detail.component';

class PokemonServiceMock {
  getPokemonDetail(id: number) {
    return [];
  }
};

class ActivatedRouteMock {};

describe('DetailComponent', () => {
  let component: DetailComponent;
  let pokemonService: PokemonService;
  let activatedRoute: ActivatedRouteMock;
  let fixture: ComponentFixture<DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DetailComponent, {
        provide: PokemonService,
        useClass: PokemonServiceMock,
      }, {
        provide: ActivatedRoute,
        useClass: ActivatedRouteMock,
      }],
    });

    component = TestBed.inject(DetailComponent);
    pokemonService = TestBed.inject(PokemonService);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have loading as true', () => {
    expect(component.loading).toBeTruthy();
  });

  it('should have pokemon as null', () => {
    expect(component.pokemon).toBeNull();
  });
});
