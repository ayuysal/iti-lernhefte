/* Zeichenhilfen für die Skizzen in den Lernheften (window.SK).
   Alle Farben laufen über CSS-Variablen des Heft-Gerüsts → Hell/Dunkel automatisch.
   Koordinaten sind SVG-Pixel (y nach unten). Winkel in Grad, mathematisch (gegen den Uhrzeiger, y nach oben). */
(function(){
  "use strict";
  var C = {
    a: "var(--accent)", m: "var(--mark)", i: "var(--ink)", s: "var(--ink-soft)", f: "var(--ink-faint)",
    r: "var(--rule)", c3: "var(--sk-3)", c4: "var(--sk-4)", p: "var(--paper)",
    fa: "var(--sk-fill)", fm: "var(--sk-fill2)"
  };
  function col(c){ return C[c] || c || C.i; }
  function n(v){ return Math.round(v * 10) / 10; }
  function esc(s){ return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  var HALO = "paint-order:stroke;stroke:var(--paper);stroke-width:4px;stroke-linejoin:round;";

  var K = {};
  K.col = col;

  K.svg = function(w, h, body){
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" role="img" ' +
      'style="font-family:var(--font-ui);overflow:visible">' + body + '</svg>';
  };

  K.line = function(x1, y1, x2, y2, c, o){
    o = o || {};
    return '<line x1="' + n(x1) + '" y1="' + n(y1) + '" x2="' + n(x2) + '" y2="' + n(y2) + '" style="stroke:' + col(c || "f") +
      ';stroke-width:' + (o.w || 1.6) + 'px;stroke-linecap:round' + (o.dash ? ';stroke-dasharray:' + o.dash : "") + '"/>';
  };

  /* Pfeil mit gefüllter Spitze */
  K.arrow = function(x1, y1, x2, y2, c, o){
    o = o || {};
    var w = o.w || 2.6, hs = o.head || (7 + w * 1.6);
    var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / L, uy = dy / L;
    var bx = x2 - ux * hs, by = y2 - uy * hs, px = -uy * hs * 0.42, py = ux * hs * 0.42;
    return '<line x1="' + n(x1) + '" y1="' + n(y1) + '" x2="' + n(bx + ux * 1.5) + '" y2="' + n(by + uy * 1.5) + '" style="stroke:' + col(c || "a") +
      ';stroke-width:' + w + 'px;stroke-linecap:round' + (o.dash ? ';stroke-dasharray:' + o.dash : "") + '"/>' +
      '<polygon points="' + n(x2) + ',' + n(y2) + ' ' + n(bx + px) + ',' + n(by + py) + ' ' + n(bx - px) + ',' + n(by - py) + '" style="fill:' + col(c || "a") + '"/>';
  };

  /* Text. o: {a:"start|middle|end", s:Größe, it:kursiv (Formelzeichen), b:fett, halo:false} */
  K.t = function(x, y, s, c, o){
    o = o || {};
    var st = (o.halo === false ? "" : HALO) + "fill:" + col(c || "i") + ";font-size:" + (o.s || 15) + "px;" +
      (o.it ? "font-family:var(--font-body);font-style:italic;" : "") + (o.b ? "font-weight:700;" : "font-weight:500;");
    return '<text x="' + n(x) + '" y="' + n(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="middle" style="' + st + '">' + esc(s) + '</text>';
  };
  /* Formelzeichen (kursiv, fett) */
  K.v = function(x, y, s, c, o){ o = o || {}; o.it = true; if(o.b === undefined) o.b = true; if(!o.s) o.s = 18; return K.t(x, y, s, c, o); };

  /* Beschriftung eines Pfeils/Segments: Mitte, senkrecht versetzt (off>0 = links der Laufrichtung) */
  K.vl = function(x1, y1, x2, y2, s, c, off, o){
    var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy) || 1;
    off = off === undefined ? 14 : off;
    var t = (o && o.at !== undefined) ? o.at : 0.5;
    return K.v(x1 + dx * t + dy / L * off, y1 + dy * t - dx / L * off, s, c, o);
  };

  K.dot = function(x, y, c, r){ return '<circle cx="' + n(x) + '" cy="' + n(y) + '" r="' + (r || 4) + '" style="fill:' + col(c || "i") + '"/>'; };
  K.circ = function(x, y, r, c, o){
    o = o || {};
    return '<circle cx="' + n(x) + '" cy="' + n(y) + '" r="' + r + '" style="fill:' + (o.fill ? col(o.fill) : "none") + ';stroke:' + col(c || "f") +
      ';stroke-width:' + (o.w || 1.4) + 'px' + (o.dash ? ';stroke-dasharray:' + o.dash : "") + '"/>';
  };
  K.ring = function(x, y, c, r){ return '<circle cx="' + n(x) + '" cy="' + n(y) + '" r="' + (r || 4.5) + '" style="fill:var(--paper);stroke:' + col(c || "i") + ';stroke-width:2px"/>'; };

  K.poly = function(pts, c, o){
    o = o || {};
    var p = pts.map(function(q){ return n(q[0]) + "," + n(q[1]); }).join(" ");
    return '<polygon points="' + p + '" style="fill:' + col(o.fill || "fa") + ';stroke:' + col(c || "a") + ';stroke-width:' + (o.w || 1.4) +
      'px;stroke-linejoin:round' + (o.dash ? ';stroke-dasharray:' + o.dash : "") + '"/>';
  };
  K.path = function(d, c, o){
    o = o || {};
    return '<path d="' + d + '" style="fill:' + (o.fill ? col(o.fill) : "none") + ';stroke:' + col(c || "i") + ';stroke-width:' + (o.w || 1.6) +
      'px;stroke-linecap:round;stroke-linejoin:round' + (o.dash ? ';stroke-dasharray:' + o.dash : "") + '"/>';
  };
  K.rect = function(x, y, w, h, c, o){
    o = o || {};
    return '<rect x="' + n(x) + '" y="' + n(y) + '" width="' + n(w) + '" height="' + n(h) + '" rx="' + (o.rx === undefined ? 4 : o.rx) +
      '" style="fill:' + col(o.fill || "p") + ';stroke:' + col(c || "r") + ';stroke-width:' + (o.w || 1.2) + 'px' + (o.dash ? ';stroke-dasharray:' + o.dash : "") + '"/>';
  };

  /* Winkelbogen um (cx,cy) von Richtung a1 nach a2 (Grad, mathematisch) */
  K.arc = function(cx, cy, r, a1, a2, c, o){
    o = o || {};
    var r1 = a1 * Math.PI / 180, r2 = a2 * Math.PI / 180;
    var x1 = cx + r * Math.cos(r1), y1 = cy - r * Math.sin(r1), x2 = cx + r * Math.cos(r2), y2 = cy - r * Math.sin(r2);
    var large = Math.abs(a2 - a1) > 180 ? 1 : 0, sweep = a2 > a1 ? 0 : 1;
    return K.path("M" + n(x1) + " " + n(y1) + " A" + r + " " + r + " 0 " + large + " " + sweep + " " + n(x2) + " " + n(y2), c || "m", o);
  };
  /* Richtung (Grad, mathematisch) eines Bildschirmvektors */
  K.ang = function(x1, y1, x2, y2){ return Math.atan2(-(y2 - y1), x2 - x1) * 180 / Math.PI; };

  /* Rechter-Winkel-Zeichen in Ecke (x,y) zwischen den Richtungen zu (ax,ay) und (bx,by) */
  K.ra = function(x, y, ax, ay, bx, by, s, c){
    s = s || 12;
    function u(px, py){ var dx = px - x, dy = py - y, L = Math.sqrt(dx * dx + dy * dy) || 1; return [dx / L * s, dy / L * s]; }
    var p = u(ax, ay), q = u(bx, by);
    return K.path("M" + n(x + p[0]) + " " + n(y + p[1]) + " L" + n(x + p[0] + q[0]) + " " + n(y + p[1] + q[1]) + " L" + n(x + q[0]) + " " + n(y + q[1]), c || "s", { w: 1.4 });
  };

  /* Kästchengitter */
  K.grid = function(x0, y0, cols, rows, st, c){
    var o = "";
    for(var i = 0; i <= cols; i++) o += K.line(x0 + i * st, y0, x0 + i * st, y0 + rows * st, c || "r", { w: 0.8 });
    for(var j = 0; j <= rows; j++) o += K.line(x0, y0 + j * st, x0 + cols * st, y0 + j * st, c || "r", { w: 0.8 });
    return o;
  };
  /* 2D-Achsenkreuz mit Ursprung (ox,oy); Ausdehnung in Pixeln */
  K.axes = function(ox, oy, left, right, up, down, lx, ly){
    return K.arrow(ox - left, oy, ox + right, oy, "s", { w: 1.3, head: 9 }) + K.arrow(ox, oy + down, ox, oy - up, "s", { w: 1.3, head: 9 }) +
      K.t(ox + right - 4, oy + 16, lx || "x", "s", { it: true, s: 15 }) + K.t(ox - 14, oy - up + 6, ly || "y", "s", { it: true, s: 15 });
  };
  /* Skalenstriche auf den Achsen */
  K.ticks = function(ox, oy, st, nx, ny, labels){
    var o = "";
    for(var i = 1; i <= nx; i++){ o += K.line(ox + i * st, oy - 4, ox + i * st, oy + 4, "s", { w: 1.2 }); if(labels) o += K.t(ox + i * st, oy + 15, String(i), "f", { s: 11 }); }
    for(var j = 1; j <= ny; j++){ o += K.line(ox - 4, oy - j * st, ox + 4, oy - j * st, "s", { w: 1.2 }); if(labels) o += K.t(ox - 13, oy - j * st, String(j), "f", { s: 11 }); }
    return o;
  };

  /* Schräges 3D-Bild (Kavalierprojektion): y nach rechts, z nach oben, x schräg nach vorn-unten */
  K.p3 = function(ox, oy, u, k){
    k = k === undefined ? 0.42 : k;
    var c = Math.cos(Math.PI / 4) * k;
    return function(x, y, z){ return [ox + u * y - u * c * x, oy - u * z + u * c * x]; };
  };
  K.a3 = function(P, p, q, c, o){ var A = P(p[0], p[1], p[2]), B = P(q[0], q[1], q[2]); return K.arrow(A[0], A[1], B[0], B[1], c, o); };
  K.l3 = function(P, p, q, c, o){ var A = P(p[0], p[1], p[2]), B = P(q[0], q[1], q[2]); return K.line(A[0], A[1], B[0], B[1], c, o); };
  K.poly3 = function(P, pts, c, o){ return K.poly(pts.map(function(q){ return P(q[0], q[1], q[2]); }), c, o); };
  K.axes3 = function(P, lx, ly, lz){
    var O = P(0, 0, 0), X = P(lx, 0, 0), Y = P(0, ly, 0), Z = P(0, 0, lz);
    return K.arrow(O[0], O[1], X[0], X[1], "f", { w: 1.2, head: 9 }) + K.arrow(O[0], O[1], Y[0], Y[1], "f", { w: 1.2, head: 9 }) +
      K.arrow(O[0], O[1], Z[0], Z[1], "f", { w: 1.2, head: 9 }) +
      K.t(X[0] - 10, X[1] + 6, "x", "f", { it: true }) + K.t(Y[0] + 6, Y[1] + 14, "y", "f", { it: true }) + K.t(Z[0] - 12, Z[1] + 4, "z", "f", { it: true });
  };

  /* Rahmen für Mehrfeld-Skizzen mit Überschrift */
  K.panel = function(x, y, w, h, title, c){
    return K.rect(x, y, w, h, "r", { fill: "p", rx: 6 }) + (title ? K.t(x + w / 2, y + 18, title, c || "s", { s: 13, b: true, halo: false }) : "");
  };
  /* Formel-Etikett (Monospace auf leicht abgesetzter Fläche) */
  K.f = function(x, y, s, c, o){
    o = o || {};
    var w = o.w || (String(s).length * (o.s || 14) * 0.6 + 18), h = (o.s || 14) + 14, a = o.a || "middle";
    var x0 = a === "middle" ? x - w / 2 : a === "end" ? x - w : x;
    return K.rect(x0, y - h / 2, w, h, c || "a", { fill: o.fill || "fa", rx: 4, w: 1 }) +
      '<text x="' + n(x0 + w / 2) + '" y="' + n(y) + '" text-anchor="middle" dominant-baseline="middle" style="font-family:var(--font-mono);font-size:' + (o.s || 14) +
      'px;font-weight:600;fill:' + col(c || "a") + '">' + esc(s) + '</text>';
  };

  window.SK = K;
})();
