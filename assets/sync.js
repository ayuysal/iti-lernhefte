/* ============================================================================
   iti-lernhefte · Persistenz- und Sync-Schicht (v3: automatisch, ohne Login, verlustfrei)
   ----------------------------------------------------------------------------
   • OHNE ANMELDUNG: Alle Geräte nutzen denselben festen Cloud-Datensatz
     (Supabase-Funktionen iti21_get / iti21_save, wie die ITI-Mindmap).
     Jede Änderung geht nach ~0,4 s in die Cloud; beim Öffnen, beim Zurück-
     kehren in den Tab, bei Netzrückkehr und alle 30 s wird abgeglichen.
   • VERLUSTFREI: Jeder Stand wird in Einzelfelder zerlegt (gelesen „k3",
     gewusst „ITI21-D04", Skizze „mai06-spat" …). Jedes Feld hat einen eigenen
     Zeitstempel (hybride Uhr) bzw. Grabstein beim Löschen. Zusammenführen =
     pro Feld gewinnt die jüngere Änderung. Seiten speichern ihren ganzen
     Stand; hier wird nur das tatsächlich Geänderte übernommen (Vergleich mit
     dem Stand, den die Seite zuletzt bekommen hat) → ein veralteter Tab oder
     ein leerer Browser kann nie etwas löschen.
   • Hochladen = Cloud lesen → zusammenführen → schreiben → nachprüfen; fehlt
     danach etwas (zwei Geräte gleichzeitig), wird wiederholt. Was nicht
     hochging, bleibt „ausstehend" gespeichert und wird nachgeholt.
   • Einmalige Übernahme: lokale Altstände (v1) und – falls im Browser noch
     eine alte Anmeldung liegt – die alten Cloud-Zeilen aus Tabelle progress.

   Öffentliche API  ->  window.ITISync
     get(key) · set(key, str) · listAll() · onChange(cb) · status() · syncNow()
     (getUser/isConfigured/signIn … bleiben als Platzhalter für alte Aufrufer)
   ========================================================================= */
