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

export interface IPokemonPagesByName {
  [key: string]: IPokemonPage;
}

export interface IPokemonSearch {
  results: IPokemonPage[];
  total: number;
}

export interface IPokemon {
  id: number;
  name: string;
  types: string[] | null | undefined;
  mainType: string | null | undefined;
  image: string;
  height: number | null | undefined;
  stats: IStat[] | null | undefined;
  weight: number | null | undefined;
}

interface IStat {
  name: string;
  value: number;
}
