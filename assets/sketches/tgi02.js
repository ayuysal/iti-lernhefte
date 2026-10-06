/* Skizzen zu TGI02 – Algorithmen und Komplexität.
   Jede Skizze: t = Titel, c = Lesehilfe (HTML), svg = function(K) → SVG-String (K = window.SK). */
(function(){
  "use strict";
  var S = window.ITI_SKETCHES = window.ITI_SKETCHES || {};
  function add(id, t, c, f){ S["tgi02-" + id] = { t: t, c: c, svg: f }; }
  function lines(K, x, y, arr, c, o){ o = o || {}; var s = ""; for(var i = 0; i < arr.length; i++) s += K.t(x, y + i * (o.lh || 20), arr[i], c || "s", { a: o.a || "start", s: o.s || 13, b: o.b }); return s; }
  /* Zeile von Speicherzellen: Mitte der ersten Zelle bei x0, Abstand st. o: {c, cs (Farben je Index), fill, fs, w, h, s} */
  function row(K, x0, y, vals, st, o){
    o = o || {}; var s = "";
    for(var i = 0; i < vals.length; i++){
      var c = (o.cs && o.cs[i]) || o.c || "a", f = (o.fs && o.fs[i]) || o.fill || "p";
      s += K.cell(x0 + i * st, y, String(vals[i]), c, { w: o.w || st - 4, h: o.h || 28, fill: f, s: o.s || 14 });
    }
    return s;
  }
  /* Gruppe zusammenhängender Zellen, zentriert um cx */
  function grp(K, cx, y, vals, o){
    o = o || {}; var w = o.cw || 30, x0 = cx - (vals.length - 1) * w / 2;
    return row(K, x0, y, vals, w, { c: o.c, cs: o.cs, fill: o.fill, fs: o.fs, w: w, h: o.h || 26, s: o.s || 13 });
  }
  function rep(v, n){ var a = []; for(var i = 0; i < n; i++) a.push(v); return a; }

  /* ═════════ Kapitel 1: Höheres Sortieren ═════════ */

  add("quick", "QuickSort: Pivot wählen, partitionieren, rekursiv weiter",
    "Das Beispiel aus Übung C.10: Der <b>Pivot</b> (rot, immer das erste Element) teilt jede Liste in „kleiner“ (links) und „grösser-gleich“ (rechts). Danach steht der Pivot schon an seinem <b>endgültigen Platz</b> – nur die beiden Teillisten werden rekursiv weiterbehandelt, bis sie höchstens ein Element haben.",
    function(K){
      var s = "", P = { c: "m", fill: "fm" };
      s += grp(K, 320, 40, [5, 3, 8, 1, 9, 2], { cs: ["m"], fs: ["fm"] }) + K.t(470, 40, "Pivot = 5", "m", { a: "start", s: 13, b: true });
      s += K.line(300, 54, 190, 96, "f") + K.line(320, 54, 320, 96, "f") + K.line(340, 54, 450, 96, "f");
      s += grp(K, 190, 110, [3, 1, 2], { cs: ["m"], fs: ["fm"] }) + grp(K, 320, 110, [5], P) + grp(K, 450, 110, [8, 9], { cs: ["m"], fs: ["fm"] });
      s += K.t(190, 140, "< 5", "s", { s: 12 }) + K.t(450, 140, "≥ 5", "s", { s: 12 });
      s += K.line(176, 124, 120, 166, "f") + K.line(204, 124, 210, 166, "f") + K.line(440, 124, 440, 166, "f") + K.line(460, 124, 500, 166, "f");
      s += grp(K, 120, 180, [1, 2], { cs: ["m"], fs: ["fm"] }) + grp(K, 210, 180, [3], P) + grp(K, 440, 180, [8], P) + grp(K, 500, 180, [9]);
      s += K.line(110, 194, 90, 236, "f") + K.line(130, 194, 150, 236, "f");
      s += grp(K, 90, 250, [1], P) + grp(K, 150, 250, [2]);
      s += K.arrow(320, 128, 320, 286, "f", { w: 1.2, dash: "4 4", head: 8 }) + K.arrow(210, 198, 210, 286, "f", { w: 1.2, dash: "4 4", head: 8 }) + K.arrow(440, 198, 440, 286, "f", { w: 1.2, dash: "4 4", head: 8 });
      s += K.arrow(90, 268, 90, 286, "f", { w: 1.2, dash: "4 4", head: 8 }) + K.arrow(150, 268, 150, 286, "f", { w: 1.2, dash: "4 4", head: 8 }) + K.arrow(500, 198, 500, 286, "f", { w: 1.2, dash: "4 4", head: 8 });
      s += K.t(20, 302, "fertig:", "s", { a: "start", s: 13, b: true });
      [[90, 1], [150, 2], [210, 3], [320, 5], [440, 8], [500, 9]].forEach(function(q){ s += K.cell(q[0], 302, String(q[1]), "a", { w: 30, h: 26, fill: "fa", s: 13 }); });
      s += K.t(560, 250, "Pivot steht", "m", { s: 12.5, b: true }) + K.t(560, 268, "endgültig", "m", { s: 12.5, b: true });
      return K.svg(640, 325, s);
    });

  add("quickworst", "QuickSort Worst Case: sortierte Liste, Pivot = erstes Element",
    "<b>Links:</b> Ist die Liste schon sortiert und ist der Pivot immer das erste (= kleinste) Element, bleibt links nichts übrig – jede Ebene spaltet nur <b>ein Element</b> ab. Es gibt n Ebenen mit je bis zu n Vergleichen → <b>O(n²)</b>. <b>Rechts:</b> Trifft der Pivot jeweils die Mitte, halbiert sich die Liste – nur log₂ n Ebenen → O(n log n).",
    function(K){
      var s = K.panel(10, 10, 305, 320, "Pivot = Extremwert: n Ebenen", "m") + K.panel(325, 10, 305, 320, "Pivot = Mitte: log₂ n Ebenen", "a");
      for(var i = 0; i < 8; i++){
        var vals = []; for(var j = i + 1; j <= 8; j++) vals.push(j);
        var cs = ["m"], fs = ["fm"];
        s += row(K, 46 + i * 26, 50 + i * 30, vals, 26, { cs: cs, fs: fs, w: 24, h: 24, s: 12 });
      }
      s += K.t(150, 300, "8 Ebenen · je ≈ n Vergleiche", "m", { s: 12.5, b: true });
      var levels = [[[1, 8]], [[1, 4], [5, 8]], [[1, 2], [3, 4], [5, 6], [7, 8]], [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8]]];
      levels.forEach(function(L, d){
        L.forEach(function(seg){
          var vals = []; for(var v = seg[0]; v <= seg[1]; v++) vals.push(v);
          var gap = (seg[0] - 1) / (8 / Math.pow(2, d));
          s += row(K, 365 + (seg[0] - 1) * 28 + gap * 4, 60 + d * 52, vals, 28, { c: "a", w: 26, h: 24, s: 12 });
        });
      });
      s += K.t(477, 280, "4 Ebenen (log₂ 8 = 3 Teilungen)", "a", { s: 12.5, b: true }) + K.t(477, 300, "je n Vergleiche → O(n log n)", "a", { s: 12.5, b: true });
      return K.svg(640, 340, s);
    });

  add("merge", "MergeSort: halbieren bis Einzelelemente, dann sortiert zusammenführen",
    "Oben wird die Liste aus C.10 <b>so lange halbiert</b>, bis nur Einzelelemente übrig sind – die sind von selbst sortiert. Unten werden je zwei sortierte Teillisten zu einer sortierten Liste <b>gemergt</b>. Jede Ebene kostet höchstens n Vergleiche, es gibt etwa log₂ n Ebenen – deshalb <b>immer O(n log n)</b>, egal wie die Eingabe aussieht.",
    function(K){
      var X = [140, 210, 280, 360, 430, 500], s = "";
      function cx(idx){ var t = 0; idx.forEach(function(i){ t += X[i]; }); return t / idx.length; }
      function G(y, idx, vals, c, f){ return grp(K, cx(idx), y, vals, { c: c, fill: f, cw: 30, h: 24 }); }
      function L(i1, y1, i2, y2){ return K.line(cx(i1), y1 + 12, cx(i2), y2 - 12, "f", { w: 1.2 }); }
      var rows = [34, 80, 126, 172, 218, 264, 310];
      s += G(rows[0], [0, 1, 2, 3, 4, 5], [5, 3, 8, 1, 9, 2], "s");
      s += L([0, 1, 2, 3, 4, 5], rows[0], [0, 1, 2], rows[1]) + L([0, 1, 2, 3, 4, 5], rows[0], [3, 4, 5], rows[1]);
      s += G(rows[1], [0, 1, 2], [5, 3, 8], "s") + G(rows[1], [3, 4, 5], [1, 9, 2], "s");
      s += L([0, 1, 2], rows[1], [0], rows[2]) + L([0, 1, 2], rows[1], [1, 2], rows[2]) + L([3, 4, 5], rows[1], [3], rows[2]) + L([3, 4, 5], rows[1], [4, 5], rows[2]);
      s += G(rows[2], [0], [5], "s") + G(rows[2], [1, 2], [3, 8], "s") + G(rows[2], [3], [1], "s") + G(rows[2], [4, 5], [9, 2], "s");
      s += L([1, 2], rows[2], [1], rows[3]) + L([1, 2], rows[2], [2], rows[3]) + L([4, 5], rows[2], [4], rows[3]) + L([4, 5], rows[2], [5], rows[3]);
      [0, 3].forEach(function(i){ s += K.line(X[i], rows[2] + 12, X[i], rows[3] - 12, "f", { w: 1.2 }); });
      [5, 3, 8, 1, 9, 2].forEach(function(v, i){ s += K.cell(X[i], rows[3], String(v), "c4", { w: 30, h: 24, fill: "fm", s: 13 }); });
      s += L([1], rows[3], [1, 2], rows[4]) + L([2], rows[3], [1, 2], rows[4]) + L([4], rows[3], [4, 5], rows[4]) + L([5], rows[3], [4, 5], rows[4]);
      [0, 3].forEach(function(i){ s += K.line(X[i], rows[3] + 12, X[i], rows[4] - 12, "f", { w: 1.2 }); });
      s += G(rows[4], [0], [5], "a") + G(rows[4], [1, 2], [3, 8], "a") + G(rows[4], [3], [1], "a") + G(rows[4], [4, 5], [2, 9], "a");
      s += L([0], rows[4], [0, 1, 2], rows[5]) + L([1, 2], rows[4], [0, 1, 2], rows[5]) + L([3], rows[4], [3, 4, 5], rows[5]) + L([4, 5], rows[4], [3, 4, 5], rows[5]);
      s += G(rows[5], [0, 1, 2], [3, 5, 8], "a") + G(rows[5], [3, 4, 5], [1, 2, 9], "a");
      s += L([0, 1, 2], rows[5], [0, 1, 2, 3, 4, 5], rows[6]) + L([3, 4, 5], rows[5], [0, 1, 2, 3, 4, 5], rows[6]);
      s += G(rows[6], [0, 1, 2, 3, 4, 5], [1, 2, 3, 5, 8, 9], "a", "fa");
      s += K.arrow(40, 30, 40, 160, "s", { w: 2, head: 10 }) + K.t(54, 95, "teilen", "s", { a: "start", s: 13, b: true });
      s += K.arrow(40, 184, 40, 316, "a", { w: 2, head: 10 }) + K.t(54, 250, "mergen", "a", { a: "start", s: 13, b: true });
      s += K.t(600, 172, "Einzel-", "c4", { s: 12.5, b: true }) + K.t(600, 190, "elemente", "c4", { s: 12.5, b: true });
      return K.svg(640, 330, s);
    });

  add("mergeschritt", "Der Merge-Schritt: immer die beiden vordersten Elemente vergleichen",
    "Zwei <b>bereits sortierte</b> Teillisten liegen nebeneinander. Man vergleicht nur ihre <b>vordersten</b> Elemente, schreibt das kleinere in die Ausgabe und rückt in dieser Liste eins weiter. Gezeigt ist der Moment nach 1 und 2: Jetzt wird 3 mit 9 verglichen. Die Ausgabe braucht einen <b>eigenen Speicher</b> – daher ist MergeSort nicht in-situ.",
    function(K){
      var s = "";
      s += K.t(60, 50, "links", "s", { a: "start", s: 13, b: true }) + K.t(60, 120, "rechts", "s", { a: "start", s: 13, b: true });
      s += row(K, 160, 50, [3, 5, 8], 46, { cs: ["m", "a", "a"], fs: ["fm", "p", "p"] });
      s += row(K, 160, 120, [1, 2, 9], 46, { cs: ["f", "f", "m"], fs: ["p", "p", "fm"] });
      s += K.arrow(160, 18, 160, 34, "m", { w: 2, head: 9 }) + K.arrow(252, 152, 252, 136, "m", { w: 2, head: 9 });
      s += K.f(420, 85, "3 < 9 → 3 nach vorn", "m", { fill: "fm" });
      s += K.t(60, 220, "Ausgabe", "a", { a: "start", s: 13, b: true });
      s += row(K, 160, 220, [1, 2, "3", "", "", ""], 46, { cs: ["a", "a", "m", "f", "f", "f"], fs: ["fa", "fa", "fm", "p", "p", "p"] });
      s += K.arrow(340, 110, 260, 200, "m", { w: 1.8, head: 9, dash: "5 4" });
      s += lines(K, 60, 272, ["Vergleiche: 1 < 3, 2 < 3, 3 < 9, 5 < 9, 8 < 9 → Rest 9 anhängen",
        "= 5 Vergleiche für 6 Elemente (höchstens n − 1)"], "s", { s: 13 });
      return K.svg(640, 310, s);
    });

  add("heap", "Max-Heap: Baum und Array sind dasselbe",
    "Der Max-Heap aus Übung C.11 – links als <b>vollständiger Binärbaum</b>, rechts so, wie er im <b>Array</b> liegt (Ebene für Ebene von links nach rechts). Jeder Knoten ist ≥ seinen Kindern, also steht das <b>Maximum an der Wurzel</b>. Die Bögen zeigen die Rechenregel: Kinder von Index i liegen bei 2i+1 und 2i+2.",
    function(K){
      var s = "", P = [[170, 50], [95, 125], [245, 125], [55, 200], [135, 200], [215, 200]], V = [10, 5, 8, 4, 1, 3];
      [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]].forEach(function(e){ s += K.edge(P[e[0]][0], P[e[0]][1], P[e[1]][0], P[e[1]][1], { r1: 19, r2: 19, noarrow: true }); });
      P.forEach(function(p, i){ s += K.node(p[0], p[1], String(V[i]), i === 0 ? "m" : "a", { r: 19, fill: i === 0 ? "fm" : "p" }) + K.t(p[0] + 25, p[1] - 17, String(i), "f", { s: 12 }); });
      var xs = [], y = 110;
      for(var i = 0; i < 6; i++) xs.push(345 + i * 50);
      s += row(K, 345, y, V, 50, { cs: ["m"], fs: ["fm"] });
      xs.forEach(function(x, i){ s += K.t(x, y - 26, "i=" + i, "f", { s: 12 }); });
      var cols = ["a", "c3", "c4"];
      [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]].forEach(function(e){
        var x1 = xs[e[0]], x2 = xs[e[1]], h = 16 + (x2 - x1) * 0.28, c = cols[e[0]];
        s += K.path("M" + x1 + " " + (y + 16) + " Q" + (x1 + x2) / 2 + " " + (y + 16 + h * 2) + " " + (x2 - 3) + " " + (y + 18), c, { w: 1.8 }) + K.dot(x2 - 3, y + 18, c, 3);
      });
      s += K.t(470, 230, "Kinder von i:  2i+1 und 2i+2", "a", { s: 13.5, b: true });
      s += K.t(470, 254, "Eltern von i:  ⌊(i−1)/2⌋", "c4", { s: 13.5, b: true });
      s += K.f(320, 296, "Max-Heap: jeder Knoten ≥ seine Kinder", "a");
      return K.svg(640, 320, s);
    });

  add("heapify", "Durchsickern (Heapify): mit dem grösseren Kind tauschen",
    "Nach der Entnahme des Maximums (C.11) steht das letzte Blatt 3 an der Wurzel und verletzt die Heap-Eigenschaft. Es wird mit dem <b>grösseren</b> seiner Kinder getauscht (8, nicht 5) – sonst stünde 8 unter dem kleineren 5. An Index 2 hat die 3 keine Kinder mehr → <b>fertig</b>, wieder ein Max-Heap.",
    function(K){
      var s = K.panel(10, 10, 300, 280, "vorher: [3, 5, 8, 4, 1]", "m") + K.panel(330, 10, 300, 280, "nachher: [8, 5, 3, 4, 1]", "a");
      function tree(ox, V, hl, c2){
        var P = [[ox + 150, 70], [ox + 85, 145], [ox + 215, 145], [ox + 50, 220], [ox + 120, 220]], o = "";
        [[0, 1], [0, 2], [1, 3], [1, 4]].forEach(function(e){ o += K.edge(P[e[0]][0], P[e[0]][1], P[e[1]][0], P[e[1]][1], { r1: 19, r2: 19, noarrow: true }); });
        P.forEach(function(p, i){ var h = hl.indexOf(i) >= 0; o += K.node(p[0], p[1], String(V[i]), h ? c2 : "a", { r: 19, fill: h ? "fm" : "p" }); });
        return { s: o, P: P };
      }
      var A = tree(10, [3, 5, 8, 4, 1], [0, 2], "m");
      s += A.s;
      s += K.edge(A.P[0][0], A.P[0][1], A.P[2][0], A.P[2][1], { bend: -26, r1: 22, r2: 22, c: "m", w: 2.2 });
      s += K.edge(A.P[2][0], A.P[2][1], A.P[0][0], A.P[0][1], { bend: -26, r1: 22, r2: 22, c: "m", w: 2.2 });
      s += K.t(270, 70, "3 < 8", "m", { s: 13, b: true }) + K.t(55, 70, "5 < 8", "s", { s: 12.5 });
      s += K.t(160, 268, "grösseres Kind = 8 → tauschen", "m", { s: 12.5, b: true });
      var B = tree(330, [8, 5, 3, 4, 1], [0, 2], "a");
      s += B.s + K.t(B.P[2][0], B.P[2][1] + 42, "Index 2: keine Kinder", "s", { s: 12 }) + K.t(480, 268, "8 ≥ 5, 8 ≥ 3, 5 ≥ 4, 5 ≥ 1 ✓", "a", { s: 12.5, b: true });
      return K.svg(640, 300, s);
    });

  add("heapsort", "HeapSort: Maximum ans Ende tauschen, Rest durchsickern",
    "Jede Zeile ist das Array. Das Maximum steht immer vorn an der Wurzel; es wird mit dem <b>letzten Heap-Element getauscht</b> und gehört ab dann zum <b>sortierten Teil</b> (rot, rechts). Der verkleinerte Heap wird durch Durchsickern repariert. Jede Runde kostet höchstens log₂ n Tauschschritte, n Runden → <b>O(n log n)</b>, ohne Zusatzspeicher.",
    function(K){
      var s = "", R = [
        ["Max-Heap (C.11)", [10, 5, 8, 4, 1, 3], 0],
        ["Wurzel ↔ letztes", [3, 5, 8, 4, 1, 10], 1],
        ["durchsickern", [8, 5, 3, 4, 1, 10], 1],
        ["Wurzel ↔ letztes", [1, 5, 3, 4, 8, 10], 2],
        ["durchsickern", [5, 4, 3, 1, 8, 10], 2],
        ["… bis fertig", [1, 3, 4, 5, 8, 10], 6]];
      R.forEach(function(r, k){
        var y = 36 + k * 48, n = r[2], cs = [], fs = [];
        for(var i = 0; i < 6; i++){ var srt = i >= 6 - n; cs.push(srt ? "m" : "a"); fs.push(srt ? "fm" : "p"); }
        if(k === 0 || k === 2 || k === 4){ cs[0] = "c4"; fs[0] = "fa"; }
        s += K.t(30, y, r[0], "s", { a: "start", s: 13, b: k % 2 === 1 }) + row(K, 250, y, r[1], 50, { cs: cs, fs: fs, w: 44 });
        if(k === 1 || k === 3){
          var last = 5 - (n - 1);
          s += K.path("M250 " + (y - 16) + " Q" + (250 + last * 50) / 2 + " " + (y - 36) + " " + (250 + last * 50) + " " + (y - 16), "m", { w: 1.6, dash: "4 3" });
        }
      });
      s += K.t(560, 300, "sortiert", "m", { s: 12.5, b: true });
      return K.svg(640, 320, s);
    });

  add("radix", "RadixSort: nach Ziffern in Boxen verteilen und einsammeln",
    "Kein einziger Vergleich zweier Zahlen! <b>1. Lauf:</b> Jede Zahl landet in der Box ihrer <b>Einerziffer</b>, dann wird von Box 0 bis 9 eingesammelt. <b>2. Lauf:</b> dasselbe mit der <b>Zehnerziffer</b>. Weil das Einsammeln die Reihenfolge innerhalb einer Box behält (32 vor 38), ist die Liste danach sortiert. Aufwand: Stellenzahl × n → O(n).",
    function(K){
      var s = K.panel(10, 10, 305, 310, "1. Lauf: Einerziffer", "a") + K.panel(325, 10, 305, 310, "2. Lauf: Zehnerziffer", "c4");
      function pass(ox, input, digit, c, f){
        var o = row(K, ox + 32, 52, input, 48, { c: "s", w: 42, h: 24, s: 13 }), boxes = [];
        for(var b = 0; b < 10; b++) boxes.push([]);
        input.forEach(function(v){ boxes[digit(v)].push(v); });
        var out = [];
        for(var d = 0; d < 10; d++){
          var bx = ox + 18 + d * 28.5;
          o += K.rect(bx - 12, 98, 24, 86, "r", { fill: "p", rx: 2 }) + K.t(bx, 196, String(d), "f", { s: 12, b: true });
          boxes[d].forEach(function(v, j){ o += K.t(bx, 168 - j * 26, String(v), c, { s: 12, b: true }); out.push(v); });
        }
        o += K.arrow(ox + 150, 210, ox + 150, 238, "s", { w: 1.6, head: 8 }) + K.t(ox + 162, 224, "einsammeln (Box 0 → 9)", "s", { a: "start", s: 12 });
        o += row(K, ox + 32, 262, out, 48, { c: c, fill: f, w: 42, h: 24, s: 13 });
        return { s: o, out: out };
      }
      var p1 = pass(10, [53, 12, 38, 41, 25, 32], function(v){ return v % 10; }, "a", "p");
      s += p1.s;
      var p2 = pass(325, p1.out, function(v){ return Math.floor(v / 10); }, "c4", "fa");
      s += p2.s + K.t(470, 298, "sortiert ✓", "c4", { s: 13, b: true }) + K.t(155, 298, "nach Einern geordnet", "a", { s: 12.5 });
      return K.svg(640, 330, s);
    });

  add("stabil", "Stabil und in-situ – was die Tabellenspalten bedeuten",
    "<b>Stabil (links):</b> Gleiche Schlüssel behalten ihre <b>ursprüngliche Reihenfolge</b> – die blaue 3 stand vor der orangen und bleibt davor. Ein instabiles Verfahren darf sie vertauschen. <b>In-situ (rechts):</b> sortiert durch Tauschen <b>im Array selbst</b> (QuickSort, HeapSort); MergeSort und RadixSort brauchen einen zweiten Speicherbereich.",
    function(K){
      var s = K.panel(10, 10, 300, 300, "stabil vs. instabil", "a") + K.panel(330, 10, 300, 300, "in-situ vs. extra Speicher", "c4");
      function three(x, y, vals, cols, fills){ return row(K, x, y, vals, 50, { cs: cols, fs: fills, w: 42 }); }
      s += K.t(40, 60, "vorher", "s", { a: "start", s: 12.5, b: true });
      s += three(85, 90, ["3₁", "1", "3₂", "2"], ["a", "s", "c3", "s"], ["fa", "p", "fm", "p"]);
      s += K.t(40, 140, "stabil", "a", { a: "start", s: 12.5, b: true });
      s += three(85, 170, ["1", "2", "3₁", "3₂"], ["s", "s", "a", "c3"], ["p", "p", "fa", "fm"]) + K.t(285, 170, "✓", "a", { s: 16, b: true });
      s += K.t(40, 220, "instabil", "m", { a: "start", s: 12.5, b: true });
      s += three(85, 250, ["1", "2", "3₂", "3₁"], ["s", "s", "c3", "a"], ["p", "p", "fm", "fa"]) + K.t(285, 250, "✗", "m", { s: 16, b: true });
      s += K.t(360, 60, "in-situ: tauschen im Array", "c4", { a: "start", s: 12.5, b: true });
      s += row(K, 385, 100, [5, 3, 8, 1, 9], 48, { c: "c4", w: 40 });
      s += K.path("M385 82 Q457 52 529 82", "c4", { w: 1.8 }) + K.dot(529, 82, "c4", 3) + K.path("M529 118 Q457 148 385 118", "c4", { w: 1.8 }) + K.dot(385, 118, "c4", 3);
      s += K.t(360, 180, "extra Speicher (MergeSort)", "m", { a: "start", s: 12.5, b: true });
      s += row(K, 385, 215, [3, 5, 8, 1, 9], 48, { c: "s", w: 40 }) + row(K, 385, 270, [1, 3, "", "", ""], 48, { c: "m", w: 40, fill: "fm" });
      s += K.arrow(457, 231, 457, 254, "m", { w: 1.6, head: 8 }) + K.t(481, 297, "+ O(n) Zusatzspeicher", "m", { s: 12, b: true });
      return K.svg(640, 320, s);
    });

  add("einfach", "Einfache Verfahren aus TGI01: ein Durchlauf im Vergleich",
    "<b>BubbleSort</b> vertauscht benachbarte Paare – das Maximum „blubbert“ ans Ende. <b>SelectionSort</b> sucht das Minimum und tauscht es nach vorn – immer volle Suche, daher auch im besten Fall O(n²). <b>InsertionSort</b> schiebt das nächste Element in den schon sortierten Anfang. Bubble und Insertion merken bei sortierter Eingabe sofort, dass nichts zu tun ist → <b>Best Case O(n)</b>.",
    function(K){
      var s = K.panel(10, 10, 200, 290, "BubbleSort", "a") + K.panel(220, 10, 200, 290, "SelectionSort", "c4") + K.panel(430, 10, 200, 290, "InsertionSort", "c3");
      function r4(x, y, v, cs, fs){ return row(K, x, y, v, 42, { cs: cs, fs: fs, w: 36, h: 28 }); }
      s += r4(47, 70, [5, 3, 8, 1], ["a", "a", "s", "s"]) + K.path("M47 52 Q68 36 89 52", "a", { w: 1.6 });
      s += K.t(110, 106, "5↔3, 5<8, 8↔1", "s", { s: 12 });
      s += r4(47, 145, [3, 5, 1, 8], ["s", "s", "s", "m"], ["p", "p", "p", "fm"]);
      s += K.t(110, 185, "Maximum am Ende", "m", { s: 12, b: true });
      s += r4(257, 70, [5, 3, 8, 1], ["c4", "s", "s", "m"], ["p", "p", "p", "fm"]) + K.path("M257 52 Q320 26 383 52", "c4", { w: 1.6 });
      s += K.t(320, 106, "Minimum 1 ↔ vorn", "s", { s: 12 });
      s += r4(257, 145, [1, 3, 8, 5], ["m", "s", "s", "s"], ["fm", "p", "p", "p"]);
      s += K.t(320, 185, "Minimum vorn", "m", { s: 12, b: true });
      s += r4(467, 70, [3, 5, 8, 1], ["c3", "c3", "c3", "m"], ["fa", "fa", "fa", "fm"]);
      s += K.t(530, 106, "1 einfügen, Rest rückt", "s", { s: 12 });
      s += r4(467, 145, [1, 3, 5, 8], ["m", "c3", "c3", "c3"], ["fm", "fa", "fa", "fa"]);
      s += K.t(530, 185, "sortierter Anfang wächst", "m", { s: 12, b: true });
      s += K.t(110, 230, "Best O(n)", "a", { s: 13, b: true }) + K.t(110, 252, "Worst O(n²)", "s", { s: 13 }) + K.t(110, 274, "stabil, in-situ", "s", { s: 12 });
      s += K.t(320, 230, "Best O(n²)", "m", { s: 13, b: true }) + K.t(320, 252, "Worst O(n²)", "s", { s: 13 }) + K.t(320, 274, "instabil, in-situ", "s", { s: 12 });
      s += K.t(530, 230, "Best O(n)", "a", { s: 13, b: true }) + K.t(530, 252, "Worst O(n²)", "s", { s: 13 }) + K.t(530, 274, "stabil, in-situ", "s", { s: 12 });
      return K.svg(640, 310, s);
    });

  /* ═════════ Kapitel 2: Auswählen ═════════ */

  add("minmax", "Min-Max-Auswahl mit Paaren: ⌈3n/2⌉ − 2 Vergleiche",
    "Erst wird <b>innerhalb jedes Paares</b> verglichen (4 Vergleiche). Das Minimum kann nur unter den <b>Kleineren</b> sein, das Maximum nur unter den <b>Grösseren</b> – jede Gruppe hat nur noch n/2 Kandidaten und braucht n/2 − 1 Vergleiche. Für n = 8: 4 + 3 + 3 = <b>10</b> statt 2·8 − 2 = 14 bei getrennter Suche.",
    function(K){
      var s = "", V = [[4, 7], [1, 9], [3, 6], [8, 2]], xs = [130, 265, 400, 535];
      s += K.t(20, 40, "Paare", "s", { a: "start", s: 13, b: true });
      V.forEach(function(p, k){
        s += K.rect(xs[k] - 50, 22, 100, 36, "r", { fill: "p", rx: 6, dash: "4 3" });
        s += K.cell(xs[k] - 22, 40, String(p[0]), "s", { w: 34, h: 26 }) + K.cell(xs[k] + 22, 40, String(p[1]), "s", { w: 34, h: 26 });
        var lo = Math.min(p[0], p[1]), hi = Math.max(p[0], p[1]);
        s += K.arrow(xs[k] - 10, 60, xs[k] - 30, 112, "a", { w: 1.6, head: 8 }) + K.arrow(xs[k] + 10, 60, xs[k] + 30, 192, "m", { w: 1.6, head: 8 });
        s += K.cell(xs[k] - 30, 130, String(lo), "a", { w: 34, h: 26, fill: "fa" }) + K.cell(xs[k] + 30, 210, String(hi), "m", { w: 34, h: 26, fill: "fm" });
      });
      s += K.t(20, 130, "kleinere", "a", { a: "start", s: 13, b: true }) + K.t(20, 210, "grössere", "m", { a: "start", s: 13, b: true });
      for(var k = 0; k < 3; k++){
        s += K.arrow(xs[k] - 11, 130, xs[k + 1] - 51, 130, "a", { w: 1.4, head: 8, dash: "4 3" });
        s += K.arrow(xs[k] + 49, 210, xs[k + 1] + 9, 210, "m", { w: 1.4, head: 8, dash: "4 3" });
      }
      s += K.t(505, 162, "Min = 1", "a", { s: 13.5, b: true }) + K.t(565, 242, "Max = 9", "m", { s: 13.5, b: true });
      s += K.f(320, 290, "4 (Paare) + 3 (Min) + 3 (Max) = 10 = ⌈3·8/2⌉ − 2", "a");
      return K.svg(640, 315, s);
    });

  add("quickselect", "QuickSelection: nur in einer Teilliste weitersuchen",
    "Gesucht ist das <b>k-kleinste</b> Element, hier k = 2 in [5, 3, 8, 1, 9, 2]. Nach jeder Partitionierung weiss man, auf welcher Seite des Pivots Rang 2 liegt – die <b>andere Seite wird verworfen</b> (blass). Statt n + n + n … wie beim Sortieren fällt im Mittel nur n + n/2 + n/4 + … ≈ 2n Arbeit an → <b>linear</b>.",
    function(K){
      var s = "", F = { c: "f" }, P = { c: "m", fill: "fm" };
      s += grp(K, 230, 45, [5, 3, 8, 1, 9, 2], { cs: ["m"], fs: ["fm"] }) + K.t(390, 45, "Pivot 5 hat Rang 4 > 2 → links", "s", { a: "start", s: 13 });
      s += K.line(200, 58, 130, 98, "f") + K.line(250, 58, 300, 98, "f");
      s += grp(K, 130, 112, [3, 1, 2], { cs: ["m"], fs: ["fm"] }) + grp(K, 225, 112, [5], F) + grp(K, 300, 112, [8, 9], F) + K.t(300, 138, "verworfen", "f", { s: 12 });
      s += K.t(390, 112, "Pivot 3 hat Rang 3 > 2 → links", "s", { a: "start", s: 13 });
      s += K.line(120, 125, 100, 166, "f");
      s += grp(K, 100, 180, [1, 2], { cs: ["m"], fs: ["fm"] }) + grp(K, 170, 180, [3], F) + K.t(390, 180, "Pivot 1 hat Rang 1 < 2 → rechts", "s", { a: "start", s: 13 });
      s += K.line(110, 193, 150, 234, "f");
      s += grp(K, 85, 248, [1], F) + grp(K, 150, 248, [2], P) + K.t(390, 248, "Rang 2 gefunden: 2", "m", { a: "start", s: 13.5, b: true });
      s += K.f(320, 298, "Aufwand ≈ n + n/2 + n/4 + … ≈ 2n  →  O(n) im Mittel", "a");
      return K.svg(640, 320, s);
    });

  add("selbst", "Sich selbst anordnende Listen",
    "<b>Move-to-Front (links):</b> Das gerade gesuchte D springt sofort an den Anfang – wer oft gefragt wird, steht bald vorn und ist schnell gefunden. <b>Zähler (rechts):</b> Jeder Zugriff erhöht den Zähler; die Liste bleibt <b>absteigend nach Häufigkeit</b> sortiert, D (jetzt 3) rückt deshalb nur vor C (2).",
    function(K){
      var s = K.panel(10, 10, 300, 270, "Move-to-Front", "a") + K.panel(330, 10, 300, 270, "Zugriffshäufigkeitszähler", "c4");
      s += K.t(40, 58, "Zugriff auf D", "s", { a: "start", s: 13 });
      s += row(K, 60, 100, ["A", "B", "C", "D", "E"], 50, { cs: ["a", "a", "a", "m", "a"], fs: ["p", "p", "p", "fm", "p"], w: 40 });
      s += K.path("M210 120 Q135 175 64 186", "m", { w: 2 }) + K.dot(64, 186, "m", 3.5);
      s += row(K, 60, 210, ["D", "A", "B", "C", "E"], 50, { cs: ["m", "a", "a", "a", "a"], fs: ["fm", "p", "p", "p", "p"], w: 40 });
      s += K.t(160, 255, "D jetzt vorn", "m", { s: 12.5, b: true });
      s += K.t(360, 58, "Zugriff auf D: Zähler 2 → 3", "s", { a: "start", s: 13 });
      s += row(K, 380, 100, ["A", "B", "C", "D", "E"], 50, { cs: ["c4", "c4", "c4", "m", "c4"], fs: ["p", "p", "p", "fm", "p"], w: 40 });
      [5, 4, 2, 2, 1].forEach(function(v, i){ s += K.t(380 + i * 50, 130, String(v), "s", { s: 12 }); });
      s += K.path("M530 140 Q505 185 482 190", "m", { w: 2 }) + K.dot(482, 190, "m", 3.5);
      s += row(K, 380, 210, ["A", "B", "D", "C", "E"], 50, { cs: ["c4", "c4", "m", "c4", "c4"], fs: ["p", "p", "fm", "p", "p"], w: 40 });
      [5, 4, 3, 2, 1].forEach(function(v, i){ s += K.t(380 + i * 50, 240, String(v), i === 2 ? "m" : "s", { s: 12, b: i === 2 }); });
      s += K.t(480, 264, "absteigend nach Zähler", "c4", { s: 12.5, b: true });
      return K.svg(640, 290, s);
    });

  /* ═════════ Kapitel 3: Hashing ═════════ */

  add("hashfkt", "Hashfunktion: Schlüssel → Speicheradresse",
    "Die Hashfunktion rechnet aus dem Schlüssel <b>direkt die Adresse</b> aus – ohne Suchen, deshalb im Idealfall O(1). Hier die Werte aus C.12 mit h(k) = k mod 7. Weil 19, 26 und 33 alle Rest 5 lassen, wollen drei Schlüssel auf denselben Platz: eine <b>Kollision</b>.",
    function(K){
      var s = "", keys = [19, 26, 13, 33], ty = function(i){ return 48 + i * 38; };
      s += K.t(200, 22, "Schlüssel k", "s", { s: 13, b: true }) + K.t(530, 22, "Tabelle (m = 7)", "s", { s: 13, b: true });
      for(var i = 0; i < 7; i++) s += K.cell(530, ty(i), "", i === 5 ? "m" : "a", { w: 60, h: 34, fill: i === 5 ? "fm" : "p" }) + K.t(486, ty(i), String(i), "f", { s: 12, b: true, a: "end" });
      keys.forEach(function(k, j){
        var y = 80 + j * 60, d = k % 7, c = d === 5 ? "m" : "a";
        s += K.cell(200, y, String(k), "s", { w: 46, h: 30 });
        s += K.arrow(224, y, 498, ty(d), c, { w: 1.6, head: 9 });
        s += K.t(30, y, k + " mod 7 = " + d, c, { a: "start", s: 12.5, b: true });
      });
      s += K.t(600, ty(5), "← 3×", "m", { a: "start", s: 13, b: true });
      s += K.f(270, 318, "h(k) = k mod 7", "a");
      return K.svg(640, 340, s);
    });

  add("division", "Divisionsrestverfahren: warum m eine Primzahl sein sollte",
    "Die Schlüssel 0, 4, 8, …, 28 haben alle den <b>gemeinsamen Faktor 4</b>. Mit m = 8 (auch durch 4 teilbar) landen sie nur auf den Plätzen 0 und 4 – sechs Plätze bleiben leer, Kollisionen häufen sich. Mit der <b>Primzahl m = 7</b> verteilen sich dieselben Schlüssel über alle Plätze.",
    function(K){
      var s = K.panel(10, 10, 300, 290, "m = 8: k mod 8", "m") + K.panel(330, 10, 300, 290, "m = 7 (Primzahl): k mod 7", "a");
      var keys = [0, 4, 8, 12, 16, 20, 24, 28];
      function hist(ox, m, c, f){
        var cnt = []; for(var i = 0; i < m; i++) cnt.push([]);
        keys.forEach(function(k){ cnt[k % m].push(k); });
        var o = K.line(ox + 20, 240, ox + 280, 240, "s", { w: 1.3 }), st = 260 / m;
        cnt.forEach(function(L, i){
          var x = ox + 20 + st * (i + 0.5);
          o += K.t(x, 256, String(i), "f", { s: 12, b: true });
          L.forEach(function(k, j){ o += K.cell(x, 226 - j * 24, String(k), c, { w: st - 6, h: 22, fill: f, s: 12 }); });
        });
        return o;
      }
      s += hist(10, 8, "m", "fm") + hist(330, 7, "a", "fa");
      s += K.t(160, 280, "nur 2 von 8 Plätzen belegt", "m", { s: 12.5, b: true }) + K.t(480, 280, "alle 7 Plätze genutzt", "a", { s: 12.5, b: true });
      s += K.t(160, 50, "Schlüssel 0, 4, 8, …, 28", "s", { s: 12.5 }) + K.t(480, 50, "Schlüssel 0, 4, 8, …, 28", "s", { s: 12.5 });
      return K.svg(640, 310, s);
    });

  add("mult", "Multiplikationsmethode: Nachkommaanteil auf m Fächer strecken",
    "k·A wird berechnet, aber nur der <b>Nachkommaanteil</b> (k·A mod 1) zählt – eine Zahl zwischen 0 und 1. Diese Strecke wird in <b>m gleiche Fächer</b> geteilt; das Fach, in das der Wert fällt, ist die Adresse. Beispiel mit A = 0,618 und m = 8.",
    function(K){
      var s = "", x0 = 60, x1 = 580, y = 150, w = (x1 - x0) / 8;
      for(var i = 0; i < 8; i++){
        s += K.rect(x0 + i * w, y - 20, w, 40, "r", { fill: i === 5 ? "fa" : i === 3 ? "fm" : "p", rx: 0 });
        s += K.t(x0 + (i + 0.5) * w, y, String(i), i === 5 ? "a" : i === 3 ? "m" : "f", { s: 14, b: true, halo: false });
      }
      s += K.t(x0, y + 36, "0", "s", { s: 13 }) + K.t(x1, y + 36, "1", "s", { s: 13 });
      var p1 = x0 + 0.742 * (x1 - x0), p2 = x0 + 0.394 * (x1 - x0);
      s += K.arrow(p1, 80, p1, y - 22, "a", { w: 2, head: 9 }) + K.arrow(p2, 220, p2, y + 22, "m", { w: 2, head: 9 });
      s += K.t(p1, 64, "0,742", "a", { s: 13, b: true }) + K.t(p2, 236, "0,394", "m", { s: 13, b: true });
      s += K.t(40, 28, "k = 19:  19 · 0,618 = 11,742 → 0,742 → 8 · 0,742 = 5,94 → h = 5", "a", { a: "start", s: 13, b: true });
      s += K.t(40, 276, "k = 33:  33 · 0,618 = 20,394 → 0,394 → 8 · 0,394 = 3,15 → h = 3", "m", { a: "start", s: 13, b: true });
      s += K.f(320, 312, "h(k) = ⌊m · (k·A mod 1)⌋", "a");
      return K.svg(640, 335, s);
    });

  add("chaining", "Chaining: kollidierende Schlüssel hängen in einer Liste",
    "Jeder Tabellenplatz ist der <b>Anfang einer verketteten Liste</b>. Kollidiert ein Schlüssel, wird er einfach angehängt – die Tabelle läuft nie über. Ergebnis von C.12 (a): Platz 5 trägt die Kette 19 → 26 → 33, Platz 6 die 13. Suchen heisst: Platz berechnen, dann die Kette entlanggehen.",
    function(K){
      var s = "", ty = function(i){ return 40 + i * 40; };
      for(var i = 0; i < 7; i++) s += K.cell(110, ty(i), "", "a", { w: 50, h: 36 }) + K.t(70, ty(i), String(i), "f", { s: 13, b: true });
      s += K.t(110, 14, "Tabelle", "s", { s: 12.5, b: true });
      function chain(slot, vals, c){
        var o = "", y = ty(slot), x = 110;
        o += K.dot(110, y, c, 4);
        vals.forEach(function(v, j){
          var cx = 230 + j * 120;
          o += K.arrow(x + (j ? 22 : 0), y, cx - 32, y, c, { w: 1.8, head: 9 });
          o += K.cell(cx - 8, y, String(v), c, { w: 48, h: 30, fill: j ? "fm" : "fa" }) + K.cell(cx + 24, y, "", c, { w: 16, h: 30 });
          x = cx + 2;
        });
        o += K.t(x + 40, y, "∅", "f", { s: 14 });
        return o;
      }
      s += chain(5, [19, 26, 33], "m") + chain(6, [13], "a");
      s += K.t(410, 206, "Kollisionen", "m", { s: 12.5, b: true });
      s += K.t(330, 110, "Einfügen: h(k) berechnen, an die Liste hängen", "s", { s: 13 });
      return K.svg(640, 320, s);
    });

  add("sondieren", "Lineares Sondieren: so lange weiterzählen, bis ein Platz frei ist",
    "Offenes Verfahren mit den Werten aus C.12 in der angegebenen Reihenfolge 19, 26, 13, 33. Jede Zeile zeigt die Tabelle nach einem Einfügen. Ist h(k) belegt, wird <b>Platz für Platz</b> weitergezählt (nach 6 geht es <b>bei 0 weiter</b>, mod 7). 13 hätte eigentlich Platz 6 – den hat aber schon die 26 „gestohlen“.",
    function(K){
      var s = "", X = function(i){ return 230 + i * 52; };
      for(var i = 0; i < 7; i++) s += K.t(X(i), 24, String(i), "f", { s: 12, b: true });
      var steps = [[19, 5, [5]], [26, 5, [5, 6]], [13, 6, [6, 0]], [33, 5, [5, 6, 0, 1]]];
      var tab = [null, null, null, null, null, null, null];
      steps.forEach(function(st, r){
        var y = 60 + r * 66, path = st[2], fin = path[path.length - 1];
        tab[fin] = st[0];
        s += K.t(30, y, st[0] + ":  h = " + st[1], "s", { a: "start", s: 13, b: true }) + K.t(30, y + 20, (path.length - 1) + "× belegt", path.length > 1 ? "m" : "f", { a: "start", s: 12 });
        for(var i = 0; i < 7; i++){
          var isNew = i === fin, v = tab[i] === null ? "" : String(tab[i]);
          s += K.cell(X(i), y, v, isNew ? "a" : "s", { w: 44, h: 30, fill: isNew ? "fa" : "p" });
        }
        for(var k = 0; k < path.length - 1; k++){
          var a = path[k], b = path[k + 1];
          s += K.t(X(a) + 14, y - 6, "×", "m", { s: 12, b: true });
          if(b > a) s += K.path("M" + (X(a) + 6) + " " + (y + 16) + " Q" + (X(a) + X(b)) / 2 + " " + (y + 30) + " " + (X(b) - 6) + " " + (y + 17), "m", { w: 1.6 }) + K.dot(X(b) - 6, y + 17, "m", 3);
          else s += K.path("M" + (X(a) + 4) + " " + (y + 16) + " L" + (X(a) + 4) + " " + (y + 32) + " L" + (X(b) - 4) + " " + (y + 32) + " L" + (X(b) - 4) + " " + (y + 17), "m", { w: 1.4, dash: "4 3" }) + K.dot(X(b) - 4, y + 17, "m", 3);
        }
      });
      s += K.t(386, 314, "Ergebnis: 0 = 13, 1 = 33, 5 = 19, 6 = 26", "a", { s: 13, b: true });
      return K.svg(640, 330, s);
    });

  add("reihenfolge", "Prüfungsfalle: Die Einfügereihenfolge verändert die Tabelle",
    "Dieselben vier Schlüssel, dieselbe Hashfunktion k mod 7, lineares Sondieren – nur die <b>Reihenfolge</b> ist anders. Wer zuerst kommt, bekommt seinen Wunschplatz: Links holt sich die 26 Platz 6, rechts die 13. Deshalb Aufgaben immer <b>strikt in der angegebenen Reihenfolge</b> abarbeiten.",
    function(K){
      var s = K.panel(10, 10, 300, 250, "Reihenfolge 19, 26, 13, 33", "a") + K.panel(330, 10, 300, 250, "Reihenfolge 19, 13, 26, 33", "c4");
      function tab(ox, vals, c, f){
        var o = "";
        for(var i = 0; i < 7; i++){
          o += K.t(ox + 34 + i * 39, 70, String(i), "f", { s: 12, b: true });
          o += K.cell(ox + 34 + i * 39, 100, vals[i] === null ? "" : String(vals[i]), vals[i] === null ? "f" : c, { w: 35, h: 32, fill: vals[i] === null ? "p" : f, s: 13 });
        }
        return o;
      }
      s += tab(10, [13, 33, null, null, null, 19, 26], "a", "fa") + tab(330, [26, 33, null, null, null, 19, 13], "c4", "fa");
      s += lines(K, 30, 150, ["19 → 5", "26 → 5 belegt → 6", "13 → 6 belegt → 0", "33 → 5, 6, 0 belegt → 1"], "s", { s: 12, lh: 22 });
      s += lines(K, 350, 150, ["19 → 5", "13 → 6", "26 → 5, 6 belegt → 0", "33 → 5, 6, 0 belegt → 1"], "s", { s: 12, lh: 22 });
      s += K.f(320, 290, "Platz 0 und 6: 13/26 vertauscht!", "m", { fill: "fm" });
      return K.svg(640, 310, s);
    });

  add("quadr", "Lineares vs. quadratisches Sondieren",
    "Die Tabelle (m = 7) als Ring, Start bei h(k) = 5. <b>Linear</b> geht in Einzelschritten weiter (5, 6, 0, 1) – belegte Plätze bilden dadurch lange zusammenhängende Blöcke. <b>Quadratisch</b> springt h(k) + i²: +1, +4, +9 (5, 6, 2, 0) – die Abstände wachsen (1, 3, 5), Kollisionen verteilen sich breiter.",
    function(K){
      var s = K.panel(10, 10, 300, 300, "linear: h(k) + i", "a") + K.panel(330, 10, 300, 300, "quadratisch: h(k) + i²", "c4");
      function ring(cx, cy, seq, c, lab){
        var o = K.circ(cx, cy, 95, "r", { w: 1 }), P = [];
        for(var i = 0; i < 7; i++){ var a = (90 - i * 360 / 7) * Math.PI / 180; P.push([cx + 95 * Math.cos(a), cy - 95 * Math.sin(a)]); }
        P.forEach(function(p, i){ var on = seq.indexOf(i); o += K.node(p[0], p[1], String(i), on >= 0 ? c : "f", { r: 17, fill: on === 0 ? "fm" : "p" }); });
        for(var k = 0; k < seq.length - 1; k++){
          var A = P[seq[k]], B = P[seq[k + 1]];
          o += K.edge(A[0], A[1], B[0], B[1], { r1: 18, r2: 18, c: c, w: 2 });
          var mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, dl = Math.sqrt((cx - mx) * (cx - mx) + (cy - my) * (cy - my)) || 1;
          o += K.t(mx + (cx - mx) / dl * 20, my + (cy - my) / dl * 20, lab[k], c, { s: 12.5, b: true });
        }
        return o;
      }
      s += ring(160, 168, [5, 6, 0, 1], "a", ["+1", "+1", "+1"]) + ring(480, 168, [5, 6, 2, 0], "c4", ["+1", "+3", "+5"]);
      s += K.t(160, 294, "Folge 5, 6, 0, 1", "a", { s: 13, b: true }) + K.t(480, 294, "5+0, 5+1, 5+4, 5+9 → 5, 6, 2, 0", "c4", { s: 12.5, b: true });
      return K.svg(640, 320, s);
    });

  /* ═════════ Kapitel 4: Matching ═════════ */

  add("naiv", "Naives Matching: nach jedem Fehler nur um 1 weiterschieben",
    "Der Worst Case aus dem Heft: Text nur aus a, Muster „aaab“. An jeder Position stimmen die ersten drei Zeichen, erst das b scheitert – das kostet jedes Mal <b>m = 4 Vergleiche</b>, und danach rutscht das Muster nur <b>eine</b> Stelle weiter. Bei n = 8 sind das 5 Positionen × 4 = 20 Vergleiche → <b>O(n·m)</b>.",
    function(K){
      var s = "", x0 = 190, w = 34, T = "aaaaaaaa", Pt = "aaab";
      s += K.t(30, 40, "Text", "s", { a: "start", s: 13, b: true });
      for(var i = 0; i < 8; i++) s += K.cell(x0 + i * w, 40, T[i], "s", { w: w - 4, h: 28 }) + K.t(x0 + i * w, 18, String(i), "f", { s: 12 });
      for(var p = 0; p < 5; p++){
        var y = 88 + p * 40;
        s += K.t(30, y, "Position " + p, "s", { a: "start", s: 12.5 });
        for(var j = 0; j < 4; j++){ var bad = j === 3; s += K.cell(x0 + (p + j) * w, y, Pt[j], bad ? "m" : "a", { w: w - 4, h: 28, fill: bad ? "fm" : "fa" }); }
        s += K.t(560, y, "4 Vergl.", "s", { s: 12.5 });
      }
      s += K.f(320, 306, "5 Positionen × 4 Vergleiche = 20  →  O(n·m)", "m", { fill: "fm" });
      return K.svg(640, 325, s);
    });

  add("kmp", "KMP: die next[]-Tabelle verrät, wie weit man springen darf",
    "Beim ersten Anlegen stimmen „abcab“ überein, dann scheitert d gegen c. Das schon gelesene „abcab“ <b>endet mit „ab“, und so beginnt auch das Muster</b> – also wird das Muster gleich so verschoben, dass diese beiden Zeichen übereinanderliegen. Der <b>Textzeiger bleibt an Position 5</b> und läuft nie zurück → O(n + m).",
    function(K){
      var s = "", x0 = 150, w = 40, T = "abcabcabd", P = "abcabd";
      s += K.t(30, 46, "Text", "s", { a: "start", s: 13, b: true });
      for(var i = 0; i < 9; i++) s += K.cell(x0 + i * w, 46, T[i], i === 3 || i === 4 ? "c3" : "s", { w: w - 4, h: 30, fill: i === 3 || i === 4 ? "fm" : "p" }) + K.t(x0 + i * w, 20, String(i), "f", { s: 12 });
      s += K.t(30, 100, "1. Versuch", "s", { a: "start", s: 13 });
      for(var j = 0; j < 6; j++){ var bd = j === 3 || j === 4, c = j < 5 ? (bd ? "c3" : "a") : "m"; s += K.cell(x0 + j * w, 100, P[j], c, { w: w - 4, h: 30, fill: j === 5 || bd ? "fm" : "fa" }); }
      s += K.t(x0 + 5 * w + 26, 100, "d ≠ c", "m", { a: "start", s: 13, b: true });
      s += K.t(30, 160, "2. Versuch", "s", { a: "start", s: 13 });
      for(j = 0; j < 6; j++){ var known = j < 2; s += K.cell(x0 + (j + 3) * w, 160, P[j], known ? "c3" : "a", { w: w - 4, h: 30, fill: known ? "fm" : "fa" }); }
      s += K.arrow(x0 + 2 * w, 128, x0 + 3 * w - 6, 140, "c3", { w: 1.8, head: 8 }) + K.t(x0 + 1 * w, 136, "schieben um 3", "c3", { s: 12, b: true });
      s += K.arrow(x0 + 5 * w, 196, x0 + 5 * w, 178, "m", { w: 2, head: 9 }) + K.t(x0 + 5 * w + 12, 206, "Textzeiger bleibt bei 5", "m", { a: "start", s: 12.5, b: true });
      s += K.t(30, 254, "Muster", "s", { a: "start", s: 12.5, b: true }) + K.t(30, 286, "next (Rand)", "s", { a: "start", s: 12.5, b: true });
      [0, 0, 0, 1, 2, 0].forEach(function(v, k){ s += K.cell(x0 + k * w, 254, P[k], "a", { w: w - 4, h: 28 }) + K.cell(x0 + k * w, 286, String(v), k === 4 ? "c3" : "s", { w: w - 4, h: 28, fill: k === 4 ? "fm" : "p" }); });
      s += K.t(x0 + 6 * w + 4, 286, "← „abcab“: Rand „ab“ = 2", "c3", { a: "start", s: 12.5, b: true });
      return K.svg(640, 310, s);
    });

  add("bm", "Boyer-Moore: von rechts vergleichen, über ganze Fenster springen",
    "Das Heft-Beispiel „mal“ in „Man muss seinen Text erst einmal“. Verglichen wird <b>zuerst das rechte Zeichen</b> des Fensters (rot = Fehlvergleich). Kommt dieses Textzeichen in „mal“ gar nicht vor, springt das Fenster um die <b>volle Musterlänge 3</b>. Nur beim „m“ (Position 29) geht es um 2. So reichen 11 Fenster mit 13 Zeichenvergleichen.",
    function(K){
      var T = "Man muss seinen Text erst einmal", x0 = 40, w = 18, s = "";
      for(var i = 0; i < T.length; i++){
        s += K.rect(x0 + i * w - w / 2, 22, w, 24, "r", { fill: "p", rx: 0 });
        s += K.t(x0 + i * w, 34, T[i] === " " ? "␣" : T[i], T[i] === " " ? "f" : "i", { s: 13, b: true, halo: false });
      }
      var W = [[0, 2, false], [3, 5, false], [6, 8, false], [9, 11, false], [12, 14, false], [15, 17, false], [18, 20, false], [21, 23, false], [24, 26, false], [27, 29, false], [29, -1, true]];
      W.forEach(function(q, r){
        var y = 66 + r * 21, st = q[0];
        for(var j = 0; j < 3; j++){
          var pos = st + j, hit = q[2], mis = !hit && pos === q[1];
          var c = hit ? "a" : mis ? "m" : "f";
          s += K.cell(x0 + pos * w, y, "mal"[j], c, { w: w - 2, h: 18, fill: hit ? "fa" : mis ? "fm" : "p", s: 12 });
        }
      });
      s += K.t(x0 + 27 * w - 14, 66 + 9 * 21, "m → nur 2 weiter", "c3", { a: "end", s: 12, b: true });
      s += K.t(x0 + 29 * w - 14, 66 + 10 * 21, "Treffer", "a", { a: "end", s: 12.5, b: true });
      s += K.t(x0 + 6 * w + 4, 66 + 1 * 21, "n kommt in „mal“ nicht vor → +3", "m", { a: "start", s: 12, b: true });
      s += K.f(320, 316, "11 Fenster · 13 Zeichenvergleiche (naiv: 30 Fenster)", "a");
      return K.svg(640, 335, s);
    });

  add("rabinkarp", "Rabin-Karp: erst Hashwerte vergleichen, nur bei Gleichheit Zeichen prüfen",
    "Gesucht „59“ in „31415926“, Hash = Zahl mod 7, also h(59) = 3. Für jedes Fenster wird der Hash fortgeschrieben (<b>Rolling Hash</b>: vordere Ziffer raus, neue hinten rein). Nur bei gleichem Hash wird zeichenweise geprüft: Bei 31 ist das eine <b>Hash-Kollision</b> (falscher Alarm), bei 59 ein echter Treffer.",
    function(K){
      var s = "", T = "31415926", x0 = 130, w = 56;
      s += K.t(30, 50, "Text", "s", { a: "start", s: 13, b: true }) + K.t(30, 130, "Fenster", "s", { a: "start", s: 13, b: true }) + K.t(30, 175, "mod 7", "s", { a: "start", s: 13, b: true });
      for(var i = 0; i < 8; i++) s += K.cell(x0 + i * w, 50, T[i], "s", { w: w - 6, h: 32, s: 15 });
      for(var p = 0; p < 7; p++){
        var v = Number(T.substr(p, 2)), h = v % 7, x = x0 + p * w + w / 2, hit = h === 3, real = v === 59;
        var c = real ? "a" : hit ? "c3" : "f";
        var by = p % 2 ? 96 : 82, xl = x0 + p * w - 22, xr = x0 + (p + 1) * w + 22;
        s += K.path("M" + xl + " 70 L" + xl + " " + by + " L" + xr + " " + by + " L" + xr + " 70", c, { w: hit ? 2 : 1.2 });
        s += K.t(x, 130, String(v), c === "f" ? "s" : c, { s: 13, b: hit });
        s += K.cell(x, 175, String(h), c === "f" ? "s" : c, { w: 30, h: 26, fill: hit ? (real ? "fa" : "fm") : "p", s: 13 });
      }
      s += K.t(x0 + w / 2, 214, "3 = 3 → prüfen:", "c3", { s: 12, b: true }) + K.t(x0 + w / 2, 232, "31 ≠ 59 ✗", "c3", { s: 12, b: true });
      s += K.t(x0 + 4 * w + w / 2, 214, "3 = 3 → prüfen:", "a", { s: 12, b: true }) + K.t(x0 + 4 * w + w / 2, 232, "59 = 59 ✓", "a", { s: 12, b: true });
      s += K.f(320, 290, "31 → 14:  (31 − 3·10)·10 + 4 = 14  (konstanter Aufwand)", "s", { fill: "p" });
      return K.svg(640, 315, s);
    });

  /* ═════════ Kapitel 5: Analyse ═════════ */

  add("schritte", "Vier Schritte der Laufzeitanalyse",
    "Am Beispiel der Doppelschleife aus C.13: Erst klären, <b>wovon</b> der Aufwand abhängt (n), dann eine Grundoperation als Mass wählen (ein print), dann zählen, wie oft sie läuft (<b>T(n) = n·n</b>), und zuletzt nur den <b>dominanten Term</b> ohne Konstanten behalten.",
    function(K){
      var s = "", B = [["1  Eingabegrösse", "n = Schleifen-", "grenze"], ["2  Elementar-", "operation:", "print(i+j)"], ["3  Zeitfunktion", "T(n) = n · n", "= n²"], ["4  dominanter", "Term", "→ O(n²)"]];
      var cols = ["s", "c4", "a", "m"];
      B.forEach(function(b, k){
        var x = 20 + k * 155;
        s += K.rect(x, 60, 135, 120, cols[k], { fill: k === 3 ? "fm" : "p", rx: 8, w: 1.8 });
        s += K.t(x + 67, 86, b[0], cols[k], { s: 13, b: true }) + K.t(x + 67, 124, b[1], "i", { s: 13 }) + K.t(x + 67, 148, b[2], k > 1 ? cols[k] : "i", { s: 13.5, b: k > 1 });
        if(k < 3) s += K.arrow(x + 137, 120, x + 153, 120, "s", { w: 1.8, head: 8 });
      });
      s += K.f(320, 230, "for i = 1 to n:  for j = 1 to n:  print(i+j)", "s", { fill: "p" });
      s += K.t(320, 270, "Konstanten und niedrigere Terme fallen am Ende weg", "s", { s: 13 });
      return K.svg(640, 290, s);
    });

  add("schleifen", "Geschachtelte Schleifen: Durchlaufzahlen multiplizieren",
    "Jeder Punkt ist <b>ein Aufruf von print</b>. Eine einzelne Schleife erzeugt eine Reihe aus n Punkten. Bei zwei geschachtelten Schleifen läuft für <b>jede</b> der n Zeilen die innere Schleife komplett durch – es entsteht ein <b>Quadrat</b> aus n · n Punkten. Die Form verrät die Klasse: Linie O(n), Fläche O(n²).",
    function(K){
      var s = K.panel(10, 10, 230, 290, "eine Schleife: n", "c4") + K.panel(250, 10, 380, 290, "zwei geschachtelt: n · n", "a"), n = 6, st = 32;
      for(var j = 0; j < n; j++) s += K.dot(45 + j * st, 150, "c4", 6);
      s += K.t(125, 190, "n = 6 Punkte", "c4", { s: 13, b: true });
      for(var i = 0; i < n; i++){
        for(j = 0; j < n; j++) s += K.dot(370 + j * st, 64 + i * st, "a", 6);
        s += K.t(330, 64 + i * st, "i=" + (i + 1), "f", { s: 12 });
      }
      for(j = 0; j < n; j++) s += K.t(370 + j * st, 262, String(j + 1), "f", { s: 12 });
      s += K.t(344, 262, "j =", "f", { s: 12, a: "end" });
      s += K.t(540, 280, "6 · 6 = 36", "a", { s: 13, b: true });
      return K.svg(640, 310, s);
    });

  add("dominant", "Der dominante Term setzt sich durch",
    "Die Balken zeigen, welchen <b>Anteil</b> jeder Term an T(n) = 3n² + 5n + 2 hat. Für kleine n spielen 5n und 2 noch mit, doch je grösser n wird, desto mehr macht <b>3n² fast alles</b> aus (bei n = 50 schon 97 %). Darum zählt am Ende nur n² – und auch der Faktor 3 fällt weg: O(n²).",
    function(K){
      var s = "", N = [1, 2, 5, 10, 20, 50], x0 = 110, W = 430;
      s += K.t(x0 + W / 2, 22, "Anteile an T(n) = 3n² + 5n + 2", "s", { s: 13, b: true });
      N.forEach(function(n, k){
        var a = 3 * n * n, b = 5 * n, c = 2, T = a + b + c, y = 54 + k * 40;
        var wa = W * a / T, wb = W * b / T, wc = W * c / T;
        s += K.rect(x0, y - 13, wa, 26, "a", { fill: "fa", rx: 0 }) + K.rect(x0 + wa, y - 13, wb, 26, "c3", { fill: "fm", rx: 0 }) + K.rect(x0 + wa + wb, y - 13, wc, 26, "s", { fill: "p", rx: 0 });
        s += K.t(x0 - 14, y, "n = " + n, "s", { a: "end", s: 13, b: true });
        s += K.t(x0 + wa / 2, y, Math.round(100 * a / T) + " %", "a", { s: 12, b: true });
        s += K.t(x0 + W + 12, y, "T = " + T, "s", { a: "start", s: 12 });
      });
      s += K.rect(150, 296, 14, 14, "a", { fill: "fa", rx: 0 }) + K.t(172, 303, "3n²", "a", { a: "start", s: 13, b: true });
      s += K.rect(260, 296, 14, 14, "c3", { fill: "fm", rx: 0 }) + K.t(282, 303, "5n", "c3", { a: "start", s: 13, b: true });
      s += K.rect(360, 296, 14, 14, "s", { fill: "p", rx: 0 }) + K.t(382, 303, "2", "s", { a: "start", s: 13, b: true });
      return K.svg(640, 320, s);
    });

  /* ═════════ Kapitel 6: Klassifikation und Komplexität ═════════ */

  add("onot", "O-Notation: ab n₀ liegt g unter c · f",
    "g(n) = 3n + 8 liegt in O(n): Mit <b>c = 4</b> gilt 3n + 8 ≤ 4n, sobald n ≥ 8 ist – das ist <b>n₀</b>. Links davon darf g ruhig grösser sein, das zählt nicht. Ab n₀ (schattiert) bleibt g <b>für immer</b> unter der Kurve c · f(n). Die Konstante c und der Summand 8 ändern nichts an der Klasse.",
    function(K){
      var M = K.map(70, 290, 36, 4.4), s = "";
      s += '<rect x="' + M.X(8) + '" y="30" width="' + (M.X(14.5) - M.X(8)) + '" height="260" style="fill:var(--sk-fill);opacity:.6"/>';
      s += K.axes(70, 290, 5, 540, 265, 5, "n", "");
      for(var i = 2; i <= 14; i += 2) s += K.line(M.X(i), 286, M.X(i), 294, "s", { w: 1.2 }) + K.t(M.X(i), 306, String(i), "f", { s: 12 });
      for(var v = 10; v <= 50; v += 10) s += K.line(66, M.Y(v), 74, M.Y(v), "s", { w: 1.2 }) + K.t(54, M.Y(v), String(v), "f", { s: 12, a: "end" });
      s += K.plot(function(x){ return x; }, 0, 14.5, M, "f", { w: 1.8, dash: "6 5" });
      s += K.plot(function(x){ return 4 * x; }, 0, 14.5, M, "m", { w: 2.6, ymax: 60 });
      s += K.plot(function(x){ return 3 * x + 8; }, 0, 14.5, M, "a", { w: 2.6 });
      s += K.line(M.X(8), M.Y(32), M.X(8), 290, "s", { w: 1.4, dash: "4 4" }) + K.dot(M.X(8), M.Y(32), "i", 4.5);
      s += K.v(M.X(8), 318, "n₀ = 8", "i", { s: 14 });
      s += K.t(M.X(13.2), M.Y(4 * 13.2) - 16, "c · f(n) = 4n", "m", { a: "end", s: 13.5, b: true });
      s += K.t(M.X(14.4), M.Y(44) + 16, "g(n) = 3n + 8", "a", { a: "end", s: 13.5, b: true });
      s += K.t(M.X(14.4), M.Y(14.4) - 14, "f(n) = n", "s", { a: "end", s: 13 });
      s += K.t(M.X(3), M.Y(26), "hier g > 4n:", "s", { s: 12 }) + K.t(M.X(3), M.Y(26) + 18, "egal", "s", { s: 12 });
      s += K.t(M.X(11.2), 270, "ab n₀: g ≤ c·f", "a", { s: 13, b: true });
      return K.svg(640, 330, s);
    });

  add("wachstum", "Wachstumskurven der Komplexitätsklassen",
    "Alle Kurven starten klein, aber sie <b>wachsen völlig unterschiedlich</b>. O(1) und O(log n) bleiben fast flach, n und n log n steigen gemässigt, n² und vor allem <b>2ⁿ schiessen nach oben</b>. Für kleine n ist 2ⁿ sogar unter n² – erst ab n = 4 überholt es; die O-Notation interessiert sich nur für das Verhalten bei grossem n.",
    function(K){
      var M = K.map(60, 290, 25, 5.2), s = K.axes(60, 290, 5, 540, 270, 5, "n", "");
      for(var i = 5; i <= 20; i += 5) s += K.line(M.X(i), 286, M.X(i), 294, "s", { w: 1.2 }) + K.t(M.X(i), 306, String(i), "f", { s: 12 });
      for(var v = 10; v <= 50; v += 10) s += K.line(56, M.Y(v), 64, M.Y(v), "s", { w: 1.2 }) + K.t(48, M.Y(v), String(v), "f", { s: 12, a: "end" });
      var L2 = function(x){ return Math.log(x) / Math.LN2; };
      s += K.plot(function(){ return 1; }, 0, 20.5, M, "s", { w: 2.2 });
      s += K.plot(function(x){ return L2(x); }, 1, 20.5, M, "c4", { w: 2.4 });
      s += K.plot(function(x){ return x; }, 0, 20.5, M, "a", { w: 2.4 });
      s += K.plot(function(x){ return x * L2(x); }, 1, 20.5, M, "c3", { w: 2.4, ymax: 51 });
      s += K.plot(function(x){ return x * x; }, 0, 20.5, M, "m", { w: 2.4, ymax: 51 });
      s += K.plot(function(x){ return Math.pow(2, x); }, 0, 20.5, M, "m", { w: 3.2, ymax: 51, dash: "8 4" });
      s += K.t(M.X(20.6), M.Y(1) - 2, "O(1)", "s", { a: "start", s: 13, b: true });
      s += K.t(M.X(20.6), M.Y(L2(20)), "O(log n)", "c4", { a: "start", s: 13, b: true });
      s += K.t(M.X(20.6), M.Y(20), "O(n)", "a", { a: "start", s: 13, b: true });
      s += K.t(M.X(13.4) + 8, M.Y(50) + 4, "O(n log n)", "c3", { a: "start", s: 13, b: true });
      s += K.t(M.X(7.07) + 8, M.Y(50) + 4, "O(n²)", "m", { a: "start", s: 13, b: true });
      s += K.t(M.X(5.64) - 8, M.Y(50) + 4, "O(2ⁿ)", "m", { a: "end", s: 13, b: true });
      s += K.line(128, 68, M.X(4) - 2, M.Y(16) - 6, "f", { w: 1.2, dash: "3 3" }) + K.dot(M.X(4), M.Y(16), "i", 4) + K.t(70, 60, "2ⁿ = n² bei n = 4", "i", { a: "start", s: 12 });
      return K.svg(640, 320, s);
    });

  add("explosion", "Warum exponentiell „praktisch nicht berechenbar“ heisst",
    "Rechenschritte für <b>n = 20</b>, Balken auf <b>logarithmischer</b> Skala (jeder Teilstrich = Faktor 10). Bei 1 µs pro Schritt ist alles bis n³ in Millisekunden erledigt. 2ⁿ braucht schon rund eine Sekunde – und jedes weitere Element verdoppelt das. n! = 20! braucht etwa <b>77 000 Jahre</b>.",
    function(K){
      var s = "", R = [["O(1)", 1, "1"], ["O(log n)", 4.32, "4,3"], ["O(n)", 20, "20"], ["O(n log n)", 86.4, "86"], ["O(n²)", 400, "400"], ["O(n³)", 8000, "8 000 ≈ 8 ms"], ["O(2ⁿ)", 1048576, "1 048 576 ≈ 1 s"], ["O(n!)", 2.43e18, "2,4·10¹⁸ ≈ 77 000 Jahre"]];
      var x0 = 120, sc = 300 / 19;
      for(var e = 0; e <= 18; e += 3){ var x = x0 + e * sc; s += K.line(x, 296, x, 304, "s", { w: 1.2 }) + K.t(x, 316, "10" + ["⁰", "", "", "³", "", "", "⁶", "", "", "⁹", "", "", "¹²", "", "", "¹⁵", "", "", "¹⁸"][e], "f", { s: 12 }); }
      s += K.line(x0, 300, x0 + 19 * sc, 300, "s", { w: 1.2 });
      R.forEach(function(r, k){
        var y = 46 + k * 34, wv = Math.max(3, Math.log(r[1]) / Math.LN10 * sc), c = k >= 6 ? "m" : "a";
        s += K.t(x0 - 12, y, r[0], k >= 6 ? "m" : "s", { a: "end", s: 13, b: true });
        s += K.rect(x0, y - 11, wv, 22, c, { fill: k >= 6 ? "fm" : "fa", rx: 1 });
        s += K.t(x0 + wv + 8, y, r[2], c, { a: "start", s: 12.5, b: k >= 6 });
      });
      return K.svg(640, 330, s);
    });

  add("master", "Master-Theorem: wo im Rekursionsbaum steckt die Arbeit?",
    "Jeder Balken ist die Arbeit <b>einer Ebene</b> des Rekursionsbaums (Beispiele aus dem Heft). <b>a &lt; bᵏ:</b> die Arbeit schrumpft von Ebene zu Ebene – die <b>Wurzel</b> bestimmt: O(nᵏ). <b>a = bᵏ:</b> jede Ebene gleich viel, mal log n Ebenen: O(nᵏ log n). <b>a &gt; bᵏ:</b> die Arbeit wächst – die vielen <b>Blätter</b> bestimmen: O(n^(log_b a)).",
    function(K){
      var s = "", P = [
        ["Fall 1: a < bᵏ", "2T(n/2) + n²", "2 < 2² = 4", [1, 0.5, 0.25, 0.125], ["n²", "n²/2", "n²/4", "n²/8"], "O(n²)", "c4"],
        ["Fall 2: a = bᵏ", "2T(n/2) + n", "2 = 2¹ (MergeSort)", [1, 1, 1, 1], ["n", "n", "n", "n"], "O(n log n)", "a"],
        ["Fall 3: a > bᵏ", "4T(n/2) + n", "4 > 2¹ = 2", [1, 2, 4, 8], ["n", "2n", "4n", "8n"], "O(n^log₂4) = O(n²)", "m"]];
      P.forEach(function(p, k){
        var ox = 10 + k * 210, c = p[6], mx = Math.max.apply(null, p[3]);
        s += K.panel(ox, 10, 200, 310, p[0], c);
        s += K.t(ox + 100, 48, p[1], "i", { s: 13.5, b: true }) + K.t(ox + 100, 70, p[2], "s", { s: 12.5 });
        p[3].forEach(function(v, i){
          var y = 108 + i * 40, w = 130 * v / mx;
          s += K.t(ox + 22, y, "E" + i, "f", { s: 12 });
          s += K.rect(ox + 38, y - 12, w, 24, c, { fill: k === 2 ? "fm" : "fa", rx: 2 });
          s += K.t(ox + 38 + w + 6, y, p[4][i], c, { a: "start", s: 12, b: true });
        });
        s += K.t(ox + 100, 268, k === 0 ? "Wurzel dominiert" : k === 1 ? "alle Ebenen gleich" : "Blätter dominieren", "s", { s: 12.5 });
        s += K.t(ox + 100, 294, p[5], c, { s: 13.5, b: true });
      });
      return K.svg(640, 330, s);
    });

  add("mergebaum", "Rekursionsbaum von MergeSort: T(n) = 2·T(n/2) + n",
    "Jeder Knoten zeigt, wie gross sein Teilproblem ist, und kostet so viel Arbeit (Merge). Pro Ebene verdoppelt sich die Zahl der Knoten, ihre Grösse halbiert sich – die <b>Summe je Ebene bleibt n</b>. Bis zur Grösse 1 gibt es log₂ n Halbierungen. Zusammen: n · log₂ n → Master-Theorem Fall 2, <b>O(n log n)</b>.",
    function(K){
      var s = "", lv = [[8], [4, 4], [2, 2, 2, 2], [1, 1, 1, 1, 1, 1, 1, 1]], W = 440, x0 = 30;
      var pos = [];
      lv.forEach(function(L, d){
        var y = 50 + d * 72, st = W / L.length, row_ = [];
        L.forEach(function(v, i){ row_.push([x0 + st * (i + 0.5), y]); });
        pos.push(row_);
      });
      pos.forEach(function(R, d){ if(d) R.forEach(function(p, i){ var q = pos[d - 1][Math.floor(i / 2)]; s += K.edge(q[0], q[1], p[0], p[1], { r1: 18, r2: 18, noarrow: true }); }); });
      pos.forEach(function(R, d){ R.forEach(function(p, i){ s += K.node(p[0], p[1], d === 0 ? "n" : d === 3 ? "1" : "n/" + Math.pow(2, d), d === 3 ? "c4" : "a", { r: 18, s: d === 2 ? 12 : 13, fill: d === 3 ? "fm" : "p" }); }); });
      ["n", "2 · n/2 = n", "4 · n/4 = n", "n · 1 = n"].forEach(function(t, d){ s += K.t(500, 50 + d * 72, "= " + t, "m", { a: "start", s: 13, b: true }); });
      s += K.line(490, 30, 490, 278, "r", { w: 1 });
      s += K.f(320, 312, "log₂ n Ebenen × n je Ebene = O(n log n)", "m", { fill: "fm" });
      return K.svg(640, 335, s);
    });

  add("chip", "Chip-and-Conquer: T(n) = T(n−c) + f(n) → Fläche unter f",
    "Bei jedem Aufruf wird nur ein <b>Stückchen abgeknabbert</b> (n → n−1) und dafür f(n) Arbeit geleistet. Die Gesamtarbeit ist die Summe aller Balken – also ungefähr die <b>Fläche unter f</b>, das Integral. <b>Links</b> QuickSort im Worst Case (f(n) = n): Dreieck n²/2 → O(n²). <b>Rechts</b> C.16 (f(n) = 1): Rechteck → O(n).",
    function(K){
      var s = K.panel(10, 10, 300, 310, "T(n) = T(n−1) + n", "m") + K.panel(330, 10, 300, 310, "T(n) = T(n−1) + 1", "a");
      var M = K.map(50, 270, 30, 24);
      for(var i = 1; i <= 8; i++) s += K.bar(i - 0.5, i, 0.86, M, "m", { fill: "fm" });
      s += K.plot(function(x){ return x; }, 0, 8.4, M, "i", { w: 1.8, dash: "6 4" });
      s += K.line(50, 270, 300, 270, "s", { w: 1.3 }) + K.t(M.X(4), 290, "n, n−1, …, 1  (n = 8)", "s", { s: 12 });
      s += K.t(120, 64, "Summe 36 ≈ n²/2", "m", { s: 13, b: true }) + K.t(120, 84, "∫ x dx = n²/2 → O(n²)", "m", { s: 13, b: true });
      var N = K.map(370, 270, 30, 24);
      for(i = 1; i <= 8; i++) s += K.bar(i - 0.5, 1, 0.86, N, "a");
      s += K.line(370, 270, 620, 270, "s", { w: 1.3 }) + K.t(N.X(4), 290, "8 Aufrufe je 1", "s", { s: 12 });
      s += K.t(480, 150, "Summe 8 = n", "a", { s: 13, b: true }) + K.t(480, 170, "∫ 1 dx = n → O(n)", "a", { s: 13, b: true });
      return K.svg(640, 330, s);
    });

  add("chipbe", "Chip-and-Be-Conquered: b > 1 Aufrufe je Schritt → exponentiell",
    "C.17: T(n) = 3·T(n−1) + n. Jeder Aufruf startet <b>drei</b> neue, die nur um 1 kleiner sind. Die Zahl der Knoten <b>verdreifacht sich je Ebene</b> (1, 3, 9, 27, …), und es gibt n Ebenen, bis die Grösse 0 erreicht ist. Das sind etwa 3ⁿ Aufrufe → <b>O(3ⁿ)</b>, exponentiell.",
    function(K){
      var s = "", W = 500, x0 = 20, lv = [1, 3, 9, 27], lab = ["n", "n−1", "n−2", ""];
      var pos = lv.map(function(c, d){ var st = W / c, r = []; for(var i = 0; i < c; i++) r.push([x0 + st * (i + 0.5), 46 + d * 70]); return r; });
      pos.forEach(function(R, d){ if(d) R.forEach(function(p, i){ var q = pos[d - 1][Math.floor(i / 3)]; s += K.line(q[0], q[1] + (d === 1 ? 18 : 15), p[0], p[1] - (d === 3 ? 6 : 15), "f", { w: 1.2 }); }); });
      pos.forEach(function(R, d){ R.forEach(function(p){ s += d === 3 ? K.dot(p[0], p[1], "m", 5) : K.node(p[0], p[1], lab[d], d ? "m" : "a", { r: d === 0 ? 18 : 16, s: d === 2 ? 12 : 13 }); }); });
      [1, 3, 9, 27].forEach(function(c, d){ s += K.t(540, 46 + d * 70, c + " Knoten", "m", { a: "start", s: 13, b: true }); });
      s += K.t(270, 280, "⋮  n Ebenen", "s", { s: 13 });
      s += K.f(320, 312, "1 + 3 + 9 + … + 3ⁿ⁻¹ ≈ 3ⁿ  →  O(3ⁿ)", "m", { fill: "fm" });
      return K.svg(640, 335, s);
    });

  add("klassen", "Komplexitätsklassen: LOGSPACE ⊆ P ⊆ NP ⊆ PSPACE ⊆ EXPTIME",
    "Die Klassen liegen <b>ineinander</b> wie Zwiebelschalen: Was mit wenig Platz lösbar ist, ist auch in Polynomialzeit lösbar; was lösbar ist, ist auch prüfbar; und so weiter nach aussen. Je weiter aussen ein Problem nur liegt, desto <b>teurer</b> ist es. Ob die Schalen echt verschieden sind (z. B. P ≠ NP), ist teils unbewiesen.",
    function(K){
      var s = "", C = [["EXPTIME", "Zeit 2ⁿ · Gewinnstrategie Go", "m"], ["PSPACE", "Platz polynomial · Tic-Tac-Toe", "c3"], ["NP", "prüfbar in Polynomialzeit · Rucksack", "c4"], ["P", "lösbar in nᵏ · Primzahltest", "a"], ["LOGSPACE", "Platz log n · Erreichbarkeit", "s"]];
      C.forEach(function(c, i){
        var x = 15 + i * 30, y = 12 + i * 58, w = 610 - i * 60, h = 306 - i * 64;
        s += K.rect(x, y, w, h, c[2], { fill: i % 2 ? "fa" : "p", rx: 22, w: 1.8 });
        s += K.t(x + 20, y + 26, c[0], c[2], { a: "start", s: 14, b: true }) + K.t(x + w - 20, y + 26, c[1], "s", { a: "end", s: 12.5 });
      });
      return K.svg(640, 330, s);
    });

  add("pnp", "P vs. NP: die grosse offene Frage",
    "<b>Links</b> das vermutete Bild: P liegt echt in NP, und am „Rand“ von NP sitzen die <b>NP-vollständigen</b> Probleme (Rucksack, TSP). <b>Rechts</b>, falls P = NP wäre: Dann fielen alle zusammen – ein einziger Polynomialzeit-Algorithmus für ein NP-vollständiges Problem würde genügen, um <b>alle</b> NP-Probleme effizient zu lösen.",
    function(K){
      var s = K.panel(10, 10, 300, 300, "falls P ≠ NP (vermutet)", "c4") + K.panel(330, 10, 300, 300, "falls P = NP", "a");
      s += K.circ(160, 170, 120, "c4", { fill: "p", w: 2 }) + K.t(160, 72, "NP", "c4", { s: 15, b: true });
      s += K.circ(105, 185, 50, "a", { fill: "fa", w: 2 }) + K.t(105, 178, "P", "a", { s: 15, b: true }) + K.t(105, 200, "Sortieren", "s", { s: 12 });
      s += K.circ(214, 185, 52, "m", { fill: "fm", w: 2 }) + K.t(214, 166, "NP-", "m", { s: 13, b: true }) + K.t(214, 184, "vollständig", "m", { s: 12, b: true }) + K.t(214, 202, "Rucksack, TSP", "s", { s: 12 });
      s += K.circ(480, 170, 120, "a", { fill: "fa", w: 2 }) + K.t(480, 150, "P = NP", "a", { s: 16, b: true });
      s += K.t(480, 180, "= NP-vollständig", "a", { s: 13 }) + K.t(480, 202, "(alles effizient lösbar)", "s", { s: 12 });
      return K.svg(640, 320, s);
    });

  add("verify", "NP: Lösung finden ist schwer, Lösung prüfen ist leicht",
    "Rucksack mit vier Gegenständen, Kapazität 10 kg. <b>Finden</b> (links): Für jeden Gegenstand „rein oder nicht“ – der Entscheidungsbaum hat 2⁴ = 16 Blätter, allgemein <b>2ⁿ</b>. <b>Prüfen</b> (rechts): Für eine vorgeschlagene Packung genügt es, die Gewichte zu addieren und zu vergleichen – <b>n Schritte</b>, also polynomial.",
    function(K){
      var s = K.panel(10, 10, 360, 300, "finden: alle Kombinationen", "m") + K.panel(380, 10, 250, 300, "prüfen: einmal addieren", "a");
      var x0 = 60, W = 290, items = ["A", "B", "C", "D"];
      var pos = [];
      for(var d = 0; d <= 4; d++){ var c = Math.pow(2, d), st = W / c, r = []; for(var i = 0; i < c; i++) r.push([x0 + st * (i + 0.5), 52 + d * 50]); pos.push(r); }
      for(d = 1; d <= 4; d++) pos[d].forEach(function(p, i){ var q = pos[d - 1][Math.floor(i / 2)]; s += K.line(q[0], q[1], p[0], p[1], i % 2 ? "f" : "m", { w: 1.2 }); });
      for(d = 0; d < 4; d++){ pos[d].forEach(function(p){ s += K.dot(p[0], p[1], "m", 3.5); }); }
      pos[4].forEach(function(p){ s += K.dot(p[0], p[1], "m", 4.5); });
      items.forEach(function(it, d){ s += K.t(20, 77 + d * 50, it + "?", "s", { a: "start", s: 12, b: true }); });
      s += K.t(190, 280, "2⁴ = 16 Packungen → 2ⁿ", "m", { s: 13, b: true });
      s += lines(K, 400, 70, ["A 5 kg, B 4 kg,", "C 3 kg, D 2 kg"], "s", { s: 12.5 });
      s += K.t(400, 130, "Vorschlag: {A, C, D}", "a", { a: "start", s: 13, b: true });
      s += K.f(505, 175, "5 + 3 + 2 = 10 ≤ 10 ✓", "a", { s: 13 });
      s += K.t(505, 230, "3 Additionen + 1 Vergleich", "s", { s: 12.5 }) + K.t(505, 280, "→ polynomial", "a", { s: 13, b: true });
      return K.svg(640, 320, s);
    });

  add("vergleichsbaum", "Untere Schranke: jedes Vergleichssortieren braucht ≥ log₂(n!) Vergleiche",
    "Ein vergleichsbasiertes Verfahren ist im Grunde ein <b>Entscheidungsbaum</b>: Jeder Knoten ist ein Vergleich, jedes Blatt eine mögliche Reihenfolge. Für 3 Elemente gibt es 3! = 6 Reihenfolgen, also braucht der Baum <b>6 Blätter</b> und damit mindestens Höhe log₂ 6 ≈ 2,6 → 3 Vergleiche. Allgemein: log₂(n!) ≈ <b>n log n</b>.",
    function(K){
      var s = "";
      function Q(x, y, t){ return K.cell(x, y, t, "a", { w: 62, h: 30, s: 13, rx: 8 }); }
      function L(x, y, t){ return K.cell(x, y, t, "m", { w: 54, h: 28, fill: "fm", s: 13 }); }
      function E(x1, y1, x2, y2, lab, side){ return K.line(x1, y1 + 15, x2, y2 - 15, "s", { w: 1.4 }) + K.t((x1 + x2) / 2 + side * 16, (y1 + y2) / 2, lab, "f", { s: 12, a: side < 0 ? "end" : "start" }); }
      s += E(320, 40, 180, 115, "ja", -1) + E(320, 40, 460, 115, "nein", 1);
      s += E(180, 115, 110, 190, "ja", -1) + E(180, 115, 250, 190, "nein", 1) + E(460, 115, 390, 190, "ja", -1) + E(460, 115, 530, 190, "nein", 1);
      s += E(250, 190, 205, 265, "ja", -1) + E(250, 190, 295, 265, "nein", 1) + E(530, 190, 485, 265, "ja", -1) + E(530, 190, 575, 265, "nein", 1);
      s += Q(320, 40, "a < b ?") + Q(180, 115, "b < c ?") + Q(460, 115, "a < c ?") + Q(250, 190, "a < c ?") + Q(530, 190, "b < c ?");
      s += L(110, 190, "abc") + L(390, 190, "bac") + L(205, 265, "acb") + L(295, 265, "cab") + L(485, 265, "bca") + L(575, 265, "cba");
      s += K.t(30, 300, "6 = 3! Blätter → Höhe ≥ log₂ 6 ≈ 2,6", "m", { a: "start", s: 13, b: true });
      s += K.t(30, 40, "Höhe = Vergleiche", "s", { a: "start", s: 12.5 }) + K.t(30, 60, "im Worst Case", "s", { a: "start", s: 12.5 });
      return K.svg(640, 320, s);
    });
})();
