export default function AboutPage() {
  return (
    <section className="panel" style={{ display: 'grid', gap: '.9rem' }}>
      <span className="badge">New Design Manifest</span>
      <h1 style={{ fontSize: '2rem' }}>Why this rebuild exists</h1>
      <p style={{ color: 'var(--muted)' }}>
        The old interface stacked too many visual patterns. This rebuild swaps that for one strong system: spice-inspired neon accents, dense information cards,
        and direct route flows.
      </p>
      <p style={{ color: 'var(--muted)' }}>
        We intentionally removed ornamental features so core recipe discovery and reading stay obvious, fast, and expressive.
      </p>
    </section>
  );
}
