/* TGI-Klausurtrainer – Aufgabe 1 (Mathematische Grundlagen) und 2 (Algorithmusbegriff).
   Definitionen wörtlich nach TGI01 (Def. 2.1, 3.1–3.11) und GDI01 Kap. 1. Registriert sich in window.TGI_PARTS. */
(function(){
  "use strict";
  var P = window.TGI_PARTS = window.TGI_PARTS || {};

  /* ---------- Definitionen zum Abrufen (Original-Wortlaut der Hefte) ---------- */
  var DEFS = [
    { id: "alg", a: "a2", t: "Algorithmus (TGI01)", d: "Ein Algorithmus ist eine Bearbeitungsvorschrift zur Lösung eines Problems, die die folgenden Eigenschaften hat: a) Die Vorschrift ist mit endlichen Mitteln beschreibbar (Finitheit). b) Es ist immer eindeutig definiert, welche Regel in der Vorschrift als nächste anzuwenden ist (Determinismus). c) Die Ausgabe ist immer eindeutig bestimmt (Determiniertheit). Zusätzlich wird man zumeist noch fordern: d) Das Verfahren darf zu jedem Zeitpunkt nur angemessen viel Speicherplatz benötigen (Platzkomplexität). e) Das Verfahren sollte zu einem angemessenen Zeitpunkt terminieren (Zeitkomplexität, Terminiertheit).", q: "TGI01 Def. 2.1" },
    { id: "alg-gdi", a: "a2", t: "Algorithmus (Kurzform GDI01)", d: "Ein Algorithmus ist eine endliche Menge von eindeutig festgelegten Verfahrensvorschriften zur Lösung eines Problems durch eine in der Regel endliche Menge von Einzelschritten.", q: "GDI01 Kap. 1" },
    { id: "finit", a: "a2", t: "Finitheit vs. Terminiertheit", d: "Finit: Die Vorschrift (der Text, das Programm) ist mit endlichen Mitteln beschreibbar – eine Eigenschaft der BESCHREIBUNG. Terminiert: Die AUSFÜHRUNG endet nach endlich vielen Schritten. Ein endlicher Text kann trotzdem endlos laufen (z. B. while(true)) – finit, aber nicht terminierend. Finitheit ist Pflicht, Terminiertheit nur Zusatzforderung.", q: "nach TGI01 Def. 2.1" },
    { id: "det", a: "a2", t: "Determinismus vs. Determiniertheit", d: "Deterministisch: Es ist immer eindeutig festgelegt, welche Regel als nächste angewendet wird – der WEG ist eindeutig. Determiniert: Die Ausgabe ist immer eindeutig bestimmt – gleiche Eingabe liefert stets dieselbe AUSGABE. Ein Verfahren kann determiniert sein, ohne deterministisch zu sein (verschiedene Wege, gleiches Ergebnis).", q: "nach TGI01 Def. 2.1" },
    { id: "menge", a: "a1", t: "Menge", d: "Unter einer Menge verstehen wir jede Zusammenfassung M von bestimmten wohlunterschiedenen Objekten (m) unserer Anschauung oder unseres Denkens (welche die Elemente von M genannt werden) zu einem Ganzen. Intensional: M = { x | P(x) } – alle Objekte, für die das Prädikat P zutrifft.", q: "TGI01 Def. 3.1/3.2" },
    { id: "kart", a: "a1", t: "Kartesisches Produkt", d: "Seien zwei Mengen M1, M2 gegeben. M1 × M2 = { (x1, x2) | x1 ∈ M1 und x2 ∈ M2 } heißt kartesisches Produkt (Kreuzprodukt) – jedem Element der ersten Menge wird jedes Element der zweiten einmal zugeordnet.", q: "TGI01 Def. 3.5" },
    { id: "rel", a: "a1", t: "Relation", d: "Sei eine Menge M gegeben. Jede Teilmenge R ⊆ M × M beschreibt eine zweistellige Relation. Eine Relation ist damit eine Teilmenge des kartesischen Produktes einer Menge mit sich selbst; sie setzt Elemente der Menge mit anderen Elementen in Beziehung. Schreibweise: (x, y) ∈ R oder xRy.", q: "TGI01 Def. 3.6" },
    { id: "refl", a: "a1", t: "reflexiv", d: "R ist reflexiv, falls für alle x ∈ M gilt: xRx.", q: "TGI01 Def. 3.7" },
    { id: "sym", a: "a1", t: "symmetrisch", d: "R ist symmetrisch, falls für alle x, y ∈ M gilt: Wenn xRy, dann auch yRx.", q: "TGI01 Def. 3.7" },
    { id: "anti", a: "a1", t: "antisymmetrisch", d: "R ist antisymmetrisch, falls für alle x, y ∈ M gilt: Wenn xRy und x ≠ y, dann gilt niemals yRx.", q: "TGI01 Def. 3.7" },
    { id: "asym", a: "a1", t: "asymmetrisch", d: "R ist asymmetrisch, falls für alle x, y ∈ M gilt: Wenn xRy, dann niemals yRx. (Damit auch nie xRx.)", q: "TGI01 Def. 3.7" },
    { id: "trans", a: "a1", t: "transitiv", d: "R ist transitiv, falls für alle x, y, z ∈ M gilt: Wenn xRy und yRz, dann auch xRz.", q: "TGI01 Def. 3.7" },
    { id: "vergl", a: "a1", t: "vergleichbar (Totalität) · totale Ordnung", d: "R ist vergleichbar, falls für alle x, y ∈ M gilt: xRy oder yRx. R heißt totale (lineare) Ordnung, wenn R reflexiv, antisymmetrisch, transitiv und vergleichbar ist.", q: "TGI01 Def. 3.7" },
    { id: "ordn", a: "a1", t: "Halbordnung · Äquivalenzrelation", d: "R heißt Halbordnung (partielle Ordnung), falls R reflexiv, antisymmetrisch und transitiv ist. R heißt Äquivalenzrelation, falls R reflexiv, symmetrisch und transitiv ist – sie teilt die Trägermenge in Klassen.", q: "TGI01 Def. 3.8" },
    { id: "op", a: "a1", t: "Operation", d: "Seien die Mengen M1, M2, …, Mn und M gegeben. Jede Zuordnung von Werten des kartesischen Produktes M1 × M2 × … × Mn zu Werten aus M wird als n-stellige Operation bezeichnet. Zweistellig über einer Menge: Op: M × M → M, Op(x1, x2) = y.", q: "TGI01 Def. 3.9" },
    { id: "total", a: "a1", t: "total", d: "Op heißt total, wenn für alle Kombinationen aus Eingabewerten ein Wert aus M definiert ist. Formal: ∀ x1, x2 ∈ M ∃ y ∈ M mit Op(x1, x2) = y.", q: "TGI01 Def. 3.10" },
    { id: "inj", a: "a1", t: "injektiv", d: "Op heißt injektiv, wenn jede Kombination aus Eingabewerten einen verschiedenen Wert aus M liefert – jeder Wert aus M ist höchstens einmal das Ergebnis. Formal: ∀ y ∈ M: |{ (x1, x2) | Op(x1, x2) = y }| ≤ 1.", q: "TGI01 Def. 3.10" },
    { id: "surj", a: "a1", t: "surjektiv", d: "Op heißt surjektiv, wenn jeder Wert aus M wenigstens einmal das Ergebnis der Anwendung der Operation ist. Formal: ∀ y ∈ M: |{ (x1, x2) | Op(x1, x2) = y }| ≥ 1.", q: "TGI01 Def. 3.10" },
    { id: "bij", a: "a1", t: "bijektiv", d: "Op heißt bijektiv, wenn Op sowohl injektiv als auch surjektiv ist. Formal: ∀ y ∈ M: |{ (x1, x2) | Op(x1, x2) = y }| = 1.", q: "TGI01 Def. 3.10" },
    { id: "alge", a: "a1", t: "Algebra", d: "Die Struktur A = (M1, …, Mm, Op1, …, Opn) heißt mehrsortige Algebra – zuerst die Trägermengen, dann die Operationen. Universell heißt sie, wenn die Operationen wiederum nur Werte aus den Mi liefern. Bei m = 1 spricht man nur von einer Algebra. Beispiel: (ℕ, +) ist eine universelle Algebra, + ist total.", q: "TGI01 Def. 3.11" }
  ];

  function defsHtml(sec, ui){
    return '<div class="blk aw"><h3>Definitionen aus dem Kopf – erst selbst aufschreiben, dann aufdecken</h3><p style="font-size:.84rem;color:var(--ink-soft);margin-top:0">In der Klausur wird wörtlich gefragt („Definieren Sie …“). Auf Papier oder ins Feld schreiben, dann vergleichen und ehrlich einstufen. Der Stand wird auf allen Geräten gespeichert.</p><div class="defs" data-sec="' + sec + '">' +
      DEFS.filter(function(x){ return x.a === sec; }).map(function(x){
        return '<div class="defc" data-d="' + x.id + '"><div class="dh"><b>' + ui.esc(x.t) + '</b><span class="dst"></span></div><div class="db"></div></div>'; }).join("") + '</div></div>';
  }
  function initDefs(root, ui){
    Array.prototype.forEach.call(root.querySelectorAll(".defc"), function(c){
      var x = DEFS.filter(function(d){ return d.id === c.getAttribute("data-d"); })[0];
      function stat(){ var s = ui.getDef(x.id); c.querySelector(".dst").innerHTML = s ? '<span class="pill p' + s + '">' + ({ 1: "neu", 2: "unsicher", 3: "sitzt" })[s] + '</span>' : '<span class="pill">offen</span>'; }
      stat();
      c.querySelector(".dh").onclick = function(){
        var b = c.querySelector(".db");
        if(b.innerHTML){ b.innerHTML = ""; return; }
        b.innerHTML = '<textarea rows="3" placeholder="Definition aus dem Kopf …"></textarea><div class="row"><button class="go rv">Aufdecken</button></div><div class="orig"></div>';
        b.querySelector(".rv").onclick = function(){
          b.querySelector(".orig").innerHTML = '<div class="od">' + ui.esc(x.d) + '<small>' + ui.esc(x.q) + '</small></div><div class="row"><span style="font-size:.8rem;color:var(--ink-soft)">Wie gut saß es?</span><button class="go sec g" data-s="1">nicht gewusst</button><button class="go sec g" data-s="2">teilweise</button><button class="go sec g" data-s="3">sitzt</button></div>';
          Array.prototype.forEach.call(b.querySelectorAll(".g"), function(g){ g.onclick = function(){ ui.setDef(x.id, +g.getAttribute("data-s")); stat(); b.innerHTML = ""; }; });
        };
        var ta = b.querySelector("textarea"); if(ta) ta.focus();
      };
    });
  }

  /* ---------- Relationen: Eigenschaften selbst nachrechnen ---------- */
  function relProps(M, R){
    var has = function(x, y){ return R.some(function(p){ return p[0] === x && p[1] === y; }); }, out = {};
    var nr = M.filter(function(x){ return !has(x, x); });
    out.refl = { ok: nr.length === 0, why: nr.length ? "(" + nr[0] + ", " + nr[0] + ") fehlt" : "jedes x steht mit sich selbst in Relation" };
    var ns = R.filter(function(p){ return !has(p[1], p[0]); });
    out.sym = { ok: ns.length === 0, why: ns.length ? "(" + ns[0].join(", ") + ") ∈ R, aber (" + ns[0][1] + ", " + ns[0][0] + ") ∉ R" : (R.length ? "zu jedem Paar ist auch das umgedrehte drin" : "leere Relation: es gibt kein Paar, das die Regel verletzt") };
    var na = R.filter(function(p){ return p[0] !== p[1] && has(p[1], p[0]); });
    out.anti = { ok: na.length === 0, why: na.length ? "(" + na[0].join(", ") + ") und (" + na[0][1] + ", " + na[0][0] + ") mit " + na[0][0] + " ≠ " + na[0][1] : "kein Paar x ≠ y ist in beide Richtungen drin" };
    var nas = R.filter(function(p){ return has(p[1], p[0]); });
    out.asym = { ok: nas.length === 0, why: nas.length ? (nas[0][0] === nas[0][1] ? "(" + nas[0].join(", ") + ") ∈ R – xRx ist bei asymmetrisch verboten" : "(" + nas[0].join(", ") + ") und (" + nas[0][1] + ", " + nas[0][0] + ")") : "kein Paar kommt umgedreht vor" };
    var nt = null;
    R.forEach(function(p){ R.forEach(function(q){ if(!nt && p[1] === q[0] && !has(p[0], q[1])) nt = [p, q]; }); });
    out.trans = { ok: !nt, why: nt ? "(" + nt[0].join(", ") + ") und (" + nt[1].join(", ") + ") ∈ R, aber (" + nt[0][0] + ", " + nt[1][1] + ") ∉ R" : (R.some(function(p){ return R.some(function(q){ return p[1] === q[0]; }); }) ? "jede Kette xRy, yRz hat auch xRz" : "es gibt keine Kette xRy, yRz – die Bedingung kann nie verletzt werden") };
    return out;
  }
  var PROPS = [["refl", "reflexiv"], ["sym", "symmetrisch"], ["anti", "antisymmetrisch"], ["asym", "asymmetrisch"], ["trans", "transitiv"]];
  function relStr(R){ return R.length ? "{" + R.map(function(p){ return "(" + p.join(", ") + ")"; }).join(", ") + "}" : "∅"; }
  function relTable(M, R, ui){
    var pr = relProps(M, R);
    return '<table class="ptab"><tbody>' + PROPS.map(function(k){ var v = pr[k[0]]; return '<tr><td>' + k[1] + '</td><td><b class="' + (v.ok ? "yes" : "no") + '">' + (v.ok ? "ja" : "nein") + '</b></td><td>' + ui.esc(v.why) + '</td></tr>'; }).join("") + '</tbody></table>';
  }
  function randRel(){
    var M = [1, 2, 3, 4], R = [], kind = Math.random();
    M.forEach(function(x){ M.forEach(function(y){ if(Math.random() < .22) R.push([x, y]); }); });
    if(kind < .2) M.forEach(function(x){ if(!R.some(function(p){ return p[0] === x && p[1] === x; })) R.push([x, x]); });      // reflexiv
    else if(kind < .4) R.slice().forEach(function(p){ if(!R.some(function(q){ return q[0] === p[1] && q[1] === p[0]; })) R.push([p[1], p[0]]); }); // symmetrisch
    else if(kind < .5) R = [];
    R.sort(function(p, q){ return p[0] - q[0] || p[1] - q[1]; });
    return { M: M, R: R.slice(0, 7) };
  }

  /* ---------- Operationen: total / injektiv / surjektiv ---------- */
  var OPS = [
    { o: "Op(a, b) = a + b über ℕ = {0, 1, 2, …}", p: [1, 0, 1], w: ["immer definiert, Ergebnis in ℕ", "1 + 2 = 2 + 1 = 3", "jedes y = y + 0"] },
    { o: "Op(a, b) = a − b über ℕ", p: [0, 0, 1], w: ["2 − 5 = −3 ∉ ℕ", "5 − 3 = 4 − 2 = 2", "jedes y = y − 0"] },
    { o: "Op(a, b) = a % b über ℕ", p: [0, 0, 1], w: ["a % 0 ist nicht definiert", "1 % 2 = 1 % 3 = 1", "jedes y = y % (y + 1)"] },
    { o: "Op(a, b) = a · b über ℕ", p: [1, 0, 1], w: ["immer definiert", "2 · 3 = 3 · 2", "jedes y = y · 1"] },
    { o: "Op(a, b) = a (Projektion) über ℕ", p: [1, 0, 1], w: ["immer definiert", "Op(1, 2) = Op(1, 3) = 1", "jedes y = Op(y, 0)"] },
    { o: "Op(a, b) = 4 (konstant) über ℕ", p: [1, 0, 0], w: ["immer definiert", "alle Eingaben liefern 4", "z. B. 5 wird nie Ergebnis"] },
    { o: "Op(a, b) = max(a, b) über ℕ", p: [1, 0, 1], w: ["immer definiert", "max(1, 3) = max(3, 2) = 3", "jedes y = max(y, 0)"] },
    { o: "Op(a, b) = a / b über ℝ", p: [0, 0, 1], w: ["a / 0 ist nicht definiert", "1/2 = 2/4", "jedes y = y / 1"] },
    { o: "quadrat(x) = x² über ℕ (einstellig)", p: [1, 1, 0], w: ["für jedes x ∈ ℕ ist x² ∈ ℕ", "auf ℕ (keine negativen Zahlen) haben verschiedene x verschiedene Quadrate", "2 ist kein Quadrat einer natürlichen Zahl"] },
    { o: "quadrat(x) = x² über ℤ (einstellig)", p: [1, 0, 0], w: ["immer definiert, Ergebnis in ℤ", "(−2)² = 2² = 4", "−1 (oder 2) ist nie Ergebnis"] },
    { o: "succ(x) = x + 1 über ℕ (Nachfolger)", p: [1, 1, 0], w: ["immer definiert", "verschiedene x → verschiedene x + 1", "0 ist nie Ergebnis"] },
    { o: "pred(x) = x − 1 über ℕ (Vorgänger)", p: [0, 1, 1], w: ["pred(0) = −1 ∉ ℕ", "verschiedene x → verschiedene x − 1", "jedes y = pred(y + 1)"] },
    { o: "Op(a, b) = a · b über ℝ \\ {0}", p: [1, 0, 1], w: ["Produkt zweier Zahlen ≠ 0 ist ≠ 0", "2 · 3 = 3 · 2", "jedes y = y · 1"] },
    { o: "Op(a, b) = a − b über ℝ \\ {0}", p: [0, 0, 1], w: ["5,7 − 5,7 = 0 liegt nicht in der Trägermenge (Heft-Beispiel)", "3 − 1 = 4 − 2", "jedes y = (y + 1) − 1"] }
  ];
  var OPN = ["total", "injektiv", "surjektiv"];

  /* ---------- Algorithmus-Eigenschaften einordnen ---------- */
  var EIG = [
    ["terminiert immer", "z", "Terminiertheit wird nur „zusätzlich zumeist“ gefordert (e)"],
    ["terminiert manchmal", "k", "keine geforderte Eigenschaft – auch ein nicht immer terminierendes Verfahren kann nach Def. 2.1 ein Algorithmus sein"],
    ["hält die syntaktischen Vorschriften der Firma ein", "k", "Programmierstil, keine Eigenschaft des Algorithmusbegriffs"],
    ["deterministisch", "o", "Determinismus (b) ist Pflicht"],
    ["zeitsparend (sehr schnell)", "z", "Zeitkomplexität (e) – Zusatzforderung"],
    ["hält sich an die DSGVO", "k", "rechtliche Anforderung, kein Teil der Definition"],
    ["determiniert", "o", "Determiniertheit (c) ist Pflicht"],
    ["läuft auf dem iPhone 6", "k", "Ein Algorithmus ist unabhängig von Maschine und Programmiersprache"],
    ["mit endlichen Mitteln beschreibbar (finit)", "o", "Finitheit (a) ist Pflicht"],
    ["braucht nur angemessen viel Speicher", "z", "Platzkomplexität (d) – Zusatzforderung"],
    ["ist in Groovy programmiert", "k", "Darstellung/Implementierung, nicht der Algorithmus selbst"],
    ["liefert bei gleicher Eingabe immer dieselbe Ausgabe", "o", "das ist Determiniertheit (c)"],
    ["der nächste Schritt ist immer eindeutig festgelegt", "o", "das ist Determinismus (b)"],
    ["findet immer die optimale Lösung", "k", "keine Eigenschaft des Algorithmusbegriffs (Korrektheit/Qualität)"]
  ];
  var EIGN = { o: "obligatorisch", z: "Zusatzeigenschaft", k: "keins von beiden" };

  /* ---------- „Ist der Text ein Algorithmus?“ ---------- */
  var TEXTE = [
    { q: "2020/1", t: 'println "Bitte geben Sie Ihren Namen ein"\ninput = readln()\noutput = "Ihr Name: " + input\nprintln output\nfor (int i = 0; i < 20; i++) { print "-" }\nprintln', ja: true,
      e: "Ja. Finit: endlicher Programmtext. Deterministisch: die Anweisungen werden der Reihe nach ausgeführt, der nächste Schritt ist immer eindeutig. Determiniert: zur gleichen Eingabe (Name) entsteht immer dieselbe Ausgabe. Zusätzlich terminiert er (die Schleife läuft genau 20-mal) und braucht kaum Speicher. Gelöstes Problem: den eingegebenen Namen ausgeben." },
    { q: "2020/2", t: "Lesen Sie eine Zahl zwischen 1 und 10 ein und speichern Sie diese in input.\nEntweder wird jetzt input verdoppelt oder verdreifacht.\nAnschließend wird berechnet: output = 7 + 5.\noutput wird als Ergebnis ausgegeben.", ja: false,
      e: "Nein. „Entweder … oder …“ legt nicht fest, welche Regel als nächste angewendet wird → nicht deterministisch (b verletzt). Interessant: Die Ausgabe ist trotzdem immer 12 – das Verfahren ist determiniert (c erfüllt), finit (a) und terminiert. Weil die Definition aber alle drei Pflichteigenschaften verlangt, ist es kein Algorithmus." },
    { q: "2020/3", t: "Der Tagesplaner: Sie haben eine Menge M an zu erledigenden Aufgaben mit Namen und Wichtigkeit. Sie wollen einen Tagesplan (Liste) T erstellen. Führen Sie maximal 8-mal durch: a) Entnehmen Sie M ein Element, falls M nicht leer ist. b) Streichen Sie die Aufgabe aus M. c) Fügen Sie T diese Aufgabe an. Sortieren Sie T nach Wichtigkeit und geben Sie T aus.", ja: false,
      e: "Nein. „Entnehmen Sie M ein Element“ sagt nicht, welches – eine Menge hat keine Reihenfolge → nicht deterministisch. Hat M mehr als 8 Aufgaben, hängt auch die Ausgabe davon ab, welche 8 gezogen werden → nicht determiniert. Finit ist es, und es terminiert (höchstens 8 Durchläufe). Gegenbeispiel genügt: M mit 9 Aufgaben → zwei Ausführungen können verschiedene T liefern." },
    { q: "2017", t: "Der Nutzer gibt eine positive oder negative ganze Zahl ein, gespeichert in a. Der Nutzer gibt seinen Geburtsmonat ein, gespeichert in b. Danach wird solange b von a abgezogen, bis die Zahl 0 erreicht ist.", ja: true,
      e: "Nach Def. 2.1 ja: endlich beschrieben (finit), jeder nächste Schritt eindeutig (deterministisch), Ergebnis eindeutig (determiniert). Erfüllte wünschenswerte Eigenschaft: Platzkomplexität – nur zwei Variablen. Nicht erfüllt: Terminiertheit – z. B. a = 7, b = 2: 7, 5, 3, 1, −1, … erreicht nie 0; ebenso jede negative Zahl a. (Genau dieses Gegenbeispiel nennen – damit ist die Frage nach der nicht erfüllten Eigenschaft beantwortet.)" },
    { q: "Heft Üb. 2.2 a", t: "Münzwurfspiel: Man wirft eine Münze. Zeigt sie Zahl, wird noch einmal geworfen; zeigt sie Wappen, ist das Spiel beendet.", ja: false,
      e: "Nein. Das Ergebnis eines Münzwurfs ist zufällig → welche Regel als nächste kommt, hängt vom Zufall ab (nicht deterministisch); die Zahl der Würfe ist nicht eindeutig bestimmt; es muss nicht terminieren (theoretisch immer Zahl)." },
    { q: "Heft Üb. 2.2 b", t: "Zahlen addieren: Es werden zwei Zahlen a und b eingegeben. Addiere die beiden Zahlen und gib die Summe c = a + b aus.", ja: true,
      e: "Ja. Finit, deterministisch, determiniert; terminiert sofort, braucht wenig Speicher." },
    { q: "Heft Üb. 2.2 c", t: "Schachcomputer: Analysiere die Stellung deines Gegners; finde danach den besten Zug und führe ihn aus.", ja: false,
      e: "Nein. „Finde den besten Zug“ ist keine eindeutig festgelegte, ausführbare Regel – es fehlt, WIE gesucht wird (nicht deterministisch). Selbst vollständig ausprogrammiert wäre es praktisch nicht umsetzbar (Zeitkomplexität)." },
    { q: "Heft Üb. 2.2 d", t: "Summiere alle Sterne und Planeten unseres Milchstraßensystems auf. Gib aus, ob die Summe gerade oder ungerade ist.", ja: false,
      e: "Nein (praktisch): Die Eingabe ist nicht bestimmbar, die Vorschrift nicht ausführbar; die Ausgabe ist nicht eindeutig bestimmt, weil sich die Anzahl ständig ändert." }
  ];

  /* ---------- Aufgabe 1 ---------- */
  P.a1 = {
    tab: "1 · Relationen & Operationen",
    html: function(ui){
      var M5 = [1, 2, 3, 4, 5];
      return '<div class="sec" id="a1"><h2>Aufgabe 1 · Mathematische Grundlagen <small>TGI01 Kap. 3</small></h2>' +
        '<div class="blk"><h3>So wird gefragt</h3>' +
          '<div class="q"><i>2020/1</i>Definieren Sie den Begriff der Relation. · M = {1, …, 5}: Sind R₁ = {(1,1), (2,2), (3,3)} und R₂ = {(1,3), (2,3)} reflexiv und/oder transitiv?</div>' +
          '<div class="q"><i>2020/2</i>Definieren Sie den Begriff der Operation. · Beweisen oder widerlegen: Jede surjektive Operation ist auch total.</div>' +
          '<div class="q"><i>2020/3</i>Definieren Sie symmetrische und antisymmetrische Relationen. · M = {1, …, 5}: Sind R₁ = ∅ und R₂ = {(1,3), (3,1)} symmetrisch und/oder antisymmetrisch?</div>' +
          '<div class="q"><i>2017</i>Relation „Ziffernoten mit gleicher Wortnote“: formal definieren, Elemente angeben, 1.7 R 2.3 formal aufschreiben, Äquivalenzrelation beweisen oder widerlegen. · Algebra A = (ℕ, quadrat()), f(x) = x²: Ist quadrat() surjektiv? Ist A total?</div>' +
          '<p style="font-size:.84rem;color:var(--ink-soft)">Immer gleich gebaut: <b>Definition</b> (wörtlich) + <b>Eigenschaft an einem kleinen Beispiel prüfen</b>, mit Begründung oder Gegenbeispiel.</p></div>' +
        defsHtml("a1", ui) +
        '<div class="blk aw"><h3>So prüfst du eine Relation – Merksätze</h3><ul class="pts">' +
          '<li><b>reflexiv:</b> Alle (x, x) für <b>jedes</b> x aus M da? Ein fehlendes Paar genügt zum Widerlegen. Achtung: M = {1, …, 5} – auch (4,4) und (5,5) müssen drin sein!</li>' +
          '<li><b>symmetrisch:</b> Zu jedem Paar das umgedrehte da?</li>' +
          '<li><b>antisymmetrisch:</b> Kein Paar mit x ≠ y in <b>beiden</b> Richtungen? (x, x) ist erlaubt.</li>' +
          '<li><b>asymmetrisch:</b> Kein Paar in beiden Richtungen – und auch kein (x, x).</li>' +
          '<li><b>transitiv:</b> Für jede Kette (x, y), (y, z) muss (x, z) drin sein. Gibt es gar keine Kette, ist die Relation automatisch transitiv.</li>' +
          '<li><b>Leere Relation ∅:</b> symmetrisch, antisymmetrisch, asymmetrisch und transitiv („leer wahr“ – es gibt kein Paar, das etwas verletzt), aber <b>nicht reflexiv</b> (sobald M nicht leer ist).</li></ul></div>' +
        '<div class="blk"><h3>Musterlösung 2020/1 – M = {1, 2, 3, 4, 5}</h3><p><b>R₁ = {(1,1), (2,2), (3,3)}</b></p>' + relTable(M5, [[1, 1], [2, 2], [3, 3]], ui) + '<p style="margin-top:.7rem"><b>R₂ = {(1,3), (2,3)}</b></p>' + relTable(M5, [[1, 3], [2, 3]], ui) + '</div>' +
        '<div class="blk"><h3>Musterlösung 2020/3 – M = {1, 2, 3, 4, 5}</h3><p><b>R₁ = ∅</b></p>' + relTable(M5, [], ui) + '<p style="margin-top:.7rem"><b>R₂ = {(1,3), (3,1)}</b></p>' + relTable(M5, [[1, 3], [3, 1]], ui) + '</div>' +
        '<div class="blk"><h3>Musterlösung 2017 – Ziffernoten mit gleicher Wortnote</h3>' +
          '<p>Trägermenge N = {1.0, 1.3, 1.7, 2.0, 2.3, 2.7, 3.0, 3.3, 3.7, 4.0, 5.0}, w(x) = Wortnote von x (1.0–1.3 sehr gut, 1.7–2.3 gut, 2.7–3.3 befriedigend, 3.7–4.0 ausreichend, 5.0 nicht ausreichend).</p>' +
          '<p><b>Formal:</b> R = { (x, y) ∈ N × N | w(x) = w(y) }. <b>Einige Elemente:</b> (1.0, 1.3), (1.7, 2.0), (2.0, 1.7), (3.0, 3.3), (5.0, 5.0). <b>Formal „1.7 und 2.3 in Relation“:</b> (1.7, 2.3) ∈ R bzw. 1.7 R 2.3.</p>' +
          '<p><b>Äquivalenzrelation – bewiesen:</b> reflexiv, weil w(x) = w(x) für jedes x; symmetrisch, weil aus w(x) = w(y) folgt w(y) = w(x); transitiv, weil aus w(x) = w(y) und w(y) = w(z) folgt w(x) = w(z). Alle drei Eigenschaften erben sich von der Gleichheit „=“. Die Äquivalenzklassen sind genau die Wortnoten.</p></div>' +
        '<div class="blk"><h3>Musterlösungen Operationen (2020/2, 2017)</h3>' +
          '<div class="claim"><span class="v f">FALSCH</span><span class="c">Jede surjektive Operation ist auch total. (2020/2)</span><p>Gegenbeispiel: Op(a, b) = a % b über ℕ. <b>Surjektiv:</b> Jedes y ∈ ℕ ist ein Ergebnis, z. B. y = y % (y + 1). <b>Nicht total:</b> Für b = 0 ist a % 0 nicht definiert. Also surjektiv, aber nicht total. ∎ (Genauso: a − b über ℕ – surjektiv wegen y = y − 0, nicht total wegen 2 − 5 ∉ ℕ.)</p></div>' +
          '<div class="claim"><span class="v f">NEIN</span><span class="c">quadrat() mit f(x) = x² über ℕ ist surjektiv. (2017)</span><p>Gegenbeispiel: 2 ∈ ℕ, aber es gibt kein x ∈ ℕ mit x² = 2 (1² = 1, 2² = 4).</p></div>' +
          '<div class="claim"><span class="v w">JA</span><span class="c">A = (ℕ, quadrat()) ist total. (2017)</span><p>Für jedes x ∈ ℕ ist x² definiert und wieder eine natürliche Zahl – die Operation ist für alle Eingaben definiert. (Damit ist A auch universell.)</p></div></div>' +
        '<div id="gen-a1"></div></div>';
    },
    init: function(root, ui){
      initDefs(root, ui);
      var g = root.querySelector("#gen-a1");
      g.innerHTML = '<h3 class="genh">Üben mit neuen Beispielen</h3><div class="gen" data-g="rel"><h3>Relation prüfen: welche Eigenschaften hat R über M = {1, 2, 3, 4}?</h3><div class="body"></div></div>' +
        '<div class="gen" data-g="op"><h3>Operation prüfen: total, injektiv, surjektiv?</h3><div class="body"></div></div>';
      function relTask(){
        var b = g.querySelector('[data-g="rel"] .body'), t = randRel(), pr = relProps(t.M, t.R), done = false;
        b.innerHTML = '<div class="ask">R = ' + ui.esc(relStr(t.R)) + '</div><div class="ynr">' + PROPS.map(function(k){ return '<label><span>' + k[1] + '</span><select data-k="' + k[0] + '"><option value="">?</option><option value="1">ja</option><option value="0">nein</option></select></label>'; }).join("") +
          '</div><div class="row"><button class="go chk">Prüfen</button><button class="go sec nw">Neue Relation</button><span class="score">' + ui.gscore("rel") + '</span></div><div class="out"></div>';
        b.querySelector(".chk").onclick = function(){
          var all = true, any = false;
          Array.prototype.forEach.call(b.querySelectorAll("select"), function(s){ if(s.value !== "") any = true; var ok = s.value !== "" && (s.value === "1") === pr[s.getAttribute("data-k")].ok; s.parentNode.className = ok ? "okk" : "badd"; if(!ok) all = false; });
          if(!any) return;
          if(!done){ ui.glog("rel", all); done = true; b.querySelector(".score").textContent = ui.gscore("rel"); }
          b.querySelector(".out").innerHTML = '<div class="fbk ' + (all ? "ok" : "bad") + '">' + (all ? "✓ Alles richtig." : "✗ Nicht alles richtig – Begründungen:") + '</div>' + relTable(t.M, t.R, ui);
        };
        b.querySelector(".nw").onclick = relTask;
      }
      function opTask(){
        var b = g.querySelector('[data-g="op"] .body'), t = OPS[Math.floor(Math.random() * OPS.length)], done = false;
        b.innerHTML = '<div class="ask">' + ui.esc(t.o) + '</div><div class="ynr">' + OPN.map(function(n, i){ return '<label><span>' + n + '</span><select data-i="' + i + '"><option value="">?</option><option value="1">ja</option><option value="0">nein</option></select></label>'; }).join("") +
          '</div><div class="row"><button class="go chk">Prüfen</button><button class="go sec nw">Neue Operation</button><span class="score">' + ui.gscore("op") + '</span></div><div class="out"></div>';
        b.querySelector(".chk").onclick = function(){
          var all = true;
          Array.prototype.forEach.call(b.querySelectorAll("select"), function(s){ var i = +s.getAttribute("data-i"), ok = s.value !== "" && +s.value === t.p[i]; s.parentNode.className = ok ? "okk" : "badd"; if(!ok) all = false; });
          if(!done){ ui.glog("op", all); done = true; b.querySelector(".score").textContent = ui.gscore("op"); }
          b.querySelector(".out").innerHTML = '<div class="fbk ' + (all ? "ok" : "bad") + '">' + (all ? "✓ Richtig." : "✗ Nicht ganz.") + '</div><table class="ptab"><tbody>' + OPN.map(function(n, i){ return '<tr><td>' + n + '</td><td><b class="' + (t.p[i] ? "yes" : "no") + '">' + (t.p[i] ? "ja" : "nein") + '</b></td><td>' + ui.esc(t.w[i]) + '</td></tr>'; }).join("") + '</tbody></table>';
        };
        b.querySelector(".nw").onclick = opTask;
      }
      relTask(); opTask();
    }
  };

  /* ---------- Aufgabe 2 ---------- */
  P.a2 = {
    tab: "2 · Algorithmusbegriff",
    html: function(ui){
      return '<div class="sec" id="a2"><h2>Aufgabe 2 · Algorithmusbegriff <small>TGI01 Kap. 2 · GDI01 Kap. 1</small></h2>' +
        '<div class="blk"><h3>So wird gefragt</h3>' +
          '<div class="q"><i>2020/1</i>Definieren Sie den Begriff des Algorithmus. Nennen Sie alle notwendigen Eigenschaften. · Beweisen oder widerlegen: Der Text (Programm) ist ein Algorithmus.</div>' +
          '<div class="q"><i>2020/2</i>Unterscheiden Sie „terminiert“ und „finit“. · Beweisen oder widerlegen: Der Text ist ein Algorithmus.</div>' +
          '<div class="q"><i>2020/3</i>Tabelle: Sind die Eigenschaften obligatorisch oder Zusatzeigenschaft? · Beweisen oder widerlegen: Der Text (Tagesplaner) ist ein Algorithmus.</div>' +
          '<div class="q"><i>2017</i>Definieren Sie den Begriff des Algorithmus. · Ist der Text ein Algorithmus? Eine wünschenswerte Eigenschaft, die erfüllt ist, und eine, die nicht erfüllt ist.</div></div>' +
        '<div class="blk aw"><h3>Das Gerüst – auswendig</h3>' +
          '<table class="ptab"><tbody><tr><td><b>Pflicht</b></td><td>a) <b>Finitheit</b> – endlich beschreibbar<br>b) <b>Determinismus</b> – nächster Schritt immer eindeutig<br>c) <b>Determiniertheit</b> – Ausgabe immer eindeutig</td></tr>' +
          '<tr><td><b>zusätzlich (zumeist)</b></td><td>d) <b>Platzkomplexität</b> – angemessen viel Speicher<br>e) <b>Zeitkomplexität / Terminiertheit</b> – terminiert zu angemessenem Zeitpunkt</td></tr></tbody></table>' +
          '<p style="font-size:.88rem;margin-top:.6rem"><b>Eselsbrücke „F-D-D“:</b> Finit (der Text), Deterministisch (der Weg), Determiniert (das Ergebnis). Dann „P-Z“: Platz und Zeit.</p>' +
          '<p style="font-size:.88rem"><b>„Ist das ein Algorithmus?“ – Schema:</b> Gehe a), b), c) einzeln durch und belege jede mit einem Satz aus dem Text. Ist eine Pflichteigenschaft verletzt → <b>kein Algorithmus</b>, mit der Textstelle als Beleg („Entweder … oder …“, „ein Element“, „den besten Zug“). Zum Schluss d) und e) kurz bewerten.</p></div>' +
        defsHtml("a2", ui) +
        '<div class="blk"><h3>Musterlösungen „Ist der Text ein Algorithmus?“</h3>' + TEXTE.map(function(x){
          return '<div class="claim"><span class="v ' + (x.ja ? "w" : "f") + '">' + (x.ja ? "JA" : "NEIN") + '</span><span class="c">' + ui.esc(x.q) + '</span><pre class="txtb">' + ui.esc(x.t) + '</pre><p>' + ui.esc(x.e) + '</p></div>'; }).join("") + '</div>' +
        '<div class="blk"><h3>Musterlösung 2020/3 – Tabelle obligatorisch / Zusatz</h3><table class="ptab"><thead><tr><th>Eigenschaft</th><th>Einordnung</th><th>Begründung</th></tr></thead><tbody>' +
          EIG.slice(0, 8).map(function(e){ return '<tr><td>' + ui.esc(e[0]) + '</td><td><b class="' + (e[1] === "o" ? "yes" : e[1] === "z" ? "mid" : "no") + '">' + EIGN[e[1]] + '</b></td><td>' + ui.esc(e[2]) + '</td></tr>'; }).join("") +
          '</tbody></table><p style="font-size:.82rem;color:var(--ink-soft)">Die Tabelle hat nur zwei Spalten. Bei „keins von beiden“ beide leer lassen und daneben kurz begründen – das zeigt, dass du die Definition kennst.</p></div>' +
        '<div id="gen-a2"></div></div>';
    },
    init: function(root, ui){
      initDefs(root, ui);
      var g = root.querySelector("#gen-a2");
      g.innerHTML = '<h3 class="genh">Üben</h3><div class="gen" data-g="eig"><h3>Eigenschaft einordnen: obligatorisch, Zusatz oder keins von beiden?</h3><div class="body"></div></div>' +
        '<div class="gen" data-g="algtxt"><h3>Ist der Text ein Algorithmus? Erst selbst begründen, dann aufdecken</h3><div class="body"></div></div>';
      var ei = Math.floor(Math.random() * EIG.length);
      function eigTask(){
        var b = g.querySelector('[data-g="eig"] .body'), e = EIG[ei % EIG.length]; ei++;
        b.innerHTML = '<div class="ask">„' + ui.esc(e[0]) + '“</div><div class="row">' + ["o", "z", "k"].map(function(k){ return '<button class="go sec ch" data-k="' + k + '">' + EIGN[k] + '</button>'; }).join("") + '<span class="score">' + ui.gscore("eig") + '</span></div><div class="out"></div>';
        Array.prototype.forEach.call(b.querySelectorAll(".ch"), function(c){ c.onclick = function(){
          var ok = c.getAttribute("data-k") === e[1]; ui.glog("eig", ok); b.querySelector(".score").textContent = ui.gscore("eig");
          b.querySelector(".out").innerHTML = '<div class="fbk ' + (ok ? "ok" : "bad") + '">' + (ok ? "✓ " : "✗ Richtig: " + EIGN[e[1]] + ". ") + ui.esc(e[2]) + '</div><div class="row"><button class="go nx">Nächste →</button></div>';
          b.querySelector(".nx").onclick = eigTask;
          Array.prototype.forEach.call(b.querySelectorAll(".ch"), function(x){ x.disabled = true; });
        }; });
      }
      var ti = Math.floor(Math.random() * TEXTE.length);
      function txtTask(){
        var b = g.querySelector('[data-g="algtxt"] .body'), x = TEXTE[ti % TEXTE.length]; ti++;
        b.innerHTML = '<pre class="txtb">' + ui.esc(x.t) + '</pre><textarea rows="3" placeholder="Deine Begründung: finit? deterministisch? determiniert? terminiert?"></textarea><div class="row"><button class="go sec" data-a="1">Algorithmus</button><button class="go sec" data-a="0">kein Algorithmus</button><span class="score">' + ui.gscore("algtxt") + '</span></div><div class="out"></div>';
        Array.prototype.forEach.call(b.querySelectorAll("[data-a]"), function(c){ c.onclick = function(){
          var ok = (c.getAttribute("data-a") === "1") === x.ja; ui.glog("algtxt", ok); b.querySelector(".score").textContent = ui.gscore("algtxt");
          b.querySelector(".out").innerHTML = '<div class="fbk ' + (ok ? "ok" : "bad") + '">' + (ok ? "✓ " : "✗ ") + ui.esc(x.e) + '<small style="display:block;color:var(--ink-faint);margin-top:.3rem">' + ui.esc(x.q) + '</small></div><div class="row"><button class="go nx">Nächster Text →</button></div>';
          b.querySelector(".nx").onclick = txtTask;
          Array.prototype.forEach.call(b.querySelectorAll("[data-a]"), function(y){ y.disabled = true; });
        }; });
      }
      eigTask(); txtTask();
    }
  };

  P._test = { relProps: relProps, OPS: OPS, EIG: EIG, TEXTE: TEXTE, DEFS: DEFS };
})();
