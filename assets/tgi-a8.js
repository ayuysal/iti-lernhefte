/* TGI-Klausurtrainer – Aufgabe 8 (Parsing) nach TGI07: Chomsky-Normalform (Def. 1.4, Satz 1.3), CYK,
   LL(1)-Forderungen mit FIRST/FOLLOW (Def. 2.2/2.4/2.6), Inklusionshierarchie LL/LR. CNF-Lösungen mit tgi-auto.js nachgerechnet. */
(function(){
  "use strict";
  var P = window.TGI_PARTS = window.TGI_PARTS || {}, D = P._defs;
  function esc(s){ return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function rnd(n){ return Math.floor(Math.random() * n); }
  function pick(a){ return a[rnd(a.length)]; }

  if(D) D.list.push(
    { id: "cnf", a: "a8", t: "Chomsky-Normalform (CNF)", d: "Eine kfG ist in Chomsky-Normalform, wenn jede Regel entweder die Form X → a (a ∈ T) oder X → YZ (Y, Z ∈ N) hat. Zu jeder kfG G mit ε ∉ L(G) gibt es eine äquivalente kfG in CNF (Satz 1.3).", q: "TGI07 Def. 1.4" },
    { id: "cnfwarum", a: "a8", t: "Warum CNF?", d: "Ableitungsbäume werden Binärbäume (ein Wort der Länge n braucht genau 2n − 1 Ableitungsschritte). Grundlage des Cocke-Younger-Kasami-Algorithmus (CYK): entscheidet das Wortproblem für jede kfG in O(n³) mit dynamischer Programmierung – statt exponentiellem Backtracking eines NKA.", q: "TGI07 Kap. 1" },
    { id: "first", a: "a8", t: "FIRST und FOLLOW", d: "FIRST(α) ist die Menge aller Terminale, die bei irgendeiner Ableitung von α ganz vorn stehen können (inkl. ε, falls α ⇒* ε). FOLLOW(X) ist die Menge aller Terminale, die dem Nichtterminal X in irgendeiner aus dem Startsymbol ableitbaren Satzform unmittelbar folgen können (beim Startsymbol zusätzlich das Wortende $).", q: "TGI07 Def. 2.1/2.3" },
    { id: "ll1", a: "a8", t: "LL(1)-Grammatik", d: "Eine kfG ist LL(1), wenn (1) für alle Alternativen X → α₁ | α₂ | … eines Nichtterminals die FIRST-Mengen paarweise disjunkt sind: FIRST(αᵢ) ∩ FIRST(αⱼ) = ∅, und (2) für jedes X mit X ⇒* ε gilt: FIRST(X) ∩ FOLLOW(X) = ∅. LL(1): Analyse von Links nach rechts, Linksableitung, 1 Zeichen Vorausschau. Eine LL(1)-Grammatik ist nie linksrekursiv und nie mehrdeutig.", q: "TGI07 Def. 2.6" },
    { id: "lr", a: "a8", t: "LR(k)", d: "Bottom-up-Analyse von Links nach rechts durch Linksreduktion (Umkehrung einer Rechtsableitung) mit k Zeichen Vorausschau; Aktionen shift (Zeichen kellern) und reduce (Handle durch Nichtterminal ersetzen). L(LR(1)) = L(dkfS) ist die umfassendste deterministisch analysierbare Klasse. Zu jeder LR(k)-Grammatik (k > 1) gibt es eine äquivalente LR(1)-Grammatik.", q: "TGI07 Kap. 3" }
  );

  /* ---------- FIRST / FOLLOW (Großbuchstaben = Nichtterminale, "" = ε) ---------- */
  function ff(G){
    var N = G.N, isN = function(c){ return N.indexOf(c) >= 0; }, F = {}, FO = {}, ch = true;
    N.forEach(function(n){ F[n] = {}; FO[n] = {}; }); FO[G.s]["$"] = 1;
    function firstSeq(s){ var r = {}; for(var i = 0; i < s.length; i++){ var c = s[i]; if(!isN(c)){ r[c] = 1; return r; } Object.keys(F[c]).forEach(function(x){ if(x !== "ε") r[x] = 1; }); if(!F[c]["ε"]) return r; } r["ε"] = 1; return r; }
    while(ch){ ch = false; G.P.forEach(function(p){ var f = firstSeq(p[1]); Object.keys(f).forEach(function(x){ if(!F[p[0]][x]){ F[p[0]][x] = 1; ch = true; } }); }); }
    ch = true;
    while(ch){ ch = false; G.P.forEach(function(p){ for(var i = 0; i < p[1].length; i++){ var X = p[1][i]; if(!isN(X)) continue; var f = firstSeq(p[1].slice(i + 1)); Object.keys(f).forEach(function(x){ if(x !== "ε" && !FO[X][x]){ FO[X][x] = 1; ch = true; } }); if(f["ε"]) Object.keys(FO[p[0]]).forEach(function(x){ if(!FO[X][x]){ FO[X][x] = 1; ch = true; } }); } }); }
    return { F: F, FO: FO, firstSeq: firstSeq };
  }
  function ll1(G){
    var r = ff(G), conf = [];
    G.N.forEach(function(n){
      var alts = G.P.filter(function(p){ return p[0] === n; });
      for(var i = 0; i < alts.length; i++) for(var j = i + 1; j < alts.length; j++){
        var a = r.firstSeq(alts[i][1]), b = r.firstSeq(alts[j][1]), s = Object.keys(a).filter(function(x){ return b[x]; });
        if(s.length) conf.push("Forderung 1 verletzt bei " + n + ": FIRST(" + (alts[i][1] || "ε") + ") ∩ FIRST(" + (alts[j][1] || "ε") + ") = {" + s.join(", ") + "}");
      }
      if(r.F[n]["ε"]){ var s2 = Object.keys(r.F[n]).filter(function(x){ return x !== "ε" && r.FO[n][x]; }); if(s2.length) conf.push("Forderung 2 verletzt bei " + n + " (" + n + " ⇒* ε): FIRST(" + n + ") ∩ FOLLOW(" + n + ") = {" + s2.join(", ") + "}"); }
    });
    return { ok: !conf.length, conf: conf, ff: r };
  }
  function setS(o){ var k = Object.keys(o); return "{" + k.join(", ") + "}"; }
  function ffTable(G){
    var L = ll1(G), r = L.ff;
    return '<table class="ptab"><thead><tr><th>Nichtterminal</th><th>FIRST</th><th>FOLLOW</th></tr></thead><tbody>' +
      G.N.map(function(n){ return '<tr><td>' + n + '</td><td>' + setS(r.F[n]) + '</td><td>' + setS(r.FO[n]) + '</td></tr>'; }).join("") + '</tbody></table>' +
      '<p class="dv">' + (L.ok ? "Beide Forderungen erfüllt → <b>LL(1)</b>." : L.conf.map(esc).join("<br>") + " → <b>nicht LL(1)</b>.") + '</p>';
  }
  function gStr(G){ var by = {}; G.P.forEach(function(p){ (by[p[0]] = by[p[0]] || []).push(p[1] || "ε"); }); return G.N.filter(function(n){ return by[n]; }).map(function(n){ return n + " → " + by[n].join(" | "); }).join(", "); }

  /* Zufallsgrammatiken für die LL(1)-Übung */
  function randLL(){
    var T = [
      { P: [["S", "aA"], ["S", "bB"], ["A", "cA"], ["A", "d"], ["B", "b"]] },
      { P: [["S", "A"], ["S", "B"], ["A", "aA"], ["A", "c"], ["B", "aB"], ["B", "d"]] },
      { P: [["S", "aSb"], ["S", "c"]] },
      { P: [["S", "aS"], ["S", "a"]] },
      { P: [["S", "Xd"], ["X", "Ba"], ["X", "C"], ["C", ""], ["B", "d"]] },
      { P: [["S", "AB"], ["A", "aA"], ["A", ""], ["B", "b"]] },
      { P: [["S", "AB"], ["A", "aA"], ["A", ""], ["B", "a"]] },
      { P: [["S", "Sa"], ["S", "b"]] },
      { P: [["S", "aB"], ["B", "bB"], ["B", ""]] },
      { P: [["S", "aT"], ["T", "bS"], ["T", "c"], ["S", "d"]] },
      { P: [["S", "ab"], ["S", "ac"]] },
      { P: [["S", "aX"], ["X", "b"], ["X", "c"]] },
      { P: [["S", "A"], ["S", "B"], ["A", "cA"], ["A", "a"], ["B", "b"], ["B", "cB"]] },
      { P: [["S", "cS"], ["S", "a"], ["S", "b"]] },
      { P: [["S", "AbC"], ["A", "a"], ["A", ""], ["C", "c"], ["C", ""]] },
      { P: [["S", "Ab"], ["A", "b"], ["A", ""]] }
    ], t = pick(T);
    var N = []; t.P.forEach(function(p){ if(N.indexOf(p[0]) < 0) N.push(p[0]); });
    return { N: N, T: ["a", "b", "c", "d"], s: "S", P: t.P };
  }

  /* Regeln in CNF einordnen */
  var CNFQ = [
    ["X → a", "ok", "ein Terminal rechts – erlaubt"], ["X → YZ", "ok", "genau zwei Nichtterminale – erlaubt"],
    ["X → aY", "b", "Terminal in einer langen Seite → durch U<sub>a</sub> ersetzen, U<sub>a</sub> → a: X → U<sub>a</sub>Y"],
    ["X → YZW", "c", "Länge 3 → verkürzen: X → YA₁, A₁ → ZW"],
    ["X → Y", "k", "Kettenregel → durch die Alternativen von Y ersetzen"],
    ["X → ε", "e", "ε-Regel → ε-frei machen (nur möglich, wenn ε ∉ L)"],
    ["X → ab", "b", "zwei Terminale → X → U<sub>a</sub>U<sub>b</sub> mit U<sub>a</sub> → a, U<sub>b</sub> → b"],
    ["X → aXb", "bc", "erst Terminale ersetzen (U<sub>a</sub>XU<sub>b</sub>), dann verkürzen: X → U<sub>a</sub>A₁, A₁ → XU<sub>b</sub>"],
    ["X → YaZ", "bc", "Terminal ersetzen, dann verkürzen: X → YA₁, A₁ → U<sub>a</sub>Z"],
    ["X → bY", "b", "Terminal ersetzen: X → U<sub>b</sub>Y"],
    ["X → YZWV", "c", "Länge 4 → X → YA₁, A₁ → ZA₂, A₂ → WV"],
    ["X → Z", "k", "Kettenregel"]
  ];
  var CNFN = { ok: "schon CNF", b: "Terminal ersetzen (Schritt b)", c: "verkürzen (Schritt c)", bc: "erst b, dann c", k: "Kettenregel entfernen", e: "ε-Regel entfernen" };

  /* Hierarchie-Aussagen */
  var HIER = [
    ["L(LL(1)) ⊊ L(LL(2))", 1, "LL(k)-Klassen werden mit wachsendem k echt größer."],
    ["L(LL(k)) = L(dkfS)", 0, "Nein: L(LL(k)) ⊊ L(dkfS) – echte Teilmenge."],
    ["L(LR(1)) = L(dkfS)", 1, "LR(1) deckt sich exakt mit den deterministisch kontextfreien Sprachen (= Sprachen der DKA)."],
    ["L(dkfS) = L(kfS)", 0, "Nein: dkfS ⊊ kfS, z. B. Palindrome ohne Mittenmarkierung brauchen einen NKA."],
    ["Jede LL(k)-Sprache ist auch eine LR(k)-Sprache", 1, "Satz 3.2 – die Umkehrung gilt nicht."],
    ["L(LALR(1)) ⊋ L(LL(1))", 1, "LALR(1) ist echt mächtiger als LL(1) (z. B. linksrekursive Ausdrucksgrammatiken)."],
    ["L(LR(0)) ⊊ L(SLR(1)) ⊊ L(LALR(1)) ⊊ L(LR(1))", 1, "Die LR-Familie, aufsteigend."],
    ["L(re) ⊂ L(LR(0))", 0, "Falsch (2017): L<sub>re</sub> (rekursiv aufzählbar, Typ 0) ist die GRÖSSTE Klasse, sie steht ganz oben."],
    ["Jede reguläre Sprache ist eine LL(1)-Sprache", 1, "Aus einem DEA lässt sich eine LL(1)-Grammatik gewinnen (deterministische Übergänge)."],
    ["Zu jeder LR(k)-Grammatik mit k > 1 gibt es eine äquivalente LR(1)-Grammatik", 1, "Satz 3.1 – praktisch genügen k ∈ {0, 1}."],
    ["Eine linksrekursive Grammatik kann LL(1) sein", 0, "Nein – X → Xα verletzt immer Forderung 1."],
    ["Eine mehrdeutige Grammatik kann LR(1) sein", 0, "Nein – LR(1)- (und LL(k)-)Grammatiken sind immer eindeutig."],
    ["Das Wortproblem für kfS ist mit CYK in O(n³) lösbar", 1, "Voraussetzung: Grammatik in CNF."],
    ["LL(1)-Parser arbeiten bottom-up", 0, "Nein: LL = top-down (rekursiver Abstieg, Linksableitung); LR = bottom-up (Linksreduktion)."]
  ];

  P.a8 = {
    tab: "8 · Parsing",
    html: function(ui){
      return '<div class="sec" id="a8"><h2>Aufgabe 8 · Parsing – CNF, LL(1), Hierarchie <small>TGI07 Kap. 1–3</small></h2>' +
        '<div class="blk"><h3>So wird gefragt</h3>' +
          '<div class="q"><i>2020/1</i>G = ({S}, {a, b}, P, S), S → ε | a | b | aSa | bSb: 1. Welche Sprache erzeugt G? 2. Was ist die Chomsky-Normalform? 3. Wandeln Sie G in CNF um. 4. Warum benötigen wir Grammatiken in CNF?</div>' +
          '<div class="q"><i>2020/2</i>Geben Sie die für das Parsen wichtigsten Sprachklassen innerhalb der kontextfreien Sprachen als Inklusionshierarchie an.</div>' +
          '<div class="q"><i>2020/3</i>S → A | B, A → cA | a, B → b | cB: Ist die Grammatik in der Klasse LL(1)?</div>' +
          '<div class="q"><i>2017</i>S → aSb | bT, T → Rcc | RR, R → ca | cWcW, W → S | TR in Chomsky-NF umwandeln · die Hierarchie L<sub>reg</sub> ⊂ L<sub>LL(1)</sub> ⊂ L<sub>re</sub> ⊂ L<sub>LR(0)</sub> ⊂ L<sub>kfS</sub> korrigieren.</div></div>' +
        '<div class="blk aw"><h3>Rezept: Umwandlung in Chomsky-Normalform</h3><ol class="pts" style="padding-left:1.3rem">' +
          '<li><b>Vorbereiten:</b> ε-Regeln entfernen (ε ∉ L nötig – sonst „CNF für L \\ {ε}“ und das extra sagen), Kettenregeln X → Y durch die Alternativen von Y ersetzen.</li>' +
          '<li><b>(a)</b> Regeln X → a bleiben, X → YZ auch.</li>' +
          '<li><b>(b)</b> In rechten Seiten der Länge ≥ 2 jedes Terminal a durch ein neues Nichtterminal U<sub>a</sub> ersetzen und U<sub>a</sub> → a ergänzen.</li>' +
          '<li><b>(c)</b> Rechte Seiten der Länge ≥ 3 mit neuen Nichtterminalen auf Länge 2 kürzen: X → Y₁Y₂Y₃ wird X → Y₁A₁, A₁ → Y₂Y₃.</li></ol>' +
          '<h3 style="margin-top:.8rem">Rezept: Ist G LL(1)?</h3><ol class="pts" style="padding-left:1.3rem">' +
          '<li>Für jedes Nichtterminal mit mehreren Alternativen: FIRST jeder Alternative bilden. <b>Überschneiden</b> sie sich → nicht LL(1) (Forderung 1). Klassische Ursachen: gemeinsames Präfix, Linksrekursion.</li>' +
          '<li>Für jedes Nichtterminal X, das ε ableiten kann: FIRST(X) ∩ FOLLOW(X) = ∅? (Forderung 2)</li>' +
          '<li>Beides erfüllt → LL(1). Bei einer Verletzung: die konkrete Schnittmenge nennen, z. B. „FIRST(A) ∩ FIRST(B) = {c}“.</li></ol>' +
          '<h3 style="margin-top:.8rem">Hierarchie – auswendig</h3>' +
          '<p class="dv" style="font-size:1rem">L(reg) ⊊ L(LL(1)) ⊊ L(LL(2)) ⊊ … ⊊ L(LL(k)) ⊊ L(LR(1)) = L(LR(k)) = L(dkfS) ⊊ L(kfS) ⊊ L(ksS) ⊊ L(re)<br>L(LR(0)) ⊊ L(SLR(1)) ⊊ L(LALR(1)) ⊊ L(LR(1)) · L(LL(1)) ⊊ L(LALR(1))</p></div>' +
        (D ? D.html("a8", ui) : "") +
        '<div class="blk"><h3>Musterlösung 2020/1</h3>' +
          '<p><b>1. Sprache:</b> alle Palindrome über {a, b} (Wörter, die vorwärts und rückwärts gleich sind), einschließlich ε: L(G) = {w ∈ {a, b}* | w = wᴿ}. <small>(nachgerechnet bis Länge 8)</small></p>' +
          '<p><b>2. CNF:</b> jede Regel hat die Form X → a oder X → YZ.</p>' +
          '<p><b>3. Umwandlung</b> (ε ∈ L, also CNF für L \\ {ε}):<br>ε entfernen: S → a | b | aSa | bSb | <b>aa | bb</b> (S ist ε-ableitbar, darum jede Form ohne S ergänzen).<br>(b) Terminale ersetzen: S → a | b | U<sub>a</sub>SU<sub>a</sub> | U<sub>b</sub>SU<sub>b</sub> | U<sub>a</sub>U<sub>a</sub> | U<sub>b</sub>U<sub>b</sub>, U<sub>a</sub> → a, U<sub>b</sub> → b<br>(c) verkürzen: <b>S → a | b | U<sub>a</sub>U<sub>a</sub> | U<sub>b</sub>U<sub>b</sub> | U<sub>a</sub>A₁ | U<sub>b</sub>A₂, A₁ → SU<sub>a</sub>, A₂ → SU<sub>b</sub>, U<sub>a</sub> → a, U<sub>b</sub> → b</b>. <small>(nachgerechnet: erzeugt genau alle Palindrome außer ε)</small> Soll ε dazugehören: neues Startsymbol S₀ → ε | (alle S-Regeln).</p>' +
          '<p><b>4. Warum CNF:</b> Ableitungsbäume werden Binärbäume (Wort der Länge n → genau 2n − 1 Schritte), und der CYK-Algorithmus kann damit das Wortproblem für jede kfG in O(n³) entscheiden.</p></div>' +
        '<div class="blk"><h3>Musterlösung 2020/2 – Inklusionshierarchie für das Parsen</h3><p class="dv">L(LL(1)) ⊊ L(LL(2)) ⊊ … ⊊ L(LL(k)) ⊊ L(LR(1)) = L(LR(k)) = L(dkfS) ⊊ L(kfS)<br>daneben die LR-Familie: L(LR(0)) ⊊ L(SLR(1)) ⊊ L(LALR(1)) ⊊ L(LR(1)), und L(LL(1)) ⊊ L(LALR(1)).</p><p>Am besten als ineinanderliegende Ellipsen zeichnen: außen kfS (NKA), darin dkfS = LR(1) (DKA), darin LALR(1) ⊃ SLR(1) ⊃ LR(0) und LL(k) ⊃ LL(1).</p></div>' +
        '<div class="blk"><h3>Musterlösung 2020/3 – S → A | B, A → cA | a, B → b | cB</h3>' +
          '<p style="font-size:.86rem">Achtung: In der Aufgabe steht T = {a, b}, die Regeln benutzen aber c – also T = {a, b, c} (kurz anmerken).</p>' +
          ffTable({ N: ["S", "A", "B"], T: ["a", "b", "c"], s: "S", P: [["S", "A"], ["S", "B"], ["A", "cA"], ["A", "a"], ["B", "b"], ["B", "cB"]] }) +
          '<p>Begründung in Worten: Bei Vorausschau auf c weiß der Parser nicht, ob S → A oder S → B anzuwenden ist – beide Alternativen können mit c beginnen. Die Grammatik ist auch für kein k LL(k), weil beliebig viele c vorne stehen können. Die Sprache c*(a | b) hat aber eine LL(1)-Grammatik: S → cS | a | b.</p></div>' +
        '<div class="blk"><h3>Musterlösung 2017 – CNF und Hierarchie</h3>' +
          '<p><b>Vorbereiten:</b> keine ε-Regeln; Kettenregel W → S ersetzen: W → aSb | bT | TR.</p>' +
          '<p><b>(b) Terminale ersetzen</b> (U<sub>a</sub> → a, U<sub>b</sub> → b, U<sub>c</sub> → c): S → U<sub>a</sub>SU<sub>b</sub> | U<sub>b</sub>T, T → RU<sub>c</sub>U<sub>c</sub> | RR, R → U<sub>c</sub>U<sub>a</sub> | U<sub>c</sub>WU<sub>c</sub>W, W → U<sub>a</sub>SU<sub>b</sub> | U<sub>b</sub>T | TR</p>' +
          '<p><b>(c) verkürzen:</b><br><b>S → U<sub>a</sub>A₁ | U<sub>b</sub>T, A₁ → SU<sub>b</sub><br>T → RA₂ | RR, A₂ → U<sub>c</sub>U<sub>c</sub><br>R → U<sub>c</sub>U<sub>a</sub> | U<sub>c</sub>A₃, A₃ → WA₄, A₄ → U<sub>c</sub>W<br>W → U<sub>a</sub>A₁ | U<sub>b</sub>T | TR<br>U<sub>a</sub> → a, U<sub>b</sub> → b, U<sub>c</sub> → c</b> <small>(nachgerechnet: gleiche Wörter bis Länge 13, z. B. bcacc, abcaccb)</small></p>' +
          '<p><b>Hierarchie korrigiert:</b> L<sub>reg</sub> ⊂ L<sub>LL(1)</sub> ⊂ L<sub>LR(1)</sub> (= L<sub>dkfS</sub>) ⊂ L<sub>kfS</sub> ⊂ L<sub>re</sub>. Fehler in der Vorlage: L<sub>re</sub> (rekursiv aufzählbar, Typ 0) ist die größte Klasse und gehört ganz nach außen; L<sub>LR(0)</sub> liegt innerhalb von L<sub>LR(1)</sub>, nicht zwischen L<sub>re</sub> und L<sub>kfS</sub>.</p></div>' +
        '<div id="gen-a8"><h3 class="genh">Üben</h3>' +
          '<div class="gen" data-g="ll1"><h3>Ist die Grammatik LL(1)? Und FIRST(S)?</h3><div class="body"></div></div>' +
          '<div class="gen" data-g="cnfq"><h3>CNF: was ist mit dieser Regel zu tun?</h3><div class="body"></div></div>' +
          '<div class="gen" data-g="hier"><h3>Hierarchie: stimmt die Aussage?</h3><div class="body"></div></div></div></div>';
    },
    init: function(root, ui){
      if(D) D.init(root, ui);
      function llTask(){
        var b = root.querySelector('[data-g="ll1"] .body'), G = randLL(), L = ll1(G), fs = Object.keys(L.ff.F.S).sort();
        b.innerHTML = '<div class="ask">' + esc(gStr(G)) + '</div><div class="ynr"><label><span>LL(1)?</span><select data-k="ll"><option value="">?</option><option value="1">ja</option><option value="0">nein</option></select></label></div><input class="ans" placeholder="FIRST(S), z. B. a, b  (ε als „eps“)">' +
          '<div class="row"><button class="go chk">Prüfen</button><button class="go sec nw">Neue Grammatik</button><span class="score">' + ui.gscore("ll1") + '</span></div><div class="out"></div>';
        var done = false;
        b.querySelector(".chk").onclick = function(){
          var s = b.querySelector("select"), okl = s.value !== "" && (s.value === "1") === L.ok;
          var inp = (b.querySelector(".ans").value.replace(/eps|ε/g, "ε").match(/[a-dε$]/g) || []).filter(function(x, i, a){ return a.indexOf(x) === i; }).sort();
          var okf = inp.join() === fs.join();
          s.parentNode.className = okl ? "okk" : "badd";
          if(!done){ ui.glog("ll1", okl && okf); done = true; b.querySelector(".score").textContent = ui.gscore("ll1"); }
          b.querySelector(".out").innerHTML = '<div class="fbk ' + (okl && okf ? "ok" : "bad") + '">' + (okl ? "✓ LL(1)-Entscheidung richtig. " : "✗ LL(1)-Entscheidung falsch. ") + (okf ? "✓ FIRST(S) richtig." : "✗ FIRST(S) = {" + fs.join(", ") + "}") + '</div>' + ffTable(G);
        };
        b.querySelector(".nw").onclick = llTask;
      }
      var ci = rnd(CNFQ.length);
      function cnfTask(){
        var b = root.querySelector('[data-g="cnfq"] .body'), q = CNFQ[ci++ % CNFQ.length];
        b.innerHTML = '<div class="ask">' + esc(q[0]) + '</div><div class="row">' + Object.keys(CNFN).map(function(k){ return '<button class="go sec ch" data-v="' + k + '">' + CNFN[k] + '</button>'; }).join("") + '<span class="score">' + ui.gscore("cnfq") + '</span></div><div class="out"></div>';
        Array.prototype.forEach.call(b.querySelectorAll(".ch"), function(c){ c.onclick = function(){
          var ok = c.getAttribute("data-v") === q[1]; ui.glog("cnfq", ok); b.querySelector(".score").textContent = ui.gscore("cnfq");
          Array.prototype.forEach.call(b.querySelectorAll(".ch"), function(x){ if(x.getAttribute("data-v") === q[1]) x.classList.add("rok"); else if(x === c) x.classList.add("rbad"); x.disabled = true; });
          b.querySelector(".out").innerHTML = '<div class="fbk ' + (ok ? "ok" : "bad") + '">' + (ok ? "✓ " : "✗ ") + q[2] + '</div><div class="row"><button class="go nx">Nächste →</button></div>';
          b.querySelector(".nx").onclick = cnfTask;
        }; });
      }
      var hi = rnd(HIER.length);
      function hTask(){
        var b = root.querySelector('[data-g="hier"] .body'), q = HIER[hi++ % HIER.length];
        b.innerHTML = '<div class="ask">' + esc(q[0]) + '</div><div class="row"><button class="go sec ch" data-v="1">stimmt</button><button class="go sec ch" data-v="0">stimmt nicht</button><span class="score">' + ui.gscore("hier") + '</span></div><div class="out"></div>';
        Array.prototype.forEach.call(b.querySelectorAll(".ch"), function(c){ c.onclick = function(){
          var ok = +c.getAttribute("data-v") === q[1]; ui.glog("hier", ok); b.querySelector(".score").textContent = ui.gscore("hier");
          Array.prototype.forEach.call(b.querySelectorAll(".ch"), function(x){ if(+x.getAttribute("data-v") === q[1]) x.classList.add("rok"); else if(x === c) x.classList.add("rbad"); x.disabled = true; });
          b.querySelector(".out").innerHTML = '<div class="fbk ' + (ok ? "ok" : "bad") + '">' + (ok ? "✓ " : "✗ ") + esc(q[2]) + '</div><div class="row"><button class="go nx">Nächste →</button></div>';
          b.querySelector(".nx").onclick = hTask;
        }; });
      }
      llTask(); cnfTask(); hTask();
    }
  };
  P._a8test = { ff: ff, ll1: ll1, randLL: randLL };
})();
