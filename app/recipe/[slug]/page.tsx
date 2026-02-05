'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { generateDatabase } from '@/lib/recipes';
import { getRecipeBySlug } from '@/lib/recipe-utils';

const allRecipes = generateDatabase();

export default function RecipePage() {
  const params = useParams<{ slug: string }>();

  const recipe = useMemo(() => getRecipeBySlug(params.slug, allRecipes), [params.slug]);

  if (!recipe) {
    return (
      <section className="panel" style={{ display: 'grid', gap: '.7rem' }}>
        <h1>Recipe not found</h1>
        <Link href="/" className="nav-link" style={{ width: 'fit-content' }}>Back home</Link>
      </section>
    );
  }

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <article className="panel" style={{ display: 'grid', gap: '.9rem' }}>
        <span className="badge">{recipe.course} • {recipe.cuisine}</span>
        <h1 style={{ fontSize: '2rem' }}>{recipe.title}</h1>
        <p style={{ color: 'var(--muted)' }}>Time: {recipe.time} · Difficulty: {recipe.difficulty}</p>
      </article>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
        <article className="panel" style={{ display: 'grid', gap: '.6rem' }}>
          <h2>Ingredient Set</h2>
          {recipe.ingredients.map((item) => <p key={item} style={{ color: 'var(--muted)' }}>• {item}</p>)}
        </article>
        <article className="panel" style={{ display: 'grid', gap: '.6rem' }}>
          <h2>Cooking Runbook</h2>
          {recipe.instructions.map((step) => <p key={step} style={{ color: 'var(--muted)' }}>• {step}</p>)}
        </article>
      </div>
    </section>
  );
}
