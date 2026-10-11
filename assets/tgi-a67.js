/* TGI-Klausurtrainer – Aufgabe 6 (Berechenbarkeit: Chomsky-Klasse zuordnen und beweisen) und
   Aufgabe 7 (Formale Sprachen: Automaten lesen, bauen, minimieren). Notation wie TGI06/TGI07:
   Grammatik G = (N, T, P, s), Automat M = (Q, Σ, δ, q0, E). Alle Musterlösungen mit tgi-auto.js nachgerechnet. */
(function(){
  "use strict";
  var P = window.TGI_PARTS = window.TGI_PARTS || {}, D = P._defs, X = window.TGIAuto;
  function esc(s){ return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function rnd(n){ return Math.floor(Math.random() * n); }
  function pick(a){ return a[rnd(a.length)]; }

  if(D) D.list.push(
    { id: "gram", a: "a6", t: "Formale Grammatik", d: "Eine Grammatik ist ein Quadrupel G = (N, T, P, s): N endliche Menge der Nichtterminale, T endliche Menge der Terminale (N ∩ T = ∅), P endliche Menge der Produktionsregeln α → β, s ∈ N das Startsymbol (Spitzensymbol). L(G) ist die Menge aller Wörter aus T*, die sich aus s ableiten lassen.", q: "TGI06 Kap. 2" },
    { id: "chom", a: "a6", t: "Chomsky-Typen 0–3", d: "Typ 0 (unbeschränkt): keine Einschränkung. Typ 1 (kontextsensitiv): wie Typ 0 und zusätzlich längenmonotone Regeln |α| ≤ |β|; Ausnahme s → ε, wenn s auf keiner rechten Seite steht. Typ 2 (kontextfrei): wie Typ 1 und zusätzlich links genau ein Nichtterminal (A → β); Regeln A → ε sind erlaubt. Typ 3 (regulär): wie Typ 2 und zusätzlich nur rechtslineare Regeln A → aB | a (oder nur linkslineare A → Ba | a). Es gilt Typ 3 ⊂ Typ 2 ⊂ Typ 1 ⊂ Typ 0.", q: "TGI06 Tab. 2.1" },
    { id: "wort", a: "a6", t: "Wortproblem", d: "Gehört ein gegebenes Wort w zu L(G)? Das Wortproblem ist für Typ-1-, 2- und 3-Sprachen entscheidbar, jedoch nicht für Sprachen vom Typ 0 (Grund: Typ-0-Grammatiken müssen nicht längenmonoton sein, das Suchverfahren terminiert nicht).", q: "TGI06 Satz 2.4" },
    { id: "rekauf", a: "a6", t: "rekursiv aufzählbar · entscheidbar", d: "Eine Sprache heißt rekursiv aufzählbar (semientscheidbar), wenn es eine deterministische Turingmaschine M mit L = L(M) gibt – genau die Typ-0-Sprachen. Hält M für jedes Wort (akzeptierend oder ablehnend), heißt L rekursiv (entscheidbar). Es gilt L(Typ 1) ⊆ L(rekursiv) ⊆ L(rekursiv aufzählbar).", q: "TGI07 Def. 4.4/4.5" },
    { id: "mehrd", a: "a7", t: "Mehrdeutigkeit", d: "Eine kfG ist mehrdeutig, wenn es ein Wort in L(G) gibt, das (mindestens) zwei Linksableitungen besitzt (zwei verschiedene Ableitungsbäume). Andernfalls ist sie eindeutig. Eine Sprache ist inhärent mehrdeutig, wenn es keine eindeutige kfG für sie gibt.", q: "TGI06 Def. 2.6" },
    { id: "dea", a: "a7", t: "DEA", d: "Ein deterministischer endlicher Automat ist ein Quintupel M = (Q, Σ, δ, q0, E): Q endliche Menge der Zustände, Σ Eingabealphabet, δ: Q × Σ → Q Überführungsfunktion (TOTAL – für jeden Zustand und jedes Zeichen genau ein Folgezustand), q0 ∈ Q Startzustand, E ⊆ Q Menge der Endzustände. Ein Wort wird akzeptiert, wenn der Automat nach dem Lesen in einem Endzustand ist.", q: "TGI06 Def. DEA" },
    { id: "nea", a: "a7", t: "NEA", d: "Ein nichtdeterministischer endlicher Automat M = (Q, Σ, δ, q0, E) hat dieselben Bestandteile, aber δ: Q × Σ → P(Q) – zu Zustand und Zeichen eine MENGE von Folgezuständen (auch mehrere oder keiner = verbotener Übergang). Ein Wort wird akzeptiert, wenn mindestens ein Weg in einem Endzustand endet. NEA und DEA sind gleich mächtig (Potenzmengenkonstruktion).", q: "TGI06 Def. 4.5" },
    { id: "minim", a: "a7", t: "Minimalautomat", d: "Der Minimalautomat ist der DEA mit der geringsten Zustandsanzahl für eine reguläre Sprache L – er ist bis auf Zustandsnamen eindeutig. Zwei Zustände z, z′ sind verschmelzbar, wenn für alle Wörter x gilt: δ̂(z, x) ∈ E ⇔ δ̂(z′, x) ∈ E. Verfahren (Hopcroft/Ullman): alle Zustandspaare in eine Matrix; Paare aus End- und Nicht-Endzustand markieren; dann wiederholt Paare markieren, die mit einem Zeichen in ein markiertes Paar führen; unmarkierte Paare verschmelzen.", q: "TGI06 Kap. 4.6" }
  );

  /* ---------- Sprachen und ihre Klassen (Quiz + Nachschlagen) ---------- */
  var SPR = [
    ["{aⁿbⁿ | n ≥ 0}", 2, "kfG: S → aSb | ε. Nicht regulär: ein endlicher Automat kann sich n für beliebig große n nicht merken."],
    ["{aⁿbⁿcⁿ | n ≥ 1}", 1, "Zwei Zählungen gleichzeitig (a gegen b UND b gegen c) – ein Keller reicht nicht. Längenmonotone Grammatik: S → aSBC | aBC, CB → BC, aB → ab, bB → bb, bC → bc, cC → cc."],
    ["alle Wörter über {a, b} mit gerader Anzahl a", 3, "DEA mit 2 Zuständen (gerade/ungerade), b ändert nichts."],
    ["alle Wörter über {a, b}, die auf ab enden", 3, "regulärer Ausdruck (a|b)*ab, NEA mit 3 Zuständen."],
    ["Palindrome über {a, b}", 2, "kfG: S → aSa | bSb | a | b | ε. Nicht regulär (Mitte nicht erkennbar, Anzahl unbeschränkt). Nicht einmal deterministisch kontextfrei."],
    ["{ww | w ∈ {a, b}*}", 1, "Kopie vergleichen braucht eher eine Warteschlange als einen Stapel → nicht kontextfrei, aber kontextsensitiv (LBTM)."],
    ["korrekt geklammerte Ausdrücke (( ) ( ( ) ))", 2, "kfG: S → (S)S | ε. Nicht regulär – Schachtelungstiefe unbeschränkt."],
    ["{aⁿ | n ≥ 0}", 3, "a*, DEA mit einem Zustand."],
    ["{aⁿbᵐ | n, m ≥ 0}", 3, "a*b* – kein Vergleich der Anzahlen nötig."],
    ["{aⁿbᵐ | n > m ≥ 0}", 2, "kfG: S → aS | aT, T → aTb | ε. Vergleich zweier Anzahlen → nicht regulär."],
    ["{aⁿbᵐcⁿ | n, m ≥ 0}", 2, "kfG: S → aSc | B, B → bB | ε. Nur EIN Vergleich (a gegen c)."],
    ["{aⁿbⁿ | 0 ≤ n ≤ 100}", 3, "Endliche Sprache! Jede endliche Sprache ist regulär – Wörter einfach aufzählen."],
    ["Bezeichner: Buchstabe, dann beliebig Buchstaben/Ziffern", 3, "B(B|Z)* – Scanner/Lexer arbeiten mit endlichen Automaten."],
    ["Binärzahlen, die durch 3 teilbar sind", 3, "DEA mit 3 Zuständen für den Rest 0, 1, 2."],
    ["{aᵖ | p ist Primzahl}", 1, "Entscheidbar, aber weder regulär noch kontextfrei → kontextsensitiv (LBTM kann teilen)."],
    ["Halteproblem: {(M, w) | Turingmaschine M hält auf w}", 0, "Rekursiv aufzählbar (Typ 0: einfach simulieren), aber NICHT entscheidbar."],
    ["Wörter mit gleich vielen a wie b", 2, "kfG: S → aSbS | bSaS | ε. Zählen nötig → nicht regulär."],
    ["{x | x ∈ ℕ, x Primzahl kleiner 20} (2020/1)", 3, "Endlich: 2, 3, 5, 7, 11, 13, 17, 19 → regulär."],
    ["{aⁿb³c²ⁿ | n ≥ 0} (2020/1)", 2, "kfG: S → aScc | bbb. Vergleich a gegen c → nicht regulär."],
    ["{w ∈ {a, b}* | erstes und letztes Zeichen verschieden} (2017, 2020/2)", 3, "a(a|b)*b | b(a|b)*a – nur Anfang merken."],
    ["{aⁿbᵐaⁿ | n, m > 0} (2017)", 2, "kfG: S → aSa | aBa, B → bB | b."],
    ["korrekte E-Mail-Adressen (2020/2)", 3, "Muster Name@Domain.Endung als regulärer Ausdruck – nichts muss gezählt werden."],
    ["{aⁿbᵐcⁿdᵐ | n, m ≥ 1}", 1, "Zwei überkreuzte Vergleiche (a–c und b–d) – ein Keller kann das nicht."],
    ["{aⁱbʲcᵏ | i = j oder j = k}", 2, "kontextfrei (Vereinigung zweier kfS), sogar inhärent mehrdeutig."]
  ];
  var TYPN = { 0: "Typ 0 – rekursiv aufzählbar", 1: "Typ 1 – kontextsensitiv", 2: "Typ 2 – kontextfrei", 3: "Typ 3 – regulär" };

  /* Grammatik-Typ-Generator: Regeln aus Pools, Typ wird nachgerechnet */
  function randGrammar(){
    var target = rnd(4), N = ["S", "A", "B"], P = [];
    var p3 = [["S", "aA"], ["S", "bB"], ["A", "aA"], ["A", "b"], ["B", "bB"], ["B", "a"], ["S", "a"], ["A", "bS"]];
    var p2 = [["S", "aSb"], ["S", "AB"], ["A", "aAb"], ["B", "bBa"], ["S", "ab"], ["A", "SS"], ["B", "ε"]];
    var p1 = [["AB", "BA"], ["aB", "ab"], ["bA", "bba"], ["SA", "aSA"]];
    var p0 = [["AB", "a"], ["aA", "b"], ["BA", "ε"]];
    for(var i = 0; i < 3; i++) P.push(pick(p3));
    if(target <= 2) P.push(pick(p2));
    if(target <= 1) P.push(pick(p1));
    if(target === 0) P.push(pick(p0));
    var seen = {}; P = P.filter(function(r){ var k = r.join("→"); if(seen[k]) return false; seen[k] = 1; return true; });
    P.sort(function(a, b){ return (a[0] === "S" ? 0 : 1) - (b[0] === "S" ? 0 : 1); });
    var G = { N: N, T: ["a", "b"], s: "S", P: P.map(function(r){ return [r[0], r[1] === "ε" ? "" : r[1]]; }) };
    return G;
  }
  function gReason(G){
    var isN = function(c){ return G.N.indexOf(c) >= 0; }, isT = function(c){ return G.T.indexOf(c) >= 0; }, t = X.gType(G), out = [];
    function show(r){ return r[0] + " → " + (r[1] || "ε"); }
    var b0 = G.P.filter(function(r){ return r[1].length < r[0].length && !(r[0] === G.s && r[1] === ""); })[0];
    var b2 = G.P.filter(function(r){ return !(r[0].length === 1 && isN(r[0])); })[0];
    var b3 = G.P.filter(function(r){ var b = r[1]; if(b === "") return r[0] !== G.s; return !((b.length === 1 && isT(b)) || (b.length === 2 && isT(b[0]) && isN(b[1]))); })[0];
    if(t <= 2 && b3) out.push("nicht Typ 3, weil " + show(b3) + " nicht die Form A → aB oder A → a hat");
    if(t <= 1 && b2) out.push("nicht Typ 2, weil links von " + show(b2) + " nicht genau ein Nichtterminal steht");
    if(t === 0 && b0) out.push("nicht Typ 1, weil " + show(b0) + " verkürzt (nicht längenmonoton)");
    if(t === 3) out.push("alle Regeln haben die Form A → aB oder A → a");
    if(t === 2 && !b2) out.push("links steht überall genau ein Nichtterminal");
    if(t === 1) out.push("alle Regeln sind längenmonoton (|links| ≤ |rechts|)");
    return out.join("; ");
  }
  function gStr(G){ return "G = ({" + G.N.join(", ") + "}, {" + G.T.join(", ") + "}, P, " + G.s + ") mit P: " + G.P.map(function(r){ return r[0] + " → " + (r[1] || "ε"); }).join(", "); }

  /* ---------- Feste Automaten der Klausuren ---------- */
  var M201 = { Q: ["S", "A", "B", "Q"], S: ["a", "b"], q0: "S", E: ["Q"], d: { S: { a: ["A"], b: ["B"] }, A: { a: ["A"], b: ["A", "Q"] }, B: { a: ["B"], b: ["B", "A"] } } };
  var P201 = { S: [70, 70], A: [250, 70], Q: [430, 70], B: [250, 175, "u"] };
  var MA3B = { Q: ["q0", "q1", "q2", "q3", "qF"], S: ["a", "b"], q0: "q0", E: ["q3"], d: { q0: { a: ["q1"], b: ["qF"] }, q1: { a: ["q2"], b: ["qF"] }, q2: { a: ["q3"], b: ["qF"] }, q3: { a: ["qF"], b: ["q3"] }, qF: { a: ["qF"], b: ["qF"] } } };
  var PA3B = { q0: [70, 70], q1: [180, 70], q2: [290, 70], q3: [400, 70], qF: [235, 175, "u"] };
  var M202 = { Q: ["q0", "q1", "q2", "q3", "q4", "q5"], S: ["a", "b"], q0: "q0", E: ["q4", "q5"], d: { q0: { a: ["q2"], b: ["q1"] }, q1: { a: ["q4"], b: ["q1"] }, q2: { a: ["q2"], b: ["q3"] }, q3: { a: ["q4"], b: ["q5"] }, q4: { a: ["q2"], b: ["q3"] }, q5: { a: ["q4"], b: ["q5"] } } };
  var P202 = { q0: [70, 110], q1: [200, 190, "u"], q2: [200, 50], q3: [340, 50], q4: [340, 190, "u"], q5: [470, 120] };
  var M203 = { Q: ["S0", "S1", "S2", "S3", "F"], S: ["0", "1"], q0: "S0", E: ["S3"], d: { S0: { 0: ["S1"], 1: ["F"] }, S1: { 0: ["F"], 1: ["S2"] }, S2: { 0: ["S2"], 1: ["S3"] }, S3: { 0: ["S3"], 1: ["S3"] }, F: { 0: ["F"], 1: ["F"] } } };
  var P203 = { S0: [70, 70], S1: [180, 70], S2: [290, 70], S3: [400, 70], F: [180, 175, "u"] };
  var N17 = { Q: ["S", "H1", "B", "T", "H2"], S: ["a", "b"], q0: "S", E: ["B", "T"], d: { S: { a: ["S", "H1", "B"] }, H1: { b: ["S"] }, B: { a: ["B", "H2"] }, T: { a: ["H2"] }, H2: { b: ["T"] } } };
  var P17 = { S: [70, 110, "u"], H1: [70, 30, "u"], B: [220, 110], H2: [360, 110, "u"], T: [490, 110] };

  function auto(M, pos, opt){ return '<div class="awrap">' + X.svg(M, pos, opt) + '<div>' + X.table(M) + '<p class="tup">' + esc(X.tuple(M)) + '</p></div></div>'; }
  function minHtml(M){
    var r = X.minimize(M), Q = M.Q;
    var h = '<table class="mtab"><tbody>';
    for(var i = 1; i < Q.length; i++){
      h += '<tr><th>' + Q[i] + '</th>';
      for(var j = 0; j < Q.length - 1; j++){
        if(j >= i){ h += '<td class="nx"></td>'; continue; }
        var k = r.pk(Q[i], Q[j]), rd = -1; r.rounds.forEach(function(rr, ri){ if(rr.indexOf(k) >= 0) rd = ri; });
        h += '<td class="' + (r.mark[k] ? "mk" : "um") + '" title="' + esc(r.why[k] || "verschmelzbar") + '">' + (r.mark[k] ? "x" + (rd + 1) : "–") + '</td>';
      }
      h += '</tr>';
    }
    h += '<tr><th></th>' + Q.slice(0, -1).map(function(q){ return '<th>' + q + '</th>'; }).join("") + '</tr></tbody></table>';
    h += '<ol class="pts" style="font-size:.85rem">' + r.rounds.map(function(rr, ri){ return '<li><b>Runde ' + (ri + 1) + ':</b> ' + rr.map(function(k){ return "(" + k.replace("|", ", ") + ") – " + esc(r.why[k]); }).join(" · ") + '</li>'; }).join("") + '</ol>';
    var merged = r.groups.filter(function(g){ return g.length > 1; });
    return h + '<p class="dv">' + (merged.length ? "Verschmelzen: " + merged.map(function(g){ return "{" + g.join(", ") + "}"; }).join(", ") + " → " + r.groups.length + " Zustände." : "Alle Paare markiert → nichts verschmelzbar, der Automat ist bereits <b>minimal</b> (" + r.groups.length + " Zustände).") + '</p>';
  }

  /* ---------- Aufgabe 6 ---------- */
  P.a6 = {
    tab: "6 · Berechenbarkeit",
    html: function(ui){
      return '<div class="sec" id="a6"><h2>Aufgabe 6 · Berechenbarkeit – Chomsky-Klassen <small>TGI06 Kap. 2 · TGI07 Kap. 1, 4</small></h2>' +
        '<div class="blk"><h3>So wird gefragt</h3>' +
          '<div class="q"><i>2020/1</i>Ordnen Sie L₁ = {x | x ∈ ℕ, x Primzahl kleiner 20} und L₂ = {aⁿb³c²ⁿ | n ≥ 0} ihrer minimalen Sprachklasse in der Chomsky-Hierarchie zu. Beweisen Sie die Zugehörigkeit.</div>' +
          '<div class="q"><i>2020/2</i>Dasselbe für L₁ = {w | w ist eine korrekte E-Mail-Adresse} und L₂ = {w ∈ {a, b}* | w beginnt anders als es aufhört}.</div>' +
          '<div class="q"><i>2020/3</i>Geben Sie die Berechenbarkeitshierarchie (Hierarchie aller Sprachklassen) und für drei Klassen ein Beispiel.</div>' +
          '<div class="q"><i>2017</i>L₁ = {w ∈ {a, b}* | erstes und letztes Zeichen verschieden}, L₂ = {aⁿbᵐaⁿ | n, m &gt; 0} zuordnen, „durch Angabe eines Modells (Grammatik/Automat)“ beweisen · Turingmaschine informal beschreiben, die das letzte Zeichen nach vorne holt: f(aabba) = aaabb.</div></div>' +
        '<div class="blk aw"><h3>Die Hierarchie – auswendig</h3><table class="ptab"><thead><tr><th>Klasse</th><th>Grammatik (Regelform)</th><th>Automat</th><th>Beispiel</th></tr></thead><tbody>' +
          '<tr><td>alle Sprachen</td><td>–</td><td>–</td><td>Komplement des Halteproblems (nicht einmal aufzählbar)</td></tr>' +
          '<tr><td><b>Typ 0</b> rekursiv aufzählbar</td><td>keine Einschränkung α → β</td><td>Turingmaschine (DTM = NTM)</td><td>Halteproblem</td></tr>' +
          '<tr><td>rekursiv (entscheidbar)</td><td>–</td><td>TM, die immer hält</td><td>(zwischen Typ 1 und Typ 0)</td></tr>' +
          '<tr><td><b>Typ 1</b> kontextsensitiv</td><td>längenmonoton |α| ≤ |β|</td><td>linear beschränkte TM (LBTM)</td><td>aⁿbⁿcⁿ, ww</td></tr>' +
          '<tr><td><b>Typ 2</b> kontextfrei</td><td>A → β (links ein Nichtterminal)</td><td>Kellerautomat (NKA)</td><td>aⁿbⁿ, Palindrome, Klammern</td></tr>' +
          '<tr><td>deterministisch kontextfrei</td><td>LR(k)</td><td>DKA</td><td>aⁿbⁿ (nicht: Palindrome)</td></tr>' +
          '<tr><td><b>Typ 3</b> regulär</td><td>A → aB | a</td><td>DEA / NEA, regulärer Ausdruck</td><td>a*b*, „endet auf ab“</td></tr>' +
          '<tr><td>endliche Sprachen</td><td>–</td><td>–</td><td>{2, 3, 5, 7, 11, 13, 17, 19}</td></tr></tbody></table>' +
          '<p style="font-size:.88rem;margin-top:.5rem">Kurzform für die Klausur: <b>endlich ⊂ Typ 3 ⊂ dkfS ⊂ Typ 2 ⊂ Typ 1 ⊂ entscheidbar ⊂ Typ 0 ⊂ alle Sprachen</b>. Wortproblem: Typ 1–3 entscheidbar, Typ 0 nicht.</p></div>' +
        '<div class="blk aw"><h3>Rezept: „Minimale Sprachklasse zuordnen und beweisen“</h3><ol class="pts" style="padding-left:1.3rem">' +
          '<li><b>Endlich?</b> (nur endlich viele Wörter) → <b>Typ 3</b>. Beweis: Grammatik, die die Wörter aufzählt.</li>' +
          '<li><b>Muss sich der Automat nur Endliches merken?</b> (Anfangszeichen, letzte Zeichen, gerade/ungerade, Rest mod k, „enthält …“) → <b>Typ 3</b>. Beweis: DEA/NEA, reguläre Grammatik A → aB | a oder regulärer Ausdruck.</li>' +
          '<li><b>Wird EINE unbeschränkte Anzahl mit einer anderen verglichen?</b> (aⁿ … bⁿ, Klammern, Spiegelbild) → <b>Typ 2</b>. Beweis: kfG angeben + Satz, warum <b>nicht regulär</b>: „Ein endlicher Automat hat nur endlich viele Zustände und kann sich die Anzahl n für beliebig große n nicht merken.“</li>' +
          '<li><b>Zwei Vergleiche gleichzeitig oder Kopie?</b> (aⁿbⁿcⁿ, ww, aⁿbᵐcⁿdᵐ) → <b>Typ 1</b>. Beweis: längenmonotone Grammatik oder LBTM; nicht kontextfrei, weil ein Keller nur eine Zählung halten kann.</li>' +
          '<li>Nur mit einer Turingmaschine, die evtl. nicht hält → <b>Typ 0</b>.</li></ol>' +
          '<p style="font-size:.86rem;color:var(--ink-soft)">„Minimal“ heißt: die kleinste (am stärksten eingeschränkte) Klasse. Darum immer kurz begründen, warum die nächstkleinere nicht reicht.</p></div>' +
        (D ? D.html("a6", ui) : "") +
        '<div class="blk"><h3>Musterlösung 2020/1</h3>' +
          '<p><b>L₁ = Primzahlen &lt; 20 → Typ 3 (regulär).</b> L₁ = {2, 3, 5, 7, 11, 13, 17, 19} ist endlich, und jede endliche Sprache ist regulär. Modell (über T = {0, …, 9}): G = ({S, A}, {0, …, 9}, P, S) mit P: S → 2 | 3 | 5 | 7 | 1A, A → 1 | 3 | 7 | 9. Alle Regeln haben die Form A → aB oder A → a. <small>(nachgerechnet: erzeugt genau die 8 Zahlen)</small></p>' +
          '<p><b>L₂ = {aⁿb³c²ⁿ | n ≥ 0} → Typ 2 (kontextfrei).</b> Modell: G = ({S}, {a, b, c}, P, S) mit P: S → aScc | bbb. Ableitung: S ⇒ aScc ⇒ aabbbcccc (n = 2). Links steht immer ein Nichtterminal → kfG. Nicht regulär: Um zu jedem a genau zwei c zu prüfen, muss die Anzahl n der a gezählt werden – ein endlicher Automat hat nur endlich viele Zustände und kann n nicht für beliebig große n speichern.</p></div>' +
        '<div class="blk"><h3>Musterlösung 2020/2</h3>' +
          '<p><b>L₁ = korrekte E-Mail-Adressen → Typ 3.</b> Eine Adresse hat die feste Gestalt Name@Domain.Endung. Mit Z = (a | b | … | z | 0 | … | 9) als regulärer Ausdruck: <code>Z Z* (. Z Z*)* @ Z Z* (. Z Z*)* . Z Z*</code>. Es muss nichts gezählt oder verglichen werden; zu jedem regulären Ausdruck gibt es einen DEA → regulär. (Annahme zu „korrekt“ kurz nennen.)</p>' +
          '<p><b>L₂ = beginnt anders als es aufhört → Typ 3.</b> Regulärer Ausdruck a(a|b)*b | b(a|b)*a. Reguläre Grammatik: S → aA | bB, A → aA | bA | b, B → aB | bB | a. <small>(nachgerechnet bis Länge 6)</small> Der Automat merkt sich nur das erste Zeichen (endlich viel Information).</p></div>' +
        '<div class="blk"><h3>Musterlösung 2017</h3>' +
          '<p><b>L₁ = erstes und letztes Zeichen verschieden → Typ 3</b> – genau wie L₂ aus 2020/2.</p>' +
          '<p><b>L₂ = {aⁿbᵐaⁿ | n, m &gt; 0} → Typ 2.</b> G = ({S, B}, {a, b}, P, S), P: S → aSa | aBa, B → bB | b. Beispiel: S ⇒ aSa ⇒ aaBaa ⇒ aabaa. Nicht regulär: Die Anzahl der a vorne muss mit der hinten verglichen werden.</p>' +
          '<p><b>Turingmaschine für f(c₁…cₙ) = cₙc₁…cₙ₋₁ (informal):</b> (1) q₀: nach rechts laufen bis zum ersten Blank, dann einen Schritt nach links → q₁. (2) q₁: das letzte Zeichen lesen, durch Blank ersetzen und es sich im Zustand merken: bei a → qₐ, bei b → q_b. (3) qₐ / q_b: nach links laufen bis zum Blank vor dem ersten Zeichen. (4) Dort das gemerkte Zeichen (a bzw. b) schreiben und in den Endzustand gehen. Beispiel aabba: letztes a merken und löschen → aabb, vorne a schreiben → aaabb ✓. Für das leere Wort hält sie sofort.</p></div>' +
        '<div class="blk"><h3>Musterlösung 2020/3 – Hierarchie mit drei Beispielen</h3><p>Typ 3 (regulär) ⊂ Typ 2 (kontextfrei) ⊂ Typ 1 (kontextsensitiv) ⊂ Typ 0 (rekursiv aufzählbar) ⊂ alle Sprachen; dazu: endliche ⊂ Typ 3, dkfS zwischen Typ 3 und Typ 2, entscheidbare zwischen Typ 1 und Typ 0. Beispiele: Typ 3: a*b* · Typ 2: {aⁿbⁿ | n ≥ 0} · Typ 1: {aⁿbⁿcⁿ | n ≥ 1} · Typ 0, nicht entscheidbar: das Halteproblem. Die Tabelle oben als Zeichnung (ineinander liegende Kreise) bringt die volle Punktzahl.</p></div>' +
        '<div id="gen-a6"><h3 class="genh">Üben</h3><div class="gen" data-g="spr"><h3>Sprache → minimale Chomsky-Klasse</h3><div class="body"></div></div><div class="gen" data-g="gtyp"><h3>Grammatik → Chomsky-Typ</h3><div class="body"></div></div></div></div>';
    },
    init: function(root, ui){
      if(D) D.init(root, ui);
      var order = SPR.map(function(_, i){ return i; }).sort(function(){ return Math.random() - .5; }), oi = 0;
      function sprTask(){
        var b = root.querySelector('[data-g="spr"] .body'), s = SPR[order[oi++ % order.length]];
        b.innerHTML = '<div class="ask">L = ' + esc(s[0]) + '</div><div class="row">' + [3, 2, 1, 0].map(function(t){ return '<button class="go sec ch" data-v="' + t + '">' + TYPN[t] + '</button>'; }).join("") + '<span class="score">' + ui.gscore("spr") + '</span></div><div class="out"></div>';
        Array.prototype.forEach.call(b.querySelectorAll(".ch"), function(c){ c.onclick = function(){
          var ok = +c.getAttribute("data-v") === s[1]; ui.glog("spr", ok); b.querySelector(".score").textContent = ui.gscore("spr");
          Array.prototype.forEach.call(b.querySelectorAll(".ch"), function(x){ if(+x.getAttribute("data-v") === s[1]) x.classList.add("rok"); else if(x === c) x.classList.add("rbad"); x.disabled = true; });
          b.querySelector(".out").innerHTML = '<div class="fbk ' + (ok ? "ok" : "bad") + '">' + (ok ? "✓ " : "✗ ") + '<b>' + TYPN[s[1]] + '.</b> ' + esc(s[2]) + '</div><div class="row"><button class="go nx">Nächste →</button></div>';
          b.querySelector(".nx").onclick = sprTask;
        }; });
      }
      function gTask(){
        var b = root.querySelector('[data-g="gtyp"] .body'), G = randGrammar(), t = X.gType(G);
        b.innerHTML = '<div class="ask">' + esc(gStr(G)) + '</div><div class="row">' + [3, 2, 1, 0].map(function(k){ return '<button class="go sec ch" data-v="' + k + '">Typ ' + k + '</button>'; }).join("") + '<span class="score">' + ui.gscore("gtyp") + '</span></div><div class="out"></div>';
        Array.prototype.forEach.call(b.querySelectorAll(".ch"), function(c){ c.onclick = function(){
          var ok = +c.getAttribute("data-v") === t; ui.glog("gtyp", ok); b.querySelector(".score").textContent = ui.gscore("gtyp");
          Array.prototype.forEach.call(b.querySelectorAll(".ch"), function(x){ if(+x.getAttribute("data-v") === t) x.classList.add("rok"); else if(x === c) x.classList.add("rbad"); x.disabled = true; });
          b.querySelector(".out").innerHTML = '<div class="fbk ' + (ok ? "ok" : "bad") + '">' + (ok ? "✓ " : "✗ ") + '<b>Typ ' + t + '</b> (höchster passender Typ): ' + esc(gReason(G)) + '.</div><div class="row"><button class="go nx">Nächste →</button></div>';
          b.querySelector(".nx").onclick = gTask;
        }; });
      }
      sprTask(); gTask();
    }
  };

  /* ---------- Aufgabe 7 ---------- */
  function randAuto(nfa){
    var n = 3 + rnd(2), Q = [], d = {}, S = ["a", "b"];
    for(var i = 0; i < n; i++) Q.push("q" + i);
    Q.forEach(function(q, i){ d[q] = {}; S.forEach(function(a){
      var t = [];
      if(nfa){ if(Math.random() < .8) t.push(pick(Q)); if(Math.random() < .3) t.push(pick(Q)); }
      else t.push(i < n - 1 && Math.random() < .55 ? Q[i + 1] : pick(Q));
      t = t.filter(function(x, k){ return t.indexOf(x) === k; });
      if(t.length) d[q][a] = t;
    }); });
    var E = [Q[n - 1]]; if(Math.random() < .3) E.push(Q[rnd(n - 1)]);
    var M = { Q: Q, S: S, d: d, q0: "q0", E: E.filter(function(x, k){ return E.indexOf(x) === k; }) };
    var pos = {}; Q.forEach(function(q, i){ pos[q] = [95 + i * 130, 100, i % 2 ? "u" : "o"]; });
    return { M: M, pos: pos, w: 105 + n * 130 };
  }
  function randMinDFA(){
    // kleiner Zufalls-DEA mit 3 Zuständen, dann ein Zustand verdoppelt (gleiche Übergänge, gleiche Endeigenschaft) → verschmelzbares Paar
    for(var tries = 0; tries < 50; tries++){
      var Q = ["q0", "q1", "q2"], d = {}, S = ["a", "b"];
      Q.forEach(function(q){ d[q] = {}; S.forEach(function(a){ d[q][a] = [pick(Q)]; }); });
      var E = [pick(Q)], M = { Q: Q, S: S, d: d, q0: "q0", E: E };
      var reach = X.subset(M).dea.Q.length;
      if(reach < 3 || X.minimize(M).groups.length < 3) continue;
      var dup = pick(["q1", "q2"]), nq = "q3";
      M.Q.push(nq); d[nq] = { a: d[dup].a.slice(), b: d[dup].b.slice() };
      if(E.indexOf(dup) >= 0) E.push(nq);
      // eine Kante, die auf dup zeigt, auf q3 umbiegen (damit q3 erreichbar ist)
      var moved = false;
      ["q0", "q1", "q2"].forEach(function(q){ S.forEach(function(a){ if(!moved && d[q][a][0] === dup && q !== dup){ d[q][a] = [nq]; moved = true; } }); });
      if(!moved) continue;
      var g = X.minimize(M).groups.filter(function(x){ return x.length > 1; });
      if(g.length !== 1) continue;
      return { M: M, pair: g[0].slice().sort(), pos: { q0: [95, 100], q1: [235, 50], q2: [375, 100, "u"], q3: [235, 165, "u"] } };
    }
    return null;
  }

  P.a7 = {
    tab: "7 · Automaten",
    html: function(ui){
      var w201 = X.lang(M201, 4);
      return '<div class="sec" id="a7"><h2>Aufgabe 7 · Formale Sprachen – Automaten <small>TGI06 Kap. 2.4, 4</small></h2>' +
        '<div class="blk"><h3>So wird gefragt</h3>' +
          '<div class="q"><i>2020/1</i>Automat gegeben: deterministisch oder nichtdeterministisch – woran erkennen Sie das? Zwei akzeptierte und zwei nicht akzeptierte Wörter, die akzeptierte Sprache. · Automat für L = {a³bⁿ | n ≥ 0} in formaler Notation.</div>' +
          '<div class="q"><i>2020/2</i>Endlicher Automat UND reguläre Grammatik für alle Wörter über a, b mit mindestens einem a und an vorletzter Stelle ein b.</div>' +
          '<div class="q"><i>2020/3</i>Minimieren Sie den gegebenen deterministischen endlichen Automaten.</div>' +
          '<div class="q"><i>2017</i>Grammatik S → abS | aS | aB, B → aB | T, T → abT | ε: Mehrdeutigkeit zeigen · ε-Freiheit konstruieren · äquivalenten NEA konstruieren.</div></div>' +
        '<div class="blk aw"><h3>Auswendig – Automaten lesen und bauen</h3><ul class="pts">' +
          '<li><b>DEA oder NEA?</b> NEA, sobald ein Zustand für ein Zeichen <b>zwei oder mehr</b> Pfeile hat (oder ε-Übergänge). Konkret benennen: „δ(A, b) = {A, Q}“. Fehlende Pfeile allein machen ihn nur unvollständig (beim DEA muss δ total sein → Fehlerzustand ergänzen).</li>' +
          '<li><b>Akzeptiert?</b> Alle möglichen Zustände Zeichen für Zeichen mitführen (Mengen). Akzeptiert, wenn am Ende mindestens ein Endzustand dabei ist.</li>' +
          '<li><b>Formale Notation:</b> M = (Q, Σ, δ, q₀, E) + δ als Tabelle (jede Zeile ein Zustand, jede Spalte ein Zeichen). Fehlerzustand nicht vergessen.</li>' +
          '<li><b>DEA → reguläre Grammatik:</b> Zustand = Nichtterminal; für jeden Übergang δ(X, a) = Y eine Regel X → aY; ist Y Endzustand, zusätzlich X → a.</li>' +
          '<li><b>NEA → DEA (Potenzmengenkonstruktion):</b> Start {q₀}; für jede neue Menge und jedes Zeichen die Vereinigung der Folgezustände; Endzustand, wenn die Menge einen NEA-Endzustand enthält.</li>' +
          '<li><b>Minimieren:</b> Matrix aller Paare → zuerst (Endzustand, Nicht-Endzustand) markieren → dann Paare markieren, die mit einem Zeichen in ein markiertes Paar laufen → wiederholen bis nichts mehr dazukommt → unmarkierte Paare verschmelzen.</li>' +
          '<li><b>Mehrdeutig zeigen:</b> EIN Wort mit zwei verschiedenen Linksableitungen angeben.</li>' +
          '<li><b>ε-frei machen:</b> Menge der Nichtterminale bestimmen, die ε ableiten können; in jeder Regel jede Kombination dieser Nichtterminale einmal weglassen; die ε-Regeln streichen (s → ε nur, falls ε in L liegt).</li></ul></div>' +
        (D ? D.html("a7", ui) : "") +
        '<div class="blk"><h3>Musterlösung 2020/1 – Automat lesen</h3>' + auto(M201, P201, { w: 500, h: 235 }) +
          '<p><b>1. Nichtdeterministisch (NEA):</b> δ(A, b) = {A, Q} und δ(B, b) = {B, A} – zu einem Zustand und einem Zeichen gibt es zwei Folgezustände.</p>' +
          '<p><b>2. Akzeptiert</b> (z. B.): ' + w201.slice(0, 5).join(", ") + ' … – Weg für ab: S →a A →b Q. <b>3. Nicht akzeptiert:</b> a, ba, bb, bab (z. B. bab: S →b B →a B →b {A, B}, kein Endzustand).</p>' +
          '<p><b>4. Sprache:</b> L = a(a|b)*b ∪ b(a|b)*b(a|b)*b – entweder mit a anfangen und mit b aufhören, oder mit b anfangen und insgesamt mindestens drei b haben, das letzte Zeichen ein b. <small>(nachgerechnet für alle Wörter bis Länge 9)</small></p></div>' +
        '<div class="blk"><h3>Musterlösung 2020/1 – DEA für {a³bⁿ | n ≥ 0}</h3>' + auto(MA3B, PA3B, { w: 470, h: 235 }) + '<p>qF ist der Fehlerzustand (Falle) – nötig, weil δ beim DEA total sein muss. Akzeptiert: aaa, aaab, aaabb, …</p></div>' +
        '<div class="blk"><h3>Musterlösung 2020/2 – mindestens ein a, vorletztes Zeichen b</h3>' + auto(M202, P202, { w: 530, h: 255 }) +
          '<p>Bedeutung der Zustände: q0 Start · q1 bisher nur b · q2 hat a, endet auf a (vorletztes kein b) · q3 hat a, endet auf „ab“ · <b>q4</b> hat a, endet auf „ba“ · <b>q5</b> hat a, endet auf „bb“. Dieser DEA ist minimal (6 Zustände). <small>(nachgerechnet für alle Wörter bis Länge 11)</small></p>' +
          '<p><b>Reguläre Grammatik</b> (Regel X → aY je Übergang, plus X → a, wenn Y Endzustand): S → aA | bB, B → aD | a | bB, A → aA | bC, C → aD | a | bF | b, D → aA | bC, F → aD | a | bF | b (S = q0, B = q1, A = q2, C = q3, D = q4, F = q5).</p></div>' +
        '<div class="blk"><h3>Musterlösung 2020/3 – Minimieren</h3>' + auto(M203, P203, { w: 470, h: 235 }) +
          '<p style="font-size:.86rem">Achtung: In der Aufgabe ist an S2 eine Schleife „0, 1“ <i>und</i> ein Pfeil „1“ nach S3 gezeichnet – das wäre nichtdeterministisch. Beide Lesarten (Schleife nur 0 bzw. 0, 1) ergeben dieselbe Sprache 01(0|1)*1(0|1)*. Für den DEA: Schleife an S2 nur mit 0, Fehlerzustand F für die fehlenden Übergänge ergänzen.</p>' +
          minHtml(M203) + '</div>' +
        '<div class="blk"><h3>Musterlösung 2017 – Grammatik S → abS | aS | aB, B → aB | T, T → abT | ε</h3>' +
          '<p><b>Mehrdeutig:</b> Das Wort aa hat zwei Linksableitungen: S ⇒ aS ⇒ aaB ⇒ aaT ⇒ aa und S ⇒ aB ⇒ aaB ⇒ aaT ⇒ aa. <small>(nachgerechnet; z. B. auch aaa hat drei)</small></p>' +
          '<p><b>ε-frei:</b> ε ableitbar sind T (T → ε) und damit B (B → T). Regeln ohne diese ergänzen, ε-Regel streichen: S → abS | aS | aB | <b>a</b>, B → aB | <b>a</b> | T, T → abT | <b>ab</b>. (S ist nicht ε-ableitbar, also kein S → ε.) <small>(gleiche Sprache bis Länge 7 nachgerechnet)</small></p>' +
          '<p><b>NEA:</b> Nichtterminale werden Zustände; für „ab“ braucht es Hilfszustände H1, H2. B und T sind Endzustände (sie können ε ableiten).</p>' + auto(N17, P17, { w: 540, h: 190 }) + '</div>' +
        '<div id="gen-a7"><h3 class="genh">Üben mit neuen Automaten</h3>' +
          '<div class="gen" data-g="acc"><h3>Wird das Wort akzeptiert? DEA oder NEA?</h3><div class="body"></div></div>' +
          '<div class="gen" data-g="pot"><h3>Potenzmengenkonstruktion: welche Zustandsmenge nach dem Wort?</h3><div class="body"></div></div>' +
          '<div class="gen" data-g="min"><h3>Minimieren: welche zwei Zustände verschmelzen?</h3><div class="body"></div></div></div></div>';
    },
    init: function(root, ui){
      if(D) D.init(root, ui);
      function accTask(){
        var b = root.querySelector('[data-g="acc"] .body'), r = randAuto(Math.random() < .5), M = r.M, w = "";
        var L = 3 + rnd(3); for(var i = 0; i < L; i++) w += pick(M.S);
        var res = X.run(M, w), det = X.isDet(M);
        b.innerHTML = '<div class="awrap">' + X.svg(M, r.pos, { w: r.w, h: 200 }) + '<div>' + X.table(M) + '</div></div><div class="ask">Wort w = <b>' + w + '</b></div>' +
          '<div class="ynr"><label><span>Automat ist …</span><select data-k="det"><option value="">?</option><option value="1">DEA</option><option value="0">NEA</option></select></label><label><span>w wird …</span><select data-k="ok"><option value="">?</option><option value="1">akzeptiert</option><option value="0">nicht akzeptiert</option></select></label></div>' +
          '<div class="row"><button class="go chk">Prüfen</button><button class="go sec nw">Neuer Automat</button><span class="score">' + ui.gscore("acc") + '</span></div><div class="out"></div>';
        var done = false;
        b.querySelector(".chk").onclick = function(){
          var sd = b.querySelector('[data-k="det"]'), so = b.querySelector('[data-k="ok"]');
          var okd = sd.value !== "" && (sd.value === "1") === det.det, oko = so.value !== "" && (so.value === "1") === res.ok;
          sd.parentNode.className = okd ? "okk" : "badd"; so.parentNode.className = oko ? "okk" : "badd";
          if(!done){ ui.glog("acc", okd && oko); done = true; b.querySelector(".score").textContent = ui.gscore("acc"); }
          b.querySelector(".out").innerHTML = '<div class="fbk ' + (okd && oko ? "ok" : "bad") + '">' + (det.det ? "DEA – jeder Zustand hat je Zeichen höchstens einen Folgezustand" + (det.total ? "" : " (fehlende Pfeile = Fehlerzustand)") : "NEA, weil " + esc(det.why[0])) + '.<br>Weg (Mengen): ' +
            res.path.map(function(s, i){ return (i ? "–" + w[i - 1] + "→ " : "") + "{" + s.join(", ") + "}"; }).join(" ") + ' → ' + (res.ok ? "<b>akzeptiert</b> (Endzustand dabei)" : "<b>nicht akzeptiert</b>") + '</div>';
        };
        b.querySelector(".nw").onclick = accTask;
      }
      function potTask(){
        var b = root.querySelector('[data-g="pot"] .body'), r = randAuto(true), M = r.M, w = "";
        var L = 2 + rnd(3); for(var i = 0; i < L; i++) w += pick(M.S);
        var res = X.run(M, w), sol = res.path[res.path.length - 1].slice().sort(), sub = X.subset(M);
        b.innerHTML = '<div class="awrap">' + X.svg(M, r.pos, { w: r.w, h: 200 }) + '<div>' + X.table(M) + '</div></div><div class="ask">Der DEA startet in {q0}. In welchem DEA-Zustand (= Menge von NEA-Zuständen) ist er nach <b>' + w + '</b>? Eingabe z. B. „q0, q2“ – leer für ∅.</div>' +
          '<input class="ans" placeholder="q0, q2"><div class="row"><button class="go chk">Prüfen</button><button class="go sec nw">Neuer NEA</button><span class="score">' + ui.gscore("pot") + '</span></div><div class="out"></div>';
        var done = false;
        function check(){
          var v = (b.querySelector(".ans").value.match(/q\d/g) || []).filter(function(x, k, a){ return a.indexOf(x) === k; }).sort();
          var ok = v.join() === sol.join();
          if(!done){ ui.glog("pot", ok); done = true; b.querySelector(".score").textContent = ui.gscore("pot"); }
          b.querySelector(".out").innerHTML = '<div class="fbk ' + (ok ? "ok" : "bad") + '">' + (ok ? "✓ " : "✗ ") + 'Schrittweise: ' + res.path.map(function(s, i){ return (i ? "–" + w[i - 1] + "→ " : "") + "{" + s.join(", ") + "}"; }).join(" ") + '</div>' +
            '<p style="font-size:.84rem;margin:.5rem 0 .2rem">Vollständige Potenzmengenkonstruktion (alle erreichbaren DEA-Zustände):</p><table class="dtab"><thead><tr><th>DEA-Zustand</th>' + M.S.map(function(a){ return '<th>' + a + '</th>'; }).join("") + '</tr></thead><tbody>' +
            sub.rows.map(function(row){ var fin = row.from.some(function(q){ return M.E.indexOf(q) >= 0; }); return '<tr><td>' + (fin ? "* " : "") + "{" + row.from.join(", ") + '}</td>' + M.S.map(function(a){ return '<td>{' + row.to[a].join(", ") + '}</td>'; }).join("") + '</tr>'; }).join("") + '</tbody></table>';
        }
        b.querySelector(".chk").onclick = check; b.querySelector(".ans").onkeydown = function(e){ if(e.key === "Enter") check(); };
        b.querySelector(".nw").onclick = potTask;
      }
      function minTask(){
        var b = root.querySelector('[data-g="min"] .body'), r = randMinDFA();
        if(!r){ b.innerHTML = "Bitte neu laden."; return; }
        b.innerHTML = '<div class="awrap">' + X.svg(r.M, r.pos, { w: 450, h: 230 }) + '<div>' + X.table(r.M) + '</div></div><div class="ask">Welche zwei Zustände sind äquivalent? Eingabe z. B. „q1, q3“.</div>' +
          '<input class="ans" placeholder="q1, q3"><div class="row"><button class="go chk">Prüfen</button><button class="go sec nw">Neuer DEA</button><span class="score">' + ui.gscore("min") + '</span></div><div class="out"></div>';
        var done = false;
        function check(){
          var v = (b.querySelector(".ans").value.match(/q\d/g) || []).sort(), ok = v.join() === r.pair.join();
          if(!done){ ui.glog("min", ok); done = true; b.querySelector(".score").textContent = ui.gscore("min"); }
          b.querySelector(".out").innerHTML = '<div class="fbk ' + (ok ? "ok" : "bad") + '">' + (ok ? "✓ " : "✗ Richtig: ") + r.pair.join(" und ") + '</div>' + minHtml(r.M);
        }
        b.querySelector(".chk").onclick = check; b.querySelector(".ans").onkeydown = function(e){ if(e.key === "Enter") check(); };
        b.querySelector(".nw").onclick = minTask;
      }
      accTask(); potTask(); minTask();
    }
  };
  P._a67test = { randGrammar: randGrammar, randMinDFA: randMinDFA, randAuto: randAuto, SPR: SPR };
})();
