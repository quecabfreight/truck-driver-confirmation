<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>QueCab AdbS — Secure Your Load</title>
<meta name="description" content="Verify the truck. Load the right freight. One link confirms USDOT#, plate, and live driver contact—built for docks of any size." />
<style>
:root{
  --bg:#0b0c0f;--panel:#12141a;--panel2:#161922;--text:#e8eef9;--muted:#a9b3c6;
  --accent:#2ee4a6;--warn:#ff5b5b;--border:#262a35;--shadow:0 10px 30px rgba(0,0,0,.45)
}
*{box-sizing:border-box}html,body{height:100%}body{margin:0;color:var(--text);background:var(--bg);
  font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,Inter,sans-serif}
a{color:var(--text);text-decoration:none}.container{width:min(1200px,92%);margin-inline:auto}
.section{padding:72px 0}.section__title{font-size:34px;margin:0 0 24px}
.btn{display:inline-flex;align-items:center;justify-content:center;padding:10px 14px;border-radius:10px;
  border:1px solid var(--border);font-weight:700;transition:.15s all ease}
.btn--ghost{background:transparent}.btn--secondary{background:var(--panel2)}
.btn--primary{background:var(--accent);color:#08130f;border-color:#1fc791}.btn--lg{padding:14px 18px;font-size:18px}
.btn--block{width:100%}.link{color:var(--accent)}.link:hover{text-decoration:underline}
.nav{position:sticky;top:0;z-index:50;background:rgba(11,12,15,.75);backdrop-filter:blur(8px) saturate(140%);
  border-bottom:1px solid var(--border)}
.nav__inner{display:flex;align-items:center;justify-content:space-between;height:64px}
.brand{display:flex;gap:10px;align-items:center;font-weight:800}
.brand__logo{width:28px;height:28px;border-radius:6px;background:#2b2f3a;display:grid;place-items:center;
  font-weight:900;color:var(--accent)}
.nav__links{display:flex;gap:16px;align-items:center}.nav__link{opacity:.9}.nav__link:hover{opacity:1}
.hero{position:relative;padding:120px 0 80px;border-bottom:1px solid var(--border)}
.hero__bg{position:absolute;inset:0;z-index:-1;
  background:
    radial-gradient(1000px 400px at 70% 30%, rgba(46,228,166,.10), transparent 60%),
    radial-gradient(900px 600px at 20% 100%, rgba(46,228,166,.08), transparent 60%),
    linear-gradient(135deg,#0e1015 0%,#12141a 40%,#0e1015 100%);
}
.hero__content{max-width:780px}.hero__badge{display:inline-block;background:var(--panel);padding:6px 10px;
  border-radius:999px;border:1px solid var(--border);font-size:12px;letter-spacing:.5px}
.hero__title{margin:14px 0 12px;font-size:44px;line-height:1.15}.accent{color:var(--accent)}
.hero__lead{color:var(--muted);max-width:700px}.hero__cta{display:flex;flex-wrap:wrap;gap:12px;margin:18px 0 8px}
.hero__pillars{display:flex;flex-wrap:wrap;gap:10px;color:var(--muted);padding:0;margin:14px 0 0;list-style:none}
.hero__pillars li{background:var(--panel);border:1px solid var(--border);padding:8px 10px;border-radius:10px}
.card{background:linear-gradient(180deg,var(--panel),var(--panel2));border:1px solid var(--border);
  border-radius:16px;padding:18px;box-shadow:var(--shadow)}
.grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-top:10px}
.step__num{width:32px;height:32px;border:1px solid var(--border);border-radius:8px;display:grid;place-items:center;
  background:var(--panel2);font-weight:800;color:var(--accent);margin-bottom:8px}
.callout{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}
.callout__pill{border:1px solid var(--border);padding:10px 12px;border-radius:12px}
.callout__pill.ok{background:rgba(46,228,166,.1);border-color:#1fc791}
.callout__pill.warn{background:rgba(255,91,91,.08);border-color:#ff7b7b;color:#ffd0d0}
.pricing{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-top:6px}
.price__amount{font-size:26px;margin:2px 0 10px}.price__amount span{font-size:36px}
.price__list{list-style:none;padding:0;margin:0 0 14px;color:var(--muted)}.price{position:relative}
.price--best{border-color:#1fc791;box-shadow:0 0 0 2px #1fc79122, var(--shadow)}
.price__badge{position:absolute;top:-12px;right:12px;background:var(--accent);color:#08130f;border-radius:999px;
  padding:6px 10px;font-size:12px;font-weight:800}
.faq{border:1px solid var(--border);border-radius:12px;padding:10px 14px;background:var(--panel);margin:10px 0}
.faq>summary{font-weight:700;cursor:pointer}.faq[open]{box-shadow:var(--shadow)}
.footer{border-top:1px solid var(--border);background:var(--panel)}
.footer__inner{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 0}
.footer__brand{display:flex;gap:12px;align-items:center}.footer__logo{width:34px;height:34px;border-radius:6px;background:#2b2f3a;display:grid;place-items:center;color:var(--accent);font-weight:900}
.footer__name{font-weight:800}.footer__tagline{color:var(--muted);font-size:14px}
.footer__links{display:flex;gap:14px;flex-wrap:wrap}.footer__links a{color:var(--muted)}.footer__links a:hover{color:var(--text)}
.footer__legal{color:var(--muted);font-size:13px;text-align:center;padding:10px 0;border-top:1px solid var(--border)}
@media(max-width:900px){.nav__links{display:none}.hero{padding:100px 0 60px}.hero__title{font-size:34px}
  .grid3,.steps,.pricing{grid-template-columns:1fr}.footer__inner{flex-direction:column;align-items:flex-start}}
</style>
</head>
<body>
<header class="nav">
  <div class="container nav__inner">
    <a class="brand" href="#top"><span class="brand__logo">QC</span><span>QueCab AdbS</span></a>
    <nav class="nav__links">
      <a href="#how" class="nav__link">How it works</a>
      <a href="#why" class="nav__link">Why us</a>
      <a href="#pricing" class="nav__link">Pricing</a>
      <a href="#faq" class="nav__link">FAQ</a>
      <a href="/login#/join" class="btn btn--ghost">Request Access</a>
      <a href="/login#/login" class="btn btn--primary">Log In</a>
    </nav>
  </div>
</header>

<section class="hero" id="top">
  <div class="hero__bg"></div>
  <div class="container hero__content">
    <div class="hero__badge">BROKER • SHIPPER • DOCK</div>
    <h1 class="hero__title">Verify before you load.<br><span class="accent">Stop double-brokering cold.</span></h1>
    <p class="hero__lead">
      One link confirms <strong>USDOT#</strong>, <strong>plate</strong>, and a <strong>live driver call</strong> — so your dock team sees a clean, simple CLEAR TO LOAD or DO NOT LOAD.
    </p>
    <div class="hero__cta">
      <a class="btn btn--primary btn--lg" href="/login#/join">Request Demo / Join</a>
      <a class="btn btn--secondary btn--lg" href="/login#/checkin">Generate Verify Link</a>
    </div>
    <ul class="hero__pillars">
      <li><strong>1 Link</strong> — Driver ➜ Dock</li>
      <li><strong>3 Checks</strong> — USDOT# • Plate • Live call</li>
      <li><strong>0 Nonsense</strong> — No training required</li>
    </ul>
  </div>
</section>

<section class="section" id="how">
  <div class="container">
    <h2 class="section__title">How it works</h2>
    <div class="steps">
      <div class="card"><div class="step__num">1</div><h3>Broker/shipper creates a link</h3><p>Generate an AdbS Truck-Driver Verify Link per shipment.</p><a href="/login#/checkin" class="link">Create a link →</a></div>
      <div class="card"><div class="step__num">2</div><h3>Driver taps the link</h3><p>They share <strong>USDOT#</strong> and <strong>plate</strong> from their phone.</p></div>
      <div class="card"><div class="step__num">3</div><h3>Dock verifies in seconds</h3><p>Dock calls driver, enters what they see, submits — gets a clear result.</p></div>
    </div>
    <div class="callout">
      <div class="callout__pill ok">All 3 checks “Yes” → <strong>CLEAR TO LOAD</strong></div>
      <div class="callout__pill warn">Any “No” → <strong>CAUTION ALERT — DO NOT LOAD</strong></div>
    </div>
  </div>
</section>

<section class="section" id="why">
  <div class="container">
    <h2 class="section__title">Why brokers & shippers pick QueCab</h2>
    <div class="grid3">
      <div class="card"><h3>Designed for docks</h3><p>Big text, clean screens, no gimmicks. Works in harsh lighting.</p></div>
      <div class="card"><h3>One link, one flow</h3><p>Driver & dock share the same verify link. Less confusion, faster turn.</p></div>
      <div class="card"><h3>Actionable result</h3><p>An unmissable signal: <strong>CLEAR TO LOAD</strong> or <strong>DO NOT LOAD</strong>.</p></div>
    </div>
  </div>
</section>

<section class="section" id="pricing">
  <div class="container">
    <h2 class="section__title">Straight-forward pricing</h2>
    <div class="pricing">
      <div class="card"><h3>Starter</h3><p class="price__amount">$<span>99</span>/mo</p>
        <ul class="price__list"><li>Up to 100 verify links</li><li>Email support</li><li>Basic reporting</li></ul>
        <a href="/login#/join" class="btn btn--secondary btn--block">Get Started</a></div>
      <div class="card price--best"><div class="price__badge">Most Popular</div><h3>Pro</h3><p class="price__amount">$<span>249</span>/mo</p>
        <ul class="price__list"><li>Up to 500 verify links</li><li>Priority support</li><li>Audit log & alerts</li></ul>
        <a href="/login#/join" class="btn btn--primary btn--block">Start Pro</a></div>
      <div class="card"><h3>Enterprise</h3><p class="price__amount">Let’s talk</p>
        <ul class="price__list"><li>Unlimited verify links</li><li>SOC2-ready options</li><li>Custom integrations</li></ul>
        <a href="/login#/join" class="btn btn--secondary btn--block">Talk to Sales</a></div>
    </div>
  </div>
</section>

<section class="section" id="faq">
  <div class="container">
    <h2 class="section__title">FAQ</h2>
    <details class="faq"><summary>Does the dock need training?</summary><p>No. Big-text, clean screens by design.</p></details>
    <details class="faq"><summary>What if the driver doesn’t answer?</summary><p>That’s a failed check → <strong>DO NOT LOAD</strong> and alert.</p></details>
    <details class="faq"><summary>Where do I manage my account?</summary><p>Use <a href="/login#/login">Log In</a>. Need access? <a href="/login#/join">Request Access</a>.</p></details>
  </div>
</section>

<footer class="footer">
  <div class="container footer__inner">
    <div class="footer__brand"><div class="footer__logo">QC</div><div><div class="footer__name">QueCab AdbS™</div><div class="footer__tagline">Secure Your Load</div></div></div>
    <nav class="footer__links"><a href="/login#/about">About</a><a href="#how">How it works</a><a href="#pricing">Pricing</a><a href="/login#/login">Log In</a></nav>
    <div class="footer__cta"><a class="btn btn--primary" href="/login#/join">Request Access</a></div>
  </div>
  <div class="footer__legal">© <span id="y"></span> QueCab AdbS. All rights reserved.</div>
</footer>
<script>document.getElementById('y').textContent=new Date().getFullYear()</script>
</body>
</html>
