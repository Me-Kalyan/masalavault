import Link from 'next/link';

const links = [
  ['Home', '/'],
  ['Categories', '/categories'],
  ['Saved', '/saved'],
  ['About', '/about'],
  ['Contact', '/contact'],
];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="site-shell" style={{ paddingTop: '1.2rem' }}>
        <div className="panel" style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontWeight: 800, letterSpacing: '.03em' }}>MASALAVAULT / REBUILT</Link>
          <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '.35rem' }}>
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="nav-link">{label}</Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="site-shell" style={{ padding: '1.3rem 0 2.5rem' }}>{children}</main>
      <footer className="site-shell" style={{ paddingBottom: '1.6rem' }}>
        <div className="panel" style={{ fontSize: '.9rem', color: 'var(--muted)', textAlign: 'center' }}>
          Built from scratch with a bold spice-map visual language.
        </div>
      </footer>
    </>
  );
}
