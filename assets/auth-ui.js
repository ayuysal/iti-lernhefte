/* ============================================================================
   iti-lernhefte · Cloud-Status in der Topbar
   ----------------------------------------------------------------------------
   Keine Anmeldung mehr: assets/sync.js gleicht automatisch mit dem festen
   Cloud-Datensatz ab. Dieser Knopf zeigt nur den Zustand an
   (☁ ✓ synchron · ☁ ⟳ läuft · ☁ ⚠ wird nachgeholt) und erlaubt „Jetzt abgleichen".
   ========================================================================= */
(function () {
  "use strict";
  var S = window.ITISync;
  if (!S || !S.status) return;

  var css = document.createElement("style");
  css.textContent =
    "#authBtn .ok{color:var(--accent);font-weight:800}#authBtn .warn{color:var(--mark);font-weight:800}#authBtn .spin{display:inline-block;animation:syncspin 1s linear infinite}" +
    "@keyframes syncspin{to{transform:rotate(360deg)}}" +
    ".sync-pop{position:fixed;z-index:210;display:none;width:min(20rem,calc(100vw - 24px));background:var(--paper-raised);color:var(--ink);border:1px solid var(--rule);border-radius:6px;box-shadow:0 14px 40px var(--shadow);padding:.9rem 1rem;font-family:var(--font-ui);font-size:.8rem;line-height:1.45}" +
    ".sync-pop.on{display:block}.sync-pop h4{margin:0 0 .35rem;font-size:.9rem}.sync-pop p{margin:.3rem 0}.sync-pop .st{font-weight:700}" +
    ".sync-pop button{margin-top:.55rem;font:650 .76rem var(--font-ui);padding:.4rem .7rem;border:1px solid var(--accent);border-radius:4px;background:var(--accent);color:var(--paper-raised);cursor:pointer}";
  document.head.appendChild(css);

  var mount = document.querySelector(".ctl") || document.body;
  var btn = document.createElement("button");
  btn.className = "btn"; btn.id = "authBtn"; btn.type = "button";
  mount.appendChild(btn);
  var pop = document.createElement("div"); pop.className = "sync-pop"; document.body.appendChild(pop);

  function ago(ms) {
    if (!ms) return "noch nie";
    var s = Math.round((Date.now() - ms) / 1000);
    if (s < 10) return "gerade eben"; if (s < 60) return "vor " + s + " s";
    var m = Math.round(s / 60); if (m < 60) return "vor " + m + " min";
    var h = Math.round(m / 60); return h < 24 ? "vor " + h + " h" : new Date(ms).toLocaleString("de-CH");
  }
  function info() {
    var x = S.status();
    if (x.mode === "locked") return { b: "☁ <span class='warn'>🔒</span>", t: "Nicht angemeldet.", warn: true };
    if (x.mode === "off") return { b: "☁ lokal", t: "Cloud nicht eingerichtet – Fortschritt nur auf diesem Gerät.", warn: true };
    if (x.mode === "sync") return { b: "☁ <span class='spin'>⟳</span>", t: "Abgleich mit der Cloud läuft …" };
    if (x.mode === "ok") return { b: "☁ <span class='ok'>✓</span>", t: "Synchron – alles ist in der Cloud (" + ago(x.last) + ")." };
    return { b: "☁ <span class='warn'>⚠</span>", t: (x.mode === "offline" ? "Offline" : "Cloud gerade nicht erreichbar") + (x.pending ? " – " + x.pending + " Änderung(en) werden automatisch nachgeholt." : "."), warn: true };
  }
  function render() {
    var i = info();
    btn.innerHTML = i.b; btn.title = i.t;
    if (pop.classList.contains("on")) { renderPop(); place(); }
  }
  function renderPop() {
    var i = info(), x = S.status();
    pop.innerHTML = "<h4>Cloud-Abgleich</h4><p class='st'>" + i.t + "</p>" +
      "<p>Automatisch auf allen Geräten, auf denen du einmal angemeldet bist. Jede Markierung geht sofort in die Cloud; beim Öffnen und alle 30 s wird abgeglichen. Einträge werden zusammengeführt, nie überschrieben.</p>" +
      "<p style='color:var(--ink-faint)'>Letzter Abgleich: " + ago(x.last) + (x.pending ? " · ausstehend: " + x.pending : "") + "</p>" +
      "<button type='button' id='syncNowBtn'>Jetzt abgleichen</button>" +
      (window.LHGate ? " <button type='button' id='logoutBtn' style='background:transparent;color:var(--ink-soft);border-color:var(--rule)'>Abmelden</button>" : "");
    pop.querySelector("#syncNowBtn").onclick = function () { S.syncNow(); };
    var lo = pop.querySelector("#logoutBtn");
    if (lo) lo.onclick = function () { if (confirm("Auf diesem Gerät abmelden? Dein Lernstand bleibt in der Cloud erhalten.")) window.LHGate.logout(); };
  }
  function place() {
    var r = btn.getBoundingClientRect();
    pop.style.top = Math.round(r.bottom + 8) + "px";
    pop.style.left = Math.max(12, Math.min(window.innerWidth - pop.offsetWidth - 12, Math.round(r.right - pop.offsetWidth))) + "px";
  }
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    pop.classList.toggle("on");
    if (pop.classList.contains("on")) { renderPop(); place(); requestAnimationFrame(place); }
  });
  document.addEventListener("click", function (e) { if (!pop.contains(e.target) && e.target !== btn) pop.classList.remove("on"); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") pop.classList.remove("on"); });
  window.addEventListener("resize", function () { if (pop.classList.contains("on")) place(); });
  S.onChange(render);
  setInterval(render, 15000);
  render();
})();
