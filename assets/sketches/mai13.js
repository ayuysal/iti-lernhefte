/* Skizzen zu MAI13 – Gewöhnliche Differenzialgleichungen.
   Jede Skizze: t = Titel, c = Lesehilfe (HTML), svg = function(K) → SVG-String (K = window.SK). */
(function(){
  "use strict";
  var S = window.ITI_SKETCHES = window.ITI_SKETCHES || {};
  function add(id, t, c, f){ S["mai13-" + id] = { t: t, c: c, svg: f }; }
  function lines(K, x, y, arr, c, o){ o = o || {}; var s = ""; for(var i = 0; i < arr.length; i++) s += K.t(x, y + i * (o.lh || 20), arr[i], c || "s", { a: o.a || "start", s: o.s || 13.5, b: o.b }); return s; }
  function hline(K, M, y, x0, x1, c, lab, o){ o = o || {}; return K.line(M.X(x0), M.Y(y), M.X(x1), M.Y(y), c, { w: 1.6, dash: "6 5" }) + (lab ? K.t(M.X(x1) + (o.dx || 6), M.Y(y) + (o.dy || 0), lab, c, { a: o.a || "start", s: 13, b: true }) : ""); }
  function rng(a, b, st){ var r = []; for(var v = a; v <= b + 1e-9; v += st) r.push(Math.round(v * 1000) / 1000); return r; }
  /* Richtungsfeld: an jedem Gitterpunkt ein kurzes Strichstück mit Steigung f(x,y) */
  function field(K, M, f, xs, ys, L, c, skip){
    var s = "";
    xs.forEach(function(x){ ys.forEach(function(y){
      if(skip && skip(x, y)) return;
      var m = f(x, y), dx = M.sx, dy = -m * M.sy, l = Math.sqrt(dx * dx + dy * dy);
      dx *= L / 2 / l; dy *= L / 2 / l;
      s += K.line(M.X(x) - dx, M.Y(y) - dy, M.X(x) + dx, M.Y(y) + dy, c || "f", { w: 1.3 });
    }); });
    return s;
  }
  /* Tangente in (x0, f(x0)) mit Steigung m über [x0−d1, x0+d2] */
  function tang(K, M, x0, y0, m, d1, d2, c){ return K.line(M.X(x0 - d1), M.Y(y0 - m * d1), M.X(x0 + d2), M.Y(y0 + m * d2), c || "m", { w: 2, dash: "7 4" }); }
  function box(K, x, y, w, h, txt, c, o){ o = o || {}; return K.rect(x - w / 2, y - h / 2, w, h, c || "a", { fill: o.fill || "p", rx: 6, w: o.bw || 1.6 }) + K.t(x, y + 1, txt, o.tc || "i", { s: o.s || 13.5, b: true, halo: false }); }
  var PI = Math.PI;

  /* ═════════ Kapitel 1: Grundbegriffe ═════════ */

  add("feld", "Richtungsfeld: die DGL gibt in jedem Punkt die Steigung vor",
    "Eine DGL wie y′ = 2x·y ist eine <b>Steigungsvorschrift</b>: In jedem Punkt (x, y) sagt sie, wie steil eine Lösungskurve dort verlaufen muss (die kleinen Striche). Eine <b>Lösung</b> ist eine Kurve, die überall genau diesen Strichen folgt – hier die Schar y = K·e^(x²). Gesucht ist also keine Zahl, sondern eine ganze <b>Funktion</b>.",
    function(K){
      var M = K.map(310, 170, 160, 45), s = K.axes(310, 170, 260, 262, 152, 152, "x", "y");
      s += field(K, M, function(x, y){ return 2 * x * y; }, rng(-1.6, 1.6, 0.2), rng(-2.25, 2.25, 0.75), 16, "f");
      [0.25, 0.5, 1, -0.25, -0.5, -1].forEach(function(k){
        s += K.plot(function(x){ return k * Math.exp(x * x); }, -1.62, 1.62, M, Math.abs(k) === 1 ? "a" : "c4", { w: Math.abs(k) === 1 ? 2.8 : 2, ymax: 3, ymin: -3 });
      });
      s += K.line(M.X(-1.62), M.Y(0), M.X(1.62), M.Y(0), "m", { w: 2.6 });
      s += K.t(M.X(1.048) + 6, M.Y(3) - 10, "K = 1", "a", { a: "start", s: 13, b: true }) + K.t(M.X(1.048) + 6, M.Y(-3) + 10, "K = −1", "a", { a: "start", s: 13, b: true });
      s += K.t(M.X(-1.25), M.Y(0) - 13, "y ≡ 0 (K = 0)", "m", { s: 13, b: true });
      s += K.f(310, 342, "y′ = 2x·y   ⇒   y = K·e^(x²)", "a");
      return K.svg(620, 362, s);
    });

  add("ordnung", "Ordnung = so viele Angaben, wie man zum Festlegen braucht",
    "<b>Links (Ordnung 1):</b> Durch jeden Punkt geht genau eine Kurve der Schar y = K·e^(x²) – der Startwert y(0) = 1 legt die eine Konstante K fest. <b>Rechts (Ordnung 2):</b> Bei y″ + 4y = 0 laufen durch denselben Punkt (0 | 2) unendlich viele Lösungen; erst die <b>Startsteigung</b> y′(0) wählt eine aus. Ordnung n ⇒ n freie Konstanten ⇒ n Angaben.",
    function(K){
      var s = K.panel(10, 10, 300, 320, "Ordnung 1: ein Punkt genügt") + K.panel(330, 10, 300, 320, "Ordnung 2: Punkt + Steigung");
      var M = K.map(160, 300, 105, 52);
      s += K.axes(160, 300, 126, 132, 245, 4, "x", "y");
      [0.25, 0.5, 2].forEach(function(k){ s += K.plot(function(x){ return k * Math.exp(x * x); }, -1.2, 1.2, M, "f", { w: 1.8, ymax: 4.5 }); });
      s += K.plot(function(x){ return Math.exp(x * x); }, -1.2, 1.2, M, "m", { w: 3, ymax: 4.5 });
      s += K.dot(M.X(0), M.Y(1), "m", 6) + K.t(M.X(0) - 10, M.Y(1) - 42, "y(0) = 1", "m", { a: "end", s: 13, b: true });
      s += K.t(M.X(0.45), M.Y(3.6), "K = 2", "s", { s: 12 });
      var N = K.map(436, 175, 120, 45);
      s += K.axes(436, 175, 96, 180, 130, 130, "x", "y");
      [-1, 0, 1.5].forEach(function(c){ s += K.plot(function(x){ return 2 * Math.cos(2 * x) + c * Math.sin(2 * x); }, -0.8, 1.45, N, "f", { w: 1.8 }); });
      s += K.plot(function(x){ return 2 * Math.cos(2 * x) + 0.5 * Math.sin(2 * x); }, -0.8, 1.45, N, "m", { w: 3 });
      s += tang(K, N, 0, 2, 1, 0.55, 0.55, "c3");
      s += K.dot(N.X(0), N.Y(2), "m", 6) + K.t(N.X(0) - 8, N.Y(2) - 18, "y(0) = 2", "m", { a: "end", s: 13, b: true });
      s += K.t(N.X(0.62) + 4, N.Y(2.55), "y′(0) = 1", "c3", { a: "start", s: 13, b: true });
      return K.svg(640, 340, s);
    });

  add("gewoehnlich", "gewöhnlich vs. partiell",
    "<b>Gewöhnlich:</b> Die gesuchte Funktion hängt von <b>einer</b> Variablen ab – ihr Bild ist eine Kurve y(x), und es kommen nur Ableitungen nach x vor. <b>Partiell:</b> Die Funktion hängt von mehreren Variablen ab (z. B. Ort x und Zeit t) – ihr Bild ist eine Fläche, und die Gleichung enthält partielle Ableitungen ∂u/∂x, ∂u/∂t. Dieses Heft behandelt nur den gewöhnlichen Fall.",
    function(K){
      var s = K.panel(10, 10, 300, 300, "gewöhnlich: y(x) → Kurve", "a") + K.panel(330, 10, 300, 300, "partiell: u(x, t) → Fläche", "c4");
      var M = K.map(45, 200, 40, 50);
      s += K.axes(45, 200, 4, 250, 150, 90, "x", "y");
      s += K.plot(function(x){ return 1.6 * Math.exp(-0.25 * x) * Math.cos(1.3 * x) + 0.3; }, 0, 6.1, M, "a", { w: 3 });
      s += K.t(160, 285, "eine Variable: nur y′, y″, …", "a", { s: 13, b: true });
      var P = K.p3(400, 230, 40, 0.5), g = "";
      function u(x, t){ return 1.4 * Math.sin(x * 0.9) * Math.exp(-0.25 * t); }
      s += K.axes3(P, 3.6, 5.6, 2.6);
      for(var t = 0; t <= 4.01; t += 0.5){ var d = ""; for(var x = 0; x <= 3.5; x += 0.1){ var p = P(x, t, u(x, t)); d += (x ? " L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); } g += K.path(d, "c4", { w: 1.4 }); }
      for(var x2 = 0; x2 <= 3.5; x2 += 0.5){ var e = ""; for(var t2 = 0; t2 <= 4.01; t2 += 0.1){ var q = P(x2, t2, u(x2, t2)); e += (t2 ? " L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1); } g += K.path(e, "f", { w: 1 }); }
      s += g;
      s += K.t(480, 285, "mehrere Variablen: ∂u/∂x, ∂u/∂t", "c4", { s: 13, b: true });
      return K.svg(640, 320, s);
    });

  add("lin", "Lineare DGL: gewichtete Summe von y, y′, y″",
    "Eine <b>lineare</b> DGL ist eine Mischmaschine: y und seine Ableitungen werden nur mit Faktoren multipliziert und <b>addiert</b> – sonst nichts. Sind die Faktoren feste Zahlen (hier 1, 4, 3 aus y″ + 4y′ + 3y = 6e^(−x)), hat sie <b>konstante Koeffizienten</b>. Sobald y quadriert, unter eine Wurzel/Sinus gesteckt oder mit y′ multipliziert wird, ist sie <b>nicht linear</b>.",
    function(K){
      var s = "", ys = [70, 150, 230], lab = ["y″", "y′", "y"], co = ["· 1", "· 4", "· 3"], cc = ["a", "a", "a"];
      for(var i = 0; i < 3; i++){
        s += box(K, 60, ys[i], 64, 40, lab[i], "a", { s: 17 });
        s += K.arrow(92, ys[i], 152, ys[i], "s", { w: 1.8, head: 9 });
        s += K.node(178, ys[i], co[i], "c3", { r: 25, s: 14 });
        s += K.arrow(203, ys[i], 296, 150 + (ys[i] - 150) * 0.12, "s", { w: 1.8, head: 9 });
      }
      s += K.node(322, 150, "Σ", "a", { r: 26, s: 22 });
      s += K.arrow(348, 150, 388, 150, "a", { w: 2.2, head: 10 });
      s += box(K, 436, 150, 88, 42, "= b(x)", "m", { s: 15, tc: "m" });
      s += K.t(178, 270, "Koeffizienten: feste Zahlen", "c3", { s: 13, b: true });
      s += K.t(178, 290, "→ konstante Koeffizienten", "c3", { s: 13, b: true });
      s += K.panel(500, 40, 130, 220, "nicht linear:", "m");
      ["y²", "√y", "sin y", "y · y′", "e^y"].forEach(function(t, k){ var yy = 90 + k * 36; s += K.t(565, yy, t, "m", { s: 16, b: true, it: true }) + K.line(535, yy + 9, 595, yy - 9, "m", { w: 1.6 }); });
      s += K.f(320, 310, "y″ + 4y′ + 3y = 6e^(−x)", "a");
      return K.svg(640, 330, s);
    });

  add("homogen", "homogen vs. inhomogen: die Störfunktion b(x)",
    "<b>Links (homogen, b = 0):</b> Das System ist sich selbst überlassen – bei y′ + y = 0 klingen alle Lösungen y = C·e^(−x) gegen 0 ab. <b>Rechts (inhomogen):</b> Eine Störfunktion b(x) = 1 „treibt“ das System – die Lösungen y = 1 + C·e^(−x) streben nun gegen den von b erzwungenen Wert 1. Die Form C·e^(−∫a dx) der homogenen Lösung bleibt dabei als abklingender Teil erhalten.",
    function(K){
      var s = K.panel(10, 10, 300, 300, "homogen: y′ + y = 0", "a") + K.panel(330, 10, 300, 300, "inhomogen: y′ + y = 1", "m");
      var M = K.map(45, 170, 60, 55), N = K.map(365, 170, 60, 55);
      s += K.axes(45, 170, 4, 255, 130, 125, "x", "y") + K.axes(365, 170, 4, 255, 130, 125, "x", "y");
      [-2, -1, 1, 2].forEach(function(c){
        s += K.plot(function(x){ return c * Math.exp(-x); }, 0, 4, M, "a", { w: 2 });
        s += K.plot(function(x){ return 1 + c * Math.exp(-x); }, 0, 4, N, "a", { w: 2 });
      });
      s += hline(K, N, 1, 0, 4.1, "m");
      s += K.t(M.X(2.8), M.Y(0) - 14, "→ 0", "a", { s: 14, b: true }) + K.t(N.X(3), N.Y(1) - 14, "→ 1 = b", "m", { s: 14, b: true });
      s += K.t(M.X(1.9), M.Y(-1.95), "y = C·e^(−x)", "a", { s: 13, b: true }) + K.t(N.X(2), N.Y(-1.4), "y = 1 + C·e^(−x)", "a", { s: 13, b: true });
      return K.svg(640, 320, s);
    });

  add("schar", "Allgemeine Lösung = Kurvenschar, partikuläre = eine Kurve",
    "Die <b>allgemeine Lösung</b> von y′ = 2x/(1+x²)·y ist y = C·(1 + x²) – für jedes C eine Parabel, zusammen eine ganze <b>Schar</b>. Die <b>Anfangsbedingung</b> y(0) = 1 pickt genau eine davon heraus (C = 1, rot): die <b>partikuläre Lösung</b>. Eine DGL 1. Ordnung hat eine freie Konstante, also eine Kurve pro Startpunkt.",
    function(K){
      var M = K.map(310, 240, 125, 23), s = K.axes(310, 240, 270, 272, 182, 100, "x", "y");
      [-1.5, -1, -0.5, 0, 0.5, 1.5, 2].forEach(function(c){ s += K.plot(function(x){ return c * (1 + x * x); }, -2.1, 2.1, M, c === 0 ? "s" : "a", { w: 1.8, ymax: 7, ymin: -4 }); });
      s += K.plot(function(x){ return 1 + x * x; }, -2.1, 2.1, M, "m", { w: 3.2, ymax: 7 });
      s += K.dot(M.X(0), M.Y(1), "m", 6) + K.t(M.X(0.2), 62, "y(0) = 1 ⇒ C = 1", "m", { a: "start", s: 13, b: true });
      s += K.t(M.X(-2.05), M.Y(5.6) - 8, "C = 1", "m", { a: "start", s: 12.5, b: true });
      s += K.t(316, 300, "C = −1,5", "a", { a: "start", s: 12.5, b: true });
      s += K.f(150, 24, "y = C·(1 + x²)", "a");
      return K.svg(620, 350, s);
    });

  add("awp", "Anfangswert- vs. Randwertproblem",
    "Beide Male y″ + 4y = 0 (Ordnung 2 ⇒ zwei Bedingungen). <b>AWP:</b> Beide Angaben an <b>derselben Stelle</b> x₀ = 0 – Startpunkt y(0) = 2 und Startsteigung y′(0) = 1; Lösung 2cos 2x + ½sin 2x. <b>RWP:</b> Die Angaben liegen an <b>verschiedenen Stellen</b> (y(0) = 2, y(π/4) = 1) – die Kurve wird wie ein Seil zwischen zwei Punkten eingespannt: 2cos 2x + sin 2x.",
    function(K){
      var s = K.panel(10, 10, 300, 300, "AWP: alles bei x₀ = 0", "a") + K.panel(330, 10, 300, 300, "RWP: zwei verschiedene Stellen", "c4");
      var M = K.map(110, 165, 95, 48), N = K.map(430, 165, 95, 48);
      s += K.axes(110, 165, 70, 196, 130, 130, "x", "y") + K.axes(430, 165, 70, 196, 130, 130, "x", "y");
      s += K.plot(function(x){ return 2 * Math.cos(2 * x) + 0.5 * Math.sin(2 * x); }, -0.6, 2.05, M, "a", { w: 3 });
      s += tang(K, M, 0, 2, 1, 0.25, 0.5, "m") + K.dot(M.X(0), M.Y(2), "m", 6);
      s += K.t(M.X(0.5) + 8, M.Y(2.5), "y′(0) = 1", "m", { a: "start", s: 13, b: true }) + K.t(M.X(0) - 8, M.Y(2) - 7, "y(0) = 2", "m", { a: "end", s: 13, b: true });
      s += K.plot(function(x){ return 2 * Math.cos(2 * x) + Math.sin(2 * x); }, -0.6, 2.05, N, "c4", { w: 3 });
      s += K.dot(N.X(0), N.Y(2), "m", 6) + K.dot(N.X(PI / 4), N.Y(1), "m", 6);
      s += K.line(N.X(PI / 4), N.Y(1), N.X(PI / 4), N.Y(0), "m", { w: 1.2, dash: "4 4" }) + K.t(N.X(PI / 4), N.Y(0) + 15, "π/4", "m", { s: 13, b: true });
      s += K.t(N.X(0) - 10, N.Y(2) - 12, "y(0) = 2", "m", { a: "end", s: 13, b: true }) + K.t(N.X(PI / 4) + 12, N.Y(1) + 6, "y(π/4) = 1", "m", { a: "start", s: 13, b: true });
      return K.svg(640, 320, s);
    });

  add("probe", "Probe: Steigung der Kurve = Vorschrift der DGL",
    "Probe heißt: Die gefundene Funktion in die DGL einsetzen. Geometrisch prüft man, ob die <b>Tangentensteigung</b> der Kurve überall mit dem übereinstimmt, was die DGL verlangt. Für y = 2/(2 − x²) und y′ = x·y²: bei x = 1 ist y = 2, die Kurve steigt mit y′ = 4, und die DGL verlangt 1·2² = 4 ✓. Dazu die Anfangsbedingung y(0) = 1 ✓.",
    function(K){
      var y = function(x){ return 2 / (2 - x * x); }, M = K.map(250, 290, 190, 85), s = K.axes(250, 290, 230, 260, 270, 5, "x", "y");
      s += K.plot(y, -1.12, 1.12, M, "a", { w: 3 });
      s += tang(K, M, 1, 2, 4, 0.22, 0.17, "m") + K.dot(M.X(1), M.Y(2), "m", 6);
      s += tang(K, M, 0.5, y(0.5), 0.5 * y(0.5) * y(0.5), 0.45, 0.45, "c3") + K.dot(M.X(0.5), M.Y(y(0.5)), "c3", 5);
      s += K.dot(M.X(0), M.Y(1), "a", 5) + K.t(M.X(0) - 10, M.Y(1) - 14, "y(0) = 1 ✓", "a", { a: "end", s: 13, b: true });
      s += K.t(M.X(1) - 14, M.Y(2) - 6, "x = 1: y′ = 4", "m", { a: "end", s: 13, b: true });
      s += K.t(M.X(0.5) + 6, M.Y(y(0.5)) + 26, "x = ½: y′ ≈ 0,65", "c3", { a: "start", s: 13, b: true });
      s += K.f(450, 40, "DGL verlangt: x·y² = 1·2² = 4 ✓", "m", { fill: "fm" });
      return K.svg(620, 320, s);
    });

  /* ═════════ Kapitel 2: Erste Ordnung ═════════ */

  add("peano", "Existenz und Eindeutigkeit",
    "<b>Links:</b> Ist f(x, y) glatt (auch ∂f/∂y stetig), geht durch jeden Punkt <b>genau eine</b> Lösungskurve – die Kurven schneiden sich nie (hier y′ = y). <b>Rechts:</b> Bei y′ = 2√|y| ist ∂f/∂y bei y = 0 nicht stetig. Durch (0 | 0) laufen dann <b>mehrere</b> Lösungen: y ≡ 0 und y = x², und jede, die erst eine Weile auf der Achse bleibt und dann abhebt – die Lösung existiert, ist aber nicht eindeutig.",
    function(K){
      var s = K.panel(10, 10, 300, 300, "Picard-Lindelöf: genau eine", "a") + K.panel(330, 10, 300, 300, "nur Peano: mehrere möglich", "m");
      var M = K.map(150, 170, 80, 45);
      s += K.axes(150, 170, 120, 140, 130, 125, "x", "y");
      s += field(K, M, function(x, y){ return y; }, rng(-1.5, 1.5, 0.5), rng(-2.5, 2.5, 0.5), 14, "f");
      [-1, -0.5, -0.2, 0.2, 0.5, 1].forEach(function(c){ s += K.plot(function(x){ return c * Math.exp(x); }, -1.5, 1.7, M, "a", { w: 2, ymax: 2.8, ymin: -2.7 }); });
      s += K.dot(M.X(0), M.Y(0.5), "m", 6);
      var N = K.map(400, 270, 95, 48);
      s += K.axes(400, 270, 50, 220, 235, 5, "x", "y");
      s += K.line(N.X(-0.5), N.Y(0), N.X(2.2), N.Y(0), "m", { w: 3 });
      [0, 0.5, 1].forEach(function(c, i){ s += K.plot(function(x){ return (x - c) * (x - c); }, c, 2.2, N, ["m", "c3", "c4"][i], { w: 2.6, ymax: 4.6 }); });
      s += K.dot(N.X(0), N.Y(0), "m", 7);
      s += K.t(N.X(1.55), N.Y(4.2), "y = x²", "m", { a: "end", s: 13, b: true }) + K.t(N.X(1), N.Y(0) + 18, "später abheben", "c4", { s: 12.5, b: true });
      s += K.t(N.X(-0.25), N.Y(0) - 14, "y ≡ 0", "m", { s: 13, b: true });
      return K.svg(640, 320, s);
    });

  add("trenn", "Trennung der Variablen: alles mit y nach links, alles mit x nach rechts",
    "Man <b>sortiert</b> die Gleichung wie Wäsche: Alles, was y enthält (samt dy), kommt auf die linke Seite, alles mit x (samt dx) auf die rechte. Dann wird <b>jede Seite für sich integriert</b> – mit nur <b>einer</b> Konstanten C – und am Ende nach y aufgelöst. Rechts läuft das Beispiel y′ = 2x·y mit.",
    function(K){
      var s = K.rect(20, 54, 290, 262, "c4", { fill: "p", rx: 8, dash: "5 4" }) + K.rect(330, 54, 290, 262, "a", { fill: "p", rx: 8, dash: "5 4" });
      s += K.t(165, 20, "allgemein", "c4", { s: 14, b: true }) + K.t(475, 20, "Beispiel", "a", { s: 14, b: true });
      var L = ["dy/dx = g(x) · h(y)", "dy / h(y) = g(x) dx", "∫ dy/h(y) = ∫ g(x) dx + C", "nach y auflösen"];
      var R = ["dy/dx = 2x · y", "dy / y = 2x dx", "ln|y| = x² + C", "y = K · e^(x²)"];
      for(var i = 0; i < 4; i++){
        var yy = 80 + i * 70;
        s += K.f(165, yy, L[i], "c4", { s: 13.5, w: 250, fill: "p" }) + K.f(475, yy, R[i], i === 3 ? "m" : "a", { s: 13.5, w: 230, fill: i === 3 ? "fm" : "fa" });
        if(i < 3){ s += K.arrow(165, yy + 16, 165, yy + 52, "s", { w: 1.6, head: 8 }) + K.arrow(475, yy + 16, 475, yy + 52, "s", { w: 1.6, head: 8 }); }
      }
      s += K.t(178, 115, "trennen", "s", { a: "start", s: 12.5 }) + K.t(178, 185, "integrieren", "s", { a: "start", s: 12.5 }) + K.t(178, 255, "auflösen", "s", { a: "start", s: 12.5 });
      return K.svg(640, 330, s);
    });

  add("verlust", "Beim Teilen durch h(y) gehen konstante Lösungen verloren",
    "Beim Trennen teilt man durch h(y). Das ist nur erlaubt, wo h(y) ≠ 0. <b>Links:</b> Bei y′ = x·y² ist h(y) = y², und das ist bei y = 0 null. <b>Rechts:</b> Genau dort liegt eine <b>konstante Lösung y ≡ 0</b> (rot) – die Steigung x·0² ist überall 0. Die Formel aus der Trennung (y = −1/(x²/2 + C)) enthält sie nicht, darum separat prüfen. Die übrigen Lösungen kreuzen sie nie.",
    function(K){
      var s = K.panel(10, 10, 220, 300, "h(y) = y²", "s") + K.panel(250, 10, 380, 300, "y′ = x·y²: Lösungen", "a");
      var H = K.map(120, 250, 55, 50);
      s += K.axes(120, 250, 95, 100, 200, 5, "y", "h");
      s += K.plot(function(y){ return y * y; }, -1.9, 1.9, H, "c4", { w: 2.6, ymax: 3.9 });
      s += K.dot(H.X(0), H.Y(0), "m", 6) + K.t(H.X(0), H.Y(0) + 22, "h = 0 bei y = 0", "m", { s: 13, b: true });
      var M = K.map(440, 175, 120, 34), x0 = -1.38, x1 = 1.38;
      s += K.axes(440, 175, 180, 182, 140, 125, "x", "y");
      [-1, -2].forEach(function(c){ s += K.plot(function(x){ return -1 / (x * x / 2 + c); }, x0, x1, M, "a", { w: 2.2, ymax: 3.9, ymin: -1 }); });
      [0.5, 1, 2].forEach(function(c){ s += K.plot(function(x){ return -1 / (x * x / 2 + c); }, x0, x1, M, "c4", { w: 2.2 }); });
      s += K.line(M.X(x0), M.Y(0), M.X(x1), M.Y(0), "m", { w: 3 });
      s += K.t(M.X(-0.95), M.Y(0) - 13, "y ≡ 0", "m", { s: 14, b: true });
      s += K.t(446, 77, "y(0) = 1:", "a", { a: "start", s: 12.5, b: true }) + K.t(446, 95, "y = 2/(2 − x²)", "a", { a: "start", s: 12.5, b: true });
      return K.svg(640, 320, s);
    });

  add("var", "Variation der Konstanten: von Kurve zu Kurve der homogenen Schar",
    "Die homogene Lösung y_h = C·e^(−2x) (graue Kurven) löst y′ + 2y = eˣ nicht. Der Trick: C darf sich <b>mit x ändern</b>. Die gesuchte Lösung (rot, ⅓eˣ) liegt an jeder Stelle auf einer <b>anderen</b> grauen Kurve – bei x = 0 auf der mit C = ⅓, bei x = 1 auf der mit C ≈ 6,7. Genau dieses C(x) = ⅓e^(3x) liefert die Rechnung.",
    function(K){
      var M = K.map(70, 300, 320, 115), s = K.axes(70, 300, 20, 530, 280, 5, "x", "y");
      var Cs = [1 / 3, Math.exp(1.5) / 3, Math.exp(3) / 3, Math.exp(4.5) / 3], xs = [0, 0.5, 1, 1.5], lab = ["C = ⅓", "C ≈ 1,49", "C ≈ 6,70", "C ≈ 30,0"];
      Cs.forEach(function(c){ s += K.plot(function(x){ return c * Math.exp(-2 * x); }, -0.05, 1.62, M, "s", { w: 1.8, ymax: 2.1, dash: "6 4" }); });
      s += K.plot(function(x){ return Math.exp(x) / 3; }, -0.05, 1.62, M, "m", { w: 3.2 });
      xs.forEach(function(x, i){
        var yv = Math.exp(x) / 3;
        s += K.dot(M.X(x), M.Y(yv), "m", 6);
        s += (i === 1 || i === 2) ? K.t(M.X(x), M.Y(yv) + (i === 1 ? 24 : 32), lab[i], "s", { s: 12.5, b: true }) : K.t(M.X(x) - 16, M.Y(yv), lab[i], "s", { a: "end", s: 12.5, b: true });
        s += K.line(M.X(x), M.Y(0) - 4, M.X(x), M.Y(0) + 4, "s", { w: 1.2 }) + K.t(M.X(x), M.Y(0) + 15, String(x).replace(".", ","), "f", { s: 12 });
      });
      s += K.t(M.X(1.3), M.Y(0.95), "y = ⅓eˣ", "m", { s: 14, b: true });
      s += K.f(400, 34, "y = C(x)·e^(−2x),  C(x) = ⅓e^(3x)", "a");
      return K.svg(620, 330, s);
    });

  add("kuerzen", "Warum sich die C(x)-Terme immer wegheben",
    "Setzt man y = C(x)·e^(−2x) in y′ + 2y ein, entstehen drei Terme. Die Produktregel erzeugt −2C·e^(−2x), der Term 2y liefert +2C·e^(−2x) – und die beiden <b>heben sich auf</b>, weil e^(−2x) ja die homogene Gleichung löst. Übrig bleibt nur <b>C′(x)</b>, also eine Gleichung, die man direkt integrieren kann. Bleiben C-Terme stehen, steckt ein Rechenfehler drin.",
    function(K){
      var s = "", y0 = 140;
      s += K.f(110, y0, "C′·e^(−2x)", "a", { s: 15, w: 140 }) + K.f(270, y0, "− 2C·e^(−2x)", "c3", { s: 15, w: 150, fill: "p" });
      s += K.f(440, y0, "+ 2C·e^(−2x)", "c3", { s: 15, w: 150, fill: "p" }) + K.t(560, y0, "= eˣ", "i", { s: 17, b: true });
      s += K.line(200, y0 + 18, 340, y0 - 18, "m", { w: 2.4 }) + K.line(370, y0 + 18, 510, y0 - 18, "m", { w: 2.4 });
      s += K.path("M40 95 L40 82 L340 82 L340 95", "s", { w: 1.4 }) + K.t(190, 66, "aus y′ (Produktregel)", "s", { s: 13, b: true });
      s += K.path("M368 95 L368 82 L512 82 L512 95", "s", { w: 1.4 }) + K.t(440, 66, "aus 2y", "s", { s: 13, b: true });
      s += K.path("M200 168 Q355 215 510 168", "m", { w: 1.8, dash: "6 4" }) + K.t(355, 215, "heben sich weg (Summe 0)", "m", { s: 13.5, b: true });
      s += K.arrow(320, 232, 320, 258, "s", { w: 1.6, head: 8 });
      s += K.f(320, 284, "C′(x)·e^(−2x) = eˣ  ⇒  C′(x) = e^(3x)", "m", { fill: "fm", s: 15 });
      return K.svg(640, 310, s);
    });

  add("subst", "Substitution: Umweg über eine bekannte Gleichung",
    "Passt kein Verfahren direkt, <b>übersetzt</b> man die Gleichung mit einer neuen Variablen u in eine Gleichung, die man kann (trennbar oder linear). Dort löst man nach u(x) – und muss dann unbedingt <b>zurückübersetzen</b>, denn gefragt ist y(x). Wer den letzten Pfeil vergisst, gibt die Lösung der falschen Gleichung ab.",
    function(K){
      var s = "";
      s += box(K, 140, 70, 220, 46, "y′ = f(…)  – unbekannter Typ", "c4");
      s += box(K, 500, 70, 220, 46, "u′ = …  – trennbar/linear", "a");
      s += box(K, 500, 240, 220, 46, "u(x) ausrechnen", "a");
      s += box(K, 140, 240, 220, 46, "y(x) – gesucht!", "m", { fill: "fm", tc: "m" });
      s += K.arrow(252, 70, 388, 70, "c4", { w: 2.2 }) + K.t(320, 52, "u = …", "c4", { s: 13.5, b: true });
      s += K.arrow(500, 94, 500, 216, "a", { w: 2.2 }) + K.t(510, 155, "bekanntes Verfahren", "a", { a: "start", s: 12.5, b: true });
      s += K.arrow(388, 240, 252, 240, "m", { w: 2.6 }) + K.t(320, 222, "zurück-", "m", { s: 13, b: true }) + K.t(320, 262, "substituieren", "m", { s: 13, b: true });
      s += K.arrow(140, 94, 140, 216, "f", { w: 1.6, dash: "6 5" }) + K.t(130, 155, "direkt? geht nicht", "f", { a: "end", s: 12.5 });
      return K.svg(640, 290, s);
    });

  add("isoklin", "Woran man die Substitution sieht: Linien gleicher Steigung",
    "<b>Links:</b> Bei y′ = f(x + y) hängt die Steigung nur von u = x + y ab – auf jeder Parallele x + y = konst. sind alle Striche gleich steil (Beispiel y′ = (x + y)²). <b>Rechts:</b> Bei y′ = f(y/x) hängt sie nur vom Verhältnis u = y/x ab – auf jedem <b>Strahl durch den Ursprung</b> ist die Steigung gleich (Beispiel y′ = 1 + y/x). Die Substitution macht genau diese Größe zur neuen Variablen.",
    function(K){
      var s = K.panel(10, 10, 300, 300, "y′ = f(ax + by + c)", "a") + K.panel(330, 10, 300, 300, "y′ = f(y/x)", "c4");
      var M = K.map(160, 170, 52, 52);
      s += K.axes(160, 170, 135, 135, 130, 125, "x", "y");
      var cols = ["c3", "a", "s", "a", "c3"];
      [-2, -1, 0, 1, 2].forEach(function(c, i){
        var x0 = Math.max(-2.5, c - 2.2), x1 = Math.min(2.5, c + 2.2);
        s += K.line(M.X(x0), M.Y(c - x0), M.X(x1), M.Y(c - x1), cols[i], { w: 1, dash: "3 4" });
        for(var x = x0 + 0.3; x <= x1 - 0.2; x += 0.75) s += field(K, M, function(){ return c * c; }, [x], [c - x], 18, cols[i]);
      });
      s += K.t(M.X(1.85), M.Y(2.3), "x + y = 2", "c3", { s: 12.5, b: true });
      var N = K.map(480, 170, 52, 52);
      s += K.axes(480, 170, 135, 135, 130, 125, "x", "y");
      var us = [-2, -1, 0, 1, 2], c2 = ["c3", "a", "s", "a", "c3"];
      us.forEach(function(u, i){
        var xm = Math.min(2.4, 2.3 / Math.abs(u || 1));
        s += K.line(N.X(-xm), N.Y(-u * xm), N.X(xm), N.Y(u * xm), c2[i], { w: 1, dash: "3 4" });
        [-1, 1].forEach(function(sg){ for(var r = 0.7; r <= xm; r += 0.75) s += field(K, N, function(){ return 1 + u; }, [sg * r], [sg * r * u], 18, c2[i]); });
      });
      s += K.t(N.X(1.15) + 6, N.Y(2.3), "y = 2x", "c3", { a: "start", s: 12.5, b: true });
      return K.svg(640, 320, s);
    });

  add("bernoulli", "Bernoulli-Gleichung: u = y^(1−n) macht sie linear",
    "Das störende yⁿ rechts verschwindet in zwei Zügen: <b>durch yⁿ teilen</b>, dann merkt man, dass y^(−n)·y′ bis auf den Faktor (1 − n) genau die Ableitung von <b>u = y^(1−n)</b> ist. Übrig bleibt eine <b>lineare</b> DGL für u – die löst man mit Variation der Konstanten und substituiert zurück.",
    function(K){
      var s = "", X = 300;
      var st = ["y′ + a(x)·y = b(x)·yⁿ", "y^(−n)·y′ + a(x)·y^(1−n) = b(x)", "u′/(1 − n) + a(x)·u = b(x)", "y = u^(1/(1−n))"];
      var cl = ["c4", "c4", "a", "m"];
      for(var i = 0; i < 4; i++){ var yy = 40 + i * 82; s += K.f(X, yy, st[i], cl[i], { s: 14.5, fill: i === 3 ? "fm" : i === 2 ? "fa" : "p" }); if(i < 3) s += K.arrow(X, yy + 17, X, yy + 64, "s", { w: 1.8, head: 9 }); }
      s += K.t(X + 12, 81, "÷ yⁿ", "s", { a: "start", s: 13.5, b: true });
      s += K.t(X + 12, 163, "u = y^(1−n),  u′ = (1 − n)·y^(−n)·y′", "a", { a: "start", s: 13, b: true });
      s += K.t(X + 12, 245, "lösen (Variation), dann zurück", "m", { a: "start", s: 13, b: true });
      s += K.t(X - 160, 204, "linear ✓", "a", { a: "end", s: 14, b: true });
      return K.svg(640, 300, s);
    });

  add("baum", "Entscheidungsbaum für DGL 1. Ordnung",
    "Die Reihenfolge der Fragen ist wichtig: Zuerst prüfen, ob sich die rechte Seite als <b>Produkt g(x)·h(y)</b> schreiben lässt – dann ist Trennung am schnellsten. Sonst auf die <b>lineare Form</b> y′ + a(x)y = b(x) prüfen (Variation der Konstanten). Erst wenn beides scheitert, eine <b>Substitution</b> suchen.",
    function(K){
      var s = "";
      s += box(K, 170, 50, 260, 44, "y′ = g(x)·h(y) ?", "s");
      s += box(K, 170, 160, 260, 44, "y′ + a(x)·y = b(x) ?", "s");
      s += box(K, 500, 50, 220, 44, "Trennung der Variablen", "a", { fill: "fa", tc: "a" });
      s += box(K, 500, 160, 220, 44, "Variation der Konstanten", "a", { fill: "fa", tc: "a" });
      s += box(K, 170, 270, 260, 44, "Substitution suchen", "c4", { fill: "p", tc: "c4" });
      s += K.arrow(300, 50, 388, 50, "a", { w: 2.2 }) + K.t(344, 34, "ja", "a", { s: 13.5, b: true });
      s += K.arrow(300, 160, 388, 160, "a", { w: 2.2 }) + K.t(344, 144, "ja", "a", { s: 13.5, b: true });
      s += K.arrow(170, 72, 170, 137, "m", { w: 2.2 }) + K.t(184, 105, "nein", "m", { a: "start", s: 13.5, b: true });
      s += K.arrow(170, 182, 170, 247, "m", { w: 2.2 }) + K.t(184, 215, "nein", "m", { a: "start", s: 13.5, b: true });
      s += K.t(500, 198, "(bei b ≡ 0 genügt Trennung)", "s", { s: 12.5 });
      s += K.arrow(300, 270, 388, 270, "c4", { w: 2 }) + K.t(500, 262, "→ trennbar oder linear", "c4", { s: 13, b: true }) + K.t(500, 282, "zurücksubstituieren!", "c4", { s: 13, b: true });
      return K.svg(640, 300, s);
    });

  add("lnf", "∫ f′/f dx = ln|f|: Zähler ist Ableitung des Nenners",
    "Die Ableitung von ln f(x) ist nach der Kettenregel f′(x)/f(x). Darum ist umgekehrt jedes Integral, bei dem <b>oben die Ableitung von unten</b> steht, ein Logarithmus. Beispiel aus der Einsendeaufgabe: 2x/(1+x²) (violett) ist überall die <b>Steigung</b> von ln(1 + x²) (blau) – bei x = 1 etwa 2/2 = 1.",
    function(K){
      var M = K.map(310, 200, 85, 70), s = K.axes(310, 200, 290, 292, 180, 110, "x", "");
      s += K.plot(function(x){ return Math.log(1 + x * x); }, -3, 3, M, "a", { w: 3 });
      s += K.plot(function(x){ return 2 * x / (1 + x * x); }, -3, 3, M, "c4", { w: 2.4 });
      s += tang(K, M, 1, Math.LN2, 1, 0.8, 0.8, "m") + K.dot(M.X(1), M.Y(Math.LN2), "m", 6) + K.dot(M.X(1), M.Y(1), "c4", 5);
      s += K.t(M.X(3), M.Y(Math.log(10)) - 16, "ln(1 + x²)", "a", { a: "end", s: 14, b: true });
      s += K.t(M.X(-2.2), M.Y(-0.8) + 18, "f′/f = 2x/(1 + x²)", "c4", { s: 14, b: true });
      s += K.t(420, 180, "Tangente: Steigung 1", "m", { a: "start", s: 13, b: true });
      s += K.f(470, 296, "∫ f′/f dx = ln|f| + C", "a");
      return K.svg(620, 320, s);
    });

  /* ═════════ Kapitel 3: Lineare DGL ═════════ */

  add("struktur", "y = y_h + y_p: Schar + eine einzige Sonderlösung",
    "<b>Links</b> die homogene Schar y_h = K·e^(−2x) (alle K), <b>Mitte</b> eine einzige partikuläre Lösung y_p = ⅓eˣ von y′ + 2y = eˣ. <b>Rechts</b> die Summe: Jede Lösung ist „y_p plus irgendein y_h“. Weil y_h abklingt, laufen alle Kurven auf die rote y_p zu. Mehr als eine partikuläre Lösung braucht man nie – die Vielfalt steckt komplett in y_h.",
    function(K){
      var s = K.panel(10, 10, 196, 300, "y_h = K·e^(−2x)", "a") + K.panel(222, 10, 196, 300, "+  y_p = ⅓eˣ", "m") + K.panel(434, 10, 196, 300, "=  y = y_h + y_p", "c4");
      var ks = [-1, -0.5, 0.5, 1, 2], ox = [30, 242, 454];
      var M = [K.map(30, 200, 80, 55), K.map(242, 200, 80, 55), K.map(454, 200, 80, 55)];
      for(var i = 0; i < 3; i++) s += K.axes(ox[i], 200, 4, 170, 160, 100, "x", "");
      ks.forEach(function(k){
        s += K.plot(function(x){ return k * Math.exp(-2 * x); }, 0, 2.05, M[0], "a", { w: 2, ymax: 2.4 });
        s += K.plot(function(x){ return Math.exp(x) / 3 + k * Math.exp(-2 * x); }, 0, 2.05, M[2], "c4", { w: 2, ymax: 2.6 });
      });
      s += K.plot(function(x){ return Math.exp(x) / 3; }, 0, 2.05, M[1], "m", { w: 3.2 });
      s += K.plot(function(x){ return Math.exp(x) / 3; }, 0, 2.05, M[2], "m", { w: 3.2 });
      s += K.t(108, 275, "klingt ab → 0", "a", { s: 13, b: true }) + K.t(320, 275, "nur eine!", "m", { s: 13, b: true }) + K.t(532, 275, "alle → y_p", "c4", { s: 13, b: true });
      return K.svg(640, 320, s);
    });

  add("fundament", "Fundamentalsystem: zwei Basislösungen spannen alles auf",
    "Für y″ + 4y = 0 sind y₁ = cos 2x und y₂ = sin 2x zwei <b>linear unabhängige</b> Lösungen. Jede andere Lösung ist eine Kombination C₁y₁ + C₂y₂ – wie ein Punkt in einer Ebene mit den Koordinaten (C₁, C₂). Ordnung 2 ⇒ <b>Dimension 2</b>. Der Punkt (3, 1) ist die Lösung 3cos 2x + sin 2x aus Ü.5.",
    function(K){
      var s = K.panel(10, 10, 330, 300, "Basislösungen", "s") + K.panel(350, 10, 280, 300, "Lösungsraum (C₁, C₂)", "s");
      var M = K.map(40, 160, 85, 30);
      s += K.axes(40, 160, 4, 290, 125, 105, "x", "y");
      s += K.plot(function(x){ return Math.cos(2 * x); }, 0, 3.3, M, "a", { w: 2.4 });
      s += K.plot(function(x){ return Math.sin(2 * x); }, 0, 3.3, M, "c4", { w: 2.4 });
      s += K.plot(function(x){ return 3 * Math.cos(2 * x) + Math.sin(2 * x); }, 0, 3.3, M, "m", { w: 3 });
      s += K.t(40, 292, "cos 2x", "a", { a: "start", s: 13, b: true }) + K.t(110, 292, "sin 2x", "c4", { a: "start", s: 13, b: true }) + K.t(180, 292, "3cos 2x + sin 2x", "m", { a: "start", s: 13, b: true });
      var N = K.map(400, 250, 50, 50);
      s += K.axes(400, 250, 30, 215, 210, 30, "C₁", "C₂");
      s += K.ticks(400, 250, 50, 4, 3, true);
      s += K.arrow(400, 250, 450, 250, "a", { w: 3 }) + K.arrow(400, 250, 400, 200, "c4", { w: 3 });
      s += K.arrow(400, 250, N.X(3) - 2, N.Y(1) + 1, "m", { w: 2.6 }) + K.dot(N.X(3), N.Y(1), "m", 6);
      s += K.t(N.X(3) + 12, N.Y(1) - 18, "(3 | 1)", "m", { s: 14, b: true });
      s += K.t(N.X(1.9), N.Y(3.3), "jeder Punkt = eine Lösung", "s", { s: 12.5 });
      return K.svg(640, 320, s);
    });

  add("charpoly", "Charakteristisches Polynom: aus e^(λx) wird eine Zahl λ",
    "Setzt man y = e^(λx) ein, erzeugt jede Ableitung nur einen <b>Faktor λ</b> – die e-Funktion selbst bleibt. Man kann sie ausklammern, und weil e^(λx) nie null ist, muss die Klammer <b>p(λ) = 0</b> sein. Aus der DGL wird so eine gewöhnliche Gleichung. <b>Rechts:</b> p(λ) = λ² − 5λ + 6 hat die Nullstellen 2 und 3 ⇒ Lösungen e^(2x), e^(3x).",
    function(K){
      var s = K.panel(10, 10, 320, 310, "Ableiten = mit λ malnehmen", "a") + K.panel(345, 10, 285, 310, "Nullstellen = Exponenten", "m");
      s += K.f(170, 60, "y  = e^(λx)", "a", { w: 220 }) + K.f(170, 110, "y′ = λ · e^(λx)", "a", { w: 220 }) + K.f(170, 160, "y″ = λ² · e^(λx)", "a", { w: 220 });
      s += K.t(300, 85, "·λ", "c3", { s: 15, b: true }) + K.t(300, 135, "·λ", "c3", { s: 15, b: true });
      s += K.f(170, 222, "e^(λx)·(λ² + a₁λ + a₀) = 0", "c4", { fill: "p", w: 280 });
      s += K.f(170, 280, "⇒  p(λ) = 0", "m", { fill: "fm", w: 160 });
      s += K.t(170, 252, "e^(λx) ≠ 0", "s", { s: 12.5 });
      var M = K.map(385, 230, 52, 48);
      s += K.axes(385, 230, 30, 230, 185, 70, "λ", "p");
      s += K.ticks(385, 230, 52, 4, 0, true);
      s += K.plot(function(l){ return l * l - 5 * l + 6; }, -0.3, 4.4, M, "a", { w: 2.8, ymax: 3.7 });
      s += K.dot(M.X(2), M.Y(0), "m", 6) + K.dot(M.X(3), M.Y(0), "m", 6);
      s += K.t(M.X(2) - 4, M.Y(0) + 34, "e^(2x)", "m", { s: 13, b: true }) + K.t(M.X(3) + 10, M.Y(0) + 34, "e^(3x)", "m", { s: 13, b: true });
      s += K.t(M.X(2.5), 60, "λ² − 5λ + 6", "a", { s: 13, b: true });
      return K.svg(640, 330, s);
    });

  add("diskr", "Die drei Fälle: Wie liegt die Parabel p(λ)?",
    "Das charakteristische Polynom 2. Grades ist eine Parabel. <b>D &gt; 0:</b> Sie schneidet die λ-Achse zweimal (λ² − 5λ + 6: λ = 2, 3). <b>D = 0:</b> Sie berührt sie nur (λ² − 6λ + 9: λ = 3 doppelt). <b>D &lt; 0:</b> Sie bleibt über der Achse – keine reellen Nullstellen, sondern komplexe α ± βi (λ² + 2λ + 5: −1 ± 2i).",
    function(K){
      var s = K.panel(10, 10, 196, 300, "D > 0: zwei Schnitte", "a") + K.panel(222, 10, 196, 300, "D = 0: Berührung", "c3") + K.panel(434, 10, 196, 300, "D < 0: kein Schnitt", "c4");
      var f = [function(l){ return l * l - 5 * l + 6; }, function(l){ return l * l - 6 * l + 9; }, function(l){ return l * l + 2 * l + 5; }];
      var a = [0.6, 1.3, -3.4], b = [4.4, 4.7, 1.4], o = [[40, 230, 35], [252, 230, 35], [571, 230, 35]], c = ["a", "c3", "c4"];
      for(var i = 0; i < 3; i++){
        var M = K.map(o[i][0], o[i][1], o[i][2], 40);
        s += K.line(16 + i * 212, 230, 200 + i * 212, 230, "s", { w: 1.3 }) + K.t(192 + i * 212, 246, "λ", "s", { it: true, s: 14 });
        s += K.plot(f[i], a[i], b[i], M, c[i], { w: 2.8, ymax: 4.4 });
      }
      var M0 = K.map(40, 230, 35, 40), M1 = K.map(252, 230, 35, 40), M2 = K.map(571, 230, 35, 40);
      s += K.dot(M0.X(2), 230, "m", 6) + K.dot(M0.X(3), 230, "m", 6) + K.t(M0.X(2.5), 262, "λ = 2 und 3", "m", { s: 13, b: true });
      s += K.dot(M1.X(3), 230, "m", 7) + K.t(M1.X(3), 262, "λ = 3 doppelt", "m", { s: 13, b: true });
      s += K.dot(M2.X(-1), M2.Y(4), "c4", 5) + K.line(M2.X(-1), M2.Y(4), M2.X(-1), 230, "c4", { w: 1.2, dash: "4 4" });
      s += K.t(M2.X(-1), 262, "λ = −1 ± 2i", "m", { s: 13, b: true });
      return K.svg(640, 320, s);
    });

  add("dpos", "D > 0: Summe zweier e-Funktionen",
    "Zwei verschiedene reelle Nullstellen liefern zwei e-Funktionen mit unterschiedlichem Tempo. Hier λ = −1 und −3 (aus y″ + 4y′ + 3y = 0): <b>2e^(−x)</b> klingt langsam ab, <b>−e^(−3x)</b> schnell. Die Lösung (rot) ist ihre Summe – kein Schwingen, höchstens ein Buckel, dann gleitet sie zur Achse.",
    function(K){
      var M = K.map(60, 200, 110, 95), s = K.axes(60, 200, 5, 530, 185, 110, "x", "y");
      s += K.plot(function(x){ return 2 * Math.exp(-x); }, 0, 4.7, M, "c4", { w: 2, dash: "7 4" });
      s += K.plot(function(x){ return -Math.exp(-3 * x); }, 0, 4.7, M, "c3", { w: 2, dash: "7 4" });
      s += K.plot(function(x){ return 2 * Math.exp(-x) - Math.exp(-3 * x); }, 0, 4.7, M, "m", { w: 3.2 });
      s += K.t(M.X(0.25) + 6, M.Y(2) + 2, "2e^(−x)", "c4", { a: "start", s: 13, b: true }) + K.t(M.X(0.5) + 6, M.Y(-0.9), "−e^(−3x)", "c3", { a: "start", s: 13, b: true });
      s += K.t(M.X(1.6), M.Y(0.95) - 10, "y = 2e^(−x) − e^(−3x)", "m", { a: "start", s: 14, b: true });
      s += K.f(400, 290, "y = C₁e^(λ₁x) + C₂e^(λ₂x)", "a");
      return K.svg(620, 315, s);
    });

  add("dnull", "D = 0: der Faktor x liefert die zweite Lösung",
    "Bei einer doppelten Nullstelle gibt es nur eine e-Funktion e^(λx). Die zweite, davon <b>linear unabhängige</b> Lösung entsteht durch den Faktor <b>x</b>: x·e^(λx) – sie startet bei 0, steigt erst und fällt dann. Bei dreifacher Nullstelle kommt noch x²·e^(λx) dazu. Hier λ = −1.",
    function(K){
      var M = K.map(60, 270, 90, 210), s = K.axes(60, 270, 5, 540, 250, 5, "x", "y");
      s += K.plot(function(x){ return Math.exp(-x); }, 0, 5.8, M, "a", { w: 2.8 });
      s += K.plot(function(x){ return x * Math.exp(-x); }, 0, 5.8, M, "m", { w: 2.8 });
      s += K.plot(function(x){ return x * x * Math.exp(-x); }, 0, 5.8, M, "c4", { w: 2.4, dash: "7 4" });
      s += K.t(M.X(0) + 12, M.Y(1) - 4, "e^(−x)", "a", { a: "start", s: 14, b: true });
      s += K.t(M.X(3.6), 232, "x·e^(−x)", "m", { s: 14, b: true });
      s += K.t(M.X(2.9), M.Y(4 * Math.exp(-2)) - 22, "x²·e^(−x) (dreifach)", "c4", { a: "start", s: 13, b: true });
      s += K.f(400, 40, "y = (C₁ + C₂·x)·e^(λx)", "a");
      return K.svg(620, 300, s);
    });

  add("dneg", "D < 0: Realteil → Abklingen, Imaginärteil → Schwingen",
    "<b>Links</b> die komplexen Nullstellen −1 ± 2i in der Zahlenebene. <b>Rechts</b>, was daraus wird: Der <b>Realteil α = −1</b> wandert in den Exponenten und bestimmt die Hüllkurve ±e^(−x) (gestrichelt), der <b>Imaginärteil β = 2</b> wird zur Frequenz von cos 2x bzw. sin 2x. Ergebnis: eine gedämpfte Schwingung.",
    function(K){
      var s = K.panel(10, 10, 210, 300, "λ = −1 ± 2i", "c4") + K.panel(232, 10, 398, 300, "y = e^(−x)·cos 2x", "m");
      var C = K.map(140, 160, 45, 45);
      s += K.axes(140, 160, 115, 60, 120, 120, "Re", "Im");
      s += K.dot(C.X(-1), C.Y(2), "c4", 6) + K.dot(C.X(-1), C.Y(-2), "c4", 6);
      s += K.line(C.X(-1), C.Y(2), C.X(-1), C.Y(-2), "f", { w: 1.2, dash: "4 4" }) + K.line(C.X(-1), C.Y(2), C.X(0), C.Y(2), "f", { w: 1.2, dash: "4 4" });
      s += K.t(C.X(-1) - 8, C.Y(2) - 2, "−1 + 2i", "c4", { a: "end", s: 13, b: true }) + K.t(C.X(-1) - 8, C.Y(-2) + 2, "−1 − 2i", "c4", { a: "end", s: 13, b: true });
      s += K.t(C.X(-0.5), C.Y(0) + 18, "α = −1", "a", { s: 13, b: true }) + K.t(C.X(0) + 8, C.Y(1), "β = 2", "c3", { a: "start", s: 13, b: true });
      var M = K.map(260, 160, 100, 100);
      s += K.axes(260, 160, 5, 360, 125, 125, "x", "y");
      s += K.plot(function(x){ return Math.exp(-x); }, 0, 3.5, M, "a", { w: 1.8, dash: "6 4" }) + K.plot(function(x){ return -Math.exp(-x); }, 0, 3.5, M, "a", { w: 1.8, dash: "6 4" });
      s += K.plot(function(x){ return Math.exp(-x) * Math.cos(2 * x); }, 0, 3.5, M, "m", { w: 3 });
      s += K.t(M.X(0.55) + 4, M.Y(Math.exp(-0.55)) - 14, "e^(αx) = e^(−x)", "a", { a: "start", s: 13, b: true });
      s += K.t(M.X(2.2), M.Y(-0.6), "Periode 2π/β = π", "c3", { s: 13, b: true });
      return K.svg(640, 320, s);
    });

  add("ansatz", "Ansatz vom Typ der rechten Seite: Ableiten bleibt in der Familie",
    "Der Ansatz funktioniert, weil diese Funktionsfamilien beim Ableiten <b>unter sich bleiben</b>: Ein Polynom gibt wieder ein Polynom, e^(kx) bleibt e^(kx) (nur mal k), und cos/sin wechseln sich im Kreis ab. Setzt man also einen Ansatz derselben Art ein, steht links wieder diese Art – nur die <b>Koeffizienten</b> müssen noch passen.",
    function(K){
      var s = K.panel(10, 10, 196, 300, "Polynom", "a") + K.panel(222, 10, 196, 300, "e-Funktion", "c3") + K.panel(434, 10, 196, 300, "cos / sin", "c4");
      var p = ["ax² + bx + c", "2ax + b", "2a"];
      for(var i = 0; i < 3; i++){ s += K.f(108, 70 + i * 80, p[i], "a", { w: 150 }); if(i < 2) s += K.arrow(108, 86 + i * 80, 108, 132 + i * 80, "s", { w: 1.6, head: 8 }) + K.t(118, 110 + i * 80, "d/dx", "s", { a: "start", s: 12 }); }
      s += K.t(108, 285, "Grad sinkt, bleibt Polynom", "a", { s: 12.5, b: true });
      s += K.f(320, 90, "B·e^(kx)", "c3", { fill: "p", w: 130 }) + K.f(320, 200, "k·B·e^(kx)", "c3", { fill: "p", w: 130 });
      s += K.arrow(320, 106, 320, 182, "s", { w: 1.6, head: 8 }) + K.t(330, 145, "d/dx", "s", { a: "start", s: 12 });
      s += K.t(320, 285, "nur ein Faktor k", "c3", { s: 12.5, b: true });
      var cx = 532, cy = 150, r = 72, lab = ["cos", "−sin", "−cos", "sin"];
      for(var j = 0; j < 4; j++){
        var a = PI / 2 - j * PI / 2, x = cx + r * Math.cos(a), y = cy - r * Math.sin(a);
        s += K.node(x, y, lab[j], "c4", { r: 22, s: 13 });
        var a2 = a - PI / 2, aa = a - 0.42, bb = a2 + 0.42;
        s += K.arrow(cx + r * Math.cos(aa), cy - r * Math.sin(aa), cx + r * Math.cos(bb), cy - r * Math.sin(bb), "s", { w: 1.6, head: 8 });
      }
      s += K.t(cx, cy, "d/dx", "s", { s: 12 });
      s += K.t(532, 285, "Kreislauf → beide ansetzen", "c4", { s: 12.5, b: true });
      return K.svg(640, 320, s);
    });

  add("koeff", "Koeffizientenvergleich: jede Potenz hat ihre eigene Schublade",
    "Nach dem Einsetzen von y_p = ax + b in y″ − 3y′ + 2y = 4x steht links 2a·x + (2b − 3a). Zwei Polynome sind nur gleich, wenn sie <b>Schublade für Schublade</b> übereinstimmen: x¹ mit x¹, x⁰ mit x⁰. Rechts steht in der x⁰-Schublade eine <b>0</b> – darum braucht der Ansatz das Glied b, obwohl rechts kein konstanter Term steht.",
    function(K){
      var s = "";
      s += K.t(320, 30, "2a·x + (2b − 3a)  =  4x + 0", "i", { s: 18, b: true });
      s += K.panel(40, 60, 260, 150, "Schublade x¹", "a") + K.panel(340, 60, 260, 150, "Schublade x⁰", "c4");
      s += K.f(170, 115, "2a = 4", "a", { s: 16 }) + K.f(170, 170, "a = 2", "m", { fill: "fm", s: 16 });
      s += K.f(470, 115, "2b − 3a = 0", "c4", { s: 16, fill: "p" }) + K.f(470, 170, "b = 3", "m", { fill: "fm", s: 16 });
      s += K.arrow(170, 131, 170, 152, "s", { w: 1.6, head: 7 }) + K.arrow(470, 131, 470, 152, "s", { w: 1.6, head: 7 });
      s += K.f(320, 250, "y_p = 2x + 3", "m", { fill: "fm", s: 17 });
      s += K.t(320, 290, "fehlt b im Ansatz, bleibt 0 = −3a ≠ 0 → unlösbar", "s", { s: 13 });
      return K.svg(640, 310, s);
    });

  add("cossin", "cos-Störung: Antwort ist verschoben – darum cos UND sin",
    "Ein System antwortet auf eine cos-Anregung meist mit einer <b>phasenverschobenen</b> Schwingung (rot). Eine verschobene Kosinuskurve lässt sich aber immer als <b>C·cos ωx + D·sin ωx</b> schreiben (gestrichelt die beiden Anteile, hier C = D = 1). Fehlt der sin-Term im Ansatz, kann man keine Verschiebung darstellen – deshalb immer beide.",
    function(K){
      var M = K.map(50, 160, 75, 70), s = K.axes(50, 160, 5, 545, 140, 140, "x", "");
      s += K.plot(Math.cos, 0, 7.1, M, "a", { w: 1.8, dash: "6 4" });
      s += K.plot(Math.sin, 0, 7.1, M, "c4", { w: 1.8, dash: "6 4" });
      s += K.plot(function(x){ return Math.cos(x) + Math.sin(x); }, 0, 7.1, M, "m", { w: 3.2 });
      s += K.arrow(M.X(0), M.Y(1.6), M.X(PI / 4) - 2, M.Y(1.6), "c3", { w: 2, head: 9 }) + K.t(58, M.Y(1.6) - 14, "Verschiebung", "c3", { a: "start", s: 12.5, b: true });
      s += K.line(M.X(PI / 4), M.Y(1.41), M.X(PI / 4), M.Y(1.68), "c3", { w: 1.2 });
      s += K.t(M.X(3.3), M.Y(1.38), "cos x + sin x = √2·cos(x − π/4)", "m", { a: "start", s: 13, b: true });
      s += K.t(M.X(2), M.Y(1.12), "sin x", "c4", { s: 13, b: true }) + K.t(400, 290, "– – cos x", "a", { a: "start", s: 13, b: true }) + K.t(480, 290, "– – sin x", "c4", { a: "start", s: 13, b: true });
      return K.svg(620, 310, s);
    });

  add("superpos", "Superposition: Störterme einzeln lösen, dann addieren",
    "Bei y″ + y = 2cos x − 8 sin 3x behandelt man die beiden Störterme <b>getrennt</b>: 2cos x führt (wegen Resonanz) auf y₁ = x·sin x, −8 sin 3x auf y₂ = sin 3x. Weil die Gleichung <b>linear</b> ist, löst die <b>Summe</b> y_p = x·sin x + sin 3x die ganze Gleichung – die Wirkungen addieren sich einfach. (Die mittlere Zeile ist zehnfach überhöht, sonst wäre sin 3x kaum zu sehen.)",
    function(K){
      var s = "", rows = [[20, "y₁ = x·sin x  (aus 2cos x)", "c4", function(x){ return x * Math.sin(x); }], [125, "y₂ = sin 3x  (aus −8 sin 3x, 10× vergrößert)", "c3", function(x){ return Math.sin(3 * x); }], [230, "y_p = y₁ + y₂", "m", function(x){ return x * Math.sin(x) + Math.sin(3 * x); }]];
      rows.forEach(function(r, i){
        var M = K.map(30, r[0] + 50, 38, i === 1 ? 36 : 3.6);
        s += K.line(30, r[0] + 50, 620, r[0] + 50, "s", { w: 1.1 });
        s += K.plot(r[3], 0, 4 * PI, M, r[2], { w: i === 2 ? 2.8 : 2.2, n: 500 });
        s += K.t(150, r[0] + 6, r[1], r[2], { a: "start", s: 13, b: true });
      });
      s += K.t(18, 75, "+", "s", { s: 18, b: true }) + K.t(18, 180, "=", "s", { s: 18, b: true });
      s += K.t(600, 330, "x", "s", { it: true, s: 14 });
      return K.svg(640, 340, s);
    });

  add("respoly", "Resonanz erkennen: Liegt k auf einer Nullstelle von p(λ)?",
    "Setzt man B·e^(kx) in die DGL ein, kommt <b>B·p(k)·e^(kx)</b> heraus. Liegt k auf einer <b>Nullstelle</b> von p (rot, k = −1 bei y″ + 4y′ + 3y = 6e^(−x)), ist p(k) = 0 – links steht 0, und es entsteht der Widerspruch <b>0 = 6</b>. Dann den Ansatz mit x multiplizieren (bei doppelter Nullstelle mit x²). Für k = 1 wäre p(1) = 8 ≠ 0 – keine Resonanz.",
    function(K){
      var M = K.map(330, 220, 70, 22), s = K.axes(330, 220, 300, 230, 200, 70, "λ", "p");
      s += K.plot(function(l){ return l * l + 4 * l + 3; }, -4.25, 1.4, M, "a", { w: 3, ymax: 9 });
      s += K.dot(M.X(-3), M.Y(0), "a", 6) + K.t(M.X(-3), M.Y(0) + 18, "−3", "a", { s: 13, b: true });
      s += K.dot(M.X(-1), M.Y(0), "m", 8) + K.t(322, 268, "k = −1: p(k) = 0 ⇒ Resonanz", "m", { a: "end", s: 13, b: true });
      s += K.dot(M.X(1), M.Y(8), "c4", 6) + K.line(M.X(1), M.Y(8), M.X(1), M.Y(0), "c4", { w: 1.2, dash: "4 4" });
      s += K.t(M.X(1) + 12, M.Y(8) + 6, "k = 1: p = 8", "c4", { a: "start", s: 13, b: true });
      s += K.f(160, 40, "p(λ) = λ² + 4λ + 3", "a");
      s += K.f(480, 285, "Ansatz: y_p = A·x·e^(−x)", "m", { fill: "fm" });
      return K.svg(640, 305, s);
    });

  add("resonanz", "Resonanz: der Faktor x lässt die Amplitude wachsen",
    "Bei 4y″ + 9y = 8cos(3x/2) schwingt die Anregung <b>genau in der Eigenfrequenz</b> ω = 3/2. Die Lösung y = (⅔x − 1)·sin(3x/2) hat deshalb den Faktor x: Bei jedem Schwung wird Energie <b>im Takt</b> nachgeschoben, die Hüllkurve (gestrichelt) wächst linear – ohne Grenze. Allgemein: y″ + ω²y = A·cos ωx ⇒ y_p = (A/(2ω))·x·sin ωx.",
    function(K){
      var M = K.map(40, 165, 33, 13.5), s = K.axes(40, 165, 5, 575, 150, 150, "x", "y");
      var env = function(x){ return 2 / 3 * x - 1; };
      s += K.plot(env, 0, 16.9, M, "c3", { w: 1.8, dash: "6 4" }) + K.plot(function(x){ return -env(x); }, 0, 16.9, M, "c3", { w: 1.8, dash: "6 4" });
      s += K.plot(function(x){ return env(x) * Math.sin(1.5 * x); }, 0, 16.9, M, "m", { w: 2.8, n: 600 });
      s += K.t(M.X(6.2), M.Y(env(6.2)) - 26, "Hüllkurve ±(⅔x − 1)", "c3", { a: "end", s: 13, b: true });
      s += K.f(170, 270, "y = (⅔x − 1)·sin(3x/2)", "m", { fill: "fm" });
      return K.svg(640, 320, s);
    });

  add("ablauf", "Ablaufplan: erst y_h, dann y_p, dann Anfangswerte",
    "Die Reihenfolge ist fest: <b>1–2</b> klären die Form (homogene Lösung und Ansatz, Resonanz prüfen), <b>3</b> bestimmt die partikuläre Lösung, <b>4</b> setzt beides zusammen. Erst <b>danach (5)</b> kommen die Anfangsbedingungen – an die Gesamtlösung. Am Ende sichert die <b>Probe (6)</b> das Ergebnis.",
    function(K){
      var s = "", B = [["1  char. Polynom → y_h", "a"], ["2  Ansatz (Resonanz?)", "c3"], ["3  Koeff.-Vergleich → y_p", "a"], ["4  y = y_h + y_p", "c4"], ["5  AB in Gesamtlösung", "m"], ["6  Probe", "s"]];
      var P = [[115, 70], [320, 70], [525, 70], [525, 220], [320, 220], [115, 220]];
      B.forEach(function(b, i){ s += box(K, P[i][0], P[i][1], 190, 54, b[0], b[1], { fill: i === 4 ? "fm" : "p", tc: b[1] === "s" ? "i" : b[1], s: 13.5 }); });
      s += K.arrow(211, 70, 224, 70, "s", { w: 2, head: 9 }) + K.arrow(416, 70, 429, 70, "s", { w: 2, head: 9 });
      s += K.arrow(525, 98, 525, 192, "s", { w: 2, head: 9 }) + K.arrow(429, 220, 416, 220, "s", { w: 2, head: 9 }) + K.arrow(224, 220, 211, 220, "s", { w: 2, head: 9 });
      s += K.t(320, 268, "erst jetzt C₁, C₂ bestimmen!", "m", { s: 13, b: true });
      s += K.t(320, 145, "Form klären  →  zusammensetzen  →  festlegen", "s", { s: 13 });
      return K.svg(640, 290, s);
    });

  add("awpgesamt", "Anfangsbedingungen an die Gesamtlösung – nicht an y_h",
    "Aufgabe A.4b: y″ − 3y′ + 2y = e^(2x), y(0) = 1, y′(0) = 0. <b>Richtig (rot):</b> C₁, C₂ aus y = C₁eˣ + C₂e^(2x) + x·e^(2x) bestimmen ⇒ 3eˣ − 2e^(2x) + x·e^(2x), startet waagerecht. <b>Falsch (grau):</b> C₁, C₂ nur aus y_h bestimmen und y_p hinterher addieren – dann stimmt y(0), aber die Steigung y′(0) = 1 statt 0, weil y_p selbst eine Startsteigung mitbringt.",
    function(K){
      var M = K.map(330, 290, 190, 46), s = K.axes(330, 290, 300, 260, 270, 5, "x", "y");
      var ok = function(x){ return 3 * Math.exp(x) - 2 * Math.exp(2 * x) + x * Math.exp(2 * x); };
      var no = function(x){ return 2 * Math.exp(x) - Math.exp(2 * x) + x * Math.exp(2 * x); };
      s += K.plot(no, -1.5, 1.05, M, "s", { w: 2.4, dash: "7 4", ymax: 5.8 });
      s += K.plot(ok, -1.5, 1.05, M, "m", { w: 3.2 });
      s += K.line(M.X(-0.45), M.Y(1), M.X(0.45), M.Y(1), "c3", { w: 2.2 }) + K.line(M.X(-0.6), M.Y(0.4), M.X(0.6), M.Y(1.6), "s", { w: 1.6 });
      s += K.dot(M.X(0), M.Y(1), "m", 6);
      s += K.t(M.X(-0.5), M.Y(1) - 16, "richtig: y′(0) = 0 ✓", "m", { a: "end", s: 13, b: true });
      s += K.t(M.X(0.05), M.Y(3.6), "falsch: y′(0) = 1 ✗", "s", { a: "start", s: 13, b: true });
      s += K.t(M.X(1.0), M.Y(ok(1)) + 18, "3eˣ − 2e^(2x) + xe^(2x)", "m", { a: "end", s: 12.5, b: true });
      return K.svg(640, 320, s);
    });

  /* ═════════ Kapitel 4: Anwendungen ═════════ */

  add("logist", "Logistisches vs. exponentielles Wachstum",
    "Das <b>exponentielle</b> Modell (orange) wächst ohne Ende. Die <b>logistische</b> Kurve (rot) startet genauso, wird aber gebremst, je näher sie der Kapazität <b>G</b> kommt – sie ist S-förmig mit dem steilsten Anstieg bei <b>G/2</b>. Startet man oberhalb von G, sinkt die Lösung auf G. Die Geraden y ≡ 0 und y ≡ G sind die <b>stationären Lösungen</b>. (Hier G = 4, k = 0,25.)",
    function(K){
      var M = K.map(60, 290, 58, 40), s = K.axes(60, 290, 5, 555, 270, 5, "x", "y");
      var lg = function(A){ return function(x){ return 4 / (1 + A * Math.exp(-x)); }; };
      s += hline(K, M, 4, 0, 9.3, "a", "y ≡ G", { dx: -2, dy: -14, a: "end" });
      s += K.line(M.X(0), M.Y(0), M.X(9.3), M.Y(0), "a", { w: 3 });
      s += K.plot(function(x){ return 0.2 * Math.exp(x); }, 0, 9.3, M, "c3", { w: 2.4, dash: "7 4", ymax: 6.6 });
      s += K.plot(lg(19), 0, 9.3, M, "m", { w: 3.2 });
      s += K.plot(lg(-1 / 3), 0.05, 9.3, M, "c4", { w: 2.4, ymax: 6.6 });
      s += K.dot(M.X(Math.log(19)), M.Y(2), "m", 6) + K.t(M.X(Math.log(19)) + 12, M.Y(2) + 6, "G/2: steilster Anstieg", "m", { a: "start", s: 13, b: true });
      s += K.t(M.X(3.31) - 10, M.Y(6), "exponentiell", "c3", { a: "end", s: 13, b: true });
      s += K.t(M.X(0.4), M.Y(5.5), "Start über G", "c4", { a: "start", s: 13, b: true });
      s += K.t(M.X(9.3) - 2, M.Y(0) - 12, "y ≡ 0", "a", { a: "end", s: 13, b: true });
      return K.svg(620, 320, s);
    });

  add("logfeld", "y′ = k·y·(G − y): Wachstumsrate als Parabel",
    "Trägt man die Wachstumsrate y′ gegen den Bestand y auf, entsteht eine nach unten offene <b>Parabel</b> mit Nullstellen bei 0 und G. Dazwischen ist y′ &gt; 0 (Bestand wächst, Pfeile nach rechts), oberhalb von G ist y′ &lt; 0 (Bestand schrumpft). Am größten ist das Wachstum in der <b>Mitte G/2</b>. Bei 0 und G steht alles still – die stationären Lösungen.",
    function(K){
      var M = K.map(70, 190, 100, 120), s = K.axes(70, 190, 30, 530, 165, 120, "y", "y′");
      s += K.plot(function(y){ return 0.25 * y * (4 - y); }, -0.2, 5.1, M, "a", { w: 3, ymin: -0.95 });
      s += K.dot(M.X(0), M.Y(0), "m", 6) + K.dot(M.X(4), M.Y(0), "m", 7) + K.dot(M.X(2), M.Y(1), "a", 6);
      s += K.line(M.X(2), M.Y(1), M.X(2), M.Y(0), "a", { w: 1.2, dash: "4 4" });
      s += K.t(M.X(2), M.Y(1) - 16, "max. Wachstum bei G/2", "a", { s: 13, b: true });
      s += K.t(M.X(4) + 10, M.Y(0) - 14, "G", "m", { a: "start", s: 15, b: true }) + K.t(M.X(0) + 12, M.Y(0) + 14, "0", "m", { a: "start", s: 15, b: true });
      s += K.arrow(M.X(0.8), M.Y(0) + 22, M.X(1.8), M.Y(0) + 22, "a", { w: 2.4 }) + K.arrow(M.X(2.2), M.Y(0) + 22, M.X(3.4), M.Y(0) + 22, "a", { w: 2.4 });
      s += K.arrow(M.X(5.0), M.Y(0) + 22, M.X(4.3), M.Y(0) + 22, "m", { w: 2.4 });
      s += K.t(M.X(2), M.Y(0) + 44, "y′ > 0: wächst", "a", { s: 13, b: true }) + K.t(M.X(4.6), M.Y(0) - 14, "y′ < 0", "m", { s: 13, b: true });
      s += K.f(450, 40, "y′ = k·y·(G − y)", "a");
      return K.svg(620, 310, s);
    });

  add("pbz", "Partialbruchzerlegung: 1/(y(G − y)) in zwei einfache Brüche",
    "Der Bruch 1/(y(G − y)) (blau) lässt sich nicht direkt integrieren. Man zerlegt ihn in <b>zwei einfache Brüche</b> (1/G)·1/y und (1/G)·1/(G − y) (gestrichelt), deren Summe genau die blaue Kurve ergibt – bei y = G/2 etwa ⅛ + ⅛ = ¼ (G = 4). Jeder Teil integriert sich zu einem <b>Logarithmus</b>.",
    function(K){
      var M = K.map(70, 280, 120, 380), s = K.axes(70, 280, 5, 530, 248, 5, "y", "");
      s += K.plot(function(y){ return 0.25 / y; }, 0.18, 4, M, "c4", { w: 2, dash: "7 4", ymax: 0.6 });
      s += K.plot(function(y){ return 0.25 / (4 - y); }, 0, 3.82, M, "c3", { w: 2, dash: "7 4", ymax: 0.6 });
      s += K.plot(function(y){ return 1 / (y * (4 - y)); }, 0.3, 3.7, M, "a", { w: 3, ymax: 0.6 });
      s += K.line(M.X(4), M.Y(0), M.X(4), M.Y(0.6), "f", { w: 1.2, dash: "4 4" }) + K.t(M.X(4), M.Y(0) + 15, "G", "s", { s: 14, it: true, b: true });
      s += K.dot(M.X(2), M.Y(0.25), "a", 6) + K.dot(M.X(2), M.Y(0.125), "c4", 5);
      s += K.t(M.X(2), M.Y(0.25) - 16, "¼ = ⅛ + ⅛", "a", { s: 13, b: true });
      s += K.t(130, M.Y(0.6), "(1/G)·1/y", "c4", { a: "start", s: 13, b: true });
      s += K.t(490, M.Y(0.6), "(1/G)·1/(G − y)", "c3", { a: "end", s: 13, b: true });
      s += K.t(400, 140, "1/(y(G − y))", "a", { a: "end", s: 13, b: true });
      s += K.f(320, 22, "1/(y(G − y)) = (1/G)·[1/y + 1/(G − y)]", "a");
      return K.svg(620, 310, s);
    });

  function coil(K, x, y0, y1, c){ var n = 4, h = (y1 - y0) / n, d = "M" + x + " " + y0; for(var i = 0; i < n; i++) d += " A" + (h / 2) + " " + (h / 2) + " 0 0 1 " + x + " " + (y0 + (i + 1) * h); return K.path(d, c, { w: 2.2 }); }
  add("kreis", "RL- und RLC-Kreis: Maschenregel → DGL",
    "Die Maschenregel sagt: Die Teilspannungen im Kreis ergeben zusammen die Quellspannung u(t). Am Widerstand fällt <b>R·i</b> ab, an der Spule <b>L·i′</b>, am Kondensator <b>(1/C)·∫i dt</b>. Ohne Kondensator entsteht eine DGL <b>1. Ordnung</b>; mit Kondensator leitet man einmal ab, um das Integral loszuwerden – das gibt <b>2. Ordnung</b>.",
    function(K){
      var s = K.panel(10, 10, 300, 300, "RL-Kreis: 1. Ordnung", "a") + K.panel(330, 10, 300, 300, "RLC-Kreis: 2. Ordnung", "c4");
      [[0, false], [320, true]].forEach(function(p){
        var o = p[0], x0 = 60 + o, x1 = 260 + o, y0 = 70, y1 = 220;
        s += K.line(x0, y0, x1, y0, "i", { w: 2 }) + K.line(x0, y1, x1, y1, "i", { w: 2 }) + K.line(x0, y0, x0, y1, "i", { w: 2 });
        s += K.circ(x0, 145, 20, "i", { fill: "p", w: 2 }) + K.path("M" + (x0 - 10) + " 145 Q" + (x0 - 5) + " 133 " + x0 + " 145 T" + (x0 + 10) + " 145", "i", { w: 1.8 });
        s += K.t(x0 - 28, 145, "u(t)", "i", { a: "end", s: 13, b: true });
        s += K.rect(x0 + 70, y0 - 10, 60, 20, "a", { fill: "p", rx: 1, w: 2 }) + K.t(x0 + 100, y0 - 24, "R", "a", { s: 15, b: true, it: true });
        s += K.line(x1, y0, x1, 110, "i", { w: 2 }) + K.line(x1, 180, x1, y1, "i", { w: 2 }) + coil(K, x1, 110, 180, "c3") + K.t(x1 + 22, 145, "L", "c3", { a: "start", s: 15, b: true, it: true });
        if(p[1]){
          s += K.line(x0 + 92, y1 - 14, x0 + 92, y1 + 14, "c4", { w: 3 }) + K.line(x0 + 108, y1 - 14, x0 + 108, y1 + 14, "c4", { w: 3 });
          s += K.line(x0 + 93, y1, x0 + 107, y1, "p", { w: 6 }) + K.t(x0 + 100, y1 + 28, "C", "c4", { s: 15, b: true, it: true });
        }
        s += K.arrow(x0 + 20, y0 - 14, x0 + 56, y0 - 14, "m", { w: 2, head: 8 }) + K.t(x0 + 38, y0 - 28, "i", "m", { s: 15, it: true, b: true });
      });
      s += K.f(160, 285, "L·i′ + R·i = u", "a", { s: 13.5 });
      s += K.f(480, 285, "L·i″ + R·i′ + i/C = u′", "c4", { s: 13.5, fill: "p" });
      return K.svg(640, 320, s);
    });

  add("einschwing", "Einschwingen: homogener Anteil klingt ab, partikulärer bleibt",
    "RL-Kreis (R = 1, L = 1) mit u = 5·sin 2t, Strom anfangs 0. Die Lösung i(t) (rot) ist die Summe aus dem <b>Einschwingvorgang</b> 2e^(−t) (homogene Lösung, gestrichelt orange), der schnell verschwindet, und dem <b>stationären Zustand</b> sin 2t − 2cos 2t (partikuläre Lösung, gestrichelt violett), der bleibt. Nach etwa 4 Zeiteinheiten sind rot und violett kaum noch zu unterscheiden.",
    function(K){
      var M = K.map(50, 160, 62, 48), s = K.axes(50, 160, 5, 560, 140, 140, "t", "i");
      var ip = function(t){ return Math.sin(2 * t) - 2 * Math.cos(2 * t); };
      s += K.plot(function(t){ return 2 * Math.exp(-t); }, 0, 8.8, M, "c3", { w: 2, dash: "7 4" });
      s += K.plot(ip, 0, 8.8, M, "c4", { w: 2, dash: "7 4" });
      s += K.plot(function(t){ return 2 * Math.exp(-t) + ip(t); }, 0, 8.8, M, "m", { w: 3.2 });
      s += K.t(50, 320, "– – transient: 2e^(−t)", "c3", { a: "start", s: 13, b: true });
      s += K.t(225, 320, "– – stationär: sin 2t − 2cos 2t", "c4", { a: "start", s: 13, b: true });
      s += K.t(460, 320, "—— i = i_h + i_p", "m", { a: "start", s: 13, b: true });
      return K.svg(620, 335, s);
    });

  add("faelle", "Kriechfall, aperiodischer Grenzfall, Schwingfall",
    "Dieselbe Gleichung y″ + 2δ·y′ + y = 0, Start bei y(0) = 1 mit y′(0) = 0 – nur die Dämpfung δ ändert sich. <b>Kriechfall</b> (δ = 2, D &gt; 0): zwei reelle Nullstellen, die Kurve schleicht zur Ruhelage. <b>Aperiodischer Grenzfall</b> (δ = 1, D = 0): (1 + t)e^(−t), der schnellste Weg ohne Überschwingen. <b>Schwingfall</b> (δ = 0,2, D &lt; 0): komplexe Nullstellen, gedämpfte Schwingung um die Ruhelage.",
    function(K){
      var M = K.map(50, 160, 42, 120), s = K.axes(50, 160, 5, 570, 140, 130, "t", "y");
      var l1 = -2 + Math.sqrt(3), l2 = -2 - Math.sqrt(3), c1 = l2 / (l2 - l1), c2 = 1 - c1;
      var be = Math.sqrt(0.96);
      s += K.plot(function(t){ return Math.exp(-0.2 * t) * (Math.cos(be * t) + 0.2 / be * Math.sin(be * t)); }, 0, 13, M, "c4", { w: 2.6, n: 400 });
      s += K.plot(function(t){ return c1 * Math.exp(l1 * t) + c2 * Math.exp(l2 * t); }, 0, 13, M, "a", { w: 2.8 });
      s += K.plot(function(t){ return (1 + t) * Math.exp(-t); }, 0, 13, M, "m", { w: 3 });
      s += K.dot(M.X(0), M.Y(1), "i", 5);
      s += K.t(340, 236, "Kriechfall (δ = 2, D > 0)", "a", { a: "start", s: 13, b: true });
      s += K.t(340, 258, "aperiodischer Grenzfall (δ = 1, D = 0)", "m", { a: "start", s: 13, b: true });
      s += K.t(340, 280, "Schwingfall (δ = 0,2, D < 0)", "c4", { a: "start", s: 13, b: true });
      return K.svg(620, 310, s);
    });
})();
