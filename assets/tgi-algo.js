/* TGI-Klausurtrainer – Algorithmen genau in der Variante der WBH-Hefte (TGI01, TGI02).
   Jede Funktion liefert neben dem Ergebnis die Zwischenschritte, aus denen Musterlösung und Kontrolle entstehen.
   Nutzbar im Browser (window.TGIAlgo) und in node (module.exports). */
(function(root){
  "use strict";

  /* BubbleSort (TGI01, Bsp. 5.3 bubbleSort2): (n−1) Durchläufe von links nach rechts, Nachbarn vergleichen,
     tauschen wenn A[j] > A[j+1]; nach Durchlauf i stehen die i größten Werte rechts fest. */
  function bubble(a){
    var A = a.slice(), passes = [], cmp = 0, swp = 0;
    for(var i = 0; i < A.length - 1; i++){
      var steps = [], swaps = [];
      for(var j = 0; j < A.length - (i + 1); j++){
        cmp++;
        var sw = A[j] > A[j + 1];
        if(sw){ var t = A[j]; A[j] = A[j + 1]; A[j + 1] = t; swp++; swaps.push([A[j + 1], A[j]]); }
        steps.push({ j: j, swap: sw, state: A.slice() });
      }
      passes.push({ state: A.slice(), swaps: swaps, steps: steps, fixedFrom: A.length - (i + 1) });
    }
    return { sorted: A, passes: passes, cmp: cmp, swp: swp };
  }

  /* InsertionSort (TGI01, Bsp. 5.6): Elemente nacheinander aus der Eingabe nehmen und in die neue, sortierte Liste
     einfügen – Vergleich mit der sortierten Liste VON LINKS, vor dem ersten größeren Element einfügen. */
  function insertion(a){
    var S = [], steps = [], cmp = 0;
    a.forEach(function(x, k){
      var pos = S.length, c = 0;
      for(var i = 0; i < S.length; i++){ c++; if(S[i] > x){ pos = i; break; } }
      cmp += c;
      S.splice(pos, 0, x);
      steps.push({ x: x, pos: pos, cmp: c, sorted: S.slice(), rest: a.slice(k + 1) });
    });
    return { sorted: S, steps: steps, cmp: cmp };
  }

  /* QuickSort (TGI02, Bsp. 1.2): pivot = Index ⌊n/2⌋; A1 = alle anderen ≤ pivot, A2 = alle > pivot,
     Reihenfolge der Elemente bleibt erhalten; Ergebnis = qs(A1) + pivot + qs(A2). */
  function quick(a){
    var calls = [];
    function qs(A, depth){
      if(A.length <= 1){ calls.push({ list: A.slice(), depth: depth, leaf: true }); return A.slice(); }
      var p = Math.floor(A.length / 2), pv = A[p], A1 = [], A2 = [];
      A.forEach(function(e, i){ if(i !== p){ if(e <= pv) A1.push(e); else A2.push(e); } });
      var call = { list: A.slice(), depth: depth, pi: p, pivot: pv, A1: A1, A2: A2 };
      calls.push(call);
      var r = qs(A1, depth + 1).concat([pv], qs(A2, depth + 1));
      call.result = r;
      return r;
    }
    var s = qs(a.slice(), 0);
    return { sorted: s, calls: calls };
  }

  /* SelectionSort (TGI01, Bsp. 5.5): Minimum des Rests suchen und mit Position i tauschen. */
  function selection(a){
    var A = a.slice(), passes = [];
    for(var i = 0; i < A.length - 1; i++){
      var m = i;
      for(var j = i + 1; j < A.length; j++) if(A[j] < A[m]) m = j;
      var t = A[i]; A[i] = A[m]; A[m] = t;
      passes.push({ i: i, min: A[i], from: m, state: A.slice() });
    }
    return { sorted: A, passes: passes };
  }

  /* Hashing (TGI02, Kap. 3): offene Verfahren. linear: h, h+1, h+2 …; quadratisch: h, h+1, h+4, h+9 … (mod m). */
  function hashing(keys, m, hf, probe){
    var T = new Array(m).fill(null), log = [];
    keys.forEach(function(k){
      var h = hf(k), tries = [], pos = null;
      for(var i = 0; i < m * 2 + 1; i++){
        var off = probe === "quadratisch" ? i * i : i, p = ((h + off) % m + m) % m;
        tries.push({ i: i, off: off, p: p, frei: T[p] === null, belegt: T[p] });
        if(T[p] === null){ T[p] = k; pos = p; break; }
      }
      log.push({ key: k, h: h, tries: tries, pos: pos });
    });
    return { table: T, log: log };
  }
  function hDiv(m){ return function(k){ return k % m; }; }
  /* Multiplikationsmethode: h(k) = ⌊m · (a·k − ⌊a·k⌋)⌋ – mit Rundung gegen Gleitkommafehler (12 Stellen) */
  function hMul(m, a){ return function(k){ var ak = +(a * k).toFixed(12), fr = +(ak - Math.floor(ak)).toFixed(12); return Math.floor(+(fr * m).toFixed(10)); }; }

  /* Turniermethode (TGI02, Kap. 2.1) für Minimum und Zweitkleinstes: Paare von links bilden, bei ungerader Anzahl
     hat das letzte Element ein Freilos; danach spielen alle, die gegen den Sieger verloren haben. */
  function turnier(a, best){
    best = best || function(x, y){ return x <= y; };   // Minimum-Turnier
    var rounds = [], cur = a.map(function(v, i){ return { v: v, id: i, lost: [] }; }), cmp = 0;
    while(cur.length > 1){
      var next = [], games = [];
      for(var i = 0; i < cur.length; i += 2){
        if(i + 1 >= cur.length){ next.push(cur[i]); games.push({ bye: cur[i].v }); continue; }
        var x = cur[i], y = cur[i + 1]; cmp++;
        var w = best(x.v, y.v) ? x : y, l = w === x ? y : x;
        w.lost.push(l.v); next.push(w); games.push({ a: x.v, b: y.v, w: w.v });
      }
      rounds.push(games); cur = next;
    }
    var winner = cur[0], cand = winner.lost.slice(), second = cand[0], c2 = 0;
    for(var j = 1; j < cand.length; j++){ c2++; if(best(cand[j], second)) second = cand[j]; }
    return { winner: winner.v, rounds: rounds, kandidaten: cand, second: second, cmp1: cmp, cmp2: c2 };
  }

  /* Boyer-Moore (TGI02, Kap. 4.1.2, vereinfachte Fassung des Hefts): Pattern von hinten vergleichen; bei Mismatch
     mit Textzeichen q das LETZTE Vorkommen von q im Pattern darüberlegen (kommt q nicht vor: ganz vorbeischieben);
     läge das letzte Vorkommen rechts von der Vergleichsstelle, um 1 schieben. */
  function boyerMoore(text, pat, maxTries){
    var tries = [], s = 0, n = text.length, m = pat.length;
    while(s <= n - m && tries.length < (maxTries || 999)){
      var j = m - 1, cmps = 0;
      while(j >= 0){ cmps++; if(pat[j] !== text[s + j]) break; j--; }
      if(j < 0){ tries.push({ s: s, match: true, cmps: cmps }); s += 1; continue; }
      var q = text[s + j], last = pat.lastIndexOf(q), shift;
      if(last < 0) shift = j + 1; else if(last < j) shift = j - last; else shift = 1;
      tries.push({ s: s, match: false, j: j, q: q, last: last, shift: shift, cmps: cmps });
      s += shift;
    }
    return { tries: tries };
  }

  var api = { bubble: bubble, insertion: insertion, quick: quick, selection: selection, hashing: hashing, hDiv: hDiv, hMul: hMul, turnier: turnier, boyerMoore: boyerMoore };
  if(typeof module !== "undefined" && module.exports) module.exports = api; else root.TGIAlgo = api;
})(this);
