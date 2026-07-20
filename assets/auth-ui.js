/* ============================================================================
   iti-lernhefte · Login-Fenster (Cloud-Sync)
   ----------------------------------------------------------------------------
   Gemeinsames Auth-Widget für Hub + alle Hefte. Fügt einen Button in die
   Topbar (.ctl) ein und öffnet ein Modal:
     - abgemeldet:  E-Mail + Passwort (Anmelden / Konto anlegen) + Magic-Link
     - angemeldet:  Passwort festlegen (einmalig, dann ohne E-Mail) + Abmelden
   Nutzt window.ITISync (assets/sync.js). Die Sitzung bleibt gespeichert, ein
   erneutes E-Mail-Bestätigen ist nach dem Passwort-Setzen nicht mehr nötig.
   ========================================================================= */
(function () {
  "use strict";
  var S = window.ITISync;
  if (!S) return;

  /* ---------- Styles ---------- */
  var css = document.createElement("style");
  css.textContent =
    ".auth-ov{position:fixed;inset:0;z-index:200;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.45);padding:1rem}" +
    ".auth-ov.on{display:flex}" +
    ".auth-card{position:relative;background:var(--paper-raised);color:var(--ink);border:1px solid var(--rule);border-radius:6px;box-shadow:0 14px 44px var(--shadow);width:100%;max-width:22rem;padding:1.3rem 1.3rem 1.15rem;font-family:var(--font-ui)}" +
    ".auth-card h3{margin:0 0 .2rem;font-size:1.05rem;font-weight:750}" +
    ".auth-card .lead{font-size:.8rem;color:var(--ink-soft);margin:.1rem 0 .8rem}" +
    ".auth-x{position:absolute;top:.45rem;right:.55rem;background:none;border:0;font-size:1.35rem;line-height:1;color:var(--ink-faint);cursor:pointer;padding:.2rem}" +
    ".auth-x:hover{color:var(--mark)}" +
    ".auth-in{width:100%;font-family:var(--font-ui);font-size:.84rem;padding:.52rem .6rem;margin:.28rem 0;border:1px solid var(--rule);border-radius:3px;background:var(--paper);color:var(--ink)}" +
    ".auth-card .btn{display:block;width:100%;text-align:center;margin:.4rem 0 0;padding:.55rem;font-size:.8rem;font-weight:650}" +
    ".auth-primary{background:var(--accent);color:#fff;border-color:var(--accent)}" +
    "html[data-theme=\"dark\"] .auth-primary{color:#0c100e}" +
    ".auth-primary:hover{border-color:var(--accent);filter:brightness(1.08);color:#fff}" +
    "html[data-theme=\"dark\"] .auth-primary:hover{color:#0c100e}" +
    ".auth-secondary{background:var(--paper);color:var(--ink-soft)}" +
    ".auth-div{position:relative;text-align:center;font-size:.64rem;color:var(--ink-faint);letter-spacing:.1em;text-transform:uppercase;margin:.9rem 0 .1rem}" +
    ".auth-note{min-height:1.1em;margin:.7rem 0 0;font-size:.77rem;font-weight:600;line-height:1.4}" +
    ".auth-hint{font-size:.74rem;color:var(--ink-faint);margin:.55rem 0 .1rem}" +
    "#authBtn .dot{color:var(--accent);font-weight:800}";
  document.head.appendChild(css);

  /* ---------- Button in der Topbar ---------- */
  var mount = document.querySelector(".ctl") || document.body;
  var btn = document.createElement("button");
  btn.className = "btn"; btn.id = "authBtn"; btn.type = "button";
  mount.appendChild(btn);

  /* ---------- Modal ---------- */
  var ov = document.createElement("div"); ov.className = "auth-ov";
  var card = document.createElement("div"); card.className = "auth-card";
  ov.appendChild(card); document.body.appendChild(ov);
  ov.addEventListener("click", function (e) { if (e.target === ov) closeM(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeM(); });

  function openM() { renderCard(); ov.classList.add("on"); }
  function closeM() { ov.classList.remove("on"); }
  btn.addEventListener("click", openM);

  /* ---------- Helfer ---------- */
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function inp(type, ph, ac) { var i = el("input", "auth-in"); i.type = type; i.placeholder = ph; if (ac) i.autocomplete = ac; return i; }
  function errMsg(e) { return (e && e.message) ? e.message : "Es ist ein Fehler aufgetreten."; }
  function note(t, ok) { var n = card.querySelector(".auth-note"); if (n) { n.textContent = t; n.style.color = ok ? "var(--accent)" : "var(--mark)"; } }
  function validEmail(v) { return v && v.indexOf("@") > 0 && v.indexOf(".") > 0; }

  function renderBtn() {
    if (!S.isConfigured || !S.isConfigured()) { btn.innerHTML = "☁ Sync"; btn.title = "Cloud-Sync nicht konfiguriert"; return; }
    var u = S.getUser && S.getUser();
    btn.innerHTML = u ? "☁ <span class='dot'>✓</span>" : "☁ Anmelden";
    btn.title = u ? ("Cloud-Sync aktiv – angemeldet als " + u.email) : "Für geräteübergreifenden Sync anmelden";
  }

  function renderCard() {
    card.innerHTML = "";
    card.appendChild(el("h3", null, "Cloud-Sync"));
    var x = el("button", "auth-x", "×"); x.type = "button"; x.onclick = closeM; card.appendChild(x);

    if (!S.isConfigured || !S.isConfigured()) {
      card.appendChild(el("p", "lead", "Cloud-Sync ist nicht eingerichtet (assets/config.js). Dein Fortschritt wird weiterhin lokal gespeichert."));
      card.appendChild(el("p", "auth-note", "")); return;
    }

    var u = S.getUser && S.getUser();
    if (u) {
      var linfo = el("p", "lead");
      linfo.innerHTML = "Angemeldet als <strong>" + u.email + "</strong>. Dein Fortschritt wird geräteübergreifend synchronisiert.";
      card.appendChild(linfo);
      card.appendChild(el("p", "auth-hint", "Optional: Passwort festlegen, um dich künftig ohne E-Mail-Bestätigung anzumelden."));
      var pw = inp("password", "Neues Passwort (min. 6 Zeichen)", "new-password"); card.appendChild(pw);
      var setb = el("button", "btn auth-primary", "Passwort speichern"); setb.type = "button";
      setb.onclick = function () {
        if ((pw.value || "").length < 6) { note("Bitte mindestens 6 Zeichen.", false); return; }
        setb.disabled = true; note("…", true);
        S.setPassword(pw.value).then(function () { note("Passwort gespeichert. Ab jetzt E-Mail + Passwort – keine Bestätigung mehr nötig.", true); pw.value = ""; setb.disabled = false; })
          .catch(function (e) { note(errMsg(e), false); setb.disabled = false; });
      };
      card.appendChild(setb);
      var out = el("button", "btn auth-secondary", "Abmelden"); out.type = "button";
      out.onclick = function () { S.signOut(); closeM(); };
      card.appendChild(out);
      card.appendChild(el("p", "auth-note", ""));
      return;
    }

    /* abgemeldet */
    card.appendChild(el("p", "lead", "Melde dich an, damit dein Lesestand auf allen Geräten synchron ist."));
    var em = inp("email", "E-Mail-Adresse", "email");
    var pw2 = inp("password", "Passwort", "current-password");
    card.appendChild(em); card.appendChild(pw2);

    var inb = el("button", "btn auth-primary", "Anmelden"); inb.type = "button";
    inb.onclick = function () {
      if (!validEmail(em.value)) { note("Bitte eine gültige E-Mail eingeben.", false); em.focus(); return; }
      if (!pw2.value) { note("Bitte Passwort eingeben (oder unten Magic-Link nutzen).", false); return; }
      inb.disabled = true; note("…", true);
      S.signInPassword(em.value, pw2.value).then(function () { note("Angemeldet.", true); closeM(); })
        .catch(function (e) { note(errMsg(e) + " (Erstmalig? Nutze den Magic-Link unten und setze danach ein Passwort.)", false); inb.disabled = false; });
    };
    card.appendChild(inb);

    var upb = el("button", "btn auth-secondary", "Neues Konto anlegen"); upb.type = "button";
    upb.onclick = function () {
      if (!validEmail(em.value) || (pw2.value || "").length < 6) { note("E-Mail + Passwort (min. 6 Zeichen) eingeben.", false); return; }
      upb.disabled = true; note("…", true);
      S.signUpPassword(em.value, pw2.value).then(function (r) {
        if (r && r.data && r.data.session) { note("Konto angelegt und angemeldet.", true); closeM(); }
        else { note("Konto angelegt – bitte die E-Mail einmalig bestätigen, danach mit Passwort anmelden.", true); }
        upb.disabled = false;
      }).catch(function (e) { note(errMsg(e), false); upb.disabled = false; });
    };
    card.appendChild(upb);

    card.appendChild(el("div", "auth-div", "oder ohne Passwort"));
    var mlb = el("button", "btn auth-secondary", "Magic-Link per E-Mail senden"); mlb.type = "button";
    mlb.onclick = function () {
      if (!validEmail(em.value)) { note("Bitte eine gültige E-Mail eingeben.", false); em.focus(); return; }
      mlb.disabled = true; note("…", true);
      S.signIn(em.value).then(function () { note("Link gesendet – öffne deine E-Mail und klicke den Link.", true); })
        .catch(function (e) { note(errMsg(e), false); mlb.disabled = false; });
    };
    card.appendChild(mlb);
    card.appendChild(el("p", "auth-note", ""));
  }

  renderBtn();
  if (S.onChange) S.onChange(function () { renderBtn(); if (ov.classList.contains("on")) renderCard(); });
})();
