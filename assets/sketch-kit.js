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
      K.t(ox + right - 4, oy + 16, lx === undefined ? "x" : lx, "s", { it: true, s: 15 }) + K.t(ox - 14, oy - up + 6, ly === undefined ? "y" : ly, "s", { it: true, s: 15 });
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

  /* ---------- Funktionsgraphen ----------
     M = K.map(ox, oy, sx, sy): Ursprung (ox,oy) in Pixeln, sx/sy Pixel pro Einheit. */
  K.map = function(ox, oy, sx, sy){
    return { X: function(v){ return ox + v * sx; }, Y: function(v){ return oy - v * sy; }, ox: ox, oy: oy, sx: sx, sy: sy };
  };
  /* Graph von f auf [a,b]. o: {n, ymin, ymax (Abschneiden), jump (Sprung in y-Einheiten → Lücke), w, dash} */
  K.plot = function(f, a, b, M, c, o){
    o = o || {};
    var N = o.n || 260, d = "", pen = false, prev = null;
    for(var i = 0; i <= N; i++){
      var x = a + (b - a) * i / N, y = f(x);
      var ok = isFinite(y) && (o.ymin === undefined || y >= o.ymin) && (o.ymax === undefined || y <= o.ymax);
      if(ok && pen && o.jump && prev !== null && Math.abs(y - prev) > o.jump) pen = false;
      if(ok){ d += (pen ? " L" : " M") + n(M.X(x)) + " " + n(M.Y(y)); pen = true; prev = y; }
      else { pen = false; prev = null; }
    }
    return d ? K.path(d.trim(), c || "a", { w: o.w || 2.4, dash: o.dash }) : "";
  };
  /* Fläche zwischen f und der x-Achse auf [a,b] */
  K.area = function(f, a, b, M, c, o){
    o = o || {};
    var N = o.n || 200, d = "M" + n(M.X(a)) + " " + n(M.Y(0));
    for(var i = 0; i <= N; i++){ var x = a + (b - a) * i / N; d += " L" + n(M.X(x)) + " " + n(M.Y(f(x))); }
    d += " L" + n(M.X(b)) + " " + n(M.Y(0)) + " Z";
    return '<path d="' + d + '" style="fill:' + col(c || "fa") + ';stroke:none"/>';
  };
  /* Säule von y=0 bis y=v an Stelle x (Breite w in Einheiten) */
  K.bar = function(x, v, w, M, c, o){
    o = o || {};
    var x0 = M.X(x - w / 2), x1 = M.X(x + w / 2), y0 = M.Y(0), y1 = M.Y(v);
    return K.rect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0), o.stroke || c, { fill: o.fill || "fa", rx: 1, w: 1.2 });
  };

  /* ---------- Graphen, Bäume, Automaten ---------- */
  /* Kreisknoten mit Beschriftung. o: {r, fill, w, s (Schriftgröße), tc (Textfarbe), it} */
  K.node = function(x, y, label, c, o){
    o = o || {};
    var r = o.r || 18;
    return K.circ(x, y, r, c || "a", { fill: o.fill || "p", w: o.w || 2 }) +
      (label !== undefined && label !== "" ? K.t(x, y + 1, label, o.tc || c || "i", { s: o.s || 14, b: true, it: o.it, halo: false }) : "");
  };
  /* Rechteckknoten (Speicherzelle, Listenelement, Kasten). o: {w, h, fill, s, tc} */
  K.cell = function(x, y, label, c, o){
    o = o || {};
    var w = o.w || 44, h = o.h || 34;
    return K.rect(x - w / 2, y - h / 2, w, h, c || "a", { fill: o.fill || "p", rx: o.rx === undefined ? 3 : o.rx, w: o.bw || 1.6 }) +
      (label !== undefined && label !== "" ? K.t(x, y + 1, label, o.tc || "i", { s: o.s || 14, b: true, halo: false, it: o.it }) : "");
  };
  /* Automatenzustand: o.start → Eingangspfeil von links, o.final → Doppelkreis */
  K.state = function(x, y, label, o){
    o = o || {};
    var r = o.r || 22, c = o.c || "a", s = "";
    if(o.start) s += K.arrow(x - r - 34, y, x - r - 1, y, "i", { w: 2, head: 10 });
    s += K.circ(x, y, r, c, { fill: o.fill || "p", w: 2.2 });
    if(o.final) s += K.circ(x, y, r - 5, c, { w: 1.8 });
    return s + K.t(x, y + 1, label, o.tc || "i", { s: o.s || 15, b: true, halo: false });
  };
  /* Kante zwischen zwei Kreisen (Mittelpunkte, Radien r1/r2). o: {bend (Pixel, + = links gekrümmt), r1, r2, c, w, dash, lab (Text), lo (Abstand Label), noarrow} */
  K.edge = function(x1, y1, x2, y2, o){
    o = o || {};
    var r1 = o.r1 === undefined ? 22 : o.r1, r2 = o.r2 === undefined ? 22 : o.r2, c = o.c || "s", bend = o.bend || 0;
    var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / L, uy = dy / L, px = uy, py = -ux;
    var mx = (x1 + x2) / 2 + px * bend, my = (y1 + y2) / 2 + py * bend, s = "";
    function toward(ax, ay, bx, by, r){ var ex = bx - ax, ey = by - ay, l = Math.sqrt(ex * ex + ey * ey) || 1; return [ax + ex / l * r, ay + ey / l * r]; }
    var A = bend ? toward(x1, y1, mx, my, r1) : [x1 + ux * r1, y1 + uy * r1], B = bend ? toward(x2, y2, mx, my, r2) : [x2 - ux * r2, y2 - uy * r2];
    if(bend){
      var cx = 2 * mx - (A[0] + B[0]) / 2, cy = 2 * my - (A[1] + B[1]) / 2;
      s += K.path("M" + n(A[0]) + " " + n(A[1]) + " Q" + n(cx) + " " + n(cy) + " " + n(B[0]) + " " + n(B[1]), c, { w: o.w || 1.8, dash: o.dash });
      if(!o.noarrow){ var hx = B[0] - cx, hy = B[1] - cy, hl = Math.sqrt(hx * hx + hy * hy) || 1; s += K.arrow(B[0] - hx / hl * 2, B[1] - hy / hl * 2, B[0], B[1], c, { w: o.w || 1.8, head: 10 }); }
    } else {
      s += o.noarrow ? K.line(A[0], A[1], B[0], B[1], c, { w: o.w || 1.8, dash: o.dash }) : K.arrow(A[0], A[1], B[0], B[1], c, { w: o.w || 1.8, head: 10, dash: o.dash });
    }
    if(o.lab !== undefined){ var lo = o.lo === undefined ? 12 : o.lo, sg = bend < 0 ? -1 : 1; s += K.t(mx + px * lo * sg, my + py * lo * sg, o.lab, o.lc || c, { s: o.ls || 13.5, b: true }); }
    return s;
  };
  /* Schleife an einem Zustand (Winkel in Grad, 90 = oben). o: {r, c, lab} */
  K.loop = function(x, y, ang, o){
    o = o || {};
    var r = o.r || 22, c = o.c || "s", a = (ang === undefined ? 90 : ang) * Math.PI / 180, sp = 0.5;
    var p1 = [x + r * Math.cos(a - sp), y - r * Math.sin(a - sp)], p2 = [x + r * Math.cos(a + sp), y - r * Math.sin(a + sp)];
    var d = r * 2.9, c1 = [x + d * Math.cos(a - sp * 1.6), y - d * Math.sin(a - sp * 1.6)], c2 = [x + d * Math.cos(a + sp * 1.6), y - d * Math.sin(a + sp * 1.6)];
    var s = K.path("M" + n(p1[0]) + " " + n(p1[1]) + " C" + n(c1[0]) + " " + n(c1[1]) + " " + n(c2[0]) + " " + n(c2[1]) + " " + n(p2[0]) + " " + n(p2[1]), c, { w: o.w || 1.8 });
    var hx = p2[0] - c2[0], hy = p2[1] - c2[1], hl = Math.sqrt(hx * hx + hy * hy) || 1;
    s += K.arrow(p2[0] - hx / hl * 2, p2[1] - hy / hl * 2, p2[0], p2[1], c, { w: o.w || 1.8, head: 10 });
    if(o.lab !== undefined) s += K.t(x + (d + 10) * Math.cos(a), y - (d + 10) * Math.sin(a), o.lab, o.lc || c, { s: o.ls || 13.5, b: true });
    return s;
  };

  window.SK = K;
})();
