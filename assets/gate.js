/* ============================================================================
   iti-lernhefte · Zugangssperre (einfache Sicherheitsstufe)
   ----------------------------------------------------------------------------
   • Einmal pro Gerät/Browser Benutzername + Passwort eingeben, danach bleibt
     man angemeldet (localStorage), bis man „Abmelden" wählt.
   • Das Passwort steht NICHT im Code: Aus Benutzername + Passwort wird per
     SHA-256 der Schlüssel des Cloud-Datensatzes berechnet (lh:code). Hier steht
     nur ein Prüfwert davon. Ohne die Zugangsdaten kennt man also weder den
     Datensatz noch kommt man an den Fortschritt.
   • Muss im <head> VOR allen anderen Skripten geladen werden.
   ========================================================================= */
(function () {
  "use strict";
  var CHECK = "9e8e5795ac333123";                         // sha256(code).slice(0,16)
  var LS = null; try { LS = window.localStorage; } catch (e) {}
  function g(k) { try { return LS ? LS.getItem(k) : null; } catch (e) { return null; } }
  function s(k, v) { try { if (LS) LS.setItem(k, v); } catch (e) {} }
  function r(k) { try { if (LS) LS.removeItem(k); } catch (e) {} }

  window.LHGate = {
    code: function () { return g("lh:ok") === CHECK ? g("lh:code") : null; },
    logout: function () { r("lh:code"); r("lh:ok"); location.reload(); }
  };
  if (window.LHGate.code()) return;                       // angemeldet → nichts tun, kein Flackern

  /* ---------- gesperrt: Inhalt verbergen, Anmeldefenster zeigen ---------- */
  var de = document.documentElement;
  de.classList.add("lh-locked");
  var st = document.createElement("style");
  st.textContent =
    "html.lh-locked body>*:not(#lhGate){visibility:hidden!important}" +
    "html.lh-locked body{overflow:hidden}" +
    "#lhGate{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;" +
      "background:var(--paper,#EFF2F0);font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:var(--ink,#17201D)}" +
    "#lhGate .card{width:min(360px,100%);background:var(--paper-raised,#F9FBFA);border:1px solid var(--rule,#CBD4D0);border-radius:8px;box-shadow:0 18px 50px rgba(0,0,0,.14);padding:1.6rem 1.5rem 1.3rem}" +
    "#lhGate .ey{font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;font-weight:800;color:var(--mark,#8E2436);margin:0 0 .4rem}" +
    "#lhGate h1{font-family:Charter,Georgia,serif;font-size:1.6rem;font-weight:600;margin:0 0 .3rem}" +
    "#lhGate p{font-size:.85rem;color:var(--ink-soft,#5A6663);margin:0 0 1rem;line-height:1.45}" +
    "#lhGate label{display:block;font-size:.72rem;font-weight:700;letter-spacing:.04em;color:var(--ink-soft,#5A6663);margin:.6rem 0 .25rem}" +
    "#lhGate input{width:100%;box-sizing:border-box;font-size:1rem;padding:.6rem .7rem;border:1px solid var(--rule,#CBD4D0);border-radius:5px;background:var(--paper,#fff);color:var(--ink,#17201D)}" +
    "#lhGate input:focus{outline:2px solid var(--accent,#0E5F63);outline-offset:1px}" +
    "#lhGate button{width:100%;margin-top:1rem;font-size:.95rem;font-weight:700;padding:.65rem;border:0;border-radius:5px;background:var(--accent,#0E5F63);color:#fff;cursor:pointer}" +
    "#lhGate .err{min-height:1.2em;font-size:.8rem;font-weight:650;color:var(--mark,#8E2436);margin:.6rem 0 0}" +
    "#lhGate .hint{font-size:.72rem;color:var(--ink-faint,#8A9490);margin:.8rem 0 0}";
  (document.head || de).appendChild(st);
  /* Dunkelmodus der Seite übernehmen, falls gesetzt */
  try { if (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches && !de.dataset.theme) de.dataset.theme = "dark"; } catch (e) {}

  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join(""); }
  function sha(t) { return crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)).then(hex); }

  function show() {
    if (document.getElementById("lhGate")) return;
    var w = document.createElement("div"); w.id = "lhGate";
    w.innerHTML = '<form class="card" autocomplete="on">' +
      '<p class="ey">WBH-Lernhefte</p><h1>Anmelden</h1>' +
      '<p>Einmal auf diesem Gerät anmelden – danach bleibst du angemeldet und dein Lernstand ist auf allen Geräten gleich.</p>' +
      '<label for="lhU">Benutzername</label><input id="lhU" name="username" autocomplete="username" autocapitalize="characters" spellcheck="false" required>' +
      '<label for="lhP">Passwort</label><input id="lhP" name="password" type="password" autocomplete="current-password" inputmode="numeric" required>' +
      '<button type="submit">Anmelden</button><p class="err" id="lhE"></p>' +
      '<p class="hint">Angemeldet bleiben ist automatisch aktiv. Abmelden über ☁ oben rechts.</p></form>';
    document.body.appendChild(w);
    var f = w.querySelector("form"), e = w.querySelector("#lhE");
    setTimeout(function () { var u = w.querySelector("#lhU"); if (u) u.focus(); }, 50);
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var u = (w.querySelector("#lhU").value || "").trim().toLowerCase(), p = (w.querySelector("#lhP").value || "").trim();
      if (!window.crypto || !crypto.subtle) { e.textContent = "Dieser Browser unterstützt die Anmeldung nicht (bitte über https öffnen)."; return; }
      e.textContent = "…";
      sha("iti-lernhefte|" + u + "|" + p).then(function (h) {
        var code = "lh-" + h.slice(0, 40);
        return sha(code).then(function (c) {
          if (c.slice(0, 16) !== CHECK) { e.textContent = "Benutzername oder Passwort stimmt nicht."; w.querySelector("#lhP").select(); return; }
          s("lh:code", code); s("lh:ok", CHECK);
          location.reload();
        });
      }, function () { e.textContent = "Anmeldung fehlgeschlagen."; });
    });
  }
  if (document.body) show(); else document.addEventListener("DOMContentLoaded", show);
})();
