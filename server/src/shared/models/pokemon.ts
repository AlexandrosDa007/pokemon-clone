import { ATTACKS } from '@shared/constants/attacks';

export type Attack = keyof typeof ATTACKS;
export interface Pokemon {
  id: string;
  name: string;
  maxHp: number;
  hp: number;
  moves: [Attack, Attack | null, Attack | null, Attack | null];
  pp: [number, number | null, number | null, number | null];
}
