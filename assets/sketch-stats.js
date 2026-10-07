/* Skizzen-Statistik: Aufrufe, Verweildauer und eigener Lernstand je Skizze (window.SketchStats).
   Gespeichert unter "skizzen:state" – lokal sofort, geräteübergreifend über ITISync (falls angemeldet).
   Format: { v: { id: [aufrufe, sekunden, zuletztMs] }, s: { id: "u"|"v"|"s" } }
   Jede Änderung liest den aktuellen Stand neu ein und ergänzt nur das Delta → mehrere offene Tabs überschreiben sich nicht. */
(function(){
  "use strict";
  var KEY = "skizzen:state", LS = null, mem = "{}", listeners = [];
  try { LS = window.localStorage; } catch(e) {}
  function raw(){ try { return (LS ? LS.getItem(KEY) : mem) || "{}"; } catch(e){ return mem; } }
  function read(){ var s; try { s = JSON.parse(raw()) || {}; } catch(e){ s = {}; } s.v = s.v || {}; s.s = s.s || {}; return s; }
  function emit(){ listeners.forEach(function(cb){ try { cb(); } catch(e){} }); }
  function write(s){
    var str = JSON.stringify(s); mem = str;
    if(window.ITISync) window.ITISync.set(KEY, str);
    else try { if(LS) LS.setItem(KEY, str); } catch(e) {}
    emit();
  }
  function update(fn){ var s = read(); fn(s); write(s); }

  var STATUS = {
    u: { label: "unklar", icon: "?", title: "Noch unklar – später nachfragen/nacharbeiten" },
    v: { label: "verstanden", icon: "✓", title: "Verstanden" },
    s: { label: "sitzt", icon: "✓✓", title: "Sitzt – kann ich selbst aus dem Kopf skizzieren" }
  };

  window.SketchStats = {
    STATUS: STATUS,
    MIN_MS: 2000,                       // ab so langer Anzeige zählt ein Aufruf
    get: read,
    view: function(id, seconds){
      update(function(s){
        var v = s.v[id] || [0, 0, 0];
        v[0] += 1; v[1] += Math.round(Math.min(Math.max(seconds, 0), 600)); v[2] = Date.now();
        s.v[id] = v;
      });
    },
    status: function(id, st){ update(function(s){ if(st && STATUS[st]) s.s[id] = st; else delete s.s[id]; }); },
    onChange: function(cb){ listeners.push(cb); }
  };
  if(window.ITISync && window.ITISync.onChange) window.ITISync.onChange(emit);
  window.addEventListener("storage", function(e){ if(e.key === KEY) emit(); });
})();
