/* Skizzen zu MAI14C – Numerische Methoden.
   Jede Skizze: t = Titel, c = Lesehilfe (HTML), svg = function(K) → SVG-String (K = window.SK). */
(function(){
  "use strict";
  var S = window.ITI_SKETCHES = window.ITI_SKETCHES || {};
  function add(id, t, c, f){ S["mai14c-" + id] = { t: t, c: c, svg: f }; }
  function lines(K, x, y, arr, c, o){ o = o || {}; var s = ""; for(var i = 0; i < arr.length; i++) s += K.t(x, y + i * (o.lh || 20), arr[i], c || "s", { a: o.a || "start", s: o.s || 13, b: o.b }); return s; }
  function pl(K, pts, c, o){ return K.path("M" + pts.map(function(q){ return (Math.round(q[0] * 10) / 10) + " " + (Math.round(q[1] * 10) / 10); }).join(" L"), c, o); }
  function hl(K, M, y, x0, x1, c, o){ return K.line(M.X(x0), M.Y(y), M.X(x1), M.Y(y), c || "f", { w: (o && o.w) || 1.3, dash: (o && o.dash) || "5 4" }); }
  function vl(K, M, x, y0, y1, c, o){ return K.line(M.X(x), M.Y(y0), M.X(x), M.Y(y1), c || "f", { w: (o && o.w) || 1.3, dash: (o && o.dash) || "5 4" }); }
  function xaxis(K, M, x0, x1, lab){ return K.arrow(M.X(x0), M.Y(0), M.X(x1), M.Y(0), "s", { w: 1.3, head: 9 }) + (lab === undefined ? "" : K.t(M.X(x1) - 4, M.Y(0) + 16, lab, "s", { it: true, s: 15 })); }
  function tick(K, M, x, lab, o){ o = o || {}; return K.line(M.X(x), M.Y(0) - 4, M.X(x), M.Y(0) + 4, "s", { w: 1.2 }) + (lab ? K.t(M.X(x), M.Y(0) + (o.dy || 16), lab, o.c || "s", { s: o.s || 12.5, b: o.b }) : ""); }
  function brace(K, x1, x2, y, c, lab, o){ o = o || {}; var d = o.up ? -6 : 6;
    return K.line(x1, y, x2, y, c, { w: 1.6 }) + K.line(x1, y - d, x1, y + 0.01, c, { w: 1.6 }) + K.line(x2, y - d, x2, y + 0.01, c, { w: 1.6 }) +
      (lab ? K.t((x1 + x2) / 2, y + (o.ly || (o.up ? -13 : 15)), lab, c, { s: o.s || 13, b: true }) : ""); }

  /* lineares Gleichungssystem (Gauß mit Spaltenpivot) */
  function solve(A, b){
    var n = b.length, i, j, k;
    A = A.map(function(r){ return r.slice(); }); b = b.slice();
    for(k = 0; k < n; k++){
      var p = k; for(i = k + 1; i < n; i++) if(Math.abs(A[i][k]) > Math.abs(A[p][k])) p = i;
      var t = A[k]; A[k] = A[p]; A[p] = t; var tb = b[k]; b[k] = b[p]; b[p] = tb;
      for(i = k + 1; i < n; i++){ var m = A[i][k] / A[k][k]; for(j = k; j < n; j++) A[i][j] -= m * A[k][j]; b[i] -= m * b[k]; }
    }
    var x = new Array(n);
    for(i = n - 1; i >= 0; i--){ var s = b[i]; for(j = i + 1; j < n; j++) s -= A[i][j] * x[j]; x[i] = s / A[i][i]; }
    return x;
  }
  function zeros(n){ var r = []; for(var i = 0; i < n; i++) r.push(0); return r; }
  /* kubischer Spline: typ "nat" | "per" | "nak"; liefert Auswertefunktion */
  function cubic(xs, fs, typ){
    var n = xs.length - 1, N = 4 * n, A = [], b = [], i;
    function row(){ var r = zeros(N); A.push(r); return r; }
    for(i = 0; i < n; i++){
      var h = xs[i + 1] - xs[i], r;
      r = row(); r[4 * i] = 1; b.push(fs[i]);
      r = row(); r[4 * i] = 1; r[4 * i + 1] = h; r[4 * i + 2] = h * h; r[4 * i + 3] = h * h * h; b.push(fs[i + 1]);
      if(i < n - 1){
        r = row(); r[4 * i + 1] = 1; r[4 * i + 2] = 2 * h; r[4 * i + 3] = 3 * h * h; r[4 * (i + 1) + 1] = -1; b.push(0);
        r = row(); r[4 * i + 2] = 2; r[4 * i + 3] = 6 * h; r[4 * (i + 1) + 2] = -2; b.push(0);
      }
    }
    var hn = xs[n] - xs[n - 1], r2;
    if(typ === "nat"){ r2 = row(); r2[2] = 2; b.push(0); r2 = row(); r2[4 * (n - 1) + 2] = 2; r2[4 * (n - 1) + 3] = 6 * hn; b.push(0); }
    else if(typ === "per"){
      r2 = row(); r2[1] = 1; r2[4 * (n - 1) + 1] = -1; r2[4 * (n - 1) + 2] = -2 * hn; r2[4 * (n - 1) + 3] = -3 * hn * hn; b.push(0);
      r2 = row(); r2[2] = 2; r2[4 * (n - 1) + 2] = -2; r2[4 * (n - 1) + 3] = -6 * hn; b.push(0);
    } else { r2 = row(); r2[3] = 1; r2[7] = -1; b.push(0); r2 = row(); r2[4 * (n - 2) + 3] = 1; r2[4 * (n - 1) + 3] = -1; b.push(0); }
    var c = solve(A, b);
    return function(x){
      var k = 0; while(k < n - 1 && x > xs[k + 1]) k++;
      var t = x - xs[k]; return c[4 * k] + c[4 * k + 1] * t + c[4 * k + 2] * t * t + c[4 * k + 3] * t * t * t;
    };
  }
  function lagr(xs, fs){ return function(x){ var s = 0; for(var k = 0; k < xs.length; k++){ var L = 1; for(var i = 0; i < xs.length; i++) if(i !== k) L *= (x - xs[i]) / (xs[k] - xs[i]); s += fs[k] * L; } return s; }; }
  function pieceColor(i){ return i % 2 ? "c4" : "a"; }

  /* ═════════ Kapitel 1: Fehleranalyse und Maschinenzahlen ═════════ */

  add("fehlerarten", "Die drei Fehlerarten",
    "Drei Quellen, drei Bilder: <b>Eingabedatenfehler</b> – man liest 2,4 ab, wahr wäre 2,43. <b>Verfahrensfehler</b> – der Rechner kann e nur über endlich viele Glieder 1 + 1 + ½ + ⅙ + … annähern, der Rest fehlt. <b>Rundungsfehler</b> – 4,310769 passt nicht in fünf Mantissenstellen und landet auf der nächsten Maschinenzahl. Die Numerik kümmert sich vor allem um den mittleren Fall.",
    function(K){
      var s = K.panel(10, 10, 200, 280, "Eingabedatenfehler") + K.panel(220, 10, 200, 280, "Verfahrensfehler", "a") + K.panel(430, 10, 200, 280, "Rundungsfehler");
      /* Panel 1: Skala */
      function X1(v){ return 30 + (v - 2) * 160; }
      s += K.line(28, 170, 194, 170, "i", { w: 1.6 });
      for(var i = 0; i <= 10; i++){ var big = i % 5 === 0; s += K.line(X1(2 + i / 10), 170, X1(2 + i / 10), big ? 158 : 163, "i", { w: 1.2 }); }
      s += K.t(X1(2), 188, "2,0", "s", { s: 12 }) + K.t(X1(2.5), 188, "2,5", "s", { s: 12 }) + K.t(X1(3), 188, "3,0", "s", { s: 12 });
      s += K.arrow(X1(2.43), 112, X1(2.43), 156, "m", { w: 2, head: 9 }) + K.t(X1(2.43), 100, "wahr: 2,43", "m", { s: 13, b: true });
      s += K.dot(X1(2.4), 170, "c4", 4.5) + K.arrow(X1(2.4), 214, X1(2.4), 178, "c4", { w: 2, head: 9 }) + K.t(X1(2.4) + 4, 228, "abgelesen: 2,4", "c4", { s: 13, b: true });
      s += K.t(110, 262, "Fehler 0,03 – vor", "s", { s: 12.5 }) + K.t(110, 278, "jeder Rechnung", "s", { s: 12.5 });
      /* Panel 2: e als abgebrochene Reihe */
      var x = 235, parts = [1, 1, 0.5, 1 / 6, 1 / 24], labs = ["1", "1", "½", "", ""];
      for(i = 0; i < parts.length; i++){
        var w = parts[i] * 60;
        s += K.rect(x, 130, w, 30, "a", { fill: i % 2 ? "fm" : "fa", rx: 0, w: 1 });
        if(labs[i]) s += K.t(x + w / 2, 145, labs[i], "a", { s: 13, b: true, halo: false });
        x += w;
      }
      var xe = 235 + Math.E * 60;
      s += K.line(xe, 112, xe, 178, "m", { w: 1.6, dash: "4 3" }) + K.t(xe + 4, 100, "e = 2,71828…", "m", { a: "end", s: 13, b: true });
      s += K.t(320, 200, "nach 5 Gliedern", "s", { s: 12.5 }) + K.t(320, 218, "abgebrochen: 2,7083", "a", { s: 13, b: true });
      s += K.t(320, 248, "Rest ≈ 0,0099 fehlt", "m", { s: 13, b: true }) + K.t(320, 274, "Fokus der Numerik", "a", { s: 12.5, b: true });
      /* Panel 3: Rundung */
      function X3(v){ return 470 + (v - 0.43107) / 0.00001 * 120; }
      s += K.line(450, 160, 612, 160, "i", { w: 1.6 });
      s += K.line(X3(0.43107), 152, X3(0.43107), 168, "i", { w: 1.4 }) + K.line(X3(0.43108), 152, X3(0.43108), 168, "i", { w: 1.4 }) + K.line(X3(0.431075), 154, X3(0.431075), 166, "f", { w: 1.2 });
      s += K.t(X3(0.43107), 182, "0,43107", "s", { s: 12 }) + K.t(X3(0.43108), 182, "0,43108", "a", { s: 12, b: true }) + K.t(X3(0.431075), 182, "Mitte", "f", { s: 12 });
      var xt = X3(0.4310769);
      s += K.dot(xt, 160, "m", 4.5) + K.t(xt - 4, 128, "wahr: 0,4310769", "m", { s: 12.5, b: true });
      s += K.arrow(xt + 5, 146, X3(0.43108) - 2, 146, "m", { w: 1.8, head: 8 });
      s += K.t(530, 222, "56,03/13 gerundet", "s", { s: 12.5 }) + K.t(530, 242, "→ 0,43108 · 10¹", "a", { s: 13, b: true });
      s += K.t(530, 270, "Rest abgeschnitten", "s", { s: 12.5 });
      return K.svg(640, 300, s);
    });

  add("absrel", "Absoluter und relativer Fehler",
    "In beiden Fällen ist der <b>absolute Fehler</b> gleich: Δx = 1. Entscheidend ist aber, <b>wie groß der Fehler im Verhältnis zum Wert</b> ist. Links ist er ein winziger Splitter neben 100 (δ = 1 %), rechts ist er riesig neben dem fast unsichtbaren Wert 0,01 (δ = 10 000 %). Darum misst der <b>relative Fehler</b> die Güte einer Näherung.",
    function(K){
      var s = K.panel(10, 10, 300, 280, "x = 100, x̃ = 101", "a") + K.panel(330, 10, 300, 280, "x = 0,01, x̃ = 1,01", "m");
      s += K.t(40, 66, "|x| = 100", "a", { a: "start", s: 13, b: true }) + K.rect(40, 78, 240, 26, "a", { fill: "fa", rx: 2 });
      s += K.t(40, 134, "Δx = 1", "m", { a: "start", s: 13, b: true }) + K.rect(40, 146, 2.4, 26, "m", { fill: "fm", rx: 0 });
      s += K.t(52, 159, "← nur ein Splitter", "m", { a: "start", s: 12.5 });
      s += K.f(160, 222, "δx = 1/100 = 1 %", "a");
      s += K.t(160, 262, "gute Näherung", "a", { s: 13, b: true });
      s += K.t(360, 66, "|x| = 0,01", "a", { a: "start", s: 13, b: true }) + K.rect(360, 78, 1.5, 26, "a", { fill: "fa", rx: 0 });
      s += K.t(370, 91, "← kaum sichtbar", "a", { a: "start", s: 12.5 });
      s += K.t(360, 134, "Δx = 1", "m", { a: "start", s: 13, b: true }) + K.rect(360, 146, 240, 26, "m", { fill: "fm", rx: 2 });
      s += K.f(480, 222, "δx = 1/0,01 = 10 000 %", "m", { fill: "fm" });
      s += K.t(480, 262, "unbrauchbar", "m", { s: 13, b: true });
      return K.svg(640, 300, s);
    });

  add("fortpfl", "Fehlerfortpflanzung: Δz ≈ |f′|·Δx",
    "Die Eingabe x ist nur bis auf ±Δx bekannt (blaues Band). Die <b>Tangente</b> übersetzt dieses Band in ein Band für das Ergebnis z: Je <b>steiler</b> f, desto breiter wird der Ergebnisfehler. Hier f(x) = x² bei x = 1,5: Steigung 3, also wird aus Δx = 0,3 ein Δz ≈ 0,9. Hängt z von zwei Größen ab, <b>addieren sich</b> beide Beiträge.",
    function(K){
      var M = K.map(60, 290, 140, 38), s = "";
      s += K.rect(M.X(1.2), M.Y(0) - 7, M.X(1.8) - M.X(1.2), 14, "a", { fill: "fa", rx: 2 });
      s += K.rect(M.X(0) - 7, M.Y(3.15), 14, M.Y(1.35) - M.Y(3.15), "m", { fill: "fm", rx: 2 });
      s += K.axes(60, 290, 5, 360, 255, 5, "x", "z");
      s += K.line(M.X(1.2), M.Y(0), M.X(1.2), M.Y(1.35), "f", { w: 1.2, dash: "4 4" }) + K.line(M.X(1.2), M.Y(1.35), M.X(0), M.Y(1.35), "f", { w: 1.2, dash: "4 4" });
      s += K.line(M.X(1.8), M.Y(0), M.X(1.8), M.Y(3.15), "f", { w: 1.2, dash: "4 4" }) + K.line(M.X(1.8), M.Y(3.15), M.X(0), M.Y(3.15), "f", { w: 1.2, dash: "4 4" });
      s += K.plot(function(x){ return x * x; }, 0, 2.35, M, "a");
      s += K.line(M.X(0.9), M.Y(0.45), M.X(2.1), M.Y(4.05), "c3", { w: 2 });
      s += K.dot(M.X(1.5), M.Y(2.25), "i", 4.5);
      s += K.t(M.X(1.5), M.Y(0) - 18, "Δx", "a", { s: 14, b: true }) + K.t(M.X(0) - 26, M.Y(2.25), "Δz", "m", { s: 14, b: true });
      s += K.t(M.X(2.1) + 8, M.Y(4.05) + 6, "Tangente", "c3", { s: 13, b: true, a: "start" }) + K.t(M.X(1.45), M.Y(4.6), "f(x) = x²", "a", { a: "end", s: 13, b: true });
      s += K.f(530, 50, "Δz ≈ |f′(x)|·Δx", "a");
      s += lines(K, 430, 90, ["f′(1,5) = 3, Δx = 0,3", "⇒ Δz ≈ 3 · 0,3 = 0,9", "steiler ⇒ größerer Fehler"], "s");
      s += K.t(530, 190, "zwei Eingaben x, y:", "s", { s: 13, b: true });
      s += K.f(530, 218, "Δz ≈ |∂f/∂x|Δx + |∂f/∂y|Δy", "m", { s: 12, fill: "fm" });
      s += K.t(530, 252, "Beiträge addieren sich", "s", { s: 13 });
      return K.svg(640, 320, s);
    });

  add("addmult", "Faustregeln: Summe ↔ absolute, Produkt ↔ relative Fehler",
    "<b>Links:</b> Beim Addieren legen sich die Unsicherheitsbänder aneinander – die <b>absoluten</b> Fehler 0,2 und 0,1 werden zu 0,3. <b>Rechts</b> (Ü.2): Beim Produkt F = a·b kommt durch Δa ein Randstreifen b·Δa und durch Δb ein Streifen a·Δb dazu; zusammen 0,55 cm² von 15 cm². In Prozent: 2 % + 1,67 % = 3,67 % – die <b>relativen</b> Fehler addieren sich.",
    function(K){
      var s = K.panel(10, 10, 300, 290, "Addition: absolute Fehler +", "a") + K.panel(330, 10, 300, 290, "Produkt: relative Fehler +", "m");
      function X(v){ return 40 + v * 42; }
      function band(v, e, y, c, f){ return K.rect(X(v - e), y - 9, X(v + e) - X(v - e), 18, c, { fill: f, rx: 2 }) + K.dot(X(v), y, c, 3.5); }
      s += K.t(30, 64, "x = 3 ± 0,2", "a", { a: "start", s: 13, b: true }) + band(3, 0.2, 86, "a", "fa");
      s += K.t(30, 120, "y = 2 ± 0,1", "a", { a: "start", s: 13, b: true }) + band(2, 0.1, 142, "a", "fa");
      s += K.t(30, 178, "x + y = 5 ± 0,3", "m", { a: "start", s: 13, b: true }) + band(5, 0.3, 200, "m", "fm");
      s += K.line(X(0), 236, X(6), 236, "s", { w: 1.3 });
      for(var i = 0; i <= 6; i++) s += K.line(X(i), 232, X(i), 240, "s", { w: 1.2 }) + K.t(X(i), 252, String(i), "f", { s: 12 });
      s += K.t(160, 280, "Breiten: 0,2 + 0,1 = 0,3", "s", { s: 13 });
      /* Rechteck a·b, Ränder 5-fach vergrößert */
      var x0 = 350, yb = 235, ua = 32;
      s += K.rect(x0, yb - 3 * ua, 5 * ua, 3 * ua, "a", { fill: "fa", rx: 0 });
      s += K.rect(x0 + 5 * ua, yb - 3 * ua, 16, 3 * ua, "m", { fill: "fm", rx: 0 });
      s += K.rect(x0, yb - 3 * ua - 8, 5 * ua, 8, "m", { fill: "fm", rx: 0 });
      s += K.rect(x0 + 5 * ua, yb - 3 * ua - 8, 16, 8, "f", { fill: "p", rx: 0, dash: "2 2" });
      s += K.t(430, 172, "F = a·b = 15", "a", { s: 13, b: true, halo: false }) + K.t(430, 196, "b = 3,0 ± 0,05", "a", { s: 12.5, halo: false });
      s += K.t(430, 252, "a = 5,0 ± 0,1", "a", { s: 12.5, b: true });
      s += K.t(430, 120, "a·Δb = 0,25", "m", { s: 12.5, b: true });
      s += K.t(533, 176, "b·Δa", "m", { a: "start", s: 12.5, b: true }) + K.t(533, 194, "= 0,30", "m", { a: "start", s: 12.5, b: true });
      s += K.t(480, 48, "(Randstreifen 5× vergrößert)", "f", { s: 12 });
      s += K.t(480, 280, "δF = 2 % + 1,67 % = 3,67 %", "m", { s: 13, b: true });
      return K.svg(640, 310, s);
    });

  add("ausloesch", "Auslöschung: fast gleiche Zahlen subtrahieren",
    "Oben zwei Zahlen, die sich praktisch nicht unterscheiden – jede ist auf 0,04 % genau. Ihre <b>Differenz</b> ist aber nur 0,0005, und die <b>absoluten Fehler</b> (je ±0,0005) bleiben in voller Größe erhalten: Das Fehlerband ist <b>doppelt so breit wie das Ergebnis</b> selbst. Der relative Fehler springt auf 200 % – darum solche Differenzen durch Umformen vermeiden.",
    function(K){
      var s = K.t(30, 24, "vorher: zwei fast gleich große Zahlen", "s", { a: "start", s: 13, b: true });
      s += K.rect(30, 50, 1.2345 * 320, 22, "a", { fill: "fa", rx: 2 }) + K.rect(30, 88, 1.2340 * 320, 22, "c4", { fill: "fa", rx: 2 });
      s += K.t(440, 61, "x = 1,2345 ± 0,0005", "a", { a: "start", s: 13, b: true }) + K.t(440, 99, "y = 1,2340 ± 0,0005", "c4", { a: "start", s: 13, b: true });
      s += K.t(440, 128, "relativ je ≈ 0,04 %", "s", { a: "start", s: 12.5 });
      s += K.t(30, 162, "nachher: die Differenz (stark vergrößert)", "s", { a: "start", s: 13, b: true });
      function X(v){ return 60 + (v + 0.001) * 200000; }
      s += K.rect(X(-0.0005), 206, X(0.0015) - X(-0.0005), 18, "m", { fill: "fm", rx: 2 });
      s += K.line(40, 215, 600, 215, "s", { w: 1.3 });
      [[-0.0005, "−0,0005"], [0, "0"], [0.0005, "0,0005"], [0.0015, "0,0015"]].forEach(function(p){ s += K.line(X(p[0]), 209, X(p[0]), 221, "s", { w: 1.2 }) + K.t(X(p[0]), 240, p[1], "s", { s: 12 }); });
      s += K.dot(X(0.0005), 215, "a", 5);
      s += K.t(X(0.0005), 190, "x − y = 0,0005 ± 0,001", "m", { s: 13.5, b: true });
      s += K.t(320, 272, "Fehler größer als das Ergebnis: δ = 0,001 / 0,0005 = 200 %", "m", { s: 13, b: true });
      return K.svg(640, 290, s);
    });

  add("gleitpunkt", "Gleitpunktdarstellung y = sign · a · 10ᵉ",
    "Das Komma von −200,22 wird so weit verschoben, bis direkt dahinter die <b>erste Ziffer ≠ 0</b> steht (Normierung 0,1 ≤ a &lt; 1). Drei Stellen nach links heißt: <b>Exponent e = 3</b>. Gespeichert werden nur drei Teile: das <b>Vorzeichen</b>, die <b>Mantisse</b> mit fester Ziffernzahl m (hier 5) und der <b>Exponent</b>.",
    function(K){
      var s = "", dg = ["2", "0", "0", ",", "2", "2"], xs = [180, 200, 220, 236, 252, 272];
      s += K.t(160, 62, "−", "i", { s: 24, b: true });
      for(var i = 0; i < dg.length; i++) s += K.t(xs[i], 62, dg[i], i === 3 ? "m" : "i", { s: 24, b: true });
      s += K.t(170, 62, ",", "a", { s: 24, b: true });
      s += K.path("M236 82 Q205 112 172 84", "m", { w: 1.8 }) + K.arrow(176, 88, 171, 82, "m", { w: 1.8, head: 8 });
      s += K.t(205, 122, "3 Stellen nach links", "m", { s: 13, b: true });
      s += K.t(310, 62, "⇒ Exponent e = 3", "a", { a: "start", s: 15, b: true });
      s += K.t(310, 90, "(Komma nach vorn, bis 0,2… dasteht)", "s", { a: "start", s: 12.5 });
      var y = 185;
      s += K.cell(100, y, "−", "c4", { w: 44, h: 40, s: 20 });
      s += K.t(150, y, "0,", "i", { s: 20, b: true });
      var md = ["2", "0", "0", "2", "2"];
      for(i = 0; i < 5; i++) s += K.cell(190 + i * 44, y, md[i], i === 0 ? "m" : "a", { w: 44, h: 40, s: 20, fill: i === 0 ? "fm" : "fa" });
      s += K.t(442, y, "· 10", "i", { s: 20, b: true });
      s += K.cell(500, y - 10, "3", "c3", { w: 36, h: 32, s: 18 });
      s += K.t(100, 228, "sign", "c4", { s: 13, b: true }) + K.t(278, 228, "Mantisse a (m = 5 Ziffern)", "a", { s: 13, b: true }) + K.t(500, 228, "Exponent e", "c3", { s: 13, b: true });
      s += K.t(190, 152, "≠ 0", "m", { s: 12.5, b: true });
      s += K.t(320, 268, "0,1 ≤ a < 1: erste Nachkommaziffer ≠ 0 – einzige Ausnahme ist die Null", "s", { s: 13 });
      return K.svg(640, 290, s);
    });

  add("zahlengerade", "Maschinenzahlen, Unterlauf und Überlauf",
    "Spielzeug-Rechner mit <b>einer</b> Mantissenziffer und −1 ≤ e ≤ 1. Er kennt nur wenige Zahlen, und ihr <b>Abstand wächst mit dem Exponenten</b> (0,01 → 0,1 → 1) – der relative Abstand bleibt gleich, darum sind die drei Blöcke logarithmisch gleich breit gezeichnet. Kleiner als die kleinste Zahl heißt <b>Unterlauf</b> (still zu 0), größer als die größte heißt <b>Überlauf</b> (Abbruch oder „inf“).",
    function(K){
      var s = K.t(320, 26, "m = 1 Mantissenziffer, −1 ≤ e ≤ 1 (logarithmisch gezeichnet)", "s", { s: 13, b: true });
      var y = 160;
      s += K.rect(42, y - 14, 68, 28, "m", { fill: "fm", rx: 2, dash: "4 3" }) + K.rect(560, y - 14, 60, 28, "m", { fill: "fm", rx: 2, dash: "4 3" });
      s += K.line(40, y, 620, y, "s", { w: 1.4 });
      s += K.dot(40, y, "i", 4.5) + K.t(40, y + 26, "0", "i", { s: 13, b: true });
      var starts = [110, 260, 410], cols = ["c4", "a", "c3"], es = ["e = −1", "e = 0", "e = 1"], rg = ["0,01 … 0,09", "0,1 … 0,9", "1 … 9"];
      for(var k = 0; k < 3; k++){
        for(var d = 1; d <= 9; d++){ var x = starts[k] + Math.log(d) / Math.LN10 * 150; s += K.line(x, y - 10, x, y + 10, cols[k], { w: 2 }); }
        s += K.t(starts[k] + 72, y - 32, es[k], cols[k], { s: 13.5, b: true }) + K.t(starts[k] + 72, y + 28, rg[k], cols[k], { s: 13, b: true });
      }
      s += K.t(76, y - 32, "Unterlauf", "m", { s: 13, b: true }) + K.t(76, y + 28, "→ 0", "m", { s: 13, b: true });
      s += K.t(590, y - 32, "Überlauf", "m", { s: 13, b: true }) + K.t(590, y + 28, "→ inf", "m", { s: 13, b: true });
      s += K.t(320, 226, "Nachbarabstand: 0,01 → 0,1 → 1 – wächst mit e,", "s", { s: 13 });
      s += K.t(320, 248, "relativ bleibt er gleich groß.", "s", { s: 13 });
      return K.svg(640, 270, s);
    });

  add("rundung", "Rundung und Maschinengenauigkeit",
    "Zwischen zwei benachbarten Maschinenzahlen (hier m = 3 Stellen: 0,123 und 0,124) liegt eine Lücke. Jede Zahl wird auf die <b>nähere</b> Seite gerundet; die Grenze ist die Mitte – entscheidend ist die (m+1)-te Ziffer. Der Fehler ist also höchstens ein <b>halber Abstand</b>; bezogen auf den Wert gibt das die <b>Maschinengenauigkeit</b> ½ · 10¹⁻ᵐ.",
    function(K){
      function X(v){ return 80 + (v - 0.123) / 0.001 * 480; }
      var s = K.f(320, 28, "δ ≤ ½ · 10¹⁻ᵐ = ½ · 10⁻² für m = 3", "m", { fill: "fm" }), y = 150;
      s += K.rect(X(0.123), y - 9, X(0.1235) - X(0.123), 18, "a", { fill: "fa", rx: 0, w: 0.8 }) + K.rect(X(0.1235), y - 9, X(0.124) - X(0.1235), 18, "m", { fill: "fm", rx: 0, w: 0.8 });
      s += K.line(60, y, 580, y, "i", { w: 1.6 });
      s += K.line(X(0.123), y - 14, X(0.123), y + 14, "a", { w: 2.4 }) + K.line(X(0.124), y - 14, X(0.124), y + 14, "m", { w: 2.4 }) + K.line(X(0.1235), y - 12, X(0.1235), y + 12, "f", { w: 1.4, dash: "3 3" });
      s += K.t(X(0.123), y + 26, "0,123", "a", { s: 13, b: true }) + K.t(X(0.124), y + 26, "0,124", "m", { s: 13, b: true }) + K.t(X(0.1235), y + 26, "Mitte 0,1235", "f", { s: 12 });
      var xt = X(0.12345);
      s += K.dot(xt, y, "i", 5) + K.t(xt + 8, y - 24, "x = 0,12345", "i", { a: "start", s: 13, b: true });
      s += K.path("M" + (xt - 4) + " " + (y - 12) + " Q" + ((xt + X(0.123)) / 2) + " " + (y - 70) + " " + (X(0.123) + 3) + " " + (y - 16), "a", { w: 1.8 }) + K.arrow(X(0.123) + 8, y - 22, X(0.123) + 3, y - 16, "a", { w: 1.8, head: 8 });
      s += K.t(188, 80, "4. Ziffer 4 < 5 → abrunden", "a", { s: 13, b: true });
      s += brace(K, X(0.123), X(0.1235), 200, "s", "höchstens ½ Abstand = 0,0005", { s: 12.5 });
      s += K.t(200, 246, "Bereich → 0,123", "a", { s: 13, b: true }) + K.t(440, 246, "Bereich → 0,124", "m", { s: 13, b: true });
      return K.svg(640, 270, s);
    });

  /* ═════════ Kapitel 2: Nullstellen und Fixpunkte ═════════ */

  add("nullfix", "Nullstelle ↔ Fixpunkt",
    "<b>Links</b> die Nullstelle von f(x) = x − cos x: Dort schneidet der Graph die x-Achse. <b>Rechts</b> dasselbe Problem als Fixpunktproblem: g(x) = x − f(x) = cos x schneidet die <b>Winkelhalbierende y = x</b>. Beide Bilder markieren <b>dieselbe Stelle</b> x* ≈ 0,739 – deshalb genügt ein Fixpunktverfahren, um Nullstellen zu finden.",
    function(K){
      var xs = 0.739085, s = K.panel(10, 10, 300, 300, "Nullstelle: f(x*) = 0", "a") + K.panel(330, 10, 300, 300, "Fixpunkt: g(x*) = x*", "c4");
      var M = K.map(40, 220, 150, 70);
      s += xaxis(K, M, -0.05, 1.75, "x") + K.arrow(40, 296, 40, 50, "s", { w: 1.3, head: 9 });
      s += K.plot(function(x){ return x - Math.cos(x); }, 0, 1.6, M, "a");
      s += K.ring(M.X(xs), M.Y(0), "m", 6) + K.t(M.X(xs) + 8, M.Y(0) + 20, "x* ≈ 0,739", "m", { s: 13, b: true, a: "start" });
      s += K.t(M.X(1.55), 70, "f(x) = x − cos x", "a", { a: "end", s: 13, b: true });
      var N = K.map(360, 280, 150, 130);
      s += xaxis(K, N, -0.05, 1.75, "x") + K.arrow(360, 285, 360, 50, "s", { w: 1.3, head: 9 });
      s += K.plot(function(x){ return x; }, 0, 1.6, N, "s", { w: 1.6 });
      s += K.plot(function(x){ return Math.cos(x); }, 0, 1.6, N, "c4");
      s += vl(K, N, xs, 0, xs, "f") + K.ring(N.X(xs), N.Y(xs), "m", 6);
      s += K.t(N.X(xs), N.Y(0) + 16, "x*", "m", { s: 13, b: true });
      s += K.t(N.X(1.3), 62, "y = x", "s", { s: 13, b: true }) + K.t(N.X(0.32), 128, "g(x) = cos x", "c4", { s: 13, b: true });
      s += K.t(320, 334, "Umstellen: g(x) = x − f(x) = cos x – gleiche Lösung x*", "s", { s: 13 });
      return K.svg(640, 350, s);
    });

  add("zws", "Satz 2.1: Vorzeichenwechsel + Stetigkeit ⇒ Nullstelle",
    "<b>Links:</b> f(x) = x² − 2 ist stetig, startet bei a = 1 unter der Achse und endet bei b = 2 darüber. Ohne Sprung kann der Graph nicht „über die Achse hüpfen“ – er muss sie irgendwo schneiden (bei √2). <b>Rechts:</b> 1/x wechselt auf [−1, 1] auch das Vorzeichen, springt aber bei 0 – <b>ohne Stetigkeit keine Garantie</b>.",
    function(K){
      var s = K.panel(10, 10, 300, 280, "stetig: Nullstelle sicher", "a") + K.panel(330, 10, 300, 280, "nicht stetig: keine Nullstelle", "m");
      var M = K.map(-130, 190, 200, 60);
      s += K.line(40, 190, 295, 190, "s", { w: 1.3 });
      s += K.plot(function(x){ return x * x - 2; }, 0.85, 2.12, M, "a");
      s += K.dot(M.X(1), M.Y(-1), "a", 5) + K.dot(M.X(2), M.Y(2), "a", 5);
      s += K.t(M.X(1) + 8, M.Y(-1) + 16, "f(a) < 0", "a", { a: "start", s: 13, b: true }) + K.t(M.X(2) - 10, M.Y(2) - 2, "f(b) > 0", "a", { a: "end", s: 13, b: true });
      s += tick(K, M, 1, "") + tick(K, M, 2, "");
      s += K.t(M.X(1), M.Y(0) - 14, "a", "s", { s: 13, it: true }) + K.t(M.X(2), M.Y(0) + 16, "b", "s", { s: 13, it: true });
      s += K.ring(M.X(Math.SQRT2), M.Y(0), "m", 6) + K.t(M.X(Math.SQRT2) - 6, M.Y(0) - 18, "√2", "m", { s: 14, b: true, a: "end" });
      var N = K.map(480, 150, 110, 40);
      s += K.line(355, 150, 610, 150, "s", { w: 1.3 }) + K.line(480, 40, 480, 280, "f", { w: 1.2, dash: "4 4" });
      s += K.plot(function(x){ return 1 / x; }, -1.1, -0.01, N, "m", { ymin: -2.6 }) + K.plot(function(x){ return 1 / x; }, 0.01, 1.1, N, "m", { ymax: 2.6 });
      s += K.dot(N.X(-1), N.Y(-1), "m", 5) + K.dot(N.X(1), N.Y(1), "m", 5);
      s += K.t(N.X(-1), N.Y(-1) + 22, "f(−1) = −1", "m", { s: 13, b: true }) + K.t(N.X(1), N.Y(1) - 20, "f(1) = 1", "m", { s: 13, b: true });
      s += K.t(N.X(0) + 8, 240, "Sprung bei 0", "s", { a: "start", s: 12.5 });
      s += K.t(420, 70, "f(x) = 1/x", "m", { s: 13, b: true });
      return K.svg(640, 300, s);
    });

  add("kontrakt", "Kontrahierende Funktion |g(x) − g(y)| ≤ K·|x − y|",
    "Oben zwei Punkte x und y im Abstand 0,8. Die Abbildung g = cos (Pfeile) bringt sie nach unten – und dort liegen ihre Bilder <b>deutlich näher beieinander</b> (0,37). Kontrahierend heißt: Das gilt für <b>alle</b> Paare, und der Abstand schrumpft mindestens um den festen Faktor K &lt; 1 (hier K = sin 1 ≈ 0,84). Darum zieht die Iteration alles auf einen Punkt zusammen.",
    function(K){
      function X(v){ return 100 + v * 450; }
      var x1 = 0.1, x2 = 0.9, g1 = Math.cos(x1), g2 = Math.cos(x2), s = "";
      s += K.line(80, 90, 570, 90, "i", { w: 1.6 }) + K.line(80, 200, 570, 200, "i", { w: 1.6 });
      s += K.t(40, 90, "I", "s", { s: 15, b: true, it: true }) + K.t(40, 200, "g(I)", "s", { s: 14, b: true, it: true });
      s += K.line(X(0), 85, X(0), 95, "s") + K.line(X(1), 85, X(1), 95, "s") + K.t(X(0), 106, "0", "f", { s: 12 }) + K.t(X(1) + 10, 106, "1", "f", { s: 12 });
      s += K.line(X(0), 195, X(0), 205, "s") + K.line(X(1), 195, X(1), 205, "s");
      s += K.dot(X(x1), 90, "a", 5.5) + K.dot(X(x2), 90, "c4", 5.5);
      s += K.t(X(x1), 72, "x = 0,1", "a", { s: 13, b: true }) + K.t(X(x2), 72, "y = 0,9", "c4", { s: 13, b: true });
      s += brace(K, X(x1), X(x2), 46, "s", "|x − y| = 0,8", { up: true });
      s += K.arrow(X(x1) + 2, 96, X(g1) - 2, 193, "a", { w: 1.8, head: 9 }) + K.arrow(X(x2) - 2, 96, X(g2) + 2, 193, "c4", { w: 1.8, head: 9 });
      s += K.dot(X(g1), 200, "a", 5.5) + K.dot(X(g2), 200, "c4", 5.5);
      s += K.t(X(g2), 218, "g(y) = 0,62", "c4", { s: 13, b: true }) + K.t(X(g1) - 6, 218, "g(x) = 1,00", "a", { s: 13, b: true });
      s += brace(K, X(g2), X(g1), 236, "m", "|g(x) − g(y)| = 0,37", { s: 13 });
      var mid = (X(g1) + X(g2)) / 2, half = 0.84 * 0.8 * 450 / 2;
      s += K.line(mid - half, 274, mid + half, 274, "f", { w: 1.4, dash: "5 4" }) + K.line(mid - half, 268, mid - half, 280, "f", { w: 1.4 }) + K.line(mid + half, 268, mid + half, 280, "f", { w: 1.4 });
      s += K.t(mid, 292, "erlaubt: K·|x − y| = 0,67", "s", { s: 12.5 });
      s += K.t(28, 148, "g(x) = cos x, K = 0,84", "s", { a: "start", s: 13 });
      s += K.f(150, 260, "0,37 ≤ 0,84 · 0,8", "m", { fill: "fm" });
      return K.svg(640, 305, s);
    });

  function cobweb(K, M, g, x0, steps, c){
    var s = "", x = x0, pts = [[M.X(x0), M.Y(0)]];
    for(var i = 0; i < steps; i++){ var y = g(x); pts.push([M.X(x), M.Y(y)]); pts.push([M.X(y), M.Y(y)]); x = y; }
    s += pl(K, pts, c || "m", { w: 1.6 });
    return s;
  }

  add("spinnen", "Fixpunktiteration: Treppe und Spinnennetz",
    "Ein Schritt x<sub>n+1</sub> = g(x<sub>n</sub>) ist im Bild: <b>senkrecht zum Graphen</b> von g, dann <b>waagerecht zur Diagonale</b> y = x – dort steht der neue Wert. Steigt g flacher als die Diagonale (links), entsteht eine <b>Treppe</b>; fällt g (rechts, cos x aus Ü.6 ab x₀ = 0,5), ein <b>Spinnennetz</b>. Wegen |g′| &lt; 1 laufen beide auf den Schnittpunkt x* zu.",
    function(K){
      var s = K.panel(10, 10, 300, 310, "Treppe: g(x) = √(x + 2)", "a") + K.panel(330, 10, 300, 310, "Spinnennetz: g(x) = cos x", "c4");
      var M = K.map(45, 290, 80, 80), g1 = function(x){ return Math.sqrt(x + 2); };
      s += K.axes(45, 290, 5, 250, 250, 5, "x", "y");
      s += K.plot(function(x){ return x; }, 0, 2.95, M, "s", { w: 1.4 }) + K.plot(g1, 0, 2.95, M, "a");
      s += cobweb(K, M, g1, 0, 5, "m");
      s += K.ring(M.X(2), M.Y(2), "m", 6) + K.t(M.X(2) + 10, M.Y(2) + 18, "x* = 2", "m", { a: "start", s: 13, b: true });
      s += K.t(M.X(0), M.Y(0) + 14, "x₀", "m", { s: 13, b: true }) + K.t(M.X(2.65), M.Y(2.95) + 4, "y = x", "s", { s: 13, b: true, a: "end" });
      var N = K.map(365, 290, 210, 210);
      s += K.axes(365, 290, 5, 250, 250, 5, "x", "y");
      s += K.plot(function(x){ return x; }, 0, 1.1, N, "s", { w: 1.4 }) + K.plot(Math.cos, 0, 1.1, N, "c4");
      s += cobweb(K, N, Math.cos, 0.5, 7, "m");
      s += K.ring(N.X(0.739085), N.Y(0.739085), "m", 6);
      s += K.t(N.X(0.5), N.Y(0) + 14, "x₀", "m", { s: 13, b: true }) + K.t(N.X(1.1) - 4, N.Y(1.1) - 14, "y = x", "s", { s: 13, b: true, a: "end" });
      s += vl(K, N, 0.739085, 0, 0.739085, "f") + K.t(N.X(0.739085) + 4, N.Y(0) + 14, "x* ≈ 0,739", "m", { a: "start", s: 13, b: true });
      return K.svg(640, 330, s);
    });

  add("gstrich", "Prüfkriterium |g′| < 1",
    "Beide Geraden haben den Fixpunkt x* = 2. <b>Links</b> ist g flach (|g′| = 0,5): Jeder Schritt halbiert den Abstand zu x*, die Iteration kommt an. <b>Rechts</b> ist g steiler als die Diagonale (|g′| = 1,8): Jeder Schritt vergrößert den Abstand, die Iteration läuft weg. Der Betrag der Steigung entscheidet – das ist der Kontraktionsfaktor K.",
    function(K){
      var s = K.panel(10, 10, 300, 300, "|g′| = 0,5 < 1: konvergent", "a") + K.panel(330, 10, 300, 300, "|g′| = 1,8 > 1: divergent", "m");
      var g1 = function(x){ return 0.5 * x + 1; }, g2 = function(x){ return 1.8 * x - 1.6; };
      var M = K.map(45, 285, 60, 60), N = K.map(365, 285, 60, 60);
      s += K.axes(45, 285, 5, 250, 245, 5, "x", "y") + K.axes(365, 285, 5, 250, 245, 5, "x", "y");
      s += K.plot(function(x){ return x; }, 0, 3.9, M, "s", { w: 1.4 }) + K.plot(g1, 0, 3.9, M, "a");
      s += cobweb(K, M, g1, 0.4, 5, "m") + K.ring(M.X(2), M.Y(2), "a", 6);
      s += K.t(M.X(0.4), M.Y(0) + 14, "x₀", "m", { s: 13, b: true }) + K.t(M.X(3.6), M.Y(2.8) + 16, "g", "a", { s: 14, b: true, it: true });
      s += K.t(M.X(2.9), M.Y(3.6), "y = x", "s", { a: "end", s: 13, b: true });
      s += K.plot(function(x){ return x; }, 0, 3.9, N, "s", { w: 1.4 }) + K.plot(g2, 0.9, 3.1, N, "m");
      var x = 2.2, pts = [[N.X(x), N.Y(0)]];
      for(var i = 0; i < 4; i++){ var y = g2(x); pts.push([N.X(x), N.Y(y)]); if(y > 3.9) break; pts.push([N.X(y), N.Y(y)]); x = y; }
      s += pl(K, pts, "m", { w: 1.6 }) + K.ring(N.X(2), N.Y(2), "a", 6);
      s += K.t(N.X(2.2), N.Y(0) + 14, "x₀", "m", { s: 13, b: true }) + K.t(N.X(1.15), N.Y(0.9), "g", "m", { s: 14, b: true, it: true });
      s += K.t(N.X(1.0), N.Y(1.6), "y = x", "s", { a: "end", s: 13, b: true }) + K.t(N.X(1.7), N.Y(2.3), "x*", "a", { a: "end", s: 13, b: true });
      return K.svg(640, 320, s);
    });

  add("fehlerab", "Fehlerabschätzung bei Banach",
    "Bei einer Kontraktion wird jeder Schritt höchstens K-mal so lang wie der vorige. Die noch fehlende Strecke bis x* ist also höchstens die <b>Restsumme einer geometrischen Reihe</b>: Kⁿ·d₀ + Kⁿ⁺¹·d₀ + … = <b>Kⁿ/(1−K)·d₀</b>. Weil man d₀ = |x₁ − x₀| nach einem Schritt kennt, lässt sich die nötige Schrittzahl <b>vorab</b> ausrechnen.",
    function(K){
      var s = K.t(320, 22, "Beispiel K = ½, d₀ = |x₁ − x₀| = 1: jeder Schritt halb so lang", "s", { s: 13, b: true });
      function X(v){ return 60 + v * 260; }
      var y = 130, p = [0], d = 1; for(var i = 0; i < 6; i++){ p.push(p[i] + d); d /= 2; }
      s += K.line(40, y, 600, y, "s", { w: 1.4 });
      var hh = [50, 35, 24, 16, 11, 8];
      for(i = 0; i < 6; i++){
        var a = X(p[i]), b = X(p[i + 1]), m = (a + b) / 2;
        s += K.path("M" + a + " " + y + " Q" + m + " " + (y - 2 * hh[i]) + " " + b + " " + y, i % 2 ? "c4" : "a", { w: 1.8 });
      }
      s += K.t((X(0) + X(1)) / 2, y - 62, "d₀ = 1", "a", { s: 13, b: true }) + K.t((X(1) + X(1.5)) / 2, y - 47, "K·d₀ = ½", "c4", { s: 13, b: true }) + K.t((X(1.5) + X(1.75)) / 2 + 6, y - 36, "K²·d₀", "a", { s: 12.5, b: true });
      for(i = 0; i <= 6; i++) s += K.dot(X(p[i]), y, "i", 3.5);
      s += K.t(X(0), y + 18, "x₀", "i", { s: 13, b: true }) + K.t(X(1), y + 18, "x₁", "i", { s: 13, b: true }) + K.t(X(1.5), y + 18, "x₂", "i", { s: 13, b: true });
      s += K.ring(X(2), y, "m", 6) + K.t(X(2) + 4, y + 18, "x*", "m", { s: 13, b: true });
      s += brace(K, X(1.5), X(2), 168, "m", "Rest ≤ K²/(1−K)·d₀ = ½", { s: 13 });
      s += K.f(320, 228, "|xₙ − x*| ≤ Kⁿ/(1−K)·|x₁ − x₀|", "a");
      s += K.t(320, 268, "Ü.6: K = 0,84, |x₁ − x₀| = 0,378, ε = 10⁻⁴ ⇒ n ≥ 58 Schritte", "s", { s: 13 });
      return K.svg(640, 285, s);
    });

  add("bisekt", "Bisektionsverfahren (Ü.4: x² − 2 auf [1, 2])",
    "Oben der Graph, darunter die Intervalle Schritt für Schritt. In jedem Schritt wird die <b>Mitte m</b> getestet: Liegt der Vorzeichenwechsel links von m, bleibt die linke Hälfte, sonst die rechte. Das Intervall <b>halbiert sich jedes Mal</b> und umschließt immer die Nullstelle √2 (gestrichelt) – deshalb konvergiert das Verfahren garantiert.",
    function(K){
      function X(v){ return 80 + (v - 1) * 480; }
      var M = { X: X, Y: function(v){ return 110 - v * 35; } }, s = "";
      s += K.line(60, 110, 580, 110, "s", { w: 1.3 });
      s += K.plot(function(x){ return x * x - 2; }, 1, 2, M, "a");
      s += K.dot(X(1), M.Y(-1), "a", 4.5) + K.dot(X(2), M.Y(2), "a", 4.5);
      s += K.t(X(1), 126 - 30, "f(1) = −1", "a", { s: 12.5, b: true, a: "start" }) + K.t(X(2) + 10, M.Y(2), "f(2) = 2", "a", { s: 12.5, b: true, a: "start" });
      s += K.line(X(Math.SQRT2), 34, X(Math.SQRT2), 314, "m", { w: 1.3, dash: "4 4" }) + K.t(X(Math.SQRT2), 24, "√2", "m", { s: 13, b: true });
      var iv = [[1, 2], [1, 1.5], [1.25, 1.5], [1.375, 1.5], [1.375, 1.4375]], sg = ["f(1,5) > 0", "f(1,25) < 0", "f(1,375) < 0", "f(1,4375) > 0", ""];
      for(var i = 0; i < iv.length; i++){
        var y = 160 + i * 36, a = X(iv[i][0]), b = X(iv[i][1]), m = (a + b) / 2;
        s += K.rect(a, y - 8, b - a, 16, "a", { fill: "fa", rx: 2 });
        s += K.t(40, y, "n = " + i, "s", { s: 12.5, b: true });
        if(sg[i]){ s += K.line(m, y - 12, m, y + 12, sg[i].indexOf(">") > 0 ? "c4" : "c3", { w: 2.4 }); s += K.t(586, y, sg[i], sg[i].indexOf(">") > 0 ? "c4" : "c3", { a: "start", s: 12, b: true }); }
      }
      s += K.t(586, 160 + 4 * 36, "Länge 1/16", "a", { a: "start", s: 12, b: true });
      return K.svg(680, 330, s);
    });

  add("bisfehler", "Fehler der Bisektion: (b − a)/2ⁿ",
    "Jeder Schritt halbiert die Intervalllänge – auf der logarithmischen Achse eine <b>gleichmäßig fallende Treppe</b>. Für b − a = 1 und ε = 10⁻³ braucht man n ≥ log₂ 1000 ≈ 9,97, also <b>10 Schritte</b>. Weil 2¹⁰ ≈ 10³ ist, kostet jede Dezimalstelle rund <b>3,3 Schritte</b> – sicher, aber langsam (lineare Konvergenz).",
    function(K){
      function X(n){ return 80 + n * 42; }
      function Y(L){ return 50 + (-Math.log(L) / Math.LN10) * 61; }
      var s = K.t(320, 22, "b − a = 1: Intervalllänge nach n Schritten (log. Achse)", "s", { s: 13, b: true });
      s += K.line(70, 50, 70, 290, "s", { w: 1.3 }) + K.line(70, 290, 600, 290, "s", { w: 1.3 });
      ["1", "10⁻¹", "10⁻²", "10⁻³"].forEach(function(t, k){ s += K.line(66, 50 + k * 61, 74, 50 + k * 61, "s") + K.t(60, 50 + k * 61, t, "s", { a: "end", s: 12.5 }); });
      s += K.line(70, Y(1e-3), 600, Y(1e-3), "m", { w: 1.5, dash: "6 4" }) + K.t(596, Y(1e-3) - 12, "ε = 10⁻³", "m", { a: "end", s: 13, b: true });
      var pts = []; for(var n = 0; n <= 12; n++){ pts.push([X(n), Y(Math.pow(2, -n))]); }
      s += pl(K, pts, "f", { w: 1.2 });
      for(n = 0; n <= 12; n++){ s += K.dot(X(n), Y(Math.pow(2, -n)), n === 10 ? "m" : "a", n === 10 ? 6 : 4.5); if(n % 2 === 0) s += K.line(X(n), 286, X(n), 294, "s") + K.t(X(n), 306, String(n), "s", { s: 12 }); }
      s += K.t(600, 306, "n", "s", { s: 13, it: true, a: "end" });
      s += K.t(330, 72, "n ≥ log₂((b − a)/ε) = log₂ 1000 ≈ 9,97", "a", { a: "start", s: 13, b: true });
      s += K.t(330, 96, "⇒ n = 10 (2⁻¹⁰ ≈ 0,00098 < ε)", "m", { a: "start", s: 13, b: true });
      s += K.t(330, 120, "≈ 3,3 Schritte je Dezimalstelle", "s", { a: "start", s: 13 });
      return K.svg(640, 320, s);
    });

  add("newton", "Newton-Verfahren: Tangente statt Kurve",
    "Im Punkt (x<sub>n</sub>, f(x<sub>n</sub>)) wird f durch seine <b>Tangente</b> ersetzt; wo sie die x-Achse trifft, liegt die neue Näherung. Für f(x) = x² − 2 ab x₀ = 2: x₁ = 1,5 (der Startwert aus Ü.5), x₂ = 1,41667 – schon kaum noch von √2 zu unterscheiden. Nahe der Nullstelle ist die Tangente fast deckungsgleich mit der Kurve – darum die <b>quadratische</b> Konvergenz.",
    function(K){
      var M = { X: function(v){ return 60 + (v - 1.2) * 500; }, Y: function(v){ return 250 - v * 75; } }, s = "";
      s += K.line(40, 250, 600, 250, "s", { w: 1.3 });
      s += K.plot(function(x){ return x * x - 2; }, 1.25, 2.18, M, "a");
      s += K.line(M.X(1.45), M.Y(-0.2), M.X(2.12), M.Y(2.48), "c3", { w: 1.8 });
      s += K.line(M.X(1.38), M.Y(-0.11), M.X(1.62), M.Y(0.61), "c4", { w: 1.8 });
      s += K.line(M.X(2), M.Y(0), M.X(2), M.Y(2), "f", { w: 1.3, dash: "4 4" }) + K.line(M.X(1.5), M.Y(0), M.X(1.5), M.Y(0.25), "f", { w: 1.3, dash: "4 4" });
      s += K.dot(M.X(2), M.Y(2), "c3", 5) + K.dot(M.X(1.5), M.Y(0.25), "c4", 5);
      s += K.dot(M.X(2), M.Y(0), "i", 4) + K.dot(M.X(1.5), M.Y(0), "i", 4) + K.ring(M.X(1.416667), M.Y(0), "m", 5);
      s += K.t(M.X(2), 268, "x₀ = 2", "c3", { s: 13, b: true }) + K.t(M.X(1.5) + 6, 268, "x₁ = 1,5", "c4", { s: 13, b: true, a: "start" }) + K.t(M.X(1.416667) - 4, 288, "x₂ = 1,41667", "m", { s: 13, b: true, a: "end" });
      s += K.t(M.X(2.12) + 6, M.Y(2.48) + 4, "Tangente in x₀", "c3", { s: 12.5, b: true, a: "start" });
      s += K.t(300, 232, "Tangente in x₁", "c4", { s: 12.5, b: true, a: "start" });
      s += K.t(M.X(2.17), 32, "f(x) = x² − 2", "a", { s: 13, b: true, a: "end" });
      s += K.f(190, 44, "xₙ₊₁ = xₙ − f(xₙ)/f′(xₙ)", "a");
      s += lines(K, 80, 92, ["x₀ = 2 → 1,5 → 1,41667 → 1,4142157", "korrekte Stellen: 1 → 3 → 6 → 8"], "s");
      return K.svg(640, 305, s);
    });

  add("newtonfail", "Newton konvergiert nur lokal",
    "Zwei typische Pannen. <b>Links:</b> Für f(x) = x³ − 2x + 2 und x₀ = 0 zeigt die Tangente genau auf x₁ = 1, und die Tangente dort zeigt zurück auf 0 – das Verfahren <b>pendelt endlos</b> und findet die echte Nullstelle bei −1,77 nie. <b>Rechts:</b> Ist f′(x₀) fast 0, verläuft die Tangente beinahe waagerecht und schießt die Näherung <b>weit weg</b>. Abhilfe: erst einen guten Startwert einkreisen.",
    function(K){
      var s = K.panel(10, 10, 300, 300, "Zyklus 0 → 1 → 0 → …", "m") + K.panel(330, 10, 300, 300, "f′(x₀) ≈ 0: Sprung ins Weite", "m");
      var f = function(x){ return x * x * x - 2 * x + 2; }, M = { X: function(v){ return 40 + (v + 2) * 70; }, Y: function(v){ return 200 - v * 40; } };
      s += K.line(25, 200, 300, 200, "s", { w: 1.3 });
      s += K.plot(f, -2, 1.6, M, "a");
      s += K.line(M.X(-0.2), M.Y(2.4), M.X(1.15), M.Y(-0.3), "c3", { w: 1.8 }) + K.line(M.X(-0.15), M.Y(-0.15), M.X(1.2), M.Y(1.2), "c4", { w: 1.8 });
      s += K.line(M.X(1), M.Y(0), M.X(1), M.Y(1), "f", { dash: "4 4" }) + K.line(M.X(0), M.Y(0), M.X(0), M.Y(2), "f", { dash: "4 4" });
      s += K.dot(M.X(0), M.Y(2), "c3", 5) + K.dot(M.X(1), M.Y(1), "c4", 5);
      s += K.t(M.X(0), 222, "x₀ = 0", "c3", { s: 13, b: true }) + K.t(M.X(1), 222, "x₁ = 1", "c4", { s: 13, b: true });
      s += K.ring(M.X(-1.7693), M.Y(0), "m", 6) + K.t(64, 244, "echte Nullstelle", "m", { s: 12.5, b: true, a: "start" });
      s += K.t(160, 288, "x₂ = 0 = x₀ – pendelt ewig", "m", { s: 13, b: true });
      var N = { X: function(v){ return 360 + (v + 2) * 55; }, Y: function(v){ return 200 - v * 35; } };
      s += K.line(345, 200, 615, 200, "s", { w: 1.3 });
      s += K.plot(function(x){ return x * x - 2; }, -2, 2.5, N, "a");
      s += K.ring(N.X(-Math.SQRT2), N.Y(0), "a", 5) + K.ring(N.X(Math.SQRT2), N.Y(0), "a", 5);
      s += K.dot(N.X(0.1), N.Y(-1.99), "c3", 5);
      s += K.line(N.X(-2), N.Y(-1.99 + 0.2 * (-2.1)), N.X(2.3), N.Y(-1.99 + 0.2 * 2.2), "c3", { w: 1.8 });
      s += K.arrow(N.X(2.3), N.Y(-1.99 + 0.2 * 2.2), 612, N.Y(-1.99 + 0.2 * 2.6) - 1, "c3", { w: 1.8, head: 9 });
      s += K.t(N.X(0.1), N.Y(-1.99) + 20, "x₀ = 0,1", "c3", { s: 13, b: true });
      s += K.t(605, 228, "→ x₁ ≈ 10", "m", { s: 13, b: true, a: "end" });
      s += K.t(480, 50, "Tangente fast waagerecht", "s", { s: 12.5 });
      s += K.t(N.X(1.8), N.Y(3.24) - 2, "x² − 2", "a", { s: 13, b: true, a: "end" });
      return K.svg(640, 320, s);
    });

  add("babylon", "Babylonisches Wurzelziehen: aus dem Rechteck wird ein Quadrat",
    "Gesucht ist √2 – die Seite eines Quadrats mit Fläche 2. Man startet mit einem Rechteck der Fläche 2 (Breite x₀ = 2, Höhe 2/x₀ = 1). Die neue Breite ist der <b>Mittelwert von Breite und Höhe</b>, die Höhe ergibt sich wieder aus Fläche 2. Nach zwei Schritten sind beide Seiten schon fast gleich: 1,4167 und 1,4118 – genau das ist Newton für f(x) = x² − 2.",
    function(K){
      var s = K.f(320, 30, "xₙ₊₁ = ½·( xₙ + a/xₙ ),  a = 2", "a"), u = 90, yb = 250;
      var xs = [2, 1.5, 17 / 12], px = [30, 250, 450], hl2 = ["2/x₀ = 1", "2/x₁ = 1,333", "2/x₂ = 1,4118"], wl = ["x₀ = 2", "x₁ = 1,5", "x₂ = 1,41667"];
      for(var i = 0; i < 3; i++){
        var w = xs[i] * u, h = 2 / xs[i] * u;
        s += K.rect(px[i], yb - h, w, h, i === 2 ? "m" : "a", { fill: i === 2 ? "fm" : "fa", rx: 1, w: 1.6 });
        s += K.t(px[i] + w / 2, yb - h - 14, wl[i], i === 2 ? "m" : "a", { s: 13, b: true });
        s += K.t(px[i] + 8, yb - h + 15, hl2[i], "s", { a: "start", s: 12.5, halo: false });
        s += K.t(px[i] + w / 2, yb - h / 2 + 6, "Fläche 2", "i", { s: 13, b: true, halo: false });
      }
      s += K.arrow(214, 200, 244, 200, "s", { w: 2, head: 9 }) + K.arrow(390, 200, 444, 200, "s", { w: 2, head: 9 });
      s += K.t(320, 280, "Breite und Höhe rücken zusammen – beide nähern sich √2 = 1,41421…", "s", { s: 13 });
      return K.svg(640, 295, s);
    });

  add("konvvgl", "Konvergenzgeschwindigkeit im Vergleich",
    "Aufgetragen ist die Zahl der <b>korrekten Dezimalstellen</b> nach n Schritten. Bisektion (Fehlerschranke, √2) und Banach (cos x, K ≈ 0,84) wachsen <b>linear</b> – pro Schritt kommt ungefähr gleich viel dazu. Newton (√2 ab 1,5) <b>verdoppelt</b> die Stellen pro Schritt: 1 → 3 → 6 → 12. Praxis: erst sicher einkreisen, dann mit Newton schnell fertig rechnen.",
    function(K){
      function X(n){ return 80 + n * 50; }
      function Y(d){ return 280 - d * 19; }
      var s = K.line(70, 280, 620, 280, "s", { w: 1.3 }) + K.line(70, 280, 70, 40, "s", { w: 1.3 });
      for(var d = 0; d <= 12; d += 3) s += K.line(66, Y(d), 74, Y(d), "s") + K.t(60, Y(d), String(d), "s", { a: "end", s: 12 });
      for(var n = 0; n <= 10; n += 2) s += K.line(X(n), 276, X(n), 284, "s") + K.t(X(n), 297, String(n), "s", { s: 12 });
      s += K.t(615, 297, "n", "s", { it: true, s: 13, a: "end" }) + K.t(80, 28, "korrekte Dezimalstellen", "s", { s: 13, b: true, a: "start" });
      var bis = [], ban = [], nw = [], x = 0.5, xn = 1.5, xs = 0.7390851332, r2 = Math.SQRT2;
      for(n = 0; n <= 10; n++){
        bis.push([X(n), Y(-Math.log(0.5 * Math.pow(0.5, n)) / Math.LN10)]);
        ban.push([X(n), Y(-Math.log(Math.abs(x - xs)) / Math.LN10)]); x = Math.cos(x);
      }
      for(n = 0; n <= 3; n++){ nw.push([X(n), Y(-Math.log(Math.abs(xn - r2)) / Math.LN10)]); xn = 0.5 * (xn + 2 / xn); }
      s += pl(K, bis, "a", { w: 2 }) + pl(K, ban, "c4", { w: 2, dash: "6 4" }) + pl(K, nw, "m", { w: 2.4 });
      bis.forEach(function(p){ s += K.dot(p[0], p[1], "a", 3.5); }); ban.forEach(function(p){ s += K.dot(p[0], p[1], "c4", 3.5); }); nw.forEach(function(p){ s += K.dot(p[0], p[1], "m", 4.5); });
      s += K.t(X(3) + 10, nw[3][1], "Newton: quadratisch", "m", { a: "start", s: 13, b: true });
      s += K.t(X(10) + 4, bis[10][1] - 14, "Bisektion", "a", { a: "end", s: 13, b: true });
      s += K.t(X(10) + 4, ban[10][1] + 16, "Banach (K = 0,84)", "c4", { a: "end", s: 13, b: true });
      s += K.t(360, 130, "linear: gleich viel pro Schritt", "s", { s: 13 });
      return K.svg(640, 310, s);
    });

  /* ═════════ Kapitel 3: Interpolation ═════════ */
  var P8 = function(x){ return (11 * x * x * x - 25 * x * x - 58 * x) / 72 + 1; };
  var X8 = [-2, 0, 1, 4], F8 = [0, 1, 0, 2];

  add("interp", "Das Interpolationsproblem P(xᵢ) = fᵢ",
    "Bekannt sind nur die vier Punkte (Stützstellen xᵢ mit Stützwerten fᵢ, Daten aus Ü.8). Die Interpolierende P muss <b>genau durch diese Punkte</b> gehen – dazwischen ist sie frei. Die gestrichelte „wahre“ Funktion geht ebenfalls durch alle Punkte und weicht zwischen ihnen trotzdem ab: Interpolation kennt nur, was an den Stützstellen festgelegt ist.",
    function(K){
      var M = K.map(230, 200, 75, 45), s = "";
      s += xaxis(K, M, -2.6, 5.2, "x");
      s += K.plot(function(x){ return P8(x) + 0.03 * (x + 2) * x * (x - 1) * (x - 4); }, -2.3, 4.1, M, "s", { w: 1.8, dash: "6 5" });
      s += K.plot(P8, -2.4, 4.3, M, "a");
      for(var i = 0; i < 4; i++){
        s += vl(K, M, X8[i], 0, F8[i], "f") + K.dot(M.X(X8[i]), M.Y(F8[i]), "m", 6);
        s += K.t(M.X(X8[i]) + (i === 0 ? 18 : 0), M.Y(0) + 18, "x" + "₀₁₂₃"[i] + " = " + String(X8[i]).replace("-", "−"), "s", { s: 12.5, b: true });
      }
      s += K.t(M.X(-2) - 8, M.Y(0) - 16, "f₀ = 0", "m", { s: 13, b: true, a: "end" });
      s += K.t(M.X(0) + 2, M.Y(1) - 22, "f₁ = 1", "m", { s: 13, b: true });
      s += K.t(M.X(1) + 10, M.Y(0) - 14, "f₂ = 0", "m", { s: 13, b: true, a: "start" });
      s += K.t(M.X(4) + 12, M.Y(2) + 18, "f₃ = 2", "m", { s: 13, b: true, a: "start" });
      s += K.f(170, 36, "P(xᵢ) = fᵢ", "a");
      s += K.t(250, 36, "— P: Interpolierende", "a", { a: "start", s: 12.5, b: true }) + K.t(250, 58, "- - f: unbekannte Funktion", "s", { a: "start", s: 12.5 });
      return K.svg(640, 290, s);
    });

  add("ansatz", "Ansatz P(x) = ∑ cₖ·Φₖ(x)",
    "Die Interpolierende wird aus fertigen Bausteinen Φₖ zusammengesetzt, jeder mit einem Gewicht cₖ. Mit den Monomen 1, x, x² und den Punkten aus Ü.7 ergeben sich c = (1; 3,5; −1,5): <b>Konstante + Gerade + Parabel</b> überlagern sich zur Kurve, die genau durch (0, 1), (1, 3), (2, 2) läuft. Die cₖ kommen aus einem linearen Gleichungssystem – je geschickter die Bausteine, desto leichter dieses System.",
    function(K){
      var s = "", tl = ["1 · 1", "3,5 · x", "−1,5 · x²", "= P(x)"], cols = ["c4", "c3", "a", "m"];
      var fs = [function(){ return 1; }, function(x){ return 3.5 * x; }, function(x){ return -1.5 * x * x; }, function(x){ return -1.5 * x * x + 3.5 * x + 1; }];
      for(var k = 0; k < 4; k++){
        var px = 10 + k * 157;
        s += K.panel(px, 10, 147, 260, tl[k], cols[k]);
        var M = K.map(px + 22, 160, 55, 16);
        s += K.line(px + 12, 160, px + 140, 160, "s", { w: 1.2 }) + K.line(px + 22, 48, px + 22, 262, "s", { w: 1.2 });
        s += K.plot(fs[k], 0, 2.05, M, cols[k]);
        if(k === 3){ [[0, 1], [1, 3], [2, 2]].forEach(function(p){ s += K.dot(M.X(p[0]), M.Y(p[1]), "i", 4.5); }); }
        if(k < 2) s += K.t(px + 147 + 5, 140, "+", "i", { s: 18, b: true });
        s += K.t(M.X(1), 172, "1", "f", { s: 12 }) + K.t(M.X(2), 172, "2", "f", { s: 12 });
      }
      s += K.t(320, 290, "Koeffizienten cₖ aus ∑ cₖ·Φₖ(xᵢ) = fᵢ (lineares Gleichungssystem)", "s", { s: 13 });
      return K.svg(640, 305, s);
    });

  add("eindeutig", "Satz 3.1: genau ein Interpolationspolynom",
    "Angenommen, zwei verschiedene Parabeln P und Q gingen durch dieselben drei Punkte. Dann wäre ihre <b>Differenz D = P − Q</b> wieder ein Polynom höchstens 2. Grades, hätte aber an allen drei Stützstellen eine Nullstelle. Eine Parabel kann die Achse aber <b>höchstens zweimal</b> schneiden – also ist D ≡ 0 und P = Q.",
    function(K){
      var s = K.panel(10, 10, 300, 280, "drei Punkte → eine Parabel", "a") + K.panel(330, 10, 300, 280, "D = P − Q: höchstens 2 Nullstellen", "m");
      var M = K.map(50, 240, 100, 55), P = function(x){ return -1.5 * x * x + 3.5 * x + 1; };
      s += K.line(35, 240, 295, 240, "s", { w: 1.3 });
      s += K.plot(P, -0.1, 2.4, M, "a");
      var Q = function(x){ return -2.5 * x * x + 4.5 * x + 1; };
      s += K.plot(Q, -0.05, 2.0, M, "c3", { dash: "6 4", ymin: -0.3 });
      [[0, 1], [1, 3], [2, 2]].forEach(function(p){ s += K.dot(M.X(p[0]), M.Y(p[1]), "i", 5); });
      s += K.ring(M.X(2), M.Y(Q(2)), "m", 6) + K.t(M.X(2) - 10, M.Y(Q(2)) + 16, "Q verfehlt", "m", { s: 12.5, b: true, a: "end" });
      s += K.t(M.X(2.35), M.Y(P(2.35)) - 16, "P", "a", { s: 14, b: true, it: true }) + K.t(M.X(0.6), M.Y(Q(0.6)) - 34, "Q?", "c3", { s: 14, b: true, it: true });
      var N = K.map(380, 160, 90, 40), D = function(x){ return (x - 0.2) * (x - 1.8) * 1.2; };
      s += K.line(350, 160, 615, 160, "s", { w: 1.3 });
      s += K.plot(D, -0.25, 2.45, N, "m");
      s += K.ring(N.X(0.2), N.Y(0), "m", 5) + K.ring(N.X(1.8), N.Y(0), "m", 5);
      s += K.t(N.X(1), N.Y(0) - 16, "1., 2. Nullstelle ✓", "m", { s: 12.5, b: true });
      s += K.dot(N.X(2.5), N.Y(0), "f", 5) + K.t(N.X(2.5), N.Y(0) + 22, "3. ✗", "f", { s: 13, b: true });
      s += K.t(480, 248, "Grad ≤ 2, aber 3 Nullstellen", "s", { s: 13 }) + K.t(480, 270, "⇒ D ≡ 0 ⇒ P = Q", "m", { s: 13, b: true });
      return K.svg(640, 300, s);
    });

  add("lagrange", "Lagrange-Polynome als Schalter",
    "Die drei Lagrange-Polynome zu x₀ = −2, x₁ = 0, x₂ = 1 (Beispiel im Heft). Jedes ist an <b>seiner</b> Stützstelle genau 1 (großer Punkt) und an den <b>beiden anderen</b> genau 0. Darum „schaltet“ fₖ·Lₖ den Wert fₖ genau an xₖ ein und stört an den anderen Stellen nicht – die Summe erfüllt alle Bedingungen ohne Gleichungssystem.",
    function(K){
      var M = K.map(70 + 2.5 * 130, 210, 130, 110), s = "";
      var L = [function(x){ return x * (x - 1) / 6; }, function(x){ return -(x + 2) * (x - 1) / 2; }, function(x){ return (x + 2) * x / 3; }], cols = ["a", "m", "c4"], xs = [-2, 0, 1];
      s += xaxis(K, M, -2.55, 1.6, "x") + hl(K, M, 1, -2.5, 1.45, "f");
      s += K.t(M.X(-2.5) - 6, M.Y(1), "1", "s", { a: "end", s: 13, b: true });
      for(var i = 0; i < 3; i++){ s += K.line(M.X(xs[i]), 40, M.X(xs[i]), M.Y(0), "f", { w: 1.2, dash: "3 4" }); s += K.t(M.X(xs[i]), 26, "x" + "₀₁₂"[i] + " = " + xs[i], "s", { s: 13, b: true }); }
      s += K.plot(L[0], -2.4, 1.4, M, "a") + K.plot(L[1], -2.4, 1.4, M, "m") + K.plot(L[2], -2.4, 1.3, M, "c4");
      for(i = 0; i < 3; i++) for(var j = 0; j < 3; j++){ s += i === j ? K.dot(M.X(xs[j]), M.Y(1), cols[i], 6.5) : K.ring(M.X(xs[j]), M.Y(0), cols[i], 4.5); }
      s += K.t(M.X(-2.3), M.Y(L[0](-2.3)) - 18, "L₀", "a", { s: 15, b: true }) + K.t(M.X(-0.5), M.Y(1.125) - 16, "L₁", "m", { s: 15, b: true }) + K.t(M.X(1.25) + 10, M.Y(L[2](1.25)), "L₂", "c4", { s: 15, b: true, a: "start" });
      s += K.f(330, 296, "Lₖ(xᵢ) = 1 für i = k, sonst 0", "a");
      return K.svg(640, 320, s);
    });

  add("lagsum", "P(x) = ∑ fₖ·Lₖ(x) – Ü.7",
    "Für die Punkte (0, 1), (1, 3), (2, 2) werden die Lagrange-Polynome mit ihren Stützwerten gestreckt (dünne Linien): 1·L₀, 3·L₁ und 2·L₂. An jeder Stützstelle ist <b>nur einer</b> dieser Summanden ungleich 0. Die Summe (dick) läuft daher automatisch durch alle drei Punkte: P(x) = −1,5x² + 3,5x + 1.",
    function(K){
      var M = K.map(60 + 0.2 * 215, 210, 215, 48), s = "";
      var A = function(x){ return (x - 1) * (x - 2) / 2; }, B = function(x){ return -3 * x * (x - 2); }, C = function(x){ return x * (x - 1); }, P = function(x){ return -1.5 * x * x + 3.5 * x + 1; };
      s += xaxis(K, M, -0.25, 2.4, "x");
      s += K.plot(A, -0.2, 2.2, M, "c4", { w: 1.5, dash: "5 4" }) + K.plot(B, -0.2, 2.2, M, "c3", { w: 1.5, dash: "5 4" }) + K.plot(C, -0.2, 2.2, M, "a", { w: 1.5, dash: "5 4" });
      s += K.plot(P, -0.2, 2.2, M, "m", { w: 3 });
      [[0, 1], [1, 3], [2, 2]].forEach(function(p){ s += vl(K, M, p[0], 0, p[1], "f") + K.dot(M.X(p[0]), M.Y(p[1]), "i", 5.5); });
      s += tick(K, M, 1, "1") + tick(K, M, 2, "2");
      s += K.t(M.X(-0.17) + 2, M.Y(A(-0.17)) - 14, "1·L₀", "c4", { s: 13, b: true, a: "start" });
      s += K.t(M.X(1.9) - 8, M.Y(B(1.9)), "3·L₁", "c3", { s: 13, b: true, a: "end" });
      s += K.t(M.X(2.2) + 4, M.Y(C(2.2)), "2·L₂", "a", { s: 13, b: true, a: "start" });
      s += K.t(M.X(2.2) + 4, M.Y(P(2.2)), "P", "m", { s: 15, b: true, it: true, a: "start" });
      s += K.f(200, 26, "P = 1·L₀ + 3·L₁ + 2·L₂", "a");
      s += K.f(340, 286, "P(x) = −1,5x² + 3,5x + 1", "m", { fill: "fm" });
      return K.svg(640, 310, s);
    });

  add("newtonform", "Newton-Form: Stützstelle für Stützstelle",
    "Die Newton-Form baut das Polynom <b>schrittweise</b> auf (Daten Ü.8). Jeder neue Summand cₖ·(x − x₀)···(x − xₖ₋₁) ist an allen bisherigen Stützstellen <b>null</b> – er verändert die schon erreichten Punkte nicht, sondern biegt die Kurve nur so, dass sie zusätzlich den nächsten Punkt trifft. Darum kostet eine neue Stützstelle nur einen weiteren Summanden.",
    function(K){
      var M = K.map(60 + 2.5 * 75, 200, 75, 40), s = "";
      var P0 = function(){ return 0; }, P1 = function(x){ return 0.5 * (x + 2); }, P2 = function(x){ return 0.5 * (x + 2) * (1 - x); };
      s += xaxis(K, M, -2.6, 4.9, "x");
      s += K.plot(P1, -2.5, 4.5, M, "c4", { w: 1.8, ymax: 3.6 }) + K.plot(P2, -2.5, 4.5, M, "c3", { w: 1.8, ymin: -2.2 }) + K.plot(P8, -2.4, 4.3, M, "a", { w: 2.6, ymax: 3.6 });
      s += K.line(M.X(-2.5), M.Y(0) - 0.01, M.X(4.5), M.Y(0) - 0.01, "s", { w: 2.2, dash: "2 5" });
      for(var i = 0; i < 4; i++) s += K.dot(M.X(X8[i]), M.Y(F8[i]), "m", 5.5);
      s += K.t(M.X(4.55), M.Y(0) - 14, "P₀ = 0", "s", { s: 13, b: true, a: "end" });
      s += K.t(M.X(2.9) - 6, M.Y(P1(2.9)) - 16, "P₁ = ½(x+2)", "c4", { s: 13, b: true });
      s += K.t(M.X(1.9) + 8, M.Y(P2(1.9)), "P₂ = P₁ − ½(x+2)x", "c3", { s: 13, b: true, a: "start" });
      s += K.t(M.X(3.3) + 10, M.Y(P8(4.25)) - 10, "P₃ = P₂ + 11/72·(x+2)x(x−1)", "a", { s: 13, b: true, a: "end" });
      s += K.t(320, 300, "jeder neue Summand ist an den alten Stützstellen null", "s", { s: 13 });
      return K.svg(640, 315, s);
    });

  add("diffschema", "Differenzenschema (Ü.8)",
    "Jede neue Zahl entsteht aus ihren <b>zwei linken Nachbarn</b>: Differenz der Nachbarn geteilt durch die Differenz der <b>äußersten</b> beteiligten x-Werte – z. B. (−1 − ½)/(1 − (−2)) = −½. Die Koeffizienten der Newton-Form sind die <b>obersten Einträge</b> jeder Spalte (rot): c₀ = 0, c₁ = ½, c₂ = −½, c₃ = 11/72.",
    function(K){
      var s = "", cx = [60, 140, 265, 405, 545], hd = ["xₖ", "fₖ", "1. Ordnung", "2. Ordnung", "3. Ordnung"];
      for(var i = 0; i < 5; i++) s += K.t(cx[i], 26, hd[i], "s", { s: 13, b: true });
      var col = [["−2", "0", "1", "4"], ["0", "1", "0", "2"], ["½", "−1", "⅔"], ["−½", "5/12"], ["11/72"]];
      var y0 = 66, dy = 30;
      function Y(c, r){ return y0 + (c < 2 ? 2 * r : 2 * r + (c - 1)) * dy; }
      for(var c = 2; c < 5; c++) for(var r = 0; r < col[c].length; r++){
        var y = Y(c, r);
        s += K.line(cx[c - 1] + 36, Y(c - 1, r), cx[c] - 40, y, "f", { w: 1.2 }) + K.line(cx[c - 1] + 36, Y(c - 1, r + 1), cx[c] - 40, y, "f", { w: 1.2 });
      }
      for(c = 0; c < 5; c++) for(r = 0; r < col[c].length; r++){
        var top = r === 0 && c >= 1, w = c < 2 ? 50 : 76;
        s += K.cell(cx[c], Y(c, r), col[c][r], c === 0 ? "s" : top ? "m" : "a", { w: w, h: 30, fill: c === 0 ? "p" : top ? "fm" : "fa", s: 14 });
      }
      s += K.t(cx[1] + 30, Y(1, 0) - 24, "c₀", "m", { s: 13, b: true }) + K.t(cx[2], Y(2, 0) - 24, "c₁", "m", { s: 13, b: true });
      s += K.t(cx[3], Y(3, 0) - 24, "c₂", "m", { s: 13, b: true }) + K.t(cx[4], Y(4, 0) - 24, "c₃", "m", { s: 13, b: true });
      s += K.t(405, 276, "(−1 − ½)/(1 − (−2)) = −½", "s", { s: 12.5 });
      s += K.f(320, 312, "P(x) = 0 + ½(x+2) − ½(x+2)x + 11/72·(x+2)x(x−1)", "a", { s: 12.5 });
      return K.svg(640, 330, s);
    });

  add("restglied", "Interpolationsfehler und ω(x) = ∏(x − xᵢ)",
    "Der Fehler f − Pₙ ist ein Vielfaches von ω(x) = (x − x₀)(x − x₁)···(x − xₙ), hier für die Stützstellen 0, 1, 2, 3, 4. ω ist an jeder Stützstelle <b>null</b> (dort stimmt P exakt), zwischen den inneren Stellen <b>klein</b> und in den <b>Randlücken groß</b>. Deshalb ist Interpolation in der Mitte am genauesten – und außerhalb des Intervalls (Extrapolation) unzuverlässig.",
    function(K){
      var M = K.map(80, 160, 110, 30), s = "";
      var w = function(x){ return x * (x - 1) * (x - 2) * (x - 3) * (x - 4); };
      s += K.f(320, 24, "f(x) − Pₙ(x) = f⁽ⁿ⁺¹⁾(ξ)/(n+1)! · ω(x)", "a");
      s += xaxis(K, M, -0.4, 4.6, "x");
      s += K.area(w, 0, 1, M, "fm") + K.area(w, 3, 4, M, "fm") + K.area(w, 1, 3, M, "fa");
      s += K.plot(w, -0.12, 4.12, M, "a", { ymin: -4.3, ymax: 4.3 });
      for(var i = 0; i <= 4; i++) s += K.dot(M.X(i), M.Y(0), "i", 4.5) + K.t(M.X(i) + [10, -10, 10, -10, -10][i], M.Y(0) + (i === 4 ? -16 : 16), "x" + "₀₁₂₃₄"[i], "s", { s: 13, b: true });
      s += K.t(M.X(0.5), M.Y(3.28) - 18, "Rand: groß", "m", { s: 13, b: true }) + K.t(M.X(3.5), M.Y(-3.28) + 18, "Rand: groß", "m", { s: 13, b: true });
      s += K.t(M.X(2), M.Y(1.41) - 32, "Mitte: klein", "a", { s: 13, b: true });
      s += lines(K, 570, 196, ["ξ liegt", "irgendwo in", "[x₀, xₙ] –", "man setzt", "max |f⁽ⁿ⁺¹⁾|", "ein"], "s", { s: 12.5, lh: 19 });
      return K.svg(680, 300, s);
    });

  add("runge", "Überschwinger bei vielen Stützstellen",
    "Die Funktion 1/(1 + 25x²) (gestrichelt) wird an 11 gleichabständigen Stellen interpoliert. Das Polynom 10. Grades (rot) trifft alle Punkte, <b>schwingt aber an den Rändern</b> bis fast 2 über. Der kubische Spline (blau) setzt sich aus Stücken niedrigen Grades zusammen und bleibt ruhig – genau dieses Problem umgehen Splines.",
    function(K){
      var f = function(x){ return 1 / (1 + 25 * x * x); }, xs = [], fs = [];
      for(var i = 0; i <= 10; i++){ xs.push(-1 + i * 0.2); fs.push(f(-1 + i * 0.2)); }
      var P = lagr(xs, fs), Sp = cubic(xs, fs, "nat"), M = K.map(320, 250, 250, 110), s = "";
      s += xaxis(K, M, -1.12, 1.15, "x") + K.line(320, 296, 320, 30, "s", { w: 1.2 });
      s += K.plot(P, -1, 1, M, "m", { w: 2.2, n: 500 }) + K.plot(Sp, -1, 1, M, "a", { w: 2.4 }) + K.plot(f, -1, 1, M, "i", { w: 1.6, dash: "5 4" });
      for(i = 0; i <= 10; i++) s += K.dot(M.X(xs[i]), M.Y(fs[i]), "i", 4);
      s += tick(K, M, -1, "−1") + tick(K, M, 1, "1");
      s += K.t(M.X(-0.94) + 12, M.Y(P(-0.94)) - 2, "P₁₀: Überschwinger bis ≈ 1,96", "m", { s: 13, b: true, a: "start" });
      s += K.t(M.X(0.3) + 6, M.Y(0.9), "Spline: ruhig", "a", { s: 13, b: true, a: "start" });
      s += K.t(M.X(-0.3) - 6, M.Y(0.9), "f = 1/(1 + 25x²)", "i", { s: 13, a: "end" });
      return K.svg(640, 310, s);
    });

  var SX = [0, 1, 2, 3, 4], SF = [1, 2.5, 1.5, 3, 2];

  add("spline", "Spline vom Grad m (Def. 3.4)",
    "Ein Spline ist <b>stückweise</b> ein Polynom: Auf jedem Teilintervall zwischen zwei Knoten (Farbwechsel) gilt ein eigenes Polynom höchstens m-ten Grades. An den Knoten werden die Stücke so zusammengesetzt, dass Wert und die ersten <b>m − 1 Ableitungen</b> übereinstimmen – hier kubisch (m = 3): kein Knick, kein Krümmungssprung.",
    function(K){
      var Sp = cubic(SX, SF, "nat"), M = K.map(70, 260, 120, 60), s = "";
      s += xaxis(K, M, -0.2, 4.4, "x");
      for(var i = 0; i < 4; i++){
        s += K.plot(Sp, SX[i], SX[i + 1], M, pieceColor(i), { w: 3 });
        s += K.t(M.X(i + 0.5), 282, "p" + "₀₁₂₃"[i] + ": Grad ≤ m", pieceColor(i), { s: 12.5, b: true });
      }
      for(i = 0; i <= 4; i++) s += vl(K, M, SX[i], 0, SF[i], "f") + K.dot(M.X(SX[i]), M.Y(SF[i]), "m", 5.5) + K.line(M.X(i), M.Y(0) - 4, M.X(i), M.Y(0) + 4, "s");
      s += K.t(M.X(1), M.Y(2.5) - 20, "Knoten x₁", "m", { s: 12.5, b: true }) + K.t(M.X(3), M.Y(3) - 20, "Knoten x₃", "m", { s: 12.5, b: true });
      s += K.f(320, 28, "Übergänge (m−1)-mal stetig differenzierbar", "a");
      return K.svg(640, 300, s);
    });

  add("splinetypen", "Linearer, quadratischer und kubischer Spline",
    "Dieselben vier Punkte, drei Splinetypen. <b>Linear:</b> Polygonzug – stetig, aber mit Knicken. <b>Quadratisch:</b> Parabelstücke ohne Knick (s′ stetig), braucht <b>eine</b> Zusatzangabe – hier s′(x₀) = 2. <b>Kubisch:</b> auch die Krümmung s″ ist stetig, dafür braucht er <b>zwei</b> Randbedingungen – hier natürlich: s″ = 0 an beiden Enden.",
    function(K){
      var xs = [0, 1, 2, 3], fs = [0, 1, 0, 1], s = "";
      var lin = function(x){ var k = Math.min(2, Math.floor(x)); return fs[k] + (fs[k + 1] - fs[k]) * (x - k); };
      var quad = function(x){ if(x <= 1) return 2 * x - x * x; if(x <= 2){ var t = x - 1; return 1 - t * t; } t = x - 2; return -2 * t + 3 * t * t; };
      var cub = cubic(xs, fs, "nat"), F = [lin, quad, cub], T = ["linear S₁", "quadratisch S₂", "kubisch S₃"], cols = ["c4", "c3", "a"];
      var sub = [["stetig: nur Wert", "Zusatz: keine"], ["stetig: Wert, s′", "Zusatz: s′(x₀) = 2"], ["stetig: s′ und s″", "Zusatz: 2 (natürlich)"]];
      for(var k = 0; k < 3; k++){
        var px = 10 + k * 210;
        s += K.panel(px, 10, 200, 300, T[k], cols[k]);
        var M = K.map(px + 18, 200, 55, 110);
        s += K.line(px + 10, 200, px + 192, 200, "s", { w: 1.2 });
        s += K.plot(F[k], 0, 3, M, cols[k], { w: 2.6, n: 300 });
        for(var i = 0; i < 4; i++) s += K.dot(M.X(xs[i]), M.Y(fs[i]), "i", 4.5);
        s += K.t(px + 100, 262, sub[k][0], "s", { s: 12.5 }) + K.t(px + 100, 284, sub[k][1], cols[k], { s: 12.5, b: true });
      }
      return K.svg(640, 320, s);
    });

  add("randbed", "Die drei Standard-Randbedingungen",
    "Ein kubischer Spline braucht zwei Zusatzbedingungen. <b>Natürlich:</b> Krümmung s″ = 0 an beiden Enden – die Kurve läuft gerade aus. <b>Periodisch:</b> Anfang und Ende passen samt s′ und s″ zusammen, die Kurve lässt sich nahtlos wiederholen (blass). <b>Not-a-knot:</b> x₁ und xₙ₋₁ sind keine echten Knoten – die ersten beiden und die letzten beiden Stücke sind jeweils <b>ein einziges</b> Polynom.",
    function(K){
      var xs = [0, 1, 2, 3, 4], fN = [0, 1, 0.5, 1.5, 1], fP = [0, 1, 0.5, 1.5, 0], s = "";
      var nat = cubic(xs, fN, "nat"), per = cubic(xs, fP, "per"), nak = cubic(xs, fN, "nak");
      var T = ["a) natürlich", "b) periodisch", "c) not-a-knot"];
      for(var k = 0; k < 3; k++){
        var px = 10 + k * 210, M = K.map(px + 30, 225, 35, 85);
        s += K.panel(px, 10, 200, 300, T[k], "a");
        s += K.line(px + 8, 225, px + 192, 225, "s", { w: 1.2 });
        var F = k === 0 ? nat : k === 1 ? per : nak, fs = k === 1 ? fP : fN;
        if(k === 1){
          s += K.plot(function(x){ return per(x + 4); }, -0.5, 0, M, "a", { w: 1.6, dash: "4 4" }) + K.plot(function(x){ return per(x - 4); }, 4, 4.5, M, "a", { w: 1.6, dash: "4 4" });
        }
        if(k === 2){ s += K.plot(F, 0, 2, M, "a", { w: 2.8 }) + K.plot(F, 2, 4, M, "c4", { w: 2.8 }); }
        else for(var i = 0; i < 4; i++) s += K.plot(F, xs[i], xs[i + 1], M, pieceColor(i), { w: 2.8 });
        for(i = 0; i < 5; i++){
          var ghost = k === 2 && (i === 1 || i === 3);
          s += ghost ? K.ring(M.X(xs[i]), M.Y(fs[i]), "f", 5.5) : K.dot(M.X(xs[i]), M.Y(fs[i]), "i", 4.5);
        }
        if(k === 0){ s += K.t(M.X(0) + 2, M.Y(0) + 24, "s″ = 0", "m", { s: 12.5, b: true }) + K.t(M.X(4) - 4, M.Y(1) + 28, "s″ = 0", "m", { s: 12.5, b: true }); }
        if(k === 1){ s += K.t(M.X(0), 252, "Start = Ende", "m", { s: 12.5, b: true, a: "start" }); }
        if(k === 2){ s += K.t(M.X(1), M.Y(1) - 22, "kein Knoten", "f", { s: 12.5, b: true }) + K.t(M.X(3), 252, "kein Knoten", "f", { s: 12.5, b: true }); }
      }
      s += K.t(115, 284, "läuft gerade aus", "s", { s: 12.5 }) + K.t(325, 284, "s, s′, s″ gleich an x₀, xₙ", "s", { s: 12.5 }) + K.t(535, 284, "s‴ stetig in x₁, xₙ₋₁", "s", { s: 12.5 });
      return K.svg(640, 320, s);
    });

  add("tridiag", "Gleichungssystem des natürlichen Splines: tridiagonal",
    "<b>Links</b> das System für die Krümmungen M₁ … M₄ (5 Teilintervalle, h = 1): In jeder Zeile stehen nur <b>drei Nachbarn</b> 1 · 4 · 1, sonst Nullen – ein schmales Band, schnell lösbar. <b>Rechts</b> die rechte Seite: f<sub>i−1</sub> − 2f<sub>i</sub> + f<sub>i+1</sub> misst, wie stark die Punkte <b>abknicken</b>. In Ü.9 ist das 0 − 2 + 0 = −2, also 4M₁ = −12 und M₁ = −3.",
    function(K){
      var s = K.panel(10, 10, 360, 300, "Bandmatrix (n = 5)", "a") + K.panel(380, 10, 250, 300, "rechte Seite: Knick", "m");
      var c0 = 50, r0 = 70, w = 40;
      for(var i = 0; i < 4; i++) for(var j = 0; j < 4; j++){
        var d = Math.abs(i - j), v = d === 0 ? "4" : d === 1 ? "1" : "0";
        s += K.cell(c0 + j * w, r0 + i * w, v, d <= 1 ? "a" : "r", { w: w, h: w, fill: d <= 1 ? "fa" : "p", tc: d <= 1 ? "a" : "f", s: 15, rx: 0, bw: 1 });
      }
      for(i = 0; i < 4; i++){
        s += K.cell(c0 + 4 * w + 30, r0 + i * w, "M" + "₁₂₃₄"[i], "c4", { w: 40, h: w, s: 14, rx: 0, bw: 1 });
        s += K.cell(c0 + 4 * w + 115, r0 + i * w, "r" + "₁₂₃₄"[i], "m", { w: 40, h: w, s: 14, rx: 0, bw: 1, fill: "fm" });
      }
      s += K.t(c0 + 4 * w + 5, r0 + 60, "·", "i", { s: 20, b: true }) + K.t(c0 + 4 * w + 72, r0 + 60, "=", "i", { s: 18, b: true });
      s += K.t(190, 260, "Mᵢ₋₁ + 4Mᵢ + Mᵢ₊₁ = rᵢ", "a", { s: 13, b: true }) + K.t(190, 284, "rᵢ = 6·(fᵢ₋₁ − 2fᵢ + fᵢ₊₁)", "m", { s: 13, b: true });
      var M = K.map(420, 200, 80, 90);
      s += K.line(400, 200, 615, 200, "s", { w: 1.2 });
      s += K.line(M.X(0), M.Y(0), M.X(2), M.Y(0), "f", { w: 1.4, dash: "5 4" });
      s += pl(K, [[M.X(0), M.Y(0)], [M.X(1), M.Y(1)], [M.X(2), M.Y(0)]], "m", { w: 2 });
      s += K.line(M.X(1), M.Y(0), M.X(1), M.Y(1), "c3", { w: 2 });
      s += K.dot(M.X(0), M.Y(0), "i", 5) + K.dot(M.X(1), M.Y(1), "i", 5) + K.dot(M.X(2), M.Y(0), "i", 5);
      s += K.t(M.X(0), M.Y(0) + 18, "f₀ = 0", "s", { s: 12.5, b: true }) + K.t(M.X(1), M.Y(1) - 16, "f₁ = 1", "s", { s: 12.5, b: true }) + K.t(M.X(2), M.Y(0) + 18, "f₂ = 0", "s", { s: 12.5, b: true });
      s += K.t(M.X(1) + 6, M.Y(0.45), "Knick", "c3", { s: 12.5, b: true, a: "start" });
      s += K.t(505, 248, "0 − 2·1 + 0 = −2", "m", { s: 13, b: true }) + K.t(505, 270, "4M₁ = −12 ⇒ M₁ = −3", "m", { s: 13, b: true });
      s += K.t(505, 292, "(Ü.9, natürlich)", "s", { s: 12 });
      return K.svg(640, 320, s);
    });

  add("taylorstueck", "Ein Splinestück als Taylor-Entwicklung (Ü.9)",
    "Das Stück p₁ auf [1, 2] aus Ü.9 entsteht in Schichten um x₁ = 1: Startwert f₁ = 1 mit der Steigung b₁ = 0 (waagerechte Tangente), dazu die <b>Krümmung</b> M₁/2·t² = −1,5t² (Parabel) und schließlich der <b>kubische Korrekturterm</b> 0,5t³, der die Kurve genau auf f₂ = 0 bringt. Links schließt s₀ ohne Knick und ohne Krümmungssprung an.",
    function(K){
      var M = K.map(80, 250, 220, 180), s = "";
      s += xaxis(K, M, -0.2, 2.25, "x") + K.line(80, 296, 80, 40, "s", { w: 1.2 });
      s += tick(K, M, 1, "1") + tick(K, M, 2, "2");
      s += K.plot(function(x){ return 1.5 * x - 0.5 * x * x * x; }, 0, 1, M, "s", { w: 2.2 });
      s += K.line(M.X(0.7), M.Y(1), M.X(2.05), M.Y(1), "c4", { w: 1.8, dash: "6 4" });
      s += K.plot(function(x){ var t = x - 1; return 1 - 1.5 * t * t; }, 1, 1.95, M, "c3", { w: 1.8, dash: "6 4", ymin: -0.28 });
      s += K.plot(function(x){ var t = x - 1; return 1 - 1.5 * t * t + 0.5 * t * t * t; }, 1, 2, M, "a", { w: 3 });
      s += K.dot(M.X(1), M.Y(1), "m", 5.5) + K.dot(M.X(2), M.Y(0), "m", 5.5) + K.dot(M.X(0), M.Y(0), "i", 4.5);
      s += K.t(M.X(2.05) + 6, M.Y(1), "f₁ + b₁t = 1", "c4", { s: 13, b: true, a: "start" });
      s += K.t(M.X(1.8) - 14, M.Y(-0.25), "+ M₁/2·t² = −1,5t²", "c3", { s: 13, b: true, a: "end" });
      s += K.t(M.X(1.62) + 8, M.Y(0.55) - 8, "+ 0,5t³ ⇒ p₁ trifft f₂ = 0", "a", { s: 13, b: true, a: "start" });
      s += K.t(M.X(0.5), 92, "s₀ = 1,5x − 0,5x³", "s", { s: 13, a: "end" });
      s += K.f(400, 28, "pᵢ = fᵢ + bᵢt + Mᵢ/2·t² + (Mᵢ₊₁−Mᵢ)/(6h)·t³", "a", { s: 12.5 });
      return K.svg(640, 310, s);
    });

  /* ═════════ Kapitel 4: Differenzialgleichungen ═════════ */

  add("richtfeld", "Richtungsfeld von y′ = f(x, y)",
    "Die Differenzialgleichung gibt in <b>jedem Punkt</b> der Ebene eine Steigung vor – das zeigen die kleinen Striche, hier für y′ = y (Ü.10): Je höher der Punkt, desto steiler. Eine Lösung ist eine Kurve, die sich überall an diese Striche <b>anschmiegt</b>. Der Anfangswert (x₀, y₀) legt fest, welche der vielen Kurven gemeint ist.",
    function(K){
      var M = K.map(210, 280, 150, 60), s = "";
      s += K.axes(210, 280, 160, 300, 255, 5, "x", "y");
      for(var gx = -1; gx <= 2.001; gx += 0.25) for(var gy = 0.25; gy <= 4.001; gy += 0.5){
        var m = gy, dx = 1, dy = m * 60 / 150, L = Math.sqrt(dx * dx + dy * dy), hx = 9 * dx / L, hy = 9 * dy / L;
        s += K.line(M.X(gx) - hx, M.Y(gy) + hy, M.X(gx) + hx, M.Y(gy) - hy, "f", { w: 1.4 });
      }
      s += K.plot(function(x){ return 0.5 * Math.exp(x); }, -1, 2.05, M, "c4", { w: 1.8, dash: "5 4", ymax: 4.2 });
      s += K.plot(Math.exp, -1, 1.43, M, "a", { w: 2.8 });
      s += K.ring(M.X(0), M.Y(1), "m", 6);
      s += K.f(560, 40, "y′ = f(x, y) = y", "a", { s: 12.5 });
      s += lines(K, 520, 90, ["Strich = Steigung", "an dieser Stelle", "", "blau: Lösung", "y = eˣ", "", "gestrichelt:", "andere Lösung"], "s", { s: 12.5, lh: 19 });
      s += K.t(520, 262, "Ring: Start", "m", { s: 12.5, b: true, a: "start" }) + K.t(520, 281, "(x₀, y₀) = (0, 1)", "m", { s: 12.5, b: true, a: "start" });
      return K.svg(640, 310, s);
    });

  add("picard", "Sukzessive Approximation (Picard–Lindelöf)",
    "Man startet mit der konstanten Funktion y₀ = 1 und setzt sie immer wieder in die Integralgleichung ein. Für y′ = y, y(0) = 1 entsteht so Schritt für Schritt 1, 1 + x, 1 + x + x²/2, … – die Näherungen <b>legen sich immer enger</b> an die wahre Lösung eˣ. Das beweist Existenz und Eindeutigkeit und ist zugleich ein (theoretisches) Näherungsverfahren.",
    function(K){
      var M = K.map(60, 290, 220, 35), s = "";
      s += K.axes(60, 290, 5, 470, 265, 5, "x", "y") + tick(K, M, 1, "1") + tick(K, M, 2, "2");
      var F = [function(){ return 1; }, function(x){ return 1 + x; }, function(x){ return 1 + x + x * x / 2; }, function(x){ return 1 + x + x * x / 2 + x * x * x / 6; }];
      var C = ["f", "c4", "c3", "a"], N = ["y₀ = 1", "y₁ = 1 + x", "y₂ = … + x²/2", "y₃ = … + x³/6"];
      for(var i = 0; i < 4; i++){ s += K.plot(F[i], 0, 2, M, C[i], { w: 2 }); s += K.t(M.X(2) + 8, M.Y(F[i](2)), N[i], C[i], { s: 13, b: true, a: "start" }); }
      s += K.plot(Math.exp, 0, 2, M, "m", { w: 2.8, dash: "7 4" }) + K.t(M.X(2) + 8, M.Y(Math.exp(2)), "eˣ (exakt)", "m", { s: 13, b: true, a: "start" });
      s += K.f(200, 40, "yₖ₊₁(x) = y₀ + ∫ f(t, yₖ(t)) dt", "a", { s: 13 });
      return K.svg(640, 320, s);
    });

  add("euler", "Euler-Polygonzug (Ü.10: y′ = y, h = 0,1)",
    "Ab (0, 1) geht man ein Stück h nach rechts und folgt dabei der Steigung, die <b>am Anfang</b> des Schritts gilt: y wächst um h·f(x<sub>i</sub>, y<sub>i</sub>). Die Punkte werden zum <b>Polygonzug</b> verbunden. Weil eˣ konvex ist, liegt jede Tangente unter der Kurve – der Zug bleibt systematisch darunter: 1,4641 statt 1,4918.",
    function(K){
      var M = { X: function(v){ return 70 + v * 1100; }, Y: function(v){ return 300 - (v - 0.95) * 420; } }, s = "";
      s += K.line(60, 300, 560, 300, "s", { w: 1.3 }) + K.line(70, 305, 70, 50, "s", { w: 1.3 });
      for(var k = 0; k <= 4; k++) s += K.line(M.X(k / 10), 296, M.X(k / 10), 304, "s") + K.t(M.X(k / 10), 316, k === 0 ? "0" : "0," + k, "s", { s: 12 });
      s += K.plot(Math.exp, 0, 0.4, M, "a", { w: 2.4 });
      var y = 1, pts = [[M.X(0), M.Y(1)]];
      for(k = 1; k <= 4; k++){ y *= 1.1; pts.push([M.X(k / 10), M.Y(y)]); }
      s += K.line(M.X(0), M.Y(1), M.X(0.1), M.Y(1), "c3", { w: 1.6, dash: "4 3" }) + K.line(M.X(0.1), M.Y(1), M.X(0.1), M.Y(1.1), "c3", { w: 2 });
      s += K.t(M.X(0.05), M.Y(1) + 13, "h", "c3", { s: 14, b: true, it: true }) + K.t(M.X(0.1) + 8, M.Y(1.05) + 6, "h·f(x₀, y₀) = 0,1", "c3", { s: 12.5, b: true, a: "start" });
      s += pl(K, pts, "m", { w: 2.2 });
      pts.forEach(function(p){ s += K.dot(p[0], p[1], "m", 4.5); });
      s += K.t(M.X(0.4) + 10, M.Y(1.4641) + 8, "y₄ = 1,4641", "m", { s: 13, b: true, a: "start" }) + K.t(M.X(0.4) + 10, M.Y(Math.exp(0.4)) - 12, "e⁰·⁴ = 1,4918", "a", { s: 13, b: true, a: "start" });
      s += K.f(220, 40, "yᵢ₊₁ = yᵢ + h·f(xᵢ, yᵢ)", "m", { fill: "fm" });
      s += K.t(90, 80, "Fehler O(h): halbe Schrittweite, halber Fehler", "s", { s: 12.5, a: "start" });
      return K.svg(640, 330, s);
    });

  add("rkidee", "Grundidee Runge-Kutta: bessere Steigung Φ",
    "Über einen Schritt ändert sich die Steigung der Lösung. Ideal wäre die <b>mittlere Steigung</b> über das ganze Intervall – die Sekante von Anfangs- zu Endpunkt (blau). Euler nimmt nur die Steigung <b>am Anfang</b> (rot) und landet zu tief. Runge-Kutta fragt die Steigung an einigen Zwischenstellen ab und bildet daraus ein <b>gewichtetes Mittel Φ</b>, das der Sekante sehr nahekommt.",
    function(K){
      var M = { X: function(v){ return 80 + v * 900; }, Y: function(v){ return 290 - (v - 0.95) * 390; } }, s = "", h = 0.4, e = Math.exp(0.4);
      s += K.line(60, 290, 560, 290, "s", { w: 1.3 }) + K.line(80, 295, 80, 50, "s", { w: 1.3 });
      s += K.t(M.X(0), 306, "xᵢ", "s", { s: 13, b: true }) + K.t(M.X(h), 306, "xᵢ + h", "s", { s: 13, b: true }) + K.line(M.X(h), 286, M.X(h), 294, "s");
      s += K.plot(Math.exp, -0.02, 0.4, M, "i", { w: 2.4 });
      [0, 0.2, 0.4].forEach(function(x){ var y = Math.exp(x), d = 0.05, d2 = x > 0.3 ? 0 : d; s += K.line(M.X(x - d), M.Y(y - d * y), M.X(x + d2), M.Y(y + d2 * y), "c3", { w: 3 }); });
      s += K.line(M.X(0), M.Y(1), M.X(h), M.Y(1 + h), "m", { w: 2, dash: "6 4" }) + K.dot(M.X(h), M.Y(1 + h), "m", 5);
      s += K.line(M.X(0), M.Y(1), M.X(h), M.Y(e), "a", { w: 2.4 }) + K.dot(M.X(h), M.Y(e), "a", 5) + K.dot(M.X(0), M.Y(1), "i", 5);
      s += K.t(M.X(h) + 10, M.Y(1 + h) + 4, "Euler: Steigung 1 → 1,40", "m", { s: 13, b: true, a: "start" });
      s += K.t(M.X(h) + 10, M.Y(e) - 4, "ideal: Φ = 1,23 → 1,4918", "a", { s: 13, b: true, a: "start" });
      s += K.t(M.X(0.2) - 8, M.Y(Math.exp(0.2)) - 26, "Steigungen 1 … 1,49", "c3", { s: 12.5, b: true, a: "end" });
      s += K.f(240, 40, "yᵢ₊₁ = yᵢ + h·Φ(xᵢ, yᵢ, h)", "a");
      return K.svg(640, 320, s);
    });

  add("zweistufig", "Zweistufige Familie: wo wird k₂ abgefragt?",
    "Jede Zeile ist ein Schritt von xᵢ nach xᵢ + h. k₁ wird immer <b>am Anfang</b> gemessen, k₂ an der Stelle <b>x + h/(2α)</b>. Die Säulen zeigen die Gewichte (1 − α) und α, mit denen beide Steigungen in Φ eingehen. α = 1 ergibt das <b>Mittelpunktverfahren</b> (k₂ in der Mitte, Gewicht 1), α = ¾ das <b>Heun-Verfahren</b> (k₂ bei 2h/3, Gewichte ¼ und ¾).",
    function(K){
      var s = K.f(320, 26, "Φ = (1−α)·k₁ + α·k₂,  k₂ bei x + h/(2α)", "a");
      function X(t){ return 200 + t * 360; }
      var rows = [[1, "α = 1", "Mittelpunktverfahren"], [0.75, "α = ¾", "Heun-Verfahren"], [0.5, "α = ½", "k₂ am Schrittende"]];
      for(var r = 0; r < 3; r++){
        var y = 115 + r * 80, a = rows[r][0], tp = 1 / (2 * a);
        s += K.line(X(0), y, X(1), y, "s", { w: 1.6 }) + K.line(X(0), y - 5, X(0), y + 5, "s") + K.line(X(1), y - 5, X(1), y + 5, "s");
        s += K.t(30, y - 10, rows[r][1], "i", { s: 14, b: true, a: "start" }) + K.t(30, y + 12, rows[r][2], r === 2 ? "s" : "a", { s: 12.5, b: true, a: "start" });
        var h1 = (1 - a) * 44, h2 = a * 44;
        if(h1 > 0) s += K.rect(X(0) - 9, y - h1, 18, h1, "c4", { fill: "fa", rx: 1 });
        s += K.rect(X(tp) - 9, y - h2, 18, h2, "m", { fill: "fm", rx: 1 });
        s += K.dot(X(0), y, "c4", 5) + K.dot(X(tp), y, "m", 5);
        s += K.t(X(0) - 14, y - Math.max(h1, 6) + 2, a === 1 ? "0" : a === 0.75 ? "¼" : "½", "c4", { s: 13, b: true, a: "end" });
        s += K.t(X(tp) + 14, y - h2 + 6, a === 1 ? "1" : a === 0.75 ? "¾" : "½", "m", { s: 13, b: true, a: "start" });
        s += K.t(X(tp), y + 16, a === 1 ? "h/2" : a === 0.75 ? "2h/3" : "h", "m", { s: 12.5, b: true });
      }
      s += K.t(X(0), 304, "k₁ bei xᵢ", "c4", { s: 12.5, b: true }) + K.t(X(1) + 8, 304, "= xᵢ + h", "s", { s: 12.5, a: "start" });
      return K.svg(640, 318, s);
    });

  add("mittelheun", "Mittelpunkt- und Heun-Verfahren (y′ = y, h = 0,4)",
    "<b>Mittelpunkt:</b> ein halber Euler-Schritt zur Mitte (0,2; 1,2), dort die Steigung 1,2 abgreifen und damit den <b>ganzen</b> Schritt ab dem Start gehen. <b>Heun:</b> Probe bei 2h/3 (Steigung 1,267), dann Φ = ¼·1 + ¾·1,267 = 1,2. Beide landen auf <b>genau 1,48</b> – weil f(x, y) = y linear ist, liefern alle α dasselbe (die Kuriosität aus dem Heft). Exakt wäre 1,4918, Euler mit h = 0,4 nur 1,4.",
    function(K){
      var s = K.panel(10, 10, 300, 300, "Mittelpunkt (α = 1)", "a") + K.panel(330, 10, 300, 300, "Heun (α = ¾)", "c4");
      function mk(px){ return { X: function(v){ return px + 40 + v * 600; }, Y: function(v){ return 285 - (v - 0.95) * 360; } }; }
      [[10, 0.2, 1.2, "a"], [330, 0.4 * 2 / 3, 1 + 0.4 * 2 / 3, "c4"]].forEach(function(p, k){
        var M = mk(p[0]), xp = p[1], yp = p[2], c = p[3];
        s += K.line(p[0] + 25, 285, p[0] + 290, 285, "s", { w: 1.2 });
        s += K.plot(Math.exp, 0, 0.42, M, "i", { w: 1.8 });
        s += K.line(M.X(0), M.Y(1), M.X(xp), M.Y(yp), "f", { w: 1.6, dash: "4 3" });
        s += K.line(M.X(xp - 0.06), M.Y(yp - 0.06 * yp), M.X(xp + 0.06), M.Y(yp + 0.06 * yp), "c3", { w: 3 });
        s += K.dot(M.X(xp), M.Y(yp), "c3", 5);
        s += K.line(M.X(0), M.Y(1), M.X(0.4), M.Y(1.48), c, { w: 2.4 }) + K.dot(M.X(0), M.Y(1), "i", 5) + K.dot(M.X(0.4), M.Y(1.48), c, 5.5);
        s += K.t(M.X(xp) + 12, M.Y(yp) + 14, k === 0 ? "Mitte:" : "bei 2h/3:", "c3", { s: 12.5, b: true, a: "start" }) + K.t(M.X(xp) + 12, M.Y(yp) + 32, k === 0 ? "k₂ = 1,2" : "k₂ = 1,267", "c3", { s: 12.5, b: true, a: "start" });
        s += K.t(p[0] + 20, 52, k === 0 ? "Φ = k₂ = 1,2" : "Φ = ¼·1 + ¾·1,267 = 1,2", c, { s: 13, b: true, a: "start" });
        s += K.t(p[0] + 20, 74, "y₁ = 1 + 0,4·1,2 = 1,48", c, { s: 13, b: true, a: "start" });
        s += K.t(p[0] + 20, 96, "exakt: e⁰·⁴ = 1,4918", "s", { s: 12.5, a: "start" });
        s += K.t(M.X(0), 300, "xᵢ = 0", "s", { s: 12.5 }) + K.t(M.X(0.4), 300, "0,4", "s", { s: 12.5 });
      });
      return K.svg(640, 320, s);
    });

  add("rk4", "Klassisches Runge-Kutta-Verfahren (Ü.10)",
    "Vier Steigungsmessungen in einem Schritt (y′ = y, h = 0,4): k₁ am Anfang, k₂ und k₃ in der <b>Mitte</b> (k₃ schon mit der verbesserten Höhe aus k₂), k₄ am <b>Ende</b>. Gemittelt wird mit den Gewichten <b>1 : 2 : 2 : 1</b> – die Mitte zählt doppelt. Ergebnis 1,491733 gegen exakt 1,491825: Fehler nur 0,00009, nach nur einem Schritt.",
    function(K){
      var s = "", M = { X: function(v){ return 70 + v * 900; }, Y: function(v){ return 290 - (v - 0.95) * 420; } };
      s += K.line(55, 290, 440, 290, "s", { w: 1.3 }) + K.line(70, 295, 70, 50, "s", { w: 1.3 });
      s += K.plot(Math.exp, 0, 0.42, M, "i", { w: 1.8, dash: "6 4" });
      var P = [[0, 1, 1, "k₁ = 1"], [0.2, 1.2, 1.2, "k₂ = 1,2"], [0.2, 1.24, 1.24, "k₃ = 1,24"], [0.4, 1.496, 1.496, "k₄ = 1,496"]], C = ["c4", "c3", "c3", "a"];
      s += K.line(M.X(0.2), 290, M.X(0.2), M.Y(1.24), "f", { w: 1.2, dash: "3 4" }) + K.line(M.X(0.4), 290, M.X(0.4), M.Y(1.496), "f", { w: 1.2, dash: "3 4" });
      P.forEach(function(p, k){ var d = 0.05; s += K.line(M.X(p[0] - d), M.Y(p[1] - d * p[2]), M.X(p[0] + d), M.Y(p[1] + d * p[2]), C[k], { w: 3 }) + K.dot(M.X(p[0]), M.Y(p[1]), C[k], 5); });
      s += K.t(M.X(0) + 12, M.Y(1) + 16, "k₁ = 1", "c4", { s: 13, b: true, a: "start" });
      s += K.t(M.X(0.2) + 14, M.Y(1.2) + 14, "k₂ = 1,2", "c3", { s: 13, b: true, a: "start" });
      s += K.t(M.X(0.2) - 14, M.Y(1.24) - 10, "k₃ = 1,24", "c3", { s: 13, b: true, a: "end" });
      s += K.t(M.X(0.4) - 16, M.Y(1.496) - 18, "k₄ = 1,496", "a", { s: 13, b: true, a: "end" });
      s += K.t(M.X(0), 305, "0", "s", { s: 12 }) + K.t(M.X(0.2), 305, "h/2", "s", { s: 12 }) + K.t(M.X(0.4), 305, "h", "s", { s: 12 });
      s += K.panel(460, 10, 170, 300, "Gewichte", "a");
      var w = [1, 2, 2, 1];
      for(var i = 0; i < 4; i++){ s += K.rect(482 + i * 36, 160 - w[i] * 40, 26, w[i] * 40, C[i], { fill: i === 3 ? "fa" : i === 0 ? "fa" : "fm", rx: 1 }) + K.t(495 + i * 36, 176, "k" + "₁₂₃₄"[i], C[i], { s: 13, b: true }) + K.t(495 + i * 36, 160 - w[i] * 40 - 12, w[i] === 1 ? "⅙" : "⅓", C[i], { s: 13, b: true }); }
      s += K.t(545, 212, "Φ = 1,2293", "a", { s: 13, b: true }) + K.t(545, 238, "y₁ = 1,491733", "m", { s: 13, b: true }) + K.t(545, 262, "exakt 1,491825", "s", { s: 12.5 }) + K.t(545, 286, "Fehler O(h⁴)", "a", { s: 12.5, b: true });
      return K.svg(640, 320, s);
    });

  add("ordnung", "Konvergenzordnung O(h), O(h²), O(h⁴)",
    "Fehler bei x = 1 für y′ = y, wenn die Schrittweite immer wieder <b>halbiert</b> wird (logarithmische Achse). Jede Halbierung teilt den Fehler bei Euler durch <b>2</b>, beim Mittelpunkt-/Heun-Verfahren durch <b>4</b>, beim klassischen Runge-Kutta durch <b>16</b> – die Linien fallen umso steiler, je höher die Ordnung. Darum lohnt sich der Mehraufwand von 2 bzw. 4 Auswertungen pro Schritt.",
    function(K){
      function X(k){ return 110 + (k - 1) * 120; }
      function Y(e){ return 40 + (-Math.log(e) / Math.LN10) * 36; }
      var s = K.line(80, 40, 80, 290, "s", { w: 1.3 }) + K.line(80, 290, 560, 290, "s", { w: 1.3 });
      for(var d = 0; d <= 6; d += 2) s += K.line(76, 40 + d * 36, 84, 40 + d * 36, "s") + K.t(70, 40 + d * 36, d === 0 ? "1" : "10⁻" + "⁰¹²³⁴⁵⁶"[d], "s", { s: 12.5, a: "end" });
      var hs = ["½", "¼", "⅛", "1/16"];
      for(var k = 1; k <= 4; k++) s += K.line(X(k), 286, X(k), 294, "s") + K.t(X(k), 306, "h = " + hs[k - 1], "s", { s: 12.5 });
      var cols = ["m", "c3", "a"], nm = ["Euler O(h): ÷2", "Mittelpunkt/Heun O(h²): ÷4", "RK4 O(h⁴): ÷16"];
      var amp = [function(h){ return 1 + h; }, function(h){ return 1 + h + h * h / 2; }, function(h){ return 1 + h + h * h / 2 + h * h * h / 6 + h * h * h * h / 24; }];
      for(var m = 0; m < 3; m++){
        var pts = [];
        for(k = 1; k <= 4; k++){ var h = Math.pow(0.5, k), err = Math.abs(Math.E - Math.pow(amp[m](h), 1 / h)); pts.push([X(k), Y(err)]); }
        s += pl(K, pts, cols[m], { w: 2.4 });
        pts.forEach(function(p){ s += K.dot(p[0], p[1], cols[m], 4.5); });
        s += K.t(X(4) + 12, pts[3][1], nm[m], cols[m], { s: 13, b: true, a: "start" });
      }
      s += K.t(320, 22, "Fehler bei x = 1 (y′ = y, y(0) = 1), logarithmisch", "s", { s: 13, b: true });
      return K.svg(680, 320, s);
    });
})();
