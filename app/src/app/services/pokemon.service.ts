import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  IPokemonPage,
  IPokemonSearch,
} from '../interfaces/pokedex.interfaces';

@Injectable()
export class PokemonService {
  private host: string = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  public getAllPokemons(page: number = 1) {
    return this.http
      .get<IPokemonPage>(`${this.host}/pokemon?page=${page}`)
      .pipe(catchError(this.handleError<IPokemonPage>('getAllPokemons')));
  }

  public getPokemonDetail(id: number) {
    return this.http
      .get(`${this.host}/pokemon/detail/${id}`)
      .pipe(catchError(this.handleError('getPokemonDetail')));
  }

  public searchPokemon(name: string | null): Observable<IPokemonSearch> {
    return this.http
      .get<IPokemonSearch>(`${this.host}/pokemon/search?name=${name}`)
      .pipe(catchError(this.handleError<IPokemonSearch>('searchPokemon')));
  }

  public setFavorite(id: number) {
    window.localStorage.setItem(`pokemon-${id}`, 'true');
  }

  public getFavorite(id: number) {
    return window.localStorage.getItem(`pokemon-${id}`);
  }

  public removeFavorite(id: number) {
    window.localStorage.removeItem(`pokemon-${id}`);
  }
}
