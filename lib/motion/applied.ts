import {cricketRecipe} from '../recipes/cricket';
import {postTrainingRecipe} from '../recipes/post-training';
import type {RecipeDefinition, RecipeResult} from '../recipes/types';
import type {SceneFactory, SceneSpec} from './types';
import {P} from './shared';

// Gallery views and editable recipes share the same model and scene factory.
export const appliedRecipes: Record<string, RecipeDefinition> = {
  'cricket-coaching': cricketRecipe,
  'post-training-feedback': postTrainingRecipe,
};
export const appliedResults: Record<string, RecipeResult> = Object.fromEntries(
  Object.entries(appliedRecipes).map(([id, recipe]) => [id, recipe.compile(recipe.examples[0].input)]),
);
export const appliedSpecs: SceneSpec[] = [
  {
    id: 'cricket-coaching', title: 'The complete straight drive', category: 'Sports & coaching',
    description: 'Follow the whole stroke, switch between side and bowler views, and compare left- and right-handed batting with numbered bat imprints.',
    technique: 'Continuous stroke · two cameras · both hands · numbered bat imprints',
    tags: ['cricket', 'coaching', 'batting', 'biomechanics', 'recipe'], color: P.teal,
  },
  {
    id: 'post-training-feedback', title: 'What reward teaches the policy', category: 'Systems & AI',
    description: 'Run a small policy-gradient model. Change what earns a reward and watch the answer probabilities change.',
    technique: 'Computed policy updates · probability flow · reward comparison',
    tags: ['AI', 'reinforcement learning', 'post-training', 'reward', 'policy gradient', 'recipe'], color: P.purple,
  },
];
export const appliedScenes: Record<string, SceneFactory> = Object.fromEntries(
  Object.entries(appliedResults).map(([id, result]) => [id, result.factory]),
);
