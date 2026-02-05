export default function ContactPage() {
  return (
    <section className="panel" style={{ display: 'grid', gap: '.8rem', maxWidth: 700 }}>
      <h1 style={{ fontSize: '2rem' }}>Contact</h1>
      <p style={{ color: 'var(--muted)' }}>Have ideas for new cuisine tracks or interaction polish? Drop a note.</p>
      <input placeholder="Name" />
      <input placeholder="Email" type="email" />
      <textarea placeholder="Message" rows={6} />
      <button type="button">Send message</button>
    </section>
  );
}
