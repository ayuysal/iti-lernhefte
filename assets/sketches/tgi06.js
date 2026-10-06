/* Skizzen zu TGI06 – Formale Sprachen und abstrakte Automaten 1.
   Jede Skizze: t = Titel, c = Lesehilfe (HTML), svg = function(K) → SVG-String (K = window.SK).
   Automaten und Grammatiken stammen aus dem Heft (Aufgaben C.19–C.25). */
(function(){
  "use strict";
  var S = window.ITI_SKETCHES = window.ITI_SKETCHES || {};
  function add(id, t, c, f){ S["tgi06-" + id] = { t: t, c: c, svg: f }; }
  function lines(K, x, y, arr, c, o){ o = o || {}; var s = ""; for(var i = 0; i < arr.length; i++) s += K.t(x, y + i * (o.lh || 20), arr[i], c || "s", { a: o.a || "start", s: o.s || 13.5, b: o.b }); return s; }
  /* Ellipse als Mengenbild */
  function ell(K, cx, cy, rx, ry, c, o){
    return K.path("M" + (cx - rx) + " " + cy + " A" + rx + " " + ry + " 0 1 0 " + (cx + rx) + " " + cy + " A" + rx + " " + ry + " 0 1 0 " + (cx - rx) + " " + cy + " Z", c, o);
  }
  /* Zeichenkette als Kästchenreihe; x = Mitte des ersten Kästchens */
  function cells(K, x, y, arr, o){
    o = o || {}; var s = "", cw = o.cw || 34;
    for(var i = 0; i < arr.length; i++){
      var c = o.cols ? o.cols[i] : (o.c || "a");
      s += K.cell(x + i * cw, y, arr[i], c, { w: o.w || cw - 4, h: o.h || 30, fill: o.fills ? o.fills[i] : (o.fill || "p"), s: o.s || 15, tc: o.tc });
    }
    return s;
  }
  /* Schleife mit Beschriftung dicht an der Schleife */
  function lp(K, x, y, ang, lab, c, r, lc){
    r = r || 22; var a = ang * Math.PI / 180, d = 1.74 * r + 14;
    return K.loop(x, y, ang, { c: c || "s", r: r }) + K.t(x + d * Math.cos(a), y - d * Math.sin(a), lab, lc || "a", { s: 14, b: true });
  }
  /* Kante zwischen Zuständen mit Beschriftung in Akzentfarbe */
  function ed(K, x1, y1, x2, y2, lab, o){
    o = o || {}; o.lab = lab; if(!o.lc) o.lc = "a"; if(!o.ls) o.ls = 14; return K.edge(x1, y1, x2, y2, o);
  }
  /* Baumkante */
  function te(K, x1, y1, x2, y2, r){ return K.edge(x1, y1, x2, y2, { r1: r || 16, r2: r || 16, noarrow: true, c: "f", w: 1.6 }); }
  /* Tabelle: rows[0] = Kopf; ws = Spaltenbreiten; st(r,c) → {c, fill, tc} */
  function table(K, x0, y0, ws, rh, rows, st){
    var s = "", y = y0;
    for(var r = 0; r < rows.length; r++){
      var x = x0;
      for(var c = 0; c < ws.length; c++){
        var o = (st && st(r, c)) || {};
        s += K.rect(x, y, ws[c], rh, "r", { fill: o.fill || (r === 0 || c === 0 ? "fa" : "p"), rx: 0, w: 1 });
        s += K.t(x + ws[c] / 2, y + rh / 2 + 1, rows[r][c], o.tc || (r === 0 || c === 0 ? "s" : "i"), { s: o.s || 14, b: r === 0 || c === 0 || o.b, halo: false });
        x += ws[c];
      }
      y += rh;
    }
    return s;
  }

  /* ═════════ Kapitel 1: Grundbegriffe ═════════ */

  add("alphabet", "Alphabet Σ – endliche, nichtleere Zeichenmenge",
    "Ein Alphabet ist einfach ein <b>Vorrat an Zeichen</b> – wie die Tasten einer Tastatur. Er muss <b>endlich</b> sein (man kann alle Zeichen aufzählen) und <b>nichtleer</b> (sonst könnte man nichts schreiben). Die leere Menge und eine unendliche Zahlenmenge sind deshalb keine Alphabete.",
    function(K){
      var s = K.panel(10, 10, 300, 270, "Σ = {a, b, c}") + K.panel(330, 10, 300, 270, "Σ = {0, 1} – Binäralphabet");
      s += ell(K, 160, 135, 105, 65, "a", { fill: "fa", w: 2 }) + cells(K, 115, 135, ["a", "b", "c"], { cw: 45, w: 36, h: 36, s: 18 });
      s += ell(K, 480, 135, 105, 65, "a", { fill: "fa", w: 2 }) + cells(K, 457, 135, ["0", "1"], { cw: 46, w: 36, h: 36, s: 18 });
      s += K.t(160, 228, "3 Zeichen: endlich ✓ nichtleer ✓", "a", { s: 13, b: true }) + K.t(480, 228, "2 Zeichen: endlich ✓ nichtleer ✓", "a", { s: 13, b: true });
      s += K.t(320, 305, "kein Alphabet:  ∅ (leer)  ·  {0, 1, 2, …} (unendlich)", "m", { s: 13.5, b: true });
      return K.svg(640, 320, s);
    });

  add("wort", "Wort, Wortlänge |w| und leeres Wort ε",
    "Ein Wort ist eine <b>Kette von Kästchen</b>, in jedem steht ein Zeichen aus Σ. Die <b>Länge |w|</b> zählt einfach die Kästchen. Das <b>leere Wort ε</b> ist die Kette mit null Kästchen – es ist trotzdem ein Wort, so wie die leere Kiste trotzdem eine Kiste ist.",
    function(K){
      var s = K.t(166, 40, "Wort über Σ = {a, b, c}", "s", { s: 13 }) + K.t(435, 40, "leeres Wort", "s", { s: 13 });
      s += K.t(70, 90, "w =", "i", { a: "end", s: 17, b: true }) + cells(K, 100, 90, ["a", "b", "c", "a"], { cw: 44, w: 40, h: 34, s: 18 });
      for(var i = 0; i < 4; i++) s += K.t(100 + i * 44, 124, String(i + 1), "f", { s: 12 });
      s += K.line(80, 145, 252, 145, "a", { w: 1.8 }) + K.line(80, 138, 80, 152, "a", { w: 1.8 }) + K.line(252, 138, 252, 152, "a", { w: 1.8 });
      s += K.t(166, 170, "|w| = 4", "a", { s: 16, b: true });
      s += K.t(400, 90, "ε =", "m", { a: "end", s: 17, b: true }) + K.rect(415, 73, 40, 34, "m", { dash: "5 4", w: 1.6 });
      s += K.t(435, 124, "kein Zeichen", "s", { s: 12 }) + K.t(435, 170, "|ε| = 0", "m", { s: 16, b: true });
      s += K.t(320, 225, "Wort = endliche Folge von Zeichen aus Σ  ·  auch ε ist ein Wort", "s", { s: 13 });
      return K.svg(640, 250, s);
    });

  add("konkat", "Verkettung u ∘ v = uv",
    "Verketten heißt <b>Hintereinanderschreiben</b>: Die Kästchen von v werden rechts an u angehängt, die Längen <b>addieren</b> sich. Die Reihenfolge zählt – ab∘ca ergibt etwas anderes als ca∘ab. Das leere Wort ε ändert beim Verketten nichts (<b>neutrales Element</b>).",
    function(K){
      var s = K.t(108, 35, "u = ab", "a", { s: 14, b: true }) + K.t(232, 35, "v = ca", "c4", { s: 14, b: true });
      s += cells(K, 90, 70, ["a", "b"], { cw: 36, w: 32, fill: "fa" }) + K.t(170, 70, "∘", "i", { s: 22, b: true }) + cells(K, 214, 70, ["c", "a"], { cw: 36, w: 32, c: "c4" });
      s += K.arrow(108, 92, 138, 148, "s", { w: 1.6, head: 8 }) + K.arrow(232, 92, 202, 148, "s", { w: 1.6, head: 8 });
      s += K.t(92, 170, "uv =", "i", { a: "end", s: 15, b: true }) + cells(K, 116, 170, ["a", "b", "c", "a"], { cw: 36, w: 32, cols: ["a", "a", "c4", "c4"], fills: ["fa", "fa", "p", "p"] });
      s += K.t(170, 212, "|uv| = |u| + |v| = 2 + 2 = 4", "s", { s: 13 });
      s += K.t(480, 40, "Reihenfolge zählt", "s", { s: 13, b: true });
      s += K.t(408, 85, "vu =", "i", { a: "end", s: 15, b: true }) + cells(K, 430, 85, ["c", "a", "a", "b"], { cw: 36, w: 32, cols: ["c4", "c4", "a", "a"], fills: ["p", "p", "fa", "fa"] });
      s += K.t(480, 130, "uv = abca ≠ caab = vu", "m", { s: 15, b: true });
      s += K.t(480, 178, "neutrales Element", "s", { s: 13, b: true }) + K.f(480, 212, "ε∘w = w∘ε = w", "a");
      s += K.t(320, 262, "Verkettung = Hintereinanderschreiben, die Längen addieren sich", "s", { s: 13 });
      return K.svg(640, 280, s);
    });

  add("potenz", "Potenz wⁿ – w n-mal verkettet",
    "wⁿ heißt: dasselbe Wort <b>n-mal hintereinander</b> schreiben. Jede Kopie ist hier farblich abgesetzt; die Länge wächst um |w| pro Kopie, also |wⁿ| = n·|w|. Null Kopien ergeben die leere Kette: <b>w⁰ = ε</b>.",
    function(K){
      var s = K.t(190, 18, "w = ab", "a", { s: 14, b: true });
      var rows = [0, 1, 2, 3], sup = ["⁰", "¹", "²", "³"], txt = ["Länge 0", "Länge 2", "Länge 4", "Länge 6 = 3 · |w|"];
      rows.forEach(function(n, r){
        var y = 55 + r * 50;
        s += K.t(70, y, "w" + sup[n] + " =", "i", { a: "end", s: 16, b: true });
        if(n === 0){ s += K.rect(85, y - 15, 30, 30, "m", { dash: "4 3", w: 1.5 }) + K.t(130, y, "ε (leeres Wort)", "m", { a: "start", s: 13 }); }
        else {
          var arr = [], cols = [], fills = [];
          for(var k = 0; k < n; k++){ arr.push("a", "b"); var c = k % 2 ? "c4" : "a"; cols.push(c, c); fills.push(k % 2 ? "p" : "fa", k % 2 ? "p" : "fa"); }
          s += cells(K, 100, y, arr, { cw: 34, w: 30, cols: cols, fills: fills });
        }
        s += K.t(330, y, txt[r], "s", { a: "start", s: 13 });
      });
      s += K.f(320, 250, "wⁿ = w ∘ w ∘ … ∘ w (n-mal),  w⁰ = ε", "a");
      return K.svg(640, 275, s);
    });

  add("sigmastern", "Σ* und Σ⁺ – alle Wörter über Σ",
    "Σ* sortiert man am besten <b>nach Länge</b>: ganz oben ε, dann alle Wörter der Länge 1, 2, 3 … Bei Σ = {a, b} verdoppelt sich die Zahl je Stufe (1, 2, 4, 8, …) – es gibt <b>unendlich viele Stufen</b>, aber jedes Wort selbst ist endlich lang. <b>Σ⁺</b> ist dasselbe ohne die oberste Stufe ε.",
    function(K){
      var s = K.rect(62, 30, 436, 222, "a", { fill: "p", w: 2, rx: 10 }) + K.rect(80, 80, 400, 162, "c4", { fill: "p", dash: "6 4", w: 1.6, rx: 8 });
      s += K.t(72, 50, "Σ* für Σ = {a, b}", "a", { a: "start", s: 15, b: true });
      var lv = [["ε"], ["a", "b"], ["aa", "ab", "ba", "bb"], ["aaa", "aab", "aba", "abb", "baa", "bab", "bba", "bbb"]], cnt = ["1 Wort", "2 Wörter", "4 Wörter", "8 Wörter", "16 Wörter …"];
      for(var n = 0; n < 5; n++){
        var y = 60 + n * 40;
        s += K.t(12, y, "n = " + n, "s", { a: "start", s: 13 });
        s += K.t(508, y, cnt[n], "s", { a: "start", s: 13 });
        if(n < 4) lv[n].forEach(function(w, i){ s += K.cell(280 + (i - (lv[n].length - 1) / 2) * 46, y, w, n ? "a" : "m", { w: 40, h: 26, s: 13, fill: n ? "fa" : "p" }); });
        else s += K.t(280, y, "aaaa, aaab, …, bbbb", "s", { s: 13 });
      }
      s += K.t(280, 270, "Σ⁺ = Σ* \\ {ε}  (gestrichelt)", "c4", { s: 13, b: true });
      s += K.t(320, 296, "Σ* ist unendlich – jedes einzelne Wort aber endlich lang", "s", { s: 13 });
      return K.svg(640, 310, s);
    });

  add("sprache", "Sprache L ⊆ Σ* – endlich oder unendlich",
    "Σ* ist der große Topf aller denkbaren Wörter. Eine <b>Sprache L</b> ist eine <b>Auswahl</b> daraus (blau): links nur drei Wörter – endlich –, rechts alle Wörter aus lauter a – unendlich. Σ* bleibt für ein Alphabet immer derselbe Topf; nur die Auswahl L ändert sich.",
    function(K){
      var s = K.panel(10, 10, 300, 280, "L = {a, ab, abc} ⊆ Σ*") + K.panel(330, 10, 300, 280, "L = {aⁿ | n ≥ 0} ⊆ Σ*");
      s += ell(K, 160, 150, 130, 100, "s", { w: 1.6 }) + ell(K, 140, 160, 60, 48, "a", { fill: "fa", w: 2 });
      s += K.t(55, 72, "Σ*", "s", { s: 15, b: true }) + K.t(178, 135, "L", "a", { s: 16, b: true, it: true });
      [["a", 118, 145], ["ab", 150, 168], ["abc", 128, 192]].forEach(function(w){ s += K.t(w[1], w[2], w[0], "a", { s: 14, b: true }); });
      [["b", 75, 120], ["ca", 230, 110], ["bb", 160, 85], ["cab", 240, 195], ["ac", 100, 205]].forEach(function(w){ s += K.t(w[1], w[2], w[0], "f", { s: 13 }); });
      s += ell(K, 480, 150, 130, 100, "s", { w: 1.6 }) + ell(K, 460, 160, 60, 48, "a", { fill: "fa", w: 2 });
      s += K.t(375, 72, "Σ*", "s", { s: 15, b: true }) + K.t(500, 152, "L", "a", { s: 16, b: true, it: true });
      [["ε", 440, 145], ["a", 470, 140], ["aa", 445, 175], ["aaa", 484, 172], ["…", 470, 198]].forEach(function(w){ s += K.t(w[1], w[2], w[0], "a", { s: 14, b: true }); });
      [["b", 395, 120], ["ab", 550, 110], ["ba", 480, 85], ["bb", 560, 195], ["abb", 405, 215]].forEach(function(w){ s += K.t(w[1], w[2], w[0], "f", { s: 13 }); });
      s += K.t(160, 270, "endlich: genau 3 Wörter", "a", { s: 13, b: true }) + K.t(480, 270, "unendlich: ε, a, aa, aaa, …", "a", { s: 13, b: true });
      return K.svg(640, 300, s);
    });

  /* ═════════ Kapitel 2: Formale Grammatiken ═════════ */

  add("grammatik", "Grammatik G = (N, T, P, s) – die Bauanleitung",
    "Die vier Teile wirken wie ein Baukasten: <b>Nichtterminale</b> sind Platzhalter, die am Ende verschwinden, <b>Terminale</b> die Buchstaben, die übrig bleiben, <b>Produktionen</b> die erlaubten Ersetzungen und das <b>Startsymbol</b> der Anfang. Beispiel ist die Grammatik aus Aufgabe C.19.",
    function(K){
      var s = K.t(320, 22, "Beispiel: G = ({S}, {a, b}, P, S)", "s", { s: 14, b: true });
      s += K.f(150, 65, "N = {S}", "c4", { w: 200 }) + K.f(150, 115, "T = {a, b}", "a", { w: 200 }) + K.f(150, 165, "P = {S → aSb, S → ab}", "c3", { w: 200, s: 13 }) + K.f(150, 215, "s = S", "m", { fill: "fm", w: 200 });
      s += K.t(268, 65, "Nichtterminale – Platzhalter", "c4", { a: "start", s: 14, b: true });
      s += K.t(268, 115, "Terminale – Buchstaben des Ergebnisses", "a", { a: "start", s: 14, b: true });
      s += K.t(268, 165, "Produktionen – erlaubte Ersetzungen", "c3", { a: "start", s: 14, b: true });
      s += K.t(268, 215, "Startsymbol – hier beginnt alles", "m", { a: "start", s: 14, b: true });
      s += K.t(320, 268, "S  ⇒  aSb  ⇒  aabb   – nur noch Terminale: fertiges Wort", "s", { s: 14 });
      return K.svg(640, 290, s);
    });

  add("ableitung", "Ableitung: αAβ ⇒ αγβ",
    "In jedem Schritt wird <b>ein Nichtterminal</b> (rot) durch die rechte Seite einer Regel ersetzt; alles daneben bleibt stehen. Unten die Ableitung von aaabbb mit S → aSb und S → ab: Die blau hinterlegten Kästchen sind jeweils neu eingesetzt. Sobald <b>kein Nichtterminal</b> mehr übrig ist, ist das Wort fertig.",
    function(K){
      var s = K.rect(55, 30, 60, 30, "s") + K.t(85, 45, "α", "s", { s: 16, it: true }) + K.cell(140, 45, "A", "m", { w: 30, h: 30 }) + K.rect(165, 30, 60, 30, "s") + K.t(195, 45, "β", "s", { s: 16, it: true });
      s += K.t(255, 45, "⇒", "i", { s: 20, b: true });
      s += K.rect(285, 30, 60, 30, "s") + K.t(315, 45, "α", "s", { s: 16, it: true }) + K.rect(355, 30, 90, 30, "c3", { w: 1.8 }) + K.t(400, 45, "γ", "c3", { s: 16, it: true, b: true }) + K.rect(455, 30, 60, 30, "s") + K.t(485, 45, "β", "s", { s: 16, it: true });
      s += K.f(580, 45, "A → γ ∈ P", "c3", { fill: "p" });
      s += K.t(320, 82, "nur A wird ersetzt – α und β (der Kontext) bleiben stehen", "s", { s: 13 });
      s += K.line(40, 102, 600, 102, "r", { w: 1 });
      var forms = [["S"], ["a", "S", "b"], ["a", "a", "S", "b", "b"], ["a", "a", "a", "b", "b", "b"]], neu = [[], [0, 2], [1, 3], [2, 3]], rule = ["", "S → aSb", "S → aSb", "S → ab"];
      forms.forEach(function(f, r){
        var y = 130 + r * 45, x0 = 300 - (f.length - 1) * 15;
        f.forEach(function(ch, i){
          var isN = ch === "S", isNew = r > 0 && i >= neu[r][0] && i <= neu[r][1];
          s += K.cell(x0 + i * 30, y, ch, isN ? "m" : "a", { w: 26, h: 28, fill: isNew ? "fa" : "p", tc: isN ? "m" : "i" });
        });
        if(r) s += K.t(195, y, "⇒", "i", { s: 18, b: true }) + K.t(420, y, rule[r], "c3", { a: "start", s: 14, b: true });
      });
      s += K.t(470, 130, "Start", "s", { a: "start", s: 13 });
      return K.svg(640, 290, s);
    });

  add("lg", "Erzeugte Sprache L(G) = {w ∈ T* | S ⇒* w}",
    "Aus dem Startsymbol S führen Ableitungen (⇒*) zu manchen Wörtern aus T* – genau diese bilden <b>L(G)</b> (blauer Bereich). Für S → aSb | ab sind das ab, aabb, aaabbb, … Wörter wie ba oder aab liegen zwar in T*, sind aber von S aus <b>nicht erreichbar</b>.",
    function(K){
      var s = ell(K, 390, 150, 220, 115, "s", { w: 1.6 }) + ell(K, 330, 150, 100, 70, "a", { fill: "fa", w: 2 });
      s += K.node(70, 150, "S", "m", { r: 20, s: 16 });
      s += K.arrow(90, 144, 270, 126, "s", { w: 1.4, head: 8 }) + K.arrow(91, 151, 322, 155, "s", { w: 1.4, head: 8 }) + K.arrow(89, 158, 280, 188, "s", { w: 1.4, head: 8 });
      s += K.t(140, 118, "⇒*", "s", { s: 16, b: true });
      [["ab", 290, 125], ["aabb", 350, 155], ["aaabbb", 310, 190], ["…", 368, 190]].forEach(function(w){ s += K.t(w[1], w[2], w[0], "a", { s: 14, b: true }); });
      [["ba", 500, 90], ["aab", 530, 150], ["abab", 500, 210], ["ε", 450, 240]].forEach(function(w){ s += K.t(w[1], w[2], w[0], "f", { s: 14 }); });
      s += K.t(345, 100, "L(G)", "a", { s: 15, b: true }) + K.t(545, 45, "T* = {a, b}*", "s", { s: 14, b: true });
      s += K.f(320, 288, "L(G) = {w ∈ T* | S ⇒* w} = {aⁿbⁿ | n ≥ 1}", "a");
      return K.svg(640, 310, s);
    });

  add("baum", "Ableitungsbaum für aabb",
    "Die <b>Wurzel</b> ist das Startsymbol S; jeder innere Knoten zeigt, welche Regel angewendet wurde (S → aSb, dann S → ab). Die <b>Blätter</b> sind Terminale – liest man sie <b>von links nach rechts</b>, erhält man das abgeleitete Wort aabb.",
    function(K){
      var s = K.t(30, 60, "S ⇒ aSb ⇒ aabb", "s", { a: "start", s: 13 });
      var N = [[320, 50, "S", 1], [200, 140, "a", 0], [320, 140, "S", 1], [440, 140, "b", 0], [270, 220, "a", 0], [370, 220, "b", 0]];
      s += te(K, 320, 50, 200, 140, 18) + te(K, 320, 50, 320, 140, 18) + te(K, 320, 50, 440, 140, 18) + te(K, 320, 140, 270, 220, 18) + te(K, 320, 140, 370, 220, 18);
      [[200, 140], [270, 220], [370, 220], [440, 140]].forEach(function(p){ s += K.line(p[0], p[1] + 20, p[0], 268, "f", { w: 1.2, dash: "3 4" }); });
      N.forEach(function(q){ s += K.node(q[0], q[1], q[2], q[3] ? "c4" : "a", { r: 18, s: 16, fill: q[3] ? "p" : "fa" }); });
      s += K.t(345, 50, "S → aSb", "c4", { a: "start", s: 13, b: true }) + K.t(345, 140, "S → ab", "c4", { a: "start", s: 13, b: true });
      [200, 270, 370, 440].forEach(function(x, i){ s += K.t(x, 285, "aabb"[i], "a", { s: 18, b: true }); });
      s += K.arrow(180, 304, 460, 304, "a", { w: 1.6, head: 8 });
      s += K.t(320, 326, "Blätter von links nach rechts gelesen: aabb", "s", { s: 13 });
      return K.svg(640, 340, s);
    });

  add("mehrdeutig", "Mehrdeutige Grammatik – ein Wort, zwei Bäume",
    "Mit E → E + E | E · E | a lässt sich a + a · a auf <b>zwei verschiedene Arten</b> ableiten: links wird zuerst „+“ aufgespalten, rechts zuerst „·“. Die Blätter ergeben beide Male dasselbe Wort, aber die <b>Struktur</b> (und damit die Bedeutung) ist verschieden – die Grammatik ist <b>mehrdeutig</b>.",
    function(K){
      var s = K.panel(10, 10, 305, 300, "Baum 1: a + (a · a)", "a") + K.panel(325, 10, 305, 300, "Baum 2: (a + a) · a", "m");
      function tree(N, E){
        var o = "";
        E.forEach(function(e){ o += te(K, N[e[0]][0], N[e[0]][1], N[e[1]][0], N[e[1]][1], 15); });
        N.forEach(function(q){ var t = q[2] !== "E"; o += K.node(q[0], q[1], q[2], t ? "a" : "c4", { r: 15, s: 15, fill: t ? "fa" : "p" }); });
        return o;
      }
      s += tree([[160, 65, "E"], [80, 130, "E"], [160, 130, "+"], [240, 130, "E"], [80, 195, "a"], [190, 195, "E"], [240, 195, "·"], [290, 195, "E"], [190, 260, "a"], [290, 260, "a"]],
        [[0, 1], [0, 2], [0, 3], [1, 4], [3, 5], [3, 6], [3, 7], [5, 8], [7, 9]]);
      s += tree([[480, 65, "E"], [400, 130, "E"], [480, 130, "·"], [560, 130, "E"], [350, 195, "E"], [400, 195, "+"], [450, 195, "E"], [560, 195, "a"], [350, 260, "a"], [450, 260, "a"]],
        [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [1, 6], [3, 7], [4, 8], [6, 9]]);
      s += K.t(320, 332, "E → E + E | E · E | a  –  das Wort a + a · a hat zwei Ableitungsbäume", "s", { s: 13 });
      return K.svg(640, 345, s);
    });

  add("chomsky", "Chomsky-Hierarchie: Typ 3 ⊂ Typ 2 ⊂ Typ 1 ⊂ Typ 0",
    "Die vier Sprachklassen liegen <b>wie Zwiebelschalen</b> ineinander: Jede reguläre Sprache ist auch kontextfrei usw. Die Beispielsprachen sitzen jeweils in der <b>kleinsten passenden Schale</b>: {aⁿ} ist regulär, {aⁿbⁿ} braucht schon einen Kellerautomaten, {aⁿbⁿcⁿ} einen linear beschränkten Automaten. Nach außen werden die Regeln freier und die Automaten mächtiger.",
    function(K){
      var s = K.rect(10, 10, 620, 320, "f", { fill: "p", w: 2, rx: 14 }) + K.t(24, 32, "Typ 0 – rekursiv aufzählbar · Turingmaschine", "s", { a: "start", s: 13, b: true });
      s += K.rect(30, 45, 580, 270, "c4", { fill: "p", w: 2, rx: 12 }) + K.t(44, 67, "Typ 1 – kontextsensitiv · linear beschränkter Automat", "c4", { a: "start", s: 13, b: true });
      s += K.rect(50, 80, 420, 215, "c3", { fill: "p", w: 2, rx: 10 }) + K.t(64, 102, "Typ 2 – kontextfrei · Kellerautomat", "c3", { a: "start", s: 13, b: true });
      s += K.rect(70, 115, 260, 160, "a", { fill: "fa", w: 2, rx: 8 }) + K.t(84, 137, "Typ 3 – regulär · DEA / NEA", "a", { a: "start", s: 13, b: true });
      s += K.t(200, 205, "{aⁿ}", "a", { s: 18, b: true }) + K.t(400, 205, "{aⁿbⁿ}", "c3", { s: 18, b: true }) + K.t(540, 205, "{aⁿbⁿcⁿ}", "c4", { s: 18, b: true });
      return K.svg(640, 340, s);
    });

  add("typ0", "Typ 0: α → β ohne Einschränkung – Turingmaschine",
    "Bei Typ 0 darf eine Regel <b>beliebig</b> aussehen, z. B. ABC → a. Dadurch kann die Satzform während der Ableitung auch <b>schrumpfen</b> (roter Balken). Der passende Automat ist die <b>Turingmaschine</b> mit unbegrenztem Band – sie kann alles berechnen, was überhaupt berechenbar ist, läuft dafür aber unter Umständen endlos.",
    function(K){
      var s = K.panel(10, 10, 300, 280, "Regel α → β: beliebig") + K.panel(330, 10, 300, 280, "Turingmaschine");
      var M = K.map(40, 230, 42, 30), h = [1, 3, 5, 2];
      s += K.line(40, 230, 280, 230, "s", { w: 1.3 }) + K.t(50, 52, "Länge der Satzform", "s", { a: "start", s: 12 });
      h.forEach(function(v, i){ s += K.bar(i + 1, v, 0.6, M, i === 3 ? "m" : "a", { fill: i === 3 ? "fm" : "fa" }); s += K.t(M.X(i + 1), 244, String(i + 1) + ".", "f", { s: 12 }); });
      s += K.t(232, 168, "schrumpft!", "m", { a: "start", s: 12, b: true });
      s += K.f(160, 268, "z. B. ABC → a", "m", { fill: "fm" });
      var tape = ["□", "□", "a", "a", "b", "□", "□"];
      s += cells(K, 380, 110, tape, { cw: 34, w: 32, h: 32, c: "s", s: 15 });
      s += K.t(350, 110, "…", "s", { s: 16 }) + K.t(612, 110, "…", "s", { s: 16 });
      s += K.poly([[482, 132], [472, 150], [492, 150]], "m", { fill: "m" }) + K.cell(482, 172, "q", "m", { w: 34, h: 28, fill: "fm" });
      s += K.t(480, 222, "Band unbegrenzt in beide Richtungen", "s", { s: 12 });
      s += K.t(480, 250, "Lauf kann auch nie anhalten", "m", { s: 12, b: true });
      return K.svg(640, 300, s);
    });

  add("typ1", "Typ 1: |α| ≤ |β| – kontextsensitiv, linear beschränkter Automat",
    "Eine Typ-1-Regel darf ein Zeichen nur <b>in einem bestimmten Umfeld</b> ersetzen (hier B → b nur, wenn links ein a steht) und die Satzform <b>nie verkürzen</b>. Rechts die Längen beim Ableiten von aabbcc (Grammatik S → aSBC | aBC, CB → BC, aB → ab, bB → bb, bC → bc, cC → cc): Sie steigen nur oder bleiben gleich. Deshalb genügt ein Band, das <b>nicht länger als das Wort</b> ist – der linear beschränkte Automat.",
    function(K){
      var s = K.panel(10, 10, 280, 280, "Regel mit Kontext: aB → ab") + K.panel(300, 10, 330, 280, "Länge steigt nie – LBA genügt");
      s += cells(K, 128, 80, ["a", "B"], { cw: 44, w: 38, h: 34, cols: ["s", "m"], fills: ["p", "fm"], s: 17 });
      s += K.arrow(150, 102, 150, 136, "s", { w: 1.8, head: 9 }) + K.t(168, 119, "aB → ab", "c3", { a: "start", s: 13, b: true });
      s += cells(K, 128, 158, ["a", "b"], { cw: 44, w: 38, h: 34, cols: ["s", "a"], fills: ["p", "fa"], s: 17 });
      s += K.t(150, 205, "B → b nur, wenn links ein a steht", "s", { s: 12.5 });
      s += K.t(150, 240, "|α| = 2 ≤ |β| = 2 ✓", "a", { s: 14, b: true });
      var M = K.map(310, 250, 36, 22), h = [1, 4, 6, 6, 6, 6, 6, 6];
      s += K.line(310, 250, 620, 250, "s", { w: 1.3 });
      h.forEach(function(v, i){ s += K.bar(i + 1, v, 0.62, M, "a"); s += K.t(M.X(i + 1), M.Y(v) - 10, String(v), "a", { s: 12, b: true }); });
      s += K.line(318, M.Y(6), 620, M.Y(6), "m", { w: 1.2, dash: "5 4" }) + K.t(322, 82, "Obergrenze |w| = 6", "m", { a: "start", s: 12, b: true });
      s += K.t(465, 270, "S ⇒ aSBC ⇒ aaBCBC ⇒ … ⇒ aabbcc", "s", { s: 12 });
      return K.svg(640, 300, s);
    });

  add("typ2", "Typ 2: A → β – kontextfrei, Kellerautomat",
    "Links steht <b>immer genau ein Nichtterminal</b> – es wird ersetzt, egal was daneben steht. Mit S → aSb | ab entsteht eine <b>Schachtelung</b> wie bei Klammern. Ein Kellerautomat prüft das mit einem Stapel: jedes a <b>legt eine Marke auf</b>, jedes b <b>nimmt eine weg</b> – ist der Stapel am Ende leer, passt alles.",
    function(K){
      var s = K.panel(10, 10, 300, 280, "Regel A → β: S → aSb | ab") + K.panel(320, 10, 310, 280, "Kellerautomat für aⁿbⁿ");
      var N = [[150, 55, "S", 1], [95, 105, "a", 0], [150, 105, "S", 1], [205, 105, "b", 0], [110, 155, "a", 0], [150, 155, "S", 1], [190, 155, "b", 0], [125, 205, "a", 0], [175, 205, "b", 0]];
      [[0, 1], [0, 2], [0, 3], [2, 4], [2, 5], [2, 6], [5, 7], [5, 8]].forEach(function(e){ s += te(K, N[e[0]][0], N[e[0]][1], N[e[1]][0], N[e[1]][1], 14); });
      N.forEach(function(q){ s += K.node(q[0], q[1], q[2], q[3] ? "c4" : "a", { r: 14, s: 14, fill: q[3] ? "p" : "fa" }); });
      s += K.t(160, 248, "aaabbb – geschachtelt wie ((( )))", "s", { s: 12.5 });
      var inp = "aaabbb", h = [1, 2, 3, 2, 1, 0];
      for(var i = 0; i < 6; i++){
        var x = 360 + i * 50;
        for(var k = 0; k < h[i]; k++) s += K.cell(x, 226 - k * 27, "a", "c3", { w: 32, h: 25, fill: "fm", s: 13 });
        if(!h[i]) s += K.t(x, 226, "leer", "a", { s: 12, b: true });
        s += K.t(x, 258, inp[i], inp[i] === "a" ? "c3" : "a", { s: 15, b: true });
      }
      s += K.line(338, 241, 612, 241, "s", { w: 1.4 }) + K.t(475, 50, "Stapel nach jedem Zeichen", "s", { s: 12 });
      s += K.t(475, 280, "a ⇒ auflegen, b ⇒ wegnehmen, am Ende leer ✓", "s", { s: 12 });
      return K.svg(640, 300, s);
    });

  add("typ3", "Typ 3: A → aB | a – regulär, endlicher Automat",
    "Bei regulären Regeln steht rechts <b>ein Terminal und höchstens ein Nichtterminal ganz rechts</b>. Der Ableitungsbaum wird deshalb zu einem schiefen „Kamm“: Jeder Schritt hängt genau ein Zeichen an. Das ist exakt das Verhalten eines <b>endlichen Automaten</b> – Nichtterminal = Zustand, Zeichen = Übergang (Grammatik aus C.20).",
    function(K){
      var s = K.panel(10, 10, 240, 280, "S → 0A | 1,  A → 0A | 1") + K.panel(260, 10, 370, 280, "= endlicher Automat");
      var N = [[70, 60, "S", 1], [40, 120, "0", 0], [110, 120, "A", 1], [80, 180, "0", 0], [150, 180, "A", 1], [150, 240, "1", 0]];
      [[0, 1], [0, 2], [2, 3], [2, 4], [4, 5]].forEach(function(e){ s += te(K, N[e[0]][0], N[e[0]][1], N[e[1]][0], N[e[1]][1], 15); });
      N.forEach(function(q){ s += K.node(q[0], q[1], q[2], q[3] ? "c4" : "a", { r: 15, s: 15, fill: q[3] ? "p" : "fa" }); });
      s += K.t(200, 120, "Kamm", "s", { s: 12 });
      s += K.t(130, 275, "S ⇒ 0A ⇒ 00A ⇒ 001", "s", { s: 13 });
      s += K.state(330, 150, "S", { start: true }) + K.state(460, 150, "A") + K.state(580, 150, "E", { final: true });
      s += ed(K, 330, 150, 460, 150, "0") + ed(K, 460, 150, 580, 150, "1") + ed(K, 330, 150, 580, 150, "1", { bend: -70 });
      s += lp(K, 460, 150, 90, "0");
      s += K.t(445, 255, "ein Schritt = ein Zeichen lesen", "s", { s: 12.5 });
      return K.svg(640, 300, s);
    });

  add("epsregel", "ε-Regeln nur für das Startsymbol",
    "Eine ε-Regel <b>löscht</b> ein Nichtterminal – die Satzform wird kürzer. Mitten in einer Ableitung würde das die Längenbedingung |α| ≤ |β| verletzen (rechts). Erlaubt ist nur <b>S → ε</b>, und zwar wenn S auf <b>keiner rechten Seite</b> vorkommt: Dann kann ε nur als ganzes Wort entstehen (links: L = a*).",
    function(K){
      var s = K.panel(10, 10, 300, 250, "erlaubt: S → ε") + K.panel(330, 10, 300, 250, "verboten: A → ε mittendrin");
      s += K.t(160, 70, "S → ε | A", "a", { s: 17, b: true }) + K.t(160, 105, "A → aA | a", "a", { s: 17, b: true });
      s += K.t(160, 150, "L = {ε, a, aa, …}", "s", { s: 15, b: true });
      s += K.t(160, 195, "S steht rechts nirgends ✓", "a", { s: 13, b: true }) + K.t(160, 220, "ε entsteht nur als ganzes Wort", "s", { s: 12.5 });
      s += cells(K, 430, 75, ["a", "A", "b"], { cw: 36, w: 32, cols: ["a", "m", "a"], fills: ["p", "fm", "p"] }) + K.t(540, 75, "Länge 3", "s", { a: "start", s: 13 });
      s += K.arrow(466, 95, 466, 132, "s", { w: 1.8, head: 9 }) + K.t(482, 114, "A → ε", "m", { a: "start", s: 13, b: true });
      s += cells(K, 448, 155, ["a", "b"], { cw: 36, w: 32 }) + K.t(540, 155, "Länge 2", "m", { a: "start", s: 13, b: true });
      s += K.t(480, 205, "|α| = 1 > |β| = 0 ✗", "m", { s: 14, b: true }) + K.t(480, 230, "verletzt |α| ≤ |β|", "s", { s: 12.5 });
      return K.svg(640, 270, s);
    });

  add("wortproblem", "Wortproblem: entscheidbar für Typ 1–3, nicht für Typ 0",
    "Entscheidbar heißt: Es gibt ein Verfahren, das <b>immer anhält</b> und „ja“ oder „nein“ sagt. Für Typ 1–3 klappt das, weil Satzformen <b>nie länger als |w|</b> werden – es gibt nur endlich viele zum Durchprobieren. Bei Typ 0 können Satzformen wachsen und wieder schrumpfen; liegt w nicht in L, wartet man womöglich <b>ewig</b>.",
    function(K){
      var s = K.panel(10, 10, 300, 260, "Typ 1–3: entscheidbar", "a") + K.panel(330, 10, 300, 260, "Typ 0: nicht entscheidbar", "m");
      s += K.t(40, 100, "w", "i", { s: 18, b: true, it: true }) + K.arrow(52, 100, 88, 100, "s", { w: 1.8, head: 9 });
      s += K.cell(150, 100, "Algorithmus", "a", { w: 120, h: 40, fill: "fa", s: 13 });
      s += K.arrow(212, 92, 250, 68, "a", { w: 1.8, head: 9 }) + K.arrow(212, 108, 250, 132, "a", { w: 1.8, head: 9 });
      s += K.t(258, 64, "ja", "a", { a: "start", s: 14, b: true }) + K.t(258, 136, "nein", "a", { a: "start", s: 14, b: true });
      s += K.t(160, 180, "hält immer an", "a", { s: 14, b: true });
      s += K.t(160, 212, "Satzformen nie länger als |w|", "s", { s: 12.5 }) + K.t(160, 232, "⇒ endlich viele durchprobieren", "s", { s: 12.5 });
      s += K.t(360, 100, "w", "i", { s: 18, b: true, it: true }) + K.arrow(372, 100, 408, 100, "s", { w: 1.8, head: 9 });
      s += K.cell(470, 100, "Verfahren", "m", { w: 120, h: 40, fill: "fm", s: 13 });
      s += K.arrow(532, 92, 570, 68, "a", { w: 1.8, head: 9 }) + K.t(578, 64, "ja", "a", { a: "start", s: 14, b: true });
      s += K.loop(470, 100, -90, { c: "m", r: 20 });
      s += K.t(470, 165, "läuft evtl. endlos", "m", { s: 14, b: true });
      s += K.t(480, 212, "bei w ∉ L kommt evtl.", "s", { s: 12.5 }) + K.t(480, 232, "nie eine Antwort", "s", { s: 12.5 });
      return K.svg(640, 280, s);
    });

  /* ═════════ Kapitel 3: Sprachübersetzer ═════════ */

  add("compint", "Compiler vs. Interpreter auf der Zeitachse",
    "Ein Programm mit einer Schleife, die 5-mal läuft: Der <b>Compiler</b> übersetzt <b>einmal</b> vorab (orange) und führt dann nur noch aus (blau). Der <b>Interpreter</b> übersetzt in <b>jeder Runde neu</b> – die orangen Stücke summieren sich, deshalb ist er bei Schleifen langsamer.",
    function(K){
      var s = K.t(20, 90, "Compiler", "i", { a: "start", s: 14, b: true }) + K.t(20, 200, "Interpreter", "i", { a: "start", s: 14, b: true });
      s += K.rect(130, 75, 90, 30, "c3", { fill: "fm", rx: 3 }) + K.t(175, 90, "übersetzen", "c3", { s: 12, b: true, halo: false });
      for(var i = 0; i < 5; i++) s += K.rect(223 + i * 33, 75, 30, 30, "a", { fill: "fa", rx: 3 }) + K.t(238 + i * 33, 90, "▶", "a", { s: 12, halo: false });
      s += K.line(385, 62, 385, 240, "a", { w: 1.2, dash: "4 4" }) + K.t(385, 52, "fertig", "a", { s: 12, b: true });
      s += K.t(420, 90, "1× übersetzen, dann schnell", "s", { a: "start", s: 12 });
      for(var j = 0; j < 5; j++){
        var x = 130 + j * 76;
        s += K.rect(x, 185, 40, 30, "c3", { fill: "fm", rx: 3 }) + K.rect(x + 43, 185, 30, 30, "a", { fill: "fa", rx: 3 }) + K.t(x + 58, 200, "▶", "a", { s: 12, halo: false });
      }
      s += K.line(507, 172, 507, 240, "m", { w: 1.2, dash: "4 4" }) + K.t(507, 162, "fertig", "m", { s: 12, b: true });
      s += K.t(530, 200, "jede Runde neu", "s", { a: "start", s: 12 });
      s += K.arrow(130, 240, 600, 240, "s", { w: 1.3, head: 9 }) + K.t(600, 256, "Zeit", "s", { a: "end", s: 12 });
      s += K.rect(130, 270, 20, 14, "c3", { fill: "fm", rx: 2 }) + K.t(156, 277, "übersetzen", "s", { a: "start", s: 12 });
      s += K.rect(260, 270, 20, 14, "a", { fill: "fa", rx: 2 }) + K.t(286, 277, "ausführen (5 Schleifendurchläufe)", "s", { a: "start", s: 12 });
      return K.svg(640, 295, s);
    });

  add("scanpars", "Scanner und Parser – zwei Stufen, zwei Sprachklassen",
    "Der <b>Scanner</b> zerlegt den Zeichenstrom in <b>Tokens</b> (Bezeichner, Zahlen, Operatoren) – dafür reicht ein endlicher Automat (Typ 3). Der <b>Parser</b> setzt die Tokens zu einem <b>Syntaxbaum</b> zusammen und prüft die Struktur – dafür braucht er eine kontextfreie Grammatik (Typ 2).",
    function(K){
      var s = K.f(320, 40, "x = 3 + y", "i", { fill: "p", s: 15 }) + K.t(200, 40, "Quelltext", "s", { a: "end", s: 12.5 });
      s += K.arrow(320, 56, 320, 78, "s", { w: 1.6, head: 8 });
      s += K.cell(320, 96, "Scanner (Lexer)", "a", { w: 170, h: 34, fill: "fa", s: 14 }) + K.t(425, 96, "Typ 3: DEA / reg. Ausdruck", "a", { a: "start", s: 12, b: true });
      s += K.arrow(320, 114, 320, 136, "s", { w: 1.6, head: 8 });
      var tok = ["ID x", "=", "NUM 3", "+", "ID y"];
      tok.forEach(function(t, i){ s += K.cell(180 + i * 70, 152, t, "c3", { w: 62, h: 28, s: 13 }); });
      s += K.t(130, 152, "Tokens", "s", { a: "end", s: 12.5 });
      s += K.arrow(320, 167, 320, 186, "s", { w: 1.6, head: 8 });
      s += K.cell(320, 204, "Parser", "c4", { w: 170, h: 34, fill: "p", s: 14 }) + K.t(425, 204, "Typ 2: kontextfreie Gr.", "c4", { a: "start", s: 12, b: true });
      s += K.arrow(320, 222, 320, 238, "s", { w: 1.6, head: 8 });
      s += te(K, 320, 256, 240, 306) + te(K, 320, 256, 400, 306) + te(K, 400, 306, 360, 356) + te(K, 400, 306, 440, 356);
      [[320, 256, "="], [240, 306, "x"], [400, 306, "+"], [360, 356, "3"], [440, 356, "y"]].forEach(function(q){ s += K.node(q[0], q[1], q[2], "c4", { r: 16, s: 15 }); });
      s += K.t(150, 306, "Syntaxbaum", "s", { s: 12.5 });
      return K.svg(640, 380, s);
    });

  add("klammern", "Warum der Parser Typ 2 braucht: Schachteltiefe",
    "Das Profil zeigt die <b>Schachteltiefe</b> beim Lesen von (()(())): jede „(“ geht eine Stufe hoch, jede „)“ eine runter. Ein endlicher Automat müsste sich die Tiefe in einem Zustand merken – bei <b>beliebig tiefer Schachtelung</b> bräuchte er unendlich viele. Der Kellerautomat des Parsers merkt sie sich einfach auf dem <b>Stapel</b>.",
    function(K){
      var s = K.t(320, 30, "Schachteltiefe beim Lesen von (()(()))", "s", { s: 13.5, b: true });
      s += K.t(320, 58, "DEA: nur endlich viele Zustände – kann beliebige Tiefe nicht zählen", "m", { s: 12.5 });
      s += K.t(320, 78, "Keller (Typ 2): legt je „(“ eine Marke auf – Tiefe unbegrenzt", "a", { s: 12.5 });
      var ch = "(()(()))", d = [1, 2, 1, 2, 3, 2, 1, 0];
      function Y(v){ return 240 - v * 40; }
      var p = "M82 240", a = "M82 240";
      for(var i = 0; i < 8; i++){ var x = 110 + i * 55; p += " H" + x + " V" + Y(d[i]); a += " H" + x + " V" + Y(d[i]); }
      p += " H523"; a += " H523 Z";
      for(var k = 1; k <= 3; k++) s += K.line(82, Y(k), 523, Y(k), "r", { w: 0.8, dash: "3 4" }) + K.t(70, Y(k), String(k), "f", { a: "end", s: 12 });
      s += '<path d="' + a + '" style="fill:var(--sk-fill);stroke:none"/>' + K.path(p, "a", { w: 2.4 });
      s += K.line(82, 240, 523, 240, "s", { w: 1.3 }) + K.t(70, 240, "0", "f", { a: "end", s: 12 }) + K.t(40, 180, "Tiefe", "s", { s: 12 });
      for(var j = 0; j < 8; j++) s += K.t(110 + j * 55, 268, ch[j], ch[j] === "(" ? "c3" : "c4", { s: 20, b: true });
      s += K.t(565, 240, "fertig: 0 ✓", "a", { a: "middle", s: 12, b: true });
      return K.svg(640, 290, s);
    });

  add("tdiag", "T-Diagramm: Quelle → Ziel, implementiert in …",
    "Das T liest man so: <b>oben</b> steht, <b>was</b> übersetzt wird – links die Quellsprache, rechts die Zielsprache. Der <b>Fuß</b> sagt, in welcher Sprache der Übersetzer <b>selbst geschrieben</b> ist bzw. läuft. Rechts ein Beispiel: ein Pascal-Compiler, der in C geschrieben ist und x86-Maschinencode erzeugt.",
    function(K){
      function T(dx, q, z, i, i2){
        var o = K.poly([[30 + dx, 50], [290 + dx, 50], [290 + dx, 100], [235 + dx, 100], [235 + dx, 180], [85 + dx, 180], [85 + dx, 100], [30 + dx, 100]], "a", { fill: "fa", w: 2 });
        o += K.t(95 + dx, 75, q, "a", { s: 14, b: true, halo: false }) + K.arrow(148 + dx, 75, 174 + dx, 75, "a", { w: 1.8, head: 8 }) + K.t(225 + dx, 75, z, "a", { s: 14, b: true, halo: false });
        o += K.t(160 + dx, 132, i, "c4", { s: 14, b: true, halo: false });
        if(i2) o += K.t(160 + dx, 156, i2, "s", { s: 12, halo: false });
        return o;
      }
      var s = K.panel(10, 10, 300, 225, "allgemein") + K.panel(330, 10, 300, 225, "Beispiel");
      s += T(0, "Quellsprache", "Zielsprache", "Implementierung", "(darin läuft er)");
      s += T(320, "Pascal", "x86-Code", "C", "");
      s += K.t(160, 210, "oben: was übersetzt wird · unten: womit", "s", { s: 12 });
      s += K.t(480, 210, "Pascal-Compiler, in C geschrieben", "s", { s: 12 });
      return K.svg(640, 245, s);
    });

  /* ═════════ Kapitel 4: Reguläre Sprachen und endliche Automaten ═════════ */

  add("deadef", "DEA M = (Q, Σ, δ, q₀, F) – Beispiel „endet auf 01“",
    "Der DEA aus Aufgabe C.22: Zustände sind Kreise, δ sind die Pfeile, der Startpfeil zeigt auf q₀, der Doppelkreis ist der Endzustand. Aus <b>jedem Zustand</b> geht für <b>jedes Zeichen genau ein Pfeil</b> – das ist „deterministisch“. q₁ heißt „zuletzt 0 gelesen“, q₂ „zuletzt 01 gelesen“.",
    function(K){
      var s = K.f(320, 28, "M = (Q, Σ, δ, q₀, F)", "a", { s: 15 });
      s += K.t(320, 60, "Q = {q₀, q₁, q₂}   ·   Σ = {0, 1}   ·   F = {q₂}", "s", { s: 13 });
      s += K.state(120, 170, "q₀", { start: true }) + K.state(300, 170, "q₁") + K.state(480, 170, "q₂", { final: true });
      s += ed(K, 120, 170, 300, 170, "0") + lp(K, 120, 170, 90, "1") + lp(K, 300, 170, 90, "0");
      s += ed(K, 300, 170, 480, 170, "1", { bend: 25 }) + ed(K, 480, 170, 300, 170, "0", { bend: 25 }) + ed(K, 480, 170, 120, 170, "1", { bend: 95 });
      s += K.t(72, 196, "Start", "s", { s: 12 }) + K.t(510, 205, "Endzustand", "s", { a: "start", s: 12 });
      s += K.t(320, 305, "akzeptiert genau die Wörter, die auf 01 enden", "s", { s: 13 });
      return K.svg(640, 320, s);
    });

  add("dealauf", "DEA-Lauf: Wort zeichenweise abarbeiten",
    "Der DEA aus C.22 liest das Wort Zeichen für Zeichen und folgt jeweils dem <b>einen</b> passenden Pfeil. Bei 101 landet er in q₂ ∈ F – <b>akzeptiert</b>. Bei 00 bleibt er in q₁, das kein Endzustand ist – <b>abgelehnt</b>. Es zählt nur, wo der Lauf <b>endet</b>.",
    function(K){
      var s = K.t(20, 40, "w = 101", "a", { a: "start", s: 16, b: true }) + K.t(20, 165, "w = 00", "m", { a: "start", s: 16, b: true });
      var r1 = ["q₀", "q₀", "q₁", "q₂"], c1 = "101";
      r1.forEach(function(q, i){ s += K.state(90 + i * 130, 100, q, { start: i === 0, final: q === "q₂" }); });
      for(var i = 0; i < 3; i++) s += ed(K, 90 + i * 130, 100, 220 + i * 130, 100, c1[i], { ls: 16 });
      s += K.t(570, 100, "✓", "a", { s: 26, b: true }) + K.t(570, 132, "akzeptiert", "a", { s: 12, b: true });
      var r2 = ["q₀", "q₁", "q₁"];
      r2.forEach(function(q, i){ s += K.state(90 + i * 130, 220, q, { start: i === 0, c: i === 2 ? "m" : "a" }); });
      for(var j = 0; j < 2; j++) s += ed(K, 90 + j * 130, 220, 220 + j * 130, 220, "0", { ls: 16 });
      s += K.t(400, 220, "✗ q₁ ∉ F – abgelehnt", "m", { a: "start", s: 14, b: true });
      s += K.t(320, 268, "jedes Zeichen: genau ein Schritt – am Ende zählt nur der letzte Zustand", "s", { s: 12.5 });
      return K.svg(640, 285, s);
    });

  add("delta", "Übergangsfunktion: δ: Q × Σ → Q  vs.  δ: Q × Σ → P(Q)",
    "Als Tabelle sieht man den Unterschied sofort: Beim <b>DEA</b> steht in jeder Zelle <b>genau ein</b> Zustand. Beim <b>NEA</b> steht eine <b>Menge</b> – sie kann zwei Zustände enthalten (orange, Wahlmöglichkeit) oder <b>leer</b> sein (∅, rot: dort endet der Pfad). Links C.22 („endet auf 01“), rechts C.23 („endet auf ab“).",
    function(K){
      var s = K.panel(10, 10, 300, 270, "DEA: endet auf 01") + K.panel(330, 10, 300, 270, "NEA: endet auf ab");
      s += table(K, 50, 45, [60, 90, 90], 36, [["δ", "0", "1"], ["q₀", "q₁", "q₀"], ["q₁", "q₁", "q₂"], ["q₂", "q₁", "q₀"]]);
      var nea = [["δ", "a", "b"], ["q₀", "{q₀, q₁}", "{q₀}"], ["q₁", "∅", "{q₂}"], ["q₂", "∅", "∅"]];
      s += table(K, 362, 45, [60, 88, 88], 36, nea, function(r, c){
        if(r && c){ var v = nea[r][c]; if(v === "∅") return { tc: "m", b: true }; if(v.indexOf(",") > 0) return { tc: "c3", b: true, fill: "fm" }; }
      });
      s += K.t(160, 210, "jede Zelle: genau 1 Zustand", "a", { s: 13, b: true }) + K.t(480, 210, "Zelle = Menge: 2, 1 oder 0 (∅)", "c3", { s: 13, b: true });
      s += K.f(160, 250, "δ: Q × Σ → Q", "a") + K.f(480, 250, "δ: Q × Σ → P(Q)", "c3", { fill: "fm" });
      return K.svg(640, 290, s);
    });

  add("nea", "NEA: mehrere oder keine Folgezustände",
    "Der NEA aus Aufgabe C.23: In q₀ gibt es beim Zeichen a <b>zwei</b> Möglichkeiten – in q₀ bleiben oder nach q₁ gehen. Man kann sich vorstellen, dass er <b>richtig rät</b>, wann das abschließende „ab“ beginnt. Fehlt ein Pfeil (z. B. q₁ bei a), stirbt dieser Pfad einfach.",
    function(K){
      var s = K.t(320, 28, "NEA: Wörter über {a, b}, die auf ab enden", "s", { s: 13.5, b: true });
      s += K.state(130, 150, "q₀", { start: true }) + K.state(320, 150, "q₁") + K.state(510, 150, "q₂", { final: true });
      s += lp(K, 130, 150, 90, "a, b", "c3", 22, "c3") + ed(K, 130, 150, 320, 150, "a", { c: "c3", lc: "c3" }) + ed(K, 320, 150, 510, 150, "b");
      s += K.t(320, 222, "bei a in q₀: bleiben ODER nach q₁ – zwei Möglichkeiten", "c3", { s: 13, b: true });
      s += K.t(320, 248, "q₁ bei a, q₂ bei a/b: kein Folgezustand (∅) – der Pfad endet", "m", { s: 12.5 });
      return K.svg(640, 265, s);
    });

  add("nealauf", "NEA-Lauf als Baum: akzeptiert, wenn ein Pfad passt",
    "Der NEA aus C.23 liest aab und <b>verzweigt</b> bei jedem a. Alle Möglichkeiten zusammen bilden einen Baum. Ein Ast stirbt (∅), einer endet in q₀ (kein Endzustand), einer in q₂ – und weil <b>mindestens ein</b> Pfad in F endet, wird aab akzeptiert.",
    function(K){
      var s = K.t(20, 30, "Eingabe:", "s", { a: "start", s: 13 });
      s += K.t(140, 30, "a", "a", { s: 17, b: true }) + K.t(265, 30, "a", "a", { s: 17, b: true }) + K.t(400, 30, "b", "a", { s: 17, b: true });
      var o = { r: 20 };
      s += K.state(80, 170, "q₀", { r: 20, start: true }) + K.state(200, 110, "q₀", o) + K.state(200, 230, "q₁", o);
      s += K.state(330, 70, "q₀", o) + K.state(330, 160, "q₁", o) + K.state(470, 70, "q₀", { r: 20, c: "s" }) + K.state(470, 160, "q₂", { r: 20, final: true });
      var e = { r1: 20, r2: 20 };
      s += ed(K, 80, 170, 200, 110, "a", e) + ed(K, 80, 170, 200, 230, "a", { r1: 20, r2: 20, lo: -12 });
      s += ed(K, 200, 110, 330, 70, "a", e) + ed(K, 200, 110, 330, 160, "a", { r1: 20, r2: 20, lo: -12 });
      s += ed(K, 330, 70, 470, 70, "b", e) + ed(K, 330, 160, 470, 160, "b", e);
      s += K.arrow(219, 237, 296, 258, "m", { w: 1.6, head: 8, dash: "5 4" }) + K.t(304, 262, "a: ∅ – Pfad stirbt", "m", { a: "start", s: 13, b: true });
      s += K.t(502, 70, "q₀ ∉ F", "s", { a: "start", s: 13 }) + K.t(502, 160, "q₂ ∈ F ✓", "a", { a: "start", s: 14, b: true });
      s += K.t(320, 305, "mindestens ein Pfad endet in F ⇒ aab wird akzeptiert", "a", { s: 13.5, b: true });
      return K.svg(640, 325, s);
    });

  add("dea2n", "Bis zu 2ⁿ DEA-Zustände – nur die erreichbaren zählen",
    "Jeder DEA-Zustand der Potenzmengenkonstruktion ist eine <b>Teilmenge</b> der NEA-Zustände. Bei n = 3 gibt es 2³ = 8 Teilmengen (hier nach Größe geordnet). Für den NEA aus C.23 werden aber nur <b>drei davon erreicht</b> (blau) – die übrigen fallen weg. Im ungünstigsten Fall braucht man jedoch wirklich alle 2ⁿ.",
    function(K){
      var L = { e: [270, 290, "∅"], a: [140, 210, "{q₀}"], b: [270, 210, "{q₁}"], c: [400, 210, "{q₂}"], ab: [140, 130, "{q₀,q₁}"], ac: [270, 130, "{q₀,q₂}"], bc: [400, 130, "{q₁,q₂}"], abc: [270, 50, "{q₀,q₁,q₂}"] };
      var E = [["e", "a"], ["e", "b"], ["e", "c"], ["a", "ab"], ["a", "ac"], ["b", "ab"], ["b", "bc"], ["c", "ac"], ["c", "bc"], ["ab", "abc"], ["ac", "abc"], ["bc", "abc"]];
      var s = "";
      E.forEach(function(e){ var p = L[e[0]], q = L[e[1]]; s += K.line(p[0], p[1] - 15, q[0], q[1] + 15, "r", { w: 1.2 }); });
      var reach = { a: 1, ab: 1, ac: 1 };
      for(var k in L){ var v = L[k], r = reach[k]; s += K.cell(v[0], v[1], v[2], r ? "a" : "f", { w: k === "abc" ? 100 : 80, h: 30, fill: r ? "fa" : "p", s: 13, tc: r ? "a" : "f" }); }
      s += K.t(140, 240, "Start", "a", { s: 12, b: true });
      s += lines(K, 480, 90, ["n = 3 NEA-Zustände", "⇒ bis zu 2³ = 8", "    DEA-Zustände", "", "erreichbar (C.23): 3", "Rest wird weggelassen"], "s", { s: 13, lh: 22 });
      return K.svg(640, 315, s);
    });

  add("pmk", "Potenzmengenkonstruktion Schritt für Schritt",
    "Man startet mit {q₀} und trägt für jedes Zeichen die <b>Vereinigung</b> der NEA-Folgezustände ein. Taucht eine <b>neue Menge</b> auf (orange), bekommt sie eine eigene Zeile. Kommt nichts Neues mehr hinzu, ist man fertig. <b>Endzustand</b> wird jede Menge, die einen NEA-Endzustand (q₂) enthält.",
    function(K){
      var rows = [["DEA-Zustand", "a", "b"], ["{q₀}", "{q₀,q₁}", "{q₀}"], ["{q₀,q₁}", "{q₀,q₁}", "{q₀,q₂}"], ["{q₀,q₂} (End)", "{q₀,q₁}", "{q₀}"]];
      var s = table(K, 30, 40, [130, 130, 130], 36, rows, function(r, c){
        if((r === 1 && c === 1) || (r === 2 && c === 2)) return { tc: "c3", b: true, fill: "fm" };
        if(r === 3 && c === 0) return { tc: "m", fill: "fm" };
      });
      s += lines(K, 445, 60, ["① Start: {q₀}", "② neue Menge (orange)", "     → neue Zeile", "③ nichts Neues mehr", "     → fertig"], "s", { s: 13, lh: 28 });
      s += K.f(320, 225, "δ({q₀,q₁}, b) = δ(q₀,b) ∪ δ(q₁,b) = {q₀} ∪ {q₂} = {q₀,q₂}", "c3", { s: 13, fill: "p" });
      s += K.t(320, 270, "Endzustand: jede Menge, die q₂ enthält → {q₀,q₂}", "m", { s: 13.5, b: true });
      return K.svg(640, 295, s);
    });

  add("pmkdea", "Ergebnis-DEA der Potenzmengenkonstruktion",
    "Aus der Tabelle wird wieder ein Zustandsdiagramm: drei DEA-Zustände, jeder ist eine Menge von NEA-Zuständen. Jetzt geht aus jedem Zustand für a und b <b>genau ein</b> Pfeil – deterministisch. <b>{q₀,q₂}</b> ist Endzustand, weil er q₂ enthält; der Automat akzeptiert dieselbe Sprache wie der NEA: Wörter, die auf ab enden.",
    function(K){
      var s = K.t(320, 22, "DEA aus dem NEA von C.23", "s", { s: 13.5, b: true });
      var o = { r: 34, s: 12.5 };
      s += K.state(110, 150, "{q₀}", { r: 34, s: 12.5, start: true }) + K.state(320, 150, "{q₀,q₁}", o) + K.state(530, 150, "{q₀,q₂}", { r: 34, s: 12.5, final: true });
      var e = { r1: 34, r2: 34 };
      s += lp(K, 110, 150, 90, "b", "s", 34) + lp(K, 320, 150, 90, "a", "s", 34);
      s += ed(K, 110, 150, 320, 150, "a", e);
      s += ed(K, 320, 150, 530, 150, "b", { r1: 34, r2: 34, bend: 22 }) + ed(K, 530, 150, 320, 150, "a", { r1: 34, r2: 34, bend: 22 });
      s += ed(K, 530, 150, 110, 150, "b", { r1: 34, r2: 34, bend: 100 });
      s += K.t(320, 288, "akzeptiert Wörter, die auf ab enden", "s", { s: 13 });
      return K.svg(640, 300, s);
    });

  add("epshuelle", "ε-Hülle: alles, was ohne Zeichen erreichbar ist",
    "ε-Pfeile darf der Automat <b>ohne Lesen</b> eines Zeichens nehmen. Die ε-Hülle von q₀ sammelt alle Zustände, die man so erreicht – hier q₀, q₁ und q₂ (orange Fläche). Bei der Potenzmengenkonstruktion rechnet man mit dieser ganzen Menge: Aus q₀ führt a zu q₃, obwohl q₀ selbst keinen a-Pfeil hat.",
    function(K){
      var s = K.rect(40, 100, 342, 100, "c3", { fill: "fm", dash: "6 4", rx: 16, w: 1.6 });
      s += K.t(210, 82, "ε-Hülle(q₀) = {q₀, q₁, q₂}", "c3", { s: 14, b: true });
      s += K.state(90, 150, "q₀", { start: true }) + K.state(210, 150, "q₁") + K.state(330, 150, "q₂") + K.state(520, 150, "q₃", { final: true });
      s += ed(K, 90, 150, 210, 150, "ε", { c: "c3", lc: "c3" }) + ed(K, 210, 150, 330, 150, "ε", { c: "c3", lc: "c3" });
      s += ed(K, 330, 150, 520, 150, "a") + ed(K, 210, 150, 520, 150, "b", { bend: -80 });
      s += K.t(320, 272, "aus q₀ mit a:  ε-Hülle {q₀, q₁, q₂}  →a→  {q₃}", "s", { s: 13 });
      return K.svg(640, 290, s);
    });

  add("minimal", "Minimalautomat: äquivalente Zustände verschmelzen",
    "Links ein DEA für „endet auf 1“ mit einem überflüssigen Zustand: <b>A und B</b> sind beide keine Endzustände und führen bei 0 und bei 1 jeweils in <b>dieselben</b> Zustände – für jede Fortsetzung kommt dasselbe heraus, sie sind <b>äquivalent</b>. Rechts sind sie zu einem Zustand zusammengefasst: weniger Zustände, gleiche Sprache.",
    function(K){
      var s = K.panel(10, 10, 380, 300, "vorher: A ≡ B") + K.panel(400, 10, 250, 300, "nachher: minimal");
      s += K.state(80, 200, "A", { start: true, c: "c4", fill: "fm" }) + K.state(220, 115, "B", { c: "c4", fill: "fm" }) + K.state(330, 220, "C", { final: true });
      s += ed(K, 80, 200, 220, 115, "0") + ed(K, 80, 200, 330, 220, "1") + lp(K, 220, 115, 90, "0");
      s += ed(K, 220, 115, 330, 220, "1", { bend: 18 }) + ed(K, 330, 220, 220, 115, "0", { bend: 18 }) + lp(K, 330, 220, -90, "1");
      s += K.t(20, 292, "A, B: kein Endzustand, gleiche Folgezustände", "c4", { a: "start", s: 12, b: true });
      s += K.state(470, 150, "A,B", { start: true, c: "c4", fill: "fm", s: 13 }) + K.state(590, 150, "C", { final: true });
      s += lp(K, 470, 150, 90, "0") + ed(K, 470, 150, 590, 150, "1", { bend: 22 }) + ed(K, 590, 150, 470, 150, "0", { bend: 22 }) + lp(K, 590, 150, -90, "1");
      s += K.t(525, 292, "3 → 2 Zustände, gleiche Sprache", "a", { s: 12, b: true });
      return K.svg(660, 320, s);
    });

  add("gram2dea", "Reguläre Grammatik → Automat",
    "Jedes <b>Nichtterminal wird ein Zustand</b>, das Startsymbol der Startzustand. Eine Regel A → aB wird zum Pfeil A –a→ B; eine Regel A → a führt in einen neuen <b>Endzustand E</b>. Farben zeigen, welche Regel zu welchem Pfeil wird (Grammatik aus C.20, Sprache: Wörter, die auf 1 enden).",
    function(K){
      var s = K.t(30, 35, "Regeln", "s", { a: "start", s: 13, b: true });
      var R = [["S → 0A", "c4"], ["S → 1", "c3"], ["A → 0A", "a"], ["A → 1", "m"]];
      R.forEach(function(r, i){ s += K.t(30, 70 + i * 35, r[0], r[1], { a: "start", s: 17, b: true }); });
      s += K.t(30, 215, "Nichtterminale S, A → Zustände", "s", { a: "start", s: 12.5 }) + K.t(30, 237, "A → a → Pfeil in Endzustand E", "s", { a: "start", s: 12.5 });
      s += K.state(300, 140, "S", { start: true }) + K.state(450, 140, "A") + K.state(590, 140, "E", { final: true });
      s += ed(K, 300, 140, 450, 140, "0", { c: "c4", lc: "c4" }) + ed(K, 450, 140, 590, 140, "1", { c: "m", lc: "m" }) + ed(K, 300, 140, 590, 140, "1", { c: "c3", lc: "c3", bend: -80 });
      s += lp(K, 450, 140, 90, "0", "a", 22, "a");
      s += K.t(320, 275, "L = Wörter über {0, 1}, die auf 1 enden", "s", { s: 13 });
      return K.svg(640, 290, s);
    });

  add("rxbasis", "Basisfälle regulärer Ausdrücke: ∅, ε, a",
    "Die drei Bausteine als Mini-Automaten: Bei <b>∅</b> gibt es keinen Weg zum Endzustand – nichts wird akzeptiert. Bei <b>ε</b> ist der Start selbst Endzustand – nur das leere Wort. Bei <b>a</b> führt genau ein Pfeil mit a zum Ziel. Aus diesen Bausteinen setzen die Operatoren alles Weitere zusammen.",
    function(K){
      var s = K.panel(10, 10, 200, 220, "∅ – leere Sprache") + K.panel(220, 10, 200, 220, "ε – leeres Wort") + K.panel(430, 10, 200, 220, "a – ein Zeichen");
      s += K.state(75, 110, "", { start: true }) + K.state(160, 110, "", { final: true });
      s += K.state(320, 110, "", { start: true, final: true });
      s += K.state(495, 110, "", { start: true }) + K.state(590, 110, "", { final: true }) + ed(K, 495, 110, 590, 110, "a");
      s += K.t(110, 170, "L = ∅", "m", { s: 15, b: true }) + K.t(320, 170, "L = {ε}", "a", { s: 15, b: true }) + K.t(530, 170, "L = {a}", "a", { s: 15, b: true });
      s += K.t(110, 205, "kein Weg ins Ziel", "s", { s: 12 }) + K.t(320, 205, "Start = Ziel", "s", { s: 12 }) + K.t(530, 205, "ein Pfeil, ein Zeichen", "s", { s: 12 });
      return K.svg(640, 240, s);
    });

  add("rxops", "Operatoren: Verkettung, Alternative, Kleene-Stern",
    "<b>Verkettung</b> = Bausteine hintereinander schalten. <b>Alternative</b> = zwei parallele Wege, man nimmt einen davon. <b>Kleene-Stern</b> = eine Schleife, die man beliebig oft (auch nullmal) durchläuft. Unter jedem Automaten steht die Wortmenge, die er beschreibt.",
    function(K){
      var s = K.panel(10, 10, 200, 250, "u·v:  ab") + K.panel(220, 10, 200, 250, "u|v:  a|b") + K.panel(430, 10, 200, 250, "u*:  a*");
      var o = { r: 16, s: 13 };
      s += K.state(62, 120, "", { r: 16, start: true }) + K.state(120, 120, "", o) + K.state(178, 120, "", { r: 16, final: true });
      s += ed(K, 62, 120, 120, 120, "a", { r1: 16, r2: 16 }) + ed(K, 120, 120, 178, 120, "b", { r1: 16, r2: 16 });
      s += K.state(280, 120, "", { start: true }) + K.state(370, 120, "", { final: true });
      s += ed(K, 280, 120, 370, 120, "a", { bend: 28 }) + ed(K, 280, 120, 370, 120, "b", { bend: -28 });
      s += K.state(530, 130, "", { start: true, final: true }) + lp(K, 530, 130, 90, "a");
      s += K.t(110, 195, "{ab}", "a", { s: 16, b: true }) + K.t(320, 195, "{a, b}", "a", { s: 16, b: true }) + K.t(530, 195, "{ε, a, aa, …}", "a", { s: 16, b: true });
      s += K.t(110, 228, "erst u, dann v", "s", { s: 12.5 }) + K.t(320, 228, "u oder v", "s", { s: 12.5 }) + K.t(530, 228, "0-mal oder öfter", "s", { s: 12.5 });
      return K.svg(640, 270, s);
    });

  add("rxstern", "Kleene-Stern a* = {ε, a, aa, aaa, …}",
    "Der Stern ist eine <b>Schleife</b>: Jede Runde hängt ein weiteres a an. Weil der Startzustand zugleich Endzustand ist, darf man auch <b>null Runden</b> drehen – deshalb gehört das leere Wort ε immer zu u*.",
    function(K){
      var s = K.panel(10, 10, 240, 250, "Automat zu a*") + K.panel(260, 10, 370, 250, "Wörter von a*");
      s += K.state(130, 150, "", { start: true, final: true }) + lp(K, 130, 150, 90, "a");
      s += K.t(130, 210, "Start = Endzustand", "s", { s: 12.5 }) + K.t(130, 232, "⇒ ε gehört dazu", "a", { s: 13, b: true });
      var sup = ["⁰", "¹", "²", "³"], rn = ["0 Runden", "1 Runde", "2 Runden", "3 Runden"];
      for(var n = 0; n < 4; n++){
        var y = 60 + n * 42;
        s += K.t(335, y, "a" + sup[n] + " =", "i", { a: "end", s: 15, b: true });
        if(n === 0) s += K.rect(347, y - 14, 28, 28, "m", { dash: "4 3", w: 1.5 }) + K.t(388, y, "ε", "m", { a: "start", s: 15, b: true });
        else { var arr = []; for(var k = 0; k < n; k++) arr.push("a"); s += cells(K, 361, y, arr, { cw: 32, w: 28, h: 28, fill: "fa" }); }
        s += K.t(480, y, rn[n], "s", { a: "start", s: 12.5 });
      }
      s += K.t(445, 235, "{ε, a, aa, aaa, …}", "a", { s: 15, b: true });
      return K.svg(640, 270, s);
    });

  add("rxplus", "u⁺ = u·u* – mindestens einmal",
    "Der einzige Unterschied zwischen a* und a⁺ ist das <b>leere Wort</b>. Bei a⁺ muss man erst einmal ein a lesen, bevor man im Endzustand ist – danach darf man in der Schleife beliebig weitermachen. Genau das sagt u⁺ = u·u*: <b>einmal Pflicht, dann beliebig oft</b>.",
    function(K){
      var s = K.panel(10, 10, 300, 260, "a* = {ε, a, aa, …}") + K.panel(330, 10, 300, 260, "a⁺ = a·a* = {a, aa, …}");
      s += K.state(160, 140, "", { start: true, final: true }) + lp(K, 160, 140, 90, "a");
      s += K.state(420, 140, "", { start: true }) + K.state(545, 140, "", { final: true }) + ed(K, 420, 140, 545, 140, "a") + lp(K, 545, 140, 90, "a");
      s += K.t(160, 205, "Start ist Ende ⇒ ε ∈ a*", "a", { s: 13, b: true }) + K.t(480, 205, "erst ein a nötig ⇒ ε ∉ a⁺", "m", { s: 13, b: true });
      s += K.f(160, 243, "a* = {ε} ∪ a⁺", "a") + K.f(480, 243, "a⁺ = a · a*", "m", { fill: "fm" });
      return K.svg(640, 280, s);
    });

  add("rxsigma", "(a|b)* = Σ* – und Präfix · Kern · Suffix",
    "Links: Eine Schleife, die <b>jedes Zeichen</b> erlaubt, beliebig oft – das sind alle Wörter, also Σ*. Rechts das Muster aus C.24: (0|1)* als <b>beliebiger Anfang</b>, dann der feste Kern 00, dann (0|1)* als <b>beliebiges Ende</b> – so beschreibt man „enthält 00 irgendwo“.",
    function(K){
      var s = K.panel(10, 10, 240, 270, "(a|b)* = Σ*") + K.panel(260, 10, 370, 270, "(0|1)* 00 (0|1)*");
      s += K.state(130, 140, "", { start: true, final: true }) + lp(K, 130, 140, 90, "a, b");
      s += K.t(130, 210, "jedes Zeichen, jede Länge", "s", { s: 12.5 }) + K.t(130, 232, "⇒ alle Wörter über {a, b}", "a", { s: 13, b: true });
      s += K.state(320, 140, "q₀", { start: true }) + K.state(445, 140, "q₁") + K.state(570, 140, "q₂", { final: true });
      s += lp(K, 320, 140, 90, "0, 1") + lp(K, 570, 140, 90, "0, 1") + ed(K, 320, 140, 445, 140, "0") + ed(K, 445, 140, 570, 140, "0");
      s += K.t(320, 200, "Präfix", "c4", { s: 13, b: true }) + K.t(445, 200, "Kern 00", "m", { s: 13, b: true }) + K.t(570, 200, "Suffix", "c4", { s: 13, b: true });
      s += K.t(445, 245, "„enthält mindestens zwei Nullen hintereinander“", "s", { s: 12.5 });
      return K.svg(640, 290, s);
    });

  add("rxnea", "Vom regulären Ausdruck zum NEA: a(a|b)*b",
    "Der Ausdruck aus Aufgabe C.25 zerfällt in drei Stücke, und jedes wird ein Teil des Automaten: <b>a</b> → erster Pfeil, <b>(a|b)*</b> → Schleife an q₁, <b>b</b> → letzter Pfeil. In q₁ gibt es bei b zwei Möglichkeiten – bleiben oder abschließen: Das ist der <b>Nichtdeterminismus</b>.",
    function(K){
      var s = K.f(320, 32, "a (a|b)* b", "a", { s: 17 });
      s += K.state(130, 150, "q₀", { start: true }) + K.state(320, 150, "q₁") + K.state(510, 150, "q₂", { final: true });
      s += ed(K, 130, 150, 320, 150, "a") + lp(K, 320, 150, 90, "a, b") + ed(K, 320, 150, 510, 150, "b", { c: "c3", lc: "c3" });
      s += K.t(200, 200, "Anfangs-a", "s", { s: 12.5 }) + K.t(320, 200, "(a|b)*: Schleife", "s", { s: 12.5 }) + K.t(440, 200, "Schluss-b", "s", { s: 12.5 });
      s += K.t(320, 240, "q₁ bei b: bleiben oder nach q₂ – Nichtdeterminismus", "c3", { s: 13, b: true });
      return K.svg(640, 260, s);
    });

  add("aequiv", "Fünf Beschreibungen – eine Sprachklasse",
    "Alle fünf Kästen beschreiben <b>dieselbe Sprache</b>: Wörter über {a, b}, die auf ab enden. Ob Automat, Grammatik oder Ausdruck – man kann jede Form in jede andere <b>umbauen</b> (Pfeile). Deshalb sagt man: Alle fünf definieren genau die <b>regulären Sprachen</b>.",
    function(K){
      var C = [320, 185], rx = 100, ry = 36, bw = 176, bh = 54;
      var B = [[320, 40, "DEA", "{q₀} · {q₀,q₁} · {q₀,q₂}"], [540, 115, "NEA", "q₀ –a→ q₁ –b→ q₂"], [440, 290, "NEA mit ε", "ε-Kanten erlaubt"], [200, 290, "reguläre Grammatik", "S → aS | bS | aA, A → b"], [100, 115, "regulärer Ausdruck", "(a|b)*ab"]];
      var s = "";
      B.forEach(function(b){
        var dx = b[0] - C[0], dy = b[1] - C[1];
        var te_ = 1 / Math.sqrt((dx / rx) * (dx / rx) + (dy / ry) * (dy / ry)), tb = 1 - Math.min(dx ? (bw / 2) / Math.abs(dx) : 9, dy ? (bh / 2) / Math.abs(dy) : 9);
        var x1 = C[0] + dx * (te_ + 0.03), y1 = C[1] + dy * (te_ + 0.03), x2 = C[0] + dx * (tb - 0.03), y2 = C[1] + dy * (tb - 0.03);
        s += K.arrow((x1 + x2) / 2, (y1 + y2) / 2, x2, y2, "s", { w: 1.4, head: 8 }) + K.arrow((x1 + x2) / 2, (y1 + y2) / 2, x1, y1, "s", { w: 1.4, head: 8 });
      });
      s += ell(K, C[0], C[1], rx, ry, "a", { fill: "fa", w: 2 });
      s += K.t(320, 175, "reguläre Sprache (Typ 3)", "a", { s: 13, b: true, halo: false }) + K.t(320, 197, "L = {a, b}* ab", "a", { s: 14, b: true, halo: false });
      B.forEach(function(b){
        s += K.rect(b[0] - bw / 2, b[1] - bh / 2, bw, bh, "c4", { fill: "p", rx: 6, w: 1.6 });
        s += K.t(b[0], b[1] - 11, b[2], "c4", { s: 13, b: true, halo: false }) + K.t(b[0], b[1] + 11, b[3], "i", { s: 12, halo: false });
      });
      return K.svg(640, 330, s);
    });
})();
