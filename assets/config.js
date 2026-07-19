/* ============================================================================
   iti-lernhefte · Supabase-Konfiguration
   ----------------------------------------------------------------------------
   Trage hier deine Supabase-Projektdaten ein, um den geräteübergreifenden
   Cloud-Sync zu aktivieren. Solange die Felder leer sind, funktioniert alles
   ganz normal über localStorage (offline, pro Gerät).

   Beide Werte findest du im Supabase-Dashboard unter
     Project Settings → API  →  "Project URL"  und  "anon public"-Key.
   Der anon-Key ist für den Client-Einsatz gedacht und darf öffentlich sein
   (der Zugriff wird über Row Level Security in supabase/schema.sql geschützt).
   ========================================================================= */
window.ITI_CONFIG = {
  supabaseUrl: "",   // z. B. "https://xxxxxxxxxxxx.supabase.co"
  supabaseKey: ""    // anon public key (eyJhbGciOi...)
};
