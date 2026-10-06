/* Skizzen zu MAI06 – Vektoralgebra und Analytische Geometrie.
   Jede Skizze: t = Titel, c = Lesehilfe (HTML), svg = function(K) → SVG-String (K = window.SK). */
(function(){
  "use strict";
  var S = window.ITI_SKETCHES = window.ITI_SKETCHES || {};
  function add(id, t, c, f){ S["mai06-" + id] = { t: t, c: c, svg: f }; }
  function lines(K, x, y, arr, c, o){ o = o || {}; var s = ""; for(var i = 0; i < arr.length; i++) s += K.t(x, y + i * (o.lh || 20), arr[i], c || "s", { a: o.a || "start", s: o.s || 13.5, b: o.b }); return s; }
  function at(P, p){ return P(p[0], p[1], p[2]); }
  function plus(p, q, k){ k = k === undefined ? 1 : k; return [p[0] + k * q[0], p[1] + k * q[1], p[2] + k * q[2]]; }

  /* ═════════ Kapitel 1 ═════════ */

  add("vektor", "Vektor = gerichtete Strecke · wann sind Vektoren gleich?",
    "Alle drei <b>blauen Pfeile</b> sind <b>derselbe Vektor a</b>: gleiche Länge, gleiche Richtung – nur verschoben. Wo ein Pfeil anfängt, spielt keine Rolle. Der rote Pfeil b ist genauso lang, zeigt aber in eine andere Richtung – also ist <b>b ≠ a</b>.",
    function(K){
      var s = "";
      s += K.arrow(68, 276, 230, 297, "f", { w: 1.3, dash: "5 5", head: 9 }) + K.t(150, 304, "verschieben", "f", { s: 12 });
      s += K.arrow(250, 296, 410, 254, "f", { w: 1.3, dash: "5 5", head: 9 }) + K.t(318, 296, "verschieben", "f", { s: 12 });
      s += K.arrow(60, 270, 220, 120, "a", { w: 3.2 }) + K.arrow(240, 300, 400, 150, "a") + K.arrow(420, 250, 580, 100, "a");
      s += K.dot(60, 270) + K.dot(220, 120) + K.v(46, 284, "A", "i", { s: 17 }) + K.v(234, 104, "E", "i", { s: 17 });
      s += K.vl(60, 270, 220, 120, "a", "a", 18) + K.vl(240, 300, 400, 150, "a", "a", 18) + K.vl(420, 250, 580, 100, "a", "a", 18);
      s += K.arrow(400, 328, 619, 328, "m") + K.t(619, 308, "b ≠ a  (gleich lang, andere Richtung)", "m", { a: "end", s: 13 });
      return K.svg(640, 345, s);
    });

  add("repr", "Repräsentanten und Ortsvektor",
    "Jeder dieser Pfeile ist ein <b>Repräsentant</b> desselben Vektors – durch Verschieben entsteht kein neuer Vektor. Der Repräsentant, der im <b>Ursprung O</b> beginnt, heißt <b>Ortsvektor</b> (rot). Seine Spitze ist ein Punkt – deshalb beschreiben Ortsvektoren Punkte.",
    function(K){
      var s = K.axes(70, 300, 20, 550, 270, 15), d = [130, -90];
      [[230, 270], [400, 290], [300, 170], [470, 170], [150, 150]].forEach(function(p){ s += K.arrow(p[0], p[1], p[0] + d[0], p[1] + d[1], "a", { w: 2.2 }); });
      s += K.arrow(70, 300, 200, 210, "m", { w: 3.4 }) + K.t(150, 274, "Ortsvektor", "m", { a: "start", s: 14, b: true });
      s += K.t(58, 314, "O", "i", { it: true, b: true });
      s += K.t(610, 32, "alle Pfeile = derselbe Vektor, nur andere Repräsentanten", "s", { a: "end", s: 13 });
      return K.svg(640, 330, s);
    });

  add("ortsv", "Ortsvektor eines Punktes",
    "Der Ortsvektor <b>p</b> führt vom Ursprung O zum Punkt P. Die <b>Koordinaten des Punktes</b> sind genau die <b>Komponenten des Ortsvektors</b>: P(4 | 3) ⟷ p = (4, 3)ᵀ.",
    function(K){
      var s = K.grid(80, 50, 9, 5, 50) + K.axes(80, 300, 10, 470, 265, 10) + K.ticks(80, 300, 50, 8, 4, true);
      s += K.line(280, 150, 280, 300, "f", { dash: "5 5" }) + K.line(280, 150, 80, 150, "f", { dash: "5 5" });
      s += K.arrow(80, 300, 280, 150, "m", { w: 3.2 }) + K.dot(280, 150, "i", 5);
      s += K.vl(80, 300, 280, 150, "p", "m", 18) + K.t(294, 134, "P(4 | 3)", "i", { a: "start", s: 15, b: true });
      s += K.t(68, 314, "O", "i", { it: true, b: true });
      s += K.f(440, 220, "p = OP = (4, 3)ᵀ", "m", { fill: "fm" });
      return K.svg(580, 330, s);
    });

  add("einheit", "Einheitsvektor eₐ = a / |a|",
    "Teilt man a durch seine Länge |a|, schrumpft (oder wächst) er auf die <b>Länge 1</b> – die Richtung bleibt. Seine Spitze liegt dann genau auf dem <b>Einheitskreis</b> (Radius 1).",
    function(K){
      var s = "", O = [180, 245];
      s += K.circ(O[0], O[1], 90, "f", { dash: "4 5" }) + K.t(O[0], O[1] + 108, "Einheitskreis (Radius 1)", "f", { s: 12 });
      s += K.arrow(O[0], O[1], 418, 118, "a", { w: 2.6 }) + K.vl(O[0], O[1], 418, 118, "a", "a", 18, { at: 0.72 });
      s += K.arrow(O[0], O[1], 259.5, 202.7, "m", { w: 3.6 }) + K.v(282, 222, "eₐ", "m");
      s += K.dot(O[0], O[1]) + K.t(O[0] - 14, O[1] + 4, "O", "i", { it: true, b: true });
      s += K.f(470, 285, "eₐ = a / |a|", "m", { fill: "fm" }) + K.t(470, 316, "gleiche Richtung, Länge 1", "s", { s: 13 });
      return K.svg(600, 360, s);
    });

  add("basis", "Standard-Einheitsvektoren e₁, e₂, e₃",
    "e₁, e₂, e₃ haben Länge 1 und zeigen entlang der x-, y- und z-Achse. Jeder Vektor zerfällt in drei Achsenstücke: <b>a = a₁·e₁ + a₂·e₂ + a₃·e₃</b> – die Faktoren a₁, a₂, a₃ sind die Koordinaten.",
    function(K){
      var P = K.p3(250, 250, 55, 0.8), s = K.axes3(P, 3.6, 6, 4);
      var A1 = P(3, 0, 0), A2 = P(3, 4, 0), A = P(3, 4, 3), O = P(0, 0, 0);
      s += K.line(O[0], O[1], A1[0], A1[1], "c3", { w: 3 }) + K.line(A1[0], A1[1], A2[0], A2[1], "c4", { w: 3 }) + K.line(A2[0], A2[1], A[0], A[1], "a", { w: 3, dash: "7 5" });
      s += K.t((O[0] + A1[0]) / 2 - 10, (O[1] + A1[1]) / 2 - 4, "a₁·e₁", "c3", { a: "end", s: 14, b: true }) + K.t((A1[0] + A2[0]) / 2, A1[1] + 18, "a₂·e₂", "c4", { s: 14, b: true });
      s += K.t(A2[0] + 10, (A2[1] + A[1]) / 2, "a₃·e₃", "a", { a: "start", s: 14, b: true });
      s += K.arrow(O[0], O[1], A[0], A[1], "m", { w: 3 }) + K.v((O[0] + A[0]) / 2 - 12, (O[1] + A[1]) / 2 - 14, "a", "m");
      s += K.a3(P, [0, 0, 0], [1, 0, 0], "i", { w: 3.4 }) + K.a3(P, [0, 0, 0], [0, 1, 0], "i", { w: 3.4 }) + K.a3(P, [0, 0, 0], [0, 0, 1], "i", { w: 3.4 });
      var e1 = P(1, 0, 0), e2 = P(0, 1, 0), e3 = P(0, 0, 1);
      s += K.v(e1[0] + 22, e1[1] + 8, "e₁", "i", { s: 16 }) + K.v(e2[0] - 4, e2[1] - 14, "e₂", "i", { s: 16 }) + K.v(e3[0] - 18, e3[1] + 6, "e₃", "i", { s: 16 });
      s += K.dot(A[0], A[1], "m");
      s += K.f(440, 40, "a = a₁e₁ + a₂e₂ + a₃e₃", "m", { fill: "fm" });
      return K.svg(600, 370, s);
    });

  add("neg", "Negativer Vektor −a (antiparallel)",
    "Für <b>−a</b> werden Anfangs- und Endpunkt <b>vertauscht</b>: gleiche Länge, genau entgegengesetzte Richtung. Solche Vektoren heißen <b>antiparallel</b> – sie sind nicht gleich. Zusammen ergeben sie den Nullvektor.",
    function(K){
      var s = K.arrow(70, 250, 290, 100, "a", { w: 3 }) + K.arrow(340, 140, 120, 290, "m", { w: 3 });
      s += K.dot(70, 250) + K.dot(290, 100) + K.v(56, 264, "A", "i", { s: 17 }) + K.v(298, 86, "E", "i", { s: 17 });
      s += K.vl(70, 250, 290, 100, "a", "a", 18) + K.vl(340, 140, 120, 290, "−a", "m", 20);
      s += lines(K, 372, 160, ["−a: Anfang und Ende vertauscht", "gleiche Länge, Gegenrichtung", "a und −a sind antiparallel", "a + (−a) = 0"], "s", { lh: 24 });
      return K.svg(620, 320, s);
    });

  add("add", "Vektoraddition: Spitze an Fuß",
    "a₂ wird so <b>verschoben</b>, dass sein Fuß an der Spitze von a₁ sitzt (gestrichelt: a₂ vorher). Die <b>Summe</b> (rot) reicht vom Anfang von a₁ bis zur Spitze von a₂ – wie zwei hintereinander gelaufene Wege.",
    function(K){
      var s = K.arrow(70, 280, 210, 130, "c4", { w: 1.6, dash: "6 5" }) + K.t(118, 196, "a₂", "c4", { it: true, s: 14 });
      s += K.arrow(70, 280, 300, 230, "a", { w: 3 }) + K.arrow(300, 230, 440, 80, "c4", { w: 3 }) + K.arrow(70, 280, 440, 80, "m", { w: 3.4 });
      s += K.vl(70, 280, 300, 230, "a₁", "a", -18) + K.vl(300, 230, 440, 80, "a₂", "c4", -18) + K.vl(70, 280, 440, 80, "a₁ + a₂", "m", 20, { at: 0.6 });
      s += K.t(600, 300, "Fuß von a₂ an die Spitze von a₁ hängen", "s", { a: "end", s: 13 });
      return K.svg(620, 320, s);
    });

  add("sub", "Subtraktion a − b = a + (−b)",
    "<b>a − b</b> (rot) zeigt von der <b>Spitze von b zur Spitze von a</b>. Dasselbe erhält man, wenn man an a den umgedrehten Vektor −b hängt (gestrichelt): a + (−b) landet am gleichen Ziel – beide roten Pfeile sind derselbe Vektor.",
    function(K){
      var O = [90, 270], A = [400, 90], B = [330, 270], C = [160, 90], s = "";
      s += K.arrow(A[0], A[1], C[0], C[1], "c3", { w: 2, dash: "7 5" }) + K.arrow(O[0], O[1], C[0], C[1], "m", { w: 2, dash: "7 5" });
      s += K.t((A[0] + C[0]) / 2, A[1] - 16, "−b", "c3", { it: true, b: true, s: 16 }) + K.t(98, 170, "a + (−b)", "m", { it: true, b: true, s: 15 });
      s += K.arrow(O[0], O[1], A[0], A[1], "a", { w: 3 }) + K.arrow(O[0], O[1], B[0], B[1], "c4", { w: 3 }) + K.arrow(B[0], B[1], A[0], A[1], "m", { w: 3.4 });
      s += K.vl(O[0], O[1], A[0], A[1], "a", "a", 18, { at: 0.62 }) + K.vl(O[0], O[1], B[0], B[1], "b", "c4", -18) + K.vl(B[0], B[1], A[0], A[1], "a − b", "m", -30);
      s += K.t(590, 300, "von der Spitze von b zur Spitze von a", "s", { a: "end", s: 13 });
      return K.svg(600, 320, s);
    });

  add("null", "Nullvektor 0 – das neutrale Element",
    "Beim Nullvektor fallen Anfangs- und Endpunkt zusammen: <b>Länge 0</b>, jede Richtung ist erlaubt. Hängt man ihn an einen Vektor an, ändert sich nichts: <b>a + 0 = a</b> – wie die 0 bei Zahlen.",
    function(K){
      var s = K.panel(10, 10, 220, 220, "Nullvektor") + K.panel(250, 10, 330, 220, "neutrales Element");
      s += K.circ(120, 115, 26, "f", { dash: "3 4" }) + K.dot(120, 115, "m", 6);
      s += K.t(120, 66, "A = E", "i", { it: true, b: true, s: 16 }) + K.t(120, 172, "Länge 0", "s", { s: 13 }) + K.t(120, 192, "jede Richtung", "s", { s: 13 });
      s += K.arrow(290, 175, 480, 85, "a", { w: 3 }) + K.dot(480, 85, "m", 6) + K.t(492, 74, "+ 0", "m", { a: "start", s: 15, b: true });
      s += K.vl(290, 175, 480, 85, "a", "a", 18) + K.f(415, 200, "a + 0 = a", "m", { fill: "fm" });
      return K.svg(590, 240, s);
    });

  add("komm","Kommutativgesetz a₁ + a₂ = a₂ + a₁",
    "Ob erst a₁ und dann a₂ (durchgezogen) oder erst a₂ und dann a₁ (gestrichelt): man landet am <b>selben Punkt</b>. Die beiden Wege bilden ein <b>Parallelogramm</b>, die Summe ist seine Diagonale.",
    function(K){
      var O = [80, 290], A = [310, 240], B = [220, 140], S2 = [450, 90], s = "";
      s += K.arrow(O[0], O[1], B[0], B[1], "c4", { w: 2, dash: "7 5" }) + K.arrow(B[0], B[1], S2[0], S2[1], "a", { w: 2, dash: "7 5" });
      s += K.arrow(O[0], O[1], A[0], A[1], "a", { w: 3 }) + K.arrow(A[0], A[1], S2[0], S2[1], "c4", { w: 3 });
      s += K.arrow(O[0], O[1], S2[0], S2[1], "m", { w: 3.4 });
      s += K.vl(O[0], O[1], A[0], A[1], "a₁", "a", -18) + K.vl(A[0], A[1], S2[0], S2[1], "a₂", "c4", -18);
      s += K.vl(O[0], O[1], B[0], B[1], "a₂", "c4", 18) + K.vl(B[0], B[1], S2[0], S2[1], "a₁", "a", 18);
      s += K.f(480, 250, "a₁ + a₂ = a₂ + a₁", "m", { fill: "fm" });
      return K.svg(600, 320, s);
    });

  add("assoz", "Assoziativgesetz (a₁ + a₂) + a₃ = a₁ + (a₂ + a₃)",
    "Drei Vektoren hintereinander: Ob man zuerst a₁ + a₂ zusammenfasst oder zuerst a₂ + a₃ (gestrichelt) – der Endpunkt und damit die <b>Summe</b> (rot) bleibt gleich. Klammern darf man also weglassen.",
    function(K){
      var O = [60, 280], A1 = [200, 120], A2 = [370, 230], A3 = [530, 90], s = "";
      s += K.arrow(O[0], O[1], A2[0], A2[1], "s", { w: 1.8, dash: "6 5" }) + K.arrow(A1[0], A1[1], A3[0], A3[1], "s", { w: 1.8, dash: "6 5" });
      s += K.vl(O[0], O[1], A2[0], A2[1], "a₁ + a₂", "s", -18, { s: 15 }) + K.vl(A1[0], A1[1], A3[0], A3[1], "a₂ + a₃", "s", 16, { s: 15 });
      s += K.arrow(O[0], O[1], A1[0], A1[1], "a", { w: 3 }) + K.arrow(A1[0], A1[1], A2[0], A2[1], "c4", { w: 3 }) + K.arrow(A2[0], A2[1], A3[0], A3[1], "c3", { w: 3 });
      s += K.vl(O[0], O[1], A1[0], A1[1], "a₁", "a", 16) + K.vl(A1[0], A1[1], A2[0], A2[1], "a₂", "c4", -16, { at: 0.3 }) + K.vl(A2[0], A2[1], A3[0], A3[1], "a₃", "c3", -16);
      s += K.arrow(O[0], O[1], A3[0], A3[1], "m", { w: 3.2 }) + K.vl(O[0], O[1], A3[0], A3[1], "a₁ + a₂ + a₃", "m", 20, { at: 0.3, s: 15 });
      return K.svg(580, 315, s);
    });

  add("skalar", "Skalare Multiplikation λ·a",
    "λ·a <b>streckt</b> (|λ| &gt; 1) oder <b>staucht</b> (|λ| &lt; 1) den Vektor. Ist λ negativ, wird er zusätzlich <b>umgedreht</b>. Für λ = 0 bleibt nur der Nullvektor übrig. Alle Ergebnisse liegen auf derselben Geraden durch den Anfangspunkt.",
    function(K){
      var s = K.line(200, 22, 200, 350, "f", { dash: "4 5", w: 1.2 }), x0 = 200, u = 120;
      var rows = [[1, "a", "a", "λ = 1: das Original"], [2, "2·a", "a", "λ = 2: doppelt so lang"], [0.5, "0,5·a", "c4", "λ = 0,5: halb so lang"],
                  [-1, "−a", "m", "λ = −1: umgedreht"], [-1.5, "−1,5·a", "m", "λ = −1,5: umgedreht + gestreckt"]];
      rows.forEach(function(r, i){
        var y = 45 + i * 60, x1 = x0 + r[0] * u;
        s += K.arrow(x0, y, x1, y, r[2], { w: 3 }) + K.v((x0 + x1) / 2, y - 16, r[1], r[2], { s: 16 }) + K.t(470, y, r[3], "s", { a: "start", s: 13 });
      });
      s += K.dot(x0, 345, "i", 5) + K.v(x0 + 30, 345, "0·a = 0", "i", { s: 15, a: "start" }) + K.t(470, 345, "λ = 0: Nullvektor", "s", { a: "start", s: 13 });
      return K.svg(660, 365, s);
    });

  add("distrib", "Distributivgesetze",
    "<b>Links:</b> Streckt man ein ganzes Dreieck aus a, b und a + b mit λ (hier 2), bleibt es ein Dreieck – λ·(a + b) = λ·a + λ·b. <b>Rechts:</b> 2·a und 1·a hintereinander ergeben 3·a – (λ + μ)·a = λ·a + μ·a.",
    function(K){
      var s = K.panel(10, 10, 300, 300, "λ·(a + b) = λ·a + λ·b") + K.panel(330, 10, 300, 300, "(λ + μ)·a = λ·a + μ·a");
      var O = [40, 285];
      s += K.arrow(O[0], O[1], O[0] + 90, O[1] - 20, "a", { w: 1.6, dash: "5 4" }) + K.arrow(O[0] + 90, O[1] - 20, O[0] + 120, O[1] - 110, "c4", { w: 1.6, dash: "5 4" }) + K.arrow(O[0], O[1], O[0] + 120, O[1] - 110, "m", { w: 1.6, dash: "5 4" });
      s += K.arrow(O[0], O[1], O[0] + 180, O[1] - 40, "a", { w: 3 }) + K.arrow(O[0] + 180, O[1] - 40, O[0] + 240, O[1] - 220, "c4", { w: 3 }) + K.arrow(O[0], O[1], O[0] + 240, O[1] - 220, "m", { w: 3 });
      s += K.v(O[0] + 55, O[1] - 30, "a", "a", { s: 14 }) + K.v(O[0] + 115, O[1] - 60, "b", "c4", { s: 14 });
      s += K.v(O[0] + 130, O[1] - 2, "2a", "a") + K.v(O[0] + 232, O[1] - 120, "2b", "c4") + K.v(O[0] + 85, O[1] - 140, "2(a + b)", "m");
      var y1 = 130, y2 = 200, x = 370;
      s += K.arrow(x, y1, x + 160, y1, "a", { w: 3 }) + K.arrow(x + 160, y1, x + 240, y1, "c4", { w: 3 }) + K.arrow(x, y2, x + 240, y2, "m", { w: 3 });
      s += K.v(x + 80, y1 - 16, "2·a", "a") + K.v(x + 200, y1 - 16, "1·a", "c4") + K.v(x + 120, y2 + 20, "(2 + 1)·a = 3·a", "m");
      s += K.line(x, 90, x, 230, "f", { dash: "4 4", w: 1 }) + K.line(x + 240, 90, x + 240, 230, "f", { dash: "4 4", w: 1 });
      s += K.t(480, 275, "λ = 2, μ = 1", "s", { s: 13 });
      return K.svg(640, 320, s);
    });

  add("ab", "Vektor aus zwei Punkten: AE = E − A",
    "Der Pfeil von A nach E (rot) hat als Komponenten die <b>Koordinatendifferenzen</b>: wie weit nach rechts (Δx) und wie weit nach oben (Δy). Daher „Endpunkt minus Anfangspunkt“. Gestrichelt: die Ortsvektoren von A und E – ihre Differenz ist AE.",
    function(K){
      var st = 45, ox = 60, oy = 320, s = K.grid(ox, 50, 11, 6, st) + K.axes(ox, oy, 10, 510, 280, 10) + K.ticks(ox, oy, st, 10, 5, true);
      var A = [ox + st, oy - st], E = [ox + 5 * st, oy - 4 * st];
      s += K.arrow(ox, oy, A[0], A[1], "f", { w: 1.6, dash: "5 4" }) + K.arrow(ox, oy, E[0], E[1], "f", { w: 1.6, dash: "5 4" });
      s += K.line(A[0], A[1], E[0], A[1], "c3", { w: 3, dash: "7 5" }) + K.line(E[0], A[1], E[0], E[1], "c4", { w: 3, dash: "7 5" });
      s += K.arrow(A[0], A[1], E[0], E[1], "m", { w: 3.4 }) + K.dot(A[0], A[1]) + K.dot(E[0], E[1]);
      s += K.t(A[0] - 6, A[1] + 18, "A(1 | 1)", "i", { a: "end", s: 14, b: true }) + K.t(E[0] - 8, E[1] - 16, "E(5 | 4)", "i", { a: "end", s: 14, b: true });
      s += K.t((A[0] + E[0]) / 2, A[1] + 20, "Δx = 5 − 1 = 4", "c3", { s: 14, b: true }) + K.t(E[0] + 10, (A[1] + E[1]) / 2, "Δy = 4 − 1 = 3", "c4", { a: "start", s: 14, b: true });
      s += K.f(450, 82, "AE = E − A = (4, 3)ᵀ", "m", { fill: "fm" });
      return K.svg(580, 345, s);
    });

  add("addk", "Addition in Koordinaten: komponentenweise",
    "Grafisch Spitze an Fuß – in Koordinaten einfach <b>x mit x, y mit y</b> addieren. Unten auf der x-Achse: 4 + 1 = 5, links auf der y-Achse: 1 + 3 = 4. Ergebnis (5, 4)ᵀ.",
    function(K){
      var st = 45, ox = 70, oy = 310, s = K.grid(ox, 40, 9, 6, st) + K.axes(ox, oy, 10, 420, 285, 10) + K.ticks(ox, oy, st, 8, 5, false);
      var A = [ox + 4 * st, oy - st], B = [ox + 5 * st, oy - 4 * st];
      s += K.line(ox, oy + 12, A[0], oy + 12, "a", { w: 4 }) + K.line(A[0], oy + 12, B[0], oy + 12, "c4", { w: 4 });
      s += K.line(ox - 12, oy, ox - 12, A[1], "a", { w: 4 }) + K.line(ox - 12, A[1], ox - 12, B[1], "c4", { w: 4 });
      s += K.t((ox + A[0]) / 2, oy + 28, "a₁ = 4", "a", { s: 13, b: true }) + K.t((A[0] + B[0]) / 2 + 6, oy + 28, "b₁ = 1", "c4", { s: 13, b: true });
      s += K.t(ox - 18, (oy + A[1]) / 2, "a₂ = 1", "a", { a: "end", s: 13, b: true }) + K.t(ox - 18, (A[1] + B[1]) / 2, "b₂ = 3", "c4", { a: "end", s: 13, b: true });
      s += K.arrow(ox, oy, A[0], A[1], "a", { w: 3 }) + K.arrow(A[0], A[1], B[0], B[1], "c4", { w: 3 }) + K.arrow(ox, oy, B[0], B[1], "m", { w: 3.4 });
      s += K.vl(ox, oy, A[0], A[1], "a", "a", -16) + K.vl(A[0], A[1], B[0], B[1], "b", "c4", -16) + K.vl(ox, oy, B[0], B[1], "a + b", "m", 18, { at: 0.55 });
      s += K.f(555, 120, "(4, 1)ᵀ + (1, 3)ᵀ", "s", { fill: "p" }) + K.f(555, 160, "= (5, 4)ᵀ", "m", { fill: "fm" });
      return K.svg(670, 350, s);
    });

  add("pyth", "Betrag |a| = Länge = Pythagoras",
    "<b>Ebene:</b> Die Komponenten a₁, a₂ sind die Katheten, |a| ist die Hypotenuse. <b>Raum:</b> Zweimal Pythagoras – erst die Bodendiagonale √(a₁² + a₂²), dann mit der Höhe a₃ die Raumdiagonale √(a₁² + a₂² + a₃²).",
    function(K){
      var s = K.panel(10, 10, 310, 340, "Ebene: |a| = √(a₁² + a₂²)") + K.panel(340, 10, 310, 340, "Raum: |a| = √(a₁² + a₂² + a₃²)");
      var st = 45, ox = 50, oy = 300;
      s += K.grid(ox, oy - 4 * st, 5, 4, st);
      s += K.line(ox, oy, ox + 3 * st, oy, "c3", { w: 4 }) + K.line(ox + 3 * st, oy, ox + 3 * st, oy - 4 * st, "c4", { w: 4 }) + K.ra(ox + 3 * st, oy, ox, oy, ox + 3 * st, oy - 40, 14);
      s += K.arrow(ox, oy, ox + 3 * st, oy - 4 * st, "m", { w: 3.4 });
      s += K.t(ox + 1.5 * st, oy + 18, "a₁ = 3", "c3", { s: 14, b: true }) + K.t(ox + 3 * st + 10, oy - 2 * st, "a₂ = 4", "c4", { a: "start", s: 14, b: true });
      s += K.t(ox + 1.5 * st - 34, oy - 2 * st - 14, "|a| = 5", "m", { s: 15, b: true });
      s += K.f(165, 80, "√(3² + 4²) = √25 = 5", "m", { fill: "fm", s: 13 });
      var P = K.p3(420, 270, 48), C = [2, 3, 2.5];
      var V = function(x, y, z){ return P(x * C[0], y * C[1], z * C[2]); };
      [[[0,0,0],[1,0,0]],[[0,0,0],[0,1,0]],[[1,0,0],[1,1,0]],[[0,1,0],[1,1,0]],[[0,0,1],[1,0,1]],[[0,0,1],[0,1,1]],[[1,0,1],[1,1,1]],[[0,1,1],[1,1,1]],
       [[0,0,0],[0,0,1]],[[1,0,0],[1,0,1]],[[0,1,0],[0,1,1]]].forEach(function(e){
        var a = V(e[0][0], e[0][1], e[0][2]), b = V(e[1][0], e[1][1], e[1][2]); s += K.line(a[0], a[1], b[0], b[1], "f", { w: 1.2, dash: "4 4" });
      });
      var O = V(0, 0, 0), D = V(1, 1, 0), T = V(1, 1, 1);
      s += K.line(O[0], O[1], D[0], D[1], "c3", { w: 3.4 }) + K.line(D[0], D[1], T[0], T[1], "c4", { w: 3.4 }) + K.ra(D[0], D[1], O[0], O[1], T[0], T[1], 12);
      s += K.arrow(O[0], O[1], T[0], T[1], "m", { w: 3.4 });
      s += K.t((O[0] + D[0]) / 2 + 8, (O[1] + D[1]) / 2 + 22, "√(a₁² + a₂²)", "c3", { s: 13, b: true }) + K.t(D[0] + 10, (D[1] + T[1]) / 2, "a₃", "c4", { a: "start", s: 14, b: true });
      s += K.t((O[0] + T[0]) / 2 - 10, (O[1] + T[1]) / 2 - 16, "|a|", "m", { s: 15, b: true });
      var x1 = V(0.5, 0, 0), y1 = V(0, 0.5, 0);
      s += K.t(x1[0] - 18, x1[1] + 6, "a₁", "s", { s: 13 }) + K.t(y1[0], y1[1] - 12, "a₂", "s", { s: 13 });
      return K.svg(660, 360, s);
    });

  add("linkomb", "Linearkombination a = λ₁a₁ + λ₂a₂",
    "a₁ und a₂ spannen ein schiefes Gitter auf. Man erreicht a, indem man <b>2 Schritte entlang a₁</b> und <b>1,5 Schritte entlang a₂</b> geht – also a = 2·a₁ + 1,5·a₂. Die gesuchten Faktoren λ findet man rechnerisch über ein <b>LGS</b>.",
    function(K){
      var O = [80, 300], u = [110, -20], v = [40, -90], s = "";
      for(var i = 0; i <= 4; i++) s += K.line(O[0] + i * u[0], O[1] + i * u[1], O[0] + i * u[0] + 3 * v[0], O[1] + i * u[1] + 3 * v[1], "r", { w: 1 });
      for(var j = 0; j <= 3; j++) s += K.line(O[0] + j * v[0], O[1] + j * v[1], O[0] + j * v[0] + 4 * u[0], O[1] + j * v[1] + 4 * u[1], "r", { w: 1 });
      var p1 = [O[0] + u[0], O[1] + u[1]], p2 = [O[0] + 2 * u[0], O[1] + 2 * u[1]], p3 = [p2[0] + v[0], p2[1] + v[1]], X = [p2[0] + 1.5 * v[0], p2[1] + 1.5 * v[1]];
      s += K.arrow(O[0], O[1], p1[0], p1[1], "a", { w: 3 }) + K.arrow(p1[0], p1[1], p2[0], p2[1], "a", { w: 3 });
      s += K.arrow(p2[0], p2[1], p3[0], p3[1], "c4", { w: 3 }) + K.arrow(p3[0], p3[1], X[0], X[1], "c4", { w: 3 });
      s += K.arrow(O[0], O[1], X[0], X[1], "m", { w: 3.4 });
      s += K.t(O[0] + u[0], O[1] + u[1] + 24, "2·a₁", "a", { s: 15, b: true }) + K.t(p3[0] + 16, p3[1] + 6, "1,5·a₂", "c4", { a: "start", s: 15, b: true });
      s += K.vl(O[0], O[1], X[0], X[1], "a", "m", 18);
      s += K.f(480, 60, "a = 2·a₁ + 1,5·a₂", "m", { fill: "fm" }) + K.t(480, 92, "Gitterlinien: Vielfache von a₁ und a₂", "f", { s: 12 });
      return K.svg(660, 330, s);
    });

  add("linunab", "Linear unabhängig oder abhängig?",
    "Anschauliche Regel: Linear abhängig heißt, man kann die Pfeile mit Faktoren (nicht alle 0) zu einem <b>geschlossenen Weg</b> zusammensetzen – das ist die „nicht-triviale Darstellung der Null“. Bei unabhängigen Vektoren geht das nur, wenn alle Faktoren 0 sind.",
    function(K){
      var s = K.panel(10, 10, 210, 300, "unabhängig", "a") + K.panel(235, 10, 210, 300, "abhängig: parallel", "m") + K.panel(460, 10, 210, 300, "abhängig: geschlossen", "m");
      s += K.arrow(50, 220, 180, 200, "a", { w: 3 }) + K.arrow(50, 220, 90, 80, "c4", { w: 3 }) + K.v(130, 228, "a₁", "a") + K.v(56, 140, "a₂", "c4");
      s += lines(K, 115, 258, ["λ₁a₁ + λ₂a₂ = 0", "nur mit λ₁ = λ₂ = 0"], "s", { a: "middle", s: 12.5, lh: 18 });
      s += K.arrow(260, 200, 330, 150, "a", { w: 3 }) + K.arrow(285, 225, 425, 125, "c4", { w: 3 });
      s += K.v(282, 162, "a₁", "a") + K.v(395, 205, "a₂ = 2a₁", "c4", { s: 15 });
      s += lines(K, 340, 258, ["2·a₁ − a₂ = 0", "(Faktoren ≠ 0)"], "s", { a: "middle", s: 12.5, lh: 18 });
      s += K.poly([[490, 200], [630, 180], [570, 70]], "r", { fill: "fm", w: 0.1 });
      s += K.arrow(490, 200, 630, 180, "a", { w: 3 }) + K.arrow(630, 180, 570, 70, "c4", { w: 3 }) + K.arrow(570, 70, 490, 200, "c3", { w: 3 });
      s += K.v(560, 210, "a₁", "a") + K.v(620, 118, "a₂", "c4") + K.v(512, 124, "a₃", "c3");
      s += lines(K, 565, 258, ["a₁ + a₂ + a₃ = 0", "Weg schließt sich"], "s", { a: "middle", s: 12.5, lh: 18 });
      return K.svg(680, 320, s);
    });

  add("kgtn", "Satz 1.8: mehr Vektoren als Dimensionen ⇒ abhängig",
    "In der Ebene (n = 2) reichen zwei nicht-parallele Vektoren, um <b>jeden</b> Punkt zu erreichen. Ein dritter Vektor a₃ ist deshalb immer als a₃ = λ₁a₁ + λ₂a₂ darstellbar (gestrichelt) – also sind drei Vektoren im ℝ² stets linear abhängig. Im ℝ³ gilt dasselbe ab vier Vektoren.",
    function(K){
      var O = [110, 290], a1 = [200, -20], a2 = [60, -170], s = "";
      var A1 = [O[0] + a1[0], O[1] + a1[1]], A3 = [A1[0] + a2[0], A1[1] + a2[1]];
      s += K.arrow(A1[0], A1[1], A3[0], A3[1], "c4", { w: 1.8, dash: "6 5" });
      s += K.arrow(O[0], O[1], A1[0], A1[1], "a", { w: 3 }) + K.arrow(O[0], O[1], O[0] + a2[0], O[1] + a2[1], "c4", { w: 3 }) + K.arrow(O[0], O[1], A3[0], A3[1], "m", { w: 3.4 });
      s += K.vl(O[0], O[1], A1[0], A1[1], "a₁", "a", -16) + K.vl(O[0], O[1], O[0] + a2[0], O[1] + a2[1], "a₂", "c4", 16) + K.vl(O[0], O[1], A3[0], A3[1], "a₃", "m", -16, { at: 0.62 });
      s += lines(K, 410, 120, ["3 Vektoren im ℝ² (n = 2):", "k = 3 > n = 2", "⇒ immer linear abhängig,", "ganz ohne Rechnung."], "s", { lh: 24, s: 14 });
      s += K.f(500, 250, "a₃ = a₁ + a₂", "m", { fill: "fm" });
      return K.svg(640, 320, s);
    });

  /* ═════════ Kapitel 2 ═════════ */

  add("skp", "Skalarprodukt geometrisch: Länge × Schatten",
    "Fällt Licht senkrecht auf a, wirft b einen <b>Schatten</b> der Länge |b|·cos φ auf a (rot). Das Skalarprodukt ist <b>|a| mal diese Schattenlänge</b> – eine Zahl, kein Vektor. Je stärker b in Richtung a zeigt, desto größer.",
    function(K){
      var O = [80, 260], A = [500, 260], B = [293, 111], F = [293, 260], s = "";
      s += K.line(B[0], B[1], F[0], F[1], "f", { dash: "5 5" }) + K.ra(F[0], F[1], O[0], O[1], B[0], B[1], 13);
      s += K.arrow(O[0], O[1], A[0], A[1], "a", { w: 3 }) + K.line(O[0], O[1] + 1, F[0], F[1] + 1, "m", { w: 7 });
      s += K.arrow(O[0], O[1], B[0], B[1], "c4", { w: 3 }) + K.arc(O[0], O[1], 52, 0, 35, "i", { w: 1.6 }) + K.t(O[0] + 66, O[1] - 18, "φ", "i", { it: true, s: 17 });
      s += K.v(470, 240, "a", "a") + K.vl(O[0], O[1], B[0], B[1], "b", "c4", 18);
      s += K.t((O[0] + F[0]) / 2, O[1] + 24, "Schatten: |b|·cos φ", "m", { s: 14, b: true });
      s += K.f(450, 80, "⟨a, b⟩ = |a| · |b|·cos φ", "a") + K.t(450, 112, "= Länge von a × Schattenlänge von b", "s", { s: 13 });
      return K.svg(620, 300, s);
    });

  add("skpk", "Skalarprodukt in Koordinaten: paarweise multiplizieren, aufsummieren",
    "Gleiche Zeilen werden miteinander multipliziert, die drei Produkte addiert. Heraus kommt <b>eine einzige Zahl</b> – daher „Skalar“produkt.",
    function(K){
      var s = K.rect(110, 40, 60, 180, "a", { fill: "fa" }) + K.rect(220, 40, 60, 180, "c4", { fill: "p" }), rows = ["₁", "₂", "₃"];
      rows.forEach(function(r, i){
        var y = 70 + i * 60;
        s += K.v(140, y, "a" + r, "a") + K.v(250, y, "b" + r, "c4") + K.t(195, y, "·", "i", { s: 22, b: true });
        s += K.arrow(290, y, 360, y, "f", { w: 1.4, head: 8 }) + K.v(400, y, "a" + r + "b" + r, "i");
        if(i < 2) s += K.t(400, y + 30, "+", "i", { s: 18, b: true });
      });
      s += K.line(370, 225, 440, 225, "i", { w: 1.6 }) + K.t(405, 248, "= eine Zahl", "m", { s: 15, b: true });
      s += K.t(140, 236, "a", "a", { it: true, s: 13 }) + K.t(250, 236, "b", "c4", { it: true, s: 13 });
      s += K.f(300, 285, "(1, 2, 3)ᵀ · (4, −1, 2)ᵀ = 4 − 2 + 6 = 8", "s", { fill: "p", s: 13 });
      return K.svg(600, 310, s);
    });

  add("orth", "Vorzeichen des Skalarprodukts · Orthogonalität",
    "Der Schatten (rot) entscheidet: Spitzer Winkel → Schatten zeigt <b>mit</b> a → ⟨a, b⟩ &gt; 0. Rechter Winkel → <b>kein Schatten</b> → ⟨a, b⟩ = 0, die Vektoren stehen <b>senkrecht</b>. Stumpfer Winkel → Schatten zeigt <b>gegen</b> a → ⟨a, b⟩ &lt; 0.",
    function(K){
      var s = "", cfg = [[50, "φ < 90°", "⟨a, b⟩ > 0"], [90, "φ = 90°", "⟨a, b⟩ = 0"], [130, "φ > 90°", "⟨a, b⟩ < 0"]];
      cfg.forEach(function(c, i){
        var x0 = 10 + i * 220, O = [x0 + 95, 215], r = c[0] * Math.PI / 180, L = 120;
        var B = [O[0] + L * Math.cos(r), O[1] - L * Math.sin(r)], F = [B[0], O[1]];
        s += K.panel(x0, 10, 210, 290, c[1], i === 1 ? "m" : "s");
        s += K.line(B[0], B[1], F[0], F[1], "f", { dash: "4 4" });
        if(i === 1) s += K.ra(O[0], O[1], O[0] + 30, O[1], B[0], B[1], 13, "m");
        else s += K.line(O[0], O[1] + 1, F[0], F[1] + 1, "m", { w: 7 });
        s += K.arrow(O[0], O[1], O[0] + 105, O[1], "a", { w: 3 }) + K.arrow(O[0], O[1], B[0], B[1], "c4", { w: 3 });
        if(i !== 1) s += K.arc(O[0], O[1], 30, 0, c[0], "i", { w: 1.4 });
        s += K.v(O[0] + 96, O[1] + 18, "a", "a", { s: 16 }) + K.v(B[0] + (i === 2 ? -14 : 14), B[1] + 4, "b", "c4", { s: 16 });
        s += K.f(x0 + 105, 268, c[2], i === 1 ? "m" : "a", { fill: i === 1 ? "fm" : "fa", s: 14 });
      });
      return K.svg(670, 310, s);
    });

  add("winkel", "Winkel zwischen zwei Vektoren",
    "Aus beiden Skalarprodukt-Formeln folgt cos φ = ⟨a, b⟩ / (|a|·|b|). Der Wert liegt immer zwischen −1 und 1; die Skala rechts zeigt, welcher Winkel dazu gehört: <b>1 → 0°</b> (gleiche Richtung), <b>0 → 90°</b> (senkrecht), <b>−1 → 180°</b> (entgegengesetzt).",
    function(K){
      var O = [90, 240], A = [346, 195], B = [142, 47], s = "";
      s += K.arrow(O[0], O[1], A[0], A[1], "a", { w: 3 }) + K.arrow(O[0], O[1], B[0], B[1], "c4", { w: 3 });
      s += K.arc(O[0], O[1], 58, 10, 75, "m", { w: 2.2 }) + K.t(O[0] + 66, O[1] - 52, "φ", "m", { it: true, b: true, s: 19 });
      s += K.vl(O[0], O[1], A[0], A[1], "a", "a", -18, { at: 0.8 }) + K.vl(O[0], O[1], B[0], B[1], "b", "c4", 18, { at: 0.8 });
      s += K.f(220, 292, "cos φ = ⟨a, b⟩ / (|a|·|b|)", "m", { fill: "fm" });
      var x = 520, yt = 50, yb = 250;
      s += K.line(x, yt, x, yb, "i", { w: 2 });
      [[1, "0°"], [0.5, "60°"], [0, "90°"], [-0.5, "120°"], [-1, "180°"]].forEach(function(p){
        var y = yt + (1 - p[0]) / 2 * (yb - yt);
        s += K.line(x - 6, y, x + 6, y, "i", { w: 2 }) + K.t(x - 14, y, String(p[0]).replace(".", ","), "s", { a: "end", s: 13 }) + K.t(x + 14, y, p[1], p[1] === "90°" ? "m" : "a", { a: "start", s: 13, b: true });
      });
      s += K.t(x - 28, yt - 26, "cos φ", "s", { s: 12, b: true }) + K.t(x + 28, yt - 26, "φ", "s", { s: 12, b: true, it: true });
      return K.svg(620, 320, s);
    });

  add("kreuz", "Vektorprodukt a × b: senkrecht auf beiden, Länge = Fläche",
    "a × b steht <b>senkrecht auf a und auf b</b> – also senkrecht auf der Fläche, die beide aufspannen. Seine Länge ist der <b>Flächeninhalt des Parallelogramms</b> aus a und b. Die Richtung gibt die <b>Rechte-Hand-Regel</b>: Daumen a, Zeigefinger b, Mittelfinger a × b.",
    function(K){
      var P = K.p3(220, 235, 60, 0.8), a = [3, 0.8, 0], b = [0, 3, 0], c = [0, 0, 3], O = [0, 0, 0];
      var s = K.poly3(P, [O, a, plus(a, b), b], "a", { fill: "fa", w: 1 });
      var Oo = at(P, O), Pa = at(P, a), Pb = at(P, b), Pc = at(P, c), Pab = at(P, plus(a, b));
      s += K.t((Oo[0] + Pab[0]) / 2 + 10, (Oo[1] + Pab[1]) / 2 + 4, "Fläche = |a × b|", "a", { s: 13, b: true });
      s += K.ra(Oo[0], Oo[1], Pc[0], Pc[1], Pb[0], Pb[1], 14, "m") + K.ra(Oo[0], Oo[1], Pc[0], Pc[1], Pa[0], Pa[1], 14, "m");
      s += K.arrow(Oo[0], Oo[1], Pa[0], Pa[1], "a", { w: 3 }) + K.arrow(Oo[0], Oo[1], Pb[0], Pb[1], "c4", { w: 3 }) + K.arrow(Oo[0], Oo[1], Pc[0], Pc[1], "m", { w: 3.4 });
      s += K.v(Pa[0] - 14, Pa[1] + 4, "a", "a") + K.v(Pb[0] + 4, Pb[1] - 16, "b", "c4") + K.v(Pc[0] - 34, Pc[1] + 20, "a × b", "m");
      s += lines(K, 410, 70, ["a × b ⊥ a  und  a × b ⊥ b", "Probe: ⟨a × b, a⟩ = 0", "           ⟨a × b, b⟩ = 0", "", "Ergebnis ist ein Vektor", "– nur im ℝ³ definiert"], "s", { s: 14, lh: 24 });
      return K.svg(640, 360, s);
    });

  add("kreuzschema", "Rechenschema für a × b",
    "Komponenten von a und b untereinander schreiben, die <b>ersten beiden Zeilen unten wiederholen</b>. Dann jeweils über Kreuz: Pfeil ↘ wird <b>addiert</b>, Pfeil ↙ <b>abgezogen</b>. Zeilen 2–3 liefern c₁, Zeilen 3–4 c₂, Zeilen 4–5 c₃.",
    function(K){
      var s = "", xa = 150, xb = 250, ys = [50, 100, 150, 200, 250], idx = ["₁", "₂", "₃", "₁", "₂"];
      var pairs = [[1, "a", "c₁ = a₂b₃ − a₃b₂"], [2, "c3", "c₂ = a₃b₁ − a₁b₃"], [3, "c4", "c₃ = a₁b₂ − a₂b₁"]];
      s += K.line(110, 225, 290, 225, "f", { dash: "4 4", w: 1 }) + K.t(300, 225, "wiederholt", "f", { a: "start", s: 11 });
      pairs.forEach(function(p){
        var i = p[0], y1 = ys[i], y2 = ys[i + 1], ox = (i - 2) * 9;
        s += K.line(xa + 18, y1 + 4 + ox * 0.2, xb - 18, y2 - 4, p[1], { w: 2.4 }) + K.line(xa + 18, y2 - 4, xb - 18, y1 + 4 + ox * 0.2, p[1], { w: 2.4, dash: "6 4" });
        s += K.f(470, (y1 + y2) / 2, p[2], p[1], { fill: "p", s: 13 });
      });
      ys.forEach(function(y, i){
        var c = i >= 3 ? "f" : "i";
        s += K.v(xa, y, "a" + idx[i], c, { s: 17 }) + K.v(xb, y, "b" + idx[i], c, { s: 17 });
      });
      s += K.t(200, 290, "durchgezogen = plus · gestrichelt = minus", "s", { s: 12.5 });
      return K.svg(600, 310, s);
    });

  add("antikomm", "Antikommutativ: b × a = −(a × b)",
    "Vertauscht man die Reihenfolge, dreht sich die <b>Drehrichtung</b> von „a nach b“ um – und mit ihr das Ergebnis: <b>b × a zeigt genau entgegengesetzt</b> zu a × b. Die Länge bleibt gleich.",
    function(K){
      var s = K.panel(10, 10, 300, 300, "a × b") + K.panel(330, 10, 300, 300, "b × a = −(a × b)");
      [[0, 1], [1, -1]].forEach(function(cf){
        var P = K.p3(130 + cf[0] * 320, 180, 50, 0.8), a = [2.5, 0.5, 0], b = [0, 2.6, 0];
        var Oo = P(0, 0, 0), Pa = at(P, a), Pb = at(P, b), Pc = P(0, 0, 2 * cf[1]);
        s += K.poly3(P, [[0, 0, 0], a, plus(a, b), b], "r", { fill: "fa", w: 0.8 });
        s += K.arrow(Oo[0], Oo[1], Pa[0], Pa[1], "a", { w: 3 }) + K.arrow(Oo[0], Oo[1], Pb[0], Pb[1], "c4", { w: 3 }) + K.arrow(Oo[0], Oo[1], Pc[0], Pc[1], "m", { w: 3.4 });
        s += K.v(Pa[0] - 12, Pa[1] + 6, "a", "a") + K.v(Pb[0] + 2, Pb[1] - 16, "b", "c4");
        s += cf[0] ? K.v(Oo[0] + 12, Pc[1] - 4, "b × a", "m", { s: 16, a: "start" }) : K.v(Oo[0] - 40, (Oo[1] + Pc[1]) / 2, "a × b", "m", { s: 16 });
        var q1 = P(1.4, 0.3, 0), q2 = P(0, 1.4, 0), mid = P(0.9, 0.9, 0);
        var from = cf[0] ? q2 : q1, to = cf[0] ? q1 : q2;
        s += K.path("M" + from[0] + " " + from[1] + " Q" + (mid[0] + 10) + " " + (mid[1] + 14) + " " + to[0] + " " + to[1], "i", { w: 1.6, dash: "4 3" });
        s += K.dot(to[0], to[1], "i", 3.5);
        s += K.t(Oo[0] + 70, 285, cf[0] ? "Drehung b → a" : "Drehung a → b", "s", { s: 12.5 });
      });
      return K.svg(640, 320, s);
    });

  add("parallel0", "Satz 2.6: parallele Vektoren ⇒ a × b = 0",
    "|a × b| ist die Parallelogrammfläche. Liegen a und b <b>parallel</b>, klappt das Parallelogramm zu einer Strecke zusammen – <b>Fläche 0</b>, also a × b = 0. Sonst steht a × b senkrecht auf beiden (daraus gewinnt man später den Normalenvektor).",
    function(K){
      var s = K.panel(10, 10, 300, 270, "nicht parallel") + K.panel(330, 10, 300, 270, "parallel (b = λ·a)", "m");
      s += K.poly([[50, 220], [210, 200], [260, 90], [100, 110]], "a", { fill: "fa", w: 1 });
      s += K.arrow(50, 220, 210, 200, "a", { w: 3 }) + K.arrow(50, 220, 100, 110, "c4", { w: 3 });
      s += K.v(130, 228, "a", "a") + K.v(62, 158, "b", "c4") + K.t(160, 158, "Fläche > 0", "a", { s: 14, b: true });
      s += K.f(160, 255, "a × b ≠ 0", "a", { s: 13 });
      s += K.arrow(380, 220, 480, 160, "a", { w: 3 }) + K.arrow(372, 206, 572, 86, "c4", { w: 2.4, dash: "7 4" });
      s += K.v(440, 210, "a", "a") + K.v(470, 112, "b = 2a", "c4", { s: 16 }) + K.t(530, 200, "Fläche = 0", "m", { s: 14, b: true });
      s += K.f(480, 255, "a × b = 0", "m", { fill: "fm", s: 13 });
      return K.svg(640, 290, s);
    });

  add("spat", "Spatprodukt ⟨a b c⟩ = Volumen des Spats",
    "b und c spannen die <b>Grundfläche</b> auf (ihre Größe ist |b × c|, b × c steht senkrecht darauf). a ragt schräg nach oben; wie hoch, misst die <b>Höhe h</b>. Das Volumen ist Grundfläche × Höhe – genau das liefert |⟨a, b × c⟩|.",
    function(K){
      var P = K.p3(230, 262, 55, 0.8), a = [1, 1, 2.6], b = [0, 3.5, 0], c = [3, 0.5, 0], O = [0, 0, 0], s = "";
      var bc = plus(b, c), ab = plus(a, b), ac = plus(a, c), abc = plus(ab, c);
      s += K.poly3(P, [O, b, bc, c], "a", { fill: "fa", w: 1 });
      [[a, ab], [ab, abc], [abc, ac], [ac, a], [b, ab], [c, ac], [bc, abc]].forEach(function(e){ s += K.l3(P, e[0], e[1], "s", { w: 1.4 }); });
      var foot = [a[0], a[1], 0], F = at(P, foot), A = at(P, a);
      s += K.line(A[0], A[1], F[0], F[1], "m", { w: 2.2, dash: "6 4" }) + K.t(A[0] + 12, (A[1] + F[1]) / 2, "h", "m", { a: "start", it: true, b: true, s: 18 });
      s += K.ra(F[0], F[1], A[0], A[1], at(P, [a[0], a[1] + 1, 0])[0], at(P, [a[0], a[1] + 1, 0])[1], 10, "m");
      s += K.a3(P, O, a, "m", { w: 3.2 }) + K.a3(P, O, b, "c4", { w: 3 }) + K.a3(P, O, c, "c3", { w: 3 });
      var Oo = at(P, O), Pb = at(P, b), Pc = at(P, c);
      s += K.v(A[0] - 30, A[1] + 30, "a", "m") + K.v(Pb[0] - 30, Pb[1] + 18, "b", "c4") + K.v(Pc[0] - 16, Pc[1] - 4, "c", "c3");
      var M = at(P, [1.6, 2, 0]), Mt = at(P, [1.6, 2, 1.6]);
      s += K.arrow(M[0], M[1], Mt[0], Mt[1], "a", { w: 2.2, dash: "3 3" }) + K.t(Mt[0] + 8, Mt[1], "Richtung b × c", "a", { a: "start", s: 12.5, b: true });
      s += K.t(Oo[0] + 70, Oo[1] + 54, "Grundfläche |b × c|", "a", { s: 13, b: true });
      s += K.f(470, 340, "V = |⟨a, b × c⟩|", "m", { fill: "fm" });
      return K.svg(640, 380, s);
    });

  add("spat0", "Satz 2.8: ⟨a b c⟩ = 0 ⇔ komplanar",
    "Liegen a, b, c in <b>einer gemeinsamen Ebene</b>, ist das Spat platt gedrückt: <b>Höhe 0 ⇒ Volumen 0</b>. Dann lässt sich einer der Vektoren aus den anderen kombinieren (hier c = a + b) – die drei sind linear abhängig. So wird ⟨a b c⟩ = 0 zum Abhängigkeitstest.",
    function(K){
      var P = K.p3(150, 240, 55, 0.8), s = "";
      s += K.poly3(P, [[-1.2, -0.6, 0], [3.2, -0.6, 0], [3.2, 6.2, 0], [-1.2, 6.2, 0]], "r", { fill: "fa", w: 1 });
      var a = [2.4, 1, 0], b = [0, 3.2, 0], c = plus(a, b), O = [0, 0, 0];
      s += K.l3(P, a, c, "c4", { w: 1.6, dash: "6 4" }) + K.l3(P, b, c, "a", { w: 1.6, dash: "6 4" });
      s += K.a3(P, O, a, "a", { w: 3 }) + K.a3(P, O, b, "c4", { w: 3 }) + K.a3(P, O, c, "m", { w: 3.2 });
      var Pa = at(P, a), Pb = at(P, b), Pc = at(P, c);
      s += K.v(Pa[0] - 14, Pa[1] + 4, "a", "a") + K.v(Pb[0] + 4, Pb[1] - 16, "b", "c4") + K.v(Pc[0] + 16, Pc[1] + 6, "c = a + b", "m", { s: 16, a: "start" });
      s += K.t(500, 90, "alle drei in einer Ebene", "s", { s: 14 }) + K.t(500, 114, "⇒ Höhe 0 ⇒ Volumen 0", "s", { s: 14 });
      s += K.f(500, 160, "⟨a b c⟩ = 0", "m", { fill: "fm" });
      return K.svg(640, 350, s);
    });

  add("sarrus", "Regel von Sarrus (3×3-Determinante)",
    "Die ersten <b>zwei Spalten rechts noch einmal anschreiben</b>. Dann die drei Diagonalen nach rechts unten multiplizieren und <b>addieren</b> (blau), die drei Diagonalen nach rechts oben multiplizieren und <b>abziehen</b> (rot). Spalten = a, b, c ⇒ det = ⟨a b c⟩.",
    function(K){
      var s = "", xs = [110, 170, 230, 290, 350], ys = [80, 140, 200], ent = [["a₁", "b₁", "c₁"], ["a₂", "b₂", "c₂"], ["a₃", "b₃", "c₃"]];
      s += K.path("M88 52 L80 52 L80 228 L88 228", "i", { w: 2 }) + K.path("M252 52 L260 52 L260 228 L252 228", "i", { w: 2 });
      for(var k = 0; k < 3; k++){
        s += K.line(xs[k] - 10, ys[0] - 14, xs[k + 2] + 12, ys[2] + 14, "a", { w: 2.2 });
        s += K.line(xs[k] - 10, ys[2] + 14, xs[k + 2] + 12, ys[0] - 14, "m", { w: 2.2, dash: "6 4" });
      }
      for(var r = 0; r < 3; r++) for(var cc = 0; cc < 5; cc++) s += K.v(xs[cc], ys[r], ent[r][cc % 3], cc >= 3 ? "f" : "i", { s: 17 });
      s += K.t(430, 90, "↘  Produkte addieren (+)", "a", { a: "start", s: 14, b: true }) + K.t(430, 190, "↗  Produkte abziehen (−)", "m", { a: "start", s: 14, b: true });
      s += K.f(310, 270, "det = a₁b₂c₃ + b₁c₂a₃ + c₁a₂b₃ − a₃b₂c₁ − b₃c₂a₁ − c₃a₂b₁", "s", { fill: "p", s: 12 });
      return K.svg(640, 300, s);
    });

  /* ═════════ Kapitel 3 ═════════ */

  add("gerade", "Gerade in Parameterform g: x = P₁ + t·(P₂ − P₁)",
    "Man startet am <b>Aufpunkt P₁</b> (Ortsvektor) und läuft beliebig weit in <b>Richtung r = P₂ − P₁</b>. Jeder Wert von t liefert einen Punkt: t = 0 → P₁, t = 1 → P₂, t = 2 doppelt so weit, negative t rückwärts. Jedes Vielfache von r taugt ebenso als Richtungsvektor.",
    function(K){
      var O = [60, 140], P1 = [220, 230], r = [130, -55], s = "";
      var pt = function(t){ return [P1[0] + t * r[0], P1[1] + t * r[1]]; };
      var e0 = pt(-1.25), e1 = pt(3.1);
      s += K.line(e0[0], e0[1], e1[0], e1[1], "a", { w: 2 }) + K.v(e1[0] - 8, e1[1] - 18, "g", "a");
      s += K.arrow(O[0], O[1], P1[0], P1[1], "f", { w: 1.8, dash: "6 4" }) + K.t(O[0] - 12, O[1] - 4, "O", "i", { it: true, b: true });
      s += K.arrow(P1[0], P1[1], pt(1)[0], pt(1)[1], "m", { w: 3.6 }) + K.t(pt(0.5)[0] + 4, pt(0.5)[1] - 22, "r = P₂ − P₁", "m", { s: 14, b: true });
      [[-1, "t = −1"], [0, "t = 0  (P₁)"], [1, "t = 1  (P₂)"], [2, "t = 2"]].forEach(function(q){
        var p = pt(q[0]); s += K.dot(p[0], p[1], "i", 5) + K.t(p[0] + 6, p[1] + 22, q[1], "i", { a: "start", s: 13 });
      });
      s += K.f(430, 280, "g: x = P₁ + t·r ,  t ∈ ℝ", "a") + K.t(430, 310, "auch 2·r oder −r beschreiben dieselbe Gerade", "f", { s: 12 });
      return K.svg(640, 330, s);
    });

  add("ebene", "Ebene in Parameterform E: x = P₁ + t·u + s·v",
    "Vom <b>Aufpunkt P₁</b> aus gehen zwei <b>Richtungsvektoren u und v</b> (nicht parallel). Mit t Schritten in u- und s Schritten in v-Richtung erreicht man jeden Punkt X der Ebene – die Ebene ist das ganze „Gitter“ dieser Kombinationen.",
    function(K){
      var P = K.p3(220, 300, 52, 0.8), P1 = [0, 0, 1], u = [0, 3, 0.8], v = [2.2, 0, 2.6], s = "";
      var corner = function(t, ss){ return plus(plus(P1, u, t), v, ss); };
      s += K.poly3(P, [corner(-0.35, -0.4), corner(1.9, -0.4), corner(1.9, 1.45), corner(-0.35, 1.45)], "a", { fill: "fa", w: 1 });
      for(var i = 0; i <= 3; i++){ s += K.l3(P, corner(-0.35, -0.4 + i * 0.6), corner(1.9, -0.4 + i * 0.6), "r", { w: 0.9 }); }
      for(var j = 0; j <= 4; j++){ s += K.l3(P, corner(-0.35 + j * 0.55, -0.4), corner(-0.35 + j * 0.55, 1.45), "r", { w: 0.9 }); }
      var A = plus(P1, u, 1.3), X = plus(A, v, 0.9);
      s += K.a3(P, P1, A, "c4", { w: 2, dash: "6 4" }) + K.a3(P, A, X, "c3", { w: 2, dash: "6 4" });
      s += K.a3(P, P1, plus(P1, u), "c4", { w: 3.2 }) + K.a3(P, P1, plus(P1, v), "c3", { w: 3.2 });
      var p1 = at(P, P1), pu = at(P, plus(P1, u)), pv = at(P, plus(P1, v)), px = at(P, X), pa = at(P, A);
      s += K.dot(p1[0], p1[1], "i", 5) + K.t(p1[0] - 10, p1[1] - 6, "P₁", "i", { a: "end", s: 15, b: true });
      s += K.v(pu[0] - 4, pu[1] - 16, "u", "c4") + K.v(pv[0] - 18, pv[1] + 4, "v", "c3");
      s += K.t(pa[0] + 4, pa[1] + 20, "t·u", "c4", { s: 14, b: true }) + K.t((pa[0] + px[0]) / 2 + 12, (pa[1] + px[1]) / 2 + 4, "s·v", "c3", { a: "start", s: 14, b: true });
      s += K.dot(px[0], px[1], "m", 5) + K.t(px[0] + 10, px[1] + 2, "X", "m", { a: "start", s: 16, b: true, it: true });
      s += K.f(500, 300, "E: x = P₁ + t·u + s·v", "a");
      return K.svg(640, 340, s);
    });

  add("normale", "Normalenvektor und parameterfreie Form",
    "Der <b>Normalenvektor n</b> steht senkrecht auf der Ebene. Für <b>jeden</b> Punkt X der Ebene liegt X − P in der Ebene, steht also senkrecht auf n: ⟨n, X − P⟩ = 0. Ausmultipliziert: ⟨n, X⟩ = ⟨n, P⟩ – das ist <b>n₁x + n₂y + n₃z = D</b>. Die Koeffizienten vor x, y, z sind also n.",
    function(K){
      var P = K.p3(150, 270, 55, 0.8), s = "";
      s += K.poly3(P, [[-1, -0.5, 0], [3, -0.5, 0], [3, 5.5, 0], [-1, 5.5, 0]], "a", { fill: "fa", w: 1 });
      var Pp = [1, 1.2, 0], X = [2.2, 4, 0], N = [1, 1.2, 2.6];
      var a = at(P, Pp), x = at(P, X), nn = at(P, N);
      s += K.ra(a[0], a[1], nn[0], nn[1], x[0], x[1], 14, "m");
      s += K.arrow(a[0], a[1], x[0], x[1], "c4", { w: 3 }) + K.arrow(a[0], a[1], nn[0], nn[1], "m", { w: 3.4 });
      s += K.dot(a[0], a[1], "i", 5) + K.dot(x[0], x[1], "i", 5);
      s += K.t(a[0] - 12, a[1] + 14, "P", "i", { a: "end", it: true, b: true, s: 16 }) + K.t(x[0] + 10, x[1] + 10, "X", "i", { a: "start", it: true, b: true, s: 16 });
      s += K.v(nn[0] - 18, nn[1] + 8, "n", "m") + K.t((a[0] + x[0]) / 2 + 4, (a[1] + x[1]) / 2 + 22, "X − P", "c4", { s: 14, b: true });
      s += K.t(440, 238, "E", "a", { it: true, b: true, s: 18 });
      s += K.f(470, 50, "⟨n, X − P⟩ = 0", "s", { fill: "p" }) + K.f(470, 92, "⟨n, X⟩ = ⟨n, P⟩", "s", { fill: "p" }) + K.f(470, 134, "n₁x + n₂y + n₃z = D", "m", { fill: "fm" });
      return K.svg(640, 320, s);
    });

  add("p2k", "Parameterform → parameterfreie Form (3 Schritte)",
    "<b>①</b> Die beiden Richtungsvektoren u, v liegen in der Ebene – ihr Vektorprodukt <b>n = u × v</b> steht senkrecht darauf. <b>②</b> D = ⟨n, P₁⟩ aus einem bekannten Punkt. <b>③</b> n = (a, b, c)ᵀ liefert ax + by + cz = D. Auch für „Ebene aus 3 Punkten“: u = B − A, v = C − A.",
    function(K){
      var P = K.p3(150, 270, 55, 0.8), s = "";
      s += K.poly3(P, [[-1, -0.5, 0], [3, -0.5, 0], [3, 5, 0], [-1, 5, 0]], "a", { fill: "fa", w: 1 });
      var P1 = [1, 1, 0], u = [1, 1, 0], up = plus(P1, [0, 2.6, 0]), vp = plus(P1, [1.8, 0.4, 0]), np = plus(P1, [0, 0, 2.4]);
      var p1 = at(P, P1), pu = at(P, up), pv = at(P, vp), pn = at(P, np);
      s += K.ra(p1[0], p1[1], pn[0], pn[1], pu[0], pu[1], 13, "m");
      s += K.arrow(p1[0], p1[1], pu[0], pu[1], "c4", { w: 3 }) + K.arrow(p1[0], p1[1], pv[0], pv[1], "c3", { w: 3 }) + K.arrow(p1[0], p1[1], pn[0], pn[1], "m", { w: 3.4 });
      s += K.dot(p1[0], p1[1], "i", 5) + K.t(p1[0] - 12, p1[1] - 6, "P₁", "i", { a: "end", s: 15, b: true });
      s += K.v(pu[0] + 2, pu[1] - 16, "u", "c4") + K.v(pv[0] - 16, pv[1] + 4, "v", "c3") + K.v(pn[0] + 34, pn[1] + 8, "n = u × v", "m", { s: 16 });
      s += K.f(495, 60, "① n = u × v", "m", { fill: "fm", w: 200 }) + K.f(495, 105, "② D = ⟨n, P₁⟩", "a", { w: 200 }) + K.f(495, 150, "③ ax + by + cz = D", "a", { w: 200 });
      s += K.t(495, 182, "mit n = (a, b, c)ᵀ", "s", { s: 12.5 });
      return K.svg(640, 320, s);
    });

  add("achsen", "Parameterfrei → Parameterform: Spurpunkte",
    "Einfachster Weg zu drei Punkten der Ebene: <b>je zwei Koordinaten 0 setzen</b> und nach der dritten auflösen. Das liefert die Schnittpunkte mit den Achsen („Spurpunkte“). Aus drei Punkten, die nicht auf einer Geraden liegen, baut man dann die Parameterform.",
    function(K){
      var P = K.p3(230, 250, 45, 0.8), s = K.axes3(P, 5.2, 7.5, 4.2);
      var X = [4, 0, 0], Y = [0, 6, 0], Z = [0, 0, 3];
      s += K.poly3(P, [X, Y, Z], "m", { fill: "fm", w: 2 });
      var px = at(P, X), py = at(P, Y), pz = at(P, Z);
      s += K.dot(px[0], px[1], "m", 5.5) + K.dot(py[0], py[1], "m", 5.5) + K.dot(pz[0], pz[1], "m", 5.5);
      s += K.t(px[0] + 12, px[1] + 6, "(4 | 0 | 0):  y = z = 0 ⇒ 3x = 12", "i", { a: "start", s: 12.5 });
      s += K.t(py[0] - 6, py[1] + 22, "(0 | 6 | 0):  x = z = 0", "i", { a: "middle", s: 12.5 });
      s += K.t(pz[0] + 12, pz[1] - 8, "(0 | 0 | 3):  x = y = 0", "i", { a: "start", s: 12.5 });
      s += K.f(470, 40, "E: 3x + 2y + 4z = 12", "m", { fill: "fm" });
      return K.svg(640, 380, s);
    });

  add("dreip", "Drei Punkte bestimmen eine Ebene – wenn sie nicht auf einer Geraden liegen",
    "<b>Links:</b> Drei Punkte, die ein echtes Dreieck bilden, legen genau eine Ebene fest (darum wackelt ein dreibeiniger Tisch nicht). <b>Rechts:</b> Liegen sie auf einer Geraden, kann sich eine Ebene noch um diese Gerade <b>drehen</b> – unendlich viele Ebenen passen.",
    function(K){
      var s = K.panel(10, 10, 300, 300, "genau eine Ebene", "a") + K.panel(330, 10, 300, 300, "unendlich viele Ebenen", "m");
      s += K.poly([[40, 230], [220, 230], [280, 120], [100, 120]], "a", { fill: "fa", w: 1 });
      s += K.poly([[90, 210], [210, 200], [160, 140]], "a", { fill: "fa", w: 2.2 });
      [[90, 210, "A"], [210, 200, "B"], [160, 140, "C"]].forEach(function(p){ s += K.dot(p[0], p[1], "i", 5.5) + K.t(p[0] + (p[2] === "B" ? 14 : -12), p[1] - 10, p[2], "i", { it: true, b: true, s: 16 }); });
      var y = 175, xa = 375, xb = 560;
      [[25, -100, "fa"], [45, 55, "fm"], [-15, -55, "fm"], [30, 95, "fa"]].forEach(function(q){
        s += K.poly([[xa, y], [xb, y], [xb + q[0], y + q[1]], [xa + q[0], y + q[1]]], "f", { fill: q[2], w: 1 });
      });
      s += K.line(xa - 10, y, xb + 10, y, "m", { w: 2.6 });
      [[420, "A"], [470, "B"], [520, "C"]].forEach(function(p){ s += K.dot(p[0], y, "i", 5.5) + K.t(p[0], y + 20, p[1], "i", { it: true, b: true, s: 16 }); });
      return K.svg(640, 320, s);
    });

  add("gg", "Lage zweier Geraden zueinander",
    "Parameterformen gleichsetzen → LGS in t und s. <b>Eine Lösung:</b> Schnittpunkt. <b>Keine Lösung</b> und Richtungen parallel: parallel. <b>Unendlich viele:</b> identisch. <b>Keine Lösung, nicht parallel:</b> windschief – nur im Raum möglich, die Geraden laufen aneinander vorbei.",
    function(K){
      var s = "", w = 160, tt = ["Schnittpunkt", "parallel", "identisch", "windschief"],
          tx = [["genau eine", "Lösung (t, s)"], ["keine Lösung,", "r₁ ∥ r₂"], ["unendlich viele", "Lösungen"], ["keine Lösung,", "nicht parallel"]];
      for(var i = 0; i < 4; i++){
        var x0 = 10 + i * (w + 10);
        s += K.panel(x0, 10, w, 300, tt[i], i === 3 ? "m" : "s");
        s += lines(K, x0 + w / 2, 268, tx[i], "s", { a: "middle", s: 12, lh: 17 });
      }
      s += K.line(30, 200, 150, 90, "a", { w: 2.6 }) + K.line(30, 110, 150, 210, "c4", { w: 2.6 }) + K.dot(89.5, 145.5, "m", 6);
      s += K.line(195, 200, 320, 120, "a", { w: 2.6 }) + K.line(195, 150, 320, 70, "c4", { w: 2.6 });
      s += K.line(365, 200, 490, 90, "a", { w: 5 }) + K.line(365, 200, 490, 90, "c4", { w: 2, dash: "7 6" });
      s += K.line(530, 200, 670, 160, "a", { w: 2.6 });
      s += K.line(560, 90, 590, 166, "c4", { w: 2.6 }) + K.line(597, 184, 630, 250, "c4", { w: 2.6, dash: "5 4" });
      s += K.line(593, 175, 593, 140, "m", { w: 1.4, dash: "3 3" });
      s += K.t(640, 110, "darüber", "f", { s: 11 }) + K.t(650, 230, "darunter", "f", { s: 11 });
      return K.svg(690, 320, s);
    });

  add("ge", "Gerade und Ebene: Durchstoßpunkt?",
    "x, y, z der Geraden in die Ebenengleichung einsetzen → <b>eine Gleichung in t</b>. Eindeutige Lösung: <b>Durchstoßpunkt S</b>. Widerspruch (z. B. 2 = −1): Gerade läuft <b>parallel</b> daneben. Immer wahr (0 = 0): Gerade <b>liegt in der Ebene</b>.",
    function(K){
      var s = "", tt = ["Durchstoßpunkt", "parallel", "liegt in E"], tx = [["eine Lösung t", "→ Punkt S"], ["Widerspruch", "z. B. 2 = −1"], ["Identität 0 = 0", "∞ viele Punkte"]];
      for(var i = 0; i < 3; i++){
        var x0 = 10 + i * 220, pl = [[x0 + 15, 215], [x0 + 150, 215], [x0 + 195, 160], [x0 + 60, 160]];
        s += K.panel(x0, 10, 210, 300, tt[i], i === 0 ? "m" : "s");
        s += K.poly(pl, "a", { fill: "fa", w: 1 }) + K.t(x0 + 175, 200, "E", "a", { it: true, b: true });
        s += lines(K, x0 + 105, 262, tx[i], "s", { a: "middle", s: 12.5, lh: 18 });
      }
      s += K.line(115, 188, 145, 250, "c4", { w: 2.4, dash: "4 4" }) + K.line(75, 60, 115, 188, "c4", { w: 2.8 }) + K.dot(115, 188, "m", 6) + K.t(128, 182, "S", "m", { a: "start", it: true, b: true, s: 16 });
      s += K.line(250, 120, 400, 120, "c4", { w: 2.8 }) + K.line(250, 120, 250, 190, "f", { w: 1, dash: "3 3" }) + K.t(262, 150, "Abstand", "f", { a: "start", s: 11 });
      s += K.line(470, 205, 610, 170, "c4", { w: 3 });
      return K.svg(670, 320, s);
    });

  add("ee", "Lage zweier Ebenen",
    "Parameterform der einen in die parameterfreie Form der anderen einsetzen. Bleibt eine Gleichung zwischen t und s übrig: <b>Schnittgerade</b>. Widerspruch wie „1 = 2“: <b>parallel</b>. Wahre Aussage wie „1 = 1“: <b>identisch</b>.",
    function(K){
      var s = "", tt = ["Schnittgerade", "parallel", "identisch"], tx = [["Beziehung t ↔ s", "→ Gerade"], ["Widerspruch", "z. B. 1 = 2"], ["wahre Aussage", "z. B. 1 = 1"]];
      for(var i = 0; i < 3; i++){
        var x0 = 10 + i * 220;
        s += K.panel(x0, 10, 210, 300, tt[i], i === 0 ? "m" : "s");
        s += lines(K, x0 + 105, 262, tx[i], "s", { a: "middle", s: 12.5, lh: 18 });
      }
      s += K.poly([[25, 215], [165, 215], [200, 170], [60, 170]], "a", { fill: "fa", w: 1 });
      s += K.poly([[80, 205], [150, 178], [150, 58], [80, 85]], "c4", { fill: "fm", w: 1 });
      s += K.line(80, 205, 80, 232, "c4", { w: 1, dash: "3 3" }) + K.line(150, 178, 150, 205, "c4", { w: 1, dash: "3 3" });
      s += K.line(70, 209, 160, 174, "m", { w: 3.4 });
      s += K.poly([[245, 215], [385, 215], [420, 170], [280, 170]], "a", { fill: "fa", w: 1 }) + K.poly([[245, 135], [385, 135], [420, 90], [280, 90]], "c4", { fill: "fm", w: 1 });
      s += K.poly([[465, 205], [605, 205], [640, 160], [500, 160]], "a", { fill: "fa", w: 4 }) + K.poly([[465, 205], [605, 205], [640, 160], [500, 160]], "c4", { fill: "fm", w: 1.6, dash: "7 6" });
      return K.svg(670, 320, s);
    });

  add("wgg", "Winkel zwischen zwei Geraden",
    "Zwei sich schneidende Geraden bilden zwei Winkel: φ und 180° − φ. Der <b>Betrag</b> im Zähler macht cos φ positiv – so erhält man immer den <b>spitzen</b> Winkel (0° ≤ φ ≤ 90°). Berechnet wird er über die Richtungsvektoren r₁, r₂.",
    function(K){
      var Sx = 290, Sy = 170, s = "", d = function(a, L){ var r = a * Math.PI / 180; return [Sx + L * Math.cos(r), Sy - L * Math.sin(r)]; };
      var a1 = d(15, 250), a2 = d(195, 250), b1 = d(70, 160), b2 = d(250, 160);
      s += K.line(a2[0], a2[1], a1[0], a1[1], "a", { w: 2.2 }) + K.line(b2[0], b2[1], b1[0], b1[1], "c4", { w: 2.2 });
      s += K.arc(Sx, Sy, 46, 15, 70, "m", { w: 2.6 }) + K.arc(Sx, Sy, 34, 70, 195, "f", { w: 1.6 });
      var r1 = d(15, 120), r2 = d(70, 110);
      s += K.arrow(Sx, Sy, r1[0], r1[1], "a", { w: 3.4 }) + K.arrow(Sx, Sy, r2[0], r2[1], "c4", { w: 3.4 });
      s += K.v(r1[0] + 4, r1[1] + 18, "r₁", "a") + K.v(r2[0] + 18, r2[1] + 4, "r₂", "c4");
      s += K.t(Sx + 62, Sy - 32, "φ", "m", { it: true, b: true, s: 19 }) + K.t(Sx - 44, Sy - 32, "180° − φ", "f", { s: 13 });
      s += K.dot(Sx, Sy, "i", 4.5);
      s += K.f(170, 40, "cos φ = |⟨r₁, r₂⟩| / (|r₁|·|r₂|)", "m", { fill: "fm" });
      return K.svg(620, 325, s);
    });

  add("wee", "Winkel zwischen zwei Ebenen (Seitenansicht)",
    "Von der Seite gesehen sind die Ebenen Linien. Ihre <b>Normalenvektoren</b> stehen jeweils senkrecht darauf – deshalb schließen n₁ und n₂ <b>denselben Winkel φ</b> ein wie die Ebenen selbst. Darum: cos φ = |⟨n₁, n₂⟩| / (|n₁|·|n₂|).",
    function(K){
      var S = [330, 230], s = "", d = function(a, L){ var r = a * Math.PI / 180; return [S[0] + L * Math.cos(r), S[1] - L * Math.sin(r)]; };
      var e1a = d(0, 280), e1b = d(180, 280), e2a = d(50, 210), e2b = d(230, 110);
      s += K.line(e1b[0], e1b[1], e1a[0], e1a[1], "a", { w: 4 }) + K.line(e2b[0], e2b[1], e2a[0], e2a[1], "c4", { w: 4 });
      s += K.t(e1a[0] - 10, e1a[1] + 18, "E₁", "a", { a: "end", it: true, b: true, s: 16 }) + K.t(e2a[0] + 6, e2a[1] + 4, "E₂", "c4", { a: "start", it: true, b: true, s: 16 });
      s += K.arc(S[0], S[1], 70, 0, 50, "i", { w: 1.8 }) + K.t(S[0] + 90, S[1] - 28, "φ", "i", { it: true, b: true, s: 18 });
      var n1 = d(90, 120), n2 = d(140, 120);
      s += K.arrow(S[0], S[1], n1[0], n1[1], "a", { w: 3, dash: "7 4" }) + K.arrow(S[0], S[1], n2[0], n2[1], "c4", { w: 3, dash: "7 4" });
      s += K.ra(S[0], S[1], n1[0], n1[1], e1a[0], e1a[1], 12, "a") + K.ra(S[0], S[1], n2[0], n2[1], e2a[0], e2a[1], 12, "c4");
      s += K.arc(S[0], S[1], 52, 90, 140, "m", { w: 2.6 }) + K.t(S[0] - 18, S[1] - 72, "φ", "m", { it: true, b: true, s: 18 });
      s += K.v(n1[0] + 16, n1[1] + 6, "n₁", "a") + K.v(n2[0] - 14, n2[1] - 8, "n₂", "c4");
      s += K.f(170, 40, "cos φ = |⟨n₁, n₂⟩| / (|n₁|·|n₂|)", "m", { fill: "fm" });
      return K.svg(640, 325, s);
    });

  add("wge", "Winkel Gerade/Ebene: warum der Sinus?",
    "Gesucht ist φ zwischen Gerade und Ebene. Das Skalarprodukt von r mit dem <b>Normalenvektor n</b> liefert aber den Winkel zwischen r und n – und der ist <b>90° − φ</b>. Weil cos(90° − φ) = sin φ, steht in der Formel der <b>Sinus</b>.",
    function(K){
      var S = [280, 240], s = "", d = function(a, L){ var r = a * Math.PI / 180; return [S[0] + L * Math.cos(r), S[1] - L * Math.sin(r)]; };
      s += K.line(40, 240, 600, 240, "a", { w: 4 }) + K.t(590, 260, "E (von der Seite)", "a", { a: "end", s: 13, b: true });
      var g1 = d(35, 230), g0 = d(215, 120);
      s += K.line(S[0], S[1], g0[0], g0[1], "c4", { w: 2.2, dash: "6 4" }) + K.arrow(S[0], S[1], g1[0], g1[1], "c4", { w: 3 }) + K.v(g1[0] + 6, g1[1] + 18, "r", "c4");
      var n = d(90, 175);
      s += K.arrow(S[0], S[1], n[0], n[1], "m", { w: 3 }) + K.v(n[0] - 16, n[1] + 10, "n", "m") + K.ra(S[0], S[1], n[0], n[1], 600, 240, 12, "m");
      s += K.arc(S[0], S[1], 80, 0, 35, "a", { w: 2.6 }) + K.t(S[0] + 100, S[1] - 24, "φ", "a", { it: true, b: true, s: 19 });
      s += K.arc(S[0], S[1], 58, 35, 90, "c3", { w: 2.6 }) + K.t(S[0] + 42, S[1] - 88, "90° − φ", "c3", { a: "start", s: 14, b: true });
      s += K.dot(S[0], S[1], "i", 5) + K.t(S[0] - 10, S[1] + 18, "S", "i", { it: true, b: true });
      s += K.f(450, 300, "sin φ = |⟨r, n⟩| / (|r|·|n|)", "m", { fill: "fm" });
      return K.svg(640, 325, s);
    });

  add("lot", "Lotgerade auf eine Ebene: g: x = P + t·n",
    "Die kürzeste Verbindung von P zur Ebene steht <b>senkrecht</b> auf ihr – also in Richtung des <b>Normalenvektors n</b>. Darum ist g: x = P + t·n das Lot. Setzt man g in E ein, erhält man den <b>Lotfußpunkt F</b> (Durchstoßpunkt).",
    function(K){
      var P = K.p3(160, 260, 55, 0.8), s = "";
      s += K.poly3(P, [[-1, -0.5, 0], [3, -0.5, 0], [3, 6, 0], [-1, 6, 0]], "a", { fill: "fa", w: 1 });
      var Q = [1.2, 3, 2.8], F = [1.2, 3, 0], q = at(P, Q), f = at(P, F), under = at(P, [1.2, 3, -0.9]), side = at(P, [1.2, 4.5, 0]);
      s += K.line(f[0], f[1], under[0], under[1], "c4", { w: 2, dash: "5 4" }) + K.line(q[0], q[1], f[0], f[1], "c4", { w: 2.6 });
      s += K.ra(f[0], f[1], q[0], q[1], side[0], side[1], 13, "m");
      var nE = at(P, [1.2, 3, 1.8]);
      s += K.arrow(q[0], q[1], nE[0], nE[1], "m", { w: 3.4 }) + K.v(nE[0] - 18, (q[1] + nE[1]) / 2, "n", "m");
      s += K.dot(q[0], q[1], "i", 5.5) + K.t(q[0] + 12, q[1] - 4, "P", "i", { a: "start", it: true, b: true, s: 17 });
      s += K.dot(f[0], f[1], "m", 5.5) + K.t(f[0] + 14, f[1] + 12, "F (Lotfußpunkt)", "m", { a: "start", s: 14, b: true });
      s += K.v(q[0] + 20, (q[1] + f[1]) / 2 + 18, "g", "c4");
      s += K.f(480, 60, "g: x = P + t·n", "m", { fill: "fm" }) + K.t(480, 92, "F = g ∩ E", "s", { s: 14 });
      return K.svg(640, 340, s);
    });
})();
