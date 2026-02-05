import Link from 'next/link';
import { generateDatabase } from '@/lib/recipes';

export default function CategoriesPage() {
  const recipes = generateDatabase();
  const grouped = recipes.reduce<Record<string, number>>((acc, recipe) => {
    acc[recipe.course] = (acc[recipe.course] || 0) + 1;
    return acc;
  }, {});

  return (
    <section className="panel" style={{ display: 'grid', gap: '1rem' }}>
      <h1 style={{ fontSize: '2rem' }}>Recipe Categories</h1>
      <p style={{ color: 'var(--muted)' }}>Browse by meal rhythm rather than traditional menu clutter.</p>
      <div className="recipe-grid">
        {Object.entries(grouped).map(([name, count]) => (
          <Link key={name} href={`/categories/${name.toLowerCase()}`} className="recipe-card" style={{ display: 'grid', gap: '.5rem' }}>
            <span className="badge">{count} recipes</span>
            <h2>{name}</h2>
            <p style={{ color: 'var(--muted)' }}>Explore focused selections for {name.toLowerCase()} moments.</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
