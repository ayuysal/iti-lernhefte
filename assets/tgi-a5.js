/* TGI-Klausurtrainer – Aufgabe 5 (Algorithmus-Analyse) nach TGI02 Kap. 5 und 6:
   Kostentabelle (Zeile · Anzahl · Konstante), Zeitfunktion T(n), Master-Theorem, Chip and Conquer, O-Notation. */
(function(){
  "use strict";
  var P = window.TGI_PARTS = window.TGI_PARTS || {};
  var D = P._defs;
  if(D) D.list.push(
    { id: "lbub", a: "a5", t: "Lower Bound / Upper Bound", d: "Sei eine Funktion f(n) gegeben. Die Funktionen g1(n) und g2(n) heißen Lower Bound bzw. Upper Bound, falls es ein n0 gibt, sodass für alle n ≥ n0 gilt: g1(n) ≤ f(n) ≤ g2(n).", q: "TGI02 Def. 6.1" },
    { id: "onot", a: "a5", t: "O-Notation", d: "O(f) = { g | g ist eine Funktion und es gibt ein n0 und eine Konstante c, sodass für alle n ≥ n0 gilt: g(n) ≤ c · f(n) }. O(f) ist die Menge aller Funktionen, die nicht schneller als f wachsen. Üblich (unsauber): g(n) = O(n²) statt g(n) ∈ O(n²).", q: "TGI02 Def. 6.2" },
    { id: "cases", a: "a5", t: "Worst, Best, Average Case", d: "WorstCase(n) = max { t(In) für alle Eingaben In der Länge n } · BestCase(n) = min { t(In) } · AverageCase(n) = Σ P(In) · t(In) (mit der Wahrscheinlichkeit gewichtet). Wenn nicht anders gefordert, betrachtet man den Worst Case.", q: "TGI02 Def. 6.3" },
    { id: "master", a: "a5", t: "Master-Theorem", d: "Ist T(n) = a · T(n/b) + O(n^k) mit a ≥ 1, b > 1, dann gilt: Fall 1: a < b^k → T(n) = O(n^k). Fall 2: a = b^k → T(n) = O(n^k · log n). Fall 3: a > b^k → T(n) = O(n^(log_b a)).", q: "TGI02 Satz 6.1" },
    { id: "chip", a: "a5", t: "Chip and Conquer / Chip and Be Conquered", d: "Ist T(n) = b · T(n − c) + f(n): Für b = 1 (Chip and Conquer, ein Aufruf mit um c verkleinerter Eingabe) gilt T(n) = O(n · f(n)) – genauer: das Integral von f, z. B. f = n → O(n²). Für b > 1 (Chip and Be Conquered, mehrere Aufrufe) gilt T(n) = O(b^(n/c)) – exponentiell.", q: "TGI02 Satz 6.2" }
  );

  function esc(s){ return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function tab(rows, head){
    return '<table class="ktab"><thead><tr><th>Zeile</th><th>Programmcode</th><th>Zeitkomplexität</th></tr></thead><tbody>' + (head ? '<tr class="kh"><td></td><td><code>' + esc(head[0]) + '</code></td><td>' + head[1] + '</td></tr>' : '') +
      rows.map(function(r, i){ return '<tr><td>' + (i + 1) + '.</td><td><code>' + esc(r[0]) + '</code></td><td>' + r[1] + '</td></tr>'; }).join("") + '</tbody></table>';
  }

  /* ---------- Musterlösungen der vier Klausuren ---------- */
  var K1 = tab([
    ["if (n < 3) return 5", "c<sub>1</sub>"],
    ["if (n < 5) return 7", "c<sub>2</sub>"],
    ["for (i = 1; i < n; i++) {", "n · c<sub>3</sub>"],
    ["   a = n + 3 + i", "(n − 1) · c<sub>4</sub>"],
    ["}", ""],
    ["a = a * berechne(n-3)", "T(n − 3) + c<sub>6</sub>"],
    ["return a", "c<sub>7</sub>"]
  ], ["berechne(n)", "T(n)"]);
  var K2 = tab([
    ["if (a == 0) return sum", "c<sub>1</sub>"],
    ["if (odd(a)) a++", "c<sub>2</sub>"],
    ["for (i = 1; i < a; i++) {", "n · c<sub>3</sub>"],
    ["  for (j = 1; j < (a/2); j++) {", "(n − 1) · n/2 · c<sub>4</sub>"],
    ["     sum = i + j", "(n − 1)(n/2 − 1) · c<sub>5</sub>"],
    ["  }", ""],
    ["}", ""],
    ["sum = berechne(a/3, sum)", "T(n/3) + c<sub>8</sub>"],
    ["return sum", "c<sub>9</sub>"]
  ], ["berechne(a, sum)", "T(n), n = a"]);
  var K3 = tab([
    ["if (A.size == 0) return 0", "c<sub>1</sub>"],
    ["for (i = 0; i < A.size; i++) {", "(n + 1) · c<sub>2</sub>"],
    ["  for (j = 0; j < A.size; j++) {", "n(n + 1) · c<sub>3</sub>"],
    ["    for (k = 0; k < A.size; k++) {", "n²(n + 1) · c<sub>4</sub>"],
    ["       sum += i + A[j] + k", "n³ · c<sub>5</sub>"],
    ["    }", ""],
    ["  }", ""],
    ["}", ""],
    ["sum = sum * sum", "c<sub>9</sub>"],
    ["return sum", "c<sub>10</sub>"]
  ], ["berechne(int[] A)", "T(n), n = A.size"]);
  var K4 = tab([
    ["if ( n = 1 ) return a[0]", "c<sub>1</sub>"],
    ["i = 0; j = 0; new array b, c", "c<sub>2</sub>"],
    ["for (int t = 0; t < n; t++)", "(n + 1) · c<sub>3</sub>"],
    ["   if t < n/2 then b[i] = a[t]; i++", "n · c<sub>4</sub>"],
    ["   if t >= n/2 then c[j] = a[t]; j++", "n · c<sub>5</sub>"],
    ["return ListenSumme(n/2, b) + ListenSumme(n/2, c)", "2 · T(n/2) + c<sub>6</sub>"]
  ], ["int ListenSumme(int n, int[] a)", "T(n)"]);

  /* ---------- Generatoren ---------- */
  function rnd(n){ return Math.floor(Math.random() * n); }
  function pick(a){ return a[rnd(a.length)]; }
  function npow(k){ return k === 0 ? "1" : k === 1 ? "n" : "n" + ["", "", "²", "³"][k]; }
  function cls(p, L){ // n^p · log^L n
    var s = p === 0 ? "" : p === 1 ? "n" : (p % 1 ? "n^" + p.toFixed(2).replace(".", ",") : "n" + ({ 2: "²", 3: "³", 4: "⁴" })[p]);
    if(L) s += (s ? " · " : "") + "log n";
    return "O(" + (s || "1") + ")";
  }
  var GEN = [
    { k: "master", t: "Master-Theorem: welcher Fall, welche Klasse?", make: function(){
      var a = pick([1, 2, 3, 4, 8, 9]), b = pick([2, 3, 4]), k = pick([0, 1, 2, 3]), bk = Math.pow(b, k);
      var f = a < bk ? 1 : a === bk ? 2 : 3, lg = Math.log(a) / Math.log(b);
      var res = f === 1 ? cls(k, 0) : f === 2 ? cls(k, 1) : cls(Math.abs(lg - Math.round(lg)) < 1e-9 ? Math.round(lg) : lg, 0);
      return { ask: "T(n) = " + (a === 1 ? "" : a + " · ") + "T(n/" + b + ") + " + (k === 0 ? "c" : npow(k)), opts: [["1", "Fall 1: a < bᵏ → O(nᵏ)"], ["2", "Fall 2: a = bᵏ → O(nᵏ · log n)"], ["3", "Fall 3: a > bᵏ → O(n^(log_b a))"]], sol: String(f),
        how: "a = " + a + ", b = " + b + ", k = " + k + " → bᵏ = " + b + (k ? "^" + k : "⁰") + " = " + bk + " → a " + (f === 1 ? "<" : f === 2 ? "=" : ">") + " bᵏ → <b>Fall " + f + "</b> → T(n) = <b>" + res + "</b>" + (f === 3 ? " (log_" + b + " " + a + " ≈ " + lg.toFixed(3).replace(".", ",") + ")" : "") };
    } },
    { k: "chip", t: "Chip and Conquer: Rekursion mit n − c", make: function(){
      var b = pick([1, 1, 1, 2, 3]), c = pick([1, 2, 3]), f = pick([["c", 0, 0], ["n", 1, 0], ["n²", 2, 0], ["log n", 0, 1]]);
      var sol = b > 1 ? "exp" : (f[2] ? "nlog" : ["n", "n2", "n3"][f[1]]);
      var res = b > 1 ? "O(" + b + "^(n/" + c + "))" : ({ n: "O(n)", n2: "O(n²)", n3: "O(n³)", nlog: "O(n · log n)" })[sol];
      return { ask: "T(n) = " + (b === 1 ? "" : b + " · ") + "T(n − " + c + ") + " + f[0], opts: [["n", "O(n)"], ["nlog", "O(n · log n)"], ["n2", "O(n²)"], ["n3", "O(n³)"], ["exp", "exponentiell O(bⁿᐟᶜ)"]], sol: sol,
        how: (b === 1 ? "b = 1 → <b>Chip and Conquer</b>: ein Aufruf, Eingabe wird um " + c + " kleiner → etwa n/" + c + " Ebenen, jede kostet bis zu f(n) = " + f[0] + " → T(n) = O(n · f(n))" : "b = " + b + " > 1 → <b>Chip and Be Conquered</b>: " + b + " Aufrufe pro Ebene, n/" + c + " Ebenen → " + b + "^(n/" + c + ") Aufrufe") + " = <b>" + res + "</b>" };
    } },
    { k: "onot", t: "O-Notation: stimmt die Aussage?", make: function(){
      var terms = [], maxp = 0, maxL = 0, used = {};
      var n = 2 + rnd(2);
      for(var i = 0; i < n; i++){ var p = pick([0, 1, 1, 2, 2, 3, 4]), L = p > 0 && Math.random() < .2 ? 1 : 0; var key = p + "_" + L; if(used[key]) continue; used[key] = 1; terms.push([pick([0.01, 2, 5, 8, 22, 100]), p, L]); if(p > maxp || (p === maxp && L > maxL)){ maxp = p; maxL = L; } }
      terms.sort(function(x, y){ return x[1] - y[1] || x[2] - y[2]; });
      var f = terms.map(function(t){ return String(t[0]).replace(".", ",") + (t[1] ? (t[1] === 1 ? "n" : "n" + ({ 2: "²", 3: "³", 4: "⁴" })[t[1]]) : "") + (t[2] ? " · log n" : ""); }).join(" + ");
      var gp = Math.max(0, maxp + pick([-1, 0, 0, 1, 2])), gL = pick([0, 0, 1]);
      if(gp === 0) gL = 0;
      var ok = maxp < gp || (maxp === gp && maxL <= gL);
      return { ask: "f(n) = " + f + " = " + cls(gp, gL) + " ?", opts: [["1", "stimmt"], ["0", "stimmt nicht"]], sol: ok ? "1" : "0",
        how: "Der am stärksten wachsende Term ist " + cls(maxp, maxL).slice(2, -1) + " → f(n) ∈ <b>" + cls(maxp, maxL) + "</b>. " + (ok ? "Die angegebene Klasse wächst mindestens so schnell → <b>stimmt</b>" + (maxp !== gp || maxL !== gL ? " (O ist eine obere Schranke; schärfer wäre " + cls(maxp, maxL) + ")" : "") + "." : "Die angegebene Klasse wächst langsamer → <b>stimmt nicht</b>, richtig: " + cls(maxp, maxL) + ".") };
    } },
    { k: "code", t: "Code lesen: welche Zeitkomplexität?", make: function(){
      var T = [
        { c: "def f(n) {\n  s = 0\n  for (i = 0; i < n; i++) {\n    s = s + i\n  }\n  return s\n}", r: "T(n) = c₁ + (n + 1)c₂ + n·c₃ + c₄ = d₁n + d₂", o: "n" },
        { c: "def f(n) {\n  for (i = 0; i < n; i++) {\n    for (j = 0; j < n; j++) {\n      s = s + i * j\n    }\n  }\n}", r: "innerer Rumpf n · n mal → T(n) = d₁n² + d₂n + d₃", o: "n2" },
        { c: "def f(n) {\n  for (i = 0; i < n; i++) {\n    for (j = 0; j < i; j++) {\n      s = s + j\n    }\n  }\n}", r: "innerer Rumpf 0 + 1 + … + (n − 1) = n(n − 1)/2 mal → T(n) = d₁n² + d₂n + d₃", o: "n2" },
        { c: "def f(n) {\n  for (i = 0; i < 5; i++) {\n    a = n + i\n  }\n  return a\n}", r: "Schleife hat feste Länge 5 – unabhängig von n → T(n) = c₁ + 6c₂ + 5c₃ = d", o: "1" },
        { c: "def f(n) {\n  i = 1\n  while (i < n) {\n    i = i * 2\n  }\n}", r: "i verdoppelt sich: 1, 2, 4, … → etwa log₂ n Durchläufe → T(n) = d₁·log n + d₂", o: "log" },
        { c: "def f(n) {\n  if (n <= 1) return 1\n  for (i = 0; i < n; i++) { s = s + i }\n  return f(n/2)\n}", r: "T(n) = T(n/2) + d·n → Master a = 1, b = 2, k = 1: 1 < 2 → Fall 1", o: "n" },
        { c: "def f(A) {\n  if (A.size() <= 1) return A\n  A.each { e -> … }          // n Schritte\n  return f(linke Hälfte) + f(rechte Hälfte)\n}", r: "T(n) = 2T(n/2) + d·n → Master a = 2, b = 2, k = 1: 2 = 2¹ → Fall 2 (wie MergeSort)", o: "nlog" },
        { c: "def f(n) {\n  if (n <= 0) return 0\n  for (i = 0; i < n; i++) { s = s + i }\n  return f(n-1)\n}", r: "T(n) = T(n − 1) + d·n → Chip and Conquer (b = 1) → O(n · n)", o: "n2" },
        { c: "def f(n) {\n  if (n <= 1) return 1\n  return f(n-1) + f(n-1)\n}", r: "T(n) = 2T(n − 1) + c → Chip and Be Conquered (b = 2, c = 1) → O(2ⁿ)", o: "exp" },
        { c: "def f(n) {\n  for (i = 0; i < n/2; i++) {\n    for (j = 0; j < n; j++) { s++ }\n  }\n}", r: "n/2 · n = n²/2 Durchläufe → T(n) = d₁n² + …", o: "n2" },
        { c: "def f(A) {\n  for (i = 0; i < A.size; i++)\n    for (j = 0; j < A.size; j++)\n      for (k = 0; k < A.size; k++)\n        s += A[i]*A[j]*A[k]\n}", r: "n · n · n Durchläufe → T(n) = d₁n³ + d₂n² + d₃n + d₄", o: "n3" },
        { c: "def f(n) {\n  if (n < 3) return 1\n  for (i = 0; i < n; i++) { s++ }\n  return f(n/3) + f(n/3) + f(n/3)\n}", r: "T(n) = 3T(n/3) + d·n → Master a = 3, b = 3, k = 1: 3 = 3¹ → Fall 2", o: "nlog" }
      ], t = pick(T);
      return { code: t.c, ask: "Zeitkomplexität im Worst Case?", opts: [["1", "O(1)"], ["log", "O(log n)"], ["n", "O(n)"], ["nlog", "O(n · log n)"], ["n2", "O(n²)"], ["n3", "O(n³)"], ["exp", "O(2ⁿ)"]], sol: t.o, how: t.r + " → <b>" + ({ 1: "O(1)", log: "O(log n)", n: "O(n)", nlog: "O(n · log n)", n2: "O(n²)", n3: "O(n³)", exp: "O(2ⁿ)" })[t.o] + "</b>" };
    } }
  ];

  P.a5 = {
    tab: "5 · Analyse",
    html: function(ui){
      return '<div class="sec" id="a5"><h2>Aufgabe 5 · Algorithmus-Analyse <small>TGI02 Kap. 5 und 6</small></h2>' +
        '<div class="blk"><h3>So wird gefragt</h3>' +
          '<div class="q"><i>2020/1–3</i>Gegeben ist Groovy-Code in einer Tabelle mit leerer rechter Spalte. „Führen Sie eine Analyse zur Zeitkomplexität durch. Füllen Sie die gegebene Tabelle aus. Geben Sie die Zeitfunktion in expliziter (nicht-rekursiver) Form an.“ – jedes Jahr, mal mit Rekursion n − 3, mal n/3, mal drei geschachtelte Schleifen.</div>' +
          '<div class="q"><i>2017</i>Zeitfunktion T(n) einer rekursiven ListenSumme explizit angeben · eine umgeschriebene Version mit nur einem rekursiven Aufruf bewerten · vier O-Aussagen prüfen und korrigieren.</div></div>' +
        '<div class="blk aw"><h3>Das Rezept – auswendig</h3><ol class="pts" style="padding-left:1.3rem">' +
          '<li><b>n festlegen:</b> Was bestimmt die Laufzeit? Die Listenlänge, oder der Parameter, der in Schleifengrenzen steht (bei berechne(a, b) mit Schleife bis a → n = a).</li>' +
          '<li><b>Jede Zeile = Anzahl der Ausführungen · Konstante c<sub>i</sub>.</b> Einfache Anweisung und if am Anfang: c<sub>i</sub> (Worst Case: das frühe return greift nicht).</li>' +
          '<li><b>Schleifen:</b> Der <b>Kopf</b> wird einmal öfter geprüft als der Rumpf läuft (letzter Test bricht ab) – im Heft: while (i &lt; 11) → 11c₂, Rumpf 10c₃. for (i = 0; i &lt; n; …) → Kopf (n + 1)c, Rumpf n·c. Bei <code>(0..n-1).each</code> schreibt das Heft einfach n·c. Für das Ergebnis in O ist das egal.</li>' +
          '<li><b>Geschachtelt:</b> Anzahlen multiplizieren (n · n). Hängt die innere Grenze von i ab (j &lt; i): aufsummieren, 0 + 1 + … + (n − 1) = n(n − 1)/2.</li>' +
          '<li><b>Rekursiver Aufruf:</b> in die Zeile T(neue Größe) schreiben – T(n/2), T(n − 3), 2 · T(n/2) …</li>' +
          '<li><b>Zusammenfassen:</b> T(n) = Summe aller Zeilen, Konstanten zu d<sub>1</sub>, d<sub>2</sub> … bündeln, z. B. T(n) = T(n − 3) + d<sub>1</sub>n + d<sub>2</sub>.</li>' +
          '<li><b>Explizit machen:</b> Rekursion n/b → <b>Master-Theorem</b>; Rekursion n − c → <b>Chip and Conquer</b>; keine Rekursion → größter Term. Ergebnis als O(…).</li></ol>' +
          '<table class="ptab" style="margin-top:.6rem"><tbody><tr><td><b>Master</b><br>T(n) = a·T(n/b) + nᵏ</td><td>a &lt; bᵏ → O(nᵏ) · a = bᵏ → O(nᵏ · log n) · a &gt; bᵏ → O(n^(log_b a))</td></tr>' +
          '<tr><td><b>Chip and Conquer</b><br>T(n) = T(n − c) + f(n)</td><td>ein Aufruf → O(n · f(n)): f = c → O(n), f = n → O(n²), f = n² → O(n³), f = log n → O(n · log n)</td></tr>' +
          '<tr><td><b>Chip and Be Conquered</b><br>T(n) = b·T(n − c) + f(n), b &gt; 1</td><td>exponentiell: O(b^(n/c)), z. B. 2T(n − 3) + n → O(2^(n/3))</td></tr>' +
          '<tr><td><b>Klassen</b> (aufsteigend)</td><td>O(1) &lt; O(log n) &lt; O(n) &lt; O(n · log n) &lt; O(n²) &lt; O(n³) &lt; O(2ⁿ) &lt; O(n!)</td></tr></tbody></table></div>' +
        (D ? D.html("a5", ui) : "") +
        '<div class="blk"><h3>Musterlösung 2020/1 – Rekursion mit n − 3</h3>' + K1 +
          '<p class="dv">T(n) = c₁ + c₂ + n·c₃ + (n − 1)·c₄ + T(n − 3) + c₆ + c₇<br>T(n) = T(n − 3) + (c₃ + c₄)·n + (c₁ + c₂ − c₄ + c₆ + c₇) = <b>T(n − 3) + d₁n + d₂</b></p>' +
          '<p class="dv"><b>Explizit:</b> Einsetzen bis zum Abbruch (n &lt; 3), etwa n/3 Schritte:<br>T(n) = d₁(n + (n − 3) + (n − 6) + … ) + d₂·n/3 + c ≈ d₁·n²/6 + d₃·n + d₄<br>Chip and Conquer (ein Aufruf, b = 1) mit f(n) = d₁n + d₂ → <b>T(n) = O(n²)</b></p></div>' +
        '<div class="blk"><h3>Musterlösung 2020/2 – Rekursion mit n/3, geschachtelte Schleife</h3>' + K2 +
          '<p class="dv">n = a. Äußere Schleife n − 1 Durchläufe, innere jeweils etwa n/2 → zusammen etwa n²/2 Ausführungen der Zeile 5.<br>T(n) = <b>T(n/3) + d₁n² + d₂n + d₃</b></p>' +
          '<p class="dv"><b>Explizit mit Master-Theorem:</b> a = 1, b = 3, k = 2 → bᵏ = 9 → a = 1 &lt; 9 → Fall 1 → <b>T(n) = O(n²)</b><br>(Anschaulich: n² + (n/3)² + (n/9)² + … = n²·(1 + 1/9 + 1/81 + …) = 9/8·n² – geometrische Reihe.)</p></div>' +
        '<div class="blk"><h3>Musterlösung 2020/3 – drei geschachtelte Schleifen</h3>' + K3 +
          '<p class="dv">T(n) = c₁ + (n + 1)c₂ + n(n + 1)c₃ + n²(n + 1)c₄ + n³c₅ + c₉ + c₁₀<br>T(n) = <b>(c₄ + c₅)·n³ + (c₃ + c₄)·n² + (c₂ + c₃)·n + (c₁ + c₂ + c₉ + c₁₀) = d₁n³ + d₂n² + d₃n + d₄</b><br>Keine Rekursion – das ist schon die explizite Form. → <b>T(n) = O(n³)</b></p></div>' +
        '<div class="blk"><h3>Musterlösung 2017 – ListenSumme</h3>' + K4 +
          '<p class="dv"><b>a)</b> T(n) = 2·T(n/2) + d₁n + d₂. Master: a = 2, b = 2, k = 1 → bᵏ = 2 = a → Fall 2 → <b>T(n) = O(n · log n)</b>.<br>Explizit für n = 2ᵏ (Einsetzen): T(n) = 2ᵏ·T(1) + k·d₁n + (2ᵏ − 1)d₂ = <b>d₁·n·log₂n + (c₁ + d₂)·n − d₂</b>.</p>' +
          '<p class="dv"><b>b) ListenSumme2</b> ruft sich nur einmal auf, aber mit n − 1 und einer Schleife über n − 1 Elemente: T(n) = T(n − 1) + d·n → Chip and Conquer → <b>O(n²)</b>. Ein Aufruf weniger, aber <b>schlechter</b> als O(n · log n), weil die Eingabe nur um 1 statt um die Hälfte kleiner wird. Nebenbei: <code>last = a[n]</code> liegt außerhalb der Liste (Indizes 0 … n − 1) – richtig wäre a[n − 1].</p>' +
          '<p class="dv"><b>c)</b> 22n² = O(n⁴): <b>stimmt</b> (O ist obere Schranke; schärfer O(n²)) · 100n + 0,01n² = O(n): <b>falsch</b> → O(n²) · 5n + 8n² + 100n³ = O(n² log n): <b>falsch</b> → O(n³) · O(f(n) + g(n)) = O(f(n)) + O(g(n)): <b>stimmt</b> (= O(max(f, g)), der größere Summand bestimmt die Klasse).</p></div>' +
        '<div id="gen-a5"><h3 class="genh">Üben mit neuen Aufgaben</h3>' + GEN.map(function(g){ return '<div class="gen" data-g="' + g.k + '"><h3>' + esc(g.t) + '</h3><div class="body"></div></div>'; }).join("") + '</div></div>';
    },
    init: function(root, ui){
      if(D) D.init(root, ui);
      GEN.forEach(function(g){
        var box = root.querySelector('[data-g="' + g.k + '"] .body');
        function task(){
          var t = g.make(), done = false;
          box.innerHTML = (t.code ? '<pre class="txtb">' + esc(t.code) + '</pre>' : '') + '<div class="ask">' + esc(t.ask) + '</div><div class="row">' + t.opts.map(function(o){ return '<button class="go sec ch" data-v="' + o[0] + '">' + esc(o[1]) + '</button>'; }).join("") +
            '<span class="score">' + ui.gscore(g.k) + '</span></div><div class="out"></div>';
          Array.prototype.forEach.call(box.querySelectorAll(".ch"), function(c){ c.onclick = function(){
            if(done) return; done = true;
            var ok = c.getAttribute("data-v") === t.sol; ui.glog(g.k, ok); box.querySelector(".score").textContent = ui.gscore(g.k);
            Array.prototype.forEach.call(box.querySelectorAll(".ch"), function(x){ if(x.getAttribute("data-v") === t.sol) x.classList.add("rok"); else if(x === c) x.classList.add("rbad"); x.disabled = true; });
            box.querySelector(".out").innerHTML = '<div class="fbk ' + (ok ? "ok" : "bad") + '">' + (ok ? "✓ " : "✗ ") + t.how + '</div><div class="row"><button class="go nx">Nächste →</button></div>';
            box.querySelector(".nx").onclick = task;
          }; });
        }
        task();
      });
    }
  };
})();
