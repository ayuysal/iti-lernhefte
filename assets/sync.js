/* ============================================================================
   iti-lernhefte · Persistenz- und Sync-Schicht
   ----------------------------------------------------------------------------
   Eine einzige Quelle für die Fortschritts-Speicherung aller Lernhefte + Hub.
   Reihenfolge der Speicherorte:
     1. localStorage  – immer, sofort, offline-fest (Basis-„Datenbank")
     2. Supabase      – zusätzlich, geräteübergreifend, sobald konfiguriert
                        (assets/config.js) UND der Nutzer angemeldet ist.
   Fällt Supabase aus (offline, keine Config, nicht angemeldet), bleibt alles
   über localStorage voll funktionsfähig.

   Öffentliche API  ->  window.ITISync
     get(key)              Promise<string|null>   (JSON-String des States)
     set(key, valueString) Promise<void>
     listAll()             Promise<{[key]:string}> (alle Heft-States, für Hub)
     signIn(email)         Promise   – Magic-Link an E-Mail
     signOut()             Promise
     getUser()             {email}|null
     onChange(cb)          Auth-/Sync-Zustand geändert
   ========================================================================= */
(function () {
  "use strict";

  var cfg = window.ITI_CONFIG || {};
  var HAS_CFG = !!(cfg.supabaseUrl && cfg.supabaseKey);
  var TABLE = "progress";

  /* ---------- localStorage-Helfer (mit In-Memory-Rückfallebene) ---------- */
  var mem = {};
  var LS = null;
  try { LS = window.localStorage; var t = "__iti_t"; LS.setItem(t, "1"); LS.removeItem(t); }
  catch (e) { LS = null; }

  function lsGet(k) {
    if (LS) { try { return LS.getItem(k); } catch (e) {} }
    return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null;
  }
  function lsSet(k, v) {
    mem[k] = v;
    if (LS) { try { LS.setItem(k, v); } catch (e) {} }
  }

  /* ---------- Zustand ---------- */
  var sb = null;         // Supabase-Client
  var user = null;       // angemeldeter Nutzer
  var listeners = [];
  function emit() { listeners.forEach(function (cb) { try { cb(); } catch (e) {} }); }

  /* ---------- Supabase dynamisch laden (nur wenn konfiguriert) ---------- */
  var sbReady = HAS_CFG ? loadSupabase() : Promise.resolve(null);

  function loadSupabase() {
    return new Promise(function (resolve) {
      function init() {
        try {
          sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey, {
            auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
          });
          sb.auth.getSession().then(function (r) {
            user = r && r.data && r.data.session ? r.data.session.user : null;
            emit();
            if (user) pullAll();
          });
          sb.auth.onAuthStateChange(function (_e, session) {
            var was = user && user.id;
            user = session ? session.user : null;
            emit();
            if (user && user.id !== was) pullAll();
          });
          resolve(sb);
        } catch (e) { resolve(null); }
      }
      if (window.supabase && window.supabase.createClient) return init();
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      s.async = true;
      s.onload = init;
      s.onerror = function () { resolve(null); };   // offline -> nur localStorage
      document.head.appendChild(s);
    });
  }

  /* ---------- Remote lesen und lokal zusammenführen (neuere gewinnt) ---- */
  function pullAll() {
    if (!sb || !user) return;
    sb.from(TABLE).select("heft,state,updated_at").eq("user_id", user.id)
      .then(function (r) {
        if (!r || r.error || !r.data) return;
        var changed = false;
        r.data.forEach(function (row) {
          var remoteT = Date.parse(row.updated_at) || 0;
          var localT = parseInt(lsGet(row.heft + ":t") || "0", 10);
          if (remoteT >= localT) {
            var str = JSON.stringify(row.state);
            if (str !== lsGet(row.heft)) { lsSet(row.heft, str); changed = true; }
            lsSet(row.heft + ":t", String(remoteT));
          }
        });
        if (changed) emit();
      });
  }

  function pushRemote(key, valueString) {
    if (!sb || !user) return;
    var state; try { state = JSON.parse(valueString); } catch (e) { state = {}; }
    sb.from(TABLE).upsert({
      user_id: user.id, heft: key, state: state, updated_at: new Date().toISOString()
    }, { onConflict: "user_id,heft" }).then(function () {}, function () {});
  }

  /* ---------- Öffentliche API ---------- */
  window.ITISync = {
    get: function (key) {
      return sbReady.then(function () {
        return lsGet(key);              // localStorage sofort; pullAll() aktualisiert async
      });
    },
    set: function (key, valueString) {
      lsSet(key, valueString);
      lsSet(key + ":t", String(Date.now()));
      pushRemote(key, valueString);
      return Promise.resolve();
    },
    listAll: function () {
      return sbReady.then(function () {
        var out = {};
        if (LS) {
          for (var i = 0; i < LS.length; i++) {
            var k = LS.key(i);
            if (/^iti2\d:state$/.test(k)) out[k] = LS.getItem(k);
          }
        } else {
          Object.keys(mem).forEach(function (k) { if (/^iti2\d:state$/.test(k)) out[k] = mem[k]; });
        }
        return out;
      });
    },
    signIn: function (email) {
      return sbReady.then(function () {
        if (!sb) throw new Error("Supabase nicht konfiguriert");
        return sb.auth.signInWithOtp({
          email: email,
          options: { emailRedirectTo: location.href.split("#")[0] }
        });
      });
    },
    signOut: function () {
      return sbReady.then(function () { return sb ? sb.auth.signOut() : null; })
        .then(function () { user = null; emit(); });
    },
    getUser: function () { return user ? { email: user.email, id: user.id } : null; },
    isConfigured: function () { return HAS_CFG; },
    onChange: function (cb) { listeners.push(cb); }
  };
})();
