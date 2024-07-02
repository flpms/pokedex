import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './pokedex-app.routes';
import { PokedexAppComponent } from "./pokedex-app.component";
import { PokemonService } from "./services/pokemon.service";


@NgModule({
  bootstrap: [PokedexAppComponent],
  declarations: [PokedexAppComponent],
  imports: [
    BrowserModule,
    RouterModule,
    RouterModule.forRoot(routes),
  ],
  providers: [provideHttpClient(withFetch()), PokemonService],
})
export class PokedexAppModule {}
