/* TGI-Klausurtrainer – Kernthemen ohne Klausurbeleg 2017/2020, laut Modulbeschreibung TIIAPS aber prüfungsrelevant:
   Zahlensysteme und Schaltungen (GDI01 Kap. 3–5), Datentypen/Keller (TGI01 Kap. 4), Suchen (TGI01 Kap. 2, 5.3),
   Bäume und Graphen (TGI01 Kap. 6). Notation wie in den Heften (Halbaddierer x, y → r, u; Keller K1–K4; c_ij). */
(function(){
  "use strict";
  var P = window.TGI_PARTS = window.TGI_PARTS || {}, D = P._defs;
  function esc(s){ return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function rnd(n){ return Math.floor(Math.random() * n); }
  function pick(a){ return a[rnd(a.length)]; }

  if(D) D.list.push(
    { id: "k-einer", a: "k", t: "Einer- und Zweierkomplement", d: "Das Einserkomplement einer Dualzahl erhält man, indem man die Nullen der Zahl durch Einsen und ihre Einsen durch Nullen ersetzt. Ihr Zweierkomplement erhält man, indem man zu ihrem Einserkomplement noch 1 addiert.", q: "GDI01 Kap. 4.3" },
    { id: "k-sub", a: "k", t: "Subtraktion mit dem Zweierkomplement", d: "Sind a und b Dualzahlen und gilt a ≥ b, so berechnet man a − b so: Falls b weniger Stellen hat als a, ergänzt man b durch führende Nullen und bildet das Zweierkomplement von b. Dieses addiert man zu a und streicht vom Ergebnis die führende Eins. Ist a < b, berechnet man b − a und nimmt das Ergebnis negativ.", q: "GDI01 Kap. 4.3" },
    { id: "k-ha", a: "k", t: "Halbaddierer", d: "Der Halbaddierer bestimmt aus zwei dualen Inputs zwei duale Outputs: Er addiert zwei Ziffern x und y und liefert eine Ergebnisziffer r und einen Übertrag u. Er besteht aus einer XOR- und einer UND-Schaltung: r = x ⊕ y, u = x ∧ y. „Halb“, weil er keinen Übertrag von der vorherigen Stelle verarbeiten kann.", q: "GDI01 Kap. 5" },
    { id: "k-va", a: "k", t: "Volladdierer", d: "Der Volladdierer addiert drei Ziffern x, y und den Übertrag u₁ der vorherigen Stelle und liefert die Ergebnisziffer r und den neuen Übertrag u₂. Aufbau aus zwei Halbaddierern und einem ODER: r = x ⊕ y ⊕ u₁ (1 bei ungerader Anzahl Einsen), u₂ = (x ∧ y) ∨ (u₁ ∧ (x ⊕ y)) (1, wenn mindestens zwei Inputs 1 sind).", q: "GDI01 Kap. 5" },
    { id: "k-vn", a: "k", t: "Von-Neumann-Architektur", d: "Komponenten: Steuerwerk (Control Unit, organisiert: holt Befehle und Daten) und Rechenwerk (ALU, rechnet und verknüpft logisch) – zusammen die CPU; Arbeitsspeicher (Speicherwerk) für Programm UND Daten (Konzept des gespeicherten Programms); Ein-/Ausgabewerk; Bussystem für den Transport. Befehle werden sequenziell abgearbeitet: Befehlszyklus Holen (Fetch) – Dekodieren (Decode) – Ausführen (Execute).", q: "GDI01 Kap. 3" },
    { id: "k-adt", a: "k", t: "Abstrakter Datentyp Keller (Stack)", d: "Signatur: createStack: 0 → Keller(T); push: Keller(T) × T → Keller(T); pop: Keller(T) → Keller(T); top: Keller(T) → T; empty: Keller(T) → 𝔹. Axiome: K1 empty(createStack) = 1 · K2 empty(push(k, t)) = 0 · K3 pop(push(k, t)) = k · K4 top(push(k, t)) = t. Ein ADT beschreibt nur das Verhalten (Operationen + Axiome), nicht die Implementierung.", q: "TGI01 Bsp. 4.1" },
    { id: "k-baum", a: "k", t: "Baum: Höhe, Tiefe, Ordnung", d: "Die Länge des Pfades von der Wurzel zu einem Knoten heißt Niveau oder Tiefe des Knotens; die Länge des größtmöglichen Pfades heißt Höhe des Baumes. Die Ordnung eines Baumes ist die maximale Anzahl von Söhnen eines Vaterknotens (Ordnung 2 = Binärbaum). Knoten ohne Söhne heißen Blätter. Ein Baum heißt vollständig, wenn er auf jedem Niveau die größtmögliche Knotenzahl hat und alle Blätter dieselbe Tiefe haben.", q: "TGI01 Kap. 6.1, Def. 6.1" },
    { id: "k-adj", a: "k", t: "Adjazenzmatrix", d: "Die Knoten des gerichteten Graphen werden durchnummeriert V1, …, Vn. Gibt es eine Kante von Vi nach Vj, ist cij = 1, sonst cij = 0. Zeile = Startknoten, Spalte = Zielknoten. Speicherbedarf n² – bei wenigen Kanten sind Adjazenzlisten sparsamer.", q: "TGI01 Kap. 6.2.2" }
  );

  /* ---------- Zahlensysteme ---------- */
  function divTable(n, b){ var rows = [], x = n; if(x === 0) rows.push([0, 0, 0]); while(x > 0){ rows.push([x, Math.floor(x / b), x % b]); x = Math.floor(x / b); } return rows; }
  function digits(n, b){ return n.toString(b).toUpperCase(); }
  function pad(s, n){ while(s.length < n) s = "0" + s; return s; }
  function groups(bin, k){ var s = pad(bin, Math.ceil(bin.length / k) * k), out = []; for(var i = 0; i < s.length; i += k) out.push(s.slice(i, i + k)); return out; }
  function subZK(a, b){ // a ≥ b, Dualstrings
    var L = a.length, bb = pad(b, L), one = bb.split("").map(function(c){ return c === "0" ? "1" : "0"; }).join(""),
        zk = pad((parseInt(one, 2) + 1).toString(2), L), sum = (parseInt(a, 2) + parseInt(zk, 2)).toString(2), res = sum.length > L ? sum.slice(1) : sum;
    return { bb: bb, one: one, zk: zk, sum: sum, res: res.replace(/^0+(?=.)/, "") };
  }

  /* ---------- Schaltungen ---------- */
  var OPS = { "∧": function(a, b){ return a & b; }, "∨": function(a, b){ return a | b; }, "⊕": function(a, b){ return a ^ b; } };
  function randExpr(){
    var forms = [["(x ∧ y) ∨ z", function(x, y, z){ return (x & y) | z; }], ["x ⊕ (y ∧ z)", function(x, y, z){ return x ^ (y & z); }], ["¬(x ∨ y) ∧ z", function(x, y, z){ return (1 - (x | y)) & z; }],
      ["(x ⊕ y) ⊕ z", function(x, y, z){ return x ^ y ^ z; }], ["(x ∧ y) ∨ (z ∧ (x ⊕ y))", function(x, y, z){ return (x & y) | (z & (x ^ y)); }], ["¬x ∨ (y ∧ ¬z)", function(x, y, z){ return (1 - x) | (y & (1 - z)); }],
      ["(x ∨ y) ∧ ¬(x ∧ y)", function(x, y, z){ return (x | y) & (1 - (x & y)); }], ["¬(x ∧ y ∧ z)", function(x, y, z){ return 1 - (x & y & z); }]];
    return pick(forms);
  }

  /* ---------- Bäume ---------- */
  function bstInsert(keys){ var root = null; keys.forEach(function(k){ var n = { k: k, l: null, r: null }; if(!root){ root = n; return; } var c = root; while(true){ if(k < c.k){ if(c.l) c = c.l; else { c.l = n; break; } } else { if(c.r) c = c.r; else { c.r = n; break; } } } }); return root; }
  function bstMiddle(keys){ var s = keys.slice().sort(function(a, b){ return a - b; }); function b(a){ if(!a.length) return null; var m = Math.floor(a.length / 2); return { k: a[m], l: b(a.slice(0, m)), r: b(a.slice(m + 1)) }; } return b(s); }
  function pre(t){ return t ? [t.k].concat(pre(t.l), pre(t.r)) : []; }
  function ino(t){ return t ? ino(t.l).concat([t.k], ino(t.r)) : []; }
  function post(t){ return t ? post(t.l).concat(post(t.r), [t.k]) : []; }
  function height(t){ return t ? 1 + Math.max(height(t.l), height(t.r)) : -1; }
  function leaves(t){ return !t ? 0 : (!t.l && !t.r ? 1 : leaves(t.l) + leaves(t.r)); }
  function treeSvg(t){
    var pos = [], i = 0, H = height(t);
    (function lay(n, d){ if(!n) return; lay(n.l, d + 1); n._x = i++; n._d = d; pos.push(n); lay(n.r, d + 1); })(t, 0);
    var W = Math.max(1, i) * 46 + 20, Hh = (H + 1) * 62 + 10, s = '<svg viewBox="0 0 ' + W + ' ' + Hh + '" width="' + W + '" height="' + Hh + '" class="asvg">';
    function X(n){ return 30 + n._x * 46; } function Y(n){ return 28 + n._d * 62; }
    pos.forEach(function(n){ [n.l, n.r].forEach(function(c){ if(c) s += '<line x1="' + X(n) + '" y1="' + Y(n) + '" x2="' + X(c) + '" y2="' + Y(c) + '" stroke="currentColor" stroke-width="1.4"/>'; }); });
    pos.forEach(function(n){ s += '<circle cx="' + X(n) + '" cy="' + Y(n) + '" r="16" class="st"/><text x="' + X(n) + '" y="' + (Y(n) + 4) + '" text-anchor="middle" class="sl">' + n.k + '</text>'; });
    return s + '</svg>';
  }
  function graphSvg(n, E){
    var R = 80, cx = 120, cy = 105, pts = []; for(var i = 0; i < n; i++){ var a = -Math.PI / 2 + i * 2 * Math.PI / n; pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]); }
    var s = '<svg viewBox="0 0 240 210" width="240" height="210" class="asvg"><defs><marker id="gh" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>';
    E.forEach(function(e){ var A = pts[e[0]], B = pts[e[1]];
      if(e[0] === e[1]){ s += '<circle cx="' + (A[0] + (A[0] - cx) * .32) + '" cy="' + (A[1] + (A[1] - cy) * .32) + '" r="11" fill="none" stroke="currentColor" stroke-width="1.3"/>'; return; }
      var dx = B[0] - A[0], dy = B[1] - A[1], L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L, back = E.some(function(f){ return f[0] === e[1] && f[1] === e[0]; }), bd = back ? 14 : 0;
      var sx = A[0] + ux * 17, sy = A[1] + uy * 17, tx = B[0] - ux * 17, ty = B[1] - uy * 17, mx = (sx + tx) / 2 - uy * bd, my = (sy + ty) / 2 + ux * bd;
      s += '<path d="M' + sx + ',' + sy + ' Q' + mx + ',' + my + ' ' + tx + ',' + ty + '" fill="none" stroke="currentColor" stroke-width="1.3" marker-end="url(#gh)"/>'; });
    pts.forEach(function(p, i){ s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="15" class="st"/><text x="' + p[0] + '" y="' + (p[1] + 4) + '" text-anchor="middle" class="sl">V' + (i + 1) + '</text>'; });
    return s + '</svg>';
  }

  /* ---------- Suchen ---------- */
  function binSearch(L, w){ var f = 0, l = L.length - 1, steps = []; while(f <= l){ var m = Math.floor((f + l) / 2); steps.push({ f: f, l: l, m: m, v: L[m] }); if(L[m] < w) f = m + 1; else if(L[m] === w) return { found: true, steps: steps }; else l = m - 1; } return { found: false, steps: steps }; }

  /* ---------- Generatoren ---------- */
  var GEN = [
    { k: "k-d2b", t: "Dezimal → Dual (Restverfahren)", make: function(){ var n = 20 + rnd(230); return { ask: "Wandle " + n + " in eine Dualzahl um.", check: function(v){ return v.replace(/\s/g, "") === digits(n, 2); }, sol: digits(n, 2),
      how: '<table class="ptab"><tbody>' + divTable(n, 2).map(function(r){ return '<tr><td>' + r[0] + ' : 2</td><td>= ' + r[1] + '</td><td>Rest <b>' + r[2] + '</b></td></tr>'; }).join("") + '</tbody></table><p class="dv">Reste von unten nach oben lesen: <b>' + digits(n, 2) + '₂</b></p>' }; } },
    { k: "k-b2d", t: "Dual → Dezimal (Stellenwerte)", make: function(){ var n = 20 + rnd(230), b = digits(n, 2); return { ask: "Wandle " + b + "₂ in eine Dezimalzahl um.", check: function(v){ return +v.trim() === n; }, sol: String(n),
      how: '<p class="dv">' + b.split("").map(function(c, i){ return c + "·2" + sup(b.length - 1 - i); }).join(" + ") + ' = ' + b.split("").map(function(c, i){ return +c * Math.pow(2, b.length - 1 - i); }).filter(Boolean).join(" + ") + ' = <b>' + n + '</b></p>' }; } },
    { k: "k-hex", t: "Hex ↔ Dual ↔ Dezimal", make: function(){ var n = 30 + rnd(990), h = digits(n, 16), b = digits(n, 2), dir = rnd(3);
      if(dir === 0) return { ask: "Wandle " + h + "₁₆ in eine Dualzahl um.", check: function(v){ return v.replace(/\s/g, "").replace(/^0+/, "") === b; }, sol: b, how: '<p class="dv">Jede Hex-Ziffer → 4 Bit: ' + h.split("").map(function(c){ return c + " = " + pad(parseInt(c, 16).toString(2), 4); }).join(" · ") + ' → <b>' + b + '₂</b></p>' };
      if(dir === 1) return { ask: "Wandle " + b + "₂ in eine Hexadezimalzahl um.", check: function(v){ return v.replace(/\s|0x/gi, "").toUpperCase().replace(/^0+/, "") === h; }, sol: h, how: '<p class="dv">Von rechts in 4er-Blöcke: ' + groups(b, 4).join(" | ") + ' → ' + groups(b, 4).map(function(g){ return parseInt(g, 2).toString(16).toUpperCase(); }).join(" ") + ' → <b>' + h + '₁₆</b></p>' };
      return { ask: "Wandle " + h + "₁₆ in eine Dezimalzahl um.", check: function(v){ return +v.trim() === n; }, sol: String(n), how: '<p class="dv">' + h.split("").map(function(c, i){ return parseInt(c, 16) + "·16" + sup(h.length - 1 - i); }).join(" + ") + ' = <b>' + n + '</b> (A = 10, B = 11, C = 12, D = 13, E = 14, F = 15)</p>' }; } },
    { k: "k-okt", t: "Dual ↔ Oktal", make: function(){ var n = 20 + rnd(480), o = digits(n, 8), b = digits(n, 2);
      return rnd(2) ? { ask: "Wandle " + b + "₂ in eine Oktalzahl um.", check: function(v){ return v.trim().replace(/^0+/, "") === o; }, sol: o, how: '<p class="dv">Von rechts in 3er-Blöcke: ' + groups(b, 3).join(" | ") + ' → <b>' + o + '₈</b></p>' }
        : { ask: "Wandle " + o + "₈ in eine Dualzahl um.", check: function(v){ return v.replace(/\s/g, "").replace(/^0+/, "") === b; }, sol: b, how: '<p class="dv">Jede Oktalziffer → 3 Bit: ' + o.split("").map(function(c){ return c + " = " + pad((+c).toString(2), 3); }).join(" · ") + ' → <b>' + b + '₂</b></p>' }; } },
    { k: "k-add", t: "Duale Addition", make: function(){ var a = 10 + rnd(100), b = 10 + rnd(100), s = digits(a + b, 2); return { ask: digits(a, 2) + "₂ + " + digits(b, 2) + "₂ = ?", check: function(v){ return v.replace(/\s/g, "").replace(/^0+(?=.)/, "") === s; }, sol: s,
      how: '<p class="dv">Stellenweise von rechts: 0+0 = 0 · 0+1 = 1 · 1+1 = 0 Übertrag 1 · 1+1+1 = 1 Übertrag 1.<br>' + digits(a, 2) + ' + ' + digits(b, 2) + ' = <b>' + s + '</b> (Kontrolle: ' + a + ' + ' + b + ' = ' + (a + b) + ')</p>' }; } },
    { k: "k-sub", t: "Subtraktion mit Zweierkomplement", make: function(){ var a = 30 + rnd(200), b = 5 + rnd(a - 5), A = digits(a, 2), B = digits(b, 2), z = subZK(A, B); return { ask: A + "₂ − " + B + "₂ = ? (mit Zweierkomplement)", check: function(v){ return v.replace(/\s/g, "").replace(/^0+(?=.)/, "") === z.res; }, sol: z.res,
      how: '<table class="ptab"><tbody><tr><td>b mit führenden Nullen</td><td><code>' + z.bb + '</code></td></tr><tr><td>Einserkomplement</td><td><code>' + z.one + '</code></td></tr><tr><td>Zweierkomplement (+1)</td><td><code>' + z.zk + '</code></td></tr><tr><td>a + Zweierkomplement</td><td><code>' + A + ' + ' + z.zk + ' = ' + z.sum + '</code></td></tr><tr><td>führende Eins streichen</td><td><b><code>' + z.res + '</code></b> (Kontrolle: ' + a + ' − ' + b + ' = ' + (a - b) + ')</td></tr></tbody></table>' }; } },
    { k: "k-logic", t: "Schaltung auswerten", make: function(){ var f = randExpr(), x = rnd(2), y = rnd(2), z = rnd(2), r = f[1](x, y, z); return { ask: f[0] + " für x = " + x + ", y = " + y + ", z = " + z + " ?", check: function(v){ return v.trim() === String(r); }, sol: String(r),
      how: '<p class="dv">Wahrheitstabelle der Formel:</p><table class="ptab"><thead><tr><th>x</th><th>y</th><th>z</th><th>' + esc(f[0]) + '</th></tr></thead><tbody>' + [0, 1].map(function(a){ return [0, 1].map(function(b){ return [0, 1].map(function(c){ var on = a === x && b === y && c === z; return '<tr' + (on ? ' style="background:var(--accent-soft)"' : '') + '><td>' + a + '</td><td>' + b + '</td><td>' + c + '</td><td><b>' + f[1](a, b, c) + '</b></td></tr>'; }).join(""); }).join(""); }).join("") + '</tbody></table>' }; } },
    { k: "k-va", t: "Volladdierer: r und u₂", make: function(){ var x = rnd(2), y = rnd(2), u = rnd(2), r = x ^ y ^ u, u2 = (x & y) | (u & (x ^ y)); return { ask: "x = " + x + ", y = " + y + ", u₁ = " + u + " → r und u₂? (Eingabe: r u₂, z. B. „1 0“)", check: function(v){ var m = v.match(/[01]/g) || []; return m.join("") === "" + r + u2; }, sol: r + " " + u2,
      how: '<p class="dv">r = x ⊕ y ⊕ u₁ = ' + x + ' ⊕ ' + y + ' ⊕ ' + u + ' = <b>' + r + '</b> (ungerade Anzahl Einsen?) · u₂ = (x ∧ y) ∨ (u₁ ∧ (x ⊕ y)) = <b>' + u2 + '</b> (mindestens zwei Einsen?)</p>' }; } },
    { k: "k-stack", t: "Stack und Queue", make: function(){ var st = rnd(2), ops = [], C = [], out = [], v = 1 + rnd(9);
      for(var i = 0; i < 7; i++){ if(C.length && Math.random() < .38){ var x = st ? C.pop() : C.shift(); out.push(x); ops.push(st ? "pop" : "dequeue"); } else { v += 1 + rnd(5); C.push(v); ops.push((st ? "push(" : "enqueue(") + v + ")"); } }
      return { ask: (st ? "Stack (LIFO)" : "Queue (FIFO)") + ", anfangs leer: " + ops.join(", ") + ". Welche Elemente bleiben übrig – " + (st ? "von unten nach oben" : "von vorne nach hinten") + "?", check: function(v){ return (v.match(/\d+/g) || []).join() === C.join(); }, sol: C.join(", ") || "(leer)",
        how: '<p class="dv">' + (st ? "LIFO: pop nimmt immer das zuletzt gepushte (oberste) Element." : "FIFO: dequeue nimmt immer das am längsten wartende (vorderste) Element.") + ' Entnommen in dieser Reihenfolge: ' + (out.join(", ") || "–") + ' · übrig: <b>' + (C.join(", ") || "leer") + '</b></p>' }; } },
    { k: "k-term", t: "Keller-Term mit den Axiomen K1–K4", make: function(){ var a = 10 + rnd(20), b = a + 1 + rnd(9), c = b + 1 + rnd(9), T = [
        ["top(push(push(createStack, " + a + "), " + b + "))", String(b), "K4: top(push(k, t)) = t"],
        ["top(pop(push(push(createStack, " + a + "), " + b + ")))", String(a), "K3: pop(push(k, " + b + ")) = push(createStack, " + a + "); dann K4"],
        ["empty(pop(push(createStack, " + a + ")))", "1", "K3 → createStack; K1: empty(createStack) = 1"],
        ["empty(push(createStack, " + a + "))", "0", "K2: empty(push(k, t)) = 0"],
        ["top(pop(push(push(push(createStack, " + a + "), " + b + "), " + c + ")))", String(b), "K3 entfernt " + c + ", K4 liefert " + b]
      ], t = pick(T); return { ask: t[0] + " = ?", check: function(v){ return v.trim() === t[1]; }, sol: t[1], how: '<p class="dv">' + t[2] + ' → <b>' + t[1] + '</b></p>' }; } },
    { k: "k-trav", t: "Suchbaum: Preorder, Inorder, Postorder", make: function(){ var keys = []; while(keys.length < 7){ var k = 1 + rnd(40); if(keys.indexOf(k) < 0) keys.push(k); } var t = bstInsert(keys), kind = rnd(3), names = ["Preorder (W-L-R)", "Inorder (L-W-R)", "Postorder (L-R-W)"], sol = [pre, ino, post][kind](t);
      return { pre: "Schlüssel der Reihe nach in einen leeren binären Suchbaum einfügen: " + keys.join(", ") + ".", ask: names[kind] + "-Durchlauf?", check: function(v){ return (v.match(/\d+/g) || []).join() === sol.join(); }, sol: sol.join(", "),
        how: treeSvg(t) + '<p class="dv">Preorder: ' + pre(t).join(", ") + '<br>Inorder: ' + ino(t).join(", ") + ' (beim Suchbaum immer sortiert!)<br>Postorder: ' + post(t).join(", ") + '<br>Höhe ' + height(t) + ', Blätter ' + leaves(t) + '</p>' }; } },
    { k: "k-adjm", t: "Adjazenzmatrix aufstellen", make: function(){ var n = 4, E = []; for(var i = 0; i < n; i++) for(var j = 0; j < n; j++) if(i !== j && Math.random() < .32) E.push([i, j]); if(!E.length) E.push([0, 1]);
      var M = []; for(i = 0; i < n; i++){ M.push([]); for(j = 0; j < n; j++) M[i].push(E.some(function(e){ return e[0] === i && e[1] === j; }) ? 1 : 0); }
      return { svg: graphSvg(n, E), matrix: n, ask: "Fülle die Adjazenzmatrix aus (Zeile = von, Spalte = nach).", checkM: function(v){ return v.every(function(r, i){ return r.every(function(x, j){ return x === M[i][j]; }); }); }, sol: "", how: '<table class="dtab"><thead><tr><th></th>' + M.map(function(_, j){ return '<th>V' + (j + 1) + '</th>'; }).join("") + '</tr></thead><tbody>' + M.map(function(r, i){ return '<tr><td>V' + (i + 1) + '</td>' + r.map(function(x){ return '<td>' + x + '</td>'; }).join("") + '</tr>'; }).join("") + '</tbody></table>' }; } },
    { k: "k-bin", t: "Binäre Suche: welche Elemente werden angesehen?", make: function(){ var L = []; var x = rnd(5); for(var i = 0; i < 11 + rnd(5); i++){ x += 1 + rnd(6); L.push(x); } var w = Math.random() < .75 ? pick(L) : L[rnd(L.length)] + 1, r = binSearch(L, w);
      return { ask: "L = [" + L.join(", ") + "], gesucht w = " + w + ". Mit middle = (first + last)/2 (ganzzahlig): Welche Werte L[middle] werden der Reihe nach verglichen?", check: function(v){ return (v.match(/\d+/g) || []).join() === r.steps.map(function(s){ return s.v; }).join(); }, sol: r.steps.map(function(s){ return s.v; }).join(", "),
        how: '<table class="ptab"><thead><tr><th>first</th><th>last</th><th>middle</th><th>L[middle]</th></tr></thead><tbody>' + r.steps.map(function(s){ return '<tr><td>' + s.f + '</td><td>' + s.l + '</td><td>' + s.m + '</td><td><b>' + s.v + '</b> ' + (s.v === w ? "= w → gefunden" : s.v < w ? "&lt; w → first = middle + 1" : "&gt; w → last = middle − 1") + '</td></tr>'; }).join("") + '</tbody></table><p class="dv">' + (r.found ? "Gefunden" : "Nicht enthalten (first > last)") + ' nach ' + r.steps.length + ' Vergleichen – höchstens etwa log₂(n) + 1.</p>' }; } }
  ];
  function sup(n){ return String(n).split("").map(function(c){ return "⁰¹²³⁴⁵⁶⁷⁸⁹"[+c]; }).join(""); }

  var LBST = [4, 9, 1, 14, 7, 15, 17, 12, 3, 21];
  P.kern = {
    tab: "K · Kernthemen",
    html: function(ui){
      var tm = bstMiddle(LBST), ti = bstInsert(LBST);
      return '<div class="sec" id="kern"><h2>Kernthemen – GDI01 und TGI01 <small>laut Modulbeschreibung prüfungsrelevant, in den alten Klausuren noch nicht</small></h2>' +
        '<div class="blk"><h3>Warum dieser Reiter?</h3><p>Die Übungsklausuren 2017/2020 nennen GDI01 nicht. Die heutige Modulbeschreibung TIIAPS listet aber GDI01 und als Kernthemen auch <b>Zahlensysteme, Schaltungen, Datentypen, Bäume und Graphen</b>. Diese Themen sind reines Handwerk und bringen schnelle Punkte – hier kompakt mit Generatoren.</p></div>' +
        '<div class="blk aw"><h3>Zahlensysteme – auswendig (GDI01 Kap. 4)</h3><ul class="pts">' +
          '<li><b>Dual → Dezimal:</b> Stellenwerte addieren: 1011₂ = 1·2³ + 0·2² + 1·2¹ + 1·2⁰ = 11.</li>' +
          '<li><b>Dezimal → Dual (Restverfahren):</b> fortlaufend durch 2 teilen, Reste notieren, <b>Reste von unten nach oben</b> lesen.</li>' +
          '<li><b>Hex ↔ Dual:</b> von rechts in <b>4er-Blöcke</b>, jeder Block eine Hex-Ziffer (A = 10 … F = 15). <b>Oktal ↔ Dual:</b> von rechts in <b>3er-Blöcke</b>.</li>' +
          '<li><b>Addition:</b> 1 + 1 = 0 Übertrag 1; 1 + 1 + 1 = 1 Übertrag 1.</li>' +
          '<li><b>Subtraktion a − b (a ≥ b):</b> b mit führenden Nullen auf die Länge von a bringen → Einserkomplement (Bits kippen) → +1 = Zweierkomplement → zu a addieren → <b>führende Eins streichen</b>. Falle: führende Nullen vergessen (Heft: 1001₂ − 1₂ ergibt sonst 10₂ statt 1000₂).</li>' +
          '<li><b>Zweierkomplement-Darstellung mit n Bit:</b> Bereich −2ⁿ⁻¹ … 2ⁿ⁻¹ − 1 (8 Bit: −128 … 127); darüber hinaus Überlauf.</li></ul></div>' +
        '<div class="blk aw"><h3>Schaltungen – auswendig (GDI01 Kap. 5)</h3><table class="ptab"><thead><tr><th>x</th><th>y</th><th>x ∧ y (UND)</th><th>x ∨ y (ODER)</th><th>x ⊕ y (XOR)</th><th>¬x</th></tr></thead><tbody>' +
          [[0, 0], [0, 1], [1, 0], [1, 1]].map(function(r){ return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + (r[0] & r[1]) + '</td><td>' + (r[0] | r[1]) + '</td><td>' + (r[0] ^ r[1]) + '</td><td>' + (1 - r[0]) + '</td></tr>'; }).join("") + '</tbody></table>' +
          '<p class="dv"><b>Halbaddierer:</b> r = x ⊕ y, u = x ∧ y (XOR + UND). <b>Volladdierer</b> aus zwei Halbaddierern und einem ODER: r = x ⊕ y ⊕ u₁ (1 bei ungerader Anzahl Einsen), u₂ = (x ∧ y) ∨ (u₁ ∧ (x ⊕ y)) (1 bei mindestens zwei Einsen). XOR = (x ∧ ¬y) ∨ (¬x ∧ y).</p>' +
          '<table class="ptab"><thead><tr><th>x</th><th>y</th><th>u₁</th><th>r</th><th>u₂</th></tr></thead><tbody>' + [0, 1].map(function(a){ return [0, 1].map(function(b){ return [0, 1].map(function(c){ return '<tr><td>' + a + '</td><td>' + b + '</td><td>' + c + '</td><td><b>' + (a ^ b ^ c) + '</b></td><td><b>' + ((a & b) | (c & (a ^ b))) + '</b></td></tr>'; }).join(""); }).join(""); }).join("") + '</tbody></table>' +
          '<p style="font-size:.88rem"><b>Von-Neumann-Rechner:</b> Steuerwerk + Rechenwerk (= CPU), Arbeitsspeicher für Programm und Daten, Ein-/Ausgabewerk, Bussystem · Befehlszyklus: Fetch → Decode → Execute.</p></div>' +
        '<div class="blk aw"><h3>Datentypen – auswendig (TGI01 Kap. 4)</h3><ul class="pts">' +
          '<li><b>ADT</b> = Signatur (Operationen) + Axiome – beschreibt das <b>Verhalten</b>, nicht die Implementierung (Array oder verkettete Liste ist egal). Prüfungsfalle!</li>' +
          '<li><b>Keller/Stack (LIFO):</b> push, pop, top, empty; Axiome K1 empty(createStack) = 1, K2 empty(push(k, t)) = 0, K3 pop(push(k, t)) = k, K4 top(push(k, t)) = t. Anwendung: Funktionsaufrufe, Klammerprüfung, Umwandlung in Postfix.</li>' +
          '<li><b>Schlange/Queue (FIFO):</b> enqueue hinten, dequeue vorne. Anwendung: Warteschlangen, Drucker, Breitensuche.</li></ul></div>' +
        '<div class="blk aw"><h3>Bäume und Graphen – auswendig (TGI01 Kap. 6)</h3><ul class="pts">' +
          '<li><b>Tiefe/Niveau</b> eines Knotens = Pfadlänge von der Wurzel · <b>Höhe</b> = längster Pfad · <b>Ordnung</b> = maximale Anzahl Söhne (Ordnung 2 = Binärbaum) – Achtung, „geordneter Baum“ ist etwas anderes.</li>' +
          '<li>Baum der Ordnung k und Höhe m hat höchstens <b>kᵐ Blätter</b> und höchstens 1 + k + … + kᵐ = (kᵐ⁺¹ − 1)/(k − 1) Knoten. Ein Baum hat keinen Zyklus.</li>' +
          '<li><b>Durchläufe:</b> Preorder W-L-R (Wurzel zuerst), Inorder L-W-R, Postorder L-R-W (Wurzel zuletzt). Inorder eines <b>Suchbaums</b> ist sortiert – nur dort!</li>' +
          '<li><b>Binärer Suchbaum:</b> links kleiner, rechts größer. Im Heft (TGI01 Kap. 6.1): ein Element „aus der Mitte“ als Wurzel, Rest in kleinere/größere Menge aufteilen und für jede Teilmenge wiederholen.</li>' +
          '<li><b>Adjazenzmatrix:</b> c<sub>ij</sub> = 1, wenn eine Kante von Vi nach Vj geht, sonst 0 (Zeile = von, Spalte = nach).</li>' +
          '<li><b>Suchen:</b> binäre Suche (sortierte Liste, middle = (first + last)/2, ≤ log₂ n Schritte) · Fibonacci-Suche (teilt an Fibonacci-Zahlen statt in der Mitte) · Interpolationssuche (schätzt die Position aus dem Wert, O(log log n) – nur bei gleichverteilten Werten).</li></ul>' +
          '<p style="font-size:.88rem;margin-bottom:.2rem"><b>Heft-Beispiel</b> {4, 9, 1, 14, 7, 15, 17, 12, 3, 21}: links nach Heft-Art (12 aus der Mitte als Wurzel), rechts durch Einfügen in der angegebenen Reihenfolge – beides sind gültige Suchbäume:</p><div class="awrap">' + treeSvg(tm) + treeSvg(ti) + '</div>' +
          '<p style="font-size:.86rem">Inorder (beide): ' + ino(tm).join(", ") + ' · Preorder links: ' + pre(tm).join(", ") + ' · Preorder rechts: ' + pre(ti).join(", ") + '</p></div>' +
        (D ? D.html("k", ui) : "") +
        '<div id="gen-kern"><h3 class="genh">Üben mit neuen Zahlen</h3>' + GEN.map(function(g){ return '<div class="gen" data-g="' + g.k + '"><h3>' + esc(g.t) + '</h3><div class="body"></div></div>'; }).join("") + '</div></div>';
    },
    init: function(root, ui){
      if(D) D.init(root, ui);
      GEN.forEach(function(g){
        var box = root.querySelector('[data-g="' + g.k + '"] .body');
        function task(){
          var t = g.make(), done = false;
          var inp = t.matrix ? '<table class="dtab mx"><thead><tr><th></th>' + Array.apply(null, Array(t.matrix)).map(function(_, j){ return '<th>V' + (j + 1) + '</th>'; }).join("") + '</tr></thead><tbody>' +
            Array.apply(null, Array(t.matrix)).map(function(_, i){ return '<tr><td>V' + (i + 1) + '</td>' + Array.apply(null, Array(t.matrix)).map(function(_, j){ return '<td><input data-i="' + i + '" data-j="' + j + '" maxlength="1" inputmode="numeric" style="width:2rem;text-align:center"></td>'; }).join("") + '</tr>'; }).join("") + '</tbody></table>'
            : '<input class="ans" placeholder="Antwort">';
          box.innerHTML = (t.pre ? '<div class="ask">' + esc(t.pre) + '</div>' : '') + (t.svg ? '<div class="awrap">' + t.svg + '</div>' : '') + '<div class="ask">' + esc(t.ask) + '</div>' + inp +
            '<div class="row"><button class="go chk">Prüfen</button><button class="go sec shw">Lösungsweg</button><button class="go sec nw">Neue Aufgabe</button><span class="score">' + ui.gscore(g.k) + '</span></div><div class="out"></div>';
          function check(){
            var ok;
            if(t.matrix){ var v = []; for(var i = 0; i < t.matrix; i++){ v.push([]); for(var j = 0; j < t.matrix; j++){ var e = box.querySelector('input[data-i="' + i + '"][data-j="' + j + '"]'); v[i].push(e.value.trim() === "1" ? 1 : 0); } } ok = t.checkM(v); }
            else ok = t.check(box.querySelector(".ans").value);
            if(!done){ ui.glog(g.k, ok); done = true; box.querySelector(".score").textContent = ui.gscore(g.k); }
            box.querySelector(".out").innerHTML = '<div class="fbk ' + (ok ? "ok" : "bad") + '">' + (ok ? "✓ Richtig." : "✗ Noch nicht." + (t.sol ? " Richtig: " + esc(t.sol) : "")) + '</div>' + (ok ? "" : t.how);
          }
          box.querySelector(".chk").onclick = check;
          box.querySelector(".shw").onclick = function(){ box.querySelector(".out").innerHTML = t.how; if(!done){ ui.glog(g.k, false); done = true; box.querySelector(".score").textContent = ui.gscore(g.k); } };
          box.querySelector(".nw").onclick = task;
          Array.prototype.forEach.call(box.querySelectorAll("input"), function(x){ x.addEventListener("keydown", function(e){ if(e.key === "Enter") check(); }); });
        }
        task();
      });
    }
  };
  P._kerntest = { GEN: GEN, subZK: subZK, bstMiddle: bstMiddle, bstInsert: bstInsert, pre: pre, ino: ino, post: post, binSearch: binSearch };
})();