(function () {
  "use strict";

  var cfg = window.ITI_CONFIG || {};
  var HAS_CFG = !!(cfg.supabaseUrl && cfg.supabaseKey);
  var SEP = "\u001f", MEM = "\u0002", ARR = "\u0001arr", OBJ = "\u0001obj";

  /* ---------- localStorage mit In-Memory-Rückfall ---------- */
  var mem = {}, LS = null;
  try { LS = window.localStorage; var t = "__iti_t"; LS.setItem(t, "1"); LS.removeItem(t); } catch (e) { LS = null; }
  function lsGet(k) { if (LS) { try { return LS.getItem(k); } catch (e) {} } return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; }
  function lsSet(k, v) { mem[k] = v; if (LS) { try { LS.setItem(k, v); } catch (e) {} } }
  function jget(k, d) { try { var v = JSON.parse(lsGet(k)); return v == null ? d : v; } catch (e) { return d; } }
  function jset(k, v) { lsSet(k, JSON.stringify(v)); }

  /* ---------- Geräte-ID + hybride Uhr (monoton, auch bei falsch gehender Systemuhr) ---------- */
  var DEV = lsGet("sync:dev");
  if (!DEV) { DEV = Math.random().toString(36).slice(2, 10) + Date.now().toString(36); lsSet("sync:dev", DEV); }
  function clock() { var last = parseInt(lsGet("sync:hlc") || "0", 10) || 0, now = Math.max(Date.now(), last + 1); lsSet("sync:hlc", String(now)); return now; }
  function seen(t) { var last = parseInt(lsGet("sync:hlc") || "0", 10) || 0; if (t > last) lsSet("sync:hlc", String(t)); }

  /* ---------- Zerlegen / Zusammensetzen ---------- */
  function isStrArr(a) { for (var i = 0; i < a.length; i++) if (typeof a[i] !== "string") return false; return true; }
  function flat(o, p, out) {
    out = out || {};
    if (Array.isArray(o)) {
      if (isStrArr(o)) { out[p] = ARR; o.forEach(function (m) { out[p + SEP + MEM + m] = true; }); }
      else out[p] = o;                                   // Zahlen-/Objekt-Arrays: als Ganzes
    } else if (o && typeof o === "object") {
      if (p !== "") out[p] = OBJ;
      Object.keys(o).forEach(function (k) { flat(o[k], p === "" ? k : p + SEP + k, out); });
    } else out[p] = o;
    return out;
  }
  function unflat(F) {
    var root = {}, paths = Object.keys(F).filter(function (p) { return !F[p].d; }), arrPaths = {};
    paths.forEach(function (p) { var i = p.lastIndexOf(SEP); if (i >= 0 && p.charAt(i + 1) === MEM) arrPaths[p.slice(0, i)] = 1; });
    paths.sort(function (a, b) { return a.split(SEP).length - b.split(SEP).length || (F[a].t - F[b].t) || (a < b ? -1 : a > b ? 1 : 0); });
    function container(path) {                           // Behälter für einen Pfad holen/anlegen
      if (path === "") return root;
      var segs = path.split(SEP), cur = root, acc = "";
      for (var i = 0; i < segs.length; i++) {
        acc = i ? acc + SEP + segs[i] : segs[i];
        var want = ((F[acc] && !F[acc].d && F[acc].v === ARR) || arrPaths[acc]) ? "arr" : "obj";
        var ex = Array.isArray(cur) ? null : cur[segs[i]];
        if (ex == null || typeof ex !== "object" || (want === "arr") !== Array.isArray(ex)) { ex = want === "arr" ? [] : {}; if (!Array.isArray(cur)) cur[segs[i]] = ex; }
        cur = ex;
      }
      return cur;
    }
    paths.forEach(function (p) {
      var e = F[p], i = p.lastIndexOf(SEP), parent = i < 0 ? "" : p.slice(0, i), last = i < 0 ? p : p.slice(i + 1);
      if (e.v === ARR || e.v === OBJ) { container(p); return; }
      if (last.charAt(0) === MEM) { var arr = container(parent); if (Array.isArray(arr) && arr.indexOf(last.slice(1)) < 0) arr.push(last.slice(1)); return; }
      var c = container(parent); if (!Array.isArray(c)) c[last] = e.v;
    });
    return root;
  }
  function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
  function newer(a, b) { if (!b) return true; if (!a) return false; return a.t > b.t || (a.t === b.t && String(a.o) > String(b.o)); }
  /* Felder aus einem (alten) Gesamtstand mit festem Zeitstempel */
  function fromPlain(obj, t, origin) { var f = flat(obj || {}, ""), F = {}; Object.keys(f).forEach(function (p) { F[p] = { v: f[p], t: t, o: origin }; }); return F; }
  /* Zusammenführen: pro Feld gewinnt die jüngere Änderung. Liefert auch, ob A bzw. B etwas fehlte. */
  function merge(A, B) {
    var out = {}, aMissing = false, bMissing = false;
    Object.keys(A || {}).concat(Object.keys(B || {})).forEach(function (p) {
      if (out[p]) return;
      var a = A && A[p], b = B && B[p], w = newer(a, b) ? a : b;
      out[p] = w; seen(w.t);
      if (!same(a, w)) aMissing = true;
      if (!same(b, w)) bMissing = true;
    });
    return { F: out, aMissing: aMissing, bMissing: bMissing };
  }

  /* ---------- Lokaler Feldspeicher je Schlüssel ---------- */
  function keys() { return jget("sync:keys", []); }
  function addKey(k) { var ks = keys(); if (ks.indexOf(k) < 0) { ks.push(k); jset("sync:keys", ks); } }
  function getF(k) {
    var F = jget(k + ":crdt", null);
    if (F) return F;
    var raw = lsGet(k);                                  // Altbestand aus v1 übernehmen
    if (raw) { try { F = fromPlain(JSON.parse(raw), parseInt(lsGet(k + ":t") || "1", 10) || 1, "alt-" + DEV); } catch (e) { F = {}; } }
    else F = {};
    jset(k + ":crdt", F); addKey(k);
    return F;
  }
  function putF(k, F) {                                  // speichert Felder + App-Sicht; true = App-Sicht geändert
    jset(k + ":crdt", F); addKey(k);
    var str = JSON.stringify(unflat(F)), old = lsGet(k);
    if (str !== old) { lsSet(k, str); return true; }
    return false;
  }
  /* Altbestände aus v1 einsammeln (Schlüssel mit ":t"-Begleiter) */
  (function adopt() {
    if (!LS) return;
    try {
      for (var i = 0; i < LS.length; i++) {
        var k = LS.key(i);
        if (k && /:t$/.test(k) && !/^sync:/.test(k)) { var base = k.slice(0, -2); if (lsGet(base) != null) getF(base); }
      }
    } catch (e) {}
  })();

  var pending = jget("sync:pending", {});
  function markPending(k, on) { if (on) pending[k] = 1; else delete pending[k]; jset("sync:pending", pending); }

  /* ---------- Zustand / Ereignisse ---------- */
  /* Datensatz-Schlüssel kommt aus der Anmeldung (assets/gate.js): sha256(Benutzer|Passwort) – steht nirgends im Code */
  var CLOUD = (window.LHGate && window.LHGate.code && window.LHGate.code()) || null;
  var OLD_CLOUD = "lh-sync-7c3e91a4d2b85f60";            // bis 10.10.2026 öffentlich bekannt → einmalig übernehmen, danach geleert
  var ACTIVE = HAS_CFG && !!CLOUD;
  var listeners = [], baseMap = {};
  var st = { mode: ACTIVE ? "sync" : (HAS_CFG ? "locked" : "off"), last: parseInt(lsGet("sync:last") || "0", 10) || 0, error: "" };
  function emit() { listeners.forEach(function (cb) { try { cb(); } catch (e) {} }); }
  function setMode(m, err) { if (st.mode === m && st.error === (err || "")) return; st.mode = m; st.error = err || ""; emit(); }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function rpc(fn, body) {
    return fetch(cfg.supabaseUrl.replace(/\/+$/, "") + "/rest/v1/rpc/" + fn, {
      method: "POST", cache: "no-store",
      headers: { apikey: cfg.supabaseKey, Authorization: "Bearer " + cfg.supabaseKey, "Content-Type": "application/json" },
      body: JSON.stringify(body || {})
    }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text().then(function (t) { return t ? JSON.parse(t) : null; });
    });
  }
  function cloudGet() { return rpc("iti21_get", { p_code: CLOUD }).then(function (d) { return d && d.k ? d : { v: 3, k: {} }; }); }
  function cloudSave(doc) { return rpc("iti21_save", { p_code: CLOUD, p_data: doc }); }

  /* Cloud-Dokument in die lokalen Stände mischen; liefert Schlüssel, bei denen der Cloud etwas fehlt */
  function absorb(doc) {
    var all = {}, cloudMissing = [], changed = false;
    keys().concat(Object.keys(doc.k)).forEach(function (k) { all[k] = 1; });
    Object.keys(all).forEach(function (k) {
      var m = merge(getF(k), doc.k[k] || {});
      if (putF(k, m.F)) changed = true;
      if (m.bMissing) cloudMissing.push(k);
      doc.k[k] = m.F;
    });
    if (changed) emit();
    return cloudMissing;
  }

  /* ---------- Einmalige Übernahme der alten, anmeldungsgebundenen Cloud-Zeilen ---------- */
  function legacyRescue() {
    if (lsGet("sync:legacyDone") || !ACTIVE) return Promise.resolve();
    var tok = null;
    try {
      for (var i = 0; LS && i < LS.length; i++) { var k = LS.key(i); if (/^sb-.*-auth-token$/.test(k)) tok = JSON.parse(LS.getItem(k)); }
    } catch (e) {}
    if (!tok || !(tok.access_token || tok.refresh_token)) { lsSet("sync:legacyDone", "1"); return Promise.resolve(); }
    var base = cfg.supabaseUrl.replace(/\/+$/, "");
    function rows(access) {
      return fetch(base + "/rest/v1/progress?select=heft,state,updated_at", { headers: { apikey: cfg.supabaseKey, Authorization: "Bearer " + access } })
        .then(function (r) { if (r.status === 401) throw new Error("401"); if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); });
    }
    function refresh() {
      return fetch(base + "/auth/v1/token?grant_type=refresh_token", { method: "POST", headers: { apikey: cfg.supabaseKey, "Content-Type": "application/json" }, body: JSON.stringify({ refresh_token: tok.refresh_token }) })
        .then(function (r) { if (!r.ok) throw new Error("refresh " + r.status); return r.json(); }).then(function (j) { return j.access_token; });
    }
    return rows(tok.access_token).catch(function (e) { if (tok.refresh_token) return refresh().then(rows); throw e; }).then(function (list) {
      (list || []).forEach(function (row) {
        if (!row || !row.heft || /#v2$/.test(row.heft)) return;
        var m = merge(getF(row.heft), fromPlain(row.state, Date.parse(row.updated_at) || 1, "alt-cloud"));
        putF(row.heft, m.F); markPending(row.heft, true);
      });
      lsSet("sync:legacyDone", "1"); emit();
    }).catch(function () { lsSet("sync:legacyDone", "1"); });
  }

  /* Einmalig: Inhalt des alten, öffentlich bekannten Datensatzes in die lokalen Stände mischen */
  function migrateOld() {
    if (lsGet("sync:oldMoved")) return Promise.resolve();
    return rpc("iti21_get", { p_code: OLD_CLOUD }).then(function (d) {
      if (d && d.k && Object.keys(d.k).length) absorb(d);
      lsSet("sync:oldSeen", "1");
    }, function () {});
  }

  /* ---------- Abgleich: lesen → mischen → (falls nötig) schreiben → nachprüfen ---------- */
  var running = null, again = false, lastRun = 0, recheckTimer = null;
  function recheck() { if (!recheckTimer) recheckTimer = setTimeout(function () { recheckTimer = null; syncAll(); }, 2500); }
  function syncAll() {
    if (!ACTIVE) return Promise.resolve();
    if (running) { again = true; return running; }
    lastRun = Date.now();
    if (Object.keys(pending).length) setMode("sync");
    running = legacyRescue().then(migrateOld).then(function () {
      var tries = 0;
      function round() {
        tries++;
        return cloudGet().then(function (doc) {
          var missing = absorb(doc);
          Object.keys(pending).forEach(function (k) { if (missing.indexOf(k) < 0 && doc.k[k]) markPending(k, false); });
          if (!missing.length) return;
          doc.v = 3; doc.t = Date.now();
          return cloudSave(doc).then(function () { return cloudGet(); }).then(function (check) {
            var still = absorb(check);                    // hat ein anderes Gerät gleichzeitig geschrieben?
            if (still.length && tries < 5) return sleep(120 * tries).then(round);
            missing.forEach(function (k) { if (still.indexOf(k) < 0) markPending(k, false); });
            recheck();                                    // kurz danach erneut prüfen (gleichzeitige Schreiber)
          });
        });
      }
      return round();
    }).then(function () {
      running = null; st.last = Date.now(); lsSet("sync:last", String(st.last));
      var n = Object.keys(pending).length;
      setMode(n ? "error" : "ok", n ? "noch nicht alles hochgeladen" : "");
      if (!n && lsGet("sync:oldSeen") && !lsGet("sync:oldMoved")) {   // alles sicher im neuen Datensatz → alten leeren
        rpc("iti21_save", { p_code: OLD_CLOUD, p_data: { v: 3, k: {}, moved: Date.now() } }).then(function () { lsSet("sync:oldMoved", "1"); }, function () {});
      }
      if (again) { again = false; return syncAll(); }
    }, function (e) {
      running = null; again = false;
      setMode(navigator.onLine === false ? "offline" : "error", (e && e.message) || "Cloud nicht erreichbar");
    });
    return running;
  }

  var resolveFirst, firstSync = new Promise(function (r) { resolveFirst = r; });
  setTimeout(function () { resolveFirst(); }, 3500);     // nie länger als 3,5 s auf die Cloud warten
  if (ACTIVE) syncAll().then(resolveFirst, resolveFirst); else resolveFirst();

  var pushTimer = null;
  function schedulePush(ms) { clearTimeout(pushTimer); pushTimer = setTimeout(syncAll, ms == null ? 400 : ms); }

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") { if (Date.now() - lastRun > 5000) syncAll(); }
    else if (Object.keys(pending).length) { clearTimeout(pushTimer); syncAll(); }
  });
  window.addEventListener("online", function () { syncAll(); });
  window.addEventListener("focus", function () { if (Date.now() - lastRun > 5000) syncAll(); });
  setInterval(function () { if (document.visibilityState === "visible") syncAll(); }, 30000);
  window.addEventListener("storage", function (e) { if (e.key && /:crdt$/.test(e.key)) emit(); });   // andere Tabs

  /* ---------- Öffentliche API ---------- */
  function unsupported() { return Promise.reject(new Error("Anmeldung nicht mehr nötig – der Abgleich läuft automatisch.")); }
  window.ITISync = {
    get: function (key) {
      return firstSync.then(function () { getF(key); var v = lsGet(key); baseMap[key] = v; return v; });
    },
    set: function (key, valueString) {
      var F = getF(key), base = Object.prototype.hasOwnProperty.call(baseMap, key) ? baseMap[key] : lsGet(key);
      var bf, nf;
      try { bf = flat(base ? JSON.parse(base) : {}, ""); } catch (e) { bf = {}; }
      try { nf = flat(JSON.parse(valueString), ""); } catch (e) { return Promise.resolve(); }
      var any = false;
      Object.keys(nf).forEach(function (p) { if (!(p in bf) || !same(bf[p], nf[p])) { F[p] = { v: nf[p], t: clock(), o: DEV }; any = true; } });
      Object.keys(bf).forEach(function (p) { if (!(p in nf)) { F[p] = { d: 1, t: clock(), o: DEV }; any = true; } });
      baseMap[key] = valueString;
      if (!any) return Promise.resolve();
      if (putF(key, F) && lsGet(key) !== valueString) emit();   // Seite kennt Änderungen anderer Geräte noch nicht → neu einlesen
      markPending(key, true);
      if (ACTIVE) { setMode("sync"); schedulePush(); }
      return Promise.resolve();
    },
    listAll: function () {
      return firstSync.then(function () { var out = {}; keys().forEach(function (k) { if (/^iti2\d:state$/.test(k)) out[k] = lsGet(k); }); return out; });
    },
    onChange: function (cb) { listeners.push(cb); },
    status: function () { return { mode: st.mode, last: st.last, pending: Object.keys(pending).length, error: st.error }; },
    syncNow: function () { return syncAll(); },
    isConfigured: function () { return HAS_CFG; },
    getUser: function () { return null; },
    signIn: unsupported, signInPassword: unsupported, signUpPassword: unsupported, setPassword: unsupported,
    signOut: function () { return Promise.resolve(); },
    _internal: { flat: flat, unflat: unflat, merge: merge, fromPlain: fromPlain }
  };
})();
