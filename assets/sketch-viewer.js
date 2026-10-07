/* Skizzen-Großansicht (window.SketchViewer) – gemeinsam für Lernhefte und Übersichtsseite skizzen.html.
   Braucht: sketch-kit.js (window.SK), Skizzen-Dateien (window.ITI_SKETCHES), sketch-stats.js (window.SketchStats),
   optional sketch-relevanz.js (window.ITI_RELEVANZ = { id: "Begründung" }). */
(function(){
  "use strict";

  var HEFTE = [
    { fach: "WMAPS", fachName: "Weiterführende Mathematik", list: [
      ["mai06", "MAI06", "Vektoralgebra & Analytische Geometrie"], ["mai09", "MAI09", "Reihen & Integraltransformation"],
      ["mai11", "MAI11", "Stochastik II"], ["mai13", "MAI13", "Gewöhnliche Differenzialgleichungen"], ["mai14c", "MAI14C", "Numerische Methoden"] ] },
    { fach: "TGI", fachName: "Theoretische Grundlagen der Informatik", list: [
      ["gdi01", "GDI01", "Einführung in die Informatik"], ["tgi01", "TGI01", "Datenstrukturen und Algorithmen"],
      ["tgi02", "TGI02", "Algorithmen und Komplexität"], ["tgi06", "TGI06", "Formale Sprachen & Automaten 1"], ["tgi07", "TGI07", "Formale Sprachen & Automaten 2"] ] }
  ];
  function heftOf(id){ return id.split("-")[0]; }
  function heftInfo(code){
    for(var g = 0; g < HEFTE.length; g++) for(var i = 0; i < HEFTE[g].list.length; i++)
      if(HEFTE[g].list[i][0] === code) return { code: code, label: HEFTE[g].list[i][1], title: HEFTE[g].list[i][2], fach: HEFTE[g].fach, file: HEFTE[g].list[i][1] + "_Lernheft.html" };
    return { code: code, label: code.toUpperCase(), title: "", fach: "", file: code.toUpperCase() + "_Lernheft.html" };
  }

  var CSS = '' +
':root{--sk-3:#A86412;--sk-4:#5B4AA6;--sk-ok:#2E7D4F;--sk-ok-soft:#DCEFE3;--sk-fill:rgba(14,95,99,.10);--sk-fill2:rgba(142,36,54,.10)}' +
'html[data-theme="dark"]{--sk-3:#E2A65A;--sk-4:#AFA2F2;--sk-ok:#6BCB8B;--sk-ok-soft:#173222;--sk-fill:rgba(84,195,198,.14);--sk-fill2:rgba(227,130,148,.14)}' +
'button.sk{position:relative;display:inline-flex;align-items:center;justify-content:center;width:1.55em;height:1.35em;margin:0 .15em 0 .35em;padding:0;vertical-align:-.22em;' +
  'background:var(--paper-raised);color:var(--accent);border:1px solid var(--rule);border-radius:3px;cursor:pointer;font-size:1rem;line-height:1;transition:.15s;letter-spacing:0;text-transform:none}' +
'button.sk svg{width:1.05em;height:.95em;display:block}' +
'button.sk:hover,button.sk:focus-visible{background:var(--accent);color:var(--paper-raised);border-color:var(--accent);outline:none}' +
'button.sk.rel::after{content:"";position:absolute;top:-3px;right:-3px;width:7px;height:7px;background:var(--mark);transform:rotate(45deg);border:1px solid var(--paper-raised)}' +
'button.sk.seen{background:var(--accent-soft)}' +
'button.sk.st-u{border-color:var(--sk-3);color:var(--sk-3)}button.sk.st-v{border-color:var(--accent);border-width:2px}button.sk.st-s{border-color:var(--sk-ok);color:var(--sk-ok);background:var(--sk-ok-soft);border-width:2px}' +
'button.sk.flash{animation:skflash 1.2s ease 2}@keyframes skflash{50%{box-shadow:0 0 0 6px var(--mark-soft)}}' +
'.formula button.sk,td button.sk,.lbl button.sk{font-size:.9rem}' +
'.skm{position:fixed;inset:0;z-index:200;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(10,14,12,.55);backdrop-filter:blur(2px)}' +
'.skm.on{display:flex}' +
'.skm-p{background:var(--paper-raised);color:var(--ink);border:1px solid var(--rule);border-radius:6px;box-shadow:0 18px 50px var(--shadow);width:min(840px,100%);max-height:calc(100vh - 32px);display:flex;flex-direction:column;overflow:hidden;font-family:var(--font-body)}' +
'.skm-h{display:flex;align-items:flex-start;gap:.8rem;padding:.8rem 1rem .6rem;border-bottom:1px solid var(--rule-soft)}' +
'.skm-k{font-family:var(--font-ui);font-size:.62rem;font-weight:750;letter-spacing:.14em;text-transform:uppercase;color:var(--accent)}' +
'.skm-t{font-family:var(--font-ui);font-size:1.02rem;font-weight:700;margin-top:.15rem;line-height:1.3}' +
'.skm-rel{display:none;margin-top:.35rem;font-family:var(--font-ui);font-size:.72rem;font-weight:650;color:var(--mark);background:var(--mark-soft);border-radius:3px;padding:.22rem .5rem;line-height:1.35}' +
'.skm-rel.on{display:inline-block}' +
'.skm-x{margin-left:auto;flex:0 0 auto;font:600 1.3rem/1 var(--font-ui);width:2rem;height:2rem;border:1px solid var(--rule);border-radius:4px;background:var(--paper);color:var(--ink-soft);cursor:pointer}' +
'.skm-x:hover{color:var(--mark);border-color:var(--mark)}' +
'.skm-b{overflow:auto;padding:.6rem 1rem 1rem}' +
'.skm-svg{background:var(--paper);border:1px solid var(--rule-soft);border-radius:4px;padding:.4rem}' +
'.skm-svg svg{display:block;width:100%;height:auto;max-height:56vh}' +
'.skm-c{font-size:.92rem;line-height:1.55;margin:.75rem 0 0;color:var(--ink)}' +
'.skm-c b{color:var(--accent)}' +
'.skm-st{display:flex;flex-wrap:wrap;align-items:center;gap:.4rem .5rem;padding:.55rem 1rem;border-top:1px solid var(--rule-soft);font-family:var(--font-ui);font-size:.74rem;color:var(--ink-soft)}' +
'.skm-st .lab{font-weight:700;color:var(--ink-faint);letter-spacing:.06em;text-transform:uppercase;font-size:.62rem}' +
'.skm-st button{font:650 .76rem var(--font-ui);padding:.36rem .65rem;border:1px solid var(--rule);border-radius:999px;background:var(--paper);color:var(--ink-soft);cursor:pointer}' +
'.skm-st button[data-st="u"].on{border-color:var(--sk-3);color:var(--sk-3);background:color-mix(in srgb,var(--sk-3) 14%,transparent)}' +
'.skm-st button[data-st="v"].on{border-color:var(--accent);color:var(--accent);background:var(--accent-soft)}' +
'.skm-st button[data-st="s"].on{border-color:var(--sk-ok);color:var(--sk-ok);background:var(--sk-ok-soft)}' +
'.skm-st button:hover{border-color:var(--accent)}' +
'.skm-seen{margin-left:auto;color:var(--ink-faint);white-space:nowrap}' +
'.skm-f{display:flex;align-items:center;gap:.5rem;padding:.55rem 1rem;border-top:1px solid var(--rule-soft);font-family:var(--font-ui);font-size:.72rem;color:var(--ink-faint)}' +
'.skm-f button,.skm-f a{font:650 .76rem var(--font-ui);padding:.38rem .7rem;border:1px solid var(--rule);border-radius:4px;background:var(--paper);color:var(--ink);cursor:pointer;text-decoration:none}' +
'.skm-f button:hover,.skm-f a:hover{border-color:var(--accent);color:var(--accent)}' +
'.skm-f .sp{flex:1 1 auto;text-align:center}' +
'@media (max-width:560px){.skm{padding:8px}.skm-f .sp{display:none}.skm-f{justify-content:space-between}.skm-seen{margin-left:0;width:100%}}';

  var ICON = '<svg viewBox="0 0 20 18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 16 L17 16"/><path d="M2 16 L2 2"/><path d="M3 15 L13 5"/><path d="M13 5 l-4 .4 M13 5 l-.4 4"/><path d="M7 15 a4.5 4.5 0 0 0 -1.4 -3.2"/></svg>';

  function esc(s){ return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function rel(id){ return (window.ITI_RELEVANZ || {})[id]; }
  function fmtDur(sec){ if(!sec) return "0 s"; if(sec < 60) return sec + " s"; var m = Math.round(sec / 60); return m < 60 ? m + " min" : (Math.floor(m / 60) + " h " + (m % 60) + " min"); }
  function fmtWhen(ms){
    if(!ms) return "";
    var d = new Date(ms), now = new Date(), day = 864e5;
    var a = new Date(d.getFullYear(), d.getMonth(), d.getDate()), b = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var diff = Math.round((b - a) / day), hm = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    if(diff === 0) return "heute " + hm; if(diff === 1) return "gestern " + hm; if(diff < 7) return "vor " + diff + " Tagen";
    return d.toLocaleDateString("de-CH");
  }

  var ov = null, list = [], cur = 0, opener = null, shownAt = 0, shownId = null, opts = {};

  function ensureCss(){
    if(document.getElementById("sk-css")) return;
    var st = document.createElement("style"); st.id = "sk-css"; st.textContent = CSS; document.head.appendChild(st);
  }

  function build(){
    if(ov) return;
    ensureCss();
    ov = document.createElement("div");
    ov.className = "skm"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-labelledby", "skmT");
    ov.innerHTML = '<div class="skm-p"><div class="skm-h"><div><div class="skm-k" id="skmK"></div><div class="skm-t" id="skmT"></div><div class="skm-rel" id="skmR"></div></div>' +
      '<button class="skm-x" type="button" aria-label="Schließen">×</button></div>' +
      '<div class="skm-b"><div class="skm-svg" id="skmS"></div><p class="skm-c" id="skmC"></p></div>' +
      '<div class="skm-st"><span class="lab">Mein Stand</span>' +
        '<button type="button" data-st="u" title="Taste 1">? unklar</button><button type="button" data-st="v" title="Taste 2">✓ verstanden</button><button type="button" data-st="s" title="Taste 3 – kann ich selbst skizzieren">✓✓ sitzt</button>' +
        '<span class="skm-seen" id="skmV"></span></div>' +
      '<div class="skm-f"><button type="button" data-d="-1">‹ Vorherige</button><span class="sp" id="skmHint">Pfeiltasten blättern · 1/2/3 Stand · Esc schließt</span>' +
      '<a id="skmHeft" href="#" style="display:none">↗ im Heft</a><button type="button" data-d="1">Nächste ›</button></div></div>';
    document.body.appendChild(ov);
    ov.addEventListener("click", function(e){
      if(e.target === ov || e.target.closest(".skm-x")) return close();
      var nb = e.target.closest("[data-d]"); if(nb) return show(cur + Number(nb.getAttribute("data-d")));
      var sb = e.target.closest("[data-st]"); if(sb) toggleStatus(sb.getAttribute("data-st"));
    });
    document.addEventListener("keydown", function(e){
      if(!ov.classList.contains("on")) return;
      if(e.key === "Escape"){ e.preventDefault(); close(); }
      else if(e.key === "ArrowRight"){ e.preventDefault(); show(cur + 1); }
      else if(e.key === "ArrowLeft"){ e.preventDefault(); show(cur - 1); }
      else if(e.key === "1" || e.key === "2" || e.key === "3"){ e.preventDefault(); toggleStatus({ "1": "u", "2": "v", "3": "s" }[e.key]); }
    });
    document.addEventListener("visibilitychange", function(){
      if(!ov.classList.contains("on")) return;
      if(document.hidden) finish(); else { shownAt = Date.now(); shownId = list[cur]; }
    });
    window.addEventListener("pagehide", finish);
    if(window.SketchStats) window.SketchStats.onChange(function(){ if(ov.classList.contains("on")) paintState(); });
  }

  /* Verweildauer der gerade gezeigten Skizze abschließen → zählt ab MIN_MS als ein Aufruf */
  function finish(){
    if(shownId && shownAt && window.SketchStats){
      var ms = Date.now() - shownAt;
      if(ms >= window.SketchStats.MIN_MS) window.SketchStats.view(shownId, ms / 1000);
    }
    shownId = null; shownAt = 0;
  }

  function toggleStatus(st){
    if(!window.SketchStats) return;
    var id = list[cur], now = window.SketchStats.get().s[id];
    window.SketchStats.status(id, now === st ? null : st);
  }

  function paintState(){
    var id = list[cur], S = window.SketchStats ? window.SketchStats.get() : { v: {}, s: {} };
    var st = S.s[id], v = S.v[id];
    Array.prototype.forEach.call(ov.querySelectorAll("[data-st]"), function(b){ b.classList.toggle("on", b.getAttribute("data-st") === st); });
    document.getElementById("skmV").textContent = v ? ("angesehen " + v[0] + "× · " + fmtDur(v[1]) + " · zuletzt " + fmtWhen(v[2])) : "noch nicht angesehen (zählt nach 2 s)";
    if(opts.onState) opts.onState(id);
  }

  function show(i){
    finish();
    cur = (i + list.length) % list.length;
    var id = list[cur], d = (window.ITI_SKETCHES || {})[id];
    if(!d) return;
    var h = heftInfo(heftOf(id)), r = rel(id);
    document.getElementById("skmK").textContent = "Skizze " + (cur + 1) + " / " + list.length + (opts.showHeft ? " · " + h.label : "");
    document.getElementById("skmT").textContent = d.t;
    var rb = document.getElementById("skmR");
    rb.classList.toggle("on", !!r); rb.textContent = r ? "◆ prüfungsrelevant – " + r : "";
    document.getElementById("skmS").innerHTML = typeof d.svg === "function" ? d.svg(window.SK) : d.svg;
    document.getElementById("skmC").innerHTML = d.c || "";
    var hl = document.getElementById("skmHeft");
    if(opts.showHeft){ hl.style.display = ""; hl.href = h.file + "#sk=" + encodeURIComponent(id); } else hl.style.display = "none";
    paintState();
    shownId = id; shownAt = Date.now();
  }

  function open(ids, index, btn, o){
    build();
    list = ids; opts = o || {}; opener = btn || null;
    ov.classList.add("on");
    show(index || 0);
    ov.querySelector(".skm-x").focus();
  }
  function close(){
    finish();
    ov.classList.remove("on");
    if(opts.onClose) opts.onClose();
    if(opener && opener.focus) opener.focus();
  }

  /* ---------- Im Lernheft: Marker → Icon-Buttons ---------- */
  function decorate(){
    var S = window.SketchStats ? window.SketchStats.get() : { v: {}, s: {} };
    Array.prototype.forEach.call(document.querySelectorAll("button.sk[data-sk]"), function(b){
      var id = b.getAttribute("data-sk"), st = S.s[id];
      b.classList.toggle("rel", !!rel(id));
      b.classList.toggle("seen", !!S.v[id]);
      ["u", "v", "s"].forEach(function(k){ b.classList.toggle("st-" + k, st === k); });
    });
  }

  function initHeft(){
    ensureCss();
    var data = window.ITI_SKETCHES || {}, order = [], btns = [];
    Array.prototype.forEach.call(document.querySelectorAll("i.sk[data-sk]"), function(m){
      var id = m.getAttribute("data-sk"), d = data[id];
      if(!d) return;
      if(order.indexOf(id) < 0) order.push(id);
      var b = document.createElement("button");
      b.type = "button"; b.className = "sk"; b.setAttribute("data-sk", id);
      b.title = "Skizze: " + d.t + (rel(id) ? " · ◆ prüfungsrelevant" : "");
      b.setAttribute("aria-label", "Skizze öffnen: " + d.t);
      b.innerHTML = ICON;
      m.parentNode.replaceChild(b, m);
      btns.push(b);
    });
    if(!order.length) return;
    btns.forEach(function(b){ b.addEventListener("click", function(){ open(order, order.indexOf(b.getAttribute("data-sk")), b, { onState: decorate }); }); });
    decorate();
    if(window.SketchStats) window.SketchStats.onChange(decorate);
    /* Sprungmarke aus der Übersicht: Heft.html#sk=<id> */
    var m = /[#&]sk=([^&]+)/.exec(location.hash);
    if(m){
      var id = decodeURIComponent(m[1]), b = document.querySelector('button.sk[data-sk="' + id + '"]');
      if(b){ setTimeout(function(){ b.scrollIntoView({ block: "center" }); b.classList.add("flash"); open(order, order.indexOf(id), b, { onState: decorate }); }, 250); }
    }
  }

  window.SketchViewer = { HEFTE: HEFTE, heftInfo: heftInfo, heftOf: heftOf, open: open, initHeft: initHeft, ensureCss: ensureCss, fmtDur: fmtDur, fmtWhen: fmtWhen, esc: esc, ICON: ICON };
})();
