<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>QueCab AdbS — Secure Your Load</title>
  <meta name="description" content="Verify USDOT#, plate, and driver contact before any freight is loaded. Stop double-brokering cold." />
  <link rel="icon" href="/qc-logo.png" />
  <style>
    /* ====== RESET (local only) ====== */
    *,*::before,*::after{box-sizing:border-box}
    html,body{height:100%}
    body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:#e9eef3;background:#0e1013}

    /* ====== THEME ====== */
    .bg{
      min-height:100dvh;
      background:
        radial-gradient(1200px 600px at 15% -10%, rgba(255,255,255,.22) 0%, rgba(255,255,255,0) 60%),
        radial-gradient(900px 420px at 95% 0%, rgba(0,255,162,.18) 0%, rgba(0,255,162,0) 55%),
        linear-gradient(135deg,#2b2e32 0%,#17191d 55%,#0e1013 100%);
      background-attachment:fixed;
      overflow-x:hidden;
      isolation:isolate;
    }
    .wrap{width:min(1280px,96vw);margin:0 auto;padding:28px 20px 80px}

    /* ====== HEADER ====== */
    header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:6px 0 20px}
    .brand{display:flex;align-items:center;gap:14px}
    .badge{
      width:56px;height:56px;border-radius:14px;flex:0 0 56px;
      background:
        radial-gradient(40% 40% at 30% 30%,#7d8792,#3c4249 45%,#1b1e22 80%),
        linear-gradient(160deg,#9aa2aa,#464b52 45%,#1c2024);
      box-shadow:inset 0 1px 0 rgba(255,255,255,.25),0 10px 32px rgba(0,0,0,.35);
    }
    .brand h1{margin:0;font-size:clamp(28px,4vw,42px);line-height:1.05}
    .brand small{display:block;color:#a8b3bf;font-weight:700;letter-spacing:.12em;margin-top:2px}
    nav a{
      color:#e9eef3;text-decoration:none;font-weight:700;border:1px solid rgba(255,255,255,.18);
      background:rgba(255,255,255,.04);padding:10px 12px;border-radius:10px;margin-left:6px;display:inline-block
    }
    nav a:hover{background:rgba(255,255,255,.08)}

    /* ====== HERO ====== */
    .hero{
      position:relative;border-radius:22px;overflow:hidden;
      border:1px solid rgba(255,255,255,.1);
      background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02));
      box-shadow:0 30px 90px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.12);
      padding:clamp(28px,6vw,56px)
    }
    .hero::after{
      content:"";position:absolute;inset:0;pointer-events:none;
      background:
        radial-gradient(500px 220px at 20% -5%, rgba(255,255,255,.22), transparent 60%),
        radial-gradient(700px 300px at 95% 0%, rgba(0,255,162,.15), transparent 60%);
    }
    .hero h2{margin:0 0 12px;font-size:clamp(42px,7vw,86px);line-height:.98;text-wrap:balance}
    .hero p{font-size:clamp(18px,2.2vw,24px);max-width:900px;margin:0}
    .cta{display:flex;gap:14px;flex-wrap:wrap;margin-top:22px}
    .btn{border:0;cursor:pointer;font-weight:900;letter-spacing:.02em;text-transform:uppercase;border-radius:14px;padding:16px 22px;transition:.15s ease;display:inline-block}
    .btn-primary{background:linear-gradient(180deg,#00ffa2,#39ffd3);color:#052017;box-shadow:0 12px 40px rgba(0,255,162,.35)}
    .btn-primary:hover{transform:translateY(-1px) scale(1.02);box-shadow:0 16px 56px rgba(0,255,162,.45)}
    .btn-ghost{background:rgba(255,255,255,.06);color:#e9eef3;border:1px solid rgba(255,255,255,.18)}
    .kpis{display:flex;gap:12px;flex-wrap:wrap;margin-top:18px}
    .kpi{border:1px solid rgba(255,255,255,.12);border-radius:12px;background:rgba(255,255,255,.04);padding:10px 12px;min-width:170px}
    .kpi b{font-size:22px;display:block}
    .kpi small{color:#a8b3bf;font-weight:700}

    /* ====== GRID SECTIONS ====== */
    .grid{display:grid;gap:22px;margin-top:32px;grid-template-columns:repeat(12,1fr)}
    .card{
      grid-column:span 12;
      background:rgba(10,12,14,.65);border:1px solid rgba(255,255,255,.1);
      border-radius:18px;padding:26px;box-shadow:0 20px 60px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.1)
    }
    .card h3{margin:0 0 8px;font-size:clamp(22px,3vw,32px);color:#0cf6a0}
    .card p{margin:0;font-size:clamp(16px,1.8vw,19px)}
    @media (min-width:800px){
      .third{grid-column:span 4}
      .half{grid-column:span 6}
    }

    /* ====== FOOTER ====== */
    footer{margin-top:56px;text-align:center;color:#a8b3bf}
    footer a{color:#e9eef3;text-decoration:none;border-bottom:1px dashed rgba(255,255,255,.25)}
  </style>
</head>
<body>
  <div class="bg">
    <div class="wrap">

      <header>
        <div class="brand">
          <div class="badge" aria-hidden="true"></div>
          <div>
            <h1>QueCab AdbS</h1>
            <small>SECURE YOUR LOAD</small>
          </div>
        </div>
        <nav>
          <a href="/#/join">Request Access</a>
          <a href="/#/login">Log In</a>
        </nav>
      </header>

      <section class="hero">
        <h2>Verify before you load.<br/>Stop double-brokering cold.</h2>
        <p>
          QueCab AdbS™ confirms <strong>USDOT#</strong>, <strong>Plate</strong>, and live driver contact
          before any freight is loaded. Built for docks of any size — big text, clean screens, no gimmicks —
          so your team knows exactly when to <strong>CLEAR TO LOAD</strong> or
          <strong style="color:#ff5555"> DO NOT LOAD</strong>.
        </p>
        <div class="cta">
          <a class="btn btn-primary" href="/#/join">Request Demo</a>
          <a class="btn btn-ghost" href="/#/login">Broker Log In</a>
        </div>
        <div class="kpis">
          <div class="kpi"><b>1 Link</b><small>Driver ➜ Dock</small></div>
          <div class="kpi"><b>3 Checks</b><small>USDOT • Plate • Live call</small></div>
          <div class="kpi"><b>0 Nonsense</b><small>No training required</small></div>
        </div>
      </section>

      <section class="grid">
        <article class="card third">
          <h3>① Broker creates Verify Link</h3>
          <p>One link per shipment. Share via text or email — done in seconds.</p>
        </article>
        <article class="card third">
          <h3>② Driver taps + shows IDs</h3>
          <p>Dock compares USDOT# + Plate on screen with what they see at the truck.</p>
        </article>
        <article class="card third">
          <h3>③ Dock calls the driver</h3>
          <p>If the driver answers and the data matches, it’s <b>CLEAR TO LOAD</b>. Any mismatch triggers a caution alert.</p>
        </article>
      </section>

      <section class="grid">
        <article class="card half">
          <h3>Built for real docks</h3>
          <p>Large typography, ultra-high contrast, and ruthless simplicity. No training required.</p>
        </article>
        <article class="card half">
          <h3>Anti-fraud by design</h3>
          <p>Real-time checks and a single source of truth prevent identity swaps and load hijacks.</p>
        </article>
        <article class="card third">
          <h3>Instant setup</h3>
          <p>No hardware. No IT ticket. Create links and ship.</p>
        </article>
        <article class="card third">
          <h3>Clear audit trail</h3>
          <p>Every verification writes a record for ops, claims, and compliance.</p>
        </article>
        <article class="card third">
          <h3>Light/Dark proof</h3>
          <p>Works indoors, outdoors, and in cabs without blasting eyes at night.</p>
        </article>
      </section>

      <section class="grid">
        <article class="card" style="text-align:center">
          <h3 style="font-size:clamp(26px,3.5vw,40px)">Ready to make “Verify before you load” your default?</h3>
          <div class="cta" style="justify-content:center;margin-top:12px">
            <a class="btn btn-primary" href="/#/join">Request Access</a>
            <a class="btn btn-ghost" href="/#/login">Broker Log In</a>
          </div>
        </article>
      </section>

      <footer>
        © <span id="y"></span> QueCab AdbS™ — Secure Your Load
      </footer>
    </div>
  </div>
  <script>document.getElementById("y").textContent=new Date().getFullYear();</script>
</body>
</html>
