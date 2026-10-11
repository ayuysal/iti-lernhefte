/* Lernplan – Einheiten mit Zeitbudget und Session-Navigator (window.PlanSession).
   Eine Tagesaufgabe wird in Einheiten zerlegt (Skizze, Rezept, Musterbeispiel rechnen, Fallen, Definition …), jede mit Budget.
   Die Session zeigt die Einheit eingebettet, misst die Zeit, gibt nach Ablauf 1 Minute Nachfrist (Zeitbox-Regel) und
   speichert: Karten-/Skizzen-/Definitionsstand, tatsächliche Zeiten ("plan:times") und notierte Fragen ("plan:fragen"). */
(function(root){
  "use strict";
  var B = { skNew: 120, skPeek: 60, skSeen: 30, rez: 180, rech: 540, fall: 120, defNew: 120, defOk: 30, muster: 900, gen: 600, unsure: 600, skUnsure: 120 };

  /* ---------- Einheiten bauen ---------- */
  // ctx: { D: ordnerdaten, S: skizzen, defs: [{id,a,t,d,q}], st: { ks, sks, skv, tg } }
  function skBudget(id, st){ var s = st.sks[id]; if(s === "s" || s === "v") return B.skSeen; if(s === "u") return B.skNew; return st.skv[id] && st.skv[id][0] ? B.skPeek : B.skNew; }
  function skLabel(id, st){ var s = st.sks[id]; return s === "s" || s === "v" ? "wiedererkennen" : s === "u" ? "war unklar" : st.skv[id] && st.skv[id][0] ? "schon gesehen – kurz prüfen" : "neu"; }
  function units(task, ctx){
    var D = ctx.D, S = ctx.S, st = ctx.st, out = [], seen = {};
    function sk(id, card){ if(!S[id] || seen[id]) return; seen[id] = 1; out.push({ k: "sk", id: id, card: card, b: skBudget(id, st), t: S[id].t, sub: skLabel(id, st) }); }
    if(task.type === "ov"){
      var used = {}; Object.keys(D.karten).forEach(function(k){ (D.karten[k].skizzen || []).forEach(function(s){ used[s] = 1; }); });
      out.push({ k: "lh", b: 300, t: "Kapitelüberblick im Lernheft: Überschriften und Einleitung lesen", href: task.h.toUpperCase() + "_Lernheft.html" });
      Object.keys(S).filter(function(id){ return id.indexOf(task.h + "-") === 0 && !used[id]; }).forEach(function(id){ sk(id); });
    } else if(task.type === "cards"){
      task.ids.forEach(function(cid){
        var k = D.karten[cid];
        (k.skizzen || []).forEach(function(s){ sk(s, cid); });
        out.push({ k: "rez", card: cid, b: B.rez, t: k.nr + " · Rezept & Formeln lesen – warum diese Schritte?" });
        out.push({ k: "rech", card: cid, b: B.rech, t: k.nr + " · Musterbeispiel abdecken, selbst rechnen, mit Casio prüfen" });
        out.push({ k: "fall", card: cid, b: B.fall, t: k.nr + " · Erkennen & Fallen – dann Stand setzen", last: true });
      });
    } else if(task.type === "tgi"){
      if(task.noDefs !== true) (ctx.defs || []).filter(function(d){ return d.a === task.sec; }).forEach(function(d){ var ok = st.tg["def:" + d.id] === 3; out.push({ k: "def", id: d.id, b: ok ? B.defOk : B.defNew, t: "Definition: " + d.t, sub: ok ? "sitzt schon – kurz bestätigen" : "aus dem Kopf aufschreiben" }); });
      if(task.extra) task.extra.forEach(function(x){ out.push({ k: "tgi", b: x[1] * 60, t: x[0], href: "tgi.html#" + task.sec }); });
      if(task.noMuster !== true) out.push({ k: "tgi", b: B.muster, t: "Musterlösungen der Klausuren nachvollziehen (selbst erst überlegen, dann lesen)", href: "tgi.html#" + (task.sec === "k" ? "kern" : task.sec) });
      (task.gen || []).forEach(function(g){ out.push({ k: "tgi", b: B.gen, t: "Übung „" + g + "“: 2 Aufgaben auf Papier, dann eintippen", href: "tgi.html#" + (task.sec === "k" ? "kern" : task.sec) }); });
    } else if(task.type === "unsure"){
      Object.keys(st.ks).filter(function(id){ return st.ks[id] === "u" && D.karten[id]; }).forEach(function(id){ out.push({ k: "uns", card: id, b: task.per || B.unsure, t: D.karten[id].nr + " · " + D.karten[id].titel + " – " + (task.how || "Musterbeispiel noch einmal selbst rechnen"), last: true }); });
      if(!out.length) out.push({ k: "free", b: 60, t: "Keine unsicheren Karten – nichts zu tun 🎉" });
    } else if(task.type === "skunsure"){
      Object.keys(st.sks).filter(function(id){ return st.sks[id] === "u" && /^mai/.test(id) && S[id]; }).forEach(function(id){ out.push({ k: "sk", id: id, b: B.skUnsure, t: S[id].t, sub: "war unklar" }); });
      if(!out.length) out.push({ k: "free", b: 60, t: "Keine unklaren Skizzen – nichts zu tun 🎉" });
    } else if(task.type === "defsweak"){
      (ctx.defs || []).filter(function(d){ var v = st.tg["def:" + d.id]; return v !== 3; }).forEach(function(d){ out.push({ k: "def", id: d.id, b: B.defNew, t: "Definition: " + d.t, sub: st.tg["def:" + d.id] ? "war " + (st.tg["def:" + d.id] === 2 ? "teilweise" : "nicht gewusst") : "noch offen" }); });
      if(!out.length) out.push({ k: "free", b: 60, t: "Alle Definitionen sitzen 🎉" });
    } else {
      out.push({ k: "free", b: (task.m || 10) * 60, t: task.t, href: task.l });
    }
    return out;
  }
  function total(us){ return us.reduce(function(a, u){ return a + u.b; }, 0); }

  var api = { B: B, units: units, total: total };
  if(typeof module !== "undefined" && module.exports) module.exports = api; else root.PlanUnits = api;
})(this);
