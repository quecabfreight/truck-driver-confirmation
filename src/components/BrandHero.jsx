export default function BrandHero({ compact = false }) {
  return (
    <section className={`hero${compact ? ' hero--compact' : ''}`}>
      <img
        className="hero__logo"
        src="/qc-logo.png"
        alt="QueCab AdbS — Secure Your Load"
        width="220"
        height="220"
        loading="eager"
        decoding="async"
      />
    </section>
  )
}
