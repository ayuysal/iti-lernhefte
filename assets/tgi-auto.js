/* TGI-Klausurtrainer – Automaten und Grammatiken (TGI06/TGI07): Wortprüfung DEA/NEA, Potenzmengenkonstruktion,
   Minimierung nach Hopcroft/Ullman (Markierungsmatrix), Grammatik-Typ, Wörter einer Grammatik, SVG-Zeichnung.
   Automat: { Q:[..], S:[..], d:{q:{a:[q',..]}}, q0, E:[..] } – Notation wie im Heft: M = (Q, Σ, δ, q0, E). */
(function(root){
  "use strict";
  function next(M, set, a){ var r = []; set.forEach(function(q){ ((M.d[q] || {})[a] || []).forEach(function(p){ if(r.indexOf(p) < 0) r.push(p); }); }); return r; }
  function isDet(M){ // deterministisch: höchstens ein Folgezustand; total: genau einer
    var det = true, total = true, why = [];
    M.Q.forEach(function(q){ M.S.forEach(function(a){ var n = ((M.d[q] || {})[a] || []).length; if(n > 1){ det = false; why.push("δ(" + q + ", " + a + ") = {" + M.d[q][a].join(", ") + "}"); } if(n === 0) total = false; }); });
    return { det: det, total: total, why: why };
  }
  function run(M, w){ // Pfad als Mengenfolge
    var cur = [M.q0], path = [cur.slice()];
    for(var i = 0; i < w.length; i++){ cur = next(M, cur, w[i]); path.push(cur.slice()); }
    return { ok: cur.some(function(q){ return M.E.indexOf(q) >= 0; }), path: path };
  }
  function words(S, maxLen){ var out = [""], layer = [""]; for(var l = 1; l <= maxLen; l++){ var nl = []; layer.forEach(function(w){ S.forEach(function(a){ nl.push(w + a); }); }); out = out.concat(nl); layer = nl; } return out; }
  function lang(M, maxLen){ return words(M.S, maxLen).filter(function(w){ return run(M, w).ok; }); }

  /* Potenzmengenkonstruktion – nur erreichbare Mengen; leere Menge = Fehlerzustand ∅ */
  function subset(M){
    function key(s){ return s.slice().sort().join(","); }
    var start = [M.q0], todo = [start], seen = {}, rows = [], Q = [], d = {}, E = [];
    seen[key(start)] = start;
    while(todo.length){
      var s = todo.shift(), k = key(s), row = { from: s, to: {} };
      Q.push(k); d[k] = {};
      M.S.forEach(function(a){ var t = next(M, s, a), tk = key(t); row.to[a] = t; d[k][a] = [tk]; if(!(tk in seen)){ seen[tk] = t; todo.push(t); } });
      if(s.some(function(q){ return M.E.indexOf(q) >= 0; })) E.push(k);
      rows.push(row);
    }
    return { rows: rows, dea: { Q: Q, S: M.S, d: d, q0: key(start), E: E } };
  }
  /* Minimierung: Matrix aller Zustandspaare; markiert, wenn ein Zustand End-, der andere kein Endzustand ist,
     dann wiederholt, wenn ein Zeichen zu einem markierten Paar führt. Unmarkierte Paare verschmelzen. */
  function minimize(M){
    var Q = M.Q, mark = {}, why = {}, rounds = [];
    function pk(p, q){ return Q.indexOf(p) < Q.indexOf(q) ? p + "|" + q : q + "|" + p; }
    function to(q, a){ return ((M.d[q] || {})[a] || [])[0]; }
    var r0 = [];
    Q.forEach(function(p, i){ Q.forEach(function(q, j){ if(j <= i) return; var ep = M.E.indexOf(p) >= 0, eq = M.E.indexOf(q) >= 0; if(ep !== eq){ mark[pk(p, q)] = 1; why[pk(p, q)] = "Endzustand ≠ Nicht-Endzustand"; r0.push(pk(p, q)); } }); });
    rounds.push(r0);
    var changed = true;
    while(changed){
      changed = false; var r = [];
      Q.forEach(function(p, i){ Q.forEach(function(q, j){ if(j <= i || mark[pk(p, q)]) return;
        M.S.some(function(a){ var x = to(p, a), y = to(q, a); if(x !== undefined && y !== undefined && x !== y && mark[pk(x, y)]){ mark[pk(p, q)] = 1; why[pk(p, q)] = "mit " + a + " → (" + x + ", " + y + ") markiert"; r.push(pk(p, q)); return true; } return false; });
      }); });
      if(r.length){ rounds.push(r); changed = true; }
    }
    var groups = [], gi = {};
    Q.forEach(function(q){ if(gi[q] !== undefined) return; var g = [q]; gi[q] = groups.length; Q.forEach(function(p){ if(p !== q && gi[p] === undefined && !mark[pk(p, q)]){ g.push(p); gi[p] = groups.length; } }); groups.push(g); });
    return { mark: mark, why: why, rounds: rounds, groups: groups, pk: pk };
  }

  /* Grammatik: { N:[..], T:[..], P:[[links, rechts], ..], s } – rechts als Zeichenfolge, "" = ε. Typ nach Heft (Tab. 2.1). */
  function gType(G){
    var isN = function(c){ return G.N.indexOf(c) >= 0; }, isT = function(c){ return G.T.indexOf(c) >= 0; };
    var sOnRight = G.P.some(function(r){ return r[1].indexOf(G.s) >= 0; });
    var mono = G.P.every(function(r){ return r[1].length >= r[0].length || (r[0] === G.s && r[1] === "" && !sOnRight); });
    var kf = G.P.every(function(r){ return r[0].length === 1 && isN(r[0]); });
    var epsOk = G.P.every(function(r){ return r[1] !== "" || r[0] === G.s; });
    var rlin = G.P.every(function(r){ var b = r[1]; if(b === "") return r[0] === G.s; return (b.length === 1 && isT(b)) || (b.length === 2 && isT(b[0]) && isN(b[1])); });
    var llin = G.P.every(function(r){ var b = r[1]; if(b === "") return r[0] === G.s; return (b.length === 1 && isT(b)) || (b.length === 2 && isN(b[0]) && isT(b[1])); });
    if(kf && (rlin || llin)) return 3;
    if(kf) return 2;          // ε-Regeln sind bei Typ 2 nach Heft-Ausnahme erlaubt
    if(mono) return 1;
    return 0;
  }
  /* Wörter einer Grammatik bis Länge L (Breitensuche über Linksableitungen), mit Zahl der Linksableitungen je Wort */
  function gWords(G, L, limit){
    var isN = function(c){ return G.N.indexOf(c) >= 0; }, res = {}, q = [[G.s, 0]], seen = 0;
    while(q.length && seen < (limit || 200000)){
      var cur = q.shift(), f = cur[0]; seen++;
      var i = -1; for(var k = 0; k < f.length; k++) if(isN(f[k])){ i = k; break; }
      if(i < 0){ if(f.length <= L) res[f] = (res[f] || 0) + 1; continue; }
      var term = f.replace(/[A-Z]/g, "").length; if(term > L) continue;
      if(f.length > L + 6) continue;
      G.P.forEach(function(r){ if(r[0] === f[i]) q.push([f.slice(0, i) + r[1] + f.slice(i + 1), cur[1] + 1]); });
    }
    return res;
  }

  /* ---------- SVG-Zeichnung ---------- */
  function svg(M, pos, opt){
    opt = opt || {}; var R = 19, W = opt.w || 520, H = opt.h || 200, hl = opt.hl || [];
    // Zeichenfläche passend: Platz für Schleifen oben (o) bzw. unten (u) und Beschriftungen
    var top = Infinity, bot = -Infinity;
    M.Q.forEach(function(q){ var p = pos[q]; if(!p) return; var loop = M.S.some(function(a){ return ((M.d[q] || {})[a] || []).indexOf(q) >= 0; });
      top = Math.min(top, p[1] - (loop && (p[2] || "o") === "o" ? 66 : 30)); bot = Math.max(bot, p[1] + (loop && p[2] === "u" ? 70 : 30)); });
    H = Math.round(bot - top);
    var out = '<svg viewBox="0 ' + Math.round(top) + ' ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" class="asvg" role="img" aria-label="Automat"><defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>';
    var edges = {};
    M.Q.forEach(function(q){ M.S.forEach(function(a){ ((M.d[q] || {})[a] || []).forEach(function(p){ var k = q + "→" + p; (edges[k] = edges[k] || { f: q, t: p, l: [] }).l.push(a); }); }); });
    Object.keys(edges).forEach(function(k){
      var e = edges[k], A = pos[e.f], B = pos[e.t], lab = e.l.join(", ");
      if(!A || !B) return;
      if(e.f === e.t){
        var up = (A[2] || "o") === "o" ? -1 : 1, y0 = A[1] + up * R * .7;
        out += '<path d="M' + (A[0] - 9) + ',' + y0 + ' C' + (A[0] - 26) + ',' + (A[1] + up * 58) + ' ' + (A[0] + 26) + ',' + (A[1] + up * 58) + ' ' + (A[0] + 9) + ',' + y0 + '" fill="none" stroke="currentColor" stroke-width="1.4" marker-end="url(#ah)"/>';
        out += '<text x="' + A[0] + '" y="' + (A[1] + up * 50 + (up < 0 ? -2 : 12)) + '" text-anchor="middle" class="al">' + lab + '</text>';
        return;
      }
      var dx = B[0] - A[0], dy = B[1] - A[1], L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L;
      var back = edges[e.t + "→" + e.f], bend = back ? 22 : (opt.bend && opt.bend[k]) || 0;
      if(!bend){ // gerade Linie würde durch einen anderen Zustand laufen → Bogen
        var hit = M.Q.some(function(o){ if(o === e.f || o === e.t || !pos[o]) return false; var C = pos[o], tt = ((C[0] - A[0]) * dx + (C[1] - A[1]) * dy) / (L * L); if(tt <= 0 || tt >= 1) return false; var px = A[0] + tt * dx - C[0], py = A[1] + tt * dy - C[1]; return Math.sqrt(px * px + py * py) < R + 8; });
        if(hit) bend = (M.Q.indexOf(e.f) < M.Q.indexOf(e.t) ? -1 : 1) * 58;
      }
      var sx = A[0] + ux * R, sy = A[1] + uy * R, tx = B[0] - ux * R, ty = B[1] - uy * R;
      var mx = (sx + tx) / 2 - uy * bend, my = (sy + ty) / 2 + ux * bend;
      out += '<path d="M' + sx + ',' + sy + ' Q' + mx + ',' + my + ' ' + tx + ',' + ty + '" fill="none" stroke="currentColor" stroke-width="1.4" marker-end="url(#ah)"/>';
      var lx = (sx + 2 * mx + tx) / 4 - uy * 9, ly = (sy + 2 * my + ty) / 4 + ux * 9 + 4;
      out += '<text x="' + lx + '" y="' + ly + '" text-anchor="middle" class="al">' + lab + '</text>';
    });
    M.Q.forEach(function(q){
      var p = pos[q]; if(!p) return;
      var on = hl.indexOf(q) >= 0;
      out += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + R + '" class="st' + (on ? " on" : "") + '"/>';
      if(M.E.indexOf(q) >= 0) out += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (R - 4) + '" class="st2"/>';
      out += '<text x="' + p[0] + '" y="' + (p[1] + 4) + '" text-anchor="middle" class="sl">' + q + '</text>';
      if(q === M.q0) out += '<path d="M' + (p[0] - R - 30) + ',' + p[1] + ' L' + (p[0] - R - 1) + ',' + p[1] + '" stroke="currentColor" stroke-width="1.4" marker-end="url(#ah)"/><text x="' + (p[0] - R - 34) + '" y="' + (p[1] - 6) + '" class="al" text-anchor="middle">Start</text>';
    });
    return out + '</svg>';
  }
  function table(M){
    return '<table class="dtab"><thead><tr><th>δ</th>' + M.S.map(function(a){ return '<th>' + a + '</th>'; }).join("") + '</tr></thead><tbody>' +
      M.Q.map(function(q){ return '<tr><td>' + (q === M.q0 ? "→ " : "") + (M.E.indexOf(q) >= 0 ? "* " : "") + q + '</td>' + M.S.map(function(a){ var t = (M.d[q] || {})[a] || []; return '<td>' + (t.length === 0 ? "–" : t.length === 1 ? t[0] : "{" + t.join(", ") + "}") + '</td>'; }).join("") + '</tr>'; }).join("") + '</tbody></table>';
  }
  function tuple(M){ return "M = ({" + M.Q.join(", ") + "}, {" + M.S.join(", ") + "}, δ, " + M.q0 + ", {" + M.E.join(", ") + "})"; }

  var api = { next: next, isDet: isDet, run: run, words: words, lang: lang, subset: subset, minimize: minimize, gType: gType, gWords: gWords, svg: svg, table: table, tuple: tuple };
  if(typeof module !== "undefined" && module.exports) module.exports = api; else root.TGIAuto = api;
})(this);
