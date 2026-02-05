import { notFound } from 'next/navigation';
import { generateDatabase } from '@/lib/recipes';
import RecipeTile from '@/components/site/RecipeTile';

export default async function CategoryDetail({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const recipes = generateDatabase();
  const target = category.toLowerCase();
  const filtered = recipes.filter((recipe) => recipe.course.toLowerCase() === target);

  if (!filtered.length) {
    notFound();
  }

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <div className="panel" style={{ display: 'grid', gap: '.6rem' }}>
        <span className="badge">{filtered.length} total</span>
        <h1 style={{ textTransform: 'capitalize', fontSize: '2rem' }}>{category} recipes</h1>
      </div>
      <div className="recipe-grid">
        {filtered.map((recipe) => <RecipeTile key={recipe.id} recipe={recipe} />)}
      </div>
    </section>
  );
}
