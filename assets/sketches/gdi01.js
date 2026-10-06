/* Skizzen zu GDI01 – Einführung in die Informatik.
   Jede Skizze: t = Titel, c = Lesehilfe (HTML), svg = function(K) → SVG-String (K = window.SK). */
(function(){
  "use strict";
  var S = window.ITI_SKETCHES = window.ITI_SKETCHES || {};
  function add(id, t, c, f){ S["gdi01-" + id] = { t: t, c: c, svg: f }; }
  var W = { w: 1.8 };
  function wire(K, pts, c){ return K.path("M" + pts.map(function(p){ return p[0] + " " + p[1]; }).join(" L"), c || "i", W); }
  /* waagrechte Leitung mit Brücke (keine Verbindung) bei xc */
  function hop(K, x1, y, x2, xc, c){ return K.path("M" + x1 + " " + y + " L" + (xc - 6) + " " + y + " A6 6 0 0 1 " + (xc + 6) + " " + y + " L" + x2 + " " + y, c || "i", W); }
  function box(K, x, y, w, h, lab, c, o){ o = o || {}; return K.cell(x, y, lab, c || "a", { w: w, h: h, fill: o.fill, s: o.s || 14, tc: o.tc, rx: o.rx === undefined ? 4 : o.rx }); }
  function dia(K, x, y, w, h, lab, c){ return K.poly([[x, y - h / 2], [x + w / 2, y], [x, y + h / 2], [x - w / 2, y]], c || "c4", { fill: "p", w: 1.8 }) + K.t(x, y + 1, lab, "i", { s: 13.5, b: true, halo: false }); }
  function down(K, x, y1, y2, c){ return K.arrow(x, y1, x, y2, c || "s", { w: 1.8, head: 9 }); }
  function right(K, x1, x2, y, c){ return K.arrow(x1, y, x2, y, c || "s", { w: 1.8, head: 9 }); }
  /* Bitreihe: x0 = Mitte der ersten Zelle */
  function bits(K, x0, y, arr, cw, o){
    o = o || {}; var s = "";
    for(var i = 0; i < arr.length; i++){
      var c = (o.c && o.c[i]) || o.cc || "a";
      s += K.cell(x0 + i * cw, y, String(arr[i]), c, { w: cw - (o.gap === undefined ? 6 : o.gap), h: o.h || 32, fill: (o.f && o.f[i]) || o.ff || "p", s: o.s || 16, tc: (o.tc && o.tc[i]) || o.tcc || "i" });
    }
    return s;
  }
  /* Gatter (Eingänge links bei y ± 11, Ausgang rechts) */
  function gAND(K, x0, y){ return K.path("M" + x0 + " " + (y - 22) + " L" + (x0 + 22) + " " + (y - 22) + " A22 22 0 0 1 " + (x0 + 22) + " " + (y + 22) + " L" + x0 + " " + (y + 22) + " Z", "a", { fill: "fa", w: 2 }) + K.t(x0 + 19, y + 1, "∧", "a", { s: 16, b: true, halo: false }); }            /* Ausgang x0+44 */
  function orPath(x0, y){ return "M" + x0 + " " + (y - 22) + " Q" + (x0 + 30) + " " + (y - 22) + " " + (x0 + 50) + " " + y + " Q" + (x0 + 30) + " " + (y + 22) + " " + x0 + " " + (y + 22) + " Q" + (x0 + 12) + " " + y + " " + x0 + " " + (y - 22) + " Z"; }
  function gOR(K, x0, y){ return K.path(orPath(x0, y), "a", { fill: "fa", w: 2 }) + K.t(x0 + 22, y + 1, "∨", "a", { s: 16, b: true, halo: false }); }   /* Eingänge enden bei x0+4.5, Ausgang x0+50 */
  function gXOR(K, x0, y){ return K.path(orPath(x0 + 8, y), "a", { fill: "fa", w: 2 }) + K.path("M" + x0 + " " + (y - 22) + " Q" + (x0 + 12) + " " + y + " " + x0 + " " + (y + 22), "a", { w: 2 }) + K.t(x0 + 30, y + 1, "⊕", "a", { s: 16, b: true, halo: false }); } /* Ausgang x0+58 */
  function gNOT(K, x0, y){ return K.poly([[x0, y - 17], [x0, y + 17], [x0 + 30, y]], "a", { fill: "fa", w: 2 }) + K.circ(x0 + 35, y, 5, "a", { fill: "p", w: 2 }); } /* Ausgang x0+40 */
  function ell(K, x, y, rx, ry, c, o){ return K.path("M" + (x - rx) + " " + y + " A" + rx + " " + ry + " 0 1 0 " + (x + rx) + " " + y + " A" + rx + " " + ry + " 0 1 0 " + (x - rx) + " " + y, c, o); }
  function bracket(K, x1, x2, y, h, c){ return K.path("M" + x1 + " " + (y + h) + " L" + x1 + " " + y + " L" + x2 + " " + y + " L" + x2 + " " + (y + h), c, { w: 1.6 }); }

  /* ═════════ Kapitel 1: Informatik und Algorithmen ═════════ */

  add("eva", "EVA-Prinzip: Eingabe → Verarbeitung → Ausgabe",
    "Jede Datenverarbeitung hat dieselbe <b>Form</b>: Daten kommen <b>herein</b>, werden <b>umgeformt</b> und gehen als Ergebnis <b>hinaus</b>. Im Beispiel kommen 3 und 4 herein, der Prozessor addiert, heraus kommt 7 – beim Taschenrechner genauso wie beim Großrechner.",
    function(K){
      var s = K.t(320, 30, "Daten fließen immer in dieselbe Richtung", "s", { s: 13.5 });
      var X = [110, 320, 530], N = ["Eingabe", "Verarbeitung", "Ausgabe"], C = ["c3", "a", "m"], E = ["3 und 4", "3 + 4", "7"],
          D = ["Tastatur, Sensor", "Prozessor (CPU)", "Bildschirm, Drucker"], F = ["p", "fa", "fm"];
      for(var i = 0; i < 3; i++){
        s += K.cell(X[i], 110, N[i], C[i], { w: 160, h: 66, fill: F[i], s: 17 });
        s += K.f(X[i], 182, E[i], C[i], { fill: "p" });
        s += K.t(X[i], 228, D[i], "s", { s: 13 });
      }
      s += K.arrow(193, 110, 237, 110, "i", { w: 2.4 }) + K.arrow(403, 110, 447, 110, "i", { w: 2.4 });
      return K.svg(640, 255, s);
    });

  add("endlich", "Endlichkeit: die Beschreibung ist endlich lang",
    "<b>Links</b> drei Zeilen, die für <b>jedes</b> x funktionieren – der Text ist zu Ende, obwohl es unendlich viele Eingaben gibt. <b>Rechts</b> der Versuch, jeden Fall einzeln aufzuschreiben: Diese Liste würde <b>nie fertig</b>. Ein Algorithmus braucht eine endliche Beschreibung.",
    function(K){
      var s = K.panel(10, 10, 305, 250, "endlich beschrieben ✓", "a") + K.panel(325, 10, 305, 250, "nicht endlich beschreibbar ✗", "m");
      ["1. lies x", "2. y ← 2 · x", "3. gib y aus"].forEach(function(l, i){ s += box(K, 162, 70 + i * 45, 220, 34, l, "a"); });
      s += K.t(162, 210, "3 Zeilen – gilt für jedes x", "a", { s: 13, b: true }) + K.t(162, 234, "der Text ist zu Ende", "s", { s: 13 });
      ["wenn x = 1: gib 2 aus", "wenn x = 2: gib 4 aus", "wenn x = 3: gib 6 aus"].forEach(function(l, i){ s += box(K, 477, 70 + i * 45, 250, 34, l, "s"); });
      s += K.t(477, 198, "⋮", "m", { s: 22, b: true }) + K.t(477, 234, "die Liste würde nie fertig", "m", { s: 13, b: true });
      return K.svg(640, 270, s);
    });

  add("ausfuehr", "Ausführbarkeit: jeder Schritt muss machbar sein",
    "Ein Algorithmus darf nur Schritte enthalten, die man <b>tatsächlich ausführen</b> kann. Links ist jeder Schritt eine einfache Rechnung. Rechts verlangt Schritt 2 „die größte Primzahl“ – die <b>gibt es nicht</b>, also kann niemand diesen Schritt ausführen.",
    function(K){
      var s = K.panel(10, 10, 305, 240, "jeder Schritt machbar ✓", "a") + K.panel(325, 10, 305, 240, "Schritt nicht ausführbar ✗", "m");
      ["a ← 7", "b ← a + 5", "gib b aus"].forEach(function(l, i){ s += box(K, 140, 70 + i * 45, 170, 34, l, "a") + K.t(250, 70 + i * 45, "✓", "a", { s: 18, b: true }); });
      s += K.t(162, 214, "Ausgabe: 12", "a", { s: 13.5, b: true });
      s += box(K, 455, 70, 200, 34, "a ← 7", "a") + K.t(580, 70, "✓", "a", { s: 18, b: true });
      s += box(K, 455, 115, 200, 34, "b ← größte Primzahl", "m", { fill: "fm" }) + K.t(580, 115, "✗", "m", { s: 18, b: true });
      s += box(K, 455, 160, 200, 34, "gib b aus", "f", { tc: "f" }) + K.t(580, 160, "?", "f", { s: 18, b: true });
      s += K.t(477, 204, "es gibt keine größte Primzahl –", "m", { s: 12.5 }) + K.t(477, 224, "Schritt 2 kann niemand ausführen", "m", { s: 12.5, b: true });
      return K.svg(640, 260, s);
    });

  add("eindeutig", "Eindeutigkeit (Determiniertheit): gleiche Eingabe → gleiches Ergebnis",
    "Wird der Algorithmus <b>zweimal mit derselben Eingabe</b> gestartet, kommt <b>beide Male dasselbe</b> heraus (oben: 5 → 25). Unten das Gegenbeispiel: Wer einen Würfelwurf hinzunimmt, bekommt bei gleicher Eingabe mal 6, mal 11 – das ist <b>nicht determiniert</b>.",
    function(K){
      var s = "";
      [65, 135].forEach(function(y, i){
        s += K.t(70, y - 30, "Lauf " + (i + 1), "f", { s: 12 });
        s += K.f(70, y, "x = 5", "c3", { fill: "p" }) + right(K, 104, 172, y) + box(K, 260, y, 170, 40, "Algorithmus: x²", "a", { fill: "fa" });
        s += right(K, 349, 412, y) + K.cell(445, y, "25", "a", { w: 60, h: 36, s: 16 });
      });
      s += K.path("M488 65 L500 65 L500 135 L488 135", "a", { w: 1.6 }) + K.t(510, 100, "immer 25 ✓", "a", { a: "start", s: 14, b: true });
      s += K.line(20, 180, 620, 180, "f", { w: 1, dash: "5 5" });
      s += K.t(70, 203, "Gegenbeispiel", "m", { s: 12 });
      s += K.f(70, 232, "x = 5", "c3", { fill: "p" }) + right(K, 104, 172, 232) + box(K, 260, 232, 170, 40, "x + Würfelwurf", "m", { fill: "fm" });
      s += right(K, 349, 400, 232) + K.cell(445, 232, "6 … 11", "m", { w: 80, h: 36, s: 14 });
      s += K.t(495, 232, "✗ zufällig", "m", { a: "start", s: 14, b: true });
      return K.svg(640, 265, s);
    });

  function tflow(K, ox, ok){
    var cx = ox + 120, s = "";
    s += box(K, cx, 62, 110, 30, "n ← 3", "a") + down(K, cx, 77, 99);
    s += dia(K, cx, 125, 120, 50, "n > 0 ?");
    s += down(K, cx, 150, 180) + K.t(cx + 10, 165, "ja", "s", { a: "start", s: 12.5 });
    s += box(K, cx, 197, 120, 32, ok ? "n ← n − 1" : "n ← n + 1", ok ? "a" : "m", { fill: ok ? "fa" : "fm" });
    s += wire(K, [[cx - 60, 197], [ox + 25, 197], [ox + 25, 125]], "s") + right(K, ox + 25, cx - 61, 125);
    s += right(K, cx + 60, cx + 100, 125) + K.t(cx + 80, 112, "nein", "s", { s: 12.5 });
    if(ok) s += box(K, cx + 130, 125, 56, 30, "Ende", "a", { fill: "fa", s: 13 });
    else s += K.rect(cx + 102, 110, 56, 30, "f", { dash: "4 4" }) + K.t(cx + 130, 126, "Ende", "f", { s: 13, b: true });
    s += K.t(ox + 152, 255, ok ? "n: 3 → 2 → 1 → 0 → Ende" : "n: 3 → 4 → 5 → 6 → … nie Ende", ok ? "a" : "m", { s: 13.5, b: true });
    return s;
  }
  add("termin", "Terminierung: nach endlich vielen Schritten ist Schluss",
    "Beide Abläufe haben eine Schleife. <b>Links</b> wird n bei jedem Durchlauf <b>kleiner</b>, irgendwann ist n = 0 und der Ablauf <b>endet</b>. <b>Rechts</b> wird n immer größer – die Bedingung n &gt; 0 bleibt wahr, der Ablauf läuft <b>endlos</b>. Ein Algorithmus muss terminieren.",
    function(K){
      var s = K.panel(10, 10, 305, 275, "terminiert ✓", "a") + K.panel(325, 10, 305, 275, "terminiert nie ✗", "m");
      s += tflow(K, 10, true) + tflow(K, 325, false);
      return K.svg(640, 295, s);
    });

  add("allgemein", "Allgemeinheit: eine ganze Klasse von Problemen",
    "Ein Algorithmus löst nicht nur <b>einen Einzelfall</b> (links: nur 3 + 4), sondern <b>alle Fälle derselben Art</b>. Rechts nimmt dieselbe Vorschrift a + b beliebige Zahlenpaare an – jedes Paar ist eine <b>Instanz</b> der Problemklasse „zwei Zahlen addieren“.",
    function(K){
      var s = K.panel(10, 10, 240, 250, "nur ein Einzelfall ✗", "m") + K.panel(265, 10, 365, 250, "ganze Problemklasse ✓", "a");
      s += K.f(130, 82, "3, 4", "c3", { fill: "p" }) + down(K, 130, 98, 128);
      s += box(K, 130, 155, 150, 44, "gibt 7 aus", "m", { fill: "fm" });
      s += K.t(130, 210, "löst nur 3 + 4", "m", { s: 13, b: true }) + K.t(130, 232, "für 5 + 8 nutzlos", "s", { s: 13 });
      var ins = ["3, 4", "10, 25", "2, 9"], outs = ["7", "35", "11"];
      for(var i = 0; i < 3; i++){
        var y = 90 + i * 55;
        s += K.f(320, y, ins[i], "c3", { fill: "p" }) + right(K, 358, 413, y) + right(K, 527, 562, y);
        s += K.cell(590, y, outs[i], "a", { w: 50, h: 32 });
      }
      s += K.rect(415, 75, 110, 130, "a", { fill: "fa", w: 2 }) + K.t(470, 125, "Algorithmus", "s", { s: 12 }) + K.t(470, 152, "a + b", "a", { s: 18, b: true });
      s += K.t(447, 240, "eine Vorschrift für alle Paare (a, b)", "a", { s: 13, b: true });
      return K.svg(640, 270, s);
    });

  add("prog", "Vom Problem zum Programm: Analyse → Entwurf → Implementierung",
    "Die drei Schritte beantworten drei Fragen: <b>Was</b> ist gegeben und gesucht (Analyse)? <b>Wie</b> löst man es Schritt für Schritt (Algorithmenentwurf)? Und wie sagt man es dem <b>Rechner</b> (Implementierung in einer Programmiersprache)? Beispiel: die größte Zahl einer Liste.",
    function(K){
      var s = K.t(320, 30, "Beispiel: größte Zahl einer Liste finden", "s", { s: 13.5 });
      var X = [110, 320, 530], N = ["Problemanalyse", "Algorithmenentwurf", "Implementierung"], C = ["c3", "c4", "a"],
          A = ["E: Liste · A: Maximum", "größten Wert merken", "if x > m: m = x"], Q = ["Was ist gegeben, was gesucht?", "Wie, Schritt für Schritt?", "Wie sagt man es dem Rechner?"];
      for(var i = 0; i < 3; i++){
        s += K.cell(X[i], 92, N[i], C[i], { w: 180, h: 56, s: 15, fill: i === 2 ? "fa" : "p" });
        s += K.f(X[i], 165, A[i], C[i], { s: 13, fill: "p" });
        s += K.t(X[i], 218, Q[i], "s", { s: 12.5 });
      }
      s += K.arrow(203, 92, 227, 92, "i", { w: 2.4 }) + K.arrow(413, 92, 437, 92, "i", { w: 2.4 });
      return K.svg(640, 245, s);
    });

  /* ═════════ Kapitel 2: Umsetzung von Algorithmen ═════════ */

  add("sequenz", "Sequenz: Anweisungen nacheinander",
    "Die einfachste Kontrollstruktur: Die Anweisungen werden <b>von oben nach unten</b>, jede <b>genau einmal</b>, abgearbeitet. Links als Ablaufplan mit Pfeilen, rechts als <b>Struktogramm</b> (gestapelte Kästen). Aus a = 2 wird b = 6, ausgegeben wird 6.",
    function(K){
      var s = K.panel(10, 10, 290, 280, "Ablaufplan") + K.panel(320, 10, 310, 280, "Struktogramm");
      ["a ← 2", "b ← a · 3", "gib b aus"].forEach(function(l, i){ s += box(K, 155, 70 + i * 65, 140, 36, l, i === 2 ? "m" : "a", { fill: i === 2 ? "fm" : "p" }); });
      s += down(K, 155, 88, 117) + down(K, 155, 153, 182);
      s += K.t(155, 255, "Ausgabe: 6", "m", { s: 14, b: true });
      ["a ← 2", "b ← a · 3", "gib b aus"].forEach(function(l, i){
        s += K.rect(370, 55 + i * 45, 210, 45, "a", { rx: 0, w: 1.6 }) + K.t(475, 78 + i * 45, l, "i", { s: 14, b: true, halo: false });
      });
      s += K.t(475, 215, "von oben nach unten,", "s", { s: 13 }) + K.t(475, 237, "jede Zeile genau einmal", "s", { s: 13 });
      return K.svg(640, 300, s);
    });

  add("selektion", "Selektion (if/else): nur ein Zweig wird ausgeführt",
    "An der <b>Raute</b> wird eine Bedingung geprüft; je nach Ergebnis läuft <b>genau einer</b> der beiden Zweige. Das Beispiel berechnet den Betrag: Für x = −4 ist „x ≥ 0“ falsch, also läuft der <b>nein-Zweig</b> (rot) und y wird 4. Im Struktogramm steht die Bedingung im Dreieck, die Zweige nebeneinander.",
    function(K){
      var s = K.panel(10, 10, 320, 295, "Ablaufplan") + K.panel(345, 10, 285, 295, "Struktogramm");
      s += dia(K, 170, 80, 130, 54, "x ≥ 0 ?");
      s += wire(K, [[105, 80], [65, 80]], "s") + down(K, 65, 80, 128) + K.t(85, 67, "ja", "s", { s: 12.5 });
      s += box(K, 65, 146, 90, 34, "y ← x", "a");
      s += wire(K, [[235, 80], [275, 80]], "m") + down(K, 275, 80, 128, "m") + K.t(255, 67, "nein", "m", { s: 12.5, b: true });
      s += box(K, 275, 146, 90, 34, "y ← −x", "m", { fill: "fm" });
      s += wire(K, [[65, 163], [65, 200], [275, 200], [275, 163]], "s") + down(K, 170, 200, 222);
      s += box(K, 170, 240, 120, 34, "gib y aus", "a");
      s += K.t(170, 284, "x = −4: nein-Zweig ⇒ y = 4", "m", { s: 13, b: true });
      s += K.rect(365, 50, 245, 160, "a", { rx: 0, w: 1.6 });
      s += K.line(365, 50, 487.5, 105, "a", { w: 1.4 }) + K.line(610, 50, 487.5, 105, "a", { w: 1.4 }) + K.line(365, 105, 610, 105, "a", { w: 1.4 });
      s += K.t(487.5, 68, "x ≥ 0 ?", "i", { s: 14, b: true }) + K.t(385, 93, "ja", "s", { s: 12.5 }) + K.t(588, 93, "nein", "m", { s: 12.5, b: true });
      s += K.line(487.5, 105, 487.5, 165, "a", { w: 1.4 }) + K.line(365, 165, 610, 165, "a", { w: 1.4 });
      s += K.t(426, 135, "y ← x", "i", { s: 14, b: true }) + K.rect(489, 106.5, 120, 57, "m", { fill: "fm", rx: 0, w: 0.1 }) + K.t(548, 135, "y ← −x", "m", { s: 14, b: true });
      s += K.t(487.5, 188, "gib y aus", "i", { s: 14, b: true });
      s += K.t(487.5, 245, "Bedingung oben, Zweige daneben –", "s", { s: 12.5 }) + K.t(487.5, 265, "nur einer wird ausgeführt", "s", { s: 12.5 });
      return K.svg(640, 315, s);
    });

  add("iteration", "Iteration (while): wiederholen, solange die Bedingung gilt",
    "Nach dem Schleifenrumpf führt der Pfeil <b>zurück zur Bedingung</b> – das ist die Form einer Schleife. Die Tabelle rechts verfolgt die Werte: s sammelt 1 + 2 + 3. Sobald i = 4 ist, wird „i ≤ 3“ falsch, die Schleife <b>endet</b> und 6 wird ausgegeben.",
    function(K){
      var s = box(K, 170, 45, 150, 32, "i ← 1,  s ← 0", "a") + down(K, 170, 61, 99);
      s += dia(K, 170, 125, 120, 50, "i ≤ 3 ?");
      s += down(K, 170, 150, 184) + K.t(180, 166, "ja", "s", { a: "start", s: 12.5 });
      s += K.rect(95, 185, 150, 50, "c3", { w: 1.6 }) + K.t(170, 199, "s ← s + i", "i", { s: 14, b: true, halo: false }) + K.t(170, 221, "i ← i + 1", "i", { s: 14, b: true, halo: false });
      s += wire(K, [[95, 210], [45, 210], [45, 125]], "c3") + K.arrow(45, 125, 109, 125, "c3", { w: 1.8, head: 9 });
      s += K.t(70, 198, "zurück", "c3", { s: 12 });
      s += right(K, 230, 272, 125) + K.t(251, 112, "nein", "s", { s: 12.5 });
      s += box(K, 318, 125, 86, 32, "gib s aus", "m", { s: 13 });
      s += K.t(190, 268, "wiederholen, solange i ≤ 3", "s", { s: 13 });
      var cols = [440, 515, 575], hd = ["Stand", "i", "s"], rows = [["Start", 1, 0], ["nach 1.", 2, 1], ["nach 2.", 3, 3], ["nach 3.", 4, 6]];
      for(var c = 0; c < 3; c++) s += K.cell(cols[c], 50, hd[c], "s", { w: c ? 56 : 80, h: 30, fill: "fa", s: 13 });
      rows.forEach(function(r, j){
        for(var c = 0; c < 3; c++) s += K.cell(cols[c], 85 + j * 35, String(r[c]), j === 3 ? "m" : "a", { w: c ? 56 : 80, h: 30, s: c ? 15 : 13, fill: j === 3 ? "fm" : "p" });
      });
      s += K.t(505, 235, "4 ≤ 3? nein ⇒ Ausgabe 6", "m", { s: 13, b: true });
      return K.svg(620, 290, s);
    });

  add("klasse", "Klasse = Bauplan, Objekte = konkrete Exemplare",
    "Die <b>Klasse</b> Konto (links) legt fest, welche <b>Attribute</b> (inhaber, saldo) und <b>Methoden</b> (einzahlen, abheben) jedes Konto hat – aber noch keine Werte. Die <b>Objekte</b> k1 und k2 (rechts) sind Instanzen davon: gleicher Aufbau, eigene Werte.",
    function(K){
      var s = K.rect(30, 45, 200, 38, "a", { fill: "fa", rx: 0, w: 2 }) + K.t(130, 64, "Konto", "a", { s: 16, b: true, halo: false });
      s += K.rect(30, 83, 200, 62, "a", { rx: 0, w: 2 }) + K.rect(30, 145, 200, 62, "a", { rx: 0, w: 2 });
      s += K.t(45, 103, "− inhaber", "i", { a: "start", s: 13.5, halo: false }) + K.t(45, 126, "− saldo", "i", { a: "start", s: 13.5, halo: false });
      s += K.t(45, 165, "+ einzahlen(betrag)", "i", { a: "start", s: 13.5, halo: false }) + K.t(45, 188, "+ abheben(betrag)", "i", { a: "start", s: 13.5, halo: false });
      s += K.t(130, 235, "Klasse = Bauplan", "a", { s: 14, b: true });
      var ob = [["k1 : Konto", "„Anna“", "100", 40], ["k2 : Konto", "„Ben“", "250", 160]];
      ob.forEach(function(o){
        var y = o[3];
        s += K.rect(400, y, 210, 90, "c3", { w: 1.8 }) + K.t(505, y + 20, o[0], "c3", { s: 14, b: true, halo: false }) + K.line(465, y + 30, 545, y + 30, "c3", { w: 1.2 });
        s += K.t(415, y + 50, "inhaber = " + o[1], "i", { a: "start", s: 13.5, halo: false }) + K.t(415, y + 72, "saldo = " + o[2], "i", { a: "start", s: 13.5, halo: false });
      });
      s += K.arrow(398, 85, 234, 105, "s", { w: 1.6, dash: "6 5", head: 10 }) + K.arrow(398, 205, 234, 160, "s", { w: 1.6, dash: "6 5", head: 10 });
      s += K.t(340, 136, "Instanz von", "s", { s: 12.5 });
      s += K.t(505, 278, "Objekte = konkrete Exemplare", "c3", { s: 14, b: true });
      return K.svg(640, 295, s);
    });

  add("oopkonz", "Kapselung · Vererbung · Polymorphie",
    "<b>Kapselung</b>: Die Daten (saldo) sind im Objekt verborgen, von außen kommt man nur über Methoden heran. <b>Vererbung</b>: Kreis und Rechteck übernehmen alles von Form. <b>Polymorphie</b>: Derselbe Aufruf fläche() rechnet je nach Objekt anders – π·r² oder a·b.",
    function(K){
      var s = K.panel(10, 10, 200, 280, "Kapselung", "a") + K.panel(220, 10, 200, 280, "Vererbung", "c4") + K.panel(430, 10, 200, 280, "Polymorphie", "c3");
      s += K.rect(30, 45, 160, 140, "a", { fill: "fa", w: 2, rx: 10 }) + K.t(110, 60, "Objekt", "a", { s: 12.5, b: true, halo: false });
      s += K.cell(110, 95, "saldo = 100", "m", { w: 120, h: 30, s: 13 }) + K.t(110, 122, "privat", "m", { s: 12 });
      s += K.cell(110, 160, "einzahlen()", "a", { w: 120, h: 30, s: 13 });
      s += K.arrow(110, 238, 110, 178, "c3", { w: 2.2 });
      s += K.t(110, 254, "Zugriff von außen", "s", { s: 12.5 }) + K.t(110, 273, "nur über Methoden", "s", { s: 12.5 });
      s += K.rect(265, 50, 110, 56, "c4", { w: 1.8 }) + K.t(320, 67, "Form", "c4", { s: 14, b: true, halo: false }) + K.t(320, 91, "fläche()", "i", { s: 12.5, halo: false });
      s += K.cell(270, 190, "Kreis", "c4", { w: 84, h: 34, s: 13 }) + K.cell(372, 190, "Rechteck", "c4", { w: 90, h: 34, s: 13 });
      s += K.arrow(270, 172, 305, 110, "c4", { w: 1.8, head: 10 }) + K.arrow(372, 172, 335, 110, "c4", { w: 1.8, head: 10 });
      s += K.t(320, 150, "erbt", "s", { s: 12.5 });
      s += K.t(320, 240, "Kind übernimmt alles", "s", { s: 12.5 }) + K.t(320, 259, "und kann mehr", "s", { s: 12.5 });
      s += K.f(530, 60, "f.fläche()", "c3", { fill: "p" });
      s += K.arrow(510, 76, 486, 118, "c3", { w: 1.8, head: 10 }) + K.arrow(550, 76, 574, 118, "c3", { w: 1.8, head: 10 });
      s += K.rect(440, 122, 88, 64, "c3") + K.rect(532, 122, 88, 64, "c3");
      s += K.t(484, 142, "Kreis", "i", { s: 13, b: true, halo: false }) + K.t(484, 166, "π · r²", "c3", { s: 14, b: true, halo: false });
      s += K.t(576, 142, "Rechteck", "i", { s: 13, b: true, halo: false }) + K.t(576, 166, "a · b", "c3", { s: 14, b: true, halo: false });
      s += K.t(530, 240, "gleicher Aufruf –", "s", { s: 12.5 }) + K.t(530, 259, "anderes Verhalten", "s", { s: 12.5 });
      return K.svg(640, 300, s);
    });

  add("komplex", "Komplexität: wie die Schrittzahl mit n wächst",
    "Waagrecht die Eingabegröße n, senkrecht die Anzahl der Schritte. Ein Algorithmus, der <b>jedes Element einmal</b> ansieht, wächst <b>gerade</b> (n). Einer, der <b>jedes Paar</b> vergleicht, wächst <b>quadratisch</b> (n²) und schießt nach oben. Wer den Bereich immer <b>halbiert</b>, wächst kaum (log₂ n).",
    function(K){
      var M = K.map(60, 270, 36, 7), s = K.axes(60, 270, 5, 450, 215, 5, "n", "");
      s += K.t(72, 48, "Schritte", "s", { a: "start", s: 13 });
      s += K.plot(function(x){ return x * x; }, 0, 6, M, "m", { ymax: 30 });
      s += K.plot(function(x){ return x; }, 0, 12, M, "a");
      s += K.plot(function(x){ return Math.log(x) / Math.LN2; }, 1, 12, M, "c4");
      s += K.t(M.X(5.48) + 12, M.Y(30) + 10, "n² (jedes Paar)", "m", { a: "start", s: 13, b: true });
      s += K.t(M.X(12) + 8, M.Y(12), "n (jedes Element)", "a", { a: "start", s: 13, b: true });
      s += K.t(M.X(12) + 8, M.Y(3.58), "log₂ n (halbieren)", "c4", { a: "start", s: 13, b: true });
      s += K.f(430, 35, "n = 10:  log₂n ≈ 3 · n = 10 · n² = 100", "s", { s: 13, fill: "p" });
      return K.svg(660, 295, s);
    });

  /* ═════════ Kapitel 3: Rechner ═════════ */

  add("babbage", "Analytische Maschine (Babbage): Lochkarten · Mill · Store",
    "Babbages Entwurf hat schon die <b>Form eines heutigen Rechners</b>: <b>Lochkarten</b> liefern Programm und Daten, die <b>Mill</b> rechnet (heute: Rechenwerk), der <b>Store</b> speichert Zahlen (heute: Speicher). Gebaut wurde die Maschine nie.",
    function(K){
      var s = K.rect(30, 80, 150, 95, "c3", { w: 2, rx: 6 }) + K.t(105, 60, "Lochkarten", "c3", { s: 15, b: true });
      var pat = ["1011010", "0110101", "1100110", "0101011"];
      for(var j = 0; j < 4; j++) for(var i = 0; i < 7; i++){
        var x = 48 + i * 19, y = 98 + j * 20;
        s += pat[j][i] === "1" ? K.dot(x, y, "i", 4) : K.circ(x, y, 4, "f", { w: 1 });
      }
      s += K.t(105, 198, "Programm + Daten", "s", { s: 13 }) + K.t(105, 220, "heute: Programm/Eingabe", "f", { s: 12 });
      s += K.cell(330, 127, "Mill", "a", { w: 150, h: 80, fill: "fa", s: 18 }) + K.t(330, 198, "Rechenwerk", "s", { s: 13 }) + K.t(330, 220, "heute: ALU", "f", { s: 12 });
      s += K.cell(540, 127, "Store", "c4", { w: 150, h: 80, s: 18 }) + K.t(540, 198, "Speicher", "s", { s: 13 }) + K.t(540, 220, "heute: Arbeitsspeicher", "f", { s: 12 });
      s += K.arrow(184, 127, 251, 127, "i", { w: 2.2 }) + K.t(217, 112, "steuert", "s", { s: 12 });
      s += K.arrow(409, 117, 461, 117, "i", { w: 2.2 }) + K.arrow(461, 137, 409, 137, "i", { w: 2.2 });
      s += K.t(320, 260, "Entwurf um 1837 – nie fertig gebaut", "m", { s: 13, b: true });
      return K.svg(640, 280, s);
    });

  add("turing", "Turing-Maschine: Band, Kopf, Zustände, Übergangsfunktion",
    "Die Maschine besteht aus einem <b>unendlichen Band</b> aus Feldern, einem <b>Lese-/Schreibkopf</b> und einer <b>Steuerung</b> mit endlich vielen Zuständen. Die <b>Übergangsfunktion δ</b> sagt: „Im Zustand q lese ich Zeichen a – dann schreibe ich b, gehe nach links/rechts und wechsle den Zustand.“ Das Beispiel kehrt alle Bits um.",
    function(K){
      var s = K.t(248, 45, "unendliches Band (nach beiden Seiten)", "s", { s: 13 });
      var tape = ["␣", "␣", "1", "0", "1", "1", "␣", "␣", "␣"];
      for(var i = 0; i < tape.length; i++) s += K.cell(72 + i * 44, 90, tape[i], i === 2 ? "m" : "a", { w: 44, h: 40, rx: 0, s: 17, fill: i === 2 ? "fm" : "p" });
      s += K.t(36, 90, "⋯", "f", { s: 18, b: true }) + K.t(460, 90, "⋯", "f", { s: 18, b: true });
      s += K.poly([[160, 113], [148, 133], [172, 133]], "m", { fill: "fm", w: 1.8 }) + K.line(160, 133, 160, 180, "m", { w: 2 });
      s += K.t(180, 124, "Lese-/Schreibkopf", "m", { a: "start", s: 13, b: true });
      s += K.cell(160, 205, "Steuerung: Zustand q₀", "c4", { w: 190, h: 50, s: 14, fill: "p" });
      s += K.t(160, 252, "endliche Zustandsmenge {q₀, qₑ}", "c4", { s: 13 });
      s += K.rect(480, 40, 170, 190, "c4", { w: 1.6 }) + K.t(565, 60, "Übergangsfunktion δ", "c4", { s: 13, b: true, halo: false });
      s += K.t(492, 95, "(q₀, 0) → (q₀, 1, R)", "i", { a: "start", s: 12.5, halo: false });
      s += K.t(492, 125, "(q₀, 1) → (q₀, 0, R)", "i", { a: "start", s: 12.5, halo: false });
      s += K.t(492, 155, "(q₀, ␣) → (qₑ, ␣, –)", "i", { a: "start", s: 12.5, halo: false });
      s += K.t(565, 200, "Bsp.: alle Bits umkehren", "m", { s: 12, halo: false });
      s += K.t(565, 252, "R = rechts · – = stehen", "s", { s: 12 });
      return K.svg(660, 275, s);
    });

  add("tmlauf", "Übergangsfunktion in Aktion: Schritt für Schritt",
    "Jede Zeile ist ein Takt der Maschine aus der Skizze davor. Der Kopf (blaues Feld) <b>liest</b> ein Zeichen, δ sagt, was er <b>schreibt</b> (rot) und dass er <b>nach rechts</b> geht. Beim Leerzeichen ␣ wechselt die Maschine in qₑ und <b>hält</b> – aus 1011 ist 0100 geworden.",
    function(K){
      var s = K.t(45, 28, "Takt", "s", { s: 12.5, b: true }) + K.t(190, 28, "Band", "s", { s: 12.5, b: true }) + K.t(325, 28, "Zustand", "s", { s: 12.5, b: true }) + K.t(365, 28, "Aktion", "s", { a: "start", s: 12.5, b: true });
      var tapes = ["1011␣", "0011␣", "0111␣", "0101␣", "0100␣", "0100␣"], heads = [0, 1, 2, 3, 4, 4], st = ["q₀", "q₀", "q₀", "q₀", "q₀", "qₑ"],
          act = ["liest 1 → schreibt 0, R", "liest 0 → schreibt 1, R", "liest 1 → schreibt 0, R", "liest 1 → schreibt 0, R", "liest ␣ → hält an", "fertig: 1011 → 0100"];
      for(var r = 0; r < 6; r++){
        var y = 65 + r * 40, t = Array.from(tapes[r]);
        s += K.t(45, y, String(r), "s", { s: 14 });
        for(var i = 0; i < 5; i++){
          var hd = i === heads[r], wr = r >= 1 && r <= 4 && i === r - 1;
          s += K.cell(110 + i * 40, y, t[i], hd ? "a" : "f", { w: 38, h: 32, rx: 0, s: 15, fill: hd ? "fa" : "p", tc: wr ? "m" : "i" });
        }
        s += K.t(325, y, st[r], r === 5 ? "m" : "c4", { s: 15, b: true });
        s += K.t(365, y, act[r], r === 5 ? "m" : "s", { a: "start", s: 13, b: r === 5 });
      }
      return K.svg(620, 295, s);
    });

  add("church", "Church-Turing-These: berechenbar = Turing-berechenbar",
    "Die große Fläche ist „alle Probleme“. Darin liegt die Menge der <b>Turing-berechenbaren</b> Probleme – und laut These ist sie <b>genau dieselbe</b> wie die der intuitiv berechenbaren: Jede Programmiersprache, jeder reale Rechner kann <b>nicht mehr und nicht weniger</b>. Außerhalb liegen unlösbare Probleme wie das Halteproblem.",
    function(K){
      var s = K.rect(15, 25, 610, 260, "r", { rx: 8 }) + K.t(35, 45, "alle Probleme", "s", { a: "start", s: 13 });
      s += ell(K, 280, 160, 200, 100, "a", { fill: "fa", w: 2.2 });
      s += K.t(280, 105, "Turing-berechenbar", "a", { s: 15, b: true }) + K.t(280, 130, "= intuitiv berechenbar", "m", { s: 14, b: true });
      s += K.f(160, 180, "Turing-Maschine", "a", { s: 12, fill: "p" }) + K.f(292, 180, "Java-Programm", "a", { s: 12, fill: "p" }) + K.f(418, 180, "Rechner", "a", { s: 12, fill: "p" });
      s += K.t(280, 222, "alle Modelle: gleiche Klasse", "s", { s: 12.5 });
      s += K.dot(550, 160, "m", 6) + K.t(550, 185, "Halteproblem", "m", { s: 13, b: true }) + K.t(550, 204, "nicht berechenbar", "s", { s: 12 });
      return K.svg(640, 300, s);
    });

  add("halte", "Halteproblem: warum es kein allgemeines Prüfprogramm gibt",
    "Angenommen, ein Programm <b>H</b> könnte für jedes Programm P sagen, ob es hält. Dann baut man <b>D</b>: D fragt H über sich selbst und tut <b>das Gegenteil</b>. Startet man D mit sich selbst, hält D genau dann, wenn es nicht hält – ein <b>Widerspruch</b>. Also kann es H nicht geben.",
    function(K){
      var s = K.rect(120, 40, 320, 220, "c4", { dash: "7 5", w: 1.6 }) + K.t(280, 60, "Programm D(P) – nutzt H", "c4", { s: 13, b: true });
      s += K.arrow(30, 150, 168, 150, "i", { w: 2.2 }) + K.v(60, 136, "P", "i", { s: 16 });
      s += K.cell(220, 150, "H(P, P)", "a", { w: 100, h: 56, fill: "fa", s: 15 });
      s += K.arrow(272, 135, 328, 102, "s", { w: 1.8, head: 9 }) + K.arrow(272, 165, 328, 198, "s", { w: 1.8, head: 9 });
      s += K.t(286, 106, "„hält“", "s", { s: 12.5, b: true }) + K.t(262, 200, "„hält nicht“", "s", { s: 12.5, b: true });
      s += K.cell(380, 100, "läuft ewig ∞", "m", { w: 100, h: 40, s: 13, fill: "fm" }) + K.cell(380, 200, "hält an", "a", { w: 100, h: 40, s: 13 });
      s += K.t(455, 70, "Annahme: H gibt es", "i", { a: "start", s: 13 });
      s += K.t(455, 98, "Frage: Was macht D(D)?", "i", { a: "start", s: 13 });
      s += K.t(455, 126, "H: „hält“ ⇒ D läuft ewig", "s", { a: "start", s: 13 });
      s += K.t(455, 154, "H: „hält nicht“ ⇒ D hält", "s", { a: "start", s: 13 });
      s += K.t(455, 196, "Widerspruch!", "m", { a: "start", s: 14, b: true }) + K.t(455, 224, "⇒ H kann es nicht geben", "m", { a: "start", s: 13, b: true });
      return K.svg(660, 275, s);
    });

  function dbl(K, x, y1, y2){ var m = (y1 + y2) / 2; return K.arrow(x, m, x, y1, "s", { w: 2, head: 9 }) + K.arrow(x, m, x, y2, "s", { w: 2, head: 9 }); }
  add("vn", "Von-Neumann-Architektur: vier Bestandteile am gemeinsamen Bus",
    "Die <b>CPU</b> besteht aus <b>Steuerwerk</b> (liest Befehle, steuert) und <b>Rechenwerk/ALU</b> (rechnet). Dazu kommen der <b>Speicher</b> – für Daten <b>und</b> Programme – und das <b>Ein-/Ausgabewerk</b>. Alle hängen an <b>einem gemeinsamen Bus</b>.",
    function(K){
      var s = K.rect(30, 40, 270, 170, "c4", { dash: "7 5", w: 1.6 }) + K.t(165, 56, "CPU", "c4", { s: 13, b: true });
      s += K.cell(165, 92, "Steuerwerk", "c4", { w: 220, h: 42, s: 15 }) + K.arrow(165, 114, 165, 142, "c4", { w: 2, head: 9 }) + K.t(177, 128, "steuert", "c4", { a: "start", s: 12 });
      s += K.cell(165, 168, "Rechenwerk (ALU)", "a", { w: 220, h: 44, s: 15, fill: "fa" });
      s += K.rect(340, 50, 160, 100, "c3", { w: 1.8 }) + K.t(420, 85, "Speicher", "c3", { s: 15, b: true, halo: false }) + K.t(420, 112, "Daten + Programme", "i", { s: 12.5, halo: false });
      s += K.rect(520, 50, 110, 100, "m", { w: 1.8 }) + K.t(575, 80, "Ein-/Ausgabe", "m", { s: 13, b: true, halo: false }) + K.t(575, 104, "Tastatur,", "s", { s: 12, halo: false }) + K.t(575, 122, "Bildschirm", "s", { s: 12, halo: false });
      s += K.line(40, 250, 620, 250, "i", { w: 6 });
      s += dbl(K, 165, 212, 246) + dbl(K, 420, 152, 246) + dbl(K, 575, 152, 246);
      s += K.t(330, 274, "Bus: Daten, Adressen, Steuersignale", "s", { s: 13 });
      return K.svg(640, 290, s);
    });

  add("psk", "Programmspeicherkonzept: Befehle und Daten im selben Speicher",
    "Der Speicher ist eine Reihe <b>nummerierter Zellen</b>. In den Zellen 0–3 stehen <b>Befehle</b>, in 5–7 <b>Daten</b> – im selben Speicher, über denselben Bus geholt. Das Programm lädt 3 (Zelle 5), addiert 4 (Zelle 6) und speichert 7 in Zelle 7.",
    function(K){
      var s = K.t(115, 20, "Adr.", "s", { s: 12.5, b: true }) + K.t(220, 20, "Inhalt", "s", { s: 12.5, b: true });
      var cont = ["LOAD 5", "ADD 6", "STORE 7", "HALT", "–", "3", "4", "7"];
      for(var i = 0; i < 8; i++){
        var y = 45 + i * 32, cmd = i < 4, c = cmd ? "a" : i === 4 ? "f" : "c3";
        s += K.cell(115, y, String(i), "s", { w: 40, h: 30, s: 13, fill: "fa" });
        s += K.cell(220, y, cont[i], c, { w: 150, h: 30, s: 14, fill: cmd ? "fa" : i === 7 ? "fm" : "p", tc: i === 7 ? "m" : "i" });
      }
      s += K.path("M300 30 L310 30 L310 156 L300 156", "a", { w: 1.6 }) + K.t(320, 93, "Befehle", "a", { a: "start", s: 13.5, b: true });
      s += K.path("M300 190 L310 190 L310 284 L300 284", "c3", { w: 1.6 }) + K.t(320, 237, "Daten", "c3", { a: "start", s: 13.5, b: true });
      s += K.cell(500, 173, "CPU", "a", { w: 120, h: 70, s: 16, fill: "fa" });
      s += K.arrow(375, 173, 316, 173, "s", { w: 2, head: 9 }) + K.arrow(375, 173, 438, 173, "s", { w: 2, head: 9 });
      s += K.t(375, 158, "ein Bus für", "s", { s: 12.5 }) + K.t(375, 190, "Befehle und Daten", "s", { s: 12.5 });
      return K.svg(600, 300, s);
    });

  add("flasche", "Von-Neumann-Flaschenhals",
    "CPU und Speicher sind über <b>eine einzige Verbindung</b> gekoppelt. Befehle und Daten müssen sich anstellen und kommen <b>nacheinander</b> durch dieses enge Rohr. Die CPU könnte schneller rechnen, als der Bus liefert – sie <b>wartet</b>.",
    function(K){
      var s = K.rect(30, 70, 150, 120, "a", { fill: "fa", w: 2 }) + K.t(105, 115, "CPU", "a", { s: 18, b: true, halo: false }) + K.t(105, 145, "rechnet schnell", "s", { s: 12.5, halo: false });
      s += K.rect(460, 70, 150, 120, "c3", { w: 2 }) + K.t(535, 115, "Speicher", "c3", { s: 18, b: true, halo: false }) + K.t(535, 145, "Befehle + Daten", "s", { s: 12.5, halo: false });
      s += K.line(180, 112, 460, 112, "s", { w: 2 }) + K.line(180, 148, 460, 148, "s", { w: 2 });
      ["Befehl", "Datum", "Befehl", "Datum"].forEach(function(l, i){ s += K.cell(235 + i * 60, 130, l, i % 2 ? "c3" : "a", { w: 54, h: 24, s: 12 }); });
      s += K.arrow(430, 92, 210, 92, "s", { w: 1.8, head: 9 }) + K.t(320, 76, "einer nach dem anderen", "s", { s: 12.5 });
      s += K.t(320, 215, "Von-Neumann-Flaschenhals:", "m", { s: 13.5, b: true }) + K.t(320, 237, "die CPU wartet oft auf den Speicher", "s", { s: 13 });
      return K.svg(640, 255, s);
    });

  add("zyklus", "Befehlszyklus: Fetch → Decode → Execute",
    "Der Prozessor läuft immer <b>im Kreis</b>: Befehl aus dem Speicher <b>holen</b> (die Adresse steht im Befehlszähler PC), ihn <b>entschlüsseln</b>, ihn <b>ausführen</b> – dann der nächste. Nach jedem Holen zeigt der PC auf den folgenden Befehl.",
    function(K){
      var F = [320, 65], D = [420, 225], E = [220, 225], s = "";
      s += K.edge(F[0], F[1], D[0], D[1], { r1: 42, r2: 42, bend: 25, c: "a" });
      s += K.edge(D[0], D[1], E[0], E[1], { r1: 42, r2: 42, bend: 25, c: "a" });
      s += K.edge(E[0], E[1], F[0], F[1], { r1: 42, r2: 42, bend: 25, c: "a" });
      s += K.node(F[0], F[1], "Fetch", "c3", { r: 40, s: 15 }) + K.node(D[0], D[1], "Decode", "c4", { r: 40, s: 15 }) + K.node(E[0], E[1], "Execute", "m", { r: 40, s: 14 });
      s += K.t(372, 45, "Befehl holen", "c3", { a: "start", s: 13, b: true }) + K.t(372, 65, "Adresse steht im PC", "s", { a: "start", s: 12 });
      s += K.t(470, 215, "entschlüsseln:", "c4", { a: "start", s: 13, b: true }) + K.t(470, 235, "„ADD 6“ = addieren", "s", { a: "start", s: 12 });
      s += K.t(170, 215, "ausführen:", "m", { a: "end", s: 13, b: true }) + K.t(170, 235, "Akku + M[6]", "s", { a: "end", s: 12 });
      s += K.f(320, 160, "PC ← PC + 1", "s", { fill: "p" }) + K.t(320, 190, "nach jedem Fetch", "s", { s: 12 });
      return K.svg(640, 290, s);
    });

  /* ═════════ Kapitel 4: Dualzahlen ═════════ */

  add("stelle10", "Stellenwertsystem dezimal: 347 = 3·100 + 4·10 + 7",
    "Jede Stelle hat einen festen <b>Wert</b>: von rechts 1, 10, 100 … – also <b>10⁰, 10¹, 10²</b>. Die Ziffer sagt, <b>wie oft</b> dieser Wert vorkommt. Eine Stelle weiter links ist immer <b>zehnmal</b> so viel wert. Genau das schreibt die Formel aₙ·10ⁿ + … + a₁·10 + a₀ hin.",
    function(K){
      var X = [230, 330, 430], s = "";
      s += K.t(40, 55, "Stelle", "s", { a: "start", s: 13 }) + K.t(40, 95, "Wert", "s", { a: "start", s: 13 }) + K.t(40, 150, "Ziffer aᵢ", "s", { a: "start", s: 13 }) + K.t(40, 210, "Ziffer · Wert", "s", { a: "start", s: 13 });
      var hd = ["10²", "10¹", "10⁰"], wv = ["100", "10", "1"], dg = ["3", "4", "7"], pr = ["300", "40", "7"];
      for(var i = 0; i < 3; i++){
        s += K.t(X[i], 55, hd[i], "c4", { s: 15, b: true });
        s += K.cell(X[i], 95, wv[i], "c4", { w: 80, h: 30, s: 14 });
        s += K.cell(X[i], 150, dg[i], "a", { w: 80, h: 44, s: 20, fill: "fa" });
        s += K.cell(X[i], 210, pr[i], "a", { w: 80, h: 32, s: 15 });
      }
      s += K.t(280, 210, "+", "i", { s: 16, b: true }) + K.t(380, 210, "+", "i", { s: 16, b: true }) + K.t(480, 210, "= 347", "m", { a: "start", s: 18, b: true });
      s += K.t(330, 255, "eine Stelle nach links = ×10 mehr wert", "s", { s: 13 });
      return K.svg(600, 275, s);
    });

  add("stelle2", "Stellenwertsystem dual: jede Stelle doppelt so viel wert",
    "Im Dualsystem gibt es nur die Ziffern 0 und 1, und jede Stelle ist <b>doppelt</b> so viel wert wie die rechts daneben: 1, 2, 4, 8, 16, 32 … (Kästchen-Blöcke). Eine <b>1</b> nimmt den Block, eine <b>0</b> nicht. 101010₂ nimmt 32, 8 und 2 – zusammen 42.",
    function(K){
      var s = K.t(280, 40, "jede Stelle ist doppelt so viel wert wie die rechts daneben", "s", { s: 13 });
      var wt = [32, 16, 8, 4, 2, 1], dim = [[4, 8], [4, 4], [2, 4], [2, 2], [1, 2], [1, 1]], X = [70, 150, 220, 280, 330, 375], bt = [1, 0, 1, 0, 1, 0], ex = ["2⁵", "2⁴", "2³", "2²", "2¹", "2⁰"], q = 11;
      for(var k = 0; k < 6; k++){
        var c = dim[k][0], r = dim[k][1], x0 = X[k] - c * q / 2, y0 = 190 - r * q, on = bt[k] === 1;
        for(var i = 0; i < c; i++) for(var j = 0; j < r; j++) s += K.rect(x0 + i * q, y0 + j * q, q, q, on ? "a" : "f", { fill: on ? "fa" : "p", rx: 0, w: 1 });
        s += K.t(X[k], 210, ex[k], "c4", { s: 13 }) + K.t(X[k], 232, String(wt[k]), "i", { s: 13, b: true });
        s += K.cell(X[k], 270, String(bt[k]), on ? "a" : "f", { w: 32, h: 30, s: 16, fill: on ? "fa" : "p", tc: on ? "i" : "f" });
      }
      s += K.t(440, 120, "101010₂", "a", { a: "start", s: 18, b: true }) + K.t(440, 152, "= 32 + 8 + 2", "i", { a: "start", s: 15 }) + K.t(440, 184, "= 42", "m", { a: "start", s: 18, b: true });
      return K.svg(600, 300, s);
    });

  add("d2d", "Dual → Dezimal: Werte der 1-Bits addieren",
    "Über jedes Bit schreibt man seinen <b>Stellenwert</b> (16, 8, 4, 2, 1). Dann zählt man nur die Werte, unter denen eine <b>1</b> steht: 10110₂ → 16 + 4 + 2 = <b>22</b>. Die Nullen tragen nichts bei.",
    function(K){
      var X = [200, 260, 320, 380, 440], s = "";
      s += K.t(30, 50, "Stelle", "s", { a: "start", s: 13 }) + K.t(30, 85, "Wert", "s", { a: "start", s: 13 }) + K.t(30, 140, "Bit", "s", { a: "start", s: 13 }) + K.t(30, 200, "Bit · Wert", "s", { a: "start", s: 13 });
      var ex = ["2⁴", "2³", "2²", "2¹", "2⁰"], wv = [16, 8, 4, 2, 1], bt = [1, 0, 1, 1, 0];
      for(var i = 0; i < 5; i++){
        var on = bt[i] === 1;
        s += K.t(X[i], 50, ex[i], "c4", { s: 14, b: true }) + K.cell(X[i], 85, String(wv[i]), "c4", { w: 52, h: 28, s: 14 });
        s += K.cell(X[i], 140, String(bt[i]), on ? "a" : "f", { w: 52, h: 40, s: 20, fill: on ? "fa" : "p", tc: on ? "i" : "f" });
        s += K.arrow(X[i], 162, X[i], 180, on ? "a" : "f", { w: 1.6, head: 8 });
        s += K.cell(X[i], 200, String(on ? wv[i] : 0), on ? "a" : "f", { w: 52, h: 32, s: 15, tc: on ? "i" : "f" });
      }
      s += K.t(490, 200, "Σ = 22", "m", { a: "start", s: 18, b: true });
      s += K.t(320, 250, "16 + 4 + 2 = 22", "m", { s: 15, b: true });
      return K.svg(600, 275, s);
    });

  add("div2", "Dezimal → Dual: fortgesetzt durch 2 teilen",
    "Man teilt immer wieder durch 2 und notiert den <b>Rest</b> (0 oder 1). Der Quotient wird zur nächsten Zahl. Der <b>erste Rest</b> ist das niedrigste Bit (2⁰), der letzte das höchste – deshalb liest man die Reste <b>von unten nach oben</b>: 42 = 101010₂.",
    function(K){
      var s = K.t(110, 22, "Zahl", "s", { s: 12.5, b: true }) + K.t(240, 22, "÷ 2 =", "s", { s: 12.5, b: true }) + K.t(350, 22, "Rest", "m", { s: 12.5, b: true });
      var n = 42;
      for(var i = 0; i < 6; i++){
        var y = 55 + i * 36, q = Math.floor(n / 2), r = n % 2;
        s += K.cell(110, y, String(n), i ? "c3" : "a", { w: 56, h: 30, s: 15 }) + K.t(175, y, "÷ 2 =", "s", { s: 14 });
        s += K.cell(240, y, String(q), "c3", { w: 56, h: 30, s: 15 }) + K.t(300, y, "Rest", "s", { s: 13 });
        s += K.cell(350, y, String(r), "m", { w: 40, h: 30, s: 16, fill: "fm" }) + K.t(390, y, "2" + "⁰¹²³⁴⁵"[i], "f", { a: "start", s: 12 });
        n = q;
      }
      s += K.arrow(430, 243, 430, 45, "m", { w: 2.6 });
      s += K.t(545, 92, "Reste von unten", "s", { s: 13 }) + K.t(545, 112, "nach oben lesen", "s", { s: 13 });
      s += K.f(545, 150, "101010₂", "m", { s: 18, fill: "fm" }) + K.t(545, 188, "= 42", "i", { s: 16, b: true });
      return K.svg(640, 265, s);
    });

  add("add", "Duale Addition: Übertrag schon bei 1 + 1",
    "Man addiert spaltenweise von rechts – wie im Dezimalsystem. Weil es nur 0 und 1 gibt, <b>läuft eine Stelle schon bei 1 + 1 über</b>: 1 + 1 = 10₂, also 0 hinschreiben und <b>1 übertragen</b> (rote kleine Einsen). 1011₂ + 0110₂ = 10001₂, dezimal 11 + 6 = 17.",
    function(K){
      var s = K.t(300, 28, "Regel: 1 + 1 = 10₂ → 0 schreiben, 1 übertragen", "s", { s: 13 });
      var X = function(p){ return 200 + (4 - p) * 50; };
      s += K.t(40, 70, "Übertrag", "m", { a: "start", s: 12.5 });
      [4, 3, 2].forEach(function(p){ s += K.t(X(p), 70, "1", "m", { s: 15, b: true }); });
      s += bits(K, X(3), 110, [1, 0, 1, 1], 50, { h: 32 }) + K.t(160, 155, "+", "i", { s: 18, b: true });
      s += bits(K, X(3), 155, [0, 1, 1, 0], 50, { h: 32 });
      s += K.line(170, 180, 425, 180, "i", { w: 2 });
      s += bits(K, X(4), 210, [1, 0, 0, 0, 1], 50, { h: 34, cc: "m", ff: "fm" });
      s += K.t(540, 110, "11", "s", { a: "end", s: 15 }) + K.t(540, 155, "+ 6", "s", { a: "end", s: 15 }) + K.line(495, 180, 545, 180, "s", { w: 1.4 }) + K.t(540, 210, "= 17", "m", { a: "end", s: 16, b: true });
      s += K.t(300, 255, "wie dezimal 9 + 1 = 10: die Stelle läuft über", "s", { s: 13 });
      return K.svg(600, 275, s);
    });

  add("ek", "Einerkomplement: alle Bits umkehren",
    "Jedes Bit wird einzeln <b>umgedreht</b>: aus 0 wird 1, aus 1 wird 0. Aus 3 = 0011 wird 1100. Zahl und Einerkomplement zusammen ergeben immer <b>lauter Einsen</b> (1111) – daraus folgt im nächsten Schritt das Zweierkomplement.",
    function(K){
      var s = K.t(205, 80, "3 =", "i", { a: "end", s: 16, b: true }) + bits(K, 240, 80, [0, 0, 1, 1], 50, { h: 36 });
      for(var i = 0; i < 4; i++) s += K.arrow(240 + i * 50, 100, 240 + i * 50, 140, "c4", { w: 2, head: 9 }) + K.t(240 + i * 50 - 14, 120, "¬", "c4", { s: 15, b: true });
      s += K.t(205, 160, "EK(3) =", "m", { a: "end", s: 16, b: true }) + bits(K, 240, 160, [1, 1, 0, 0], 50, { h: 36, cc: "m", ff: "fm" });
      s += K.f(315, 225, "0011 + 1100 = 1111", "s", { fill: "p" });
      s += K.t(315, 262, "Zahl + Einerkomplement = lauter Einsen", "s", { s: 13 });
      return K.svg(600, 285, s);
    });

  add("zk", "Duale Subtraktion über das Zweierkomplement: 6 − 3",
    "Statt 3 abzuziehen, wird das <b>Zweierkomplement</b> von 3 addiert: ① alle Bits umkehren (1100), ② 1 addieren (1101 = −3), ③ ganz normal addieren. Das Ergebnis hat ein <b>fünftes Bit</b> zu viel – das fällt bei 4-Bit-Zahlen einfach weg, übrig bleibt 0011 = 3.",
    function(K){
      var x0 = 270, s = "";
      function row(y, lab, b, c, com, cc){ return K.t(30, y, lab, "i", { a: "start", s: 13.5, b: true }) + bits(K, x0, y, b, 40, { h: 30, cc: c, ff: c === "m" ? "fm" : "p", s: 15 }) + (com ? K.t(425, y, com, cc || "s", { a: "start", s: 13, b: cc === "m" }) : ""); }
      s += row(50, "3 =", [0, 0, 1, 1], "a", "Subtrahend");
      s += row(100, "① invertieren", [1, 1, 0, 0], "c4", "Einerkomplement");
      s += row(150, "② + 1", [1, 1, 0, 1], "m", "Zweierkomplement = −3", "m");
      s += K.line(20, 177, 640, 177, "f", { w: 1, dash: "5 5" });
      s += row(205, "③ 6 =", [0, 1, 1, 0], "a", "Minuend");
      s += row(245, "+ (−3)", [1, 1, 0, 1], "m", "");
      s += K.line(210, 268, 410, 268, "i", { w: 2 });
      s += K.t(30, 292, "Ergebnis", "i", { a: "start", s: 13.5, b: true });
      s += K.cell(230, 292, "1", "f", { w: 34, h: 30, s: 15, tc: "f" }) + K.line(216, 304, 244, 280, "m", { w: 2.4 });
      s += bits(K, x0, 292, [0, 0, 1, 1], 40, { h: 30, cc: "a", ff: "fa", s: 15 });
      s += K.t(425, 292, "5. Bit fällt weg ⇒ 0011 = 3 ✓", "a", { a: "start", s: 13, b: true });
      return K.svg(660, 315, s);
    });

  add("zkwarum", "Warum das Zweierkomplement funktioniert",
    "Bei 4 Bit ist 10000₂ = 16 schon „eine Runde zu viel“. Das Zweierkomplement von 3 ist <b>das, was 3 bis 16 fehlt</b>: 13. Wer 13 statt −3 addiert, landet bei 6 + 13 = 19 = <b>16 + 3</b>. Die 16 ist genau das fünfte Bit, das wegfällt – übrig bleibt <b>6 − 3 = 3</b>.",
    function(K){
      var u = 28, x0 = 60, X = function(v){ return x0 + v * u; }, s = "";
      s += K.t(284, 38, "ZK(3) = 1101₂ = 13 – das, was 3 bis 16 fehlt", "s", { s: 13 });
      s += K.rect(X(0), 60, 13 * u, 34, "a", { fill: "fa", rx: 0, w: 1.6 }) + K.t(X(6.5), 78, "13 = ZK(3)", "a", { s: 14, b: true, halo: false });
      s += K.rect(X(13), 60, 3 * u, 34, "m", { fill: "fm", rx: 0, w: 1.6 }) + K.t(X(14.5), 78, "3", "m", { s: 14, b: true, halo: false });
      s += K.t(X(16) + 12, 77, "= 16", "i", { a: "start", s: 15, b: true });
      s += K.t(284, 128, "6 − 3  wird zu  6 + 13 = 19", "s", { s: 13 });
      s += K.rect(X(0), 150, 6 * u, 34, "c3", { rx: 0, w: 1.6 }) + K.t(X(3), 168, "6", "c3", { s: 14, b: true, halo: false });
      s += K.rect(X(6), 150, 13 * u, 34, "a", { fill: "fa", rx: 0, w: 1.6 }) + K.t(X(11), 168, "+ 13", "a", { s: 14, b: true, halo: false });
      s += K.line(X(16), 50, X(16), 212, "m", { w: 1.4, dash: "4 4" });
      s += bracket(K, X(0), X(16), 206, -8, "m") + K.t(X(8), 226, "16 = 10000₂ → 5. Bit fällt weg", "m", { s: 13 });
      s += bracket(K, X(16) + 3, X(19), 206, -8, "a") + K.t(X(17.5), 226, "3 ✓", "a", { s: 14, b: true });
      return K.svg(620, 245, s);
    });

  add("zkring", "Zweierkomplement: Zahlenkreis und darstellbarer Bereich",
    "Bei n = 4 Bit gibt es <b>16 Muster</b>, im Kreis angeordnet. Die Hälfte mit führender <b>0</b> sind die Zahlen 0 … 7 (blau), die Hälfte mit führender <b>1</b> die negativen Zahlen −8 … −1 (rot). Deshalb reicht der Bereich von <b>−2ⁿ⁻¹ bis 2ⁿ⁻¹ − 1</b> – eine negative Zahl mehr als positive, weil die 0 bei den „positiven“ sitzt.",
    function(K){
      var cx = 230, cy = 165, R = 110, s = "";
      s += K.arc(cx, cy, R, 90, -67.5, "a", { w: 3 }) + K.arc(cx, cy, R, -90, -247.5, "m", { w: 3 });
      for(var i = 0; i < 16; i++){
        var a = (90 - i * 22.5) * Math.PI / 180, v = i < 8 ? i : i - 16, c = i < 8 ? "a" : "m";
        var b = ("000" + i.toString(2)).slice(-4);
        s += K.dot(cx + R * Math.cos(a), cy - R * Math.sin(a), c, 4.5);
        s += K.t(cx + 84 * Math.cos(a), cy - 84 * Math.sin(a), String(v).replace("-", "−"), c, { s: 14, b: true });
        s += K.t(cx + 140 * Math.cos(a), cy - 140 * Math.sin(a), b, "s", { s: 12.5 });
      }
      var g = (-78.75) * Math.PI / 180;
      s += K.line(cx + 96 * Math.cos(g), cy - 96 * Math.sin(g), cx + 124 * Math.cos(g), cy - 124 * Math.sin(g), "i", { w: 2.4 });
      s += K.t(410, 60, "n = 4 Bit ⇒ 16 Muster", "i", { a: "start", s: 13.5, b: true });
      s += K.t(410, 88, "0000 … 0111 = 0 … 7", "a", { a: "start", s: 13.5 });
      s += K.t(410, 114, "1000 … 1111 = −8 … −1", "m", { a: "start", s: 13.5 });
      s += K.t(410, 140, "erstes Bit 1 ⇒ negativ", "s", { a: "start", s: 13.5 });
      s += K.t(410, 166, "Strich unten: 7 → −8", "s", { a: "start", s: 13.5 });
      s += K.f(410, 214, "−2ⁿ⁻¹ … 2ⁿ⁻¹ − 1", "m", { a: "start", fill: "fm" }) + K.t(410, 250, "hier: −8 … 7", "m", { a: "start", s: 14, b: true });
      return K.svg(640, 330, s);
    });

  add("hexziff", "Hexadezimalziffern: 1 Ziffer = 4 Bit",
    "Mit 4 Bit gibt es genau <b>16 Muster</b> (0000 bis 1111) – darum hat das Hexadezimalsystem 16 Ziffern. Nach 9 gehen die Ziffern aus, deshalb nimmt man <b>A bis F</b> für 10 bis 15 (orange). Jede Hex-Ziffer steht für genau einen 4-Bit-Block.",
    function(K){
      var s = K.t(320, 22, "1 Hex-Ziffer = genau 4 Bit (0000 … 1111)", "s", { s: 13 });
      for(var v = 0; v < 16; v++){
        var c = v % 4, r = Math.floor(v / 4), x = 20 + c * 152, y = 45 + r * 68, hi = v >= 10;
        s += K.rect(x, y, 144, 60, hi ? "c3" : "a", { w: 1.4 });
        s += K.t(x + 28, y + 31, v.toString(16).toUpperCase(), hi ? "c3" : "a", { s: 22, b: true, halo: false });
        s += K.t(x + 82, y + 31, ("000" + v.toString(2)).slice(-4), "i", { s: 15, halo: false });
        s += K.t(x + 126, y + 31, "= " + v, "f", { s: 12, halo: false });
      }
      return K.svg(640, 320, s);
    });

  add("hexokt", "Dual → Hex / Oktal: von rechts in Blöcke gruppieren",
    "Weil 16 = 2⁴ und 8 = 2³ ist, entspricht <b>eine Hex-Ziffer genau 4 Bit</b> und <b>eine Oktalziffer genau 3 Bit</b>. Man teilt die Bitfolge <b>von rechts</b> in Blöcke und übersetzt jeden Block einzeln: oben 1010|1111 = AF, unten (mit einer ergänzten 0) 010|101|111 = 257₈. Beides ist 175.",
    function(K){
      var s = K.t(320, 28, "von rechts gruppieren: 4 Bit → Hex · 3 Bit → Oktal", "s", { s: 13 });
      var b = [1, 0, 1, 0, 1, 1, 1, 1], X = function(i){ return 154 + i * 46; };
      s += K.rect(108 - 21, 133, 42, 34, "f", { dash: "4 4" }) + K.t(108, 151, "0", "f", { s: 16, b: true });
      s += bits(K, X(0), 150, b, 46, { h: 34, gap: 4 });
      s += bracket(K, X(0) - 21, X(3) + 21, 120, 8, "a") + bracket(K, X(4) - 21, X(7) + 21, 120, 8, "a");
      s += K.t((X(0) + X(3)) / 2, 98, "1010 = A", "a", { s: 14, b: true }) + K.t((X(4) + X(7)) / 2, 98, "1111 = F", "a", { s: 14, b: true });
      s += bracket(K, 108 - 21, X(1) + 21, 180, -8, "c3") + bracket(K, X(2) - 21, X(4) + 21, 180, -8, "c3") + bracket(K, X(5) - 21, X(7) + 21, 180, -8, "c3");
      s += K.t(X(0), 202, "010 = 2", "c3", { s: 14, b: true }) + K.t(X(3), 202, "101 = 5", "c3", { s: 14, b: true }) + K.t(X(6), 202, "111 = 7", "c3", { s: 14, b: true });
      s += K.t(530, 98, "→ AF₁₆", "a", { a: "start", s: 16, b: true }) + K.t(530, 150, "= 175", "m", { a: "start", s: 16, b: true }) + K.t(530, 202, "→ 257₈", "c3", { a: "start", s: 16, b: true });
      s += K.t(320, 245, "A·16 + F = 160 + 15 = 175  ·  2·64 + 5·8 + 7 = 175", "s", { s: 12.5 });
      return K.svg(620, 265, s);
    });

  add("hex2dez", "Hex → Dezimal: 0xAF = 10·16 + 15 = 175",
    "Gleiches Prinzip wie dezimal, nur ist jede Stelle <b>16-mal</b> so viel wert wie die rechts daneben: 1, 16, 256 … Die Buchstaben werden vorher in Zahlen übersetzt (<b>A = 10, F = 15</b>). Dann Ziffer mal Stellenwert und alles addieren: 160 + 15 = 175.",
    function(K){
      var X = [260, 380], s = "";
      s += K.t(40, 50, "Stelle", "s", { a: "start", s: 13 }) + K.t(40, 90, "Wert", "s", { a: "start", s: 13 }) + K.t(40, 145, "Ziffer", "s", { a: "start", s: 13 }) + K.t(40, 190, "Zahlwert", "s", { a: "start", s: 13 }) + K.t(40, 235, "Wert · Zahl", "s", { a: "start", s: 13 });
      var hd = ["16¹", "16⁰"], wv = ["16", "1"], dg = ["A", "F"], zv = ["= 10", "= 15"], pr = ["160", "15"];
      for(var i = 0; i < 2; i++){
        s += K.t(X[i], 50, hd[i], "c4", { s: 15, b: true }) + K.cell(X[i], 90, wv[i], "c4", { w: 80, h: 30, s: 14 });
        s += K.cell(X[i], 145, dg[i], "c3", { w: 80, h: 44, s: 20, fill: "fa" }) + K.t(X[i], 190, zv[i], "c3", { s: 14, b: true });
        s += K.cell(X[i], 235, pr[i], "a", { w: 80, h: 32, s: 15 });
      }
      s += K.t(320, 235, "+", "i", { s: 16, b: true }) + K.t(435, 235, "= 175", "m", { a: "start", s: 18, b: true });
      s += K.t(300, 280, "A = 10 · B = 11 · C = 12 · D = 13 · E = 14 · F = 15", "s", { s: 12.5 });
      return K.svg(600, 300, s);
    });

  /* ═════════ Kapitel 5: Logische Schaltungen ═════════ */

  function sw(K, x1, x2, y, lab, ly){ return K.line(x1, y, x2 - 3, y - 16, "i", { w: 2 }) + K.dot(x1, y, "i", 3) + K.dot(x2, y, "i", 3) + K.v((x1 + x2) / 2, ly === undefined ? y - 30 : ly, lab, "i", { s: 15 }); }
  function lamp(K, x, y, on){ return K.circ(x, y, 13, on ? "c3" : "s", { fill: on ? "fm" : "p", w: 2 }) + K.line(x - 9, y - 9, x + 9, y + 9, on ? "c3" : "s", { w: 1.4 }) + K.line(x - 9, y + 9, x + 9, y - 9, on ? "c3" : "s", { w: 1.4 }); }
  function gateFig(K, kind){
    var y = 105, s = "";
    if(kind === "not"){ s += K.line(36, y, 70, y, "i", W) + gNOT(K, 70, y) + K.line(110, y, 145, y, "i", W) + K.v(24, y, "A", "i", { s: 16 }); }
    else {
      var e = kind === "or" ? 74.5 : 70;
      s += K.line(36, y - 11, e, y - 11, "i", W) + K.line(36, y + 11, e, y + 11, "i", W) + K.v(24, y - 11, "A", "i", { s: 16 }) + K.v(24, y + 11, "B", "i", { s: 16 });
      s += kind === "and" ? gAND(K, 70, y) + K.line(114, y, 145, y, "i", W) : gOR(K, 70, y) + K.line(120, y, 145, y, "i", W);
    }
    s += K.v(157, y, "Y", "m", { s: 16 });
    var f = { and: ["Y = A ∧ B", "1 nur, wenn alle 1"], or: ["Y = A ∨ B", "1, wenn mind. einer 1"], not: ["Y = ¬A", "kehrt den Wert um"] }[kind];
    s += K.t(90, 170, f[0], "a", { s: 16, b: true }) + K.t(90, 196, f[1], "s", { s: 12.5 });
    /* Stromkreis */
    s += K.line(210, 80, 210, 120, "i", W) + K.line(198, 120, 222, 120, "i", { w: 2 }) + K.line(204, 130, 216, 130, "i", { w: 3.4 }) + K.line(210, 130, 210, 170, "i", W);
    s += K.line(210, 170, 430, 170, "i", W) + K.line(430, 80, 430, 112, "i", W) + K.line(430, 138, 430, 170, "i", W) + lamp(K, 430, 125, kind === "not");
    if(kind === "and"){
      s += K.line(210, 80, 260, 80, "i", W) + sw(K, 260, 300, 80, "A") + K.line(300, 80, 330, 80, "i", W) + sw(K, 330, 370, 80, "B") + K.line(370, 80, 430, 80, "i", W);
    } else if(kind === "or"){
      s += K.line(210, 80, 260, 80, "i", W) + K.line(260, 60, 260, 100, "i", W) + K.line(380, 60, 380, 100, "i", W) + K.line(380, 80, 430, 80, "i", W);
      s += K.line(260, 60, 300, 60, "i", W) + sw(K, 300, 340, 60, "A") + K.line(340, 60, 380, 60, "i", W);
      s += K.line(260, 100, 300, 100, "i", W) + sw(K, 300, 340, 100, "B", 120) + K.line(340, 100, 380, 100, "i", W);
    } else {
      s += K.line(210, 80, 300, 80, "i", W) + K.dot(300, 80, "i", 3) + K.dot(340, 80, "i", 3) + K.line(300, 80, 340, 80, "i", { w: 2.4 }) + K.line(340, 80, 430, 80, "i", W);
      s += K.line(320, 80, 320, 50, "i", { w: 1.4, dash: "4 3" }) + K.line(310, 50, 330, 50, "i", { w: 2 }) + K.v(345, 48, "A", "i", { s: 15 });
    }
    var cap = { and: ["Reihenschaltung:", "Lampe nur bei A = 1 UND B = 1"], or: ["Parallelschaltung:", "Lampe, wenn A ODER B schließt"], not: ["Ruhekontakt: A = 1 öffnet ihn,", "Lampe brennt nur bei A = 0"] }[kind];
    s += K.t(320, 212, cap[0], "s", { s: 13, b: true }) + K.t(320, 232, cap[1], "s", { s: 13 });
    /* Wahrheitstabelle */
    var rows = kind === "not" ? [[0, 1], [1, 0]] : [[0, 0], [0, 1], [1, 0], [1, 1]];
    var cols = kind === "not" ? [510, 570] : [490, 540, 595], hd = kind === "not" ? ["A", "Y"] : ["A", "B", "Y"];
    for(var c = 0; c < cols.length; c++) s += K.cell(cols[c], 50, hd[c], c === cols.length - 1 ? "m" : "s", { w: 44, h: 28, fill: "fa", s: 14, it: true });
    rows.forEach(function(r, j){
      var yv = kind === "and" ? (r[0] & r[1]) : kind === "or" ? (r[0] | r[1]) : r[1];
      var vals = kind === "not" ? [r[0], yv] : [r[0], r[1], yv];
      for(var c = 0; c < cols.length; c++){
        var last = c === cols.length - 1;
        s += K.cell(cols[c], 82 + j * 30, String(vals[c]), last ? "m" : "s", { w: 44, h: 28, s: 14, fill: last && vals[c] ? "fm" : "p", tc: last ? "m" : "i" });
      }
    });
    return K.svg(640, 250, s);
  }
  add("and", "AND (UND, ∧): 1 nur, wenn alle Eingänge 1 sind",
    "Das AND-Gatter verhält sich wie <b>zwei Schalter in Reihe</b>: Strom fließt nur, wenn A <b>und</b> B geschlossen sind. In der Tabelle ist darum nur die letzte Zeile (1, 1) eine 1.",
    function(K){ return gateFig(K, "and"); });
  add("or", "OR (ODER, ∨): 1, wenn mindestens ein Eingang 1 ist",
    "Das OR-Gatter verhält sich wie <b>zwei Schalter parallel</b>: Es reicht, wenn A <b>oder</b> B (oder beide) geschlossen ist. Nur wenn beide offen sind (0, 0), bleibt die Lampe aus.",
    function(K){ return gateFig(K, "or"); });
  add("not", "NOT (NICHT, ¬): kehrt den Eingang um",
    "Das NOT-Gatter hat nur <b>einen</b> Eingang und dreht ihn um – im Symbol zeigt das der <b>kleine Kreis</b> am Ausgang. Als Schalter: ein Ruhekontakt, der bei A = 1 den Stromkreis <b>öffnet</b>. Also brennt die Lampe nur bei A = 0.",
    function(K){ return gateFig(K, "not"); });

  add("xor", "XOR (⊕): genau ein Eingang ist 1",
    "XOR ist 1, wenn A und B <b>verschieden</b> sind. Die Schaltung zeigt, wie man es aus den Grundgattern baut: oben „A und nicht B“, unten „nicht A und B“, beides per OR verbunden. Die kleine <b>Brücke</b> heißt: Diese Leitungen kreuzen sich, sind aber nicht verbunden.",
    function(K){
      var s = "";
      s += K.v(24, 60, "A", "i", { s: 16 }) + wire(K, [[36, 60], [280, 60], [280, 84], [300, 84]]);
      s += K.dot(70, 60, "i", 4) + wire(K, [[70, 60], [70, 150]]) + hop(K, 70, 150, 120, 100) + gNOT(K, 120, 150) + wire(K, [[160, 150], [260, 150], [260, 174], [300, 174]]);
      s += K.v(24, 240, "B", "i", { s: 16 }) + wire(K, [[36, 240], [280, 240], [280, 196], [300, 196]]);
      s += K.dot(100, 240, "i", 4) + wire(K, [[100, 240], [100, 106], [180, 106]]) + gNOT(K, 180, 106) + wire(K, [[220, 106], [300, 106]]);
      s += K.t(210, 138, "¬A", "c4", { s: 13, b: true }) + K.t(245, 94, "¬B", "c4", { s: 13, b: true });
      s += gAND(K, 300, 95) + gAND(K, 300, 185);
      s += wire(K, [[344, 95], [365, 95], [365, 129], [384.5, 129]]) + wire(K, [[344, 185], [365, 185], [365, 151], [384.5, 151]]);
      s += gOR(K, 380, 140) + wire(K, [[430, 140], [452, 140]]) + K.v(464, 140, "Y", "m", { s: 16 });
      s += K.t(230, 282, "Y = (A ∧ ¬B) ∨ (¬A ∧ B)", "a", { s: 15, b: true });
      var cols = [520, 565, 615], hd = ["A", "B", "Y"];
      for(var c = 0; c < 3; c++) s += K.cell(cols[c], 60, hd[c], c === 2 ? "m" : "s", { w: 42, h: 28, fill: "fa", s: 14, it: true });
      [[0, 0], [0, 1], [1, 0], [1, 1]].forEach(function(r, j){
        var y = r[0] ^ r[1], v = [r[0], r[1], y];
        for(var c = 0; c < 3; c++) s += K.cell(cols[c], 95 + j * 32, String(v[c]), c === 2 ? "m" : "s", { w: 42, h: 28, s: 14, fill: c === 2 && y ? "fm" : "p", tc: c === 2 ? "m" : "i" });
      });
      s += K.t(565, 245, "Y = 1, wenn A ≠ B", "m", { s: 13, b: true });
      return K.svg(660, 300, s);
    });

  add("ha", "Halbaddierer: XOR für die Summe, AND für den Übertrag",
    "Beide Eingänge A und B gehen <b>gleichzeitig</b> an zwei Gatter: Das <b>XOR</b> liefert die Summenstelle S, das <b>AND</b> den Übertrag C. Beispiel A = B = 1: XOR gibt 0, AND gibt 1 – zusammen „10“, also 1 + 1 = 2.",
    function(K){
      var s = "";
      s += K.v(24, 89, "A", "i", { s: 16 }) + wire(K, [[36, 89], [260.5, 89]]);
      s += K.dot(120, 89, "i", 4) + wire(K, [[120, 89], [120, 189]]) + hop(K, 120, 189, 260, 160);
      s += K.v(24, 211, "B", "i", { s: 16 }) + wire(K, [[36, 211], [260, 211]]);
      s += K.dot(160, 211, "i", 4) + wire(K, [[160, 211], [160, 111], [260.5, 111]]);
      s += gXOR(K, 256, 100) + gAND(K, 260, 200);
      s += wire(K, [[314, 100], [380, 100]]) + wire(K, [[304, 200], [380, 200]]);
      s += K.t(392, 100, "S (Summe)", "a", { a: "start", s: 15, b: true }) + K.t(392, 200, "C (Übertrag)", "m", { a: "start", s: 15, b: true });
      s += K.t(570, 120, "Beispiel A = B = 1:", "s", { s: 12.5 }) + K.f(570, 150, "1 + 1 = 10₂", "m", { fill: "fm" }) + K.t(570, 182, "C = 1, S = 0", "m", { s: 13, b: true });
      return K.svg(660, 250, s);
    });

  add("hatab", "Halbaddierer-Tabelle: C S ist die Summe als 2-Bit-Zahl",
    "Liest man die Ausgänge <b>C und S nebeneinander</b>, steht dort einfach die Summe A + B als Dualzahl: 0, 1, 1, 10₂ = 2. Daraus erkennt man die Gatter: S ist 1, wenn A und B <b>verschieden</b> sind (XOR); C ist nur bei <b>1 + 1</b> gesetzt (AND).",
    function(K){
      var X = { A: 110, B: 190, C: 310, S: 360 }, s = "";
      s += K.t(150, 40, "+", "s", { s: 16, b: true }) + K.t(250, 40, "=", "s", { s: 16, b: true });
      ["A", "B"].forEach(function(k){ s += K.cell(X[k], 40, k, "s", { w: 40, h: 28, fill: "fa", s: 15, it: true }); });
      s += K.cell(X.C, 40, "C", "m", { w: 40, h: 28, fill: "fm", s: 15, it: true }) + K.cell(X.S, 40, "S", "a", { w: 40, h: 28, fill: "fa", s: 15, it: true });
      [[0, 0], [0, 1], [1, 0], [1, 1]].forEach(function(r, j){
        var y = 80 + j * 40, c = r[0] & r[1], sm = r[0] ^ r[1];
        s += K.cell(X.A, y, String(r[0]), "s", { w: 40, h: 30, s: 16 }) + K.t(150, y, "+", "s", { s: 15 }) + K.cell(X.B, y, String(r[1]), "s", { w: 40, h: 30, s: 16 });
        s += K.t(250, y, "=", "s", { s: 15 });
        s += K.cell(X.C, y, String(c), "m", { w: 40, h: 30, s: 16, fill: c ? "fm" : "p" }) + K.cell(X.S, y, String(sm), "a", { w: 40, h: 30, s: 16, fill: sm ? "fa" : "p" });
      });
      s += K.t(430, 90, "S = 1 genau dann,", "a", { a: "start", s: 13.5 }) + K.t(430, 110, "wenn A ≠ B ⇒ XOR", "a", { a: "start", s: 13.5, b: true });
      s += K.t(430, 170, "C = 1 nur bei", "m", { a: "start", s: 13.5 }) + K.t(430, 190, "1 + 1 ⇒ AND", "m", { a: "start", s: 13.5, b: true });
      s += K.t(310, 245, "C S zusammen = Summe als 2-Bit-Zahl (0, 1, 1, 2)", "s", { s: 13 });
      return K.svg(620, 265, s);
    });

  add("va", "Volladdierer: zwei Halbaddierer und ein OR",
    "Der Volladdierer addiert <b>drei</b> Bits: A, B und den Übertrag Cᵢₙ aus der Stelle rechts. <b>HA 1</b> addiert A + B, <b>HA 2</b> addiert dazu Cᵢₙ. Einen Übertrag gibt es, wenn <b>einer der beiden</b> Halbaddierer einen meldet – darum das OR. Beispiel 1 + 1 + 1 = 11₂.",
    function(K){
      var s = "";
      s += K.rect(120, 50, 100, 100, "a", { fill: "fa", w: 2 }) + K.t(170, 100, "HA 1", "a", { s: 16, b: true, halo: false });
      s += K.rect(320, 50, 100, 100, "a", { fill: "fa", w: 2 }) + K.t(370, 100, "HA 2", "a", { s: 16, b: true, halo: false });
      s += K.v(26, 75, "A", "i", { s: 16 }) + wire(K, [[40, 75], [120, 75]]) + K.v(26, 125, "B", "i", { s: 16 }) + wire(K, [[40, 125], [120, 125]]);
      s += hop(K, 220, 75, 320, 290) + K.t(255, 62, "s₁", "i", { s: 14, b: true, it: true });
      s += K.t(290, 20, "Cᵢₙ", "c3", { s: 15, b: true }) + wire(K, [[290, 32], [290, 125], [320, 125]], "c3");
      s += wire(K, [[220, 125], [250, 125], [250, 237], [484.5, 237]]) + K.t(236, 112, "c₁", "i", { s: 14, b: true, it: true });
      s += wire(K, [[420, 75], [600, 75]]) + K.t(612, 75, "S", "a", { a: "start", s: 16, b: true });
      s += wire(K, [[420, 125], [460, 125], [460, 215], [484.5, 215]]) + K.t(440, 112, "c₂", "i", { s: 14, b: true, it: true });
      s += gOR(K, 480, 226) + wire(K, [[530, 226], [600, 226]]) + K.t(608, 226, "Cₒᵤₜ", "m", { a: "start", s: 16, b: true });
      s += K.t(330, 272, "Beispiel: 1 + 1 + 1 = 11₂  ⇒  S = 1, Cₒᵤₜ = 1", "s", { s: 13 });
      return K.svg(660, 290, s);
    });

  add("vasum", "Volladdierer-Tabelle: S = Parität, Cₒᵤₜ = Mehrheit",
    "Zählt man in jeder Zeile die <b>Einsen</b> (Σ), wird alles einfach: <b>S = 1</b>, wenn die Anzahl <b>ungerade</b> ist – genau das macht A ⊕ B ⊕ Cᵢₙ. <b>Cₒᵤₜ = 1</b>, wenn <b>mindestens zwei</b> Einsen da sind. Und immer gilt Σ = 2·Cₒᵤₜ + S.",
    function(K){
      var X = [55, 100, 145, 210, 275, 335], hd = ["A", "B", "Cᵢₙ", "Σ", "S", "Cₒᵤₜ"], hc = ["s", "s", "s", "c4", "a", "m"], s = "";
      for(var c = 0; c < 6; c++) s += K.cell(X[c], 35, hd[c], hc[c], { w: c === 5 ? 50 : 40, h: 28, fill: "fa", s: 14, it: c !== 3 });
      for(var r = 0; r < 8; r++){
        var a = r >> 2 & 1, b = r >> 1 & 1, ci = r & 1, n = a + b + ci, sm = n % 2, co = n >= 2 ? 1 : 0, y = 70 + r * 30;
        [a, b, ci].forEach(function(v, k){ s += K.cell(X[k], y, String(v), "s", { w: 40, h: 26, s: 14 }); });
        s += K.cell(X[3], y, String(n), "c4", { w: 40, h: 26, s: 14, tc: "c4" });
        s += K.cell(X[4], y, String(sm), "a", { w: 40, h: 26, s: 14, fill: sm ? "fa" : "p" }) + K.cell(X[5], y, String(co), "m", { w: 50, h: 26, s: 14, fill: co ? "fm" : "p" });
      }
      s += K.t(395, 85, "S = 1 ⇔ ungerade", "a", { a: "start", s: 13.5, b: true }) + K.t(395, 107, "Anzahl Einsen", "a", { a: "start", s: 13.5 });
      s += K.t(395, 160, "Cₒᵤₜ = 1 ⇔ mindestens", "m", { a: "start", s: 13.5, b: true }) + K.t(395, 182, "zwei Einsen", "m", { a: "start", s: 13.5 });
      s += K.f(500, 240, "Σ = 2·Cₒᵤₜ + S", "c4", { fill: "p" });
      return K.svg(620, 300, s);
    });

  add("vacout", "Übertrag des Volladdierers: zwei Wege zu Cₒᵤₜ = 1",
    "Ein Übertrag entsteht, sobald <b>mindestens zwei</b> der drei Bits 1 sind. Das passiert auf zwei Wegen: <b>Fall 1</b> – A und B sind beide 1 (Term A ∧ B), dann ist Cᵢₙ egal. <b>Fall 2</b> – genau eines von A, B ist 1 (A ⊕ B) <b>und</b> Cᵢₙ ist 1. Das OR fasst beide Fälle zusammen.",
    function(K){
      var s = K.panel(10, 10, 300, 260, "Fall 1: A ∧ B", "a") + K.panel(330, 10, 300, 260, "Fall 2: Cᵢₙ ∧ (A ⊕ B)", "c3");
      function col(ox, vals, hl, brTxt, brCol, res, foot){
        var r = "", lab = ["A", "B", "Cᵢₙ"];
        for(var i = 0; i < 3; i++){
          var y = 60 + i * 40;
          r += K.v(ox + 45, y, lab[i], "i", { s: 15 }) + K.cell(ox + 100, y, vals[i], hl[i] ? brCol : "f", { w: 56, h: 32, s: 15, fill: hl[i] ? (brCol === "a" ? "fa" : "fm") : "p", tc: hl[i] ? "i" : "f" });
        }
        r += K.line(ox + 30, 162, ox + 170, 162, "i", { w: 1.8 });
        r += brTxt;
        r += K.t(ox + 150, 192, res, "m", { s: 13.5, b: true }) + K.t(ox + 150, 240, foot, "s", { s: 12.5 });
        return r;
      }
      s += col(10, ["1", "1", "0/1"], [1, 1, 0], K.path("M140 44 L150 44 L150 116 L140 116", "a", { w: 1.6 }) + K.t(160, 80, "beide 1", "a", { a: "start", s: 13, b: true }), "a", "≥ 2 Einsen ⇒ Cₒᵤₜ = 1", "Übertrag, egal was Cᵢₙ ist");
      s += col(330, ["1", "0", "1"], [1, 1, 1], K.path("M460 44 L470 44 L470 96 L460 96", "c3", { w: 1.6 }) + K.t(480, 64, "A ⊕ B = 1", "c3", { a: "start", s: 13, b: true }) + K.t(480, 84, "(oder 0, 1)", "s", { a: "start", s: 12 }) + K.t(480, 140, "+ Cᵢₙ = 1", "c3", { a: "start", s: 13, b: true }), "c3", "2 Einsen ⇒ Cₒᵤₜ = 1", "Übertrag kommt durch Cᵢₙ");
      return K.svg(640, 280, s);
    });

  add("ripple", "Carry-Ripple-Adder: Volladdierer in Kette",
    "Für jede Stelle ein Volladdierer; der <b>Übertrag</b> jeder Stufe wird zum Cᵢₙ der nächsten Stufe links. Hier 1011₂ + 0110₂: Der Übertrag entsteht in Stelle 1 und <b>„rippelt“</b> nach links bis ganz hinaus – Ergebnis 10001₂ = 17. Nachteil: Die linke Stufe muss auf alle rechten warten.",
    function(K){
      var xs = [560, 420, 280, 140], a = [1, 1, 0, 1], b = [0, 1, 1, 0], sub = ["₀", "₁", "₂", "₃", "₄"], c = [0], sm = [], s = "";
      for(var i = 0; i < 4; i++){ var n = a[i] + b[i] + c[i]; sm.push(n % 2); c.push(n >= 2 ? 1 : 0); }
      s += K.t(340, 18, "1011₂ + 0110₂  (11 + 6)", "s", { s: 13 });
      for(var i = 0; i < 4; i++){
        var x = xs[i];
        s += K.t(x - 20, 48, "a" + sub[i] + "=" + a[i], "i", { s: 13, b: true }) + K.t(x + 20, 48, "b" + sub[i] + "=" + b[i], "i", { s: 13, b: true });
        s += K.arrow(x - 20, 60, x - 20, 108, "s", { w: 1.8, head: 8 }) + K.arrow(x + 20, 60, x + 20, 108, "s", { w: 1.8, head: 8 });
        s += K.rect(x - 45, 110, 90, 70, "a", { fill: "fa", w: 2 }) + K.t(x, 145, "VA", "a", { s: 16, b: true, halo: false });
        s += K.arrow(x, 180, x, 214, "m", { w: 1.8, head: 8 }) + K.t(x, 232, "s" + sub[i] + "=" + sm[i], "m", { s: 13.5, b: true });
      }
      s += K.arrow(650, 145, 607, 145, "s", { w: 2, head: 9 }) + K.t(628, 130, "c₀=0", "s", { s: 12.5, b: true });
      for(var j = 1; j <= 3; j++){
        var xr = xs[j - 1] - 45, xl = xs[j] + 45, cc = c[j] ? "m" : "s";
        s += K.arrow(xr - 2, 145, xl + 2, 145, cc, { w: 2, head: 9 }) + K.t((xr + xl) / 2, 130, "c" + sub[j] + "=" + c[j], cc, { s: 12.5, b: true });
      }
      s += K.arrow(93, 145, 40, 145, "m", { w: 2, head: 9 }) + K.t(66, 130, "c₄=" + c[4], "m", { s: 12.5, b: true });
      s += K.t(340, 268, "Ergebnis: c₄ s₃ s₂ s₁ s₀ = " + c[4] + sm[3] + sm[2] + sm[1] + sm[0] + "₂ = 17", "m", { s: 13.5, b: true });
      return K.svg(680, 285, s);
    });
})();
