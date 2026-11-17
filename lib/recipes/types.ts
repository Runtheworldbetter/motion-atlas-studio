import type {SceneFactory} from '../motion/types';

export type RecipeId = 'trace' | 'waterfall' | 'code' | 'fourier' | 'pathfinding';
export interface RecipeExample {id: string; name: string; description: string; input: string; secondary?: string;}
export interface DataRow {label: string; value: string; detail?: string;}
export interface RecipeResult {factory: SceneFactory; title: string; summary: string; rows: DataRow[]; duration?: number;}
export interface RecipeDefinition {
  id: RecipeId;
  title: string;
  subtitle: string;
  description: string;
  inputLabel: string;
  secondaryLabel?: string;
  inputFormat: string;
  accept: string;
  color: string;
  examples: RecipeExample[];
  help: string;
  basis: string;
  compile: (input: string, secondary?: string) => RecipeResult;
}
