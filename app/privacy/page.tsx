export default function PrivacyPage() {
  return (
    <section className="panel" style={{ display: 'grid', gap: '.7rem' }}>
      <h1 style={{ fontSize: '2rem' }}>Privacy Policy</h1>
      <p style={{ color: 'var(--muted)' }}>This rebuilt version stores only limited browser-side preferences such as saved recipes.</p>
      <p style={{ color: 'var(--muted)' }}>We do not process personal profiles or behavioral scoring inside this interface.</p>
    </section>
  );
}
