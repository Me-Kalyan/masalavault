import Link from 'next/link';
import type { Recipe } from '@/types/recipe';
import { getRecipeSlug } from '@/lib/recipe-utils';

export default function RecipeTile({ recipe }: { recipe: Recipe }) {
  return (
    <Link href={`/recipe/${getRecipeSlug(recipe)}`} className="recipe-card" style={{ display: 'grid', gap: '.5rem' }}>
      <span className="badge">{recipe.course}</span>
      <h3 style={{ fontSize: '1.1rem' }}>{recipe.title}</h3>
      <p style={{ color: 'var(--muted)', fontSize: '.92rem' }}>{recipe.cuisine}</p>
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginTop: '.3rem' }}>
        <span className="badge">{recipe.time}</span>
        <span className="badge">{recipe.difficulty}</span>
      </div>
    </Link>
  );
}
