'use client';

import { useMemo, useState } from 'react';
import { generateDatabase } from '@/lib/recipes';
import RecipeTile from '@/components/site/RecipeTile';

const allRecipes = generateDatabase();

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [course, setCourse] = useState('All');

  const courses = useMemo(() => ['All', ...Array.from(new Set(allRecipes.map((r) => r.course)))], []);
  const recipes = useMemo(() => {
    return allRecipes.filter((recipe) => {
      const passesCourse = course === 'All' || recipe.course === course;
      const q = query.trim().toLowerCase();
      const passesSearch = !q || recipe.title.toLowerCase().includes(q) || recipe.ingredients.some((i) => i.toLowerCase().includes(q));
      return passesCourse && passesSearch;
    });
  }, [query, course]);

  return (
    <div style={{ display: 'grid', gap: '1.2rem' }}>
      <section className="panel" style={{ display: 'grid', gap: '.9rem' }}>
        <span className="badge">Completely rebuilt experience</span>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)' }}>The Indian Spice Atlas</h1>
        <p style={{ color: 'var(--muted)', maxWidth: 700 }}>
          A ground-up redesign with punchy color contrasts, compact interaction patterns, and fast recipe exploration.
        </p>
        <div style={{ display: 'grid', gap: '.8rem', gridTemplateColumns: '2fr 1fr' }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or ingredient" />
          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            {courses.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </section>

      <section className="recipe-grid">
        {recipes.slice(0, 36).map((recipe) => <RecipeTile key={recipe.id} recipe={recipe} />)}
      </section>
    </div>
  );
}
