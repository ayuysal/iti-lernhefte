/* Prüfungsordner WMAPS – gemeinsame Darstellung der Rezeptkarten (window.Ordner).
   Daten: assets/ordner-data.js (window.ITI_ORDNER), Skizzen: sketch-kit.js + sketches/mai*.js */
(function(){
  "use strict";
  var D = window.ITI_ORDNER || { hefte: [], karten: {}, erkenner: [], tabellen: [], training: [] };

  function esc(s){ return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function heft(code){ for(var i = 0; i < D.hefte.length; i++) if(D.hefte[i].code === code) return D.hefte[i]; return { code: code, label: code.toUpperCase(), title: "", color: "#666", idx: 0 }; }
  function karte(id){ return D.karten[id]; }
  function kref(id, opt){
    var k = karte(id); if(!k) return '<span class="kref miss">' + esc(id) + '</span>';
    var h = heft(k.heft);
    return '<a class="kref" href="' + (opt && opt.base || "") + '#' + esc(id) + '" data-karte="' + esc(id) + '" style="--hc:' + h.color + '"><b>' + esc(k.nr) + '</b> ' +
      (opt && opt.short ? "" : '<span class="kh">' + esc(h.label) + '</span> ') + esc(k.titel) + '</a>';
  }
  function sketch(id){
    var S = window.ITI_SKETCHES || {}, d = S[id];
    if(!d) return "";
    var svg = typeof d.svg === "function" ? d.svg(window.SK) : d.svg;
    return '<figure class="osk"><div class="osk-svg">' + svg + '</div><figcaption>' + esc(d.t) + '</figcaption></figure>';
  }
  function list(arr, cls, ordered){
    if(!arr || !arr.length) return "";
    return (ordered ? '<ol class="' + cls + '">' : '<ul class="' + cls + '">') + arr.map(function(x){ return "<li>" + esc(x) + "</li>"; }).join("") + (ordered ? "</ol>" : "</ul>");
  }

  /* Eine Rezeptkarte als HTML */
  function cardHtml(k, opt){
    opt = opt || {};
    var h = heft(k.heft), b = k.beispiel || null;
    var sk = (k.skizzen || []).map(sketch).filter(Boolean);
    return '<article class="okarte" id="' + esc(k.id) + '" style="--hc:' + h.color + ';--ti:' + h.idx + '">' +
      '<div class="otab" aria-hidden="true"><span>' + esc(h.label) + '</span></div>' +
      '<header class="ok-h"><div class="ok-nr">' + esc(k.nr) + '</div><div class="ok-tt"><div class="ok-heft">' + esc(h.label) + ' · ' + esc(h.title) +
        (k.prio === 1 ? ' <span class="ok-prio">★ Klausurthema</span>' : '') + '</div>' +
        '<h3>' + esc(k.titel) + '</h3>' + (k.untertitel ? '<div class="ok-sub">' + esc(k.untertitel) + '</div>' : '') + '</div></header>' +
      (k.erkennen && k.erkennen.length ? '<section class="ok-sec ok-erk"><h4>Erkennen</h4>' + list(k.erkennen, "chips") + '</section>' : '') +
      (sk.length ? '<section class="ok-sk n' + sk.length + '">' + sk.join("") + '</section>' : '') +
      '<div class="ok-2">' +
        '<section class="ok-sec ok-f"><h4>Formeln</h4>' + list(k.formeln, "forms") + '</section>' +
        '<section class="ok-sec ok-s"><h4>Rechenschema</h4>' + list(k.schritte, "steps") + '</section>' +
      '</div>' +

      (b ? '<section class="ok-sec ok-b"><h4>Musterbeispiel' + (b.quelle ? ' <span class="q">' + esc(b.quelle) + '</span>' : '') + '</h4>' +
        '<p class="ba">' + esc(b.aufgabe) + '</p>' + list(b.loesung, "bl", true) + (b.ergebnis ? '<p class="be">⇒ ' + esc(b.ergebnis) + '</p>' : '') + '</section>' : '') +
      '<div class="ok-2 ok-cw">' +
        (k.casio && k.casio.length ? '<section class="ok-sec ok-c"><h4>Casio fx-991DE X</h4>' + list(k.casio, "casio") + '</section>' : '<div></div>') +
        (k.fallen && k.fallen.length ? '<section class="ok-sec ok-w"><h4>Fallen &amp; Probe</h4>' + list(k.fallen, "warn") + '</section>' : '<div></div>') +
      '</div>' +
      (k.siehe && k.siehe.length ? '<p class="ok-see">Siehe auch: ' + k.siehe.map(function(id){ return kref(id, { base: opt.base }); }).join(" · ") + '</p>' : '') +
    '</article>';
  }

  function tableHtml(t){
    var h = heft(t.heft);
    return '<article class="otabelle" id="' + esc(t.id) + '" style="--hc:' + h.color + ';--ti:' + h.idx + '">' +
      '<div class="otab" aria-hidden="true"><span>' + esc(h.label) + '</span></div>' +
      '<h3><span class="ok-nr sm">' + esc(t.nr) + '</span> ' + esc(t.titel) + ' <small>' + esc(h.label) + '</small></h3>' +
      '<table><thead><tr>' + (t.kopf || []).map(function(c){ return "<th>" + esc(c) + "</th>"; }).join("") + '</tr></thead><tbody>' +
      (t.zeilen || []).map(function(r){ return "<tr>" + r.map(function(c){ return "<td>" + esc(c) + "</td>"; }).join("") + "</tr>"; }).join("") +
      '</tbody></table>' + (t.fuss ? '<p class="tf">' + esc(t.fuss) + '</p>' : '') + '</article>';
  }

  window.Ordner = { D: D, esc: esc, heft: heft, karte: karte, kref: kref, cardHtml: cardHtml, tableHtml: tableHtml, sketch: sketch };
})();
