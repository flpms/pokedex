export interface IPokemon {
  id: number;
  name: string;
  types: string[];
  mainType: string | null | undefined;
  image: string;
  height: number;
  stats: IStat[];
  weight: number;
}

interface IStat {
  name: string;
  value: number;
}
