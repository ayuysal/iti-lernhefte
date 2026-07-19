# ITI-Lernhefte

Kompakte, interaktive Lese-Zusammenfassungen mit Einsendeaufgaben und Lösungswegen für die sechs Studienhefte der **Informationstechnologie (ITI21–ITI26)** an der Wilhelm Büchner Hochschule.

> Es handelt sich um **eigene Zusammenfassungen** in eigenen Worten als Lernhilfe – nicht um die urheberrechtlich geschützten Original-Studienhefte. Die Lösungswege zu den Einsendeaufgaben sind eigene Rechen- und Argumentationswege zum Abgleich.

**Live:** https://ayuysal.github.io/iti-lernhefte/

## Inhalt

| Heft | Thema | Druck-Code |
|------|-------|-----------|
| ITI21 | Grundlagen moderner Computernetze | 1022K03 |
| ITI22 | Informationstheorie & Informationsübertragung | 0825K07 |
| ITI23 | Bitübertragung & Netzzugang | 1022K04 |
| ITI24 | TCP/IP-Protokollfamilie | 0124K08 |
| ITI25 | Internetworking & Netzdesign | 1123K06 |
| ITI26 | Anwendungsdienste & Netzmanagement | 0723K05 |

## Funktionen

- **Start-Hub** (`index.html`): alle Hefte auf einen Blick, Fortschritt pro Heft und gesamt.
- **Lesemarkierungen** je Abschnitt, **Leseband** (zuletzt gelesen), aufklappbare **Lösungswege**.
- **Hell/Dunkel-Modus**, **Schriftgröße** und **Schriftart-Auswahl** (Charter, Georgia, Sans, Verdana, Cambria).
- **Fortschritt-Speicherung**: immer lokal (localStorage, offline), optional **geräteübergreifend über Supabase**.

## Struktur

```
index.html              Start-Hub
ITI2x_Lernheft.html     die sechs Lernhefte
assets/
  sync.js               Persistenz- und Sync-Schicht (localStorage + Supabase)
  config.js             Supabase-Zugangsdaten (hier eintragen)
supabase/
  schema.sql            Datenbank-Schema (einmalig ausführen)
```

## Cloud-Sync mit Supabase einrichten (optional)

Ohne diese Schritte funktioniert alles über localStorage (pro Gerät). Für geräteübergreifenden Sync:

1. **Projekt anlegen** auf [supabase.com](https://supabase.com) (kostenloses Free-Tier genügt).
2. Im **SQL Editor** den Inhalt von [`supabase/schema.sql`](supabase/schema.sql) ausführen (legt Tabelle `progress` + Row Level Security an).
3. Unter **Project Settings → API** die *Project URL* und den *anon public*-Key kopieren und in [`assets/config.js`](assets/config.js) eintragen.
4. Unter **Authentication → Providers → Email** den *Email*-Login (Magic Link / OTP) aktivieren.
5. Unter **Authentication → URL Configuration** die *Site URL* auf die Pages-Adresse setzen: `https://ayuysal.github.io/iti-lernhefte/`.

Danach erscheint im Hub oben eine Anmeldung. Nach dem Login (Magic-Link per E-Mail) wird der Fortschritt automatisch synchronisiert. Der anon-Key ist für den Client-Einsatz gedacht und darf öffentlich sein – der Zugriff ist über Row Level Security auf die eigenen Zeilen beschränkt.

## Lokale Nutzung

Einfach `index.html` im Browser öffnen (Doppelklick). Cloud-Sync benötigt Internet; alle übrigen Funktionen laufen auch offline.
