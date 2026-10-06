/* Skizzen zu MAI09 – Reihen und Integraltransformation.
   Jede Skizze: t = Titel, c = Lesehilfe (HTML), svg = function(K) → SVG-String (K = window.SK). */
(function(){
  "use strict";
  var S = window.ITI_SKETCHES = window.ITI_SKETCHES || {};
  function add(id, t, c, f){ S["mai09-" + id] = { t: t, c: c, svg: f }; }
  function lines(K, x, y, arr, c, o){ o = o || {}; var s = ""; for(var i = 0; i < arr.length; i++) s += K.t(x, y + i * (o.lh || 20), arr[i], c || "s", { a: o.a || "start", s: o.s || 13.5, b: o.b }); return s; }
  function hline(K, M, y, x0, x1, c, lab, o){ o = o || {}; return K.line(M.X(x0), M.Y(y), M.X(x1), M.Y(y), c, { w: 1.6, dash: "6 5" }) + (lab ? K.t(M.X(x1) + (o.dx || 6), M.Y(y) + (o.dy || 0), lab, c, { a: o.a || "start", s: 13, b: true }) : ""); }
  function fact(n){ var r = 1; for(var i = 2; i <= n; i++) r *= i; return r; }
  var PI = Math.PI;

  /* ═════════ Kapitel 1: Reihen ═════════ */

  add("partial", "Reihe = Grenzwert der Partialsummen",
    "<b>Links</b> die einzelnen Glieder aᵢ = (½)ⁱ – sie werden immer kleiner. <b>Rechts</b> die Partialsummen Sₚ = a₁ + … + a_p: Jeder Punkt ist „bis hierher aufaddiert“. Nähern sie sich einem festen Wert S, <b>konvergiert</b> die Reihe gegen S – hier S = 1.",
    function(K){
      var s = K.panel(10, 10, 300, 300, "Glieder aᵢ = (½)ⁱ") + K.panel(330, 10, 300, 300, "Partialsummen Sₚ → 1");
      var M = K.map(40, 260, 25, 360);
      s += K.axes(40, 260, 5, 260, 215, 5, "i", "aᵢ");
      for(var i = 1; i <= 10; i++) s += K.bar(i, Math.pow(0.5, i), 0.66, M, "a");
      s += K.t(M.X(1), M.Y(0.5) - 12, "½", "a", { s: 13, b: true }) + K.t(M.X(2), M.Y(0.25) - 12, "¼", "a", { s: 13, b: true });
      var N = K.map(360, 260, 25, 190);
      s += K.axes(360, 260, 5, 260, 215, 5, "p", "Sₚ");
      s += hline(K, N, 1, 0, 10.2, "m", "S = 1", { dx: -4, dy: -14, a: "end" });
      var pts = [];
      for(var p = 1; p <= 10; p++) pts.push([N.X(p), N.Y(1 - Math.pow(0.5, p))]);
      s += K.path("M" + pts.map(function(q){ return q[0] + " " + q[1]; }).join(" L"), "f", { w: 1.2 });
      pts.forEach(function(q){ s += K.dot(q[0], q[1], "a", 4.5); });
      s += K.t(N.X(1) + 8, N.Y(0.5) + 16, "S₁ = ½", "s", { a: "start", s: 12 }) + K.t(N.X(2) + 8, N.Y(0.75) + 16, "S₂ = ¾", "s", { a: "start", s: 12 });
      return K.svg(640, 320, s);
    });

  add("geom", "Geometrische Reihe ∑ qⁱ = 1/(1 − q) für |q| < 1",
    "<b>Links</b> die „Schokoladenhalbierung“: Die Tafel (Fläche 1) wird immer wieder halbiert – ½ + ¼ + ⅛ + … füllt am Ende genau die ganze Tafel. <b>Rechts</b> die Partialsummen: Für q = ¾ laufen sie auf 1/(1 − ¾) = 4 zu, für q = 1,1 wachsen sie über alle Grenzen.",
    function(K){
      var s = K.panel(10, 10, 300, 310, "∑ (½)ⁱ = 1 (i ≥ 1)") + K.panel(330, 10, 300, 310, "Partialsummen");
      var x = 40, y = 50, w = 240, h = 240, lab = ["½", "¼", "⅛", "1/16", "1/32"];
      for(var k = 1; k <= 9; k++){
        var fill = k % 2 ? "fa" : "fm", px, py, pw, ph;
        if(k % 2){ px = x; py = y; pw = w / 2; ph = h; x += w / 2; w /= 2; }
        else { px = x; py = y; pw = w; ph = h / 2; y += h / 2; h /= 2; }
        s += K.rect(px, py, pw, ph, k % 2 ? "a" : "m", { fill: fill, rx: 0, w: 1.2 });
        if(k <= 5) s += K.t(px + pw / 2, py + ph / 2, lab[k - 1], k % 2 ? "a" : "m", { s: k < 3 ? 20 : k < 5 ? 14 : 10, b: true });
      }
      var M = K.map(360, 285, 21, 40);
      s += K.axes(360, 285, 5, 255, 255, 5, "p", "Sₚ");
      s += hline(K, M, 4, 0, 11.5, "a", "4", { dx: 6 });
      var sum = 0, sum2 = 0;
      for(var p = 0; p <= 11; p++){
        sum += Math.pow(0.75, p); sum2 += Math.pow(1.1, p);
        s += K.dot(M.X(p), M.Y(sum), "a", 4);
        if(sum2 <= 6) s += K.dot(M.X(p), M.Y(sum2), "m", 4);
      }
      s += K.arrow(M.X(5), M.Y(5.6), M.X(5.6), M.Y(6.1), "m", { w: 1.6, head: 8 });
      s += K.t(M.X(4.5), M.Y(6.1), "q = 1,1 → ∞", "m", { a: "end", s: 13, b: true }) + K.t(M.X(9), M.Y(3.3), "q = ¾ → 4", "a", { s: 13, b: true });
      return K.svg(640, 330, s);
    });

  add("quot", "Quotientenkriterium",
    "Man schaut, um welchen <b>Faktor q</b> ein Glied gegenüber dem vorigen schrumpft. Ist dieser Faktor auf Dauer <b>kleiner als 1</b>, werden die Glieder mindestens so schnell klein wie bei einer geometrischen Reihe – die Reihe konvergiert. Bei q &gt; 1 wachsen sie, bei q = 1 sagt das Kriterium nichts.",
    function(K){
      var M = K.map(60, 280, 70, 210), s = K.axes(60, 280, 5, 540, 250, 5, "i", "aᵢ");
      for(var i = 1; i <= 7; i++){
        var v = Math.pow(0.6, i - 1);
        s += K.bar(i, v, 0.5, M, "a");
        if(i < 7){
          var x1 = M.X(i), y1 = M.Y(v) - 6, x2 = M.X(i + 1), y2 = M.Y(v * 0.6) - 6, mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 26;
          s += K.path("M" + x1 + " " + y1 + " Q" + mx + " " + my + " " + (x2 - 4) + " " + (y2 - 4), "m", { w: 1.6 }) + K.dot(x2 - 4, y2 - 4, "m", 3);
          s += K.t(mx, my + 4, "· 0,6", "m", { s: 12, b: true });
        }
      }
      s += K.f(420, 50, "q = lim |aᵢ₊₁ / aᵢ| = 0,6 < 1", "m", { fill: "fm" }) + K.t(420, 82, "⇒ schrumpft wie eine geometrische Reihe ⇒ konvergent", "s", { s: 12.5 });
      return K.svg(620, 312, s);
    });

  add("wurzel", "Wurzelkriterium",
    "Die i-te Wurzel ⁱ√|aᵢ| verrät, wie sich aᵢ <b>auf Dauer verhält: ungefähr wie qⁱ</b>. Hier (aᵢ = (i+1)/2ⁱ) pendeln sich die Punkte bei q = ½ ein – unterhalb der kritischen Grenze 1, also konvergent. Läge q über 1, divergierte die Reihe; bei q = 1 keine Aussage.",
    function(K){
      var M = K.map(60, 280, 25, 200), s = K.axes(60, 280, 5, 540, 255, 5, "i", "ⁱ√|aᵢ|");
      s += hline(K, M, 1, 0, 20.5, "m", "Grenze 1", { dx: -4, dy: -14, a: "end" }) + hline(K, M, 0.5, 0, 20.5, "a", "q = ½", { dx: -4, dy: 14, a: "end" });
      for(var i = 1; i <= 20; i++) s += K.dot(M.X(i), M.Y(Math.pow((i + 1) / Math.pow(2, i), 1 / i)), "c4", 4.5);
      s += K.f(400, 40, "q = lim ⁱ√|aᵢ| < 1 ⇒ konvergent", "a");
      return K.svg(620, 312, s);
    });

  add("leibniz", "Leibniz-Kriterium für alternierende Reihen",
    "Bei wechselndem Vorzeichen springen die Partialsummen <b>abwechselnd über und unter</b> den Grenzwert. Werden die Sprünge (die bᵢ) <b>monoton kleiner und gehen gegen 0</b>, schnürt sich das Zickzack ein – die Reihe konvergiert. Beispiel: 1 − ½ + ⅓ − ¼ + … → ln 2.",
    function(K){
      var M = K.map(60, 330, 28, 290), s = K.line(60, 330, 610, 330, "s", { w: 1.3 }) + K.line(60, 330, 60, 25, "s", { w: 1.3 });
      s += K.t(600, 314, "p", "s", { it: true }) + K.t(84, 30, "Sₚ", "s", { it: true });
      s += hline(K, M, Math.LN2, 0, 18.3, "m", "ln 2", { dx: 8 });
      var sum = 0, pts = [];
      for(var p = 1; p <= 18; p++){ sum += (p % 2 ? 1 : -1) / p; pts.push([M.X(p), M.Y(sum)]); }
      s += K.path("M" + pts.map(function(q){ return q[0] + " " + q[1]; }).join(" L"), "a", { w: 1.6 });
      pts.forEach(function(q, i){ s += K.dot(q[0], q[1], i % 2 ? "c4" : "a", 4.5); });
      s += K.t(M.X(1) + 10, M.Y(1), "S₁ = 1", "s", { a: "start", s: 12 }) + K.t(M.X(2) + 10, M.Y(0.5) + 4, "S₂ = ½", "s", { a: "start", s: 12 });
      s += K.t(M.X(10), 60, "Sprünge: 1, ½, ⅓, ¼, … monoton → 0", "s", { s: 13 });
      return K.svg(640, 350, s);
    });

  add("notw", "Notwendiges Kriterium: aᵢ → 0",
    "<b>Links:</b> Gehen die Glieder <b>nicht</b> gegen 0, kommt bei jedem Schritt mindestens ein fester Betrag dazu – die Summe läuft weg, die Reihe divergiert sicher. <b>Rechts:</b> aᵢ → 0 reicht aber nicht als Beweis: 1/i und 1/i² gehen beide gegen 0, doch nur ∑ 1/i² konvergiert.",
    function(K){
      var s = K.panel(10, 10, 300, 300, "aᵢ → 1 ≠ 0: divergent", "m") + K.panel(330, 10, 300, 300, "aᵢ → 0: noch keine Aussage", "a");
      var M = K.map(40, 260, 25, 120), N = K.map(360, 260, 25, 190);
      s += K.axes(40, 260, 5, 260, 215, 5, "i", "aᵢ") + K.axes(360, 260, 5, 260, 215, 5, "i", "aᵢ");
      s += hline(K, M, 1, 0, 10.2, "m", "1", { dx: 4 });
      for(var i = 1; i <= 10; i++){
        s += K.bar(i, 1 + 0.6 / i, 0.62, M, "m", { fill: "fm" });
        s += K.bar(i - 0.17, 1 / i, 0.32, N, "m", { fill: "fm" }) + K.bar(i + 0.17, 1 / (i * i), 0.32, N, "a");
      }
      s += K.t(470, 70, "■ 1/i  → ∑ divergiert", "m", { a: "start", s: 12.5, b: true }) + K.t(470, 92, "■ 1/i² → ∑ konvergiert", "a", { a: "start", s: 12.5, b: true });
      return K.svg(640, 320, s);
    });

  add("harm", "Warum die harmonische Reihe ∑ 1/i divergiert",
    "Die Glieder 1/i gehen zwar gegen 0, aber zu langsam. Fasst man sie in <b>Gruppen</b> zusammen (1/3 + 1/4, dann 1/5 bis 1/8, dann 1/9 bis 1/16 …), ist <b>jede Gruppe mindestens ½</b> groß. Unendlich viele Halbe ergeben ∞. Quotienten- und Wurzelkriterium liefern hier q = 1 – keine Aussage.",
    function(K){
      var M = K.map(40, 250, 34, 200), s = K.axes(40, 250, 5, 575, 225, 5, "i", "1/i");
      var groups = [[1, 1], [2, 2], [3, 4], [5, 8], [9, 16]], cols = ["c3", "c4", "a", "m", "c4"], fills = ["fa", "fm", "fa", "fm", "fa"];
      groups.forEach(function(g, k){
        for(var i = g[0]; i <= g[1]; i++) s += K.bar(i, 1 / i, 0.86, M, cols[k], { fill: fills[k] });
        var x0 = M.X(g[0] - 0.45), x1 = M.X(g[1] + 0.45);
        s += K.path("M" + x0 + " 262 L" + x0 + " 268 L" + x1 + " 268 L" + x1 + " 262", cols[k], { w: 1.6 });
        s += K.t((x0 + x1) / 2, 284, k < 2 ? (k ? "½" : "1") : "≥ ½", cols[k], { s: 13, b: true });
      });
      s += K.t(600, 60, "1 + ½ + (⅓ + ¼) + (⅕ … ⅛) + …", "s", { a: "end", s: 13 }) + K.t(600, 84, "≥ 1 + ½ + ½ + ½ + … = ∞", "m", { a: "end", s: 14, b: true });
      return K.svg(620, 300, s);
    });

  add("absolut", "Absolute und bedingte Konvergenz",
    "∑ (−1)ⁱ⁺¹/i konvergiert (blau, gegen ln 2) – nimmt man aber die <b>Beträge</b>, entsteht die harmonische Reihe ∑ 1/i, die divergiert (rot). Diese Reihe ist also nur <b>bedingt</b> konvergent. <b>Absolut</b> konvergent hieße: auch die Beträge-Reihe konvergiert – dann konvergiert die Reihe erst recht.",
    function(K){
      var M = K.map(60, 290, 17.5, 60), s = K.axes(60, 290, 5, 555, 270, 5, "p", "Sₚ");
      s += hline(K, M, Math.LN2, 0, 30.5, "a", "ln 2", { dx: 4 });
      var a = 0, b = 0, pa = [], pb = [];
      for(var p = 1; p <= 30; p++){ a += (p % 2 ? 1 : -1) / p; b += 1 / p; pa.push([M.X(p), M.Y(a)]); pb.push([M.X(p), M.Y(b)]); }
      var poly = function(arr){ return "M" + arr.map(function(q){ return q[0] + " " + q[1]; }).join(" L"); };
      s += K.path(poly(pb), "m", { w: 2.4 }) + K.path(poly(pa), "a", { w: 2 });
      s += K.t(M.X(29), M.Y(b) - 16, "∑ |aᵢ| = ∑ 1/i → ∞", "m", { a: "end", s: 13, b: true }) + K.t(M.X(29), M.Y(Math.LN2) + 22, "∑ (−1)ⁱ⁺¹/i → ln 2", "a", { a: "end", s: 13, b: true });
      return K.svg(620, 320, s);
    });

  add("vergleich", "Majoranten- und Minorantenkriterium",
    "<b>Majorante (links):</b> Liegen alle |aᵢ| unter den Gliedern bᵢ einer <b>konvergenten</b> Reihe, ist ∑ aᵢ „gedeckelt“ und konvergiert auch. <b>Minorante (rechts):</b> Liegen alle aᵢ über den Gliedern cᵢ ≥ 0 einer <b>divergenten</b> Reihe, wird ∑ aᵢ erst recht unendlich.",
    function(K){
      var s = K.panel(10, 10, 300, 300, "Majorante: |aᵢ| ≤ bᵢ", "a") + K.panel(330, 10, 300, 300, "Minorante: aᵢ ≥ cᵢ ≥ 0", "m");
      var M = K.map(40, 260, 25, 200), N = K.map(360, 260, 25, 170);
      s += K.axes(40, 260, 5, 260, 215, 5, "i", "") + K.axes(360, 260, 5, 260, 215, 5, "i", "");
      for(var i = 1; i <= 10; i++){
        var b = Math.pow(0.75, i - 1), a = b * (0.45 + 0.45 * Math.abs(Math.sin(i * 1.7)));
        s += K.bar(i, b, 0.7, M, "a", { fill: "p" }) + K.bar(i, a, 0.42, M, "c4", { fill: "fm" });
        var c = 0.9 / i, aa = c + 0.18 + 0.12 * Math.abs(Math.cos(i));
        s += K.bar(i, aa, 0.7, N, "m", { fill: "p" }) + K.bar(i, c, 0.42, N, "c3", { fill: "fm" });
      }
      s += K.t(170, 60, "□ bᵢ: ∑ konvergiert", "a", { a: "start", s: 12, b: true }) + K.t(170, 80, "■ |aᵢ| darunter", "c4", { a: "start", s: 12, b: true });
      s += K.t(490, 60, "□ aᵢ darüber", "m", { a: "start", s: 12, b: true }) + K.t(490, 80, "■ cᵢ: ∑ divergiert", "c3", { a: "start", s: 12, b: true });
      return K.svg(640, 320, s);
    });

  add("alpha", "Vergleichsreihen ∑ 1/iᵅ",
    "Die Partialsummen von ∑ 1/iᵅ: Für <b>α ≤ 1</b> wachsen sie unbegrenzt (α = ½ schnell, α = 1 langsam wie ln p). Für <b>α &gt; 1</b> bleiben sie beschränkt – α = 2 strebt gegen π²/6 ≈ 1,645. Genau diese Reihen nimmt man gern als Majorante oder Minorante.",
    function(K){
      var M = K.map(60, 290, 13.5, 55), s = K.axes(60, 290, 5, 555, 270, 5, "p", "Sₚ");
      s += hline(K, M, PI * PI / 6, 0, 40.5, "a", "π²/6 ≈ 1,645", { dx: -4, dy: -12, a: "end" });
      [[0.5, "m"], [1, "c3"], [2, "a"]].forEach(function(cf){
        var sum = 0, d = "";
        for(var p = 1; p <= 40; p++){ sum += 1 / Math.pow(p, cf[0]); if(sum > 4.6) break; d += (d ? " L" : "M") + M.X(p) + " " + M.Y(sum); }
        s += K.path(d, cf[1], { w: 2.6 });
      });
      s += K.t(M.X(13), M.Y(4.4), "α = ½", "m", { s: 14, b: true }) + K.t(M.X(36), M.Y(3.55), "α = 1", "c3", { s: 14, b: true }) + K.t(M.X(30), M.Y(1.645) + 18, "α = 2", "a", { s: 14, b: true });
      return K.svg(620, 320, s);
    });

  /* ═════════ Kapitel 2: Potenz- und Taylorreihen ═════════ */

  add("radius", "Konvergenzradius und Konvergenzbereich",
    "Eine Potenzreihe konvergiert in einem <b>symmetrischen Intervall</b> um den Entwicklungspunkt x₀: innerhalb (|x − x₀| &lt; r) absolut, außerhalb divergiert sie. Über die beiden <b>Randpunkte</b> sagt r nichts – sie werden einzeln eingesetzt und geprüft.",
    function(K){
      var y = 170, xc = 320, r = 160, s = "";
      s += K.line(30, y, 610, y, "s", { w: 1.4 });
      s += K.line(30, y, xc - r - 8, y, "m", { w: 5, dash: "10 6" }) + K.line(xc + r + 8, y, 610, y, "m", { w: 5, dash: "10 6" });
      s += K.line(xc - r + 8, y, xc + r - 8, y, "a", { w: 7 });
      s += K.ring(xc - r, y, "c3", 8) + K.ring(xc + r, y, "c3", 8) + K.dot(xc, y, "i", 5);
      s += K.t(xc - r, y + 30, "x₀ − r", "i", { s: 14, b: true }) + K.t(xc, y + 30, "x₀", "i", { s: 14, b: true }) + K.t(xc + r, y + 30, "x₀ + r", "i", { s: 14, b: true });
      s += K.path("M" + xc + " " + (y - 18) + " L" + xc + " " + (y - 30) + " L" + (xc + r) + " " + (y - 30) + " L" + (xc + r) + " " + (y - 18), "a", { w: 1.6 }) + K.t(xc + r / 2, y - 44, "r", "a", { it: true, b: true, s: 18 });
      s += K.path("M" + xc + " " + (y - 18) + " L" + xc + " " + (y - 30) + " L" + (xc - r) + " " + (y - 30) + " L" + (xc - r) + " " + (y - 18), "a", { w: 1.6 }) + K.t(xc - r / 2, y - 44, "r", "a", { it: true, b: true, s: 18 });
      s += K.t(xc, y + 70, "absolut konvergent", "a", { s: 15, b: true }) + K.t(90, y + 70, "divergent", "m", { s: 14, b: true }) + K.t(550, y + 70, "divergent", "m", { s: 14, b: true });
      s += K.t(xc - r, y - 80, "Rand: ?", "c3", { s: 13, b: true }) + K.t(xc + r, y - 80, "Rand: ?", "c3", { s: 13, b: true });
      s += K.t(xc, 296, "Randpunkte einzeln einsetzen und prüfen", "c3", { s: 13 });
      return K.svg(640, 315, s);
    });

  add("geomrad", "Beispiel r = 1: 1/(1 − x) = 1 + x + x² + …",
    "Die Polynome 1 + x + … + xⁿ (dünn) schmiegen sich an 1/(1 − x) (rot) an – aber <b>nur im hellen Streifen |x| &lt; 1</b>. Außerhalb laufen sie mit wachsendem n immer weiter weg: Dort konvergiert die Reihe nicht. Der Konvergenzradius ist r = lim |aₖ/aₖ₊₁| = 1.",
    function(K){
      var M = K.map(320, 250, 135, 32), s = "";
      s += K.rect(M.X(-1), 20, 270, 290, "a", { fill: "fa", rx: 0, w: 0.1 });
      s += K.axes(320, 250, 290, 280, 225, 60, "x", "y");
      s += K.line(M.X(1), 20, M.X(1), 310, "f", { dash: "4 4", w: 1 }) + K.line(M.X(-1), 20, M.X(-1), 310, "f", { dash: "4 4", w: 1 });
      s += K.t(M.X(-1), 300, "−1", "s", { s: 12 }) + K.t(M.X(1) + 12, 300, "1", "s", { s: 12 });
      [[2, "c3"], [5, "c4"], [12, "a"]].forEach(function(cf){
        s += K.plot(function(x){ var t = 0; for(var k = 0; k <= cf[0]; k++) t += Math.pow(x, k); return t; }, -2.1, 2.1, M, cf[1], { ymin: -2, ymax: 7, w: 1.8 });
      });
      s += K.plot(function(x){ return 1 / (1 - x); }, -2.1, 0.86, M, "m", { ymax: 7, w: 3 }) + K.plot(function(x){ return 1 / (1 - x); }, 1.2, 2.1, M, "m", { ymin: -2, w: 3 });
      s += K.t(M.X(-1.95), M.Y(1 / 2.95) - 14, "1/(1−x)", "m", { a: "start", s: 13, b: true });
      s += K.t(600, 40, "n = 2, 5, 12", "s", { a: "end", s: 12 }) + K.t(320, 20, "|x| < 1: Näherung passt", "a", { s: 13, b: true });
      return K.svg(640, 320, s);
    });

  add("taylor", "Taylorpolynome nähern f um x₀ an",
    "Taylorpolynome von sin x um x₀ = 0: Grad 1 ist die Tangente, jeder weitere Term schmiegt sich auf einem <b>größeren Bereich</b> an die Kurve. Die Koeffizienten f⁽ᵏ⁾(x₀)/k! sorgen dafür, dass Funktionswert, Steigung, Krümmung … im Punkt x₀ übereinstimmen.",
    function(K){
      var M = K.map(320, 170, 46, 70), s = K.axes(320, 170, 300, 300, 150, 150, "x", "y");
      var T = function(n){ return function(x){ var t = 0; for(var k = 0; 2 * k + 1 <= n; k++) t += (k % 2 ? -1 : 1) * Math.pow(x, 2 * k + 1) / fact(2 * k + 1); return t; }; };
      [[1, "c3"], [3, "c4"], [5, "m"], [9, "a"]].forEach(function(cf){ s += K.plot(T(cf[0]), -6.4, 6.4, M, cf[1], { ymin: -2.1, ymax: 2.1, w: 1.8 }); });
      s += K.plot(Math.sin, -6.4, 6.4, M, "i", { w: 3.2 });
      s += K.t(M.X(1.75), M.Y(2.05), "T₁", "c3", { s: 13, b: true }) + K.t(M.X(2.45), M.Y(-1.9), "T₃", "c4", { s: 13, b: true }) + K.t(M.X(3.5), M.Y(1.9), "T₅", "m", { s: 13, b: true }) + K.t(M.X(5.5), M.Y(1.9), "T₉", "a", { s: 13, b: true });
      s += K.t(M.X(-4.7), M.Y(1.25), "sin x", "i", { s: 14, b: true });
      return K.svg(640, 340, s);
    });

  add("exp", "Reihe der e-Funktion: eˣ = 1 + x + x²/2! + …",
    "Taylorpolynome von eˣ um 0: T₀ = 1 (waagerecht), T₁ = 1 + x (Tangente), T₂, T₃ … – jedes weitere Glied verbessert die Näherung. Weil r = ∞ ist, gelingt das für <b>jedes</b> x, wenn man nur genug Glieder nimmt.",
    function(K){
      var M = K.map(380, 290, 90, 38), s = K.axes(380, 290, 340, 230, 270, 20, "x", "y");
      var T = function(n){ return function(x){ var t = 0; for(var k = 0; k <= n; k++) t += Math.pow(x, k) / fact(k); return t; }; };
      [[0, "f"], [1, "c3"], [2, "c4"], [3, "m"]].forEach(function(cf){ s += K.plot(T(cf[0]), -3.7, 2.3, M, cf[1], { ymin: -0.6, ymax: 7, w: 1.8 }); });
      s += K.plot(Math.exp, -3.7, 1.95, M, "a", { w: 3.2 });
      s += K.t(M.X(1.85), M.Y(6.9), "eˣ", "a", { s: 15, b: true }) + K.t(M.X(-3.5), M.Y(1) - 12, "T₀", "f", { s: 13, b: true });
      s += K.t(M.X(2.3), M.Y(3.3), "T₁", "c3", { s: 13, b: true }) + K.t(M.X(-3.4), M.Y(3.9), "T₂", "c4", { s: 13, b: true }) + K.t(M.X(-1.25), M.Y(-0.75), "T₃", "m", { s: 13, b: true });
      return K.svg(640, 325, s);
    });

  add("lnr", "ln(1 + x): Konvergenzradius 1",
    "Die Taylorpolynome von ln(1 + x) (Grad 2, 5, 10) passen sich im Bereich <b>−1 &lt; x ≤ 1</b> immer besser an. Rechts von x = 1 schlagen sie mit wachsendem Grad <b>immer wilder aus</b> – dort konvergiert die Reihe nicht, obwohl die Funktion ganz harmlos weiterläuft. Am Rand x = 1 konvergiert sie gerade noch (→ ln 2).",
    function(K){
      var M = K.map(210, 170, 155, 55), s = "";
      s += K.rect(M.X(-1), 20, 310, 300, "a", { fill: "fa", rx: 0, w: 0.1 });
      s += K.axes(210, 170, 180, 400, 150, 150, "x", "y");
      s += K.line(M.X(1), 20, M.X(1), 320, "f", { dash: "4 4", w: 1 }) + K.t(M.X(1) + 10, 185, "1", "s", { s: 12 }) + K.t(M.X(-1) + 12, 185, "−1", "s", { s: 12 });
      var T = function(n){ return function(x){ var t = 0; for(var k = 1; k <= n; k++) t += (k % 2 ? 1 : -1) * Math.pow(x, k) / k; return t; }; };
      [[2, "c3"], [5, "c4"], [10, "m"]].forEach(function(cf){ s += K.plot(T(cf[0]), -0.97, 2.4, M, cf[1], { ymin: -2.7, ymax: 2.7, w: 1.8 }); });
      s += K.plot(function(x){ return Math.log(1 + x); }, -0.93, 2.4, M, "a", { ymin: -2.7, w: 3.2 });
      s += K.t(M.X(2.35), M.Y(Math.log(3.35)) - 16, "ln(1+x)", "a", { a: "end", s: 14, b: true });
      s += K.t(M.X(0) + 70, 34, "|x| < 1 (plus Rand x = 1)", "a", { s: 13, b: true }) + K.t(560, 300, "Grad 2, 5, 10", "s", { a: "end", s: 12 });
      return K.svg(640, 340, s);
    });

  add("gliedweise", "Gliedweise differenzieren und integrieren",
    "Innerhalb des Konvergenzbereichs darf man eine Potenzreihe <b>Glied für Glied</b> ableiten (oder integrieren), als wäre sie ein Polynom. Hier wird aus der geometrischen Reihe die Reihe für 1/(1 − x)². Der Konvergenzradius bleibt gleich (r = 1).",
    function(K){
      var xs = [230, 300, 370, 450, 540], top = ["1", "x", "x²", "x³", "…"], bot = ["0", "1", "2x", "3x²", "…"], s = "";
      s += K.t(150, 80, "1/(1 − x)  =", "i", { a: "end", s: 17, b: true }) + K.t(150, 220, "1/(1 − x)²  =", "m", { a: "end", s: 17, b: true });
      xs.forEach(function(x, i){
        s += K.v(x, 80, top[i], "a", { s: 19 }) + K.v(x, 220, bot[i], "m", { s: 19 });
        if(i < 4) s += K.t(x + 35, 80, "+", "i", { s: 18 }) + K.t(x + 35, 220, "+", "i", { s: 18 });
        s += K.arrow(x, 102, x, 194, "c4", { w: 1.8, head: 10 });
      });
      s += K.t(110, 150, "d/dx", "c4", { s: 16, b: true }) + K.t(600, 150, "je Glied", "c4", { a: "end", s: 13 });
      s += K.f(320, 285, "Radius bleibt r = 1", "a");
      return K.svg(620, 310, s);
    });

  add("rest", "Restglied: Abstand zwischen f und Taylorpolynom",
    "Das <b>Restglied Rₙ(x)</b> ist der senkrechte Abstand zwischen der Funktion und ihrem Taylorpolynom an der Stelle x (rot). Nahe x₀ ist er winzig, weiter weg wächst er. Die Taylorreihe stellt f genau dann dar, wenn Rₙ(x) → 0 für n → ∞.",
    function(K){
      var M = K.map(200, 285, 170, 44), s = K.axes(200, 285, 170, 400, 270, 20, "x", "y");
      var T2 = function(x){ return 1 + x + x * x / 2; };
      s += K.plot(T2, -1.1, 2.1, M, "c4", { ymax: 6.2, w: 2.2 }) + K.plot(Math.exp, -1.1, 1.82, M, "a", { w: 3 });
      var x = 1.6, y1 = Math.exp(x), y2 = T2(x);
      s += K.line(M.X(x), M.Y(0), M.X(x), M.Y(y2), "f", { dash: "4 4", w: 1 });
      s += K.line(M.X(x), M.Y(y1), M.X(x), M.Y(y2), "m", { w: 5 }) + K.t(M.X(x) + 12, M.Y((y1 + y2) / 2), "R₂(x)", "m", { a: "start", s: 15, b: true });
      s += K.dot(M.X(x), M.Y(y1), "a", 5) + K.dot(M.X(x), M.Y(y2), "c4", 5) + K.t(M.X(x), M.Y(0) + 16, "x", "i", { it: true, b: true });
      s += K.dot(M.X(0), M.Y(1), "i", 5) + K.t(M.X(0) - 10, M.Y(0) + 16, "x₀ = 0", "i", { a: "start", s: 13, b: true });
      s += K.t(M.X(1.72) - 10, M.Y(5.7), "f = eˣ", "a", { s: 14, b: true }) + K.t(M.X(2.05), M.Y(T2(2.05)) + 22, "T₂", "c4", { s: 14, b: true });
      return K.svg(620, 310, s);
    });

  /* ═════════ Kapitel 3: Fourierreihen ═════════ */

  function square(x){ var u = ((x % (2 * PI)) + 2 * PI) % (2 * PI); return u < PI ? 1 : -1; }
  function sqF(n){ return function(x){ var t = 0; for(var k = 0; k < n; k++){ var m = 2 * k + 1; t += Math.sin(m * x) / m; } return 4 / PI * t; }; }

  add("fourier", "Fourierreihe: Rechteck aus Sinusschwingungen",
    "Eine Rechteckschwingung (grau) wird aus Sinusschwingungen zusammengesetzt. Mit <b>einem</b> Term (orange) ist es nur eine Welle, mit 3 Termen (violett) zeichnen sich die Ecken ab, mit 15 Termen (rot) liegt die Summe fast auf dem Rechteck. An den Sprüngen bleibt ein kleines Überschwingen.",
    function(K){
      var M = K.map(40, 170, 560 / (4 * PI), 100), s = K.axes(40, 170, 5, 570, 150, 150, "x", "f");
      s += K.plot(square, 0, 4 * PI, M, "f", { jump: 1, w: 4 });
      [1, 2, 3].forEach(function(k){ s += K.line(M.X(k * PI), M.Y(-1), M.X(k * PI), M.Y(1), "f", { dash: "3 4", w: 1 }); });
      [[1, "c3"], [3, "c4"], [15, "m"]].forEach(function(cf){ s += K.plot(sqF(cf[0]), 0, 4 * PI, M, cf[1], { n: 900, w: cf[0] === 15 ? 2.2 : 1.8 }); });
      s += K.t(M.X(PI) + 4, M.Y(-0.2), "π", "s", { a: "start", s: 13 }) + K.t(M.X(2 * PI) + 4, M.Y(-0.2), "2π", "s", { a: "start", s: 13 });
      s += K.t(600, 30, "1 Term · 3 Terme · 15 Terme", "s", { a: "end", s: 12.5 });
      return K.svg(640, 330, s);
    });

  add("bausteine", "Fourierreihe = Mittelwert + Schwingungen",
    "Die Reihe baut f aus <b>Bausteinen</b> zusammen: dem konstanten Anteil a₀/2 und Schwingungen cos(nx), sin(nx) mit Gewichten aₙ, bₙ. Hier: ½ + sin x + ⅓·sin 3x – unten die Summe. Die Integralformeln für aₙ, bₙ messen, <b>wie viel</b> von jeder Schwingung in f steckt.",
    function(K){
      var rows = [[50, function(){ return 0.5; }, "a₀/2", "c3"], [120, Math.sin, "b₁·sin x", "c4"], [190, function(x){ return Math.sin(3 * x) / 3; }, "b₃·sin 3x", "a"],
                  [275, function(x){ return 0.5 + Math.sin(x) + Math.sin(3 * x) / 3; }, "Summe", "m"]], s = "";
      rows.forEach(function(r, i){
        var M = K.map(150, r[0], 450 / (2 * PI), i === 3 ? 26 : 28);
        s += K.line(150, r[0], 600, r[0], "r", { w: 1 }) + K.plot(r[1], 0, 2 * PI, M, r[3], { w: 2.6 });
        s += K.t(130, r[0], r[2], r[3], { a: "end", s: 14, b: true });
        if(i > 0 && i < 3) s += K.t(30, r[0] - 35, "+", "i", { s: 18, b: true });
      });
      s += K.line(30, 232, 610, 232, "s", { w: 1.2 }) + K.t(30, 248, "=", "i", { s: 18, b: true });
      return K.svg(620, 320, s);
    });

  add("mittel", "a₀/2 ist der Mittelwert über eine Periode",
    "Die gestrichelte Linie liegt auf Höhe a₀/2. Die Flächen, um die f darüber hinausragt (blau), sind <b>genau so groß</b> wie die Flächen darunter (rot) – a₀/2 ist also der Durchschnittswert von f. Deshalb steht in der Reihe a₀ <b>halbiert</b>.",
    function(K){
      var mean = 1, f = function(x){ return 1 + 0.8 * Math.sin(x) + 0.5 * Math.sin(2 * x + 0.6); };
      var M = K.map(60, 280, 520 / (2 * PI), 95), s = K.axes(60, 280, 5, 540, 265, 5, "x", "f");
      var B = K.map(60, M.Y(mean), 520 / (2 * PI), 95);
      s += K.area(function(x){ return Math.max(0, f(x) - mean); }, 0, 2 * PI, B, "fa") + K.area(function(x){ return Math.min(0, f(x) - mean); }, 0, 2 * PI, B, "fm");
      s += hline(K, M, mean, 0, 2 * PI, "c3", "a₀/2", { dx: 6 });
      s += K.plot(f, 0, 2 * PI, M, "a", { w: 3 });
      s += K.line(M.X(2 * PI), M.Y(0) - 5, M.X(2 * PI), M.Y(0) + 5, "s", { w: 1.4 }) + K.t(M.X(2 * PI), M.Y(0) + 18, "2π", "s", { s: 13 });
      s += K.t(M.X(1.4), M.Y(1.3), "+", "a", { s: 20, b: true }) + K.t(M.X(4.6), M.Y(0.55), "−", "m", { s: 22, b: true });
      return K.svg(640, 310, s);
    });

  add("symm", "Symmetrie: gerade → nur cos, ungerade → nur sin",
    "<b>Gerade</b> Funktion (links, spiegelsymmetrisch zur y-Achse) wie cos: alle bₙ = 0 – reine Cosinusreihe. <b>Ungerade</b> Funktion (rechts, punktsymmetrisch zum Ursprung) wie sin: alle aₙ = 0 – reine Sinusreihe. Vor dem Integrieren also auf Symmetrie prüfen.",
    function(K){
      var s = K.panel(10, 10, 300, 290, "gerade: f(−x) = f(x)", "a") + K.panel(330, 10, 300, 290, "ungerade: f(−x) = −f(x)", "m");
      var tri = function(x){ var u = (((x + PI) % (2 * PI)) + 2 * PI) % (2 * PI); return Math.abs(u - PI); };
      var saw = function(x){ var u = (((x + PI) % (2 * PI)) + 2 * PI) % (2 * PI); return u - PI; };
      var M = K.map(160, 200, 22, 32), N = K.map(480, 160, 22, 32);
      s += K.axes(160, 200, 135, 135, 140, 70, "x", "") + K.axes(480, 160, 135, 135, 120, 120, "x", "");
      s += K.line(160, 50, 160, 240, "a", { w: 2, dash: "6 4" }) + K.plot(tri, -5.9, 5.9, M, "a", { w: 3 });
      s += K.plot(saw, -5.9, 5.9, N, "m", { w: 3, jump: 3 }) + K.dot(480, 160, "m", 6) + K.circ(480, 160, 14, "m", { dash: "3 3" });
      s += K.f(160, 284, "bₙ = 0 → nur cos", "a", { s: 13 }) + K.f(480, 284, "aₙ = 0 → nur sin", "m", { fill: "fm", s: 13 });
      return K.svg(640, 310, s);
    });

  add("sprung", "An einer Sprungstelle: der Mittelwert",
    "Hat f einen Sprung von f⁻ (Grenzwert von links) auf f⁺ (von rechts), läuft die Fourierreihe <b>genau durch die Mitte</b>: F(x) = (f⁻ + f⁺)/2. Überall sonst, wo f stetig ist, liefert sie f selbst.",
    function(K){
      var M = K.map(320, 170, 85, 100), s = K.axes(320, 170, 300, 290, 150, 150, "", "");
      s += K.line(M.X(-3.3), M.Y(1), M.X(0), M.Y(1), "f", { w: 4 }) + K.line(M.X(0), M.Y(-1), M.X(3.3), M.Y(-1), "f", { w: 4 });
      s += K.plot(function(u){ return sqF(25)(u + PI); }, -3.3, 3.3, M, "c4", { n: 900, w: 2 });
      s += K.ring(M.X(0), M.Y(1), "c3", 6) + K.ring(M.X(0), M.Y(-1), "c3", 6) + K.dot(M.X(0), M.Y(0), "m", 7);
      s += K.t(M.X(0) - 14, M.Y(1) - 4, "f⁻", "c3", { a: "end", s: 16, b: true }) + K.t(M.X(0) + 14, M.Y(-1) + 4, "f⁺", "c3", { a: "start", s: 16, b: true });
      s += K.t(M.X(0) + 16, M.Y(0) - 12, "(f⁻ + f⁺)/2", "m", { a: "start", s: 15, b: true });
      s += K.t(M.X(-2.2), M.Y(1) + 22, "f", "s", { it: true, s: 15 }) + K.t(M.X(2.4), M.Y(-1) - 30, "Fourierreihe", "c4", { s: 13, b: true });
      return K.svg(640, 340, s);
    });

  add("periode", "Periode T statt 2π: ω = 2π/T",
    "Wiederholt sich f nach der Zeit <b>T</b> statt nach 2π, staucht (oder streckt) man die Schwingungen passend: aus sin(nx) wird sin(nωx) mit der <b>Kreisfrequenz ω = 2π/T</b>. Hier T = 4: Die blaue Welle ist nach 4 Einheiten durch, die graue erst nach 2π ≈ 6,28.",
    function(K){
      var M = K.map(50, 170, 42, 90), s = K.axes(50, 170, 5, 555, 140, 130, "x", "");
      s += K.plot(Math.sin, 0, 12.8, M, "f", { w: 1.8, dash: "6 4" }) + K.plot(function(x){ return Math.sin(2 * PI / 4 * x); }, 0, 12.8, M, "a", { w: 3 });
      s += K.path("M" + M.X(0) + " 262 L" + M.X(0) + " 270 L" + M.X(4) + " 270 L" + M.X(4) + " 262", "a", { w: 1.8 }) + K.t(M.X(2), 286, "T = 4", "a", { s: 14, b: true });
      s += K.path("M" + M.X(0) + " 52 L" + M.X(0) + " 44 L" + M.X(2 * PI) + " 44 L" + M.X(2 * PI) + " 52", "f", { w: 1.6 }) + K.t(M.X(PI), 32, "2π", "f", { s: 13, b: true });
      s += K.f(470, 295, "ω = 2π/T, Vorfaktor 2/T", "a", { s: 13 });
      return K.svg(620, 315, s);
    });

  /* ═════════ Kapitel 4: Transformationen ═════════ */

  add("spektrum", "Von der Fourierreihe zur Fouriertransformation",
    "Eine <b>periodische</b> Funktion enthält nur einzelne Frequenzen nω (links: einzelne Linien). Lässt man die Periode immer größer werden, rücken die Linien zusammen; eine <b>nichtperiodische</b> Funktion hat ein <b>kontinuierliches Spektrum</b> (rechts) – aus der Summe wird ein Integral.",
    function(K){
      var s = K.panel(10, 10, 300, 290, "periodisch: einzelne Frequenzen") + K.panel(330, 10, 300, 290, "nichtperiodisch: Spektrum");
      var env = function(w){ return w === 0 ? 1 : Math.abs(Math.sin(w) / w); };
      var M = K.map(40, 250, 26, 180), N = K.map(360, 250, 26, 180);
      s += K.axes(40, 250, 5, 260, 215, 5, "ω", "") + K.axes(360, 250, 5, 260, 215, 5, "ω", "");
      s += K.plot(env, 0, 9.8, M, "f", { w: 1.2, dash: "4 4" });
      for(var k = 0; k <= 9; k++){ var w = k * 1.05; s += K.line(M.X(w), M.Y(0), M.X(w), M.Y(env(w)), "a", { w: 4 }) + K.dot(M.X(w), M.Y(env(w)), "a", 3.5); }
      s += K.area(env, 0, 9.8, N, "fa") + K.plot(env, 0, 9.8, N, "a", { w: 3 });
      s += K.t(M.X(1.05), 272, "ω", "s", { s: 12 }) + K.t(M.X(2.1), 272, "2ω", "s", { s: 12 }) + K.t(M.X(3.15), 272, "3ω", "s", { s: 12 });
      return K.svg(640, 310, s);
    });

  add("laplace", "Laplacetransformation: F(s) = Fläche unter f(t)·e^(−st)",
    "Man multipliziert f(t) (violett) mit dem abklingenden Faktor e^(−st) (gestrichelt) und misst die <b>Fläche unter dem Produkt</b> (blau). Diese Zahl ist F(s). Für ein anderes s klingt der Faktor anders ab, die Fläche ändert sich – so entsteht die Bildfunktion F, eine Funktion von s.",
    function(K){
      var f = function(t){ return 1 + 0.5 * Math.sin(2 * t); }, sv = 0.55, M = K.map(50, 250, 58, 120), s = K.axes(50, 250, 5, 560, 225, 5, "t", "");
      var g = function(t){ return f(t) * Math.exp(-sv * t); };
      s += K.area(g, 0, 9.4, M, "fa") + K.plot(f, 0, 9.4, M, "c4", { w: 2.2 }) + K.plot(function(t){ return Math.exp(-sv * t); }, 0, 9.4, M, "f", { w: 1.8, dash: "6 4" });
      s += K.plot(g, 0, 9.4, M, "a", { w: 3 });
      s += K.t(M.X(8.4), M.Y(f(8.4)) - 18, "f(t)", "c4", { s: 14, b: true }) + K.t(M.X(1.6), M.Y(Math.exp(-sv * 1.6)) - 14, "e^(−st)", "f", { a: "start", s: 13, b: true });
      s += K.t(M.X(1.1), M.Y(0.32), "F(s)", "a", { s: 17, b: true }) + K.t(M.X(3.8), M.Y(g(3.8)) - 16, "f(t)·e^(−st)", "a", { a: "start", s: 13, b: true });
      s += K.f(420, 40, "F(s) = ∫₀^∞ f(t)·e^(−st) dt", "a");
      return K.svg(620, 280, s);
    });

  add("umweg", "Anfangswertproblem: der Umweg über den Bildbereich",
    "Statt die Differenzialgleichung direkt zu lösen (schwer, gestrichelt), geht man einen Umweg: <b>(i)</b> transformieren – aus der DGL wird eine <b>algebraische</b> Gleichung, die Anfangswerte stecken schon drin; <b>(ii)</b> nach Y(s) auflösen; <b>(iii)</b> Partialbrüche bilden und mit der Tabelle zurücktransformieren.",
    function(K){
      var s = K.t(150, 26, "Zeitbereich  t", "s", { s: 13, b: true }) + K.t(480, 26, "Bildbereich  s", "s", { s: 13, b: true });
      s += K.line(315, 15, 315, 300, "r", { w: 1.2, dash: "4 4" });
      var box = function(x, y, t1, t2, c){ return K.rect(x - 115, y - 30, 230, 60, c, { fill: c === "m" ? "fm" : "fa", rx: 6, w: 1.6 }) + K.t(x, y - 9, t1, c, { s: 14, b: true }) + K.t(x, y + 12, t2, "s", { s: 12 }); };
      s += box(150, 80, "DGL + Anfangswerte", "y″ + 5y′ + 4y = 0", "a") + box(480, 80, "algebraische Gleichung", "(s² + 5s + 4)·Y = 2s + 11", "a");
      s += box(480, 240, "Y(s) aufgelöst", "Y = 3/(s+1) − 1/(s+4)", "a") + box(150, 240, "Lösung y(t)", "y = 3e^(−t) − e^(−4t)", "m");
      s += K.arrow(268, 80, 362, 80, "c4", { w: 2.6 }) + K.t(315, 64, "(i) ℒ", "c4", { s: 13, b: true });
      s += K.arrow(480, 112, 480, 208, "c4", { w: 2.6 }) + K.t(492, 160, "(ii) auflösen", "c4", { a: "start", s: 13, b: true });
      s += K.arrow(362, 240, 268, 240, "c4", { w: 2.6 }) + K.t(315, 224, "(iii) ℒ⁻¹", "c4", { s: 13, b: true }) + K.t(315, 286, "Partialbruch + Tabelle", "s", { s: 11.5 });
      s += K.arrow(150, 112, 150, 208, "f", { w: 1.6, dash: "6 5" }) + K.t(140, 160, "direkt: schwer", "f", { a: "end", s: 12 });
      return K.svg(620, 310, s);
    });

  add("korr", "Korrespondenzen: Zeitfunktion ↔ Bildfunktion",
    "Die wichtigsten Paare aus der Tabelle als Bild: links oben jeweils die Zeitfunktion f(t), darunter ihre Laplace-Transformierte F(s). Abklingen (e^(−at)) taucht im Bildbereich als <b>Verschiebung s → s + a</b> auf.",
    function(K){
      var items = [["1", "1/s", function(){ return 1; }], ["t", "1/s²", function(t){ return t / 3; }], ["e^(at)", "1/(s − a)", function(t){ return Math.exp(0.35 * t) / 3; }],
                   ["sin ωt", "ω/(s² + ω²)", function(t){ return Math.sin(2 * t); }], ["cos ωt", "s/(s² + ω²)", function(t){ return Math.cos(2 * t); }],
                   ["e^(−at)·sin ωt", "ω/((s+a)² + ω²)", function(t){ return Math.exp(-0.45 * t) * Math.sin(2 * t); }]], s = "";
      items.forEach(function(it, i){
        var col = i % 3, row = Math.floor(i / 3), x0 = 10 + col * 210, y0 = 10 + row * 160;
        s += K.rect(x0, y0, 200, 150, "r", { fill: "p", rx: 6 });
        var M = K.map(x0 + 18, y0 + 72, 28, 38);
        s += K.line(x0 + 18, y0 + 72, x0 + 190, y0 + 72, "s", { w: 1 }) + K.line(x0 + 18, y0 + 22, x0 + 18, y0 + 112, "s", { w: 1 });
        s += K.plot(it[2], 0, 6, M, "a", { w: 2.4, ymax: 1.25, ymin: -1.25 });
        s += K.t(x0 + 190, y0 + 22, "f(t) = " + it[0], "a", { a: "end", s: 12.5, b: true });
        s += K.f(x0 + 100, y0 + 130, "F(s) = " + it[1], "m", { fill: "fm", s: 11.5 });
      });
      return K.svg(640, 330, s);
    });

  var bump = function(t){ return t > 0 ? t * Math.exp(-t) : 0; };

  add("aehnl", "Ähnlichkeitssatz: ℒ{f(at)} = (1/a)·F(s/a)",
    "f(at) mit a = 2 läuft <b>doppelt so schnell</b> ab – das Bild wird zeitlich zusammengestaucht. Im Bildbereich wird F dafür in die Breite gezogen (s/a) und mit 1/a gewichtet.",
    function(K){
      var M = K.map(50, 250, 62, 520), s = K.axes(50, 250, 5, 560, 225, 5, "t", "");
      s += K.plot(bump, 0, 8.8, M, "a", { w: 3 }) + K.plot(function(t){ return bump(2 * t); }, 0, 8.8, M, "m", { w: 3 });
      s += K.t(M.X(2.6), M.Y(bump(2.6)) - 16, "f(t)", "a", { a: "start", s: 15, b: true }) + K.t(M.X(0.55) + 10, M.Y(bump(1.1)) - 22, "f(2t)", "m", { a: "start", s: 15, b: true });
      s += K.arrow(M.X(1) - 4, M.Y(bump(1)) - 4, M.X(0.5) + 6, M.Y(bump(1)) - 4, "f", { w: 1.6, head: 8 });
      s += K.f(420, 40, "ℒ{f(at)} = (1/a)·F(s/a)", "m", { fill: "fm" });
      return K.svg(620, 280, s);
    });

  add("versch", "Verschiebungssatz: ℒ{f(t − a)} = e^(−as)·F(s)",
    "f(t − a) ist dieselbe Kurve, nur um a <b>nach rechts verschoben</b> (davor ist sie 0, sie „startet später“). Im Bildbereich bewirkt diese Zeitverschiebung nur einen <b>Faktor e^(−as)</b>.",
    function(K){
      var M = K.map(50, 250, 58, 520), s = K.axes(50, 250, 5, 560, 225, 5, "t", ""), a = 2;
      s += K.plot(bump, 0, 9.2, M, "a", { w: 2.4, dash: "7 5" }) + K.plot(function(t){ return bump(t - a); }, 0, 9.2, M, "m", { w: 3 });
      s += K.arrow(M.X(1), M.Y(bump(1)) - 10, M.X(1 + a), M.Y(bump(1)) - 10, "s", { w: 1.8 }) + K.t(M.X(1 + a / 2), M.Y(bump(1)) - 26, "um a verschoben", "s", { s: 13, b: true });
      s += K.path("M" + M.X(0) + " 262 L" + M.X(0) + " 270 L" + M.X(a) + " 270 L" + M.X(a) + " 262", "m", { w: 1.6 }) + K.t(M.X(a / 2), 284, "a = 2", "m", { s: 12.5, b: true });
      s += K.t(M.X(0.9), M.Y(0.1), "f(t)", "a", { s: 14, b: true }) + K.t(M.X(4.2), M.Y(bump(2.2)), "f(t − a)", "m", { a: "start", s: 14, b: true });
      s += K.f(420, 40, "ℒ{f(t − a)} = e^(−as)·F(s)", "m", { fill: "fm" });
      return K.svg(620, 300, s);
    });

  add("daempf", "Dämpfungssatz: ℒ{e^(−at)·f(t)} = F(s + a)",
    "Multipliziert man f(t) mit e^(−at), <b>klingt die Schwingung ab</b> (rot, eingehüllt von ±e^(−at)). Im Bildbereich ist das bloß eine <b>Verschiebung</b>: s wird durch s + a ersetzt. Merke: Verschiebung im einen Bereich ↔ Faktor im anderen.",
    function(K){
      var M = K.map(50, 160, 58, 110), s = K.axes(50, 160, 5, 560, 140, 140, "t", ""), a = 0.4;
      s += K.plot(function(t){ return Math.sin(2 * t); }, 0, 9.3, M, "f", { w: 1.6 });
      s += K.plot(function(t){ return Math.exp(-a * t); }, 0, 9.3, M, "c3", { w: 1.6, dash: "6 4" }) + K.plot(function(t){ return -Math.exp(-a * t); }, 0, 9.3, M, "c3", { w: 1.6, dash: "6 4" });
      s += K.plot(function(t){ return Math.exp(-a * t) * Math.sin(2 * t); }, 0, 9.3, M, "m", { w: 3 });
      s += K.t(M.X(6.5), M.Y(1) - 12, "f(t) = sin 2t", "f", { s: 13, b: true }) + K.t(M.X(4.3), M.Y(Math.exp(-a * 4.3)) - 14, "±e^(−at)", "c3", { a: "start", s: 13, b: true });
      s += K.f(410, 290, "ℒ{e^(−at)f(t)} = F(s + a)", "m", { fill: "fm" });
      return K.svg(620, 315, s);
    });

  add("ableit", "Ableitungssatz: die Anfangswerte stecken drin",
    "Beim Transformieren einer Ableitung tauchen <b>Startwert f(0)</b> (Punkt) und bei f″ zusätzlich die <b>Startsteigung f′(0)</b> (Tangente) auf: ℒ{f′} = s·F(s) − f(0). Darum braucht man beim Lösen eines Anfangswertproblems keine Konstanten mehr nachträglich zu bestimmen.",
    function(K){
      var y = function(t){ return 3 * Math.exp(-t) - Math.exp(-4 * t); }, M = K.map(70, 270, 90, 80), s = K.axes(70, 270, 5, 530, 250, 5, "t", "f");
      s += K.plot(y, 0, 5.6, M, "a", { w: 3 });
      s += K.line(M.X(-0.25), M.Y(2 - 0.25), M.X(0.9), M.Y(2 + 0.9), "m", { w: 2.2, dash: "7 4" });
      s += K.dot(M.X(0), M.Y(2), "m", 7) + K.t(M.X(0) - 12, M.Y(2), "f(0) = 2", "m", { a: "end", s: 14, b: true });
      s += K.t(M.X(0.9) + 8, M.Y(2.9), "Steigung f′(0) = 1", "m", { a: "start", s: 14, b: true });
      s += K.f(410, 150, "ℒ{f′} = s·F(s) − f(0)", "a") + K.f(410, 195, "ℒ{f″} = s²F − s·f(0) − f′(0)", "a");
      return K.svg(620, 300, s);
    });

  add("awp", "Lösung des Beispiels: y = 3e^(−t) − e^(−4t)",
    "Die Lösung ist eine Überlagerung zweier abklingender Anteile: <b>3e^(−t)</b> (langsam) und <b>−e^(−4t)</b> (schnell). Zusammen starten sie bei y(0) = 3 − 1 = 2 mit der Steigung y′(0) = −3 + 4 = 1 – genau die Anfangswerte.",
    function(K){
      var M = K.map(60, 200, 95, 55), s = K.axes(60, 200, 5, 540, 185, 100, "t", "y");
      s += K.plot(function(t){ return 3 * Math.exp(-t); }, 0, 5.5, M, "c4", { w: 2, dash: "7 4" }) + K.plot(function(t){ return -Math.exp(-4 * t); }, 0, 5.5, M, "c3", { w: 2, dash: "7 4" });
      s += K.plot(function(t){ return 3 * Math.exp(-t) - Math.exp(-4 * t); }, 0, 5.5, M, "m", { w: 3.2 });
      s += K.dot(M.X(0), M.Y(2), "m", 6) + K.t(M.X(0) - 10, M.Y(2), "y(0) = 2", "m", { a: "end", s: 13, b: true });
      s += K.t(M.X(0.25) + 6, M.Y(3) - 6, "3e^(−t)", "c4", { a: "start", s: 13, b: true }) + K.t(M.X(0.5) + 4, M.Y(-1) + 4, "−e^(−4t)", "c3", { a: "start", s: 13, b: true });
      s += K.t(M.X(2.1), M.Y(1.25), "y(t)", "m", { s: 15, b: true });
      return K.svg(620, 310, s);
    });
})();
