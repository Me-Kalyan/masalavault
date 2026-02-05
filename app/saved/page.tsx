'use client';

import { useMemo, useState } from 'react';
import RecipeTile from '@/components/site/RecipeTile';
import { generateDatabase } from '@/lib/recipes';

const allRecipes = generateDatabase();

const getInitialSaved = (): number[] => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem('masalavault_saved_recipes');
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export default function SavedPage() {
  const [savedIds] = useState<number[]>(getInitialSaved);
  const recipes = useMemo(() => allRecipes.filter((r) => savedIds.includes(r.id)), [savedIds]);

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <div className="panel" style={{ display: 'grid', gap: '.5rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Saved Collection</h1>
        <p style={{ color: 'var(--muted)' }}>Lean view focused on items already pinned in your browser.</p>
      </div>
      {recipes.length ? (
        <div className="recipe-grid">{recipes.map((recipe) => <RecipeTile key={recipe.id} recipe={recipe} />)}</div>
      ) : (
        <div className="panel"><p style={{ color: 'var(--muted)' }}>No saved recipes yet.</p></div>
      )}
    </section>
  );
}
