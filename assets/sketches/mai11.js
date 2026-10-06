/* Skizzen zu MAI11 – Stochastik II (zweidimensionale Zufallsgrößen, deskriptive Statistik, Schätzen und Testen).
   Jede Skizze: t = Titel, c = Lesehilfe (HTML), svg = function(K) → SVG-String (K = window.SK). */
(function(){
  "use strict";
  var S = window.ITI_SKETCHES = window.ITI_SKETCHES || {};
  function add(id, t, c, f){ S["mai11-" + id] = { t: t, c: c, svg: f }; }
  function lines(K, x, y, arr, c, o){ o = o || {}; var s = ""; for(var i = 0; i < arr.length; i++) s += K.t(x, y + i * (o.lh || 22), arr[i], c || "s", { a: o.a || "start", s: o.s || 13.5, b: o.b }); return s; }
  var SQ = Math.sqrt(2 * Math.PI);
  function npdf(z){ return Math.exp(-z * z / 2) / SQ; }
  function fmt(x, d){ return x.toFixed(d).replace(".", ","); }
  function rng(seed){ var s = seed; return function(){ s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function gauss(r){ var u = r() || 1e-9, v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  /* Tabelle aus Zellen; st(i,j) → {c, fill, tc, s} */
  function table(K, x0, y0, cw, ch, rows, st){
    var s = "";
    rows.forEach(function(r, i){ r.forEach(function(v, j){
      var o = (st && st(i, j)) || {};
      s += K.cell(x0 + j * cw + cw / 2, y0 + i * ch + ch / 2, v, o.c || "r", { w: cw, h: ch, fill: o.fill || "p", tc: o.tc || "i", s: o.s || 14, rx: 0, bw: 1.2 });
    }); });
    return s;
  }
  /* waagerechte Spanne mit Endstrichen */
  function span(K, x1, x2, y, c, o){ o = o || {}; return K.line(x1, y, x2, y, c, { w: o.w || 2.2 }) + K.line(x1, y - 6, x1, y + 6, c, { w: 2 }) + K.line(x2, y - 6, x2, y + 6, c, { w: 2 }); }
  /* Ellipse */
  function ell(K, cx, cy, rx, ry, c, o){ return K.path("M" + (cx - rx) + " " + cy + " A" + rx + " " + ry + " 0 1 0 " + (cx + rx) + " " + cy + " A" + rx + " " + ry + " 0 1 0 " + (cx - rx) + " " + cy, c, o); }
  /* Glockenkurve: Fläche zwischen a und b */
  function bellArea(K, M, a, b, c, mu, sd){ mu = mu || 0; sd = sd || 1; return K.area(function(z){ return npdf((z - mu) / sd) / sd; }, a, b, M, c); }
  function bell(K, M, a, b, c, mu, sd, o){ mu = mu || 0; sd = sd || 1; return K.plot(function(z){ return npdf((z - mu) / sd) / sd; }, a, b, M, c, o); }

  /* Gemeinsame Beispieltabelle aus Kapitel 1 (selbst gewählt, Summe 1) */
  var P = [[0.1, 0.2, 0.1], [0.2, 0.1, 0.3]];
  /* Gemeinsamer Datensatz für Kapitel 2 (Lage/Streuung) und Regression */
  var DX = [1, 2, 3, 4, 5], DY = [2, 3, 5, 4, 6];

  /* ═════════ Kapitel 1: Zweidimensionale Zufallsgrößen ═════════ */

  add("tabelle", "Verteilungstabelle und Randverteilungen",
    "Innen stehen die gemeinsamen Wahrscheinlichkeiten P(X = xᵢ, Y = yⱼ). Addiert man eine <b>Zeile</b>, landet die Summe am rechten Rand (P(X = xᵢ)), addiert man eine <b>Spalte</b>, am unteren Rand (P(Y = yⱼ)) – daher der Name <b>Randverteilung</b>. Beide Ränder ergeben zusammen wieder 1.",
    function(K){
      var R = [["X \\ Y", "y = 1", "y = 2", "y = 3", "P(X = x)"], ["x = 0", "0,1", "0,2", "0,1", "0,4"], ["x = 1", "0,2", "0,1", "0,3", "0,6"], ["P(Y = y)", "0,3", "0,3", "0,4", "1"]];
      var s = table(K, 50, 24, 100, 46, R, function(i, j){
        if(i === 0 || j === 0) return { tc: "s", s: 13 };
        if(i === 3 || j === 4) return { fill: "fm", c: "m", tc: "m" };
        return { fill: "fa", c: "a" };
      });
      s += K.t(600, 93, "Zeilen-", "m", { s: 13, b: true }) + K.t(600, 111, "summen", "m", { s: 13, b: true });
      s += K.t(300, 226, "↑ Spaltensummen", "m", { s: 13, b: true });
      s += K.f(320, 268, "P(X = 0) = 0,1 + 0,2 + 0,1 = 0,4", "m", { fill: "fm" });
      s += K.f(320, 306, "P(Y = 3) = 0,1 + 0,3 = 0,4", "m", { fill: "fm" });
      return K.svg(650, 330, s);
    });

  add("unabh", "Unabhängigkeit: jede Zelle = Rand × Rand",
    "<b>Links</b> eine unabhängige Tabelle: Jede Zelle ist genau das Produkt aus ihrem Zeilen- und Spaltenrand. <b>Rechts</b> die Beispieltabelle: Schon die erste Zelle passt nicht (0,4 · 0,3 = 0,12, es steht aber 0,1 da) – <b>ein Gegenbeispiel</b> genügt, X und Y sind abhängig.",
    function(K){
      var s = K.panel(10, 10, 305, 280, "unabhängig", "a") + K.panel(325, 10, 305, 280, "Beispieltabelle", "m");
      var L = [["X\\Y", "1", "2", "3", "∑"], ["0", "0,12", "0,12", "0,16", "0,4"], ["1", "0,18", "0,18", "0,24", "0,6"], ["∑", "0,3", "0,3", "0,4", "1"]];
      var R = [["X\\Y", "1", "2", "3", "∑"], ["0", "0,1", "0,2", "0,1", "0,4"], ["1", "0,2", "0,1", "0,3", "0,6"], ["∑", "0,3", "0,3", "0,4", "1"]];
      function st(bad){ return function(i, j){
        if(i === 0 || j === 0) return { tc: "s", s: 13 };
        if(i === 3 || j === 4) return { fill: "fm", c: "m", tc: "m", s: 13 };
        if(bad && i === 1 && j === 1) return { fill: "fm", c: "m", tc: "m", s: 13 };
        return { fill: "fa", c: "a", s: 13 };
      }; }
      s += table(K, 27, 40, 54, 36, L, st(false)) + table(K, 342, 40, 54, 36, R, st(true));
      s += lines(K, 30, 205, ["jede Zelle = Zeilenrand · Spaltenrand", "z. B. 0,4 · 0,3 = 0,12 ✓"], "a", { s: 13 });
      s += lines(K, 345, 205, ["0,4 · 0,3 = 0,12 ≠ 0,1", "⇒ X und Y sind abhängig"], "m", { s: 13, b: true });
      return K.svg(640, 300, s);
    });

  add("eg", "E(g(X,Y)): jeden Wert mit seinem Gewicht",
    "Jede Blase ist ein Paar (x, y); ihre <b>Größe</b> ist die Wahrscheinlichkeit, die Zahl darin der Wert <b>g = x·y</b>. Der Erwartungswert ist die <b>gewichtete Summe</b> aller Werte – wie bei einer Zufallsgröße, nur über alle Zellen der Tabelle. Die Zeile x = 0 trägt nichts bei, weil dort g = 0 ist.",
    function(K){
      var s = K.t(30, 30, "g(x, y) = x · y", "a", { a: "start", s: 14, b: true });
      var cx = [220, 350, 480], cy = [100, 200];
      [1, 2, 3].forEach(function(y, j){ s += K.t(cx[j], 34, "y = " + y, "s", { s: 13, b: true }); });
      [0, 1].forEach(function(x, i){
        s += K.t(120, cy[i], "x = " + x, "s", { s: 13, b: true });
        for(var j = 0; j < 3; j++){
          var p = P[i][j], r = 70 * Math.sqrt(p), g = x * (j + 1);
          s += K.circ(cx[j], cy[i], r, g ? "a" : "f", { fill: g ? "fa" : "p", w: 1.8 });
          s += K.t(cx[j], cy[i], "g = " + g, g ? "a" : "s", { s: 13, b: true, halo: false });
          s += K.t(cx[j], cy[i] + r + 12, "p = " + fmt(p, 1), "s", { s: 12 });
        }
      });
      s += K.f(320, 292, "E(X·Y) = 0 + 1·0,2 + 2·0,1 + 3·0,3 = 1,3", "m", { fill: "fm" });
      return K.svg(640, 320, s);
    });

  add("eadd", "E(X + Y) = E(X) + E(Y) – immer",
    "Erwartungswerte verhalten sich wie <b>Strecken, die man aneinanderlegt</b>: erst E(X), dann E(Y) dazu, ergibt E(X + Y). Das gilt <b>immer</b>, auch wenn X und Y abhängig sind – wie in der Beispieltabelle mit E(X) = 0,6 und E(Y) = 2,1.",
    function(K){
      var X = function(v){ return 70 + v * 150; }, s = "";
      s += K.line(X(-0.2), 180, X(3.2), 180, "s", { w: 1.3 });
      for(var v = 0; v <= 3; v++) s += K.line(X(v), 175, X(v), 185, "s", { w: 1.2 }) + K.t(X(v), 199, String(v), "f", { s: 12 });
      s += K.line(X(0.6), 70, X(0.6), 180, "f", { w: 1, dash: "4 4" }) + K.line(X(2.7), 70, X(2.7), 180, "f", { w: 1, dash: "4 4" });
      s += K.arrow(X(0), 80, X(0.6), 80, "a", { w: 3 }) + K.arrow(X(0.6), 80, X(2.7), 80, "c4", { w: 3 });
      s += K.t(X(0.3), 58, "E(X) = 0,6", "a", { s: 13, b: true }) + K.t(X(1.65), 58, "E(Y) = 2,1", "c4", { s: 13, b: true });
      s += K.arrow(X(0), 140, X(2.7), 140, "m", { w: 3 }) + K.t(X(1.35), 122, "E(X + Y) = 2,7", "m", { s: 13, b: true });
      s += K.t(300, 238, "gilt immer – auch für die abhängigen X, Y der Beispieltabelle", "s", { s: 13 });
      return K.svg(600, 260, s);
    });

  add("versch", "Verschiebungssatz V(X) = E(X²) − (E X)² als Flächen",
    "Der große Quadrat-Inhalt ist <b>E(X²)</b>, das innere Quadrat <b>(E X)²</b>. Was übrig bleibt – der rote <b>Winkelstreifen</b> – ist die Varianz. Beim Würfel: 15,167 − 12,25 = 2,917. Weil der Streifen nie negativ sein kann, ist immer E(X²) ≥ (E X)².",
    function(K){
      var u = 55, ox = 50, oy = 300, so = Math.sqrt(91 / 6) * u, si = 3.5 * u, s = "";
      s += K.rect(ox, oy - so, so, so, "m", { fill: "fm", rx: 0, w: 1.6 }) + K.rect(ox, oy - si, si, si, "a", { fill: "fa", rx: 0, w: 1.6 });
      s += K.t(ox + si / 2, oy - si / 2 - 11, "(E X)² = 3,5²", "a", { s: 14, b: true }) + K.t(ox + si / 2, oy - si / 2 + 11, "= 12,25", "a", { s: 14, b: true });
      s += K.t(ox + so / 2, oy - so - 16, "E(X²) = 91/6 ≈ 15,167", "m", { s: 13.5, b: true });
      s += K.arrow(292, 112, ox + so - 8, 128, "m", { w: 1.8, head: 9 }) + K.t(298, 112, "V(X) = 2,917", "m", { a: "start", s: 14, b: true });
      s += lines(K, 300, 170, ["Würfel:", "E(X²) = (1+4+9+16+25+36)/6 = 91/6", "(E X)² = 3,5² = 12,25", "V(X) = 15,167 − 12,25 = 2,917"], "s", { s: 13 });
      return K.svg(600, 320, s);
    });

  add("lin", "Lineare Transformation: E(aX + b) und V(aX + b) = a²·V(X)",
    "Mit <b>a = 2</b> rücken alle Werte doppelt so weit auseinander – die Abstände zum Mittel verdoppeln sich, ihre <b>Quadrate vervierfachen</b> sich: V(2X) = 4·V(X). Das <b>+ b</b> verschiebt nur das Ganze; der Erwartungswert wandert mit, die Streuung bleibt gleich.",
    function(K){
      var X = function(v){ return 265 + v * 55; }, s = "", rows = [
        { y: 90, v: [-1, 0, 1], lab: "X", V: "V = 2/3", E: 0, c: "a" },
        { y: 195, v: [-2, 0, 2], lab: "2X", V: "V = 8/3", E: 0, c: "c4" },
        { y: 300, v: [1, 3, 5], lab: "2X + 3", V: "V = 8/3", E: 3, c: "c3" }];
      rows.forEach(function(r){
        s += K.line(X(-3), r.y, X(6), r.y, "f", { w: 1.2 });
        r.v.forEach(function(v){ s += K.rect(X(v) - 13, r.y - 50, 26, 50, r.c, { fill: "fa", rx: 1, w: 1.4 }) + K.t(X(v), r.y + 13, String(v).replace("-", "−"), "s", { s: 12 }); });
        s += K.t(15, r.y - 34, r.lab, r.c, { a: "start", s: 15, b: true }) + K.t(15, r.y - 12, r.V, "s", { a: "start", s: 12.5 });
        s += K.dot(X(r.E), r.y + 26, "m", 4) + K.t(X(r.E) + 8, r.y + 27, "E = " + r.E, "m", { a: "start", s: 12, b: true });
      });
      s += K.line(X(1), 112, X(2), 141, "c4", { w: 1.4, dash: "4 3" }) + K.line(X(-1), 112, X(-2), 141, "c4", { w: 1.4, dash: "4 3" });
      s += K.t(X(2.6), 124, "· 2", "c4", { s: 13, b: true });
      s += K.line(X(2), 237, X(5), 248, "c3", { w: 1.4, dash: "4 3" }) + K.t(X(3.9), 230, "+ 3", "c3", { s: 13, b: true });
      return K.svg(660, 340, s);
    });

  add("vsum", "V(X + Y) = V(X) + V(Y) + 2·cov(X,Y) – wie ein Kosinussatz",
    "Stell dir die Standardabweichungen als <b>Pfeile</b> vor, der Winkel zwischen ihnen hat cos θ = ρ. Hier σX = 2 und σY = 1,5; die Länge des Summenpfeils ist σ(X+Y). Bei <b>ρ = 0</b> stehen sie senkrecht – Pythagoras: Die Varianzen addieren sich einfach. Positive Korrelation macht die Summe länger, negative kürzer.",
    function(K){
      var s = "", sets = [[0, "ρ = 0 (unkorreliert)"], [0.5, "ρ = 0,5"], [-0.5, "ρ = −0,5"]];
      sets.forEach(function(q, i){
        var px = 10 + i * 210, rho = q[0], th = Math.acos(rho), a = 100, b = 75;
        s += K.panel(px, 10, 200, 270, q[1], i === 0 ? "a" : "s");
        var O = [px + 35, 235], A = [O[0] + a, O[1]], B = [A[0] + b * Math.cos(th), A[1] - b * Math.sin(th)];
        s += K.arrow(O[0], O[1], A[0], A[1], "a", { w: 2.6 }) + K.arrow(A[0], A[1], B[0], B[1], "c4", { w: 2.6 }) + K.arrow(O[0], O[1], B[0], B[1], "m", { w: 2.6 });
        s += K.t((O[0] + A[0]) / 2, O[1] + 16, "σX", "a", { s: 14, b: true });
        s += K.t((A[0] + B[0]) / 2 + 22, (A[1] + B[1]) / 2 + 4, "σY", "c4", { s: 14, b: true });
        var len = Math.sqrt(a * a + b * b + 2 * a * b * rho);
        var mx = (O[0] + B[0]) / 2, my = (O[1] + B[1]) / 2, dx = B[0] - O[0], dy = B[1] - O[1], L = Math.sqrt(dx * dx + dy * dy);
        s += K.t(mx + dy / L * 26, my - dx / L * 26, "σ(X+Y)", "m", { s: 13, b: true });
        s += K.t(px + 100, 60, "σ(X+Y) = " + fmt(len / 50, 2), "m", { s: 12.5, b: true });
        if(rho === 0) s += K.ra(A[0], A[1], O[0], O[1], B[0], B[1], 12, "s");
      });
      s += K.f(320, 305, "σ²(X+Y) = σX² + σY² + 2·ρ·σX·σY   (cov = ρ·σX·σY)", "m", { fill: "fm", s: 13 });
      return K.svg(640, 325, s);
    });

  add("vsumn", "Summe unabhängiger Größen: Streuung wächst mit √n",
    "Unabhängige Summanden verhalten sich wie <b>Pfeile, die jeweils senkrecht</b> zur bisherigen Summe stehen. Jeder hat die Länge σ, aber die Gesamtlänge wächst nur wie <b>σ·√n</b> – die Varianzen (Quadrate) addieren sich: V(∑Xᵢ) = n·σ². Bei 100 Würfelwürfen: σ·√100 = 1,708·10 = 17,08.",
    function(K){
      var O = [220, 200], sg = 58, s = "", pts = [], ang = 0, r = 1;
      for(var k = 1; k <= 6; k++){
        if(k > 1){ ang += Math.atan(1 / Math.sqrt(k - 1)); }
        pts.push([O[0] + sg * Math.sqrt(k) * Math.cos(ang), O[1] - sg * Math.sqrt(k) * Math.sin(ang), ang, k]);
      }
      pts.forEach(function(p){ s += K.line(O[0], O[1], p[0], p[1], "f", { w: 1.2, dash: p[3] === 6 ? "" : "4 4" }); });
      s += K.arrow(O[0], O[1], pts[0][0], pts[0][1], "a", { w: 2.4, head: 10 });
      for(var i = 1; i < pts.length; i++) s += K.arrow(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], "a", { w: 2.4, head: 10 });
      s += K.arrow(O[0], O[1], pts[5][0], pts[5][1], "m", { w: 2.6 });
      pts.forEach(function(p){
        var lab = p[3] === 1 ? "σ" : "√" + p[3] + "·σ";
        s += K.t(p[0] + 26 * Math.cos(p[2]), p[1] - 26 * Math.sin(p[2]), lab, p[3] === 6 ? "m" : "s", { s: 13, b: true });
      });
      s += K.dot(O[0], O[1], "i", 4);
      s += lines(K, 370, 90, ["jeder Pfeil = ein Xᵢ, Länge σ", "unabhängig ⇒ „senkrecht“ angesetzt", "V(X₁ + … + Xₙ) = n·σ²", "Streuung der Summe: σ·√n", "100 Würfe: 1,708 · 10 = 17,08"], "s", { s: 13, lh: 26 });
      return K.svg(640, 300, s);
    });

  add("cov", "Kovarianz als Summe von Rechtecken",
    "Vom Schwerpunkt (x̄, ȳ) aus spannt jeder Punkt ein <b>Rechteck</b> mit der Fläche (xᵢ − x̄)(yᵢ − ȳ). Rechts oben und links unten zählt es <b>positiv</b>, in den anderen beiden Ecken <b>negativ</b>. Die Kovarianz ist der Durchschnitt dieser Flächen: Überwiegen die positiven, steigen die Daten gemeinsam.",
    function(K){
      var M = K.map(60, 300, 60, 38), s = K.axes(60, 300, 5, 370, 266, 5, "x", "y"), mx = 3, my = 4;
      for(var i = 0; i < 5; i++){
        var x = DX[i], y = DY[i];
        if(x !== mx && y !== my) s += K.rect(Math.min(M.X(x), M.X(mx)), Math.min(M.Y(y), M.Y(my)), Math.abs(M.X(x) - M.X(mx)), Math.abs(M.Y(y) - M.Y(my)), "a", { fill: "fa", rx: 0, w: 1.2 });
      }
      s += K.line(M.X(mx), 30, M.X(mx), 300, "c3", { w: 1.4, dash: "6 4" }) + K.line(60, M.Y(my), 425, M.Y(my), "c3", { w: 1.4, dash: "6 4" });
      DX.forEach(function(x, i){ s += K.dot(M.X(x), M.Y(DY[i]), "i", 5); });
      s += K.t(150, 210, "+4", "a", { s: 14, b: true }) + K.t(210, 167, "+1", "a", { s: 13, b: true }) + K.t(300, 110, "+4", "a", { s: 14, b: true });
      s += K.t(226, M.Y(5), "0", "s", { s: 13, b: true }) + K.t(M.X(4), M.Y(4) + 15, "0", "s", { s: 13, b: true });
      s += K.t(400, 70, "+", "a", { s: 22, b: true }) + K.t(95, 268, "+", "a", { s: 22, b: true }) + K.t(130, 70, "−", "m", { s: 22, b: true }) + K.t(380, 250, "−", "m", { s: 22, b: true });
      s += K.t(M.X(mx), 316, "x̄ = 3", "c3", { s: 12.5, b: true }) + K.t(410, M.Y(my) - 12, "ȳ = 4", "c3", { s: 12.5, b: true });
      s += lines(K, 440, 110, ["∑ (xᵢ − x̄)(yᵢ − ȳ)", "= 4 + 1 + 0 + 0 + 4 = 9", "sₓᵧ = 9 / (5 − 1) = 2,25"], "s", { s: 13.5, lh: 26 });
      s += K.t(440, 210, "> 0 ⇒ steigen gemeinsam", "a", { a: "start", s: 13, b: true });
      return K.svg(640, 325, s);
    });

  add("rho", "Korrelationskoeffizient: −1 ≤ r ≤ 1",
    "Der Korrelationskoeffizient misst, wie eng die Punkte an <b>einer Geraden</b> liegen. Bei ±1 liegen sie exakt darauf (fallend oder steigend), bei 0 ist kein linearer Trend erkennbar. Weil die Kovarianz durch beide Standardabweichungen geteilt wird, hat r <b>keine Einheit</b> und kann den Bereich [−1, 1] nie verlassen.",
    function(K){
      var s = "", set = [[-1, "perfekt fallend"], [0, "kein lin. Trend"], [0.8, "stark steigend"], [1, "perfekt steigend"]];
      set.forEach(function(q, k){
        var px = 10 + k * 157, cx = px + 74, cy = 140, rho = q[0], R = rng(11 + k * 7), xs = [], ys = [];
        s += K.panel(px, 10, 148, 245, q[1], k === 1 ? "s" : "a");
        for(var i = 0; i < 36; i++){ var x = gauss(R), e = gauss(R); xs.push(x); ys.push(rho * x + Math.sqrt(1 - rho * rho) * e); }
        var mx = xs.reduce(function(a, b){ return a + b; }) / xs.length, my = ys.reduce(function(a, b){ return a + b; }) / ys.length, sxy = 0, sxx = 0, syy = 0;
        for(i = 0; i < xs.length; i++){ sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) * (xs[i] - mx); syy += (ys[i] - my) * (ys[i] - my); }
        var r = sxy / Math.sqrt(sxx * syy);
        s += K.line(cx - 60, cy, cx + 60, cy, "r", { w: 1 }) + K.line(cx, cy - 60, cx, cy + 60, "r", { w: 1 });
        for(i = 0; i < xs.length; i++){
          var X = Math.max(-2.7, Math.min(2.7, xs[i])), Y = Math.max(-2.7, Math.min(2.7, ys[i]));
          s += K.dot(cx + X * 21, cy - Y * 21, k === 1 ? "s" : "a", 3.2);
        }
        var lab = Math.abs(rho) === 1 ? "r = " + (rho < 0 ? "−1" : "+1") : "r = " + fmt(r, 2).replace("-", "−");
        s += K.t(cx, 228, lab, Math.abs(rho) === 1 ? "m" : "i", { s: 15, b: true });
      });
      s += K.f(320, 285, "r = sₓᵧ / (sₓ·sᵧ)     ρ = cov(X,Y) / (σX·σY)", "a", { s: 13 });
      return K.svg(640, 305, s);
    });

  add("unkorr", "Unabhängig ⟹ unkorreliert – aber nicht umgekehrt",
    "<b>Links:</b> Alle unabhängigen Paare liegen in der größeren Menge der unkorrelierten. <b>Rechts</b> der Beweis, dass die Umkehrung falsch ist: y = x² hängt <b>vollständig</b> von x ab, doch weil die Punkte symmetrisch liegen, heben sich die Kovarianz-Rechtecke weg – r = 0. Die Korrelation misst eben nur den <b>linearen</b> Zusammenhang.",
    function(K){
      var s = K.panel(10, 10, 300, 300, "Mengenbild") + K.panel(330, 10, 300, 300, "y = x²: abhängig, aber r = 0", "m");
      s += ell(K, 160, 160, 130, 95, "a", { w: 2, fill: "fa" }) + ell(K, 160, 185, 68, 44, "c4", { w: 2, fill: "p" });
      s += K.t(160, 92, "unkorreliert (ρ = 0)", "a", { s: 14, b: true }) + K.t(160, 185, "unabhängig", "c4", { s: 14, b: true });
      s += K.t(160, 278, "unabhängig ⟹ unkorreliert, nicht ⟸", "s", { s: 12.5 });
      var M = K.map(480, 250, 50, 38);
      s += K.line(355, 250, 605, 250, "s", { w: 1.2 }) + K.line(480, 260, 480, 55, "s", { w: 1.2 });
      s += K.plot(function(x){ return x * x; }, -2.3, 2.3, M, "f", { w: 1.6, dash: "6 4", ymax: 5 });
      [-2, -1, 0, 1, 2].forEach(function(x){ s += K.dot(M.X(x), M.Y(x * x), "m", 5.5) + K.t(M.X(x), 268, String(x).replace("-", "−"), "f", { s: 12 }); });
      s += K.t(590, 190, "y = x²", "s", { s: 13, b: true });
      s += K.t(480, 290, "∑xᵢyᵢ = ∑xᵢ³ = 0, x̄ = 0 ⇒ r = 0", "m", { s: 12.5, b: true });
      return K.svg(640, 320, s);
    });

  add("zgws", "Zentraler Grenzwertsatz: Summen werden glockenförmig",
    "Die Verteilung der <b>Augensumme</b> von n Würfeln: Ein Würfel ist gleichverteilt (flach), zwei ergeben ein Dreieck, vier schon fast eine <b>Glocke</b>. Die rote Kurve ist die Normalverteilung mit Mittel n·3,5 und Streuung 1,708·√n – sie passt immer besser, obwohl der einzelne Würfel gar nicht normalverteilt ist.",
    function(K){
      var s = "";
      [1, 2, 4].forEach(function(n, k){
        var px = 10 + k * 210, d = [1];
        for(var t = 0; t < n; t++){ var e = []; for(var i = 0; i < d.length + 6; i++) e.push(0); d.forEach(function(p, i){ for(var f = 1; f <= 6; f++) e[i + f] += p / 6; }); d = e; }
        var mu = 3.5 * n, sd = 1.7078 * Math.sqrt(n), mx = Math.max(Math.max.apply(null, d), npdf(0) / sd), u = 160 / (5 * n + 1), M = K.map(px + 20 - (n - 0.5) * u, 250, u, 175 / mx);
        s += K.panel(px, 10, 200, 285, n === 1 ? "1 Würfel" : n + " Würfel");
        s += K.line(px + 12, 250, px + 188, 250, "s", { w: 1.2 });
        for(var v = n; v <= 6 * n; v++) s += K.bar(v, d[v], 0.8, M, "a");
        s += K.plot(function(x){ return npdf((x - mu) / sd) / sd; }, n - 0.5, 6 * n + 0.5, M, "m", { w: 2.2 });
        s += K.t(M.X(n), 264, String(n), "f", { s: 12 }) + K.t(M.X(6 * n), 264, String(6 * n), "f", { s: 12 });
        s += K.t(px + 100, 284, ["flach", "Dreieck", "fast Glocke"][k], "s", { s: 13, b: true });
      });
      return K.svg(640, 305, s);
    });

  add("stand", "Standardisieren: ∑Xᵢ → Z (100 Würfelwürfe)",
    "Oben die Verteilung der Augensumme (Mitte 350, Streuung 17,08), unten dieselbe Glocke als <b>Standardnormalverteilung</b>. Standardisieren heißt nur: <b>Nullpunkt verschieben</b> (− n·μ) und <b>Maßstab ändern</b> (÷ σ·√n). Aus 400 wird so 2,927, und die Fläche links davon liest man in der Φ-Tabelle ab: 0,9985.",
    function(K){
      var Mt = K.map(320, 110, 85, 175), Mb = K.map(320, 270, 85, 175), s = "";
      s += bellArea(K, Mb, -3.2, 2.927, "fa");
      s += bell(K, Mt, -3.2, 3.4, "a", 0, 1, { w: 2.2 }) + bell(K, Mb, -3.2, 3.4, "a", 0, 1, { w: 2.2 });
      s += K.arrow(40, 110, 620, 110, "s", { w: 1.3, head: 9 }) + K.arrow(40, 270, 620, 270, "s", { w: 1.3, head: 9 });
      s += K.t(612, 92, "∑Xᵢ", "s", { s: 14, it: true }) + K.t(614, 252, "Z", "s", { s: 14, it: true });
      [-2, -1, 0, 1, 2].forEach(function(z){
        s += K.line(Mt.X(z), 106, Mt.X(z), 114, "s", { w: 1.2 }) + K.t(Mt.X(z), 126, fmt(350 + z * 17.08, 1).replace(",0", ""), "f", { s: 12 });
        s += K.line(Mb.X(z), 266, Mb.X(z), 274, "s", { w: 1.2 }) + K.t(Mb.X(z), 286, String(z).replace("-", "−"), "f", { s: 12 });
      });
      s += K.line(Mt.X(0), 134, Mb.X(0), 262, "c4", { w: 1.3, dash: "5 4" }) + K.line(Mt.X(2.927), 114, Mb.X(2.927), 266, "m", { w: 1.6, dash: "5 4" });
      s += K.dot(Mt.X(2.927), 110, "m", 5) + K.dot(Mb.X(2.927), 270, "m", 5);
      s += K.t(Mt.X(2.927) + 8, 126, "400", "m", { a: "start", s: 12.5, b: true }) + K.t(Mb.X(2.927) + 8, 286, "2,927", "m", { a: "start", s: 12.5, b: true });
      s += K.t(40, 160, "Z = (∑Xᵢ − 350) / 17,08", "c4", { a: "start", s: 13.5, b: true });
      s += K.t(40, 182, "verschieben, dann stauchen", "s", { a: "start", s: 12.5 });
      s += K.t(395, 190, "Φ(2,927) ≈ 0,9985", "a", { a: "start", s: 13.5, b: true });
      return K.svg(640, 300, s);
    });

  add("phi", "Φ(−x) = 1 − Φ(x) und P(a ≤ Z ≤ b) = Φ(b) − Φ(a)",
    "Φ(x) ist die <b>Fläche links von x</b> unter der Glocke. <b>Links:</b> Weil die Glocke symmetrisch ist, ist das linke Ende bis −x genauso groß wie das rechte ab x – daher Φ(−x) = 1 − Φ(x). <b>Rechts:</b> Die Fläche zwischen a und b ist „alles links von b“ minus „alles links von a“.",
    function(K){
      var s = K.panel(10, 10, 305, 290, "Symmetrie") + K.panel(325, 10, 305, 290, "Fläche zwischen a und b");
      var A = K.map(162, 230, 50, 320), B = K.map(477, 230, 50, 320);
      s += bellArea(K, A, -2.8, -1, "fa") + bellArea(K, A, 1, 2.8, "fm") + bellArea(K, B, -0.5, 1.5, "fa");
      [A, B].forEach(function(M){ s += K.line(M.X(-2.9), 230, M.X(2.9), 230, "s", { w: 1.2 }) + bell(K, M, -2.8, 2.8, "a", 0, 1, { w: 2.2 }); });
      s += K.t(A.X(-1), 246, "−x", "s", { s: 13, it: true }) + K.t(A.X(1), 246, "x", "s", { s: 13, it: true });
      s += K.t(52, 160, "Φ(−x)", "a", { a: "start", s: 13, b: true }) + K.t(292, 160, "1 − Φ(x)", "m", { a: "end", s: 13, b: true });
      s += K.arrow(72, 170, A.X(-1.5) - 2, 214, "a", { w: 1.4, head: 8 }) + K.arrow(262, 170, A.X(1.5) + 2, 214, "m", { w: 1.4, head: 8 });
      s += K.t(B.X(-0.5), 246, "a", "s", { s: 13, it: true }) + K.t(B.X(1.5), 246, "b", "s", { s: 13, it: true });
      s += K.t(B.X(0.5), 195, "Φ(b) − Φ(a)", "a", { s: 13, b: true });
      s += K.f(162, 278, "Φ(−x) = 1 − Φ(x)", "a", { s: 13 }) + K.f(477, 278, "P(a ≤ Z ≤ b) = Φ(b) − Φ(a)", "a", { s: 13 });
      return K.svg(640, 310, s);
    });

  /* ═════════ Kapitel 2: Deskriptive Statistik ═════════ */

  add("grund", "Grundgesamtheit, Stichprobe, Merkmal",
    "Die <b>Grundgesamtheit</b> sind alle Objekte, über die man etwas sagen will (links). Untersucht wird nur eine <b>Stichprobe</b> – hier n = 8 markierte Objekte. An jedem misst man dasselbe <b>Merkmal</b> (z. B. Körpergröße); der konkrete Messwert ist die <b>Merkmalsausprägung</b>.",
    function(K){
      var s = K.rect(20, 40, 310, 240, "s", { fill: "p", rx: 10, w: 1.4 }) + K.t(175, 26, "Grundgesamtheit", "s", { s: 14, b: true });
      var pick = { "1,2": 1, "3,7": 1, "5,1": 1, "6,10": 1, "2,5": 1, "7,4": 1, "4,9": 1, "0,8": 1 };
      for(var r = 0; r < 8; r++) for(var c = 0; c < 12; c++){
        var x = 47 + c * 23.5, y = 66 + r * 27;
        s += pick[r + "," + c] ? K.dot(x, y, "a", 6) + K.circ(x, y, 10, "a", { w: 1.6 }) : K.dot(x, y, "f", 4.5);
      }
      s += K.arrow(338, 160, 398, 160, "a", { w: 2.6 }) + K.t(368, 140, "Auswahl", "a", { s: 12, b: true });
      s += K.rect(405, 80, 215, 150, "a", { fill: "fa", rx: 10, w: 1.6 }) + K.t(512, 66, "Stichprobe (n = 8)", "a", { s: 14, b: true });
      var h = ["172", "185", "168", "178", "191", "165", "180", "176"];
      for(var i = 0; i < 8; i++){
        var xx = 440 + (i % 4) * 48, yy = 125 + Math.floor(i / 4) * 60;
        s += K.dot(xx, yy, "a", 6) + K.t(xx, yy + 20, h[i], i === 3 ? "m" : "s", { s: 12, b: i === 3 });
      }
      s += K.t(512, 258, "Merkmal: Körpergröße (cm)", "s", { s: 13 }) + K.t(512, 280, "Ausprägung, z. B. 178", "m", { s: 13, b: true });
      return K.svg(640, 300, s);
    });

  add("skalen", "Skalenniveaus: nominal – ordinal – metrisch",
    "Von links nach rechts darf man immer <b>mehr rechnen</b>. Nominal: nur „gleich oder verschieden“. Ordinal: zusätzlich eine <b>Reihenfolge</b>, aber die Abstände sind nicht gleich viel wert. Metrisch: <b>gleiche Abstände</b> wie auf einem Lineal – erst hier sind Differenzen und Mittelwerte sinnvoll.",
    function(K){
      var s = K.panel(10, 10, 200, 240, "nominal") + K.panel(220, 10, 200, 240, "ordinal") + K.panel(430, 10, 200, 240, "metrisch", "a");
      s += K.node(65, 90, "", "a", { r: 20, fill: "fa" }) + K.node(150, 120, "", "c4", { r: 20, fill: "fm" }) + K.node(85, 165, "", "c3", { r: 20 });
      s += K.t(65, 90, "blau", "a", { s: 12, b: true, halo: false }) + K.t(150, 120, "braun", "c4", { s: 12, b: true, halo: false }) + K.t(85, 165, "grün", "c3", { s: 12, b: true, halo: false });
      s += K.t(115, 98, "≠", "s", { s: 18, b: true }) + K.t(125, 150, "≠", "s", { s: 18, b: true });
      s += K.t(110, 222, "nur: gleich / ungleich", "s", { s: 12.5 });
      var gx = [245, 270, 310, 330, 375, 395];
      s += K.arrow(240, 130, 405, 130, "s", { w: 1.3, head: 8 });
      gx.forEach(function(x, i){ s += K.dot(x, 130, "a", 5) + K.t(x, 112, String(i + 1), "a", { s: 14, b: true }); });
      s += K.t(320, 160, "Note 1 < 2 < … < 6", "s", { s: 12.5 }) + K.t(320, 200, "Reihenfolge ja,", "s", { s: 12.5 }) + K.t(320, 222, "Abstände unklar", "s", { s: 12.5 });
      s += K.line(450, 130, 610, 130, "a", { w: 2 });
      for(var i = 0; i <= 8; i++){ var x = 450 + i * 20; s += K.line(x, 130, x, i % 2 ? 122 : 116, "a", { w: 1.4 }); if(i % 4 === 0) s += K.t(x, 104, String(160 + i * 5), "a", { s: 12, b: true }); }
      s += K.t(530, 152, "cm", "s", { s: 12 });
      s += K.t(530, 200, "gleiche Abstände ⇒", "s", { s: 12.5 }) + K.t(530, 222, "x̄ und s sinnvoll", "a", { s: 12.5, b: true });
      return K.svg(640, 260, s);
    });

  var H = [2, 5, 8, 4, 1];
  add("haeuf", "Absolute, relative und kumulierte Häufigkeit",
    "<b>Links</b> 20 Noten als Säulen: Die Höhe ist die <b>absolute Häufigkeit</b> hᵢ, darunter die <b>relative</b> fᵢ = hᵢ/20 (zusammen 1). <b>Rechts</b> werden die fᵢ aufaddiert: Die <b>kumulierte</b> Häufigkeit steigt treppenförmig bis 1 und beantwortet „wie viele hatten höchstens Note k?“.",
    function(K){
      var s = K.panel(10, 10, 305, 295, "hᵢ (n = 20)") + K.panel(325, 10, 305, 295, "kumuliert Fᵢ");
      var M = K.map(25, 250, 50, 20), N = K.map(340, 250, 46, 150), cum = 0;
      s += K.line(35, 250, 305, 250, "s", { w: 1.2 }) + K.line(350, 250, 620, 250, "s", { w: 1.2 });
      H.forEach(function(h, i){
        var k = i + 1;
        s += K.bar(k, h, 0.6, M, "a") + K.t(M.X(k), M.Y(h) - 12, String(h), "a", { s: 13, b: true });
        s += K.t(M.X(k), 264, String(k), "s", { s: 12, b: true }) + K.t(M.X(k), 284, fmt(h / 20, 2), "c4", { s: 12 });
        cum += h / 20;
        s += K.line(N.X(k), N.Y(cum), N.X(k + 1), N.Y(cum), "m", { w: 2.4 }) + K.dot(N.X(k), N.Y(cum), "m", 4.5);
        s += K.t(N.X(k) + 23, N.Y(cum) - 11, fmt(cum, 2), "m", { s: 12, b: true });
        s += K.t(N.X(k), 264, String(k), "s", { s: 12, b: true });
      });
      s += K.t(30, 284, "fᵢ:", "c4", { a: "start", s: 12, b: true });
      s += K.line(N.X(0.6), N.Y(1), N.X(3.5), N.Y(1), "f", { w: 1, dash: "4 4" }) + K.t(N.X(0.5), N.Y(1), "1", "f", { a: "end", s: 12 });
      return K.svg(640, 315, s);
    });

  add("modus", "Modus = häufigste Ausprägung",
    "Der <b>Modus</b> ist einfach die <b>höchste Säule</b>: Note 3 kommt 8-mal vor, öfter als jede andere. Man braucht dafür weder Rechnung noch Reihenfolge – deshalb funktioniert der Modus sogar bei <b>nominalen</b> Merkmalen wie Farben.",
    function(K){
      var M = K.map(60, 250, 90, 22), s = K.line(70, 250, 560, 250, "s", { w: 1.2 });
      H.forEach(function(h, i){
        var k = i + 1, top = k === 3;
        s += K.bar(k, h, 0.6, M, top ? "m" : "a", { fill: top ? "fm" : "fa" }) + K.t(M.X(k), M.Y(h) - 12, String(h), top ? "m" : "a", { s: 13, b: true });
        s += K.t(M.X(k), 266, "Note " + k, "s", { s: 12.5 });
      });
      s += K.arrow(M.X(3) + 110, 60, M.X(3) + 32, 72, "m", { w: 2 }) + K.t(M.X(3) + 116, 60, "Modus = 3", "m", { a: "start", s: 15, b: true });
      return K.svg(600, 285, s);
    });

  add("schwer", "Arithmetisches Mittel = Schwerpunkt",
    "Legt man die Daten 2, 3, 3, 5, 7 als <b>gleich schwere Gewichte</b> auf eine Wippe, balanciert sie genau bei <b>x̄ = 4</b>. Die Abweichungen links (−2, −1, −1) und rechts (+1, +3) heben sich exakt auf – ihre Summe ist immer 0.",
    function(K){
      var X = function(v){ return 60 + v * 60; }, s = "";
      s += lines(K, 320, 34, ["x̄ = (2 + 3 + 3 + 5 + 7) / 5 = 4", "Abweichungen: −2 − 1 − 1 + 1 + 3 = 0"], "s", { a: "middle", s: 13.5 });
      s += K.line(X(0.5), 200, X(8.5), 200, "i", { w: 4 });
      s += K.poly([[X(4), 202], [X(4) - 16, 238], [X(4) + 16, 238]], "m", { fill: "fm", w: 1.6 });
      var st = {};
      [2, 3, 3, 5, 7].forEach(function(v){ st[v] = (st[v] || 0) + 1; s += K.rect(X(v) - 13, 200 - 26 * st[v], 26, 26, "a", { fill: "fa", rx: 2, w: 1.4 }); });
      [2, 3, 5, 7].forEach(function(v){ s += K.t(X(v), 214, String(v), "s", { s: 12.5, b: true }); });
      s += K.t(X(4) + 26, 230, "x̄ = 4", "m", { a: "start", s: 13.5, b: true });
      s += K.arrow(X(4), 256, X(2), 256, "c4", { w: 2 }) + K.t(X(2) - 8, 256, "−2", "c4", { a: "end", s: 13, b: true });
      s += K.arrow(X(4), 256, X(7), 256, "c3", { w: 2 }) + K.t(X(7) + 8, 256, "+3", "c3", { a: "start", s: 13, b: true });
      s += K.arrow(X(4), 282, X(3), 282, "c4", { w: 2 }) + K.t(X(3) - 8, 282, "−1 (zweimal)", "c4", { a: "end", s: 13, b: true });
      s += K.arrow(X(4), 282, X(5), 282, "c3", { w: 2 }) + K.t(X(5) + 8, 282, "+1", "c3", { a: "start", s: 13, b: true });
      return K.svg(640, 300, s);
    });

  add("median", "Median: der mittlere Wert der geordneten Liste",
    "Erst <b>sortieren</b>, dann in die Mitte schauen. Bei <b>ungeradem n</b> gibt es genau einen mittleren Wert. Bei <b>geradem n</b> gibt es zwei – der Median ist ihr Mittelwert. Links und rechts vom Median liegen gleich viele Werte.",
    function(K){
      var s = K.t(40, 40, "n = 5 (ungerade): ein mittlerer Wert", "s", { a: "start", s: 13.5, b: true });
      [2, 3, 3, 5, 7].forEach(function(v, i){ s += K.cell(130 + i * 58, 90, String(v), i === 2 ? "m" : "a", { w: 54, h: 40, fill: i === 2 ? "fm" : "p", tc: i === 2 ? "m" : "i", s: 16 }); });
      s += K.t(470, 90, "Median = 3", "m", { a: "start", s: 15, b: true });
      s += K.t(40, 160, "n = 6 (gerade): Mittel der beiden mittleren", "s", { a: "start", s: 13.5, b: true });
      [2, 3, 3, 5, 7, 8].forEach(function(v, i){ var mid = i === 2 || i === 3; s += K.cell(130 + i * 58, 210, String(v), mid ? "m" : "a", { w: 54, h: 40, fill: mid ? "fm" : "p", tc: mid ? "m" : "i", s: 16 }); });
      s += K.t(470, 210, "Median = (3 + 5)/2 = 4", "m", { a: "start", s: 15, b: true });
      s += K.t(130 + 58, 248, "2 Werte", "c4", { s: 12.5 }) + K.t(130 + 4 * 58 + 29, 248, "2 Werte", "c4", { s: 12.5 });
      return K.svg(680, 270, s);
    });

  add("robust", "Median ist robust, das Mittel nicht",
    "Ein einziger <b>Ausreißer</b> (37 statt 7) zieht das arithmetische Mittel von 4 auf 10 – es liegt dann neben fast allen Daten. Der <b>Median</b> bleibt bei 3, weil er nur auf die <b>Reihenfolge</b> schaut, nicht auf die Größe der Werte.",
    function(K){
      var X = function(v){ return 60 + v * 13; }, s = "";
      [[110, [2, 3, 3, 5, 7], 4, "2, 3, 3, 5, 7"], [235, [2, 3, 3, 5, 37], 10, "2, 3, 3, 5, 37 (Ausreißer)"]].forEach(function(r){
        var y = r[0], st = {};
        s += K.t(60, y - 56, r[3], "s", { a: "start", s: 13.5, b: true });
        s += K.line(X(0), y, X(40), y, "s", { w: 1.3 }) + K.t(X(0) - 8, y, "0", "f", { a: "end", s: 12 }) + K.t(X(40) + 8, y, "40", "f", { a: "start", s: 12 });
        r[1].forEach(function(v){ st[v] = (st[v] || 0) + 1; s += K.dot(X(v), y - 7 - (st[v] - 1) * 11, v === 37 ? "m" : "i", 5); });
        s += K.poly([[X(3), y + 3], [X(3) - 6, y + 14], [X(3) + 6, y + 14]], "a", { fill: "a", w: 1 }) + K.t(X(3) - 6, y + 28, "Median 3", "a", { a: "end", s: 12.5, b: true });
        s += K.poly([[X(r[2]), y + 3], [X(r[2]) - 6, y + 14], [X(r[2]) + 6, y + 14]], "m", { fill: "m", w: 1 }) + K.t(X(r[2]) + 6, y + 28, "x̄ = " + r[2], "m", { a: "start", s: 12.5, b: true });
      });
      s += K.arrow(X(4), 213, X(9.6), 213, "m", { w: 1.6, head: 8, dash: "4 3" });
      return K.svg(640, 280, s);
    });

  add("varianz", "Empirische Varianz: mittleres Abweichungsquadrat",
    "Oben die Abweichungen vom Mittel x̄ = 4. Unten wird jede zu einem <b>Quadrat</b> – so zählen große Abweichungen viel stärker (die +3 wird zu 9). Die Quadrate zusammen ergeben 16; geteilt durch <b>n − 1 = 4</b> ist s² = 4, und die Wurzel s = 2 ist wieder in der Einheit der Daten.",
    function(K){
      var X = function(v){ return 20 + v * 70; }, s = K.line(X(1), 120, X(8), 120, "s", { w: 1.3 });
      s += K.line(X(4), 62, X(4), 186, "m", { w: 1.4, dash: "5 4" }) + K.t(X(4), 50, "x̄ = 4", "m", { s: 13, b: true });
      var st = {};
      [2, 3, 3, 5, 7].forEach(function(v){ st[v] = (st[v] || 0) + 1; s += K.dot(X(v), 120 - (st[v] - 1) * 14, "i", 5); });
      s += K.t(X(2), 100, "2", "s", { s: 12.5, b: true }) + K.t(X(3), 86, "3", "s", { s: 12.5, b: true }) + K.t(X(5), 100, "5", "s", { s: 12.5, b: true }) + K.t(X(7), 100, "7", "s", { s: 12.5, b: true });
      s += K.arrow(X(4), 150, X(2), 150, "c4", { w: 2 }) + K.arrow(X(4), 150, X(7), 150, "c3", { w: 2 }) + K.arrow(X(4), 176, X(3), 176, "c4", { w: 2 }) + K.arrow(X(4), 176, X(5), 176, "c3", { w: 2 });
      var dev = [-2, -1, -1, 1, 3], x0 = 40;
      dev.forEach(function(d){
        var a = Math.abs(d) * 28;
        s += K.rect(x0, 300 - a, a, a, d < 0 ? "c4" : "c3", { fill: "fa", rx: 0, w: 1.4 });
        s += K.t(x0 + a / 2, 300 - a / 2, String(d * d), "i", { s: 13, b: true, halo: false });
        s += K.t(x0 + a / 2, 300 - a - 11, (d > 0 ? "+" : "−") + Math.abs(d), d < 0 ? "c4" : "c3", { s: 12.5, b: true });
        x0 += a + 26;
      });
      s += lines(K, 440, 236, ["∑ Quadrate = 16", "s² = 16 / (5 − 1) = 4", "s = √4 = 2"], "m", { s: 13.5, b: true, lh: 24 });
      return K.svg(620, 320, s);
    });

  add("spann", "Spannweite R und Standardabweichung s",
    "Die <b>Spannweite</b> schaut nur auf die zwei äußersten Werte: R = 7 − 2 = 5. Die <b>Standardabweichung</b> nutzt alle Werte: Das Band x̄ ± s = 4 ± 2 zeigt, wie weit die Daten typischerweise vom Mittel entfernt liegen.",
    function(K){
      var X = function(v){ return 20 + v * 70; }, s = "";
      s += K.rect(X(2), 150, X(6) - X(2), 40, "a", { fill: "fa", rx: 3, w: 1.2 });
      s += K.line(X(1), 170, X(8), 170, "s", { w: 1.3 });
      var st = {};
      [2, 3, 3, 5, 7].forEach(function(v){ st[v] = (st[v] || 0) + 1; s += K.dot(X(v), 170 - (st[v] - 1) * 14, "i", 5); });
      [1, 2, 3, 4, 5, 6, 7, 8].forEach(function(v){ s += K.t(X(v), 206, String(v), "f", { s: 12 }); });
      s += span(K, X(2), X(7), 90, "m") + K.t((X(2) + X(7)) / 2, 72, "R = 7 − 2 = 5", "m", { s: 14, b: true });
      s += K.line(X(2), 96, X(2), 150, "m", { w: 1, dash: "4 4" }) + K.line(X(7), 96, X(7), 162, "m", { w: 1, dash: "4 4" });
      s += K.line(X(4), 145, X(4), 195, "a", { w: 2 }) + K.t(X(4), 236, "x̄ ± s = 4 ± 2", "a", { s: 14, b: true });
      return K.svg(620, 260, s);
    });

  add("n1", "Warum n − 1 im Nenner?",
    "Die Kurve zeigt die Quadratsumme ∑(xᵢ − c)² für jeden möglichen Bezugspunkt c. Ihr <b>Minimum liegt genau bei x̄</b>. Den wahren Mittelwert μ kennt man nicht – um μ wäre die Summe größer. Mit x̄ gerechnet ist sie also <b>systematisch zu klein</b>; das Teilen durch <b>n − 1</b> statt n gleicht das genau aus (erwartungstreu).",
    function(K){
      var M = K.map(-25, 280, 85, 3.6), Q = function(c){ return 16 + 5 * (c - 4) * (c - 4); }, s = "";
      s += K.arrow(50, 280, 600, 280, "s", { w: 1.3, head: 9 }) + K.arrow(60, 290, 60, 30, "s", { w: 1.3, head: 9 });
      s += K.t(592, 296, "c", "s", { it: true }) + K.t(74, 34, "Q(c) = ∑(xᵢ − c)²", "s", { a: "start", s: 13, it: true });
      s += K.plot(Q, 1, 7, M, "a", { w: 2.6 });
      s += K.line(M.X(4), M.Y(16), M.X(4), 280, "a", { w: 1.2, dash: "4 4" }) + K.line(M.X(5), M.Y(21), M.X(5), 280, "c4", { w: 1.2, dash: "4 4" });
      s += K.dot(M.X(4), M.Y(16), "a", 6) + K.dot(M.X(5), M.Y(21), "c4", 6);
      s += K.t(M.X(4) - 14, M.Y(16) + 16, "16", "a", { a: "end", s: 13, b: true }) + K.t(M.X(5) + 12, M.Y(21) + 4, "21", "c4", { a: "start", s: 13, b: true });
      s += K.t(M.X(4), 296, "x̄ = 4", "a", { s: 12.5, b: true }) + K.t(M.X(5) + 10, 296, "μ (unbekannt)", "c4", { a: "start", s: 12.5, b: true });
      s += lines(K, 140, 70, ["Abstände zu x̄ sind die kleinstmöglichen", "⇒ ∑(xᵢ − x̄)² unterschätzt die Streuung um μ", "Ausgleich: durch n − 1 statt durch n teilen"], "s", { s: 13 });
      return K.svg(620, 310, s);
    });

  add("rechen", "Rechenschema für sₓᵧ, sₓ², sᵧ² und r",
    "Statt jede Abweichung einzeln zu bilden, legt man eine <b>Tabelle mit fünf Spalten</b> an und braucht nur deren <b>Spaltensummen</b>. Die Rechenform ∑xᵢyᵢ − n·x̄·ȳ liefert dasselbe wie ∑(xᵢ − x̄)(yᵢ − ȳ) – hier 69 − 60 = 9.",
    function(K){
      var R = [["", "x", "y", "x²", "y²", "x·y"]];
      DX.forEach(function(x, i){ var y = DY[i]; R.push([String(i + 1), String(x), String(y), String(x * x), String(y * y), String(x * y)]); });
      R.push(["∑", "15", "20", "55", "90", "69"]);
      var s = table(K, 20, 22, 58, 32, R, function(i, j){
        if(i === 0) return { tc: "s", s: 13 };
        if(i === 6) return { fill: "fm", c: "m", tc: "m" };
        if(j === 0) return { tc: "f", s: 12 };
        return {};
      });
      s += lines(K, 400, 50, ["x̄ = 15/5 = 3,   ȳ = 20/5 = 4", "sₓᵧ = (69 − 5·3·4)/4 = 2,25", "sₓ² = (55 − 5·9)/4 = 2,5", "sᵧ² = (90 − 5·16)/4 = 2,5"], "s", { s: 13.5, lh: 30 });
      s += K.f(500, 200, "r = 2,25 / √(2,5·2,5) = 0,9", "m", { fill: "fm", s: 13 });
      return K.svg(640, 260, s);
    });

  add("regr", "Regressionsgerade: kleinste Summe der Abweichungsquadrate",
    "Die Gerade ŷ = 1,3 + 0,9·x wird so gelegt, dass die <b>roten Quadrate</b> über den senkrechten Abständen zusammen <b>möglichst klein</b> sind. Die Steigung ist b = sₓᵧ/sₓ², und weil a = ȳ − b·x̄ ist, geht die Gerade immer durch den <b>Schwerpunkt (x̄, ȳ)</b>.",
    function(K){
      var M = K.map(50, 320, 45, 45), s = K.axes(50, 320, 5, 300, 300, 5, "x", "y"), f = function(x){ return 1.3 + 0.9 * x; };
      DX.forEach(function(x, i){
        var y = DY[i], r = y - f(x), a = Math.abs(r) * 45;
        if(a > 2) s += K.rect(M.X(x) - a, M.Y(Math.max(y, f(x))), a, a, "m", { fill: "fm", rx: 0, w: 1.2 });
        s += K.line(M.X(x), M.Y(y), M.X(x), M.Y(f(x)), "m", { w: 2 });
      });
      s += K.plot(f, 0, 5.8, M, "a", { w: 2.6 });
      DX.forEach(function(x, i){ s += K.dot(M.X(x), M.Y(DY[i]), "i", 5); });
      s += K.ring(M.X(3), M.Y(4), "c3", 6) + K.t(196, 175, "(x̄, ȳ) = (3, 4)", "c3", { a: "start", s: 12.5, b: true });
      s += K.t(M.X(5.8) + 6, M.Y(f(5.8)) + 4, "ŷ", "a", { a: "start", s: 15, it: true, b: true });
      s += lines(K, 370, 70, ["ŷ = a + b·x = 1,3 + 0,9·x", "b = sₓᵧ / sₓ² = 2,25 / 2,5 = 0,9", "a = ȳ − b·x̄ = 4 − 0,9·3 = 1,3"], "s", { s: 13.5, lh: 28 });
      s += K.t(370, 175, "rote Quadrate: Summe minimal", "m", { a: "start", s: 13.5, b: true });
      return K.svg(640, 348, s);
    });

  add("zwei", "Zwei Regressionsgeraden, ein Schnittpunkt",
    "<b>y auf x</b> minimiert die <b>senkrechten</b> Abstände, <b>x auf y</b> die <b>waagerechten</b> – deshalb sind es zwei verschiedene Geraden. Beide gehen durch den Schwerpunkt (x̄, ȳ). Je enger die Punkte an einer Geraden liegen (|r| → 1), desto kleiner der Winkel; es gilt b·d = r².",
    function(K){
      var M = K.map(50, 320, 45, 45), s = K.axes(50, 320, 5, 300, 300, 5, "x", "y");
      s += K.plot(function(x){ return 1.3 + 0.9 * x; }, 0, 5.8, M, "a", { w: 2.6 });
      s += K.plot(function(x){ return (x + 0.6) / 0.9; }, 0, 6, M, "c4", { w: 2.6, ymax: 6.6 });
      s += K.line(M.X(3), M.Y(5), M.X(3), M.Y(4), "a", { w: 1.8, dash: "4 3" }) + K.line(M.X(3), M.Y(5), M.X(3.9), M.Y(5), "c4", { w: 1.8, dash: "4 3" });
      DX.forEach(function(x, i){ s += K.dot(M.X(x), M.Y(DY[i]), "i", 5); });
      s += K.ring(M.X(3), M.Y(4), "m", 7);
      s += K.t(370, 60, "ŷ = 1,3 + 0,9·x   (y auf x)", "a", { a: "start", s: 13.5, b: true }) + K.t(370, 82, "senkrechte Abstände minimiert", "s", { a: "start", s: 12.5 });
      s += K.t(370, 120, "x̂ = −0,6 + 0,9·y   (x auf y)", "c4", { a: "start", s: 13.5, b: true }) + K.t(370, 142, "waagerechte Abstände minimiert", "s", { a: "start", s: 12.5 });
      s += K.t(370, 186, "Schnittpunkt = (x̄, ȳ) = (3, 4)", "m", { a: "start", s: 13.5, b: true });
      s += K.f(480, 230, "b · d = 0,9 · 0,9 = 0,81 = r²", "m", { fill: "fm", s: 13 });
      return K.svg(640, 348, s);
    });

  add("kausal", "Korrelation ist keine Kausalität",
    "Eisverkauf und Sonnenbrände sind <b>stark korreliert</b> – trotzdem verursacht Eis keinen Sonnenbrand. Beide hängen von einer <b>dritten Größe</b> ab, der Temperatur. r zeigt nur, dass sich Daten gemeinsam bewegen, nicht <b>warum</b>.",
    function(K){
      var s = K.cell(320, 60, "Temperatur", "c3", { w: 160, h: 42, fill: "fa", s: 15 });
      s += K.cell(150, 210, "Eisverkauf", "a", { w: 160, h: 42, fill: "fa", s: 15 }) + K.cell(490, 210, "Sonnenbrände", "a", { w: 160, h: 42, fill: "fa", s: 15 });
      s += K.arrow(290, 82, 175, 187, "c3", { w: 2.4 }) + K.arrow(350, 82, 465, 187, "c3", { w: 2.4 });
      s += K.t(200, 120, "Ursache", "c3", { s: 13, b: true }) + K.t(440, 120, "Ursache", "c3", { s: 13, b: true });
      s += K.line(232, 210, 408, 210, "m", { w: 2, dash: "6 4" });
      s += K.t(320, 194, "r hoch", "m", { s: 13.5, b: true }) + K.t(320, 228, "keine Ursache!", "m", { s: 13.5, b: true });
      s += K.t(320, 275, "eine versteckte dritte Größe erzeugt die Korrelation", "s", { s: 13 });
      return K.svg(640, 295, s);
    });

  /* ═════════ Kapitel 3: Schätzen und Testen ═════════ */

  add("treu", "Güte eines Schätzers: erwartungstreu und effizient",
    "Jeder Punkt ist eine Schätzung aus einer anderen Stichprobe, die Mitte des Ziels der wahre Wert Θ. <b>Verzerrt</b>: Die Schätzungen sitzen im Mittel daneben. <b>Erwartungstreu</b>: im Mittel genau in der Mitte, aber weit gestreut. <b>Effizient</b>: erwartungstreu und mit der <b>kleinsten Streuung</b>.",
    function(K){
      var s = "", set = [["verzerrt", 40, -30, 11, "m"], ["erwartungstreu", 0, 0, 34, "c4"], ["effizient", 0, 0, 11, "a"]];
      var cap = ["E(Θ̂) ≠ Θ", "E(Θ̂) = Θ, große Varianz", "E(Θ̂) = Θ, kleinste Varianz"];
      set.forEach(function(q, k){
        var px = 10 + k * 210, cx = px + 100, cy = 145, R = rng(5 + k * 13);
        s += K.panel(px, 10, 200, 285, q[0], q[4]);
        s += K.circ(cx, cy, 95, "r", { w: 1.2 }) + K.circ(cx, cy, 62, "r", { w: 1.2 }) + K.circ(cx, cy, 30, "r", { w: 1.2 });
        s += K.line(cx - 6, cy, cx + 6, cy, "i", { w: 1.6 }) + K.line(cx, cy - 6, cx, cy + 6, "i", { w: 1.6 });
        var mx = 0, my = 0;
        for(var i = 0; i < 14; i++){
          var dx = q[1] + gauss(R) * q[3], dy = q[2] + gauss(R) * q[3], L = Math.sqrt(dx * dx + dy * dy);
          if(L > 88){ dx *= 88 / L; dy *= 88 / L; }
          s += K.dot(cx + dx, cy + dy, q[4], 4);
        }
        s += K.t(cx, 266, cap[k], q[4], { s: 12.5, b: true });
      });
      return K.svg(640, 305, s);
    });

  add("konsistent", "Konsistenz: mit wachsendem n immer schärfer",
    "Die drei Kurven zeigen, wie die Schätzwerte Θ̂ bei verschiedenen Stichprobenumfängen streuen. Mit größerem n wird die Kurve <b>schmaler und höher</b> – die Varianz V(Θ̂) geht gegen 0, die Schätzung landet fast sicher beim wahren Wert Θ. Das heißt <b>konsistent</b>.",
    function(K){
      var M = K.map(320, 260, 110, 60), s = K.arrow(40, 260, 610, 260, "s", { w: 1.3, head: 9 });
      [[0.5, "c3", "n = 4"], [0.25, "c4", "n = 16"], [0.125, "a", "n = 64"]].forEach(function(q){
        s += bell(K, M, -2.5, 2.5, q[1], 0, q[0], { w: 2.4 });
      });
      s += K.t(400, 205, "n = 4", "c3", { a: "start", s: 13, b: true }) + K.t(370, 160, "n = 16", "c4", { a: "start", s: 13, b: true }) + K.t(345, 72, "n = 64", "a", { a: "start", s: 13, b: true });
      s += K.line(320, 60, 320, 264, "m", { w: 1.2, dash: "4 4" }) + K.t(320, 278, "Θ", "m", { s: 15, it: true, b: true });
      s += K.t(40, 40, "V(Θ̂) → 0 für n → ∞", "s", { a: "start", s: 14, b: true });
      return K.svg(640, 295, s);
    });

  add("xbar", "Der Mittelwert X̄ streut weniger: V(X̄) = σ²/n",
    "Die flache Kurve ist die Verteilung <b>einer einzelnen</b> Messung (Streuung σ), die schmale die des <b>Mittelwerts aus n = 4</b> Messungen. Beim Mitteln heben sich Zufallsfehler teilweise auf: Die Varianz sinkt auf σ²/n, die Streuung auf <b>σ/√n</b> – hier die Hälfte. Beide Kurven haben dieselbe Mitte μ.",
    function(K){
      var M = K.map(300, 260, 80, 200), s = K.line(40, 260, 600, 260, "s", { w: 1.3 });
      s += bellArea(K, M, -3.4, 3.4, "fa", 0, 0.5);
      s += bell(K, M, -3.4, 3.4, "c4", 0, 1, { w: 2.4 }) + bell(K, M, -3.4, 3.4, "a", 0, 0.5, { w: 2.6 });
      s += K.line(M.X(1), M.Y(npdf(1)), M.X(1), 296, "c4", { w: 1, dash: "4 4" }) + K.line(M.X(0.5), M.Y(npdf(1) / 0.5), M.X(0.5), 316, "a", { w: 1, dash: "4 4" });
      s += K.line(300, 262, 300, 316, "f", { w: 1, dash: "4 4" });
      s += span(K, 300, M.X(1), 292, "c4", { w: 1.8 }) + K.t(M.X(1) + 10, 292, "σ", "c4", { a: "start", s: 14, b: true });
      s += span(K, 300, M.X(0.5), 312, "a", { w: 1.8 }) + K.t(M.X(0.5) + 10, 312, "σ/√n = σ/2", "a", { a: "start", s: 13, b: true });
      s += K.t(120, 228, "X: eine Messung", "c4", { s: 13, b: true }) + K.t(420, 110, "X̄: Mittel aus n = 4", "a", { a: "start", s: 13, b: true });
      s += K.t(286, 276, "μ", "s", { s: 14, it: true });
      s += K.f(140, 40, "V(X̄) = σ²/n", "a");
      return K.svg(640, 330, s);
    });

  add("ki", "Vertrauensintervall x̄ ± c·σ/√n",
    "Oben: X̄ landet mit Wahrscheinlichkeit γ (hier 95 %) im blauen Bereich μ ± c·σ/√n. Unten: Dreht man die Sicht um und legt <b>dasselbe Band um das beobachtete x̄</b>, so fängt es μ genau dann ein, wenn x̄ im blauen Bereich lag – also in 95 % der Fälle. c kommt aus 2Φ(c) − 1 = γ.",
    function(K){
      var M = K.map(320, 170, 70, 300), s = "";
      s += bellArea(K, M, -1.96, 1.96, "fa") + bellArea(K, M, -3, -1.96, "fm") + bellArea(K, M, 1.96, 3, "fm");
      s += K.line(90, 170, 550, 170, "s", { w: 1.3 }) + bell(K, M, -3, 3, "a", 0, 1, { w: 2.4 });
      s += K.t(250, 145, "γ = 95 %", "a", { s: 14, b: true });
      s += K.t(M.X(-1.96), 186, "μ − c·σ/√n", "s", { s: 12.5 }) + K.t(M.X(1.96), 186, "μ + c·σ/√n", "s", { s: 12.5 });
      s += K.line(320, 40, 320, 252, "m", { w: 1.4, dash: "5 4" }) + K.t(334, 44, "μ", "m", { a: "start", s: 15, it: true, b: true });
      var xb = M.X(0.8), h = 1.96 * 70;
      s += span(K, xb - h, xb + h, 240, "a", { w: 3.2 }) + K.dot(xb, 240, "i", 6);
      s += K.t(xb, 222, "x̄", "i", { s: 15, it: true, b: true });
      s += K.t(xb, 264, "[ x̄ − c·σ/√n ;  x̄ + c·σ/√n ]", "a", { s: 13, b: true });
      return K.svg(640, 285, s);
    });

  var tpdf4 = function(t){ return 0.375 * Math.pow(1 + t * t / 4, -2.5); };
  add("tvert", "σ unbekannt: t-Verteilung statt Normalverteilung",
    "Muss σ aus der Stichprobe geschätzt werden (s), kommt eine zusätzliche Unsicherheit dazu. Die <b>t-Verteilung</b> (rot, hier n − 1 = 4 Freiheitsgrade) ist darum <b>flacher mit dickeren Rändern</b>. Ihr Quantil ist größer (2,776 statt 1,96), das Intervall wird breiter. Bei großem n nähert sie sich der Normalverteilung.",
    function(K){
      var M = K.map(320, 240, 75, 380), s = K.line(30, 240, 610, 240, "s", { w: 1.3 });
      s += bell(K, M, -3.8, 3.8, "a", 0, 1, { w: 2.4 }) + K.plot(tpdf4, -3.8, 3.8, M, "m", { w: 2.4 });
      [[1.96, "a", "1,96"], [2.776, "m", "2,776"]].forEach(function(q){
        s += K.line(M.X(q[0]), 120, M.X(q[0]), 244, q[1], { w: 1.3, dash: "5 4" }) + K.line(M.X(-q[0]), 120, M.X(-q[0]), 244, q[1], { w: 1.3, dash: "5 4" });
        s += K.t(M.X(q[0]), 256, q[2], q[1], { s: 12.5, b: true }) + K.t(M.X(-q[0]), 256, "−" + q[2], q[1], { s: 12.5, b: true });
      });
      s += K.t(30, 34, "— Normalverteilung (σ bekannt)", "a", { a: "start", s: 13, b: true }) + K.t(30, 56, "— t-Verteilung, 4 Freiheitsgrade (s statt σ)", "m", { a: "start", s: 13, b: true });
      s += K.t(320, 282, "dickere Ränder ⇒ größeres Quantil ⇒ breiteres Intervall", "s", { s: 13 });
      return K.svg(640, 300, s);
    });

  var chi9 = function(x){ return x <= 0 ? 0 : Math.pow(x, 3.5) * Math.exp(-x / 2) / 263.19; };
  add("chi", "Vertrauensintervall für σ²: χ²-Quantile über Kreuz",
    "Links die schiefe <b>χ²-Verteilung</b> (n − 1 = 9 Freiheitsgrade) mit je 2,5 % an beiden Enden. Weil man durch das Quantil <b>teilt</b>, liefert das <b>große</b> Quantil χ²ₒ die <b>untere</b> Grenze und das kleine χ²ᵤ die obere – über Kreuz. Rechts das Ergebnis für s² = 4: Das Intervall liegt <b>nicht symmetrisch</b> um s².",
    function(K){
      var M = K.map(40, 230, 11, 1500), s = "";
      s += K.area(chi9, 0, 2.7, M, "fm") + K.area(chi9, 19.023, 25, M, "fm");
      s += K.line(35, 230, 325, 230, "s", { w: 1.3 }) + K.plot(chi9, 0, 25, M, "a", { w: 2.4 });
      s += K.t(180, 40, "χ²-Verteilung, 9 FG", "s", { s: 13, b: true });
      s += K.t(52, 180, "2,5 %", "m", { s: 12, b: true }) + K.t(292, 200, "2,5 %", "m", { s: 12, b: true });
      s += K.line(M.X(2.7), 226, M.X(2.7), 234, "c3", { w: 2 }) + K.line(M.X(19.023), 226, M.X(19.023), 234, "c4", { w: 2 });
      s += K.t(M.X(2.7), 248, "χ²ᵤ = 2,70", "c3", { s: 12.5, b: true }) + K.t(M.X(19.023) + 12, 256, "χ²ₒ = 19,02", "c4", { a: "end", s: 12.5, b: true });
      var X = function(v){ return 350 + v * 18; };
      s += K.t(485, 60, "Intervall für σ² (n = 10, s² = 4)", "s", { s: 13, b: true });
      s += K.arrow(345, 170, 630, 170, "s", { w: 1.3, head: 8 }) + K.t(622, 154, "σ²", "s", { s: 13, it: true });
      [0, 5, 10, 15].forEach(function(v){ s += K.line(X(v), 166, X(v), 174, "s", { w: 1.2 }); });
      s += K.line(X(1.892), 170, X(13.33), 170, "a", { w: 4 });
      s += K.line(X(1.892), 160, X(1.892), 180, "c4", { w: 2.4 }) + K.line(X(13.33), 160, X(13.33), 180, "c3", { w: 2.4 });
      s += K.dot(X(4), 170, "m", 5.5) + K.t(X(4) + 4, 128, "s² = 4", "m", { s: 13, b: true });
      s += K.t(X(1.892), 148, "1,89", "c4", { s: 13, b: true }) + K.t(X(13.33), 148, "13,33", "c3", { s: 13, b: true });
      s += K.arrow(M.X(2.7), 262, X(13.33) - 4, 186, "c3", { w: 1.6, head: 8 }) + K.arrow(M.X(19.023) + 16, 272, X(1.892) + 2, 186, "c4", { w: 1.6, head: 8 });
      s += K.t(490, 232, "Quantile über Kreuz", "m", { s: 13, b: true });
      s += lines(K, 340, 290, ["untere Grenze: 9·4 / 19,02 = 1,89", "obere Grenze:  9·4 / 2,70 = 13,33"], "s", { s: 12.5, lh: 22 });
      return K.svg(640, 330, s);
    });

  add("quant", "Quantile c der Normalverteilung: 2Φ(c) − 1 = γ",
    "Das Quantil c ist so gewählt, dass zwischen −c und +c genau der Anteil γ der Fläche liegt. <b>Mehr Sicherheit kostet Breite</b>: Für 80 % reicht ±1,282, für 95 % braucht man ±1,96, für 99 % schon ±2,576 – das Intervall wird entsprechend länger.",
    function(K){
      var M = K.map(250, 190, 80, 300), s = "";
      s += bellArea(K, M, -1.96, 1.96, "fa");
      s += K.line(20, 190, 480, 190, "s", { w: 1.3 }) + bell(K, M, -2.9, 2.9, "a", 0, 1, { w: 2.4 });
      s += K.t(250, 165, "95 %", "a", { s: 14, b: true });
      s += K.t(470, 40, "P(−c ≤ Z ≤ c) = γ", "s", { s: 13.5, b: true }) + K.t(470, 62, "⇔ 2Φ(c) − 1 = γ", "s", { s: 13.5, b: true });
      [[0.80, 1.282], [0.90, 1.645], [0.95, 1.96], [0.99, 2.576]].forEach(function(q, i){
        var y = 214 + i * 25, c = i === 2 ? "m" : "c4";
        s += K.line(M.X(-q[1]), 192, M.X(-q[1]), y, "f", { w: 1, dash: "3 4" }) + K.line(M.X(q[1]), 192, M.X(q[1]), y, "f", { w: 1, dash: "3 4" });
        s += span(K, M.X(-q[1]), M.X(q[1]), y, c, { w: 2 });
        s += K.t(480, y, "γ = " + fmt(q[0], 2) + " → c = " + fmt(q[1], 3).replace(/0$/, ""), c, { a: "start", s: 13, b: true });
      });
      return K.svg(640, 310, s);
    });

  add("kideut", "Was „95 % Vertrauen“ bedeutet",
    "Jede Zeile ist das Intervall aus einer <b>anderen Stichprobe</b>. Der wahre Wert μ (rote Linie) bleibt fest – es sind die <b>Intervalle, die zufällig wackeln</b>. Auf lange Sicht treffen etwa 95 % von ihnen μ; hier 19 von 20. Ob ein einzelnes konkretes Intervall trifft, weiß man nicht.",
    function(K){
      var R = rng(42), s = "", h = 1.96 * 52;
      s += K.line(320, 30, 320, 282, "m", { w: 2, dash: "6 4" }) + K.t(320, 18, "μ (fest, unbekannt)", "m", { s: 13, b: true });
      for(var i = 0; i < 20; i++){
        var z = gauss(R) * 0.85; if(z > 1.8) z = 1.8; if(z < -1.8) z = -1.8;
        if(i === 12) z = 2.35;
        var x = 320 + z * 52, y = 40 + i * 12.5, miss = Math.abs(z) > 1.96;
        s += K.line(x - h, y, x + h, y, miss ? "m" : "a", { w: miss ? 3 : 2.2 }) + K.dot(x, y, miss ? "m" : "i", 3);
        if(miss) s += K.t(x + h + 10, y, "verfehlt μ", "m", { a: "start", s: 12.5, b: true });
      }
      s += K.t(320, 304, "19 von 20 Intervallen enthalten μ ≈ 95 %", "s", { s: 13.5, b: true });
      return K.svg(640, 320, s);
    });

  add("test", "Zweiseitiger Test: Annahme- und Ablehnungsbereich",
    "Die Glocke zeigt, wo x̄ landet, <b>wenn H₀ stimmt</b>. Im blauen Mittelbereich (Anteil 1 − α) wird H₀ <b>beibehalten</b>; in den roten Rändern (je α/2) wäre ein solches x̄ unter H₀ zu unwahrscheinlich – H₀ wird <b>abgelehnt</b>. Beibehalten heißt nicht bewiesen, nur: kein Grund zur Ablehnung.",
    function(K){
      var M = K.map(320, 200, 80, 300), s = "";
      s += bellArea(K, M, -1.96, 1.96, "fa") + bellArea(K, M, -3.6, -1.96, "fm") + bellArea(K, M, 1.96, 3.6, "fm");
      s += K.line(25, 200, 615, 200, "s", { w: 1.3 }) + bell(K, M, -3.6, 3.6, "a", 0, 1, { w: 2.4 });
      s += K.line(M.X(-1.96), 90, M.X(-1.96), 204, "m", { w: 1.4, dash: "5 4" }) + K.line(M.X(1.96), 90, M.X(1.96), 204, "m", { w: 1.4, dash: "5 4" });
      s += K.t(320, 170, "Annahmebereich (1 − α)", "a", { s: 13.5, b: true });
      s += K.t(M.X(-1.96), 216, "μ₀ − c·σ/√n", "s", { s: 12.5 }) + K.t(320, 216, "μ₀", "s", { s: 13, it: true }) + K.t(M.X(1.96), 216, "μ₀ + c·σ/√n", "s", { s: 12.5 });
      s += K.t(80, 244, "α/2: ablehnen", "m", { s: 12.5, b: true }) + K.t(560, 244, "α/2: ablehnen", "m", { s: 12.5, b: true });
      var xb = M.X(2.7);
      s += K.arrow(xb, 130, xb, 194, "c4", { w: 2 }) + K.t(xb, 116, "x̄ ⇒ H₀ ablehnen", "c4", { s: 13, b: true });
      s += K.t(320, 274, "x̄ im blauen Bereich ⇒ H₀ beibehalten (nicht bewiesen!)", "s", { s: 13 });
      return K.svg(640, 290, s);
    });

  add("aequiv", "Test und Vertrauensintervall – dieselbe Entscheidung",
    "Oben das Band um μ₀ (Test), unten dasselbe Band um x̄ (Vertrauensintervall). Weil beide <b>gleich breit</b> sind (h = c·σ/√n), gilt: Liegt x̄ höchstens h von μ₀ entfernt, dann auch μ₀ höchstens h von x̄. <b>Links</b> wird H₀ beibehalten, <b>rechts</b> abgelehnt – auf beiden Wegen.",
    function(K){
      var s = K.panel(10, 10, 305, 250, "x̄ drin ⇔ μ₀ drin", "a") + K.panel(325, 10, 305, 250, "x̄ draußen ⇔ μ₀ draußen", "m"), h = 70;
      [[10 + 150, 45], [325 + 110, 95]].forEach(function(q, k){
        var mu = q[0], xb = mu + q[1], c = k ? "m" : "a";
        s += K.t(mu - h, 56, "Test: μ₀ ± h", "s", { a: "start", s: 12.5, b: true });
        s += span(K, mu - h, mu + h, 100, "a", { w: 3 }) + K.dot(mu, 100, "a", 5) + K.dot(xb, 100, c, 6);
        s += K.t(mu, 120, "μ₀", "a", { s: 13, it: true, b: true }) + K.t(xb, 120, "x̄", c, { s: 13, it: true, b: true });
        s += K.t(xb - h, 156, "Intervall: x̄ ± h", "s", { a: "start", s: 12.5, b: true });
        s += span(K, xb - h, xb + h, 200, c, { w: 3 }) + K.dot(xb, 200, c, 6) + K.dot(mu, 200, "a", 5);
        s += K.t(mu, 220, "μ₀", "a", { s: 13, it: true, b: true }) + K.t(xb, 220, "x̄", c, { s: 13, it: true, b: true });
      });
      s += K.t(320, 280, "h = c·σ/√n – gleicher Abstand, nur andere Blickrichtung", "s", { s: 13 });
      return K.svg(640, 295, s);
    });

  add("fehler", "Fehler 1. und 2. Art",
    "Blau die Verteilung von x̄, falls <b>H₀ stimmt</b>, violett, falls in Wahrheit μ₁ gilt. <b>Fehler 1. Art</b> (rot, α): H₀ stimmt, aber x̄ fällt in den Ablehnungsbereich. <b>Fehler 2. Art</b> (β): H₁ stimmt, aber x̄ landet im Annahmebereich. Schiebt man die Grenze, wird der eine Fehler kleiner und der andere größer.",
    function(K){
      var M = K.map(240, 220, 66, 330), s = "", m1 = 2.6;
      s += bellArea(K, M, -3, 1.96, "fa", m1, 1) + bellArea(K, M, -3.4, -1.96, "fm") + bellArea(K, M, 1.96, 5.5, "fm");
      s += K.line(15, 220, 625, 220, "s", { w: 1.3 });
      s += bell(K, M, -3.4, 5.5, "a", 0, 1, { w: 2.4 }) + bell(K, M, -3.4, 5.5, "c4", m1, 1, { w: 2.4 });
      s += K.line(M.X(1.96), 60, M.X(1.96), 224, "m", { w: 1.6, dash: "5 4" }) + K.t(M.X(1.96), 48, "Grenze μ₀ + c·σ/√n", "m", { s: 12.5, b: true });
      s += K.t(M.X(0) - 30, 74, "H₀ wahr", "a", { s: 13.5, b: true }) + K.t(M.X(m1) + 40, 74, "H₁ wahr", "c4", { s: 13.5, b: true });
      s += K.t(M.X(1.2), 202, "β", "c4", { s: 16, b: true });
      s += K.t(M.X(0), 236, "μ₀", "a", { s: 13, it: true, b: true }) + K.t(M.X(m1), 236, "μ₁", "c4", { s: 13, it: true, b: true });
      s += K.t(M.X(-2.4), 262, "α/2", "m", { s: 13, b: true }) + K.t(M.X(2.35), 262, "α/2", "m", { s: 13, b: true });
      s += K.t(320, 290, "rot: Fehler 1. Art (H₀ fälschlich abgelehnt) · β: Fehler 2. Art (H₀ fälschlich beibehalten)", "s", { s: 12 });
      return K.svg(640, 305, s);
    });

  add("einseit", "Zweiseitig oder einseitig?",
    "<b>Zweiseitig</b> wird das α auf beide Ränder verteilt (je α/2), das Quantil gehört zu 1 − α/2: bei α = 5 % also 1,96. <b>Einseitig</b> liegt das ganze α an einem Rand, das Quantil gehört zu 1 − α: 1,645. Die einseitige Grenze liegt darum näher an der Mitte.",
    function(K){
      var s = K.panel(10, 10, 305, 270, "zweiseitig: H₁: μ ≠ μ₀") + K.panel(325, 10, 305, 270, "einseitig: H₁: μ > μ₀");
      var A = K.map(162, 220, 45, 330), B = K.map(477, 220, 45, 330);
      s += bellArea(K, A, -3.2, -1.96, "fm") + bellArea(K, A, 1.96, 3.2, "fm") + bellArea(K, B, 1.645, 3.2, "fm");
      [A, B].forEach(function(M){ s += K.line(M.X(-3.3), 220, M.X(3.3), 220, "s", { w: 1.2 }) + bell(K, M, -3.2, 3.2, "a", 0, 1, { w: 2.2 }); });
      s += K.line(A.X(-1.96), 120, A.X(-1.96), 224, "m", { w: 1.3, dash: "5 4" }) + K.line(A.X(1.96), 120, A.X(1.96), 224, "m", { w: 1.3, dash: "5 4" }) + K.line(B.X(1.645), 120, B.X(1.645), 224, "m", { w: 1.3, dash: "5 4" });
      s += K.t(A.X(-1.96), 236, "−1,96", "m", { s: 12.5, b: true }) + K.t(A.X(1.96), 236, "1,96", "m", { s: 12.5, b: true }) + K.t(B.X(1.645), 236, "1,645", "m", { s: 12.5, b: true });
      s += K.t(A.X(-2.6), 260, "α/2", "m", { s: 13, b: true }) + K.t(A.X(2.6), 260, "α/2", "m", { s: 13, b: true }) + K.t(B.X(2.5), 260, "α", "m", { s: 13, b: true });
      s += K.t(A.X(0), 196, "1 − α", "a", { s: 13, b: true }) + K.t(B.X(-0.2), 196, "1 − α", "a", { s: 13, b: true });
      return K.svg(640, 290, s);
    });
})();
