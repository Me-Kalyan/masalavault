export default function HelpPage() {
  return (
    <section className="panel" style={{ display: 'grid', gap: '.9rem' }}>
      <h1 style={{ fontSize: '2rem' }}>Help Center</h1>
      <p style={{ color: 'var(--muted)' }}>Quick answers for navigating the rebuilt product.</p>
      <div className="recipe-grid">
        {[
          ['How do I find a recipe?', 'Use search on the home page and narrow by course.'],
          ['What happened to old features?', 'Heavy modules were intentionally removed to simplify the product.'],
          ['How do saved recipes work?', 'Saved entries are stored in your local browser only.'],
        ].map(([q, a]) => (
          <article key={q} className="recipe-card" style={{ display: 'grid', gap: '.5rem' }}>
            <h2 style={{ fontSize: '1.1rem' }}>{q}</h2>
            <p style={{ color: 'var(--muted)' }}>{a}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
