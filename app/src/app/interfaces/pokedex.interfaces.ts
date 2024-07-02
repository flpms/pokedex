export interface IPokemonPage {
  name: string;
  url: string;
  id: number | null | undefined;
}

export interface IPokemonSearch {
  results: IPokemonPage[];
  total: number;
}
