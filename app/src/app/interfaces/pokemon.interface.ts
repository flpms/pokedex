export interface IPokemon {
  id: number;
  name: string;
  types: string[];
  mainType: string | null | undefined;
  image: string;
  height: number;
  stats: IStat[];
  weight: number;
  favorite: boolean
}

interface IStat {
  name: string;
  value: number;
}
