import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { PokemonService } from '../../services/pokemon.service';
import { SearchComponent } from './search.component';

class PokemonServiceMock {
  searchPokemon(id: number) {
    return jest.fn();
  }
};

describe('SearchComponent', () => {
  let component: SearchComponent;
  let pokemonService: PokemonService;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [SearchComponent, {
        provide: PokemonService,
        useClass: PokemonServiceMock,
      }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have searchResult as true', () => {
    expect(component.searchResult).toBeTruthy();
  });

  it('should have searchInput as instanceOf FormControl', () => {
    expect(component.searchInput).toBeInstanceOf(FormControl);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
