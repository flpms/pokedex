export interface IPokemonPage {
  name: string;
  url: string;
}

export interface IPokedex {
  count: number;
  next: string;
  previous: string[];
  results: IPokemonPage[];
};
