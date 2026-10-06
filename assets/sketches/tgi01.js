/* Skizzen zu TGI01 – Datenstrukturen und Algorithmen.
   Jede Skizze: t = Titel, c = Lesehilfe (HTML), svg = function(K) → SVG-String (K = window.SK). */
(function(){
  "use strict";
  var S = window.ITI_SKETCHES = window.ITI_SKETCHES || {};
  function add(id, t, c, f){ S["tgi01-" + id] = { t: t, c: c, svg: f }; }
  function lines(K, x, y, arr, c, o){ o = o || {}; var s = ""; for(var i = 0; i < arr.length; i++) s += K.t(x, y + i * (o.lh || 20), arr[i], c || "s", { a: o.a || "start", s: o.s || 13.5, b: o.b }); return s; }
  /* Zeile aus Kästchen: xs = Mittelpunkte, st(i) → {c, fill, tc} */
  function row(K, xs, y, vals, st, o){
    o = o || {}; var s = "";
    for(var i = 0; i < vals.length; i++){
      var q = st ? (st(i) || {}) : {};
      if(q.dash){
        s += K.rect(xs[i] - (o.w || 44) / 2, y - (o.h || 32) / 2, o.w || 44, o.h || 32, q.c || "a", { fill: q.fill || "p", rx: 3, w: 1.6, dash: "5 4" }) +
          K.t(xs[i], y + 1, String(vals[i]), q.tc || "i", { s: o.s || 14, b: true, halo: false });
      } else s += K.cell(xs[i], y, String(vals[i]), q.c || "a", { w: o.w || 44, h: o.h || 32, fill: q.fill, tc: q.tc, s: o.s });
    }
    return s;
  }
  function seq(x0, d, n){ var a = []; for(var i = 0; i < n; i++) a.push(x0 + i * d); return a; }
  /* Baum: N = {id: [x, y, label, c, fill]}, E = [[a, b, c]] */
  function tree(K, N, E, o){
    o = o || {}; var s = "", r = o.r || 20;
    E.forEach(function(e){ var A = N[e[0]], B = N[e[1]]; s += K.edge(A[0], A[1], B[0], B[1], { r1: r, r2: r, noarrow: !o.arrow, c: e[2] || "s", w: 1.8 }); });
    for(var k in N){ var q = N[k]; s += K.node(q[0], q[1], q[2], q[3] || "a", { r: r, fill: q[4], s: o.s || 14 }); }
    return s;
  }
  /* Listenknoten: Datenfeld (w) + Zeigerfeld (pw), Mitte Datenfeld bei x */
  function lnode(K, x, y, val, o){
    o = o || {}; var w = o.w || 44, pw = o.pw || 28, h = o.h || 34, c = o.c || "a";
    var s = K.rect(x - w / 2, y - h / 2, w + pw, h, c, { fill: o.fill || "p", rx: 3, w: 1.6, dash: o.dash }) +
      K.line(x + w / 2, y - h / 2, x + w / 2, y + h / 2, c, { w: 1.4 }) +
      K.t(x, y + 1, val, "i", { s: 15, b: true, halo: false });
    s += o.nil ? K.t(x + w / 2 + pw / 2, y + 1, "∅", "s", { s: 15, b: true, halo: false }) : K.dot(x + w / 2 + pw / 2, y, c, 3.5);
    return s;
  }
  /* Relationsbild auf M = {1, 2, 3} in einem Feld ab px */
  function relp(K, px, title, tc, edges, loops, cap, cc){
    var P = { 1: [px + 75, 220], 2: [px + 225, 220], 3: [px + 150, 120] }, s = K.panel(px, 10, 300, 300, title, tc);
    (loops || []).forEach(function(l){ var q = P[l[0]]; s += K.loop(q[0], q[1], l[1], { r: 20, c: l[2] || "a" }); });
    (edges || []).forEach(function(e){ var A = P[e[0]], B = P[e[1]]; s += K.edge(A[0], A[1], B[0], B[1], { r1: 20, r2: 20, c: e[2] || "a", bend: e[3] || 0, dash: e[4], w: 2 }); });
    for(var k in P) s += K.node(P[k][0], P[k][1], k, "i", { r: 20 });
    s += K.t(px + 150, 290, cap, cc || "s", { s: 13, b: true });
    return s;
  }

  /* ═════════ Kapitel 1: Algorithmen und Darstellung ═════════ */

  add("algo", "Vier Pflichten eines Algorithmus",
    "Jedes Feld zeigt eine Eigenschaft, die ein Algorithmus haben <b>muss</b>: Gleiche Eingabe ergibt immer dasselbe Ergebnis (<b>determiniert</b>), jeder Schritt ist wirklich machbar (<b>effektiv</b>), die Beschreibung ist endlich lang (<b>finit</b>) und der Ablauf kommt sicher an ein Ende (<b>terminierend</b>). Ob als Pseudocode, Flussdiagramm oder Struktogramm notiert, ändert daran nichts.",
    function(K){
      var s = "", T = ["determiniert", "effektiv", "finit", "terminierend"];
      for(var p = 0; p < 4; p++) s += K.panel(10 + p * 160, 10, 150, 240, T[p], "a");
      var cx = 85;
      [80, 130].forEach(function(y){
        s += K.cell(cx - 48, y, "3", "s", { w: 28, h: 28 }) + K.arrow(cx - 33, y, cx - 19, y, "s", { w: 1.6, head: 7 }) +
          K.cell(cx, y, "A", "a", { w: 34, h: 30, fill: "fa" }) + K.arrow(cx + 18, y, cx + 32, y, "s", { w: 1.6, head: 7 }) + K.cell(cx + 48, y, "9", "m", { w: 28, h: 28, fill: "fm" });
      });
      s += K.t(cx, 105, "2. Lauf:", "f", { s: 12 });
      cx = 245;
      ["a = 2", "b = a · 3", "gib b aus"].forEach(function(t, i){ s += K.cell(cx - 8, 70 + i * 36, t, "a", { w: 110, h: 28, s: 13 }) + K.t(cx + 60, 70 + i * 36, "✓", "a", { s: 15, b: true }); });
      cx = 405;
      s += K.rect(cx - 52, 50, 104, 120, "s", { fill: "p", rx: 3 });
      ["1 lies n", "2 s = 0", "3 …", "4 gib s aus"].forEach(function(t, i){ s += K.t(cx - 42, 72 + i * 26, t, "i", { a: "start", s: 13 }); });
      cx = 565;
      [58, 90, 122].forEach(function(y, i){ s += K.node(cx, y, String(i + 1), "a", { r: 12, s: 12 }); if(i < 2) s += K.arrow(cx, y + 12, cx, y + 20, "s", { w: 1.6, head: 7 }); });
      s += K.arrow(cx, 134, cx, 146, "s", { w: 1.6, head: 7 }) + K.rect(cx - 34, 146, 68, 26, "m", { fill: "fm", rx: 13 }) + K.t(cx, 160, "Ende", "m", { s: 13, b: true, halo: false });
      var cap = [["gleiche Eingabe", "→ gleiches Ergebnis"], ["jeder Schritt", "wirklich ausführbar"], ["endlich lange", "Beschreibung"], ["hält nach endlich", "vielen Schritten"]];
      for(p = 0; p < 4; p++) s += K.t(85 + p * 160, 205, cap[p][0], "s", { s: 12.5 }) + K.t(85 + p * 160, 225, cap[p][1], "s", { s: 12.5 });
      return K.svg(650, 260, s);
    });

  add("drei", "Ein Algorithmus – drei Darstellungen",
    "Derselbe Algorithmus (Summe 1 + 2 + … + n) dreimal notiert. <b>Pseudocode</b> ist Text, nah am Programm. Das <b>Flussdiagramm</b> zeigt den Ablauf mit Pfeilen – der Rückpfeil ist die Schleife. Das <b>Struktogramm</b> kommt ohne Pfeile aus: Die Schleife ist ein Block, in dem der Rumpf eingerückt steckt.",
    function(K){
      var s = K.panel(10, 10, 205, 320, "Pseudocode (Groovy)") + K.panel(220, 10, 205, 320, "Flussdiagramm") + K.panel(435, 10, 205, 320, "Struktogramm");
      s += lines(K, 28, 60, ["def summe = 0", "def i = 1", "while (i <= n) {", "    summe += i", "    i++", "}", "println summe"], "i", { s: 13, lh: 24 });
      s += K.t(112, 250, "Text, Zeile für Zeile", "s", { s: 12.5 });
      var cx = 322;
      s += K.rect(cx - 40, 40, 80, 26, "a", { fill: "fa", rx: 13 }) + K.t(cx, 53, "Start", "a", { s: 13, b: true, halo: false });
      s += K.arrow(cx, 66, cx, 82, "s", { w: 1.6, head: 7 });
      s += K.rect(cx - 65, 82, 130, 28, "a", { fill: "p", rx: 0 }) + K.t(cx, 96, "summe = 0; i = 1", "i", { s: 12.5, halo: false });
      s += K.arrow(cx, 110, cx, 128, "s", { w: 1.6, head: 7 });
      s += K.poly([[cx, 128], [cx + 50, 150], [cx, 172], [cx - 50, 150]], "c3", { fill: "p" }) + K.t(cx, 151, "i ≤ n ?", "i", { s: 13, b: true, halo: false });
      s += K.arrow(cx, 172, cx, 190, "s", { w: 1.6, head: 7 }) + K.t(cx + 8, 182, "ja", "c3", { a: "start", s: 12, b: true });
      s += K.rect(cx - 65, 190, 130, 28, "a", { fill: "p", rx: 0 }) + K.t(cx, 204, "summe += i; i++", "i", { s: 12.5, halo: false });
      s += K.path("M" + (cx - 65) + " 204 L238 204 L238 150", "c4", { w: 1.8 }) + K.arrow(238, 150, cx - 50, 150, "c4", { w: 1.8, head: 8 });
      s += K.path("M" + (cx + 50) + " 150 L410 150 L410 250", "s", { w: 1.6 }) + K.arrow(410, 250, 388, 250, "s", { w: 1.6, head: 7 }) + K.t(392, 139, "nein", "c3", { s: 12, b: true });
      s += K.poly([[cx - 55, 236], [cx + 65, 236], [cx + 55, 264], [cx - 65, 264]], "a", { fill: "p" }) + K.t(cx, 250, "Ausgabe summe", "i", { s: 12.5, halo: false });
      s += K.arrow(cx, 264, cx, 282, "s", { w: 1.6, head: 7 }) + K.rect(cx - 40, 282, 80, 26, "a", { fill: "fa", rx: 13 }) + K.t(cx, 295, "Ende", "a", { s: 13, b: true, halo: false });
      s += K.t(246, 234, "Schleife", "c4", { a: "start", s: 12, b: true });
      var x = 447;
      s += K.rect(x, 55, 180, 28, "a", { rx: 0 }) + K.t(x + 90, 69, "summe = 0", "i", { s: 13, halo: false });
      s += K.rect(x, 83, 180, 28, "a", { rx: 0 }) + K.t(x + 90, 97, "i = 1", "i", { s: 13, halo: false });
      s += K.rect(x, 111, 180, 84, "c4", { rx: 0, fill: "fm" }) + K.t(x + 90, 125, "solange i ≤ n", "c4", { s: 13, b: true, halo: false });
      s += K.rect(x + 24, 139, 156, 28, "a", { rx: 0 }) + K.t(x + 102, 153, "summe += i", "i", { s: 13, halo: false });
      s += K.rect(x + 24, 167, 156, 28, "a", { rx: 0 }) + K.t(x + 102, 181, "i++", "i", { s: 13, halo: false });
      s += K.rect(x, 195, 180, 28, "a", { rx: 0 }) + K.t(x + 90, 209, "Ausgabe summe", "i", { s: 13, halo: false });
      s += K.t(537, 260, "keine Pfeile –", "s", { s: 12.5 }) + K.t(537, 280, "Blöcke stecken ineinander", "s", { s: 12.5 });
      return K.svg(650, 340, s);
    });

  add("symbole", "Die vier Symbole im Flussdiagramm",
    "Jede Form hat <b>eine feste Bedeutung</b>: Oval = Start/Ende, Rechteck = eine Anweisung, Raute = Frage mit <b>zwei Ausgängen</b> (ja/nein), Parallelogramm = Ein- oder Ausgabe. Die Pfeile verbinden die Formen zum Kontrollfluss – man kann den Weg mit dem Finger nachfahren.",
    function(K){
      var s = "", y = 110;
      s += K.rect(30, y - 14, 110, 28, "a", { fill: "fa", rx: 14 }) + K.t(85, y, "Start", "a", { s: 13.5, b: true, halo: false }) + K.arrow(85, y + 14, 85, y + 44, "s", { w: 1.6, head: 8 });
      s += K.arrow(240, 66, 240, y - 14, "s", { w: 1.6, head: 8 }) + K.rect(180, y - 14, 120, 28, "a", { fill: "p", rx: 0 }) + K.t(240, y, "x = x + 1", "i", { s: 13.5, halo: false }) + K.arrow(240, y + 14, 240, y + 44, "s", { w: 1.6, head: 8 });
      s += K.arrow(400, 52, 400, y - 26, "s", { w: 1.6, head: 8 }) + K.poly([[400, y - 26], [450, y], [400, y + 26], [350, y]], "c3", { fill: "p" }) + K.t(400, y + 1, "x > 0 ?", "i", { s: 13.5, b: true, halo: false });
      s += K.arrow(400, y + 26, 400, y + 50, "s", { w: 1.6, head: 8 }) + K.t(410, y + 40, "ja", "c3", { a: "start", s: 12, b: true });
      s += K.arrow(450, y, 486, y, "s", { w: 1.6, head: 8 }) + K.t(468, y - 12, "nein", "c3", { s: 12, b: true });
      s += K.arrow(560, 66, 560, y - 14, "s", { w: 1.6, head: 8 }) + K.poly([[510, y - 14], [620, y - 14], [610, y + 14], [500, y + 14]], "a", { fill: "p" }) + K.t(560, y, "Eingabe x", "i", { s: 13.5, halo: false }) + K.arrow(560, y + 14, 560, y + 44, "s", { w: 1.6, head: 8 });
      var L = [["Oval", "Start / Ende"], ["Rechteck", "Verarbeitung"], ["Raute", "Entscheidung"], ["Parallelogramm", "Ein-/Ausgabe"]], X = [85, 240, 400, 560];
      for(var i = 0; i < 4; i++) s += K.t(X[i], 190, L[i][0], "a", { s: 13.5, b: true }) + K.t(X[i], 210, L[i][1], "s", { s: 12.5 });
      s += K.t(400, 230, "2 Ausgänge", "m", { s: 12.5, b: true }) + K.t(240, 230, "1 Ausgang", "s", { s: 12 }) + K.t(560, 230, "1 Ausgang", "s", { s: 12 });
      return K.svg(640, 245, s);
    });

  add("raute", "Raute ≠ Parallelogramm",
    "Woran man sie unterscheidet: Aus der <b>Raute</b> führen <b>zwei</b> Wege heraus – sie stellt eine Frage, die mit ja oder nein beantwortet wird. Das <b>Parallelogramm</b> hat nur einen Eingang und einen Ausgang – hier wird nur etwas eingelesen oder ausgegeben, es wird nichts entschieden.",
    function(K){
      var s = K.panel(10, 10, 290, 270, "Raute = Entscheidung", "c3") + K.panel(320, 10, 290, 270, "Parallelogramm = Ein-/Ausgabe", "a");
      s += K.arrow(155, 45, 155, 90, "s", { w: 1.8, head: 9 }) + K.poly([[155, 90], [225, 130], [155, 170], [85, 130]], "c3", { fill: "p", w: 2 }) + K.t(155, 131, "x > 100 ?", "i", { s: 14, b: true, halo: false });
      s += K.arrow(155, 170, 155, 215, "s", { w: 1.8, head: 9 }) + K.t(167, 196, "ja", "c3", { a: "start", s: 13, b: true });
      s += K.arrow(225, 130, 282, 130, "s", { w: 1.8, head: 9 }) + K.t(252, 116, "nein", "c3", { s: 13, b: true });
      s += K.t(155, 250, "1 Eingang, 2 Ausgänge", "c3", { s: 13, b: true });
      s += K.arrow(465, 45, 465, 105, "s", { w: 1.8, head: 9 }) + K.poly([[395, 105], [555, 105], [535, 155], [375, 155]], "a", { fill: "p", w: 2 }) + K.t(465, 131, "Eingabe x", "i", { s: 14, b: true, halo: false });
      s += K.arrow(465, 155, 465, 215, "s", { w: 1.8, head: 9 }) + K.t(465, 250, "1 Eingang, 1 Ausgang", "a", { s: 13, b: true });
      return K.svg(620, 290, s);
    });

  add("nsbloecke", "Struktogramm: die Grundbausteine als Blöcke",
    "Im Struktogramm gibt es <b>keine Pfeile</b>, nur Rechtecke, die gestapelt oder ineinander gesteckt werden. <b>Sequenz</b>: übereinander. <b>Auswahl</b>: oben die Frage, darunter zwei Spalten für ja/nein. <b>while</b>: Prüfung oben, Rumpf eingerückt darunter. <b>do-while</b>: Rumpf zuerst, Prüfung unten – er läuft also mindestens einmal. Weil es keine Sprünge gibt, ist das Ergebnis immer strukturiert.",
    function(K){
      var s = "", T = ["Sequenz", "Auswahl", "while", "do-while"];
      for(var p = 0; p < 4; p++) s += K.panel(10 + p * 160, 10, 150, 220, T[p], "a");
      var px = 10;
      ["A", "B", "C"].forEach(function(t, i){ s += K.rect(px + 15, 50 + i * 32, 120, 32, "a", { rx: 0 }) + K.t(px + 75, 66 + i * 32, t, "i", { s: 14, b: true, halo: false }); });
      px = 170;
      s += K.rect(px + 15, 50, 120, 44, "c3", { rx: 0 }) + K.line(px + 15, 50, px + 75, 94, "c3", { w: 1.4 }) + K.line(px + 135, 50, px + 75, 94, "c3", { w: 1.4 });
      s += K.t(px + 75, 62, "B ?", "c3", { s: 13, b: true, halo: false }) + K.t(px + 30, 86, "ja", "s", { s: 12, halo: false }) + K.t(px + 118, 86, "nein", "s", { s: 12, halo: false });
      s += K.rect(px + 15, 94, 60, 40, "a", { rx: 0 }) + K.rect(px + 75, 94, 60, 40, "a", { rx: 0 }) + K.t(px + 45, 114, "A", "i", { s: 14, b: true, halo: false }) + K.t(px + 105, 114, "C", "i", { s: 14, b: true, halo: false });
      px = 330;
      s += K.rect(px + 15, 50, 120, 96, "c4", { rx: 0, fill: "fm" }) + K.t(px + 75, 66, "solange B", "c4", { s: 13, b: true, halo: false });
      s += K.rect(px + 39, 82, 96, 64, "a", { rx: 0 }) + K.t(px + 87, 114, "Rumpf", "i", { s: 13.5, b: true, halo: false });
      px = 490;
      s += K.rect(px + 15, 50, 120, 96, "c4", { rx: 0, fill: "fm" }) + K.rect(px + 39, 50, 96, 64, "a", { rx: 0 }) + K.t(px + 87, 82, "Rumpf", "i", { s: 13.5, b: true, halo: false });
      s += K.t(px + 75, 130, "solange B", "c4", { s: 13, b: true, halo: false });
      var cap = [["nacheinander", ""], ["if / else", "zwei Spalten"], ["Prüfung zuerst", "evtl. 0-mal"], ["Prüfung zuletzt", "mind. 1-mal"]];
      for(p = 0; p < 4; p++) s += K.t(85 + p * 160, 180, cap[p][0], "s", { s: 12.5, b: true }) + (cap[p][1] ? K.t(85 + p * 160, 200, cap[p][1], "s", { s: 12.5 }) : "");
      return K.svg(650, 240, s);
    });

  /* ═════════ Kapitel 2: Mathematische Grundlagen ═════════ */

  add("menge", "M = {x | Bedingung} – ein Sieb",
    "Die Schreibweise wirkt wie ein <b>Sieb</b>: Man geht alle Kandidaten durch und behält nur die, für die die Bedingung stimmt. Hier sind die Kandidaten 1 bis 10, die Bedingung „x gerade“ – übrig bleibt <b>M = {2, 4, 6, 8, 10}</b>.",
    function(K){
      var s = K.f(320, 32, "M = {x | x gerade, 1 ≤ x ≤ 10}", "a"), X = seq(70, 55, 10), Mx = [200, 260, 320, 380, 440];
      s += K.t(70, 68, "Kandidaten", "s", { a: "start", s: 12.5 });
      s += K.path("M120 210 A200 42 0 1 0 520 210 A200 42 0 1 0 120 210", "a", { w: 1.8, fill: "fa" });
      for(var i = 0; i < 10; i++){
        var ev = (i + 1) % 2 === 0;
        if(ev) s += K.edge(X[i], 100, Mx[(i - 1) / 2], 210, { r1: 18, r2: 18, c: "a", w: 1.6 });
        s += K.node(X[i], 100, String(i + 1), ev ? "a" : "f", { r: 18, fill: ev ? "fa" : "p", tc: ev ? "i" : "f" });
      }
      Mx.forEach(function(x, j){ s += K.node(x, 210, String(2 * j + 2), "a", { r: 18 }); });
      s += K.t(570, 68, "ungerade fallen durch", "f", { a: "end", s: 12 });
      s += K.t(320, 274, "M = {2, 4, 6, 8, 10}", "a", { s: 14, b: true });
      return K.svg(640, 290, s);
    });

  add("potenz", "Potenzmenge von {a, b, c}: 2³ = 8 Teilmengen",
    "Alle Teilmengen von M = {a, b, c}, von der <b>leeren Menge ∅</b> unten bis zu <b>M selbst</b> oben; eine Linie heißt „ein Element mehr“. Warum genau 2ⁿ? Für jedes Element gibt es nur zwei Möglichkeiten – <b>drin oder nicht drin</b>. Bei 3 Elementen: 2 · 2 · 2 = 8.",
    function(K){
      var s = "", L = { 3: [[260, "{a, b, c}"]], 2: [[150, "{a, b}"], [260, "{a, c}"], [370, "{b, c}"]], 1: [[150, "{a}"], [260, "{b}"], [370, "{c}"]], 0: [[260, "∅"]] };
      var Y = { 3: 45, 2: 120, 1: 195, 0: 270 };
      var up = [[0, 0, 1, 0], [0, 0, 1, 1], [0, 0, 1, 2], [1, 0, 2, 0], [1, 0, 2, 1], [1, 1, 2, 0], [1, 1, 2, 2], [1, 2, 2, 1], [1, 2, 2, 2], [2, 0, 3, 0], [2, 1, 3, 0], [2, 2, 3, 0]];
      up.forEach(function(u){ s += K.line(L[u[0]][u[1]][0], Y[u[0]] - 15, L[u[2]][u[3]][0], Y[u[2]] + 15, "s", { w: 1.4 }); });
      for(var l = 0; l <= 3; l++){
        L[l].forEach(function(q){ s += K.cell(q[0], Y[l], q[1], l === 0 || l === 3 ? "m" : "a", { w: 80, h: 30, s: 13.5, fill: l === 0 || l === 3 ? "fm" : "p" }); });
        s += K.t(450, Y[l], String(L[l].length), "c4", { s: 14, b: true });
      }
      s += K.t(450, 15, "Anzahl", "c4", { s: 12 });
      s += lines(K, 490, 110, ["M = {a, b, c}", "je Element:", "drin oder nicht", "2 · 2 · 2 = 2³ = 8"], "s", { s: 13.5, lh: 22 });
      s += K.t(490, 220, "1 + 3 + 3 + 1 = 8", "c4", { a: "start", s: 13.5, b: true });
      return K.svg(640, 295, s);
    });

  add("kreuz", "Relation = Auswahl aus M × M",
    "Links alle <b>9 möglichen Paare</b> (x, y) mit x, y aus M = {1, 2, 3} – das ist M × M. Eine Relation R <b>wählt einige davon aus</b> (blau). Rechts dasselbe als Pfeilbild: Jedes Paar (x, y) ∈ R wird zu einem Pfeil x → y, ein Paar (x, x) zu einer Schleife.",
    function(K){
      var s = K.f(165, 28, "R = {(1,1), (1,2), (2,3), (3,3)}", "a", { s: 13 }), R = { "1,1": 1, "1,2": 1, "2,3": 1, "3,3": 1 };
      s += K.t(66, 60, "x \\ y", "s", { s: 12 });
      for(var i = 1; i <= 3; i++){
        s += K.t(65 + i * 50, 62, String(i), "s", { s: 13, b: true }) + K.t(68, 55 + i * 50, String(i), "s", { s: 13, b: true });
        for(var j = 1; j <= 3; j++){
          var k = i + "," + j, on = R[k];
          s += K.cell(65 + j * 50, 55 + i * 50, "(" + k + ")", on ? "a" : "f", { w: 50, h: 50, s: 12, fill: on ? "fa" : "p", tc: on ? "i" : "f", rx: 0 });
        }
      }
      s += K.t(165, 255, "Zeile = x, Spalte = y", "s", { s: 12.5 });
      s += K.t(495, 40, "dasselbe als Pfeilbild", "s", { s: 13, b: true });
      var P = { 1: [420, 110], 2: [570, 110], 3: [495, 220] };
      s += K.loop(420, 110, 180, { r: 20, c: "a" }) + K.loop(495, 220, 0, { r: 20, c: "a" });
      s += K.edge(420, 110, 570, 110, { r1: 20, r2: 20, c: "a", w: 2 }) + K.edge(570, 110, 495, 220, { r1: 20, r2: 20, c: "a", w: 2 });
      for(var q in P) s += K.node(P[q][0], P[q][1], q, "i", { r: 20 });
      s += K.t(495, 278, "(x, y) ∈ R  ⟷  Pfeil x → y", "a", { s: 13, b: true });
      return K.svg(640, 295, s);
    });

  add("reflexiv", "Reflexiv: jedes Element steht zu sich selbst in Relation",
    "Im Pfeilbild heißt reflexiv: <b>an jedem Knoten eine Schleife</b>. Links haben 1, 2 und 3 alle ihre Schleife – reflexiv. Rechts fehlt die Schleife an 3, also fehlt das Paar (3, 3) – schon ist die Relation <b>nicht</b> reflexiv. Ein einziges fehlendes Element genügt.",
    function(K){
      var s = relp(K, 10, "reflexiv ✓", "a", [[1, 2]], [[1, 200], [2, 340], [3, 90]], "an jedem Knoten eine Schleife");
      s += relp(K, 330, "nicht reflexiv ✗", "m", [[1, 2]], [[1, 200], [2, 340]], "(3, 3) fehlt", "m");
      s += K.circ(480, 120, 27, "m", { w: 1.8, dash: "5 4" });
      return K.svg(640, 320, s);
    });

  add("symm", "Symmetrisch: zu jedem Pfeil gibt es den Rückpfeil",
    "Symmetrisch heißt: Wer hin darf, darf auch zurück. Im Pfeilbild kommen die Pfeile also <b>immer paarweise</b> (x → y und y → x). Rechts fehlt zu 1 → 2 der Rückweg 2 → 1 (gestrichelt) – damit ist die Relation <b>nicht symmetrisch</b>.",
    function(K){
      var s = relp(K, 10, "symmetrisch ✓", "a", [[1, 2, "a", 12], [2, 1, "a", 12], [2, 3, "c4", 12], [3, 2, "c4", 12]], [], "jeder Pfeil hat einen Rückpfeil");
      s += relp(K, 330, "nicht symmetrisch ✗", "m", [[1, 2, "a", 12], [2, 1, "m", 12, "5 4"], [2, 3, "c4", 12], [3, 2, "c4", 12]], [], "(2, 1) fehlt", "m");
      return K.svg(640, 320, s);
    });

  add("antisymm", "Antisymmetrisch: nie hin und zurück zwischen verschiedenen Elementen",
    "Antisymmetrisch verbietet <b>Doppelpfeile zwischen zwei verschiedenen Knoten</b>: Gilt (x, y) und (y, x), dann müssen x und y dasselbe Element sein. Schleifen sind erlaubt. Rechts zeigen 1 → 2 und 2 → 1 in beide Richtungen, obwohl 1 ≠ 2 – verletzt.",
    function(K){
      var s = relp(K, 10, "antisymmetrisch ✓", "a", [[1, 2], [2, 3], [1, 3]], [[1, 200]], "jede Verbindung nur einseitig");
      s += relp(K, 330, "nicht antisymmetrisch ✗", "m", [[1, 2, "m", 12], [2, 1, "m", 12], [2, 3]], [[1, 200]], "1 ⇄ 2, aber 1 ≠ 2", "m");
      return K.svg(640, 320, s);
    });

  add("trans", "Transitiv: über zwei Pfeile führt auch ein direkter",
    "Transitiv heißt: Komme ich in zwei Schritten von x über y nach z, muss es auch den <b>direkten Pfeil x → z</b> geben – die „Abkürzung“. Links ist 1 → 3 vorhanden (orange). Rechts fehlt sie (gestrichelt) – also nicht transitiv.",
    function(K){
      var s = relp(K, 10, "transitiv ✓", "a", [[1, 3], [3, 2], [1, 2, "c3"]], [], "1 → 3 → 2, also auch 1 → 2");
      s += relp(K, 330, "nicht transitiv ✗", "m", [[1, 3], [3, 2], [1, 2, "m", 0, "5 4"]], [], "Abkürzung (1, 2) fehlt", "m");
      return K.svg(640, 320, s);
    });

  add("beides", "Symmetrisch und antisymmetrisch – beides oder keins geht",
    "Die beiden Eigenschaften sind <b>keine Gegensätze</b>. Gibt es nur Schleifen (die <b>Gleichheit</b> x = x), ist nichts zu spiegeln und kein verbotener Doppelpfeil da – also beides zugleich. Ganz rechts: 1 ⇄ 2 verletzt antisymmetrisch, 2 → 3 ohne Rückpfeil verletzt symmetrisch – keins von beidem.",
    function(K){
      var s = "", T = [["nur symmetrisch", "a"], ["nur antisymmetrisch", "a"], ["beides: Gleichheit", "m"], ["keins von beidem", "c4"]];
      for(var p = 0; p < 4; p++){
        var px = 10 + p * 160, P = { 1: [px + 45, 120], 2: [px + 105, 120], 3: [px + 75, 205] };
        s += K.panel(px, 10, 150, 270, T[p][0], T[p][1]);
        var E = [[[1, 2, 10], [2, 1, 10]], [[1, 2, 0], [2, 3, 0]], [], [[1, 2, 10], [2, 1, 10], [2, 3, 0]]][p];
        E.forEach(function(e){ var A = P[e[0]], B = P[e[1]]; s += K.edge(A[0], A[1], B[0], B[1], { r1: 18, r2: 18, c: "a", bend: e[2], w: 1.8 }); });
        if(p === 2) s += K.loop(px + 45, 120, 120, { r: 18, c: "m" }) + K.loop(px + 105, 120, 60, { r: 18, c: "m" }) + K.loop(px + 75, 205, 270, { r: 18, c: "m" });
        for(var k in P) s += K.node(P[k][0], P[k][1], k, "i", { r: 18 });
      }
      return K.svg(650, 290, s);
    });

  add("aequiv", "Äquivalenzrelation zerlegt M in Klassen",
    "Beispiel: x ~ y, wenn x und y beim Teilen durch 3 <b>denselben Rest</b> lassen. Reflexiv, symmetrisch und transitiv zusammen bewirken, dass M = {1, …, 9} in <b>getrennte Gruppen</b> zerfällt: Innerhalb einer Gruppe hängt jeder mit jedem zusammen, zwischen den Gruppen gibt es keine Verbindung.",
    function(K){
      var s = K.f(320, 28, "x ~ y  ⇔  x mod 3 = y mod 3", "a"), G = [[1, 4, 7], [2, 5, 8], [3, 6, 9]], C = ["a", "c4", "c3"], R = ["Rest 1", "Rest 2", "Rest 0"];
      for(var g = 0; g < 3; g++){
        var cx = 115 + g * 205, P = [[cx, 112], [cx - 45, 185], [cx + 45, 185]];
        s += K.path("M" + (cx - 90) + " 155 A90 75 0 1 0 " + (cx + 90) + " 155 A90 75 0 1 0 " + (cx - 90) + " 155", C[g], { w: 1.6, fill: "fa", dash: "6 4" });
        [[0, 1], [0, 2], [1, 2]].forEach(function(e){ s += K.edge(P[e[0]][0], P[e[0]][1], P[e[1]][0], P[e[1]][1], { r1: 18, r2: 18, c: C[g], noarrow: true, w: 1.8 }); });
        for(var i = 0; i < 3; i++) s += K.node(P[i][0], P[i][1], String(G[g][i]), C[g], { r: 18 });
        s += K.t(cx, 252, R[g], C[g], { s: 13.5, b: true });
      }
      s += K.t(320, 285, "jedes Element in genau einer Klasse – Klassen überlappen nie", "s", { s: 13 });
      return K.svg(640, 300, s);
    });

  add("ordnung", "Partielle Ordnung: Teilbarkeit auf {1, 2, 3, 4, 6, 12}",
    "„a teilt b“ ist reflexiv, antisymmetrisch und transitiv – eine <b>partielle Ordnung</b>. Ein Pfeil zeigt von a nach b, wenn a ein direkter Teiler von b ist; Schleifen und Abkürzungen (1 → 12 usw.) lässt man weg, sie folgen aus der Transitivität. <b>Partiell</b>, weil manche Paare unvergleichbar sind: Weder teilt 4 die 6 noch 6 die 4.",
    function(K){
      var N = { 12: [200, 45], 4: [120, 125], 6: [280, 125], 2: [120, 205], 3: [280, 205], 1: [200, 280] }, s = "";
      [[1, 2], [1, 3], [2, 4], [2, 6], [3, 6], [4, 12], [6, 12]].forEach(function(e){ var A = N[e[0]], B = N[e[1]]; s += K.edge(A[0], A[1], B[0], B[1], { r1: 18, r2: 18, c: "a", w: 1.8 }); });
      for(var k in N) s += K.node(N[k][0], N[k][1], k, k === "4" || k === "6" ? "c3" : "a", { r: 18 });
      s += K.line(146, 125, 254, 125, "c3", { w: 1.4, dash: "4 4" }) + K.t(200, 112, "?", "c3", { s: 15, b: true });
      s += lines(K, 360, 50, ["a ≤ b  ⇔  a teilt b"], "a", { s: 14, b: true });
      s += lines(K, 360, 85, ["reflexiv: 4 | 4", "antisymmetrisch: a | b und b | a", "    ⇒ a = b", "transitiv: 2 | 4 und 4 | 12 ⇒ 2 | 12", "partiell: 4 und 6 unvergleichbar"], "s", { s: 13, lh: 24 });
      s += K.t(360, 220, "(Schleifen und Abkürzungen", "f", { a: "start", s: 12 }) + K.t(360, 238, "sind weggelassen)", "f", { a: "start", s: 12 });
      return K.svg(640, 305, s);
    });

  add("algebra", "Algebra = Menge + Operationen + Axiome – das Muster des ADT",
    "Oben die Algebra (ℤ, +): eine <b>Trägermenge</b>, eine <b>Operation</b> darauf und <b>Axiome</b>, die immer gelten. Unten dasselbe Schema für einen Datentyp: Der Stack hat Werte, Operationen und Regeln wie „top(push(s, x)) = x“. Genau so wird in Kapitel 3 ein <b>abstrakter Datentyp</b> festgelegt.",
    function(K){
      var s = "", X = [110, 320, 530];
      var A = [["Trägermenge", "…, −1, 0, 1, 2, …"], ["Operation", "+ : ℤ × ℤ → ℤ"], ["Axiome", "a + 0 = a", "a + b = b + a"]];
      var B = [["Werte", "Stapel aus Elementen"], ["Operationen", "push, pop, top, isEmpty"], ["Axiome", "top(push(s, x)) = x", "pop(push(s, x)) = s"]];
      s += K.t(20, 30, "Algebra (ℤ, +)", "a", { a: "start", s: 14, b: true }) + K.t(20, 165, "ADT Stack – gleiches Schema", "c4", { a: "start", s: 14, b: true });
      for(var i = 0; i < 3; i++){
        s += K.rect(X[i] - 90, 48, 180, 80, "a", { fill: "fa" }) + K.t(X[i], 66, A[i][0], "a", { s: 13.5, b: true, halo: false });
        for(var j = 1; j < A[i].length; j++) s += K.t(X[i], 70 + j * 20, A[i][j], "i", { s: 13, halo: false });
        s += K.rect(X[i] - 90, 183, 180, 80, "c4", { fill: "fm" }) + K.t(X[i], 201, B[i][0], "c4", { s: 13.5, b: true, halo: false });
        for(j = 1; j < B[i].length; j++) s += K.t(X[i], 205 + j * 20, B[i][j], "i", { s: 13, halo: false });
      }
      return K.svg(640, 275, s);
    });

  /* ═════════ Kapitel 3: Datentypen ═════════ */

  add("adt", "ADT: das WAS ist festgelegt, das WIE bleibt offen",
    "Oben steht nur, <b>was</b> ein Stack kann (Signatur) und welche Regeln gelten (Axiome). Darunter zwei völlig verschiedene <b>Umsetzungen</b>: ein Array mit einem Index „top“ und eine verkettete Liste, bei der vorn eingefügt wird. Von außen verhalten sich beide gleich – <b>LIFO</b> –, deshalb erfüllen beide denselben ADT.",
    function(K){
      var s = K.rect(130, 15, 380, 88, "a", { fill: "fa", w: 1.6 });
      s += K.t(320, 33, "ADT Stack (das WAS)", "a", { s: 14, b: true, halo: false });
      s += K.t(320, 58, "Signatur: push(x), pop(), top(), isEmpty()", "i", { s: 13, halo: false });
      s += K.t(320, 82, "Axiome: top(push(s, x)) = x,  pop(push(s, x)) = s", "i", { s: 13, halo: false });
      s += K.arrow(240, 103, 160, 140, "s", { w: 1.6, head: 9 }) + K.arrow(400, 103, 480, 140, "s", { w: 1.6, head: 9 });
      s += K.panel(10, 140, 300, 170, "Umsetzung 1: Array", "s") + K.panel(330, 140, 300, 170, "Umsetzung 2: verkettete Liste", "s");
      var X = seq(60, 48, 5);
      s += row(K, X, 230, [5, 3, 7, "", ""], function(i){ return i === 2 ? { c: "a", fill: "fa" } : i > 2 ? { c: "f" } : {}; });
      for(var i = 0; i < 5; i++) s += K.t(X[i], 262, String(i), "f", { s: 12 });
      s += K.t(156, 178, "top = 2", "a", { s: 13, b: true }) + K.arrow(156, 188, 156, 211, "a", { w: 1.8, head: 8 });
      s += K.t(380, 178, "top", "a", { s: 13, b: true }) + K.arrow(380, 188, 380, 211, "a", { w: 1.8, head: 8 });
      [[380, "7"], [470, "3"], [560, "5"]].forEach(function(q, j){ s += lnode(K, q[0], 230, q[1], { w: 40, pw: 24, nil: j === 2, fill: j === 0 ? "fa" : "p" }); if(j < 2) s += K.arrow(q[0] + 32, 230, q[0] + 68, 230, "a", { w: 1.6, head: 8 }); });
      s += K.t(160, 290, "push: Index + 1", "s", { s: 12.5 }) + K.t(480, 290, "push: neuer Knoten vorn", "s", { s: 12.5 });
      return K.svg(640, 320, s);
    });

  add("statdyn", "Statisch vs. dynamisch",
    "<b>Statisch</b>: Die Größe wird beim Übersetzen festgelegt – ein Array mit 5 Plätzen hat genau 5 Plätze; ein sechstes Element passt nicht hinein. <b>Dynamisch</b>: Die Liste besteht aus einzelnen Knoten, die zur Laufzeit angehängt werden – sie wächst einfach mit.",
    function(K){
      var s = K.panel(10, 10, 300, 270, "statisch: Array[5]", "a") + K.panel(330, 10, 300, 270, "dynamisch: Liste", "c4");
      var X = seq(60, 50, 5);
      s += row(K, X, 110, [4, 8, 15, 16, 23], function(){ return { fill: "fa" }; }, { w: 46 });
      s += K.line(35, 140, 285, 140, "a", { w: 1.2 }) + K.t(160, 154, "5 Plätze – fest", "a", { s: 12.5 });
      s += K.cell(160, 195, "42", "m", { w: 44, fill: "fm" }) + K.t(200, 195, "?", "m", { a: "start", s: 18, b: true });
      s += K.t(160, 240, "kein Platz mehr", "m", { s: 13, b: true }) + K.t(160, 260, "Größe zur Übersetzungszeit fest", "s", { s: 12 });
      [[365, "4"], [435, "8"], [505, "15"]].forEach(function(q, j){ s += lnode(K, q[0], 110, q[1], { w: 36, pw: 20, c: "c4" }); s += K.arrow(q[0] + 28, 110, q[0] + 51, 110, "c4", { w: 1.6, head: 8 }); });
      s += lnode(K, 575, 110, "42", { w: 36, pw: 20, c: "a", nil: true, dash: "5 4", fill: "fa" });
      s += K.t(575, 150, "neu angehängt", "a", { s: 12.5, b: true });
      s += K.t(480, 240, "wächst zur Laufzeit", "c4", { s: 13, b: true }) + K.t(480, 260, "Knoten kommen und gehen", "s", { s: 12 });
      return K.svg(640, 290, s);
    });

  add("stack", "Stack (LIFO): push(5), push(3), push(7), pop(), push(1), top(), pop()",
    "Jede Spalte zeigt den Stapel <b>nach</b> der Operation darüber. Hinzugefügt und entnommen wird immer nur <b>oben</b> (blau = oberstes Element): Was zuletzt hineinkam, kommt zuerst heraus – <b>Last In, First Out</b>. top() liest nur nach, ohne zu entfernen. Endzustand [5, 3] wie in Aufgabe C.6.",
    function(K){
      var ops = ["push(5)", "push(3)", "push(7)", "pop()", "push(1)", "top()", "pop()"], st = [[5], [5, 3], [5, 3, 7], [5, 3], [5, 3, 1], [5, 3, 1], [5, 3]], res = ["", "", "", "→ 7", "", "→ 1", "→ 1"];
      var s = K.t(320, 22, "nur oben rein (push) und oben raus (pop)", "s", { s: 13.5 });
      for(var i = 0; i < 7; i++){
        var x = 55 + i * 90;
        s += K.t(x, 62, ops[i], i === 3 || i === 6 ? "m" : i === 5 ? "c4" : "a", { s: 13, b: true });
        s += K.path("M" + (x - 30) + " 130 L" + (x - 30) + " 248 L" + (x + 30) + " 248 L" + (x + 30) + " 130", "s", { w: 1.6 });
        for(var j = 0; j < st[i].length; j++){
          var top = j === st[i].length - 1;
          s += K.cell(x, 230 - j * 31, String(st[i][j]), top ? "a" : "s", { w: 50, h: 29, fill: top ? "fa" : "p" });
        }
        if(res[i]) s += K.t(x, 275, res[i], i === 5 ? "c4" : "m", { s: 13.5, b: true });
      }
      s += K.t(55, 100, "oben", "f", { s: 12 });
      return K.svg(640, 290, s);
    });

  add("queue", "Queue (FIFO): hinten anstellen, vorne heraus",
    "Jede Zeile zeigt die Schlange nach der Operation links. <b>enqueue</b> stellt hinten an (orange = neu), <b>dequeue</b> nimmt vorne weg. Wer zuerst kam, geht zuerst – <b>First In, First Out</b>, genau wie an der Kasse oder in der Druckerwarteschlange.",
    function(K){
      var ops = ["enqueue(5)", "enqueue(3)", "enqueue(7)", "dequeue()", "enqueue(1)", "dequeue()"], st = [[5], [5, 3], [5, 3, 7], [3, 7], [3, 7, 1], [7, 1]], res = ["", "", "", "→ 5 raus", "", "→ 3 raus"], nw = [0, 1, 2, -1, 2, -1];
      var s = K.t(200, 22, "vorne (front)", "a", { s: 12.5, b: true }) + K.arrow(200, 30, 200, 44, "a", { w: 1.6, head: 7 }) + K.t(330, 22, "hinten (rear)", "c3", { s: 12.5, b: true });
      for(var i = 0; i < 6; i++){
        var y = 68 + i * 42, deq = res[i] !== "";
        s += K.t(20, y, ops[i], deq ? "m" : "c3", { a: "start", s: 13, b: true });
        s += row(K, seq(200, 50, st[i].length), y, st[i], function(j){ return j === nw[i] ? { c: "c3", fill: "fm" } : j === 0 ? { c: "a", fill: "fa" } : {}; }, { h: 30 });
        if(deq) s += K.t(390, y, res[i], "m", { a: "start", s: 13, b: true });
      }
      return K.svg(520, 320, s);
    });

  add("klammer", "Klammerprüfung mit einem Stack: ( [ { } ] )",
    "Öffnende Klammern werden auf den Stack gelegt, bei jeder schließenden wird die <b>oberste</b> heruntergenommen – sie muss dazu passen. Ist der Stack am Ende <b>leer</b> und hat jedes Paar gepasst, ist der Ausdruck korrekt. Weil die zuletzt geöffnete Klammer zuerst geschlossen werden muss, ist LIFO genau das richtige Prinzip.",
    function(K){
      var ch = ["(", "[", "{", "}", "]", ")"], st = [["("], ["(", "["], ["(", "[", "{"], ["(", "["], ["("], []], act = ["push", "push", "push", "} zu { ✓", "] zu [ ✓", ") zu ( ✓"];
      var s = "";
      for(var i = 0; i < 6; i++){
        var x = 70 + i * 100;
        s += K.cell(x, 40, ch[i], i < 3 ? "a" : "c4", { w: 40, h: 34, s: 18, fill: i < 3 ? "fa" : "fm" });
        s += K.t(x, 78, act[i], i < 3 ? "a" : "c4", { s: 12.5, b: true });
        s += K.path("M" + (x - 28) + " 120 L" + (x - 28) + " 238 L" + (x + 28) + " 238 L" + (x + 28) + " 120", "s", { w: 1.6 });
        for(var j = 0; j < st[i].length; j++){ var top = j === st[i].length - 1; s += K.cell(x, 220 - j * 31, st[i][j], top ? "a" : "s", { w: 46, h: 29, s: 16, fill: top ? "fa" : "p" }); }
        if(!st[i].length) s += K.t(x, 220, "leer", "m", { s: 13, b: true });
      }
      s += K.t(320, 265, "Stack am Ende leer ⇒ Klammern korrekt", "m", { s: 13.5, b: true });
      return K.svg(640, 280, s);
    });

  add("einfach", "Einfach verkettete Liste",
    "Jeder <b>Knoten</b> hat zwei Fächer: die <b>Daten</b> und einen <b>Zeiger next</b> auf den nächsten Knoten. Man startet beim Kopf und folgt den Pfeilen; der letzte Zeiger ist leer (∅). Zurück geht es nicht – es gibt nur Vorwärtspfeile.",
    function(K){
      var s = K.t(40, 70, "Kopf", "a", { s: 13.5, b: true }) + K.arrow(40, 80, 88, 104, "a", { w: 1.8, head: 8 });
      [110, 260, 410].forEach(function(x, j){
        s += lnode(K, x, 110, ["A", "B", "C"][j], { nil: j === 2 });
        if(j < 2) s += K.arrow(x + 36, 110, x + 128, 110, "a", { w: 1.8, head: 9 });
      });
      s += K.t(110, 150, "Daten", "s", { s: 12 }) + K.t(146, 150, "next", "s", { s: 12, a: "start" });
      s += K.t(470, 110, "Ende: next = ∅", "s", { a: "start", s: 12.5 });
      s += K.arrow(160, 190, 440, 190, "c3", { w: 1.6, head: 9 }) + K.t(300, 210, "nur vorwärts", "c3", { s: 13, b: true });
      return K.svg(620, 225, s);
    });

  add("doppelt", "Doppelt verkettete Liste",
    "Hier hat jeder Knoten <b>zwei Zeiger</b>: next nach vorn (oben, blau) und prev zurück (unten, violett). Damit kann man in <b>beide Richtungen</b> laufen – bezahlt wird mit einem zusätzlichen Zeiger pro Knoten und mehr Arbeit beim Umhängen.",
    function(K){
      var s = "", X = [120, 290, 460];
      X.forEach(function(x, j){
        s += K.rect(x - 48, 90, 96, 44, "a", { fill: "p", rx: 3, w: 1.6 }) + K.line(x - 22, 90, x - 22, 134, "a", { w: 1.4 }) + K.line(x + 22, 90, x + 22, 134, "a", { w: 1.4 });
        s += K.t(x, 113, ["A", "B", "C"][j], "i", { s: 15, b: true, halo: false });
        s += j === 0 ? K.t(x - 35, 113, "∅", "s", { s: 14, b: true, halo: false }) : K.dot(x - 35, 120, "c4", 3.5);
        s += j === 2 ? K.t(x + 35, 113, "∅", "s", { s: 14, b: true, halo: false }) : K.dot(x + 35, 104, "a", 3.5);
        if(j < 2){
          s += K.arrow(x + 35, 104, X[j + 1] - 48, 104, "a", { w: 1.8, head: 8 });
          s += K.arrow(X[j + 1] - 35, 120, x + 48, 120, "c4", { w: 1.8, head: 8 });
        }
      });
      s += K.t(85, 152, "prev", "c4", { s: 12 }) + K.t(120, 152, "Daten", "s", { s: 12 }) + K.t(155, 152, "next", "a", { s: 12 });
      s += K.t(290, 60, "next → vorwärts", "a", { s: 13, b: true }) + K.t(290, 175, "← prev rückwärts", "c4", { s: 13, b: true });
      s += K.t(290, 205, "2 Zeiger pro Knoten", "s", { s: 12.5 });
      return K.svg(580, 220, s);
    });

  add("knoten", "Einfügen in eine Liste: nur zwei Zeiger umhängen",
    "Ein neuer Knoten X soll zwischen B und C. <b>Erst</b> zeigt X auf C (①), <b>dann</b> zeigt B auf X (②) – der alte Pfeil B → C fällt weg. Kein anderes Element muss verschoben werden; im Array müsste man dagegen alles hinter der Einfügestelle eine Position weiterrücken.",
    function(K){
      var s = "";
      [[110, "A"], [290, "B"], [470, "C"]].forEach(function(q, j){ s += lnode(K, q[0], 80, q[1], { w: 40, pw: 24, nil: j === 2 }); });
      s += K.arrow(142, 80, 268, 80, "a", { w: 1.8, head: 9 });
      s += K.line(322, 80, 446, 80, "f", { w: 1.6, dash: "5 5" }) + K.t(384, 66, "✗ alt", "f", { s: 13, b: true });
      s += lnode(K, 380, 210, "X", { w: 40, pw: 24, c: "c3", fill: "fm" });
      s += K.arrow(322, 88, 372, 191, "m", { w: 2.2, head: 10 }) + K.t(334, 150, "② B.next = X", "m", { a: "end", s: 13, b: true });
      s += K.arrow(412, 200, 460, 99, "a", { w: 2.2, head: 10 }) + K.t(452, 160, "① X.next = C", "a", { a: "start", s: 13, b: true });
      s += K.t(320, 265, "erst ①, dann ② – sonst geht der Rest der Liste verloren", "s", { s: 13 });
      s += K.t(320, 287, "nichts wird verschoben (anders als im Array)", "s", { s: 13 });
      return K.svg(620, 300, s);
    });

  /* ═════════ Kapitel 4: Sortieren und Suchen ═════════ */

  add("komplex", "Wie schnell wächst der Aufwand?",
    "Die Kurven zeigen, wie viele Schritte bei n Elementen nötig sind. <b>n²</b> (rot) schießt steil nach oben – dort liegen Bubble-, Selection- und InsertionSort. <b>n log n</b> (orange) ist das Niveau der schnellen Verfahren, <b>n</b> das der linearen Suche, <b>log n</b> das der binären Suche – fast flach.",
    function(K){
      var M = K.map(70, 300, 25, 2), s = K.axes(70, 300, 5, 530, 255, 5, "n", "") + K.t(80, 52, "Schritte", "s", { a: "start", s: 13.5 });
      var lg = function(x){ return Math.log(x) / Math.LN2; };
      s += K.plot(function(x){ return x * x; }, 0, 20, M, "m", { ymax: 115 });
      s += K.plot(function(x){ return x * lg(x); }, 1, 20, M, "c3");
      s += K.plot(function(x){ return x; }, 0, 20, M, "a");
      s += K.plot(function(x){ return lg(x); }, 1, 20, M, "c4");
      s += K.t(M.X(10.7) + 8, M.Y(112), "n²", "m", { a: "start", s: 14, b: true });
      s += K.t(M.X(20) + 8, M.Y(20 * lg(20)), "n log n", "c3", { a: "start", s: 13.5, b: true });
      s += K.t(M.X(20) + 8, M.Y(20), "n", "a", { a: "start", s: 14, b: true });
      s += K.t(M.X(20) + 8, M.Y(lg(20)) - 6, "log n", "c4", { a: "start", s: 13.5, b: true });
      s += K.f(400, 40, "Bubble / Selection / Insertion: O(n²)", "m", { fill: "fm", s: 13 });
      return K.svg(640, 325, s);
    });

  add("bubble", "BubbleSort an [15, 8, 23, 4, 42, 16]",
    "In jedem Durchlauf werden <b>Nachbarn verglichen</b> und getauscht, wenn sie falsch herum stehen. Dadurch „blubbert“ das größte noch unsortierte Element nach rechts an seinen Platz (blau = fertig). Ein Durchlauf <b>ohne Tausch</b> zeigt: Alles ist sortiert – Abbruch. Gleiche Werte werden nie übersprungen, deshalb ist BubbleSort <b>stabil</b>.",
    function(K){
      var R = [["Start", [15, 8, 23, 4, 42, 16], 0, ""], ["Durchlauf 1", [8, 15, 4, 23, 16, 42], 1, "3 Tausche, 42 ganz rechts"], ["Durchlauf 2", [8, 4, 15, 16, 23, 42], 2, "2 Tausche, 23 sitzt"],
        ["Durchlauf 3", [4, 8, 15, 16, 23, 42], 3, "1 Tausch (8 ↔ 4)"], ["Durchlauf 4", [4, 8, 15, 16, 23, 42], 6, "0 Tausche → fertig"]];
      var s = "", X = seq(150, 50, 6);
      R.forEach(function(r, k){
        var y = 40 + k * 55;
        s += K.t(15, y, r[0], "s", { a: "start", s: 13, b: true });
        s += row(K, X, y, r[1], function(i){ return i >= 6 - r[2] ? { c: "a", fill: "fa" } : { c: "s" }; });
        if(r[3]) s += K.t(440, y, r[3], k === 4 ? "m" : "s", { a: "start", s: 12.5, b: k === 4 });
      });
      return K.svg(640, 285, s);
    });

  add("selection", "SelectionSort an [15, 8, 23, 4, 42, 16] (Aufgabe C.9)",
    "In jedem Schritt wird das <b>Minimum des unsortierten Rests</b> gesucht und an die nächste freie Stelle vorn getauscht. Der blaue Teil links ist danach fertig sortiert. Orange: das Element, das beim Tausch <b>weit nach hinten springt</b> – genau dieser Sprung über andere hinweg macht SelectionSort <b>instabil</b>.",
    function(K){
      var R = [["Start", [15, 8, 23, 4, 42, 16], 0, -1, ""], ["Schritt 1", [4, 8, 23, 15, 42, 16], 1, 3, "Min 4 ↔ 15"], ["Schritt 2", [4, 8, 23, 15, 42, 16], 2, -1, "Min 8 bleibt"],
        ["Schritt 3", [4, 8, 15, 23, 42, 16], 3, 3, "Min 15 ↔ 23"], ["Schritt 4", [4, 8, 15, 16, 42, 23], 4, 5, "Min 16 ↔ 23"], ["Schritt 5", [4, 8, 15, 16, 23, 42], 6, -1, "Min 23 ↔ 42 → fertig"]];
      var s = "", X = seq(150, 50, 6);
      R.forEach(function(r, k){
        var y = 32 + k * 48;
        s += K.t(15, y, r[0], "s", { a: "start", s: 13, b: true });
        s += row(K, X, y, r[1], function(i){ return i < r[2] ? { c: "a", fill: "fa" } : i === r[3] ? { c: "c3", fill: "fm" } : { c: "s" }; });
        if(r[4]) s += K.t(440, y, r[4], k === 5 ? "m" : "s", { a: "start", s: 12.5, b: k === 5 });
      });
      return K.svg(640, 290, s);
    });

  add("insertion", "InsertionSort an [15, 8, 23, 4, 42, 16]",
    "Links wächst eine <b>sortierte Teilliste</b> (blau). Jedes nächste Element wird herausgenommen und an der <b>richtigen Stelle eingeschoben</b> (rot); die größeren rücken dafür eins nach rechts. Ist die Liste schon fast sortiert, muss kaum geschoben werden – darum ist InsertionSort dann schnell (bestenfalls O(n)).",
    function(K){
      var R = [["Start", [15, 8, 23, 4, 42, 16], 1, -1, ""], ["8 einfügen", [8, 15, 23, 4, 42, 16], 2, 0, "vor 15"], ["23 einfügen", [8, 15, 23, 4, 42, 16], 3, 2, "bleibt hinten"],
        ["4 einfügen", [4, 8, 15, 23, 42, 16], 4, 0, "ganz nach vorn"], ["42 einfügen", [4, 8, 15, 23, 42, 16], 5, 4, "bleibt hinten"], ["16 einfügen", [4, 8, 15, 16, 23, 42], 6, 3, "zwischen 15 und 23"]];
      var s = "", X = seq(150, 50, 6);
      R.forEach(function(r, k){
        var y = 32 + k * 48;
        s += K.t(15, y, r[0], "s", { a: "start", s: 13, b: true });
        s += row(K, X, y, r[1], function(i){ return i === r[3] ? { c: "m", fill: "fm" } : i < r[2] ? { c: "a", fill: "fa" } : { c: "s" }; });
        if(r[2] < 6) s += K.line(X[r[2]] - 25, y - 20, X[r[2]] - 25, y + 20, "m", { w: 1.8, dash: "4 3" });
        if(r[4]) s += K.t(440, y, r[4], "s", { a: "start", s: 12.5 });
      });
      return K.svg(640, 290, s);
    });

  add("stabil", "Stabil oder nicht: Was passiert mit gleichen Schlüsseln?",
    "Zwei Elemente haben denselben Schlüssel 5 (5₁ kam zuerst, 5₂ danach). Ein <b>stabiles</b> Verfahren lässt sie in dieser Reihenfolge. SelectionSort tauscht 3 mit 5₁ – ein <b>weiter Sprung</b>, bei dem 5₁ über 5₂ hinweg nach hinten fliegt. Danach steht 5₂ vor 5₁: <b>nicht stabil</b>.",
    function(K){
      var s = K.panel(10, 10, 300, 280, "stabil (z. B. InsertionSort)", "a") + K.panel(330, 10, 300, 280, "SelectionSort", "m");
      [[10, [2, 0, 1], "a"], [330, [1, 2, 0], "m"]].forEach(function(P){
        var px = P[0], X = [px + 80, px + 150, px + 220], L = ["5₁", "5₂", "3"], C = ["a", "c4", "s"];
        s += K.t(px + 150, 48, "vorher", "s", { s: 12.5 });
        s += row(K, X, 80, L, function(i){ return { c: C[i], fill: i < 2 ? (i ? "fm" : "fa") : "p" }; }, { w: 48 });
        for(var i = 0; i < 3; i++) s += K.line(X[i], 98, X[P[1][i]], 182, C[i], { w: 1.6, dash: "4 4" });
        var out = []; for(i = 0; i < 3; i++) out[P[1][i]] = i;
        s += row(K, X, 200, out.map(function(i){ return L[i]; }), function(j){ var i = out[j]; return { c: C[i], fill: i < 2 ? (i ? "fm" : "fa") : "p" }; }, { w: 48 });
        s += K.t(px + 150, 232, "nachher", "s", { s: 12.5 });
      });
      s += K.t(160, 262, "5₁ bleibt vor 5₂ ✓", "a", { s: 13, b: true }) + K.t(480, 262, "5₂ steht jetzt vor 5₁ ✗", "m", { s: 13, b: true });
      return K.svg(640, 300, s);
    });

  add("linear", "Lineare Suche: eins nach dem anderen",
    "Gesucht ist 42. Man prüft ein Feld nach dem anderen, bis man es findet – hier nach <b>5 Vergleichen</b>. Im schlimmsten Fall (Wert ganz hinten oder gar nicht da) sind es <b>alle n</b> Felder, darum O(n). Dafür muss die Liste <b>nicht sortiert</b> sein.",
    function(K){
      var s = K.t(320, 30, "gesucht: 42", "a", { s: 14, b: true }), X = seq(120, 80, 6), V = [15, 8, 23, 4, 42, 16];
      for(var i = 0; i < 4; i++) s += K.path("M" + X[i] + " 100 Q" + (X[i] + 40) + " 66 " + (X[i + 1] - 4) + " 96", "c3", { w: 1.6 }) + K.dot(X[i + 1] - 4, 96, "c3", 3);
      s += row(K, X, 120, V, function(i){ return i === 4 ? { c: "m", fill: "fm" } : i < 4 ? { c: "s" } : { c: "f", tc: "f" }; }, { w: 50 });
      for(i = 0; i < 5; i++) s += K.t(X[i], 160, (i + 1) + ". " + (i === 4 ? "= ✓" : "≠"), i === 4 ? "m" : "s", { s: 13, b: true });
      s += K.t(320, 205, "schlimmstenfalls alle n Felder → O(n)", "s", { s: 13.5 });
      return K.svg(640, 225, s);
    });

  add("binaer", "Binäre Suche nach 70 in 15 sortierten Werten",
    "Man vergleicht immer mit der <b>Mitte</b> (rot) des noch möglichen Bereichs. Ist der gesuchte Wert größer, kann die ganze linke Hälfte weg, sonst die rechte. Grau = ausgeschlossen. Nach <b>4 Vergleichen</b> ist 70 gefunden – jeder Schritt halbiert den Bereich, daher O(log n). Funktioniert nur, weil die Liste <b>sortiert</b> ist.",
    function(K){
      var V = [3, 7, 12, 18, 25, 31, 40, 47, 56, 62, 70, 85, 91, 99, 105], X = seq(40, 40, 15), s = "";
      for(var i = 0; i < 15; i++) s += K.t(X[i], 20, String(i), "f", { s: 12 });
      var R = [[0, 14, 7, "lo 0, hi 14 → Mitte 7: 47 < 70 → rechte Hälfte"], [8, 14, 11, "lo 8, hi 14 → Mitte 11: 85 > 70 → linke Hälfte"], [8, 10, 9, "lo 8, hi 10 → Mitte 9: 62 < 70 → rechts"], [10, 10, 10, "lo = hi = 10 → 70 gefunden – 4 Vergleiche statt bis zu 15"]];
      R.forEach(function(r, k){
        var y = 50 + k * 62;
        s += row(K, X, y, V, function(j){ return j === r[2] ? { c: "m", fill: "fm" } : j >= r[0] && j <= r[1] ? { c: "a", fill: "fa" } : { c: "f", tc: "f" }; }, { w: 36, h: 30, s: 13 });
        s += K.t(22, y + 27, r[3], k === 3 ? "m" : "s", { a: "start", s: 12.5, b: k === 3 });
      });
      return K.svg(640, 285, s);
    });

  add("unsortiert", "Binäre Suche in einer unsortierten Liste geht schief",
    "Die binäre Suche verlässt sich darauf, dass links nur Kleineres und rechts nur Größeres steht. Hier ist das falsch: Gesucht wird 4, die Mitte ist 23, also wird nur links weitergesucht – dabei steht die 4 <b>rechts</b>. Ergebnis „nicht gefunden“, obwohl sie da ist. Deshalb setzen binäre, Fibonacci- und interpolatorische Suche eine <b>sortierte</b> Liste voraus.",
    function(K){
      var V = [15, 8, 23, 4, 42, 16], X = seq(120, 80, 6), s = K.t(320, 22, "gesucht: 4 in [15, 8, 23, 4, 42, 16]", "s", { s: 13.5, b: true });
      s += row(K, X, 80, V, function(i){ return i === 2 ? { c: "m", fill: "fm" } : i === 3 ? { c: "c3", dash: 1 } : { c: "a" }; }, { w: 50 });
      s += K.t(360, 50, "4 steht hier!", "c3", { a: "start", s: 12.5, b: true });
      s += K.t(320, 122, "Mitte 23: 4 < 23 → nur links weitersuchen", "s", { s: 13 });
      s += row(K, X, 170, V, function(i){ return i === 0 ? { c: "m", fill: "fm" } : i === 1 ? { c: "a" } : { c: "f", tc: "f" }; }, { w: 50 });
      s += K.t(320, 212, "Mitte 15: 4 < 15 → links nichts mehr → „nicht gefunden“ ✗", "m", { s: 13, b: true });
      s += K.t(320, 245, "ohne Sortierung stimmt „links kleiner, rechts größer“ nicht", "s", { s: 12.5 });
      return K.svg(640, 260, s);
    });

  add("fibo", "Fibonacci-Suche: Teilung nach Fibonacci-Zahlen",
    "Statt genau in der Mitte wird der Bereich im Verhältnis zweier <b>aufeinanderfolgender Fibonacci-Zahlen</b> geteilt: 13 = 8 + 5. Jedes Teilstück ist wieder eine Fibonacci-Zahl und lässt sich genauso weiter teilen (8 = 5 + 3, 5 = 3 + 2). Die Teilungspunkte ergeben sich durch bloßes <b>Addieren und Subtrahieren</b> – das Verhältnis ≈ 0,62 : 0,38 ist der Goldene Schnitt. Aufwand wie bei der binären Suche: O(log n).",
    function(K){
      var u = 36, x0 = 86, s = K.t(320, 22, "Bereich aus 13 Feldern", "s", { s: 13.5, b: true });
      function seg(a, b, y, lab, c, f){ return K.rect(x0 + a * u, y - 18, (b - a) * u, 36, c, { fill: f, rx: 2, w: 1.6 }) + K.t(x0 + (a + b) / 2 * u, y + 1, lab, c, { s: 16, b: true, halo: false }); }
      s += seg(0, 8, 80, "8", "a", "fa") + seg(8, 13, 80, "5", "c4", "fm");
      s += K.line(x0 + 6.5 * u, 54, x0 + 6.5 * u, 106, "m", { w: 1.8, dash: "5 4" }) + K.t(x0 + 6.5 * u, 44, "binär: Mitte 6,5", "m", { s: 12, b: true });
      s += K.arrow(x0 + 8 * u, 128, x0 + 8 * u, 102, "c3", { w: 1.8, head: 8 }) + K.t(x0 + 8 * u, 140, "Fibonacci: Teilung bei 8", "c3", { s: 12.5, b: true });
      s += seg(0, 5, 185, "5", "a", "fa") + seg(5, 8, 185, "3", "c4", "fm") + seg(8, 11, 185, "3", "a", "fa") + seg(11, 13, 185, "2", "c4", "fm");
      s += K.t(x0 + 4 * u, 220, "8 = 5 + 3", "s", { s: 13, b: true }) + K.t(x0 + 10.5 * u, 220, "5 = 3 + 2", "s", { s: 13, b: true });
      s += K.t(320, 252, "Fibonacci: 1, 1, 2, 3, 5, 8, 13, …  –  Verhältnis 8 : 5 ≈ 0,62 : 0,38", "s", { s: 12.5 });
      s += K.t(320, 274, "Teilungspunkte nur durch + und − bestimmt, keine Division", "s", { s: 12.5 });
      return K.svg(640, 290, s);
    });

  add("interpol", "Interpolationssuche: Position aus dem Wert schätzen",
    "Wie beim Nachschlagen im Telefonbuch: Wer „Müller“ sucht, schlägt nicht in der Mitte auf, sondern dort, wo M <b>ungefähr</b> liegen müsste. <b>Links</b> sind die Werte gleichmäßig verteilt – die Schätzung trifft 70 sofort. <b>Rechts</b> verzerrt ein Ausreißer (1000) die Gerade: Die Schätzung landet immer ganz links und rückt nur Feld um Feld vor – dann ist die Suche nicht besser als linear, O(n).",
    function(K){
      var s = K.f(320, 25, "pos = lo + (x − a[lo]) · (hi − lo) / (a[hi] − a[lo])", "a", { s: 13 });
      s += K.panel(10, 48, 300, 282, "gleichverteilt: 10, 20, …, 100", "a") + K.panel(330, 48, 300, 282, "ungleich: 1, 2, …, 9, 1000", "m");
      var M = K.map(50, 290, 25, 2.0);
      s += K.axes(50, 290, 5, 245, 210, 5, "Index", "") + K.t(60, 86, "Wert", "s", { a: "start", s: 13 });
      s += K.line(M.X(0), M.Y(10), M.X(9), M.Y(100), "f", { w: 1.2, dash: "4 4" });
      s += K.line(M.X(0), M.Y(70), M.X(6), M.Y(70), "m", { w: 1.4, dash: "5 4" }) + K.line(M.X(6), M.Y(70), M.X(6), M.Y(0), "m", { w: 1.4, dash: "5 4" });
      for(var i = 0; i < 10; i++) s += K.dot(M.X(i), M.Y(10 * (i + 1)), i === 6 ? "m" : "a", i === 6 ? 6 : 4.5);
      s += K.t(M.X(0) + 6, M.Y(70) - 11, "x = 70", "m", { a: "start", s: 12.5, b: true });
      s += K.t(70, 108, "pos = (70−10)·9/90 = 6", "s", { a: "start", s: 12.5 }) + K.t(70, 126, "1 Schritt ✓", "a", { a: "start", s: 12.5, b: true });
      var N = K.map(370, 290, 25, 0.2);
      s += K.axes(370, 290, 5, 245, 210, 5, "Index", "") + K.t(380, 86, "Wert", "s", { a: "start", s: 13 });
      s += K.line(N.X(0), N.Y(1), N.X(9), N.Y(1000), "f", { w: 1.2, dash: "4 4" });
      for(i = 0; i < 10; i++) s += K.dot(N.X(i), N.Y(i < 9 ? i + 1 : 1000), i === 8 ? "m" : "a", i === 8 ? 6 : 4.5);
      s += K.t(385, 110, "Suche 9: pos ≈ 0", "s", { a: "start", s: 12.5 }) + K.t(385, 130, "je Schritt nur +1", "s", { a: "start", s: 12.5 }) + K.t(385, 150, "≈ O(n)", "m", { a: "start", s: 13, b: true });
      s += K.t(N.X(9) - 10, N.Y(1000) + 2, "1000", "m", { a: "end", s: 12.5, b: true });
      return K.svg(640, 340, s);
    });

  /* ═════════ Kapitel 5: Bäume und Graphen ═════════ */

  add("baum", "Baum: Wurzel, innere Knoten, Blätter – Ordnung k und Höhe m",
    "Oben die <b>Wurzel</b> R, unten die <b>Blätter</b> (rot, ohne Söhne), dazwischen <b>innere Knoten</b>. Die <b>Ordnung k</b> ist die größte Zahl von Söhnen an einem Knoten – hier hat R drei, also k = 3. Die <b>Höhe m</b> ist der längste Weg von der Wurzel zu einem Blatt, gezählt in Kanten: R → A → D, also m = 2.",
    function(K){
      var N = { R: [300, 55, "R", "a", "fa"], A: [170, 140, "A"], B: [300, 140, "B", "m", "fm"], C: [430, 140, "C"], D: [120, 225, "D", "m", "fm"], E: [220, 225, "E", "m", "fm"], F: [430, 225, "F", "m", "fm"] };
      var s = tree(K, N, [["R", "A", "c3"], ["R", "B"], ["R", "C"], ["A", "D", "c3"], ["A", "E"], ["C", "F"]]);
      s += K.t(328, 40, "Wurzel", "a", { a: "start", s: 13, b: true }) + K.t(148, 110, "innerer Knoten", "s", { a: "end", s: 12.5 }) + K.t(458, 225, "Blatt", "m", { a: "start", s: 13, b: true });
      s += K.arrow(535, 140, 535, 57, "c3", { w: 1.6, head: 8 }) + K.arrow(535, 140, 535, 223, "c3", { w: 1.6, head: 8 }) + K.t(545, 140, "m = 2", "c3", { a: "start", s: 13.5, b: true });
      ["Niveau 0", "Niveau 1", "Niveau 2"].forEach(function(t, i){ s += K.t(35, 55 + i * 85, t, "f", { a: "start", s: 12 }); });
      s += K.t(320, 280, "Ordnung k = 3 (R hat 3 Söhne) · Höhe m = 2 (Pfad R → A → D)", "s", { s: 13 });
      return K.svg(640, 295, s);
    });

  add("baumgraph", "Baum = zusammenhängender Graph ohne Kreis",
    "Jeder Baum ist ein Graph – aber nicht jeder Graph ist ein Baum. Links schließt sich ein <b>Kreis</b> (b – a – c – b): kein Baum. In der Mitte <b>zerfällt</b> der Graph in zwei Teile: kein Baum. Rechts ist alles verbunden und kreisfrei – ein <b>Baum</b>.",
    function(K){
      var s = "", T = [["Kreis → kein Baum", "m"], ["zerfallen → kein Baum", "m"], ["Baum ✓", "a"]];
      var E = [[["a", "b", "m"], ["a", "c", "m"], ["b", "c", "m"], ["c", "d"]], [["a", "b"], ["c", "d"]], [["a", "b", "a"], ["a", "c", "a"], ["b", "d", "a"]]];
      var cap = ["b – a – c – b schließt sich", "c, d nicht erreichbar", "zusammenhängend + kreisfrei"];
      for(var p = 0; p < 3; p++){
        var px = 10 + p * 210;
        s += K.panel(px, 10, 200, 270, T[p][0], T[p][1]);
        var N = p === 1 ? { a: [px + 55, 80], b: [px + 55, 180], c: [px + 145, 80], d: [px + 145, 180] } : { a: [px + 100, 75], b: [px + 50, 150], c: [px + 150, 150], d: [px + (p === 2 ? 50 : 150), 220] };
        s += tree(K, N, E[p], { r: 17 });
        s += K.t(px + 100, 260, cap[p], T[p][1] === "m" ? "s" : "a", { s: 12.5 });
      }
      return K.svg(640, 290, s);
    });

  add("blatt", "Maximale Blattzahl: kᵐ",
    "Ist jeder Knoten voll besetzt, hat jedes Niveau <b>k-mal so viele Knoten</b> wie das darüber: 1, k, k², k³, … Auf Niveau m sind das also höchstens <b>kᵐ</b> Blätter. Links der Binärbaum (k = 2): 2³ = 8. Rechts k = 3: 3² = 9. Für k = 3 und m = 4 (Aufgabe C.28) wären es 3⁴ = 81.",
    function(K){
      var s = K.panel(10, 10, 305, 275, "Binärbaum: k = 2, Höhe 3", "a") + K.panel(335, 10, 305, 275, "Ordnung k = 3, Höhe 2", "c4");
      var lv = [], i, j;
      lv[3] = seq(30, 30, 8);
      for(var l = 2; l >= 0; l--){ lv[l] = []; for(i = 0; i < lv[l + 1].length; i += 2) lv[l].push((lv[l + 1][i] + lv[l + 1][i + 1]) / 2); }
      var Y = [65, 125, 185, 245];
      for(l = 0; l < 3; l++) for(i = 0; i < lv[l].length; i++) for(j = 0; j < 2; j++) s += K.line(lv[l][i], Y[l], lv[l + 1][2 * i + j], Y[l + 1], "s", { w: 1.4 });
      for(l = 0; l <= 3; l++){ lv[l].forEach(function(x){ s += K.circ(x, Y[l], 7, l === 3 ? "m" : "a", { fill: l === 3 ? "fm" : "fa", w: 1.8 }); }); s += K.t(262, Y[l], ["1", "2", "4", "8 = 2³"][l], l === 3 ? "m" : "s", { a: "start", s: 13, b: true }); }
      var L2 = seq(355, 26, 9), L1 = [381, 459, 537], Z = [65, 155, 245];
      L1.forEach(function(x, i){ s += K.line(459, Z[0], x, Z[1], "s", { w: 1.4 }); for(var j = 0; j < 3; j++) s += K.line(x, Z[1], L2[3 * i + j], Z[2], "s", { w: 1.4 }); });
      s += K.circ(459, Z[0], 7, "c4", { fill: "fa", w: 1.8 });
      L1.forEach(function(x){ s += K.circ(x, Z[1], 7, "c4", { fill: "fa", w: 1.8 }); });
      L2.forEach(function(x){ s += K.circ(x, Z[2], 7, "m", { fill: "fm", w: 1.8 }); });
      s += K.t(585, Z[0], "1", "s", { a: "start", s: 13, b: true }) + K.t(585, Z[1], "3", "s", { a: "start", s: 13, b: true }) + K.t(585, Z[2], "9 = 3²", "m", { a: "start", s: 13, b: true });
      s += K.t(325, 305, "jedes Niveau k-mal so breit ⇒ Niveau m: höchstens kᵐ Blätter (k = 3, m = 4: 3⁴ = 81)", "s", { s: 12.5 });
      return K.svg(650, 320, s);
    });

  var BT = { a: [320, 60, "15"], b: [180, 140, "8"], c: [460, 140, "20"], d: [110, 220, "4"], e: [250, 220, "12"], f: [390, 220, "17"], g: [530, 220, "25"] };
  var BE = [["a", "b"], ["a", "c"], ["b", "d"], ["b", "e"], ["c", "f"], ["c", "g"]];

  add("bst", "Binärer Suchbaum: links kleiner, rechts größer",
    "An <b>jedem</b> Knoten gilt: Im ganzen linken Teilbaum stehen nur kleinere Werte, im rechten nur größere. Bei der Wurzel 15: links 4, 8, 12 – alle kleiner; rechts 17, 20, 25 – alle größer. Dieselbe Regel gilt eine Ebene tiefer bei 8 und bei 20. Das ist der Baum aus Aufgabe C.27.",
    function(K){
      var s = K.rect(70, 108, 220, 140, "a", { fill: "fa", rx: 14, dash: "6 4" }) + K.rect(350, 108, 220, 140, "c4", { fill: "fm", rx: 14, dash: "6 4" });
      var N = {}; for(var k in BT) N[k] = [BT[k][0], BT[k][1], BT[k][2], k === "a" ? "m" : "a"];
      s += tree(K, N, BE);
      s += K.t(180, 270, "alle < 15", "a", { s: 14, b: true }) + K.t(460, 270, "alle > 15", "c4", { s: 14, b: true });
      s += K.t(320, 298, "gilt an jedem Knoten: 4 < 8 < 12 und 17 < 20 < 25", "s", { s: 13 });
      return K.svg(640, 310, s);
    });

  function trav(K, kind, order, seqTxt, head){
    var N = {}; for(var k in BT) N[k] = [BT[k][0], BT[k][1], BT[k][2], "a"];
    var s = K.t(320, 20, head, "s", { s: 13, b: true }) + tree(K, N, BE);
    order.forEach(function(k, i){
      var q = BT[k], bx = kind === "pre" ? q[0] - 32 : kind === "post" ? q[0] + 32 : q[0], by = kind === "in" ? q[1] + 32 : q[1];
      s += K.circ(bx, by, 11, "c3", { fill: "p", w: 1.8 }) + K.t(bx, by + 1, String(i + 1), "c3", { s: 12, b: true, halo: false });
    });
    return s + K.f(320, 285, seqTxt, "m", { fill: "fm" });
  }
  add("preorder", "Preorder (W L R): 15, 8, 4, 12, 20, 17, 25",
    "Die orangen Nummern geben die Besuchsreihenfolge an. Bei <b>Preorder</b> wird ein Knoten <b>zuerst</b> notiert, dann sein linker, dann sein rechter Teilbaum. Merkbild: Umrundet man den Baum links herum, schreibt man jeden Knoten auf, sobald man <b>links an ihm vorbeikommt</b> – deshalb sitzen die Nummern links.",
    function(K){ return K.svg(640, 305, trav(K, "pre", ["a", "b", "d", "e", "c", "f", "g"], "15, 8, 4, 12, 20, 17, 25", "Wurzel → links → rechts: Knoten vor seinen Teilbäumen")); });
  add("inorder", "Inorder (L W R): 4, 8, 12, 15, 17, 20, 25 – sortiert",
    "Bei <b>Inorder</b> kommt erst der ganze linke Teilbaum, <b>dann</b> der Knoten, dann der rechte. Beim Umrunden notiert man den Knoten, wenn man <b>unter ihm</b> durchläuft. Weil im Suchbaum links das Kleinere und rechts das Größere steht, kommt die Folge <b>sortiert</b> heraus.",
    function(K){ return K.svg(640, 305, trav(K, "in", ["d", "b", "e", "a", "f", "c", "g"], "4, 8, 12, 15, 17, 20, 25", "links → Wurzel → rechts: Knoten zwischen seinen Teilbäumen")); });
  add("postorder", "Postorder (L R W): 4, 12, 8, 17, 25, 20, 15",
    "Bei <b>Postorder</b> werden erst beide Teilbäume erledigt, der Knoten selbst kommt <b>zuletzt</b>. Beim Umrunden notiert man ihn, wenn man <b>rechts an ihm hochgeht</b>. Folge: Die Wurzel 15 steht immer ganz am Ende.",
    function(K){ return K.svg(640, 305, trav(K, "post", ["d", "e", "b", "f", "g", "c", "a"], "4, 12, 8, 17, 25, 20, 15", "links → rechts → Wurzel: Knoten nach seinen Teilbäumen")); });

  add("inbst", "Inorder ist nur bei einem Suchbaum sortiert",
    "Beide Bäume haben dieselbe Form und dieselben Zahlen. Links ist es ein <b>Suchbaum</b> – Inorder liefert eine sortierte Folge. Rechts sind 8 und 20 vertauscht: 20 steht links von 15, verletzt also die Suchbaum-Regel – dieselbe Inorder-Traversierung liefert jetzt <b>Durcheinander</b>.",
    function(K){
      var s = K.panel(10, 10, 300, 270, "Suchbaum", "a") + K.panel(330, 10, 300, 270, "kein Suchbaum", "m");
      [[10, ["15", "8", "20"]], [330, ["15", "20", "8"]]].forEach(function(P, p){
        var px = P[0], N = { a: [px + 150, 70, P[1][0]], b: [px + 80, 140, P[1][1], p ? "m" : "a", p ? "fm" : "p"], c: [px + 220, 140, P[1][2], p ? "m" : "a", p ? "fm" : "p"],
          d: [px + 40, 210, "4"], e: [px + 115, 210, "12"], f: [px + 185, 210, "17"], g: [px + 260, 210, "25"] };
        s += tree(K, N, BE, { r: 17, s: 13 });
      });
      s += K.t(160, 255, "Inorder: 4, 8, 12, 15, 17, 20, 25 ✓", "a", { s: 12.5, b: true });
      s += K.t(480, 255, "Inorder: 4, 20, 12, 15, 17, 8, 25 ✗", "m", { s: 12.5, b: true });
      return K.svg(640, 290, s);
    });

  function g4(px){ return { 1: [px + 70, 85], 2: [px + 230, 85], 3: [px + 70, 195], 4: [px + 230, 195] }; }
  function drawG(K, P, E, dir, hi){
    var s = "";
    E.forEach(function(e){ var A = P[e[0]], B = P[e[1]], h = hi && hi[0] === e[0] && hi[1] === e[1]; s += K.edge(A[0], A[1], B[0], B[1], { r1: 20, r2: 20, c: h ? "m" : "a", noarrow: !dir, w: h ? 2.6 : 2 }); });
    for(var k in P) s += K.node(P[k][0], P[k][1], k, "i", { r: 20 });
    return s;
  }
  var CE = [[1, 2], [1, 3], [2, 4], [3, 2], [4, 3]];

  add("graph", "Graph G = (V, E): ungerichtet und gerichtet",
    "Ein Graph besteht nur aus zwei Mengen: den <b>Knoten V</b> und den <b>Kanten E</b>. Ungerichtet (links) ist eine Kante eine einfache Verbindung {x, y} – man kann sie in beide Richtungen gehen. Gerichtet (rechts, Graph aus Aufgabe C.8) ist jede Kante ein <b>Pfeil (x, y)</b> von x nach y – 3 → 2 erlaubt nicht automatisch 2 → 3.",
    function(K){
      var s = K.panel(10, 10, 300, 280, "ungerichtet: Linien", "a") + K.panel(330, 10, 300, 280, "gerichtet: Pfeile (C.8)", "c4");
      s += drawG(K, g4(10), [[1, 2], [1, 3], [2, 3], [2, 4], [3, 4]], false);
      s += drawG(K, g4(330), CE, true);
      s += K.t(160, 245, "V = {1, 2, 3, 4}", "s", { s: 12.5 }) + K.t(160, 266, "E = {{1,2}, {1,3}, {2,3}, {2,4}, {3,4}}", "s", { s: 12.5 });
      s += K.t(480, 245, "V = {1, 2, 3, 4}", "s", { s: 12.5 }) + K.t(480, 266, "E = {(1,2), (1,3), (2,4), (3,2), (4,3)}", "s", { s: 12.5 });
      return K.svg(640, 300, s);
    });

  add("adj", "Adjazenzmatrix: jede Kante i → j wird zur 1 in Zeile i, Spalte j",
    "Links der gerichtete Graph aus Aufgabe C.8, rechts seine Matrix. Jede <b>Kante i → j</b> setzt eine <b>1 in Zeile i, Spalte j</b>; alle anderen Felder sind 0. Beispiel (rot): Die Kante 3 → 2 steht in Zeile 3, Spalte 2. Die Matrix hat n × n = 4 × 4 Felder.",
    function(K){
      var s = drawG(K, g4(0), CE, true, [3, 2]), A = [[0, 1, 1, 0], [0, 0, 0, 1], [0, 1, 0, 0], [0, 0, 1, 0]];
      s += K.t(468, 30, "nach (Spalte j)", "s", { s: 12.5, b: true }) + K.t(332, 158, "von", "s", { a: "end", s: 12.5, b: true }) + K.t(332, 176, "(Zeile i)", "s", { a: "end", s: 12 });
      for(var i = 0; i < 4; i++){
        s += K.t(402 + i * 44, 54, String(i + 1), "s", { s: 13, b: true }) + K.t(362, 92 + i * 44, String(i + 1), "s", { s: 13, b: true });
        for(var j = 0; j < 4; j++){
          var h = i === 2 && j === 1, one = A[i][j] === 1;
          s += K.cell(402 + j * 44, 92 + i * 44, String(A[i][j]), h ? "m" : one ? "a" : "f", { w: 44, h: 44, rx: 0, fill: h ? "fm" : one ? "fa" : "p", tc: one ? "i" : "f" });
        }
      }
      s += K.t(320, 285, "Kante 3 → 2  ⇒  A[3][2] = 1", "m", { s: 13.5, b: true });
      return K.svg(640, 300, s);
    });

  add("adjsym", "Ungerichtet → symmetrische Matrix, gerichtet → im Allgemeinen nicht",
    "Bei einer ungerichteten Kante zwischen 1 und 2 gilt die Verbindung in beide Richtungen – es stehen also A[1][2] <b>und</b> A[2][1] auf 1. Die Matrix ist an der Diagonale <b>gespiegelt</b> (symmetrisch). Beim Pfeil 1 → 2 steht nur A[1][2] = 1, A[2][1] bleibt 0 – <b>nicht symmetrisch</b>.",
    function(K){
      var s = K.panel(10, 10, 300, 250, "ungerichtet", "a") + K.panel(330, 10, 300, 250, "gerichtet", "c4");
      [[10, [[0, 1, 0], [1, 0, 1], [0, 1, 0]], false], [330, [[0, 1, 0], [0, 0, 1], [0, 0, 0]], true]].forEach(function(P){
        var px = P[0], N = { 1: [px + 40, 90], 2: [px + 120, 90], 3: [px + 80, 165] };
        s += K.edge(N[1][0], N[1][1], N[2][0], N[2][1], { r1: 18, r2: 18, c: "a", noarrow: !P[2], w: 2 }) + K.edge(N[2][0], N[2][1], N[3][0], N[3][1], { r1: 18, r2: 18, c: "a", noarrow: !P[2], w: 2 });
        for(var k in N) s += K.node(N[k][0], N[k][1], k, "i", { r: 18 });
        for(var i = 0; i < 3; i++){
          s += K.t(px + 191 + i * 32, 48, String(i + 1), "s", { s: 12.5, b: true }) + K.t(px + 162, 76 + i * 32, String(i + 1), "s", { s: 12.5, b: true });
          for(var j = 0; j < 3; j++){ var one = P[1][i][j] === 1; if(i !== j) s += K.cell(px + 191 + j * 32, 76 + i * 32, String(P[1][i][j]), one ? "a" : "f", { w: 32, h: 32, rx: 0, s: 13, fill: one ? "fa" : "p", tc: one ? "i" : "f" }); }
        }
        for(i = 0; i < 3; i++) s += K.cell(px + 191 + i * 32, 76 + i * 32, "0", "c3", { w: 32, h: 32, rx: 0, s: 13, bw: 2.2, tc: "f" });
      });
      s += K.t(160, 205, "A[i][j] = A[j][i]", "a", { s: 13, b: true }) + K.t(160, 228, "Spiegelbild an der Diagonale (orange)", "s", { s: 12.5 });
      s += K.t(480, 205, "A[1][2] = 1, aber A[2][1] = 0", "c4", { s: 13, b: true }) + K.t(480, 228, "nicht symmetrisch", "s", { s: 12.5 });
      return K.svg(640, 270, s);
    });

  /* ═════════ Formelsammlung ═════════ */

  add("hoehe", "Höhe eines vollständigen Binärbaums: ⌊log₂ n⌋",
    "Ein vollständiger Binärbaum wird Niveau für Niveau von links aufgefüllt; jedes Niveau fasst doppelt so viele Knoten wie das vorige (1, 2, 4, 8). Mit <b>n = 12</b> Knoten sind die Niveaus 0 bis 2 voll (7 Knoten), Niveau 3 ist angefangen. Die Höhe ist also 3 – und tatsächlich ist <b>log₂ 12 ≈ 3,58</b>, abgerundet 3.",
    function(K){
      var s = "", Y = [45, 110, 175, 240], W = 480, x = function(l, j){ return 30 + (j + 0.5) * W / Math.pow(2, l); };
      for(var n = 2; n <= 12; n++){ var l = Math.floor(Math.log(n) / Math.LN2), j = n - Math.pow(2, l), pl = l - 1, pj = Math.floor(n / 2) - Math.pow(2, pl); s += K.line(x(pl, pj), Y[pl] + 14, x(l, j), Y[l] - 14, "s", { w: 1.4 }); }
      for(j = 5; j < 8; j++) s += K.circ(x(3, j), Y[3], 14, "f", { dash: "4 4" });
      for(n = 1; n <= 12; n++){ l = Math.floor(Math.log(n) / Math.LN2); j = n - Math.pow(2, l); s += K.node(x(l, j), Y[l], String(n), l === 3 ? "c3" : "a", { r: 14, s: 12, fill: l === 3 ? "fm" : "p" }); }
      ["Niveau 0: 1", "Niveau 1: 2", "Niveau 2: 4", "Niveau 3: 5 von 8"].forEach(function(t, i){ s += K.t(515, Y[i], t, i === 3 ? "c3" : "s", { a: "start", s: 12.5, b: i === 3 }); });
      s += K.f(320, 285, "n = 12:  log₂ 12 ≈ 3,58  →  ⌊3,58⌋ = 3 = Höhe", "a");
      return K.svg(650, 305, s);
    });

  add("quick", "QuickSort: um ein Pivot zerlegen, dann die Teile sortieren",
    "Ein <b>Pivot</b> (rot, hier das letzte Element) wird gewählt; alles Kleinere wandert nach links, alles Größere nach rechts. Danach steht das Pivot <b>endgültig</b> an seinem Platz (blau), und links und rechts wird genauso weiterverfahren. Gute Pivots halbieren den Bereich → O(n log n); ist das Pivot immer das kleinste oder größte Element (z. B. bei schon sortierter Eingabe), schrumpft der Bereich nur um 1 → O(n²).",
    function(K){
      var X = seq(60, 50, 6), s = "";
      var R = [[[15, 8, 23, 4, 42, 16], [5], [], ["Pivot 16 (letztes Element)", "kleinere links, größere rechts"]],
        [[15, 8, 4, 16, 42, 23], [2, 5], [3], ["16 sitzt endgültig", "links Pivot 4, rechts Pivot 23"]],
        [[4, 8, 15, 16, 23, 42], [], [0, 3, 4], ["4 und 23 sitzen; [8, 15] → 15 bleibt", "→ sortiert"]]];
      R.forEach(function(r, k){
        var y = 45 + k * 75;
        s += row(K, X, y, r[0], function(i){ return r[1].indexOf(i) >= 0 ? { c: "m", fill: "fm" } : r[2].indexOf(i) >= 0 || k === 2 ? { c: "a", fill: "fa" } : { c: "s" }; });
        s += K.t(360, y - 9, r[3][0], "s", { a: "start", s: 12.5, b: true }) + K.t(360, y + 11, r[3][1], "s", { a: "start", s: 12.5 });
        if(k < 2) s += K.arrow(185, y + 20, 185, y + 52, "f", { w: 1.4, head: 8 });
      });
      s += K.line(38, 145, 132, 145, "c4", { w: 2 }) + K.line(238, 145, 332, 145, "c4", { w: 2 });
      s += K.t(320, 240, "gutes Pivot halbiert → log n Ebenen → O(n log n)", "a", { s: 13, b: true });
      s += K.t(320, 264, "Pivot immer Extremwert (z. B. sortierte Eingabe) → O(n²)", "m", { s: 13, b: true });
      return K.svg(640, 280, s);
    });

  add("merge", "MergeSort: halbieren bis zu Einzelteilen, dann sortiert zusammenmischen",
    "Oben wird die Liste <b>immer wieder halbiert</b>, bis nur Einzelelemente übrig sind – die sind trivial sortiert. Unten werden je zwei sortierte Teile zu einem sortierten Teil <b>gemischt</b> (man vergleicht nur die vordersten Elemente). Das ergibt log₂ n Ebenen mit je n Arbeit – <b>O(n log n)</b> in jedem Fall. Zum Mischen braucht man ein Hilfsfeld, daher <b>nicht in-situ</b>.",
    function(K){
      var R = [[[15, 8, 23, 4, 42, 16]], [[15, 8, 23], [4, 42, 16]], [[15], [8, 23], [4], [42, 16]], [[15], [8], [23], [4], [42], [16]], [[15], [8, 23], [4], [16, 42]], [[8, 15, 23], [4, 16, 42]], [[4, 8, 15, 16, 23, 42]]];
      var s = "";
      R.forEach(function(gr, r){
        var y = 28 + r * 46, tot = 0; gr.forEach(function(g){ tot += g.length * 36; }); tot += (gr.length - 1) * 16 - 2;
        var x = 320 - tot / 2 + 17, c = r < 3 ? "a" : r === 3 ? "s" : "c4";
        gr.forEach(function(g){ g.forEach(function(v){ s += K.cell(x, y, String(v), c, { w: 34, h: 28, s: 13, fill: r === 6 ? "fa" : "p" }); x += 36; }); x += 16; });
      });
      s += K.t(20, 74, "teilen", "a", { a: "start", s: 13.5, b: true }) + K.arrow(40, 86, 40, 140, "a", { w: 1.6, head: 8 });
      s += K.t(20, 212, "mischen", "c4", { a: "start", s: 13.5, b: true }) + K.arrow(40, 224, 40, 290, "c4", { w: 1.6, head: 8 });
      s += lines(K, 490, 120, ["log₂ n Ebenen", "je Ebene n Schritte", "→ O(n log n)"], "s", { s: 12.5 });
      s += lines(K, 490, 200, ["Hilfsfeld nötig", "→ nicht in-situ"], "m", { s: 12.5 });
      return K.svg(640, 320, s);
    });

  add("heap", "HeapSort: der Max-Heap als Baum und als Array",
    "Ein <b>Max-Heap</b> ist ein vollständiger Binärbaum, in dem jeder Elternknoten <b>mindestens so groß</b> ist wie seine Kinder – das Maximum steht oben. Gespeichert wird er platzsparend als Array: Die Kinder von Feld i liegen in <b>2i + 1 und 2i + 2</b>. Hier aus [15, 8, 23, 4, 42, 16] aufgebaut. HeapSort tauscht immer die Wurzel ans Ende und repariert den Rest – n-mal je O(log n).",
    function(K){
      var N = { a: [170, 50, "42", "m", "fm"], b: [90, 130, "15"], c: [250, 130, "23"], d: [50, 210, "4"], e: [130, 210, "8"], f: [210, 210, "16"] };
      var s = tree(K, N, [["a", "b"], ["a", "c"], ["b", "d"], ["b", "e"], ["c", "f"]], { r: 18 });
      [[198, 46, "0"], [60, 124, "1"], [280, 124, "2"], [22, 204, "3"], [158, 204, "4"], [182, 204, "5"]].forEach(function(q){ s += K.t(q[0], q[1], q[2], "f", { s: 12 }); });
      var X = seq(340, 46, 6), V = [42, 15, 23, 4, 8, 16];
      s += K.t(455, 40, "Eltern ≥ Kinder", "a", { s: 13, b: true });
      for(var i = 0; i < 6; i++) s += K.t(X[i], 82, String(i), "f", { s: 12 });
      s += row(K, X, 110, V, function(i){ return i === 0 ? { c: "m", fill: "fm" } : i === 1 ? { c: "c4" } : i === 3 || i === 4 ? { c: "c3", fill: "fm" } : {}; }, { w: 42 });
      s += K.path("M386 128 Q432 175 478 130", "c3", { w: 1.6 }) + K.path("M386 128 Q455 190 524 130", "c3", { w: 1.6 });
      s += K.t(455, 200, "Kinder von i: 2i + 1 und 2i + 2", "c3", { s: 12.5, b: true });
      s += K.t(20, 258, "HeapSort: Wurzel (Maximum) mit dem letzten Feld tauschen, Heap um 1 kürzen,", "s", { a: "start", s: 12.5 });
      s += K.t(20, 280, "neue Wurzel nach unten versickern lassen – n-mal je O(log n) ⇒ O(n log n)", "s", { a: "start", s: 12.5 });
      return K.svg(640, 295, s);
    });

  add("radix", "RadixSort: erst nach der Einer-, dann nach der Zehnerstelle verteilen",
    "Statt zu vergleichen, werden die Zahlen in <b>10 Fächer</b> (Ziffern 0–9) verteilt – zuerst nach der Einerstelle, dann der Reihe nach wieder eingesammelt und nach der Zehnerstelle neu verteilt. Weil jedes Fach die Reihenfolge seiner Einwürfe behält (<b>stabil</b>), bleibt die Ordnung der Einer erhalten. Bei fester Stellenzahl ist das O(n) – braucht aber Platz für die Fächer.",
    function(K){
      var s = "", P = [["Durchlauf 1: nach der Einerstelle", { 2: ["42"], 3: ["23"], 4: ["04"], 5: ["15"], 6: ["16"], 8: ["08"] }, "eingesammelt: 42, 23, 04, 15, 16, 08"],
        ["Durchlauf 2: nach der Zehnerstelle (stabil!)", { 0: ["04", "08"], 1: ["15", "16"], 2: ["23"], 4: ["42"] }, "Ergebnis: 04, 08, 15, 16, 23, 42 ✓"]];
      P.forEach(function(p, k){
        var oy = k * 160;
        s += K.panel(10, 10 + oy, 620, 150, p[0], k ? "c4" : "a");
        for(var d = 0; d <= 9; d++){
          var x = 60 + d * 58, it = p[1][d] || [];
          s += K.rect(x - 23, 40 + oy, 46, 58, "s", { fill: it.length ? "fa" : "p", rx: 3 });
          it.forEach(function(v, j){ s += K.t(x, 86 + oy - j * 22, v, "i", { s: 13.5, b: true, halo: false }); });
          s += K.t(x, 110 + oy, String(d), "f", { s: 12.5, b: true });
        }
        s += K.t(320, 136 + oy, p[2], k ? "m" : "s", { s: 13, b: true });
      });
      return K.svg(640, 330, s);
    });
})();
