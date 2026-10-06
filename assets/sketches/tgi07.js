/* Skizzen zu TGI07 – Formale Sprachen und abstrakte Automaten 2.
   Jede Skizze: t = Titel, c = Lesehilfe (HTML), svg = function(K) → SVG-String (K = window.SK). */
(function(){
  "use strict";
  var S = window.ITI_SKETCHES = window.ITI_SKETCHES || {};
  function add(id, t, c, f){ S["tgi07-" + id] = { t: t, c: c, svg: f }; }
  function lines(K, x, y, arr, c, o){ o = o || {}; var s = ""; for(var i = 0; i < arr.length; i++) s += K.t(x, y + i * (o.lh || 20), arr[i], c || "s", { a: o.a || "start", s: o.s || 13.5, b: o.b }); return s; }

  /* Band (Eingabe-/TM-Band): Zellen nebeneinander; o.head = Index des Kopfes, o.q = Zustandstext, o.hl = {Index: Farbe}, o.fade = {Index: 1} */
  function tape(K, x0, y, cells, o){
    o = o || {};
    var cw = o.cw || 36, h = o.h || 34, s = "";
    if(o.dots){ s += K.t(x0 - 14, y, "…", "s", { s: 16 }) + K.t(x0 + cells.length * cw + 14, y, "…", "s", { s: 16 }); }
    for(var i = 0; i < cells.length; i++){
      var hl = o.hl && o.hl[i], fd = o.fade && o.fade[i];
      s += K.cell(x0 + i * cw + cw / 2, y, cells[i], hl || "s", { w: cw, h: h, rx: 0, bw: hl ? 2 : 1.2, fill: hl ? (hl === "m" ? "fm" : "fa") : "p", tc: fd ? "f" : (hl || "i"), s: o.s || 15 });
    }
    if(o.head !== undefined){
      var hx = x0 + o.head * cw + cw / 2, hc = o.hc || "m";
      s += K.arrow(hx, y + h / 2 + 32, hx, y + h / 2 + 3, hc, { w: 2.4, head: 10 });
      if(o.q) s += K.t(hx, y + h / 2 + 44, o.q, hc, { s: 14, b: true });
    }
    return s;
  }
  function tx(x0, i, cw){ return x0 + i * (cw || 36) + (cw || 36) / 2; }

  /* Keller: items von unten nach oben; oberstes Element hervorgehoben. o.cap = Höhe der Wanne in Zellen */
  function stack(K, cx, ybot, items, o){
    o = o || {};
    var w = o.w || 40, h = o.h || 28, cap = Math.max(o.cap || items.length, items.length), s = "";
    s += K.path("M" + (cx - w / 2 - 5) + " " + (ybot - cap * h - 6) + " L" + (cx - w / 2 - 5) + " " + (ybot + 4) + " L" + (cx + w / 2 + 5) + " " + (ybot + 4) + " L" + (cx + w / 2 + 5) + " " + (ybot - cap * h - 6), "s", { w: 1.6 });
    for(var i = 0; i < items.length; i++){
      var top = i === items.length - 1, c = top ? (o.tc || "a") : "s";
      s += K.cell(cx, ybot - h / 2 - i * h, items[i], c, { w: w, h: h, rx: 2, fill: top ? (c === "m" ? "fm" : "fa") : "p", s: o.s || 14 });
    }
    if(o.tos && items.length) s += K.t(cx + w / 2 + 9, ybot - h / 2 - (items.length - 1) * h, "tos", o.tc || "a", { a: "start", s: 12, b: true });
    return s;
  }

  /* Syntaxbaum. Knoten: ["X", kind, kind …] = Nichtterminal, "a" = Terminal-Blatt, ["Y"] = NT-Blatt.
     Farbe per "X|m". o.bottom: Terminale in die unterste Zeile. Rückgabe {s, n (Knoten in Präordnung)} */
  function tree(K, root, x0, dx, y0, dy, o){
    o = o || {};
    var leaves = 0, nodes = [], maxd = 0, r = o.r || 15;
    function lay(nd, d){
      var isT = typeof nd === "string", lab = isT ? nd : nd[0], kids = isT ? [] : nd.slice(1), col = null;
      var p = lab.split("|"); if(p.length > 1){ lab = p[0]; col = p[1]; }
      var q = { l: lab, t: isT, c: col, d: d, k: [] };
      maxd = Math.max(maxd, d); nodes.push(q);
      if(!kids.length){ q.x = x0 + leaves * dx; leaves++; }
      else { for(var i = 0; i < kids.length; i++){ var ch = lay(kids[i], d + 1); ch.p = q; q.k.push(ch); } q.x = (q.k[0].x + q.k[q.k.length - 1].x) / 2; }
      return q;
    }
    lay(root, 0);
    nodes.forEach(function(q){ q.y = y0 + ((o.bottom && q.t) ? maxd : q.d) * dy; });
    var s = "";
    nodes.forEach(function(q){
      q.k.forEach(function(k){
        var ddx = k.x - q.x, ddy = k.y - q.y, L = Math.sqrt(ddx * ddx + ddy * ddy) || 1, ux = ddx / L, uy = ddy / L, re = k.t ? 11 : r;
        s += K.line(q.x + ux * r, q.y + uy * r, k.x - ux * re, k.y - uy * re, o.ec || "s", { w: 1.4 });
      });
    });
    nodes.forEach(function(q){
      if(q.t) s += K.t(q.x, q.y, q.l, q.c || o.tcol || "m", { s: o.ts || 16, b: true });
      else s += K.node(q.x, q.y, q.l, q.c || "a", { r: r, s: o.s || (q.l.length > 2 ? 12 : 14) });
    });
    return { s: s, n: nodes };
  }
  /* Beschriftung neben einem Baumknoten – auf der dem Elternknoten abgewandten Seite */
  function side(K, q, txt, c, o){
    o = o || {};
    var left = q.p && q.p.x > q.x + 1, dx = o.dx || 20;
    return K.t(left ? q.x - dx : q.x + dx, q.y - (o.dy || 13), txt, c, { a: left ? "end" : "start", s: o.s || 12.5, b: true });
  }
  /* Klammer unter einem Bereich */
  function brace(K, x1, x2, y, lab, c, o){
    o = o || {};
    return K.path("M" + x1 + " " + (y - 7) + " L" + x1 + " " + y + " L" + x2 + " " + y + " L" + x2 + " " + (y - 7), c || "s", { w: 1.6 }) +
      (lab ? K.t((x1 + x2) / 2, y + 14, lab, c || "s", { s: o.s || 13, b: true }) : "");
  }

  /* ═════════ Kapitel 1: Kellerautomaten und kontextfreie Sprachen ═════════ */

  add("nka", "Kellerautomat = endlicher Automat + Keller",
    "Der NKA liest das <b>Eingabeband</b> nur von links nach rechts. Neu ist der <b>Keller</b> rechts: In jedem Takt wird zuerst das oberste Zeichen (<b>tos</b>) weggenommen (<b>pop</b>), dann ein ganzes Kellerwort draufgelegt (<b>multiple push</b>). Hier liegt schon ein a im Keller – so „merkt“ sich der Automat, wie viele a er gelesen hat.",
    function(K){
      var s = K.t(100, 26, "Eingabeband (nur lesen, nur vorwärts)", "s", { a: "start", s: 13 });
      s += tape(K, 100, 60, ["a", "a", "b", "b"], { cw: 40, fade: { 0: 1 }, hl: { 1: "a" } });
      s += K.arrow(160, 150, 160, 80, "m", { w: 2.4, head: 10 }) + K.t(170, 115, "Lesekopf", "m", { a: "start", s: 12.5, b: true });
      s += K.rect(80, 150, 200, 60, "a", { fill: "fa", rx: 8, w: 1.6 }) + K.t(180, 170, "Steuerwerk", "a", { s: 14, b: true, halo: false }) + K.t(180, 192, "Zustand q ∈ Q", "s", { s: 13, halo: false });
      s += stack(K, 480, 250, ["k₀", "a"], { cap: 4, tos: true });
      s += K.arrow(455, 206, 284, 172, "m", { w: 2 }) + K.t(370, 161, "1. pop: tos lesen", "m", { s: 12.5, b: true });
      s += K.arrow(284, 200, 455, 224, "c4", { w: 2 }) + K.t(362, 238, "2. push Kellerwort", "c4", { s: 12.5, b: true });
      s += K.t(480, 274, "Keller (Γ*)", "s", { s: 13 });
      s += K.f(320, 312, "M = (Q, Σ, Γ, δ, q₀, k₀, E)", "a");
      return K.svg(640, 335, s);
    });

  add("push", "Ein Arbeitstakt: pop, dann multiple push",
    "Drei Momentaufnahmen desselben Kellers. Erst wird das oberste Zeichen <b>A verbrauchend gelesen</b> (pop). Dann wird das Kellerwort <b>aA</b> aufgelegt – sein <b>erstes Zeichen a</b> landet ganz oben und ist der neue tos. Soll A erhalten bleiben, muss es also wieder mit aufgeschrieben werden.",
    function(K){
      var s = K.panel(10, 10, 200, 250, "vorher") + K.panel(220, 10, 200, 250, "1. pop") + K.panel(430, 10, 200, 250, "2. multiple push");
      s += stack(K, 110, 220, ["k₀", "A"], { cap: 4, tos: true }) + K.t(110, 244, "tos = A", "s", { s: 12.5 });
      s += stack(K, 320, 220, ["k₀"], { cap: 4 });
      s += K.cell(380, 120, "A", "m", { w: 40, h: 28, fill: "fm" }) + K.arrow(326, 186, 368, 138, "m", { w: 2, head: 9 }) + K.t(380, 92, "gelesen", "m", { s: 12.5, b: true });
      s += K.t(320, 244, "A verbraucht", "s", { s: 12.5 });
      s += K.t(530, 52, "Kellerwort aA", "c4", { s: 14, b: true }) + K.t(530, 74, "1. Zeichen → oben", "s", { s: 12 });
      s += stack(K, 530, 220, ["k₀", "A", "a"], { cap: 4, tos: true, tc: "c4" }) + K.t(530, 244, "a oben, A darunter", "s", { s: 12.5 });
      s += K.f(320, 288, "δ(q, a, A) ∋ (q′, aA)", "a");
      return K.svg(640, 310, s);
    });

  add("konfig", "Konfigurationen: (Zustand, Rest, Keller) ⊢ …",
    "Jede Spalte ist eine <b>Konfiguration</b> des DKA für {aⁿbⁿ} beim Wort aabb: oben der Zustand, darunter der noch <b>ungelesene Rest</b>, unten der <b>Keller</b>. Jedes a legt ein a ab, jedes b nimmt eines weg. Ist das Wort ganz gelesen und ein Endzustand erreicht, gilt w ∈ L(M) – was dann noch im Keller liegt, ist egal.",
    function(K){
      var st = ["q₀", "q₁", "q₁", "q₂", "q₂", "q₃ ✓"], rest = ["aabb", "abb", "bb", "b", "ε", "ε"];
      var kel = [["k₀"], ["k₀", "a"], ["k₀", "a", "a"], ["k₀", "a"], ["k₀"], ["k₀"]], s = "";
      for(var i = 0; i < 6; i++){
        var x = 70 + i * 100, last = i === 5;
        s += K.t(x, 36, st[i], last ? "m" : "a", { s: 15, b: true }) + K.t(x, 64, rest[i], "i", { s: 14, b: true });
        s += stack(K, x, 200, kel[i], { cap: 3 });
        if(i < 5) s += K.t(x + 50, 150, "⊢", "s", { s: 20, b: true });
      }
      s += K.t(320, 234, "oben: Zustand · Mitte: ungelesener Rest · unten: Keller", "s", { s: 12.5 });
      s += K.f(320, 272, "(q₀, aabb, k₀) ⊢* (q₃, ε, k₀), q₃ ∈ E ⇒ aabb ∈ L(M)", "m", { fill: "fm", s: 13 });
      return K.svg(640, 295, s);
    });

  add("leer", "Akzeptanz per Endzustand oder per leerem Keller",
    "Links die <b>7-Tupel-Form</b>: Das Wort ist ganz gelesen und der Automat steht in einem <b>Endzustand</b> – was im Keller liegt, zählt nicht. Rechts die <b>6-Tupel-Form</b> ohne Endzustände: Akzeptiert wird, wenn der <b>Keller leer</b> ist. Satz 1.1: Beide Varianten lassen sich ineinander umbauen, sie sind gleich mächtig.",
    function(K){
      var s = K.panel(10, 10, 295, 250, "Endzustand (7-Tupel)", "a") + K.panel(340, 10, 290, 250, "leerer Keller (6-Tupel)", "c4");
      s += K.t(322, 135, "⇔", "m", { s: 22, b: true });
      s += K.t(157, 50, "w ganz gelesen ✓", "s", { s: 13 }) + K.state(85, 140, "qₑ", { final: true }) + K.t(85, 182, "Endzustand ✓", "a", { s: 13, b: true });
      s += stack(K, 225, 200, ["k₀", "a"], { cap: 4 }) + K.t(225, 226, "Keller egal", "s", { s: 13 });
      s += K.t(485, 50, "w ganz gelesen ✓", "s", { s: 13 });
      s += stack(K, 485, 200, [], { cap: 4 }) + K.t(485, 226, "Keller leer ✓", "c4", { s: 13, b: true }) + K.t(485, 246, "keine Endzustandsmenge E", "s", { s: 12 });
      s += K.f(320, 290, "Satz 1.1: beide Akzeptanzarten gleich mächtig", "m", { fill: "fm", s: 13 });
      return K.svg(640, 312, s);
    });

  add("kfg2nka", "kfG → NKA: der Keller spielt Linksableitung",
    "Der NKA hat nur einen Zustand. Liegt ein <b>Nichtterminal</b> oben, ersetzt er es spontan durch eine rechte Regelseite; liegt ein <b>Terminal</b> oben, muss es mit dem gelesenen Zeichen übereinstimmen und wird entfernt. So steht im Keller immer der <b>noch abzuleitende Rest</b> der Linksableitung S ⇒ aSb ⇒ aabb. Leerer Keller am Ende = akzeptiert.",
    function(K){
      var s = K.t(320, 26, "G: S → aSb | ab        Wort: aabb", "i", { s: 14, b: true });
      s += K.t(320, 52, "δ(q₀, ε, A) ∋ (q₀, α) für jede Regel A → α   ·   δ(q₀, a, a) ∋ (q₀, ε)", "s", { s: 12.5 });
      var kel = [["S"], ["b", "S", "a"], ["b", "S"], ["b", "b", "a"], ["b", "b"], ["b"], []];
      var gel = ["–", "–", "a", "a", "aa", "aab", "aabb"], act = ["Start", "S→aSb", "lies a", "S→ab", "lies a", "lies b", "lies b ✓"];
      for(var i = 0; i < 7; i++){
        var x = 60 + i * 85, rule = act[i].indexOf("→") > 0;
        s += K.t(x, 96, gel[i], "s", { s: 13.5, b: true });
        s += stack(K, x, 230, kel[i], { cap: 3, w: 36, tc: rule ? "a" : "m" });
        s += K.t(x, 252, act[i], rule ? "a" : (i === 0 ? "s" : "m"), { s: 12.5, b: true });
      }
      s += K.t(570, 210, "leer", "m", { s: 13, b: true });
      s += K.t(320, 284, "obere Zeile: schon gelesen · Keller: noch abzuleitender Rest (Linksableitung)", "s", { s: 12.5 });
      return K.svg(640, 300, s);
    });

  add("nka2kfg", "NKA → kfG: Nichtterminale [q, A, q′]",
    "Die Kurve zeigt die <b>Kellerhöhe</b> über der Zeit. Das Nichtterminal <b>[q, A, q′]</b> steht für alles, was der Automat liest, während er von q aus das oben liegende A <b>wieder loswird</b> und dabei in q′ landet. Ersetzt ein Schritt A durch BC, zerfällt das Stück in zwei kleinere: erst B loswerden ([r, B, p]), dann C ([p, C, q′]).",
    function(K){
      var s = K.t(320, 22, "δ(q, a, A) ∋ (r, BC)  ⇒  [q, A, q′] → a [r, B, p] [p, C, q′]", "i", { s: 13.5, b: true });
      s += K.arrow(60, 245, 612, 245, "s", { w: 1.3, head: 9 }) + K.arrow(60, 245, 60, 48, "s", { w: 1.3, head: 9 });
      s += K.t(70, 50, "Kellerhöhe", "s", { a: "start", s: 12 }) + K.t(604, 230, "Zeit", "s", { a: "end", s: 12 });
      s += K.line(60, 170, 430, 170, "f", { w: 1, dash: "4 4" }) + K.line(60, 220, 430, 220, "f", { w: 1, dash: "4 4" });
      s += K.t(440, 170, "Höhe mit A oben", "s", { a: "start", s: 12 }) + K.t(440, 220, "A entfernt", "s", { a: "start", s: 12 });
      s += K.path("M80 170 L130 120", "a", { w: 3 }) + K.path("M130 120 L180 70 L220 120 L260 170", "c4", { w: 3 }) + K.path("M260 170 L310 120 L360 170 L410 220", "c3", { w: 3 });
      s += K.dot(80, 170, "i", 5) + K.dot(130, 120, "i", 5) + K.dot(260, 170, "i", 5) + K.dot(410, 220, "i", 5);
      s += K.t(70, 152, "q", "i", { s: 15, b: true, it: true }) + K.t(116, 108, "r", "i", { s: 15, b: true, it: true }) + K.t(260, 190, "p", "i", { s: 15, b: true, it: true }) + K.t(424, 236, "q′", "i", { s: 15, b: true, it: true });
      s += K.t(114, 156, "a", "a", { a: "start", s: 13, b: true });
      s += lines(K, 445, 72, ["[q, A, q′] erzeugt genau das,", "was der NKA ab q liest,", "bis A weg ist und er in", "q′ steht"], "s", { s: 12.5 });
      s += brace(K, 132, 258, 264, "[r, B, p]", "c4") + brace(K, 262, 410, 264, "[p, C, q′]", "c3") + brace(K, 80, 410, 298, "", "a") + K.t(245, 312, "[q, A, q′]", "a", { s: 13, b: true });
      return K.svg(640, 325, s);
    });

  add("exp", "Warum NKA-Parsing exponentiell teuer ist",
    "Hat der Automat bei jedem Zeichen <b>k Möglichkeiten</b>, verzweigt sich der Suchbaum bei jedem Schritt erneut. Nach n Zeichen gibt es bis zu <b>kⁿ Wege</b> – hier k = 2, n = 3: acht Wege, von denen nur einer zum Ziel führt. Alle Sackgassen müssen per <b>Backtracking</b> zurückverfolgt werden.",
    function(K){
      var s = "", L = [[320], [180, 460], [110, 250, 390, 530], [75, 145, 215, 285, 355, 425, 495, 565]], Y = [60, 130, 200, 270];
      for(var d = 0; d < 3; d++) for(var i = 0; i < L[d].length; i++){
        s += K.line(L[d][i], Y[d] + 14, L[d + 1][2 * i], Y[d + 1] - 14, (d === 0 && i === 1) || (d === 1 && i === 2) || (d === 2 && i === 5) ? "a" : "f", { w: 1.6 });
      }
      for(d = 0; d < 4; d++) for(i = 0; i < L[d].length; i++){
        var ok = d === 3 && i === 5, onp = (d === 0) || (d === 1 && i === 1) || (d === 2 && i === 2) || ok;
        s += K.node(L[d][i], Y[d], d === 3 ? (ok ? "✓" : "✗") : "", ok ? "a" : (d === 3 ? "m" : (onp ? "a" : "s")), { r: 14, s: 14, fill: ok ? "fa" : "p" });
      }
      s += K.t(615, 130, "1. Zeichen", "s", { a: "start", s: 12 }) + K.t(615, 200, "2. Zeichen", "s", { a: "start", s: 12 }) + K.t(615, 270, "3. Zeichen", "s", { a: "start", s: 12 });
      s += K.f(340, 312, "k Wahlmöglichkeiten je Schritt ⇒ bis zu kⁿ Wege", "m", { fill: "fm", s: 13 });
      return K.svg(680, 335, s);
    });

  add("dka", "DKA für {aⁿbⁿ | n ≥ 1}",
    "Jede Kante trägt <b>gelesenes Zeichen, tos / neues Kellerwort</b>. In q₁ wird jedes a gekellert, in q₂ nimmt jedes b ein a wieder weg. Kommt am Wortende das <b>k₀</b> wieder zum Vorschein, waren es gleich viele a und b – der spontane ε-Übergang führt in den Endzustand q₃. In jeder Lage gibt es höchstens einen passenden Übergang: <b>deterministisch</b>.",
    function(K){
      var s = K.state(90, 160, "q₀", { start: true }) + K.state(240, 160, "q₁") + K.state(390, 160, "q₂") + K.state(540, 160, "q₃", { final: true });
      s += K.edge(90, 160, 240, 160, { lab: "a, k₀ / ak₀", c: "a" }) + K.loop(240, 160, 90, { lab: "a, a / aa", c: "a" });
      s += K.edge(240, 160, 390, 160, { lab: "b, a / ε", c: "c4" }) + K.loop(390, 160, 90, { lab: "b, a / ε", c: "c4" });
      s += K.edge(390, 160, 540, 160, { lab: "ε, k₀ / k₀", c: "m" });
      s += K.t(320, 228, "Beschriftung: Lesezeichen, tos / neues Kellerwort", "s", { s: 12.5 });
      s += K.t(320, 256, "a kellern · b entkellern · k₀ wieder oben ⇒ akzeptieren", "i", { s: 13, b: true });
      return K.svg(640, 275, s);
    });

  add("palin", "Palindrome: NKA ja, DKA nein – außer die Mitte ist markiert",
    "Für ein Palindrom muss der Automat die erste Hälfte kellern und die zweite <b>rückwärts vergleichen</b>. Links weiß er nicht, wo die Mitte ist – ein <b>NKA rät</b> sie (an jeder Stelle eine Verzweigung). Rechts zeigt das <b>c</b> die Mitte an: Dort wird sicher vom Kellern aufs Entkellern umgeschaltet – das schafft ein <b>DKA</b>.",
    function(K){
      var s = K.panel(10, 10, 300, 280, "w = abba: Mitte unbekannt", "m") + K.panel(330, 10, 300, 280, "w = abcba: Mitte markiert", "a");
      s += tape(K, 92, 80, ["a", "b", "b", "a"], { cw: 34 });
      s += K.line(126, 56, 126, 104, "f", { w: 1.4, dash: "3 4" }) + K.line(194, 56, 194, 104, "f", { w: 1.4, dash: "3 4" }) + K.line(160, 52, 160, 108, "m", { w: 2.4, dash: "6 4" });
      s += K.t(160, 120, "Mitte? (geraten)", "m", { s: 12.5, b: true });
      s += stack(K, 160, 230, ["k₀", "a", "b"], { cap: 3 }) + K.t(160, 254, "kellern … dann vergleichen", "s", { s: 12.5 });
      s += K.t(160, 274, "NKA nötig", "m", { s: 13, b: true });
      s += tape(K, 395, 80, ["a", "b", "c", "b", "a"], { cw: 34, hl: { 2: "a" } }) + K.t(480, 120, "c = Mitte (sicher)", "a", { s: 12.5, b: true });
      s += stack(K, 480, 230, ["k₀", "a", "b"], { cap: 3 }) + K.t(480, 254, "bei c umschalten", "s", { s: 12.5 }) + K.t(480, 274, "DKA genügt", "a", { s: 13, b: true });
      return K.svg(640, 300, s);
    });

  add("klassen", "LL(1) ⊊ LL(2) ⊊ … ⊊ LL(k) ⊊ dkfS ⊊ kfS",
    "Jeder Kasten ist eine Sprachklasse, innere Kästen sind <b>echte Teilmengen</b>. Ganz außen die kontextfreien Sprachen (NKA), darin die <b>deterministischen</b> (DKA = LR(1)). Die LL(k)-Klassen werden mit jedem zusätzlichen Vorausschauzeichen größer, erreichen die dkfS aber nie. Palindrome liegen außerhalb der dkfS – dafür braucht es einen NKA.",
    function(K){
      var s = K.rect(10, 10, 620, 300, "s", { fill: "p", rx: 10, w: 1.6 }) + K.t(28, 32, "kfS = L(NKA)", "s", { a: "start", s: 14, b: true });
      s += K.rect(30, 50, 500, 248, "a", { fill: "p", rx: 10, w: 1.8 }) + K.t(48, 72, "dkfS = L(DKA) = LR(1)", "a", { a: "start", s: 14, b: true });
      s += K.rect(50, 90, 360, 198, "c4", { fill: "p", rx: 10, w: 1.6 }) + K.t(66, 110, "LL(k)", "c4", { a: "start", s: 13.5, b: true });
      s += K.rect(70, 126, 320, 154, "c4", { fill: "p", rx: 10, w: 1.2, dash: "5 4" }) + K.t(86, 144, "…", "c4", { a: "start", s: 14, b: true });
      s += K.rect(90, 160, 280, 112, "c4", { fill: "p", rx: 10, w: 1.4 }) + K.t(106, 178, "LL(2)", "c4", { a: "start", s: 13.5, b: true });
      s += K.rect(110, 196, 240, 68, "m", { fill: "fm", rx: 10, w: 1.8 }) + K.t(126, 214, "LL(1)", "m", { a: "start", s: 13.5, b: true }) + K.t(230, 242, "z. B. {aⁿbⁿ | n ≥ 1}", "i", { s: 13 });
      s += K.t(470, 170, "LL(k) ⊊ dkfS", "a", { s: 13 }) + K.t(470, 190, "(echt kleiner)", "s", { s: 12 });
      s += K.t(580, 150, "Palin-", "m", { s: 13, b: true }) + K.t(580, 168, "drome", "m", { s: 13, b: true });
      return K.svg(640, 320, s);
    });

  add("pargen", "Parsergenerator: aus Regeln wird ein Parser",
    "Oben die Eingaben für den Generator: <b>reguläre Ausdrücke</b> beschreiben die Token, die <b>kfG</b> den Satzbau. Der Generator (z. B. VCC) erzeugt daraus <b>Scanner</b> und <b>Parser</b>. Unten läuft das fertige Programm: Der Scanner zerlegt den Quelltext in Token (Zahl, Farbwert … sind dann schon fertig), der Parser prüft nur noch die Struktur.",
    function(K){
      var s = K.cell(230, 40, "reguläre Ausdrücke", "c4", { w: 150, h: 32, s: 13 }) + K.cell(430, 40, "kfG (Regeln)", "a", { w: 150, h: 32, s: 13 });
      s += K.cell(330, 120, "Parsergenerator (VCC)", "i", { w: 220, h: 36, s: 13.5, fill: "fa" });
      s += K.arrow(240, 57, 285, 100, "c4", { w: 2 }) + K.arrow(420, 57, 375, 100, "a", { w: 2 });
      s += K.arrow(285, 139, 238, 190, "c4", { w: 2, dash: "6 4" }) + K.arrow(375, 139, 422, 190, "a", { w: 2, dash: "6 4" }) + K.t(330, 172, "erzeugt", "s", { s: 12 });
      s += K.cell(80, 210, "Quelltext", "s", { w: 100, h: 34, s: 13 }) + K.cell(230, 210, "Scanner", "c4", { w: 110, h: 34, s: 13.5, fill: "fa" });
      s += K.cell(430, 210, "Parser", "a", { w: 110, h: 34, s: 13.5, fill: "fa" }) + K.cell(580, 210, "Syntaxbaum", "m", { w: 100, h: 34, s: 13 });
      s += K.arrow(130, 210, 173, 210, "s", { w: 2 }) + K.arrow(285, 210, 373, 210, "s", { w: 2 }) + K.arrow(485, 210, 528, 210, "s", { w: 2 });
      s += K.t(329, 196, "Token", "c4", { s: 12.5, b: true });
      s += K.t(320, 262, "Zahl, Farbwert … erledigt der Scanner – der Parser sieht nur noch Token", "s", { s: 12.5 });
      return K.svg(640, 280, s);
    });

  add("mstufen", "Produktive Nichtterminale: Mᵢ wächst bis zum Stillstand",
    "Die Tabelle zeigt, wann ein Nichtterminal als <b>produktiv</b> erkannt wird (es kann ein reines Terminalwort erzeugen). M₁: Regeln mit nur Terminalen rechts (A → a, D → a). Jede Runde kommen die dazu, deren rechte Seite nur noch aus Terminalen und schon bekannten Nichtterminalen besteht. Ändert sich nichts mehr, ist Schluss – <b>C</b> schafft es nie (C → cC endet nicht).",
    function(K){
      var s = K.t(30, 40, "Grammatik", "s", { a: "start", s: 13, b: true });
      s += lines(K, 30, 72, ["S → AB", "A → aA | a", "B → Ab | C", "C → cC", "D → a"], "i", { s: 15, lh: 30 });
      var cols = [300, 380, 460, 540], rows = ["S", "A", "B", "C", "D"], heads = ["M₁", "M₂", "M₃", "M₄"];
      var mem = { S: [0, 0, 2, 1], A: [2, 1, 1, 1], B: [0, 2, 1, 1], C: [0, 0, 0, 0], D: [2, 1, 1, 1] };
      for(var j = 0; j < 4; j++) s += K.t(cols[j], 40, heads[j], "a", { s: 15, b: true });
      for(var i = 0; i < 5; i++){
        var y = 72 + i * 30;
        s += K.t(250, y, rows[i], rows[i] === "C" ? "m" : "i", { s: 15, b: true });
        for(j = 0; j < 4; j++){
          var v = mem[rows[i]][j];
          s += K.cell(cols[j], y, v ? "✓" : "", v === 2 ? "m" : (v ? "a" : "r"), { w: 60, h: 24, fill: v === 2 ? "fm" : (v ? "fa" : "p"), tc: v === 2 ? "m" : "a", s: 14 });
        }
      }
      s += K.t(540, 230, "M₄ = M₃ → Stopp", "s", { s: 12.5 }) + K.t(250, 230, "rot = neu dazu", "m", { s: 12.5 });
      s += K.f(320, 272, "Mᵢ₊₁ = Mᵢ ∪ {X | X → α, α ∈ (Mᵢ ∪ T)*}", "a", { s: 13 });
      return K.svg(640, 295, s);
    });

  add("unnuetz", "Unnütze Nichtterminale entfernen: erst produktiv, dann erreichbar",
    "<b>Schritt 1</b>: C kann nie ein Terminalwort liefern – C und jede Regel, die C benutzt (B → C), fliegen raus. <b>Schritt 2</b>: Vom Spitzensymbol S aus folgt man den Regeln; D wird nie erreicht und fällt ebenfalls weg. Übrig bleibt eine kleinere, gleichwertige Grammatik.",
    function(K){
      var s = K.panel(10, 10, 300, 255, "1. produktiv?", "m") + K.panel(330, 10, 300, 255, "2. erreichbar von S?", "a");
      s += K.t(40, 60, "S → AB", "i", { a: "start", s: 15, b: true }) + K.t(40, 90, "A → aA | a", "i", { a: "start", s: 15, b: true });
      s += K.t(40, 120, "B → Ab", "i", { a: "start", s: 15, b: true }) + K.t(118, 120, "| C", "m", { a: "start", s: 15, b: true }) + K.line(114, 120, 146, 120, "m", { w: 2 });
      s += K.t(40, 150, "C → cC", "m", { a: "start", s: 15, b: true }) + K.line(36, 150, 104, 150, "m", { w: 2 });
      s += K.t(40, 180, "D → a", "i", { a: "start", s: 15, b: true });
      s += K.t(160, 218, "C → cC endet nie", "m", { s: 12.5 }) + K.t(160, 244, "produktiv: S, A, B, D", "a", { s: 13, b: true });
      s += K.node(400, 80, "S", "a") + K.node(400, 180, "A", "a") + K.node(520, 80, "B", "a") + K.node(560, 180, "D", "m", { fill: "fm" });
      s += K.edge(400, 80, 400, 180, { r1: 18, r2: 18, c: "a" }) + K.edge(400, 80, 520, 80, { r1: 18, r2: 18, c: "a" }) + K.edge(520, 80, 400, 180, { r1: 18, r2: 18, c: "a" });
      s += K.line(545, 165, 575, 195, "m", { w: 2 }) + K.line(575, 165, 545, 195, "m", { w: 2 });
      s += K.t(480, 244, "erreichbar: S, A, B → D weg", "a", { s: 13, b: true });
      s += K.f(320, 292, "Ergebnis:  S → AB,  A → aA | a,  B → Ab", "a", { s: 13 });
      return K.svg(640, 315, s);
    });

  add("kette", "Kettenregeln X → Y durchreichen",
    "A → B und B → C sind <b>Kettenregeln</b>: Sie tauschen nur ein Nichtterminal gegen ein anderes. Man sammelt alle Paare mit A ⇒* B (gestrichelter Bogen: auch A ⇒* C) und gibt jedem Nichtterminal direkt die Terminal-Alternativen seiner Kettenziele. Rot: <b>durchgereichte</b> Alternativen. Danach sind alle Kettenregeln überflüssig.",
    function(K){
      var s = K.node(100, 100, "A", "a") + K.node(260, 100, "B", "a") + K.node(420, 100, "C", "a");
      s += K.edge(100, 100, 260, 100, { r1: 18, r2: 18, c: "c4", lab: "A → B" }) + K.edge(260, 100, 420, 100, { r1: 18, r2: 18, c: "c4", lab: "B → C" });
      s += K.edge(100, 100, 420, 100, { r1: 18, r2: 18, c: "c4", bend: 58, dash: "5 4", w: 1.4 }) + K.t(260, 38, "A ⇒* C", "c4", { s: 13, b: true });
      s += K.line(100, 118, 100, 143, "s", { w: 1.2 }) + K.line(260, 118, 260, 143, "s", { w: 1.2 }) + K.line(420, 118, 420, 143, "s", { w: 1.2 });
      s += K.cell(100, 158, "a", "s", { w: 30, h: 28 }) + K.cell(260, 158, "b", "s", { w: 30, h: 28 }) + K.cell(420, 158, "c", "s", { w: 30, h: 28 });
      s += K.t(480, 158, "eigene Alternativen", "s", { a: "start", s: 12.5 });
      s += K.t(75, 230, "A →", "i", { a: "end", s: 15, b: true }) + K.cell(95, 230, "a", "s", { w: 30, h: 28 }) + K.cell(131, 230, "b", "m", { w: 30, h: 28, fill: "fm" }) + K.cell(167, 230, "c", "m", { w: 30, h: 28, fill: "fm" });
      s += K.t(235, 230, "B →", "i", { a: "end", s: 15, b: true }) + K.cell(255, 230, "b", "s", { w: 30, h: 28 }) + K.cell(291, 230, "c", "m", { w: 30, h: 28, fill: "fm" });
      s += K.t(395, 230, "C →", "i", { a: "end", s: 15, b: true }) + K.cell(415, 230, "c", "s", { w: 30, h: 28 });
      s += K.t(480, 230, "nachher", "s", { a: "start", s: 12.5 });
      s += K.f(320, 282, "M = {(A,B), (A,C), (B,C)}", "c4", { s: 13 });
      return K.svg(640, 305, s);
    });

  add("cnf", "Chomsky-Normalform: jeder Baum ist binär",
    "In CNF gibt es nur zwei Regelformen: ein Nichtterminal wird zu <b>genau einem Terminal</b> (Blatt) oder zu <b>genau zwei Nichtterminalen</b>. Darum ist jeder Ableitungsbaum ein <b>Binärbaum</b> – rechts für aabb mit S → AB | AC, C → SB, A → a, B → b. Diese feste Form nutzt der CYK-Algorithmus aus.",
    function(K){
      var s = K.panel(10, 10, 160, 260, "X → a", "a") + K.panel(180, 10, 160, 260, "X → YZ", "a") + K.panel(350, 10, 280, 260, "Baum für aabb", "m");
      s += K.node(90, 90, "X", "a") + K.line(90, 105, 90, 172, "s", { w: 1.4 }) + K.t(90, 186, "a", "m", { s: 16, b: true });
      s += K.t(90, 232, "Blatt: 1 Terminal", "s", { s: 12 });
      s += K.node(260, 90, "X", "a") + K.line(251, 102, 222, 168, "s", { w: 1.4 }) + K.line(269, 102, 298, 168, "s", { w: 1.4 }) + K.node(215, 182, "Y", "a") + K.node(305, 182, "Z", "a");
      s += K.t(260, 232, "innen: 2 Nichtterminale", "s", { s: 12 });
      s += tree(K, ["S", ["A", "a"], ["C", ["S", ["A", "a"], ["B", "b"]], ["B", "b"]]], 408, 55, 56, 47, { bottom: true }).s;
      return K.svg(640, 280, s);
    });

  add("cnfschritte", "Umbau in CNF: Terminale ersetzen, lange Seiten zerlegen",
    "Links die Regel X → aYZa mit vier Zeichen rechts. Schritt (b): jedes Terminal a wird durch ein neues Nichtterminal <b>Xₐ</b> mit Xₐ → a ersetzt. Schritt (c): die lange Seite wird mit neuen Nichtterminalen <b>W₁, W₂</b> in Zweierschritte zerlegt. Rechts entsteht derselbe Wortteil a…a – aber als <b>Binärbaum</b>.",
    function(K){
      var s = K.panel(10, 10, 240, 245, "vorher: X → aYZa", "s") + K.panel(260, 10, 370, 245, "nachher (CNF)", "a");
      s += tree(K, ["X", "a", ["Y"], ["Z"], "a"], 60, 45, 70, 100, {}).s;
      s += tree(K, ["X", ["Xₐ", "a"], ["W₁", ["Y"], ["W₂", ["Z"], ["Xₐ", "a"]]]], 340, 70, 56, 46, {}).s;
      s += K.f(320, 282, "Xₐ → a    X → Xₐ W₁    W₁ → Y W₂    W₂ → Z Xₐ", "a", { s: 13 });
      return K.svg(640, 305, s);
    });

  add("cyk", "CYK-Tabelle für aabb",
    "Unten stehen die Nichtterminale für jedes Einzelzeichen, darüber für Teilwörter der Länge 2, 3, 4. Für jede Zelle probiert man <b>alle Teilungen</b> des Teilworts und prüft, ob eine Regel X → YZ die beiden Hälften verbindet – z. B. C aus S (ab) und B (b). Steht oben das <b>Spitzensymbol S</b>, ist das Wort ableitbar. Aufwand O(n³).",
    function(K){
      var rows = [[["A", "A", "B", "B"], 222], [["∅", "S", "∅"], 180], [["∅", "C"], 138], [["S"], 96]], s = "";
      for(var r = 0; r < 4; r++){
        var arr = rows[r][0], y = rows[r][1], x0 = 155 + r * 45;
        for(var i = 0; i < arr.length; i++){
          var v = arr[i], hot = (r === 3) || (r === 2 && i === 1), op = (r === 1 && i === 1) || (r === 0 && i === 3);
          s += K.cell(x0 + i * 90, y, v, hot ? "m" : (op ? "c4" : (v === "∅" ? "r" : "a")), { w: 86, h: 38, bw: hot || op ? 2.2 : 1.6, fill: hot ? "fm" : (v === "∅" ? "p" : "fa"), tc: v === "∅" ? "f" : (hot ? "m" : (op ? "c4" : "a")), s: 15 });
        }
        s += K.t(x0 - 54, y, "Länge " + (r + 1), "s", { a: "end", s: 12 });
      }
      ["a", "a", "b", "b"].forEach(function(c, i){ s += K.t(155 + i * 90, 262, c, "i", { s: 17, b: true }); });
      s += lines(K, 488, 96, ["S → AB | AC", "C → SB", "A → a", "B → b"], "i", { s: 14, lh: 24, b: true });
      s += K.t(488, 262, "C aus S (ab) · B (b)", "c4", { a: "start", s: 12.5, b: true });
      s += K.t(488, 210, "S oben ⇒", "m", { a: "start", s: 13, b: true }) + K.t(488, 230, "aabb ∈ L(G)", "m", { a: "start", s: 13, b: true });
      s += K.f(300, 40, "jede Zelle: alle Teilungen prüfen → O(n³)", "a", { s: 13 });
      return K.svg(640, 285, s);
    });

  /* ═════════ Kapitel 2: LL(k)-Sprachen ═════════ */

  add("ll", "L-L-(k): links nach rechts, Linksableitung, k Zeichen Vorausschau",
    "Das <b>erste L</b>: Der Lesekopf wandert nur vorwärts (grau = schon gelesen). Das <b>zweite L</b>: In der Satzform wird immer das <b>linkeste Nichtterminal</b> ersetzt – hier T. Und <b>k = 1</b>: Das eine Vorausschauzeichen a entscheidet sofort, welche Regel für T gilt (T → a statt T → (E)), ganz ohne Ausprobieren.",
    function(K){
      var s = K.t(200, 34, "1. L: Eingabe links → rechts", "s", { a: "start", s: 13, b: true });
      s += tape(K, 200, 70, ["a", "+", "a", "$"], { cw: 44, fade: { 0: 1, 1: 1 }, hl: { 2: "m" } });
      s += K.arrow(200, 100, 380, 100, "s", { w: 1.4, head: 8 }) + K.t(310, 116, "nur vorwärts", "s", { s: 12 });
      s += K.t(398, 70, "← k = 1 Vorausschau", "m", { a: "start", s: 13, b: true });
      s += K.t(320, 160, "Satzform jetzt:  a + T E′", "i", { s: 16, b: true }) + K.t(320, 184, "2. L: linkestes Nichtterminal T ersetzen – Vorausschau a ⇒ T → a", "a", { s: 13, b: true });
      s += K.f(320, 230, "E ⇒ TE′ ⇒ aE′ ⇒ a+TE′ ⇒ a+aE′ ⇒ a+a", "a", { s: 14 });
      s += K.t(320, 268, "Grammatik: E → TE′,  E′ → +TE′ | ε,  T → a | (E)", "s", { s: 12.5 });
      return K.svg(640, 290, s);
    });

  add("topdown", "Top-down (LL) gegen Bottom-up (LR) – derselbe Baum",
    "Beide Verfahren bauen denselben Syntaxbaum für a+a*a, aber in <b>umgekehrter Richtung</b>. Die Zahlen geben die Reihenfolge an: <b>LL</b> beginnt an der Wurzel und ersetzt immer das linkeste Nichtterminal (Linksableitung). <b>LR</b> fängt bei den Blättern an und fasst zusammen, sobald eine Regelseite komplett ist (Linksreduktion) – die Wurzel E entsteht zuletzt.",
    function(K){
      var tr = ["E", ["E", ["T", ["F", "a"]]], "+", ["T", ["T", ["F", "a"]], "*", ["F", "a"]]];
      var s = K.panel(10, 10, 305, 290, "top-down (LL): Wurzel zuerst", "a") + K.panel(325, 10, 305, 290, "bottom-up (LR): Blätter zuerst", "c4");
      var A = tree(K, tr, 55, 52, 64, 50, { bottom: true, r: 14 }), B = tree(K, tr, 370, 52, 64, 50, { bottom: true, r: 14 });
      s += A.s + B.s;
      var td = [1, 2, 3, 4, 5, 6, 7, 8], bu = [8, 3, 2, 1, 7, 5, 4, 6], k = 0;
      A.n.forEach(function(q){ if(!q.t) s += side(K, q, String(td[k++]), "a"); });
      k = 0;
      B.n.forEach(function(q){ if(!q.t) s += side(K, q, String(bu[k++]), "c4"); });
      s += K.arrow(290, 60, 290, 140, "a", { w: 2.2 }) + K.arrow(605, 140, 605, 60, "c4", { w: 2.2 });
      return K.svg(640, 310, s);
    });

  add("first1", "LL(1)-Forderung 1 verletzt: gleiche FIRST-Zeichen",
    "S hat zwei Alternativen. Was kann jeweils <b>ganz vorn</b> stehen? Bei A: x oder y, bei B: x oder z. Kommt als Vorausschau ein <b>x</b>, passen beide – der Parser kann sich nicht sicher entscheiden. Forderung 1 verlangt deshalb: Die FIRST-Mengen aller Alternativen eines Nichtterminals müssen <b>disjunkt</b> sein.",
    function(K){
      var s = K.node(320, 50, "S", "a", { r: 18 }) + K.node(180, 140, "A", "a", { r: 18 }) + K.node(460, 140, "B", "a", { r: 18 });
      s += K.edge(320, 50, 180, 140, { r1: 18, r2: 18, c: "s", lab: "S → A", lo: 14 }) + K.edge(320, 50, 460, 140, { r1: 18, r2: 18, c: "s", lab: "S → B", lo: -14 });
      s += K.t(180, 176, "A → xA | y", "s", { s: 13 }) + K.t(460, 176, "B → xB | z", "s", { s: 13 });
      s += K.cell(155, 214, "x", "m", { w: 34, h: 30, fill: "fm" }) + K.cell(205, 214, "y", "a", { w: 34, h: 30, fill: "fa" });
      s += K.cell(435, 214, "x", "m", { w: 34, h: 30, fill: "fm" }) + K.cell(485, 214, "z", "a", { w: 34, h: 30, fill: "fa" });
      s += K.t(180, 246, "FIRST(A)", "s", { s: 12.5, b: true }) + K.t(460, 246, "FIRST(B)", "s", { s: 12.5, b: true });
      s += K.t(320, 214, "Vorausschau x: A oder B?", "m", { s: 13, b: true });
      s += K.f(320, 288, "FIRST(A) ∩ FIRST(B) = {x} ≠ ∅ ⇒ keine LL(1)-Grammatik", "m", { fill: "fm", s: 13 });
      return K.svg(640, 310, s);
    });

  add("first2", "LL(1)-Forderung 2 verletzt: X kann verschwinden",
    "Die Sprache hat zwei Wörter: <b>dad</b> und <b>d</b>. In beiden steht vorn ein d – links stammt es aus X (über B → d), rechts ist X zu <b>ε verschwunden</b> und das d kommt aus S → Xd. Sieht der Parser d, weiß er nicht, ob X etwas erzeugt. Darum muss bei X ⇒* ε gelten: FIRST(X) ∩ FOLLOW(X) = ∅.",
    function(K){
      var s = K.panel(10, 10, 300, 245, "dad: X → Ba", "a") + K.panel(330, 10, 300, 245, "d: X → C → ε", "c4");
      s += tree(K, ["S", ["X", ["B", "d|m"], "a"], "d"], 90, 70, 58, 50, { bottom: true }).s;
      s += tree(K, ["S", ["X", ["C", "ε|s"]], "d|m"], 440, 90, 58, 50, { bottom: true }).s;
      s += K.t(160, 236, "erstes d aus B", "m", { s: 12.5 }) + K.t(480, 236, "erstes d aus S → Xd", "m", { s: 12.5 });
      s += K.f(320, 285, "FIRST(X) = {d, ε}  ∩  FOLLOW(X) = {d}  =  {d} ≠ ∅", "m", { fill: "fm", s: 13 });
      s += K.t(320, 312, "G: S → Xd,  X → Ba | C,  C → ε,  B → d", "s", { s: 12.5 });
      return K.svg(640, 325, s);
    });

  add("firstfollow", "FIRST(X) und FOLLOW(X) im Ableitungsbaum",
    "Der große Dreieck-Umriss ist eine Ableitung aus S, unten steht das Wort. Der Teilbaum von <b>X</b> deckt ein Stück davon ab. <b>FIRST(X)</b> = was am <b>linken Rand</b> dieses Stücks stehen kann. <b>FOLLOW(X)</b> = was <b>direkt rechts daneben</b> stehen kann – also schon außerhalb von X. Kann X ganz verschwinden, gehört auch ε zu FIRST(X).",
    function(K){
      var s = K.poly([[320, 40], [70, 245], [570, 245]], "s", { fill: "p", w: 1.4 }) + K.node(320, 40, "S", "a");
      s += K.poly([[260, 150], [212, 245], [318, 245]], "a", { fill: "fa", w: 1.8 }) + K.node(260, 150, "X", "a", { fill: "fa" });
      for(var i = 0; i < 17; i++){
        var x = 98 + i * 26.5, inX = x > 205 && x < 320, first = i === 5, fol = i === 9;
        s += K.cell(x, 262, "", first ? "a" : (fol ? "m" : (inX ? "a" : "s")), { w: 22, h: 22, fill: first ? "fa" : (fol ? "fm" : "p"), bw: first || fol ? 2.4 : 1 });
      }
      s += K.arrow(230, 300, 230, 276, "a", { w: 2, head: 8 }) + K.t(222, 312, "FIRST(X)", "a", { a: "end", s: 13, b: true });
      s += K.arrow(337, 300, 337, 276, "m", { w: 2, head: 8 }) + K.t(345, 312, "FOLLOW(X)", "m", { a: "start", s: 13, b: true });
      s += lines(K, 445, 110, ["ε ∈ FIRST(X), falls", "X ⇒* ε (verschwindet)"], "s", { s: 12.5 });
      return K.svg(640, 325, s);
    });

  add("follow", "FOLLOW bestimmen: Regel A → αXβ",
    "Steht X in einer Regel A → αXβ, folgt X alles, womit <b>β beginnt</b> (FIRST(β) ohne ε). Kann β aber <b>ganz verschwinden</b>, steht X am rechten Rand von A – dann folgt X auch alles, was <b>A folgt</b>: FOLLOW(A) wird übernommen.",
    function(K){
      var s = K.panel(10, 10, 300, 270, "β liefert Zeichen", "a") + K.panel(330, 10, 300, 270, "β ⇒* ε", "m");
      function part(cx, eps){
        var o = K.node(cx, 60, "A", "a") + K.line(cx - 10, 72, cx - 75, 132, "s", { w: 1.4 }) + K.line(cx, 75, cx, 135, "s", { w: 1.4 }) + K.line(cx + 10, 72, cx + 75, 132, "s", { w: 1.4 });
        o += K.poly([[cx - 80, 140], [cx - 110, 205], [cx - 50, 205]], "s", { fill: "p" }) + K.t(cx - 80, 188, "α", "s", { s: 15, b: true, it: true });
        o += K.node(cx, 150, "X", "a", { fill: "fa" });
        o += K.poly([[cx + 80, 140], [cx + 50, 205], [cx + 110, 205]], eps ? "f" : "s", { fill: "p", dash: eps ? "4 4" : undefined }) + K.t(cx + 80, 188, eps ? "ε" : "β", eps ? "f" : "s", { s: 15, b: true, it: !eps });
        return o;
      }
      s += part(160, false) + K.cell(147, 228, "b", "m", { w: 26, h: 26, fill: "fm" });
      s += K.line(133, 214, 133, 242, "a", { w: 1.6 }) + K.t(110, 228, "X |", "a", { s: 13, b: true });
      s += K.t(160, 262, "FIRST(β) \\ {ε} ⊆ FOLLOW(X)", "a", { s: 13, b: true });
      s += part(480, true) + K.cell(600, 228, "c", "m", { w: 26, h: 26, fill: "fm" }) + K.t(560, 228, "A |", "a", { s: 13, b: true });
      s += K.t(480, 262, "FOLLOW(A) ⊆ FOLLOW(X)", "m", { s: 13, b: true });
      return K.svg(640, 290, s);
    });

  add("linksrek", "Linksrekursion: Endlosabstieg und FIRST-Konflikt",
    "Bei E → E + T ruft die Prozedur E() <b>sofort wieder E()</b> auf, ohne ein Zeichen zu lesen – der Abstieg endet nie. Außerdem beginnt E + T mit allem, womit T beginnt: Die FIRST-Mengen der beiden Alternativen <b>überschneiden sich</b>. Deshalb ist eine LL(1)-Grammatik nie linksrekursiv.",
    function(K){
      var s = K.panel(10, 10, 300, 270, "E() ruft E() ruft E() …", "m") + K.panel(330, 10, 300, 270, "FIRST-Konflikt", "m");
      for(var i = 0; i < 4; i++){
        var x = 70 + i * 50, y = 60 + i * 45;
        s += K.cell(x, y, "E()", i === 3 ? "m" : "a", { w: 60, h: 30, fill: i === 3 ? "fm" : "fa", s: 14 });
        if(i < 3) s += K.arrow(x + 10, y + 16, x + 40, y + 29, "m", { w: 2, head: 9 });
      }
      s += K.t(275, 242, "…", "m", { s: 20, b: true }) + K.t(160, 262, "Kopf liest nichts – Endlosschleife", "s", { s: 12.5 });
      s += K.t(480, 55, "E → E + T  |  T", "i", { s: 16, b: true });
      s += K.node(480, 105, "E", "a") + K.line(470, 118, 410, 160, "s", { w: 1.4 }) + K.line(490, 118, 550, 160, "s", { w: 1.4 });
      s += K.t(410, 175, "E + T", "a", { s: 14, b: true }) + K.t(550, 175, "T", "a", { s: 14, b: true });
      s += K.t(410, 205, "FIRST ⊇ {a, (}", "m", { s: 12.5, b: true }) + K.t(550, 205, "FIRST = {a, (}", "m", { s: 12.5, b: true });
      s += K.t(480, 248, "Überschneidung ⇒ Forderung 1 verletzt", "m", { s: 12.5, b: true });
      return K.svg(640, 290, s);
    });

  add("rekab", "Rekursiver Abstieg: eine Prozedur je Nichtterminal",
    "Links der Programmcode, rechts die Aufrufe beim Parsen eines AS-Programms. Jede Prozedur arbeitet ihre <b>rechte Regelseite</b> ab: Nichtterminale werden als <b>Prozeduraufruf</b> erledigt, Terminale mit dem nächsten Token verglichen. Bei Alternativen (Farbe) entscheidet das <b>Vorausschau-Token</b>, welcher Fall gilt.",
    function(K){
      var s = K.panel(10, 10, 270, 280, "Code", "s");
      s += lines(K, 26, 50, ["Fisch() {", "  Farbe(); Richtung(); Tempo();", "}", "Farbe() {", "  switch (Vorausschau) {", "    red:  lies(red)", "    blue: lies(blue)  …", "    sonst: Fehler", "  }", "}"], "i", { s: 12.5, lh: 22 });
      s += K.cell(450, 40, "S()", "a", { w: 70, h: 30, fill: "fa", s: 13.5 });
      s += K.cell(340, 120, "aquarium", "m", { w: 84, h: 30, s: 13 }) + K.cell(440, 120, "Fisch()", "a", { w: 80, h: 30, fill: "fa", s: 13.5 }) + K.cell(565, 120, "… 4× Fisch()", "a", { w: 116, h: 30, s: 12.5 });
      s += K.line(430, 56, 350, 104, "s", { w: 1.4 }) + K.line(447, 56, 441, 104, "s", { w: 1.4 }) + K.line(466, 56, 555, 104, "s", { w: 1.4 });
      s += K.cell(350, 200, "Farbe()", "a", { w: 82, h: 30, fill: "fa", s: 13 }) + K.cell(440, 200, "Richtung()", "a", { w: 90, h: 30, fill: "fa", s: 12.5 }) + K.cell(538, 200, "Tempo()", "a", { w: 82, h: 30, fill: "fa", s: 13 });
      s += K.line(430, 136, 360, 184, "s", { w: 1.4 }) + K.line(440, 136, 440, 184, "s", { w: 1.4 }) + K.line(450, 136, 528, 184, "s", { w: 1.4 });
      s += K.t(350, 262, "red", "m", { s: 14, b: true }) + K.t(440, 262, "l2r", "m", { s: 14, b: true }) + K.t(538, 262, "langsam", "m", { s: 14, b: true });
      s += K.line(350, 216, 350, 252, "s", { w: 1.2, dash: "3 3" }) + K.line(440, 216, 440, 252, "s", { w: 1.2, dash: "3 3" }) + K.line(538, 216, 538, 252, "s", { w: 1.2, dash: "3 3" });
      s += K.t(450, 290, "rot = gelesenes Token", "m", { s: 12 });
      return K.svg(640, 305, s);
    });

  add("tabelle", "Tabellengesteuerte LL(1)-Analyse",
    "Die Tabelle beantwortet vorab für jedes Paar (Nichtterminal oben im Keller, Vorausschauzeichen), <b>welche Regel</b> anzuwenden ist; leere Felder bedeuten Fehler. Rechts der Moment: T liegt oben, die Vorausschau ist a – Feld (T, a) sagt <b>T → a</b>. Jeder Schritt ist ein Tabellenblick, darum Aufwand <b>O(n)</b>.",
    function(K){
      var cols = ["a", "+", "(", ")", "$"], cx = [130, 200, 270, 340, 410], rows = ["E", "E′", "T"], ry = [92, 132, 172];
      var tab = { "E": ["TE′", "", "TE′", "", ""], "E′": ["", "+TE′", "", "ε", "ε"], "T": ["a", "", "(E)", "", ""] }, s = "";
      s += K.rect(25, 32, 420, 160, "r", { fill: "p", rx: 4 }) + K.line(95, 32, 95, 192, "r", { w: 1.2 }) + K.line(25, 72, 445, 72, "r", { w: 1.2 });
      for(var j = 0; j < 5; j++) s += K.t(cx[j], 52, cols[j], "c4", { s: 15, b: true });
      for(var i = 0; i < 3; i++){
        s += K.t(60, ry[i], rows[i], "a", { s: 15, b: true });
        if(i) s += K.line(25, ry[i] - 20, 445, ry[i] - 20, "r", { w: 0.8 });
        for(j = 0; j < 5; j++){
          var v = tab[rows[i]][j], hot = i === 2 && j === 0;
          if(hot) s += K.rect(cx[j] - 33, ry[i] - 18, 66, 36, "m", { fill: "fm", rx: 3, w: 2 });
          if(v) s += K.t(cx[j], ry[i], v, hot ? "m" : "i", { s: 14, b: true });
        }
      }
      s += K.t(565, 40, "Moment", "s", { s: 13, b: true });
      s += stack(K, 510, 200, ["$", "E′", "T"], { cap: 3, tos: true });
      s += K.cell(600, 120, "a", "c4", { w: 34, h: 30, fill: "fa", s: 15 }) + K.t(600, 92, "Vorausschau", "c4", { s: 12, b: true });
      s += K.f(320, 240, "Tabelle(T, a) = T → a", "m", { fill: "fm", s: 13 });
      s += K.t(320, 276, "FIRST(TE′) = {a, (}   ·   FOLLOW(E′) = {), $}  → ε-Einträge", "s", { s: 12.5 });
      return K.svg(640, 295, s);
    });

  add("linksrekweg", "Direkte Linksrekursion beseitigen",
    "Beide Bäume erzeugen dasselbe Wort βαα. Links wächst der Baum <b>nach links unten</b> (X ruft zuerst X) – für Top-down ungeeignet. Rechts wird erst <b>β gelesen</b>, dann hängt das neue Nichtterminal X′ die α-Teile <b>nach rechts</b> an und endet mit ε. Gleiche Sprache, aber jetzt beginnt jede Alternative mit einem Zeichen, das man sehen kann.",
    function(K){
      var s = K.panel(10, 10, 290, 270, "X → Xα | β", "m") + K.panel(310, 10, 320, 270, "X → βX′,  X′ → αX′ | ε", "a");
      s += tree(K, ["X", ["X", ["X", "β"], "α"], "α"], 95, 60, 62, 52, { bottom: true }).s;
      s += tree(K, ["X", "β", ["X′", "α", ["X′", "α", ["X′", "ε|s"]]]], 370, 62, 56, 46, { bottom: true }).s;
      s += K.t(155, 262, "linkslastig: Endlos-Abstieg", "m", { s: 12.5 }) + K.t(470, 262, "rechtslastig: LL-tauglich", "a", { s: 12.5 });
      return K.svg(640, 290, s);
    });

  add("paull", "Indirekte Linksrekursion: Paull-Algorithmus",
    "Links der Kreis: S führt über A wieder zu S, ohne dass vorher ein Zeichen gelesen wird (S ⇒ Aa ⇒ Sda). Der Paull-Algorithmus <b>nummeriert</b> die Nichtterminale und <b>setzt</b> in A → Sd die Alternativen von S <b>ein</b>. Dadurch wird die versteckte Linksrekursion zur direkten (A → Aad), die man dann mit A′ beseitigt.",
    function(K){
      var s = K.panel(10, 10, 280, 270, "Kreis S → A → S", "m");
      s += K.node(80, 110, "S", "a", { r: 20 }) + K.node(220, 110, "A", "a", { r: 20 });
      s += K.edge(80, 110, 220, 110, { r1: 20, r2: 20, bend: 30, c: "m", lab: "S → Aa", lo: 14 }) + K.edge(220, 110, 80, 110, { r1: 20, r2: 20, bend: 30, c: "m", lab: "A → Sd", lo: 14 });
      s += K.t(150, 210, "S ⇒ Aa ⇒ Sda", "m", { s: 15, b: true }) + K.t(150, 240, "G: S → Aa | b,  A → Sd | c", "s", { s: 12.5 });
      s += lines(K, 310, 40, ["1. nummerieren: X₁ = S, X₂ = A", "2. in A → Sd die S-Regeln einsetzen:"], "i", { s: 13.5, lh: 30 });
      s += K.f(465, 108, "A → Aad | bd | c", "c3", { s: 13 });
      s += K.t(310, 150, "3. direkte Linksrekursion beseitigen:", "i", { a: "start", s: 13.5 });
      s += K.f(465, 186, "A → bdA′ | cA′", "a", { s: 13 }) + K.f(465, 224, "A′ → adA′ | ε", "a", { s: 13 });
      s += K.t(465, 262, "S → Aa | b bleibt", "s", { s: 12.5 });
      return K.svg(640, 290, s);
    });

  add("mehrdeutig", "Mehrdeutig: ein Wort, zwei Syntaxbäume",
    "Mit E → E + E | a lässt sich a+a+a auf <b>zwei Arten</b> ableiten: links wird zuerst (a+a) zusammengefasst, rechts zuerst (a+a) am Ende. Gibt es für ein Wort zwei verschiedene Bäume, ist die Grammatik <b>mehrdeutig</b> – kein deterministischer Parser kann sich dann eindeutig entscheiden. Mehrdeutige Grammatiken sind nie LL(k) und nie LR(1).",
    function(K){
      var s = K.panel(10, 10, 300, 250, "(a + a) + a", "a") + K.panel(330, 10, 300, 250, "a + (a + a)", "c4");
      s += tree(K, ["E", ["E", ["E", "a"], "+", ["E", "a"]], "+", ["E", "a"]], 60, 50, 60, 55, { bottom: true }).s;
      s += tree(K, ["E", ["E", "a"], "+", ["E", ["E", "a"], "+", ["E", "a"]]], 380, 50, 60, 55, { bottom: true, }).s;
      s += K.f(320, 288, "E → E + E | a:  zwei Bäume für a+a+a ⇒ mehrdeutig", "m", { fill: "fm", s: 13 });
      return K.svg(640, 310, s);
    });

  add("faktor", "Linksfaktorisierung: Entscheidung nach hinten schieben",
    "Links beginnen beide Alternativen mit <b>a</b> – mit einem Zeichen Vorausschau ist an der Gabelung nicht klar, welcher Weg gilt. Rechts wird das gemeinsame Präfix a <b>vor die Klammer gezogen</b>. Die Wahl fällt erst bei A′, wenn das unterscheidende Zeichen b oder c ansteht.",
    function(K){
      var s = K.panel(10, 10, 300, 260, "A → ab | ac", "m") + K.panel(330, 10, 300, 260, "A → aA′,  A′ → b | c", "a");
      s += K.node(160, 70, "A", "m", { r: 18 }) + K.line(150, 85, 100, 136, "s", { w: 1.4 }) + K.line(170, 85, 220, 136, "s", { w: 1.4 });
      s += K.cell(100, 152, "a", "m", { w: 32, h: 30, fill: "fm" }) + K.cell(220, 152, "a", "m", { w: 32, h: 30, fill: "fm" });
      s += K.line(100, 168, 100, 192, "s", { w: 1.4 }) + K.line(220, 168, 220, 192, "s", { w: 1.4 }) + K.cell(100, 208, "b", "s", { w: 32, h: 30 }) + K.cell(220, 208, "c", "s", { w: 32, h: 30 });
      s += K.t(160, 250, "Gabelung vor a: unklar", "m", { s: 12.5, b: true });
      s += K.node(450, 60, "A", "a", { r: 18 }) + K.line(440, 75, 410, 112, "s", { w: 1.4 }) + K.line(460, 75, 500, 112, "s", { w: 1.4 });
      s += K.cell(405, 128, "a", "a", { w: 32, h: 30, fill: "fa" }) + K.node(510, 128, "A′", "a", { r: 17, s: 13 });
      s += K.line(500, 143, 470, 190, "s", { w: 1.4 }) + K.line(520, 143, 550, 190, "s", { w: 1.4 });
      s += K.cell(465, 206, "b", "s", { w: 32, h: 30 }) + K.cell(555, 206, "c", "s", { w: 32, h: 30 });
      s += K.t(480, 250, "Gabelung nach a: b oder c", "a", { s: 12.5, b: true });
      return K.svg(640, 280, s);
    });

  /* ═════════ Kapitel 3: LR(k)-Sprachen ═════════ */

  add("lr", "L-R-(k): Rechtsableitung, rückwärts gelesen",
    "Von oben nach unten steht eine <b>Rechtsableitung</b> von a+a: Immer das am weitesten rechts stehende Nichtterminal wird ersetzt (Regelnummer rechts). Der LR-Parser durchläuft diese Kette <b>von unten nach oben</b>: Er startet beim Wort und fasst zusammen, bis nur E übrig ist – eine <b>Linksreduktion</b>.",
    function(K){
      var f = ["E", "E + T", "E + F", "E + a", "T + a", "F + a", "a + a"], r = ["", "(1)", "(4)", "(6)", "(2)", "(4)", "(6)"], s = "";
      for(var i = 0; i < 7; i++){
        s += K.t(320, 40 + i * 34, f[i], i === 6 ? "m" : (i === 0 ? "a" : "i"), { s: 17, b: true });
        if(r[i]) s += K.t(390, 40 + i * 34, r[i], "s", { a: "start", s: 12.5 });
      }
      s += K.arrow(200, 40, 200, 244, "a", { w: 2.4 }) + K.t(186, 130, "Rechts-", "a", { a: "end", s: 13, b: true }) + K.t(186, 150, "ableitung", "a", { a: "end", s: 13, b: true });
      s += K.arrow(450, 244, 450, 40, "c4", { w: 2.4 }) + K.t(464, 130, "LR-Parser:", "c4", { a: "start", s: 13, b: true }) + K.t(464, 150, "Linksreduktion", "c4", { a: "start", s: 13, b: true });
      s += K.f(320, 290, "L: links → rechts lesen · R: Rechtsableitung · k = 1 Vorausschau", "a", { s: 12.5 });
      return K.svg(640, 312, s);
    });

  add("shiftreduce", "Shift-Reduce-Analyse von a+a*a",
    "Jede Spalte ist der Stapel nach einer Aktion (unten $). <b>shift</b> (s) legt das nächste Token oben drauf, <b>reduce</b> (r + Regelnummer) ersetzt die oberen Zeichen – das Handle – durch die linke Regelseite. Rot: Bei Stapel E+T und Vorausschau * wird geschoben statt E → E+T reduziert. Am Ende liegt nur E auf $: <b>accepted</b>.",
    function(K){
      var st = [["$"], ["$", "a"], ["$", "F"], ["$", "T"], ["$", "E"], ["$", "E", "+"], ["$", "E", "+", "a"], ["$", "E", "+", "F"], ["$", "E", "+", "T"],
        ["$", "E", "+", "T", "*"], ["$", "E", "+", "T", "*", "a"], ["$", "E", "+", "T", "*", "F"], ["$", "E", "+", "T"], ["$", "E"]];
      var act = ["Start", "s", "r6", "r4", "r2", "s", "s", "r6", "r4", "s", "s", "r6", "r3", "r1"], s = "";
      s += K.t(330, 22, "(1) E→E+T  (2) E→T  (3) T→T*F  (4) T→F  (5) F→(E)  (6) F→a", "s", { s: 12.5 });
      s += K.t(330, 46, "Eingabe:  a + a * a $", "i", { s: 14, b: true });
      for(var i = 0; i < 14; i++){
        var x = 34 + i * 45, hot = i === 9;
        s += stack(K, x, 250, st[i], { cap: 6, w: 34, h: 26, s: 13, tc: hot ? "m" : (act[i].charAt(0) === "r" ? "a" : "c4") });
        s += K.t(x, 272, act[i], hot ? "m" : (act[i].charAt(0) === "r" ? "a" : (i ? "c4" : "s")), { s: 12.5, b: true });
      }
      s += K.f(619, 300, "accepted", "m", { fill: "fm", s: 12.5, a: "end" }) + K.t(30, 300, "s = shift · rᵢ = reduce mit Regel i", "s", { a: "start", s: 12.5 });
      return K.svg(660, 320, s);
    });

  add("handle", "Satzform αβγ: Handle β und Vorausschau",
    "Links vom Lesekopf liegt der Stapel αβ, rechts der noch ungelesene Rest γ (nur Terminale). Das <b>Handle β</b> ist das Stück oben auf dem Stapel, das als Nächstes durch das Nichtterminal einer Regel X → β ersetzt wird. Bei LR(k) muss allein ein Blick auf die <b>ersten k Zeichen von γ</b> reichen, um β eindeutig zu bestimmen.",
    function(K){
      var s = K.rect(60, 110, 180, 50, "s", { fill: "fa", rx: 0 }) + K.rect(240, 110, 120, 50, "m", { fill: "fm", rx: 0, w: 2.2 }) + K.rect(360, 110, 240, 50, "s", { fill: "p", rx: 0 });
      s += K.rect(360, 110, 40, 50, "c4", { fill: "fa", rx: 0, w: 2.2 });
      s += K.v(150, 135, "α", "s") + K.v(300, 135, "β", "m") + K.v(500, 135, "γ", "s") + K.t(380, 136, "k", "c4", { s: 15, b: true, it: true });
      s += brace(K, 60, 360, 90, "", "a") + K.t(210, 70, "Stapel (schon verarbeitet)", "a", { s: 13, b: true });
      s += brace(K, 362, 600, 90, "", "s") + K.t(481, 70, "Resteingabe γ ∈ T*", "s", { s: 13, b: true });
      s += K.line(360, 100, 360, 172, "i", { w: 2.4 });
      s += K.arrow(300, 162, 300, 222, "m", { w: 2.2 }) + K.cell(300, 240, "X", "m", { w: 44, h: 32, fill: "fm", s: 15 }) + K.t(326, 194, "reduce X → β", "m", { a: "start", s: 13, b: true });
      s += K.t(408, 182, "← die ersten k Zeichen entscheiden", "c4", { a: "start", s: 12.5, b: true });
      s += K.t(320, 292, "Satzform αβγ einer Rechtsableitung – β heißt Handle (Henkel)", "s", { s: 12.5 });
      return K.svg(640, 310, s);
    });

  add("konflikt", "Shift/Reduce-Konflikt und Sackgasse",
    "Im Stapel liegt E + T, als Nächstes kommt *. Formal wäre <b>reduce E → E + T</b> möglich – doch danach müsste E * … weitergehen, und dazu passt keine Regel: <b>Sackgasse</b>. Richtig ist <b>shift</b>, denn * gehört zu T * F. Die Vorausschau löst das: * kann nie hinter E stehen. Passen dagegen zwei Regeln auf denselben Henkel, heißt es reduce/reduce-Konflikt.",
    function(K){
      var s = K.t(250, 40, "Stapel", "s", { s: 13, b: true }) + K.t(390, 40, "Vorausschau", "c4", { s: 13, b: true });
      s += tape(K, 182, 72, ["$", "E", "+", "T"], { cw: 34 }) + K.cell(390, 72, "*", "c4", { w: 34, h: 34, fill: "fa", s: 16 });
      s += K.arrow(240, 96, 180, 170, "a", { w: 2.2 }) + K.t(196, 124, "shift", "a", { a: "end", s: 13, b: true });
      s += K.arrow(300, 96, 450, 170, "m", { w: 2.2 }) + K.t(392, 124, "reduce E → E+T", "m", { a: "start", s: 13, b: true });
      s += tape(K, 85, 194, ["$", "E", "+", "T", "*"], { cw: 34, hl: { 4: "a" } });
      s += tape(K, 436, 194, ["$", "E"], { cw: 34, hl: { 1: "m" } }) + K.t(530, 194, "* ?", "m", { s: 16, b: true });
      s += K.t(170, 234, "✓ weiter mit T → T*F", "a", { s: 13, b: true }) + K.t(490, 234, "✗ E * … passt zu keiner Regel", "m", { s: 13, b: true });
      s += K.f(320, 280, "* ∉ FOLLOW(E) = {+, ), $} ⇒ shift", "a", { s: 13 });
      return K.svg(640, 300, s);
    });

  add("lrtabelle", "LR-Parsetabelle steuert einen DEA",
    "Für die Grammatik (1) S → (S), (2) S → a. Die <b>action</b>-Spalten sagen: s<i>n</i> = Token schieben und in Zustand n gehen, r<i>i</i> = mit Regel i reduzieren, acc = fertig. Die <b>goto</b>-Spalte sagt, wohin es nach einem reduce geht. Rechts der zugehörige <b>DEA</b>: Der Stapel speichert die Zustandsfolge, unten die Analyse von (a).",
    function(K){
      var hd = ["", "(", ")", "a", "$", "S"], cx = [45, 95, 145, 195, 245, 305], s = "";
      var rows = [["0", "s2", "", "s3", "", "1"], ["1", "", "", "", "acc", ""], ["2", "s2", "", "s3", "", "4"], ["3", "", "r2", "", "r2", ""], ["4", "", "s5", "", "", ""], ["5", "", "r1", "", "r1", ""]];
      s += K.rect(20, 30, 315, 226, "r", { fill: "p", rx: 4 }) + K.line(70, 30, 70, 256, "r", { w: 1.2 }) + K.line(275, 30, 275, 256, "r", { w: 1.6 }) + K.line(20, 64, 335, 64, "r", { w: 1.2 });
      s += K.t(170, 20, "action", "c4", { s: 12.5, b: true }) + K.t(305, 20, "goto", "a", { s: 12.5, b: true });
      for(var j = 1; j < 6; j++) s += K.t(cx[j], 47, hd[j], j === 5 ? "a" : "c4", { s: 15, b: true });
      for(var i = 0; i < 6; i++){
        var y = 80 + i * 32;
        for(j = 0; j < 6; j++) if(rows[i][j]) s += K.t(cx[j], y, rows[i][j], j === 0 ? "s" : (rows[i][j].charAt(0) === "r" ? "m" : (rows[i][j] === "acc" ? "m" : "i")), { s: 14, b: true });
      }
      var P = { 0: [400, 80], 2: [510, 80], 4: [600, 80], 1: [400, 200], 3: [510, 200], 5: [600, 200] }, o = { r1: 18, r2: 18 };
      s += K.state(400, 80, "0", { r: 18, start: true }) + K.state(510, 80, "2", { r: 18 }) + K.state(600, 80, "4", { r: 18 });
      s += K.state(400, 200, "1", { r: 18, final: true, c: "m" }) + K.state(510, 200, "3", { r: 18, c: "m" }) + K.state(600, 200, "5", { r: 18, c: "m" });
      function e(a, b, lab, c){ return K.edge(P[a][0], P[a][1], P[b][0], P[b][1], { r1: 18, r2: 18, lab: lab, c: c || "s", lc: "i" }); }
      s += e(0, 2, "(") + e(2, 4, "S", "a") + e(0, 1, "S", "a") + e(4, 5, ")") + e(2, 3, "a") + e(0, 3, "a");
      s += K.loop(510, 80, 90, { r: 18, lab: "(", lc: "i" });
      s += K.f(320, 288, "(a):  0 (2 a3 → r2 → 0 (2 S4 → 0 (2 S4 )5 → r1 → 0 S1 acc", "a", { s: 12.5 });
      return K.svg(640, 310, s);
    });

  add("lrklassen", "LR(0) ⊊ SLR(1) ⊊ LALR(1) ⊊ LR(1)",
    "Je weiter außen, desto mehr Grammatiken kann das Tabellenverfahren deterministisch parsen – und desto größer werden die Tabellen. <b>LR(0)</b> schaut gar nicht voraus, <b>SLR(1)</b> nutzt ein Zeichen nur in der Tabelle, <b>LR(1)</b> auch in den Zuständen. <b>LALR(1)</b> verschmilzt LR(1)-Zustände mit gleichem Kern: fast so stark, aber viel kleiner – der Praxis-Kompromiss.",
    function(K){
      var s = K.rect(10, 10, 620, 300, "c4", { fill: "p", rx: 10, w: 1.8 }) + K.t(28, 32, "LR(1) · Zustände und Tabelle mit 1 Vorausschau", "c4", { a: "start", s: 13.5, b: true });
      s += K.rect(35, 48, 570, 232, "a", { fill: "p", rx: 10, w: 1.8 }) + K.t(53, 70, "LALR(1) · gleiche Kerne verschmolzen", "a", { a: "start", s: 13.5, b: true });
      s += K.rect(60, 86, 520, 164, "c3", { fill: "p", rx: 10, w: 1.8 }) + K.t(78, 108, "SLR(1) · Zustände 0, Tabelle 1 Vorausschau", "c3", { a: "start", s: 13.5, b: true });
      s += K.rect(85, 124, 470, 96, "m", { fill: "fm", rx: 10, w: 1.8 }) + K.t(103, 146, "LR(0) · keine Vorausschau", "m", { a: "start", s: 13.5, b: true });
      s += K.t(320, 186, "kleinste Tabellen, schwächstes Verfahren", "s", { s: 12.5 });
      s += K.t(320, 296, "volles LR(1): oft Hunderte Zustände – nur mit Werkzeug", "s", { s: 12.5 });
      s += K.t(320, 266, "Praxis-Kompromiss (Yacc, Bison, VCC)", "a", { s: 12.5 });
      return K.svg(640, 320, s);
    });

  add("sattr", "Synthetisierte Attribute: Werte steigen auf",
    "Jedes Blatt bringt seinen Wert mit, jeder innere Knoten berechnet seinen Wert <b>aus den Werten seiner Kinder</b> – etwa E → E + T mit $$ = $1 + $3. Weil der LR-Parser genau in dieser Reihenfolge reduziert (von den Blättern zur Wurzel), liegen bei jedem reduce die Operanden schon bereit. Ergebnis für 2+3*4: <b>14</b>.",
    function(K){
      var tr = ["E", ["E", ["T", ["F", "2"]]], "+", ["T", ["T", ["F", "3"]], "*", ["F", "4"]]];
      var R = tree(K, tr, 180, 70, 44, 46, { bottom: true, r: 14 }), s = R.s, val = ["14", "2", "2", "2", "12", "3", "3", "4"], k = 0;
      R.n.forEach(function(q){ if(!q.t) s += side(K, q, "= " + val[k++], "m", { dx: 19, dy: 12 }); });
      s += K.arrow(570, 230, 570, 60, "m", { w: 2.2 }) + K.t(560, 145, "Werte", "m", { a: "end", s: 13, b: true }) + K.t(560, 163, "fließen", "m", { a: "end", s: 13, b: true }) + K.t(560, 181, "nach oben", "m", { a: "end", s: 13, b: true });
      s += K.f(320, 272, "E → E + T  { $$ = $1 + $3 }     T → T * F  { $$ = $1 * $3 }", "a", { s: 12.5 });
      return K.svg(640, 295, s);
    });

  add("tdiag", "T-Diagramm: ZR → PS-Compiler, geschrieben in Java",
    "Das <b>T</b> ist der Compiler: links oben die <b>Quellsprache</b> (ZR), rechts oben die <b>Zielsprache</b> (PostScript), unten die Sprache, in der er selbst geschrieben ist (Java). Das ZR-Programm geht links hinein, rechts kommt PostScript heraus, das anschließend zu PDF wird. Im TDiag-Werkzeug wird diese Kette per Knopfdruck ausgeführt.",
    function(K){
      var s = K.poly([[200, 80], [440, 80], [440, 130], [360, 130], [360, 200], [280, 200], [280, 130], [200, 130]], "a", { fill: "fa", w: 2 });
      s += K.t(240, 105, "ZR", "a", { s: 17, b: true, halo: false }) + K.t(400, 105, "PS", "a", { s: 17, b: true, halo: false }) + K.t(320, 168, "Java", "a", { s: 16, b: true, halo: false });
      s += K.cell(95, 105, "Programm .zr", "s", { w: 120, h: 34, s: 13 }) + K.arrow(155, 105, 198, 105, "s", { w: 2 });
      s += K.arrow(442, 105, 488, 105, "s", { w: 2 }) + K.cell(550, 105, "Datei .ps", "c4", { w: 120, h: 34, s: 13 });
      s += K.arrow(550, 123, 550, 178, "s", { w: 2 }) + K.cell(550, 196, "PDF", "m", { w: 90, h: 34, fill: "fm", s: 14 });
      s += K.cell(320, 240, "läuft als .class auf der Java-VM", "s", { w: 240, h: 30, s: 12.5 }) + K.line(320, 202, 320, 224, "s", { w: 1.4, dash: "3 3" });
      s += K.t(240, 60, "Quelle", "s", { s: 12 }) + K.t(400, 60, "Ziel", "s", { s: 12 }) + K.t(386, 168, "Implementierung", "s", { a: "start", s: 12 });
      s += K.t(320, 288, "AS-Einsendeaufgabe genauso: AS → HTML/SVG, in Java", "s", { s: 12.5 });
      return K.svg(640, 305, s);
    });

  /* ═════════ Kapitel 4: Turing-Maschine und Typ-0/1-Sprachen ═════════ */

  add("tm", "Turing-Maschine: Band, Lese-Schreib-Kopf, Steuerwerk",
    "Statt eines Kellers hat die TM ein <b>unendliches Band</b>, links und rechts mit dem Blank $ vorbelegt. Der Kopf kann jedes Feld <b>lesen und überschreiben</b> und sich pro Takt nach <b>L</b>inks, <b>R</b>echts oder gar nicht (<b>N</b>) bewegen. Das Steuerwerk kennt nur seinen Zustand und das Zeichen unter dem Kopf.",
    function(K){
      var s = K.t(320, 34, "Band: lesen und schreiben, nach beiden Seiten unbegrenzt", "s", { s: 13 });
      s += tape(K, 100, 80, ["$", "$", "a", "a", "b", "b", "c", "c", "$", "$", "$", "$"], { cw: 40, dots: true, hl: { 2: "m" } });
      s += K.arrow(180, 160, 180, 100, "m", { w: 2.6, head: 11 });
      s += K.arrow(165, 128, 128, 128, "c4", { w: 1.8, head: 8 }) + K.t(116, 128, "L", "c4", { s: 14, b: true }) + K.arrow(195, 128, 232, 128, "c4", { w: 1.8, head: 8 }) + K.t(244, 128, "R", "c4", { s: 14, b: true });
      s += K.t(272, 128, "N = stehen bleiben", "c4", { a: "start", s: 12.5 });
      s += K.rect(115, 160, 130, 44, "m", { fill: "fm", rx: 8, w: 1.8 }) + K.t(180, 182, "Zustand q₀", "m", { s: 14, b: true, halo: false });
      s += K.f(320, 248, "δ : Q × Γ → Q × Γ × {L, N, R}", "a");
      s += K.t(320, 284, "M = (Q, Σ, Γ, δ, q₀, $, E)  ·  $ = Blank", "s", { s: 12.5 });
      return K.svg(640, 300, s);
    });

  add("tmschritt", "Ein Takt: δ(q₁, a) = (q₂, d, R)",
    "Oben die Lage vor dem Takt: Zustand q₁, unter dem Kopf ein a. Die Übergangsfunktion sagt dreierlei: <b>d schreiben</b> (statt a), in <b>Zustand q₂</b> wechseln, <b>ein Feld nach rechts</b> gehen. Unten das Ergebnis. Gibt es für (Zustand, Zeichen) keinen Eintrag, stoppt die Maschine per Crash.",
    function(K){
      var s = K.t(30, 70, "vorher", "s", { a: "start", s: 13, b: true }) + K.t(30, 210, "nachher", "s", { a: "start", s: 13, b: true });
      s += tape(K, 110, 70, ["$", "d", "a", "b", "b", "c", "c", "$"], { cw: 38, head: 2, q: "q₁", hl: { 2: "a" } });
      s += tape(K, 110, 210, ["$", "d", "d", "b", "b", "c", "c", "$"], { cw: 38, head: 3, q: "q₂", hl: { 2: "m" } });
      s += K.f(530, 150, "δ(q₁, a) = (q₂, d, R)", "a", { s: 13.5 });
      s += K.t(530, 182, "schreiben · Zustand · Bewegung", "s", { s: 12 });
      return K.svg(640, 300, s);
    });

  add("grenzen", "Wo der Keller nicht mehr reicht",
    "Links: Für aⁿbⁿcⁿ wird beim Lesen der b der Zählerstand im Keller <b>verbraucht</b> – für die c ist nichts mehr übrig. Rechts: Für ss muss die erste Hälfte in <b>derselben Reihenfolge</b> wieder abgerufen werden; ein Stapel liefert aber das zuletzt Abgelegte zuerst. Dafür bräuchte man eine Warteschlange – oder eben ein frei beschreibbares Band.",
    function(K){
      var s = K.panel(10, 10, 300, 270, "aaabbbccc", "m") + K.panel(330, 10, 300, 270, "ss mit s = ab", "m");
      s += stack(K, 60, 200, ["k₀", "a", "a", "a"], { cap: 4, w: 34, h: 26 }) + K.t(60, 222, "nach aaa", "s", { s: 12 });
      s += stack(K, 160, 200, ["k₀"], { cap: 4, w: 34, h: 26 }) + K.t(160, 222, "nach bbb", "s", { s: 12 });
      s += K.t(110, 140, "→", "s", { s: 18, b: true }) + K.t(210, 140, "→", "s", { s: 18, b: true }) + K.t(262, 150, "ccc?", "m", { s: 15, b: true });
      s += K.t(160, 256, "Zähler beim Vergleich verbraucht", "m", { s: 12.5, b: true });
      s += K.t(480, 50, "gelesen: a b | noch: a b", "i", { s: 13, b: true });
      s += stack(K, 410, 200, ["k₀", "a", "b"], { cap: 4, w: 34, h: 26, tc: "m" }) + K.t(410, 222, "Stapel", "s", { s: 12 });
      s += K.t(455, 135, "gibt b", "m", { a: "start", s: 12.5, b: true }) + K.t(455, 155, "gebraucht a", "a", { a: "start", s: 12.5, b: true });
      s += K.cell(560, 175, "a", "a", { w: 30, h: 26, fill: "fa", s: 13 }) + K.cell(590, 175, "b", "s", { w: 30, h: 26, s: 13 });
      s += K.t(575, 145, "Schlange", "a", { s: 12, b: true }) + K.t(575, 205, "a zuerst ✓", "a", { s: 12 });
      s += K.t(480, 256, "LIFO statt FIFO", "m", { s: 12.5, b: true });
      return K.svg(640, 290, s);
    });

  add("anbncn", "TM für aⁿbⁿcⁿ: pro Lauf je ein a, b, c abhaken",
    "Jede Zeile ist der Bandinhalt nach einem kompletten Durchlauf. Bei jedem Rechtslauf ersetzt die TM das erste noch freie a, b und c durch <b>d</b>, prüft das Wortende und läuft zurück zum Anfang. Stehen am Schluss <b>nur noch d</b> zwischen den Blanks, waren es gleich viele – akzeptiert. Die TM bleibt dabei im Bereich des Wortes (linear beschränkt).",
    function(K){
      var rows = [["$", "a", "a", "b", "b", "c", "c", "$"], ["$", "d", "a", "d", "b", "d", "c", "$"], ["$", "d", "d", "d", "d", "d", "d", "$"]];
      var lab = ["Start", "1. Lauf", "2. Lauf"], hl = [{}, { 1: "m", 3: "m", 5: "m" }, { 2: "m", 4: "m", 6: "m" }], s = "";
      for(var i = 0; i < 3; i++){
        var y = 50 + i * 95;
        s += K.t(120, y, lab[i], "s", { a: "end", s: 13, b: true }) + tape(K, 140, y, rows[i], { cw: 38, hl: hl[i] });
        if(i) s += K.arrow(160, y - 30, 420, y - 30, "c4", { w: 1.6, head: 8 }) + K.t(462, y - 30, "Rechtslauf", "c4", { a: "start", s: 12 });
      }
      s += K.t(462, 145, "je ein a, b, c → d", "m", { a: "start", s: 13, b: true });
      s += K.t(462, 240, "nur noch d", "m", { a: "start", s: 13, b: true }) + K.t(462, 260, "⇒ akzeptiert", "m", { a: "start", s: 13, b: true });
      return K.svg(640, 290, s);
    });

  add("stopp", "Drei Arten, wie ein TM-Lauf endet",
    "<b>Akzeptiert</b>: Sobald ein Endzustand erreicht ist – egal, ob das Wort ganz gelesen wurde und wo der Kopf steht (hier ist „ba“ noch ungelesen). <b>Crash</b>: Für (Zustand, Zeichen) gibt es keinen Übergang – das Wort ist abgewiesen. <b>Endlos</b>: Die Maschine läuft für immer weiter und liefert gar keine Antwort.",
    function(K){
      var s = K.panel(10, 10, 200, 270, "Endzustand", "a") + K.panel(220, 10, 200, 270, "Crash", "m") + K.panel(430, 10, 200, 270, "endlos", "c4");
      s += tape(K, 38, 80, ["a", "b", "b", "a"], { cw: 36, head: 1, fade: { 2: 1, 3: 1 } }) + K.state(110, 190, "qₑ", { final: true });
      s += K.t(110, 236, "akzeptiert ✓", "a", { s: 13, b: true }) + K.t(110, 258, "Rest ungelesen: egal", "s", { s: 12 });
      s += K.state(320, 110, "q", { c: "m" }) + K.t(320, 165, "δ(q, b) = ?", "m", { s: 15, b: true });
      s += K.t(320, 205, "✗", "m", { s: 26, b: true }) + K.t(320, 236, "abgewiesen", "m", { s: 13, b: true }) + K.t(320, 258, "kein Übergang definiert", "s", { s: 12 });
      s += K.circ(530, 130, 40, "c4", { w: 2.4 }) + K.arrow(566, 116, 568, 132, "c4", { w: 2.4, head: 11 }) + K.t(530, 131, "∞", "c4", { s: 26, b: true });
      s += K.t(530, 236, "keine Antwort", "c4", { s: 13, b: true }) + K.t(530, 258, "läuft ewig weiter", "s", { s: 12 });
      s += K.f(320, 306, "L(M) = {w | q₀w ⊢* αqₑβ, qₑ ∈ E}", "a", { s: 13 });
      return K.svg(640, 325, s);
    });

  add("entscheid", "Rekursiv aufzählbar gegen rekursiv (entscheidbar)",
    "Links eine Maschine, die L nur <b>semientscheidet</b>: Für Wörter aus L hält sie irgendwann mit „ja“, für andere Wörter sagt sie vielleicht „nein“ – oder läuft endlos, und man weiß nie, ob noch eine Antwort kommt. Rechts eine Maschine, die <b>für jedes Wort hält</b>: Dann ist L rekursiv (entscheidbar).",
    function(K){
      var s = K.panel(10, 10, 300, 260, "rekursiv aufzählbar (Typ 0)", "c4") + K.panel(330, 10, 300, 260, "rekursiv (entscheidbar)", "a");
      function box(cx, c){ return K.cell(cx - 40, 120, "w", "s", { w: 36, h: 32, s: 15 }) + K.arrow(cx - 22, 120, cx + 3, 120, "s", { w: 2 }) + K.cell(cx + 40, 120, "DTM", c, { w: 70, h: 50, fill: "fa", s: 15 }); }
      s += box(90, "c4") + box(410, "a");
      s += K.arrow(205, 105, 245, 65, "a", { w: 2 }) + K.t(255, 60, "ja", "a", { a: "start", s: 14, b: true }) + K.t(250, 82, "w ∈ L", "s", { a: "start", s: 12 });
      s += K.arrow(205, 135, 245, 175, "m", { w: 2 }) + K.t(255, 180, "nein", "m", { a: "start", s: 14, b: true });
      s += K.t(160, 210, "w ∉ L: nein – oder", "m", { s: 12.5 }) + K.t(160, 230, "läuft ewig ∞", "m", { s: 12.5, b: true });
      s += K.arrow(525, 105, 565, 65, "a", { w: 2 }) + K.t(575, 60, "ja", "a", { a: "start", s: 14, b: true });
      s += K.arrow(525, 135, 565, 175, "a", { w: 2 }) + K.t(575, 180, "nein", "a", { a: "start", s: 14, b: true });
      s += K.t(480, 230, "hält immer ✓", "a", { s: 13, b: true });
      s += K.f(320, 298, "Typ 1 ⊆ rekursiv ⊆ rekursiv aufzählbar", "a", { s: 13 });
      return K.svg(640, 320, s);
    });

  add("lbtm", "Linear beschränkte TM: Kopf bleibt im Wort",
    "Die LBTM darf nur die Felder benutzen, die anfangs vom Eingabewort belegt sind (blau). Sie kann dort lesen, überschreiben und hin- und herlaufen, aber <b>nie darüber hinaus</b> – ihr Platz wächst also nur <b>linear</b> mit der Wortlänge. Genau diese Maschinen erkennen die <b>kontextsensitiven</b> (Typ-1-)Sprachen.",
    function(K){
      var s = tape(K, 100, 90, ["$", "$", "a", "b", "b", "a", "c", "$", "$"], { cw: 46, dots: true, hl: { 2: "a", 3: "a", 4: "a", 5: "a", 6: "a" } });
      s += K.line(192, 56, 192, 124, "m", { w: 3 }) + K.line(422, 56, 422, 124, "m", { w: 3 });
      s += K.t(192, 40, "Grenze", "m", { s: 12.5, b: true }) + K.t(422, 40, "Grenze", "m", { s: 12.5, b: true });
      s += K.arrow(261, 150, 261, 110, "c4", { w: 2.4, head: 10 }) + K.t(261, 164, "Kopf", "c4", { s: 13, b: true });
      s += K.arrow(240, 186, 202, 186, "c4", { w: 1.8, head: 8 }) + K.arrow(282, 186, 412, 186, "c4", { w: 1.8, head: 8 }) + K.t(307, 204, "hin und her erlaubt", "c4", { s: 12.5 });
      s += K.t(146, 160, "✗ tabu", "m", { s: 13, b: true }) + K.t(468, 160, "✗ tabu", "m", { s: 13, b: true });
      s += brace(K, 194, 420, 238, "Platz = Wortlänge n", "a");
      s += K.f(320, 290, "L(LBTM) = Typ 1 (kontextsensitiv)", "a", { s: 13 });
      return K.svg(640, 310, s);
    });

  add("chomsky", "Chomsky-Hierarchie mit Automaten",
    "Jede Klasse steckt <b>echt</b> in der nächstgrößeren. Zu jeder Stufe gehört ein Automat: endliche Automaten (Typ 3), Kellerautomaten (Typ 2, deterministisch für dkfS), linear beschränkte TM (Typ 1) und allgemeine TM (Typ 0). Gestrichelt die entscheidbaren Sprachen: Sie umfassen Typ 1, aber nicht alles aus Typ 0 – das Halteproblem liegt draußen.",
    function(K){
      var B = [[10, 10, 620, 300, "Typ 0 · rekursiv aufzählbar · DTM / NTM", "Halteproblem", "i"], [30, 45, 580, 257, "rekursiv (entscheidbar)", "", "s"],
        [50, 80, 540, 214, "Typ 1 · kontextsensitiv · LBTM", "{aⁿbⁿcⁿ}", "c4"], [70, 115, 500, 171, "Typ 2 · kontextfrei · NKA", "Palindrome", "c3"],
        [90, 150, 460, 128, "dkfS · DKA = LR(1)", "{aⁿbⁿ}", "a"], [110, 185, 420, 85, "Typ 3 · regulär · DEA / NEA", "", "m"]], s = "";
      B.forEach(function(b, i){
        s += K.rect(b[0], b[1], b[2], b[3], b[6], { fill: i === 5 ? "fm" : "p", rx: 10, w: i === 1 ? 1.4 : 1.8, dash: i === 1 ? "6 4" : undefined });
        s += K.t(b[0] + 14, b[1] + 18, b[4], b[6], { a: "start", s: 13, b: true });
        if(b[5]) s += K.t(b[0] + b[2] - 14, b[1] + 18, b[5], "s", { a: "end", s: 12.5 });
      });
      s += K.t(320, 240, "Zahlwörter", "s", { s: 13 });
      return K.svg(640, 320, s);
    });

  add("utm", "Universelle TM: Programm und Daten auf einem Band",
    "Die UTM bekommt auf ihr Band die <b>Beschreibung cod(M)</b> einer beliebigen Maschine M und, durch ein Blank getrennt, deren <b>Eingabe w</b>. Sie liest die Übergänge aus cod(M) und spielt M auf w nach: U(cod(M), w) = M(w). Dasselbe Prinzip steckt im <b>Von-Neumann-Rechner</b>: Programm und Daten liegen im selben Speicher.",
    function(K){
      var s = K.panel(10, 10, 360, 270, "UTM", "a") + K.panel(390, 10, 240, 270, "Von-Neumann-Rechner", "c4");
      s += K.rect(30, 70, 190, 40, "a", { fill: "fa", rx: 0, w: 2 }) + K.rect(220, 70, 36, 40, "s", { fill: "p", rx: 0 }) + K.rect(256, 70, 96, 40, "m", { fill: "fm", rx: 0, w: 2 });
      s += K.t(125, 91, "cod(M)", "a", { s: 15, b: true }) + K.t(238, 91, "$", "s", { s: 15, b: true }) + K.t(304, 91, "w", "m", { s: 16, b: true, it: true });
      s += K.t(125, 128, "Programm", "a", { s: 12.5 }) + K.t(304, 128, "Daten", "m", { s: 12.5 });
      s += K.arrow(190, 210, 190, 116, "i", { w: 2.4, head: 10 }) + K.rect(125, 210, 130, 40, "i", { fill: "p", rx: 8, w: 1.6 }) + K.t(190, 231, "U simuliert M", "i", { s: 13, b: true, halo: false });
      s += K.t(190, 268, "U(cod(M), w) = M(w)", "a", { s: 13, b: true });
      s += K.rect(430, 60, 160, 110, "c4", { fill: "p", rx: 6, w: 1.8 }) + K.t(510, 78, "Speicher", "c4", { s: 12.5, b: true, halo: false });
      s += K.cell(510, 108, "Programm", "a", { w: 140, h: 28, fill: "fa", s: 13 }) + K.cell(510, 144, "Daten", "m", { w: 140, h: 28, fill: "fm", s: 13 });
      s += K.cell(510, 230, "Prozessor (CPU)", "i", { w: 160, h: 36, s: 13 }) + K.arrow(500, 210, 500, 174, "s", { w: 1.8, head: 8 }) + K.arrow(520, 174, 520, 210, "s", { w: 1.8, head: 8 });
      return K.svg(640, 290, s);
    });

  add("nachfolger", "Nachfolgermaschine: aus III wird IIII",
    "Zahlen stehen <b>unär</b> auf dem Band: 3 = III. Die TM startet auf dem ersten I, geht <b>einen Schritt nach links</b> auf das Blank, schreibt dort ein <b>I</b> und bleibt stehen. Dann gibt es keinen Übergang mehr – sie hält. Das Ergebnis liest man <b>ab der Kopfposition bis zum nächsten Blank</b>: IIII = 4.",
    function(K){
      var s = "", rows = [["$", "$", "I", "I", "I", "$"], ["$", "$", "I", "I", "I", "$"], ["$", "I", "I", "I", "I", "$"]], hd = [2, 1, 1], q = ["q₀", "q₁", "q₁ hält"];
      var hl = [{}, {}, { 1: "m" }], lab = ["Start: 3", "Schritt 1", "Schritt 2"];
      var dl = ["", "δ(q₀, I) = (q₁, I, L)", "δ(q₁, $) = (q₁, I, N)"];
      for(var i = 0; i < 3; i++){
        var y = 40 + i * 95;
        s += K.t(110, y, lab[i], "s", { a: "end", s: 13, b: true }) + tape(K, 130, y, rows[i], { cw: 38, head: hd[i], q: q[i], hl: hl[i], h: 30 });
        if(dl[i]) s += K.t(380, y, dl[i], "a", { a: "start", s: 13.5, b: true });
      }
      s += brace(K, 170, 300, 248, "", "m") + K.t(380, 262, "Ergebnis ab Kopf: IIII = 4", "m", { a: "start", s: 13.5, b: true });
      s += K.t(380, 290, "allgemein: Argumente w₁$w₂$…$wₙ", "s", { a: "start", s: 12.5 });
      return K.svg(640, 305, s);
    });

  add("dtmntm", "NTM und DTM sind gleich mächtig",
    "Die NTM hat an manchen Stellen <b>mehrere Möglichkeiten</b> – ihre Läufe bilden einen Baum. Sie akzeptiert, wenn <b>irgendein Ast</b> einen Endzustand erreicht. Eine DTM kann diesen Baum <b>Ebene für Ebene</b> durchsuchen (Zahlen = Reihenfolge) und findet den akzeptierenden Ast ebenfalls – nur langsamer. Darum genügt es, DTM zu betrachten.",
    function(K){
      var P = [[320, 50], [200, 130], [440, 130], [130, 215], [270, 215], [380, 215], [500, 215]], E = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]], s = "";
      E.forEach(function(e){ var a = P[e[0]], b = P[e[1]], acc = e[1] === 5 || e[1] === 2; s += K.line(a[0], a[1] + 18, b[0], b[1] - 18, acc ? "a" : "f", { w: acc ? 2.4 : 1.6 }); });
      P.forEach(function(p, i){
        var acc = i === 5, dead = i === 3 || i === 4 || i === 6;
        s += K.node(p[0], p[1], String(i + 1), acc ? "a" : (dead ? "s" : "a"), { r: 18, fill: acc ? "fa" : "p" });
      });
      s += K.t(380, 252, "qₑ ✓", "a", { s: 14, b: true }) + K.t(130, 252, "✗", "m", { s: 15, b: true }) + K.t(270, 252, "✗", "m", { s: 15, b: true }) + K.t(500, 252, "✗", "m", { s: 15, b: true });
      s += K.t(560, 50, "Ebene 0", "s", { a: "start", s: 12 }) + K.t(560, 130, "Ebene 1", "s", { a: "start", s: 12 }) + K.t(560, 215, "Ebene 2", "s", { a: "start", s: 12 });
      s += K.f(320, 290, "DTM durchsucht den NTM-Baum Ebene für Ebene", "a", { s: 13 });
      return K.svg(640, 310, s);
    });
})();
