# Projekt Memoria — Betriebsanleitung

Jede Fachdefinition aus den WBH-Lernheften wird in einen zusammenhängenden
Fantasy-Reisebericht eingebettet. Die Originaldefinition bleibt IMMER unverändert
daneben stehen. Die Geschichte ersetzt sie nicht, sie verankert sie.

## Ablage

```
memoria/
  CLAUDE.md              <- diese Datei
  kanon/welt.md          <- Grundgesetze der Welt, Regionen, der Reisende
  kanon/reiseordnung.md  <- verbindlich: 20 Orte, Materialpaletten, Wege dazwischen
  kanon/orte.md          <- GENERIERT aus den Stücken (Raumfolge je Ort)
  kanon/inventar.md      <- GENERIERT aus den Abrufketten (jede vergebene Metapher)
  kanon/register.md      <- Zuordnung D-Nummer -> Heft + Definition
  _quellen/<CODE>.json   <- die Definitionen je Heft (aus assets/review-data.js)
  stuecke/D-###.md       <- ein Stück je Definition
  reise.html             <- Leseansicht der ganzen Reise (liest memoria-data.js)
```

Die Quelldateien `_quellen/<CODE>.json` sind aus `assets/review-data.js` abgeleitet
und nicht im Repo. Neu erzeugen mit dem Node-Einzeiler am Ende dieser Datei.

Nach jeder Änderung an den Stücken:

```
python _content/build_memoria.py
```

Das erzeugt `assets/memoria-data.js` (die App liest nur diese Datei), schreibt
`kanon/orte.md` und `kanon/inventar.md` neu und meldet unvollständige Stücke
sowie Doppelbilder.

## Pflichtablauf bei JEDER Generierung

1. Lies `kanon/welt.md`, `kanon/orte.md`, `kanon/inventar.md` vollständig.
2. Prüfe: In welcher Region / welchem Ort / welchem Raum liegt diese Definition?
   Existiert der Ort schon, wird er wiederverwendet, nie neu erfunden.
3. Prüfe im Inventar, ob eine geplante Metapher schon vergeben ist.
   Vergebene Metapher = verboten. Neue Metapher wählen.
4. Schreibe das Stück.
5. `orte.md` und `inventar.md` werden NICHT von Hand gepflegt — sie entstehen aus
   den Stücken selbst (`python _content/build_memoria.py`). Ein Bild gehört genau
   einer Sache; der Bau meldet jede Kollision.

## Aufbau eines Stücks

- 4 bis 8 Absätze, je Absatz genau EIN Definitionsbestandteil
- Jeder Absatz endet mit: `→ **Fachbegriff**`
- Danach: Abrufkette — die Bildfolge in Gehrichtung, nummeriert
- Danach: Merksatz — ein einziger Satz, der die ganze Kette aufruft
- Danach: Originaldefinition, wörtlich, unverändert

## Materialbann

Jeder Ort hat in `kanon/reiseordnung.md` eine eigene Werkstoff-Palette. Ein Stück
benutzt nur Dinge aus der Palette seines Ortes. Die Stoffe anderer Orte sind gesperrt —
so können zwei Orte gar nicht dasselbe Bild für zwei verschiedene Sachen benutzen.

## Anschluss

Jedes Stück beginnt mit einem Satz, der an das vorherige Stück anknüpft
(gleicher Ort, Tür weiter, Treppe hinauf). Der Reisende teleportiert nie.
Bei Kapitelwechsel: Übergangssatz, der die Reise weiterführt.
Bei Fachwechsel: ein Reisetag zwischen den Regionen, siehe `kanon/welt.md`.

## Stil

Ton wie Tolkien oder Rowling: konkret, sinnlich, leicht altertümlich.
Keine Erklärsprache, keine Meta-Kommentare, kein Verweis darauf, wofür ein Bild steht.
Bilder müssen greifbar sein: Gewicht, Geräusch, Geruch, Temperatur.
Regel: Wenn ein Bild nicht gezeichnet werden könnte, ist es falsch.

## Verbote

- Originaldefinition umformulieren
- Metaphern aus dem Inventar wiederverwenden
- Fachbegriff im Fließtext nennen (er gehört nur hinter den Pfeil)
- Mehr als eine Definition pro Stück

## Quelle der Definitionen

`assets/review-data.js` (`window.ITI_REVIEW.hefte[].defs[]`), erzeugt von
`_content/build_review.py`. Die Reihenfolge dort ist verbindlich und ergibt die
durchlaufende Memoria-Nummer D-001 … D-169 (siehe `kanon/register.md`).
Die Kachel-ID in der App (`ITI21-D01`) und die Memoria-Nummer (`D-001`) zeigen
auf dieselbe Definition.

## Auftragsformat

```
Neue Definition.
Thema:        <Fach + Heft>
Kapitel:      <Kapitelnummer + Titel>
Unterkapitel: <Nummer>
ID:           D-###

Definition:
<Text>

Folge CLAUDE.md. Knüpfe an D-### an.
```

## _quellen neu erzeugen

```bash
node -e "var fs=require('fs');global.window={};require('./assets/review-data.js');var D=window.ITI_REVIEW,n=0;D.hefte.forEach(function(h){var defs=h.defs.map(function(d,i){n++;return {id:'D-'+('00'+n).slice(-3),kachel:h.code+'-D'+('0'+(i+1)).slice(-2),nr:i+1,term:d.term,text:d.text,html:d.html};});fs.writeFileSync('memoria/_quellen/'+h.code+'.json',JSON.stringify({code:h.code,id:h.id,fach:h.fach,title:h.title,defs:defs},null,1),'utf8');});"
```

## Pruefen

```bash
python _content/check_memoria.py
```

Prueft alle Stuecke gegen das Regelwerk (Frontmatter, 4–8 Absaetze je mit Pfeilzeile,
Fachbegriff nicht im Fliesstext, Abrufkette deckungsgleich mit den Pfeilzeilen,
Originaldefinition zeichengenau, Schweizer ss nur im Erzaehltext, Anschlusskette,
doppelte Raumnamen) und schreibt `_content/memoria_pruefbericht.txt`.
