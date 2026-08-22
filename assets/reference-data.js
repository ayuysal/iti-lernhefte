/* Kuratierte Nachschlage- und Merk-Inhalte (aus dem Heftstoff zusammengestellt),
   genutzt von wiederholen.html in den Tabs "Referenz", "Formeln" und "Merklisten". */
window.ITI_REFERENCE = {

  /* ---------- REFERENZ (Nachschlagen: Ports, OSI, IP) ---------- */
  referenz: [
    { fach:"ITI", title: "Portnummern (Auswahl aus ITI24 / ITI26)", html:
      '<div class="tw"><table class="mono"><thead><tr><th>Port</th><th>Dienst / Protokoll</th><th>Transport</th></tr></thead><tbody>'
      + '<tr><td>20 / 21</td><td>FTP (Daten / Steuerung)</td><td>TCP</td></tr>'
      + '<tr><td>22</td><td>SSH</td><td>TCP</td></tr>'
      + '<tr><td>23</td><td>Telnet</td><td>TCP</td></tr>'
      + '<tr><td>25</td><td>SMTP (Mailversand)</td><td>TCP</td></tr>'
      + '<tr><td>53</td><td>DNS (Namensauflösung)</td><td>UDP / TCP</td></tr>'
      + '<tr><td>67 / 68</td><td>DHCP (Server / Client)</td><td>UDP</td></tr>'
      + '<tr><td>80</td><td>HTTP</td><td>TCP</td></tr>'
      + '<tr><td>110</td><td>POP3 (Mailabruf)</td><td>TCP</td></tr>'
      + '<tr><td>143</td><td>IMAP (Mailabruf)</td><td>TCP</td></tr>'
      + '<tr><td>161 / 162</td><td>SNMP (Abfrage / Trap)</td><td>UDP</td></tr>'
      + '<tr><td>443</td><td>HTTPS</td><td>TCP</td></tr>'
      + '<tr><td>546 / 547</td><td>DHCPv6 (Client / Server)</td><td>UDP</td></tr>'
      + '</tbody></table></div>'
      + '<div class="box"><span class="lbl">Portbereiche &amp; Socket</span><p>Portnummern sind <strong>16 Bit</strong> (0–65535). <strong>0–1023</strong> Well-Known / System Ports · <strong>1024–49151</strong> Registered Ports · <strong>49152–65535</strong> Dynamic / Private Ports. Ein <strong>Socket</strong> = IP-Adresse + Portnummer.</p></div>' },

    { fach:"ITI", title: "OSI-Schichtenmodell (ITI21)", html:
      '<div class="tw"><table class="mono"><thead><tr><th>#</th><th>Schicht</th><th>Aufgabe</th><th>Dateneinheit</th></tr></thead><tbody>'
      + '<tr><td>7</td><td>Anwendung</td><td>Schnittstelle zum Nutzer, Anwendungsdienste</td><td>Daten / Nachricht</td></tr>'
      + '<tr><td>6</td><td>Darstellung</td><td>Codierung, Kompression, Verschlüsselung</td><td>–</td></tr>'
      + '<tr><td>5</td><td>Sitzung</td><td>Dialogsteuerung, Synchronisation</td><td>–</td></tr>'
      + '<tr><td>4</td><td>Transport</td><td>Ende-zu-Ende-Verbindung, Portadressierung</td><td>Segment</td></tr>'
      + '<tr><td>3</td><td>Vermittlung</td><td>Routing, logische Adressierung (IP)</td><td>Paket / Datagramm</td></tr>'
      + '<tr><td>2</td><td>Sicherung</td><td>Fehlererkennung, Zugriff aufs Medium (MAC)</td><td>Frame</td></tr>'
      + '<tr><td>1</td><td>Bitübertragung</td><td>physikalische Übertragung der Bits</td><td>Bit / Signal</td></tr>'
      + '</tbody></table></div>'
      + '<div class="box"><span class="lbl">Eselsbrücke (7 → 1)</span><p><strong>A</strong>ll <strong>P</strong>eople <strong>S</strong>eem <strong>T</strong>o <strong>N</strong>eed <strong>D</strong>ata <strong>P</strong>rocessing. 1–4 transportorientiert, 5–7 anwendungsorientiert. Switch = 1–2, Router = 1–3.</p></div>' },

    { fach:"ITI", title: "IP-Adressklassen &amp; Sonderadressen (ITI24)", html:
      '<div class="tw"><table class="mono"><thead><tr><th>Klasse</th><th>1. Oktett</th><th>Präfix</th><th>Netze / Hosts</th></tr></thead><tbody>'
      + '<tr><td>A</td><td>1–126</td><td>0…</td><td>126 / 16.777.214</td></tr>'
      + '<tr><td>B</td><td>128–191</td><td>10…</td><td>16.384 / 65.534</td></tr>'
      + '<tr><td>C</td><td>192–223</td><td>110…</td><td>2.097.152 / 254</td></tr>'
      + '<tr><td>D</td><td>224–239</td><td>1110…</td><td>Multicast</td></tr>'
      + '<tr><td>E</td><td>240–255</td><td>1111…</td><td>reserviert</td></tr>'
      + '</tbody></table></div>'
      + '<div class="box"><span class="lbl">Private Bereiche (RFC 1918) &amp; Sonderadressen</span><p>Privat: <strong>10.0.0.0/8</strong> · <strong>172.16.0.0/12</strong> · <strong>192.168.0.0/16</strong>. Loopback <strong>127.0.0.1</strong> · APIPA <strong>169.254.0.0/16</strong> · Netzadresse = alle Hostbits 0 · Broadcast = alle Hostbits 1.</p></div>' }
  ],

  /* ---------- ZAHLENSYSTEME (im Formeln-Tab) ---------- */
  conversions: { fach:"TGI", title: "Zahlensysteme &amp; Umrechnungen — mit Beispielen (GDI01)", html:
      '<h4>Dual → Dezimal</h4><p>Zweierpotenzen der gesetzten Bits (1-Stellen) aufsummieren.</p>'
      + '<div class="step">10110₂ = 1·16 + 0·8 + 1·4 + 1·2 + 0·1 = 22\n11011001₂ = 128 + 64 + 16 + 8 + 1 = 217</div>'
      + '<h4>Dezimal → Dual</h4><p>Fortlaufend durch 2 teilen, die Reste von unten nach oben ablesen.</p>'
      + '<div class="step">42 : 2 = 21 Rest 0\n21 : 2 = 10 Rest 1\n10 : 2 =  5 Rest 0\n 5 : 2 =  2 Rest 1\n 2 : 2 =  1 Rest 0\n 1 : 2 =  0 Rest 1   ⟶  101010₂\n\n93 = 64 + 16 + 8 + 4 + 1 = 1011101₂</div>'
      + '<h4>Hexadezimal (Basis 16)</h4><p>Ziffern 0–9, A = 10 … F = 15. Eine Hex-Ziffer entspricht genau <strong>4 Bit</strong>.</p>'
      + '<div class="step">0xAF = 10·16 + 15      = 175\n0xBE = 11·16 + 14      = 190\nDual ⟶ Hex (je 4 Bit gruppieren): 1010 1111₂ = A F = AF₁₆</div>'
      + '<h4>Oktal (Basis 8)</h4><p>Ziffern 0–7. Eine Oktalziffer entspricht <strong>3 Bit</strong> (je 3 Bit gruppieren).</p>'
      + '<div class="step">101 010₂ = 5 2 = 52₈   (= 42 dezimal)</div>'
      + '<h4>Duale Addition</h4><p>Wie im Dezimalen, aber der Übertrag entsteht schon bei 1 + 1 = 10₂.</p>'
      + '<div class="step">  1 0 1 1   (11)\n+ 1 1 0 1   (13)\n---------\n1 1 0 0 0   (24)</div>'
      + '<h4>Duale Subtraktion (Zweierkomplement)</h4><p>Einerkomplement (alle Bits kippen), + 1 = Zweierkomplement, dann addieren. Bereich bei n Bit: <strong>−2ⁿ⁻¹ … 2ⁿ⁻¹ − 1</strong>.</p>'
      + '<div class="step">7 − 5 (4 Bit):  5 = 0101 → Einerkompl. 1010 → +1 = 1011 (= −5)\n0111 (7) + 1011 (−5) = 1 0010 → Übertrag verwerfen → 0010 = 2</div>' },

  /* ---------- MERKLISTEN (Selbsttest: klassische Aufzählungen) ---------- */
  merklisten: [
    { id:"osi7", fach:"ITI", title:"OSI-Schichtenmodell — die 7 Schichten (7 → 1) mit Dateneinheit", html:
      '<div class="step">7  Anwendung        Daten / Nachricht\n6  Darstellung       –\n5  Sitzung           –\n4  Transport         Segment\n3  Vermittlung       Paket / Datagramm\n2  Sicherung         Frame\n1  Bitübertragung    Bit / Signal</div><p><strong>Merksatz (7→1):</strong> All People Seem To Need Data Processing.</p>' },

    { id:"tcpip4", fach:"ITI", title:"TCP/IP- bzw. DoD-Modell — die 4 Schichten (+ OSI-Zuordnung)", html:
      '<div class="step">Prozess / Anwendung   ⟷  OSI 7 + 6 + 5\nHost-to-Host          ⟷  OSI 4\nInternet              ⟷  OSI 3\nNetzwerkzugang        ⟷  OSI 2 + 1</div>' },

    { id:"verbund", fach:"ITI", title:"Die Verbundeffekte von Computernetzen (9)", html:
      '<ol><li><strong>Kommunikationsverbund</strong> – Mensch-Mensch (E-Mail)</li><li><strong>Ressourcenverbund</strong> – nichtlokale Geräte/Software</li><li><strong>Informationsverbund</strong> – Verbreitung von Information (WWW)</li><li><strong>Datenverbund</strong> – entfernte Datenbestände</li><li><strong>Leistungsverbund</strong> – gemeinsame Aufgabenlösung</li><li><strong>Lastverbund</strong> – Aufgabenverlagerung bei Überlast</li><li><strong>Verfügbarkeitsverbund</strong> – Übernahme bei Ausfall</li><li><strong>Funktionsverbund</strong> – Spezialaufgaben (→ Client/Server)</li><li><strong>Steuerungs-/Wartungsverbund</strong></li></ol>' },

    { id:"klassif", fach:"ITI", title:"Klassifikationsmerkmale von Netzen (6 + 2)", html:
      '<ul><li>Administration (P2P ↔ Client-Server)</li><li>räumliche Ausdehnung</li><li>Topologie</li><li>Vermittlungsprinzip</li><li>Übertragungsmedium</li><li>Übertragungsbandbreite</li></ul><p>Ergänzend: Anzahl der Kommunikationsteilnehmer &amp; Übertragungsart.</p>' },

    { id:"ausdehnung", fach:"ITI", title:"Netze nach räumlicher Ausdehnung (klein → gross)", html:
      '<div class="step">PAN  Personal Area Network   (persönliche Geräte)\nLAN  Local Area Network      (wenige km)\nMAN  Metropolitan Area Net.  (Stadtnetz)\nWAN  Wide Area Network       (Weitverkehr)\nGAN  Global Area Network     (Kopplung mehrerer WANs → Internet)</div>' },

    { id:"topo", fach:"ITI", title:"Netz-Topologien (5)", html:
      '<p><strong>Bus, Ring, Stern, Baum, vermascht</strong> (voll-/teilvermascht). Basis fast aller: Punkt-zu-Punkt – Ausnahme Bus (gemeinsames Medium = Broadcastnetz). Stern &amp; Bus haben einen Single Point of Failure.</p>' },

    { id:"cast", fach:"ITI", title:"Kommunikationsarten nach Empfängerzahl (4)", html:
      '<div class="step">Unicast    genau ein Empfänger (Punkt-zu-Punkt)\nAnycast    Gruppe, kürzeste Route wird bedient\nMulticast  ausgewählte Gruppe\nBroadcast  alle erreichbaren Hosts</div>' },

    { id:"uebart", fach:"ITI", title:"Übertragungsarten (Richtung) + Vermittlung", html:
      '<p><strong>Richtung:</strong> Simplex (nur eine Richtung) · Halbduplex (beide, nicht gleichzeitig) · Vollduplex (gleichzeitig beide).</p><p><strong>Vermittlung:</strong> Leitungsvermittlung (dediziert, reserviert) · Paketvermittlung (virtuell, Store-and-Forward) · dazwischen: Nachrichtenvermittlung.</p>' },

    { id:"kenngr", fach:"ITI", title:"Kenngrössen / Dienstgüte (QoS) in Netzen", html:
      '<ul><li>Übertragungsrate b (bit/s)</li><li>Latenz (Verarbeitung + Warten + Übertragung + Ausbreitung)</li><li>Antwortzeit / RTT (ping)</li><li>Jitter (Latenzschwankung) → Jitter-Buffer</li><li>Paketverlustrate (vs. Fehlerrate)</li><li>Durchsatz (nur Nutzdaten)</li><li>Volumen eines Kanals = t · b</li></ul>' },

    { id:"primitive", fach:"ITI", title:"Dienstprimitive — der Ablauf (4)", html:
      '<div class="step">Request (REQ)  →  Indication (IND)  →  Response (RESP)  →  Confirmation (CONF)</div><p>Beispiel HTTP-Get: Request beim Client, Indication beim Server, Response zurück, Confirmation beim Client.</p>' },

    { id:"iplayers", fach:"ITI", title:"Protokolle nach OSI-Schicht (TCP/IP-Familie)", html:
      '<div class="step">7  Anwendung     HTTP, HTTPS, DNS, FTP, SMTP, POP, Telnet\n4  Transport     TCP, UDP\n3  Vermittlung   IP, ICMP\n2  Sicherung     Ethernet</div>' },

    { id:"routing", fach:"ITI", title:"Routing-Algorithmen: Distanz-Vektor vs. Link-State (ITI24)", html:
      '<p><strong>Distanz-Vektor (DV):</strong> Bellman-Ford; „teile dem Nachbarn mit, wie die Welt aussieht"; langsame Konvergenz, Count-to-Infinity (Gegenmittel: Split Horizon, Poisoned Reverse). Protokoll: <strong>RIP</strong>.</p><p><strong>Link-State (LS):</strong> Dijkstra/SPF; „teile der Welt mit, wer deine Nachbarn sind"; schnell, schleifenarm, hoher Aufwand. Protokoll: <strong>OSPF</strong>. Zwischen AS: <strong>BGP</strong> (EGP).</p>' },

    { id:"algo5", fach:"TGI", title:"Algorithmus — die 5 Eigenschaften (GDI01)", html:
      '<ol><li><strong>Endlichkeit</strong> (Finitheit) – endliche Beschreibung</li><li><strong>Ausführbarkeit</strong> – jeder Schritt ausführbar</li><li><strong>Eindeutigkeit</strong> (Determiniertheit) – gleiche Eingabe → gleiches Ergebnis</li><li><strong>Terminierung</strong> – endet nach endlich vielen Schritten</li><li><strong>Allgemeinheit</strong> – löst eine Problemklasse</li></ol>' },

    { id:"neumann", fach:"TGI", title:"Von-Neumann-Architektur — 4 Komponenten + Befehlszyklus", html:
      '<ul><li><strong>Rechenwerk</strong> (ALU)</li><li><strong>Steuerwerk</strong></li><li><strong>Speicher</strong> (Daten UND Programme – Programmspeicherkonzept)</li><li><strong>Ein-/Ausgabewerk</strong></li></ul><p>Befehlszyklus: <strong>Fetch → Decode → Execute</strong>. Sequenzielle Abarbeitung = Von-Neumann-Flaschenhals.</p>' },

    { id:"eva", fach:"TGI", title:"EVA-Prinzip + Kontrollstrukturen der strukturierten Programmierung", html:
      '<p><strong>EVA:</strong> Eingabe → Verarbeitung → Ausgabe.</p><p><strong>Kontrollstrukturen:</strong> Sequenz · Selektion (if/else) · Iteration (while/for).</p><p><strong>OOP-Grundbegriffe:</strong> Kapselung, Vererbung, Polymorphie.</p>' },

    { id:"sortier", fach:"TGI", title:"Sortieralgorithmen + Komplexitäten (TGI01/02)", html:
      '<div class="tw"><table class="mono"><thead><tr><th>Algorithmus</th><th>Best</th><th>Average</th><th>Worst</th><th>stabil</th></tr></thead><tbody>'
      + '<tr><td>BubbleSort</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>ja</td></tr>'
      + '<tr><td>SelectionSort</td><td>O(n²)</td><td>O(n²)</td><td>O(n²)</td><td>nein</td></tr>'
      + '<tr><td>InsertionSort</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>ja</td></tr>'
      + '<tr><td>QuickSort</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n²)</td><td>nein</td></tr>'
      + '<tr><td>MergeSort</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>ja</td></tr>'
      + '<tr><td>HeapSort</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>nein</td></tr>'
      + '<tr><td>RadixSort</td><td>O(n)</td><td>O(n)</td><td>O(n)</td><td>ja</td></tr>'
      + '</tbody></table></div><p>Untere Schranke für vergleichsbasiertes Sortieren: <strong>O(n log n)</strong>.</p>' },

    { id:"suche", fach:"TGI", title:"Suchalgorithmen + Komplexität", html:
      '<div class="step">Lineare Suche          O(n)\nBinäre Suche           O(log n)   (Liste muss sortiert sein)\nFibonacci-Suche        ~ binär (Aufteilung nach Fibonacci)\nInterpolatorische S.   O(log log n) bei Gleichverteilung</div>' },

    { id:"traversal", fach:"TGI", title:"Binärbaum-Traversierungen (3)", html:
      '<div class="step">Preorder   (WLR)  Wurzel → links → rechts\nInorder    (LWR)  links → Wurzel → rechts   (BST: sortiert!)\nPostorder  (LRW)  links → rechts → Wurzel</div><p>Max. Blätter auf Niveau m bei Ordnung k: <strong>kᵐ</strong>.</p>' },

    { id:"datastruct", fach:"TGI", title:"Dynamische Datenstrukturen + Operationen (TGI01)", html:
      '<ul><li><strong>Stack</strong> (Keller) – <strong>LIFO</strong>: push, pop, top, isEmpty (Klammerprüfung, Funktionsaufrufe)</li><li><strong>Queue</strong> (Schlange) – <strong>FIFO</strong>: enqueue, dequeue, front, isEmpty (Druckerwarteschlange, BFS)</li><li><strong>Liste</strong> – einfach/doppelt verkettet (Knoten + Zeiger)</li></ul>' },

    { id:"chomsky", fach:"TGI", title:"Chomsky-Hierarchie — die 4 Typen (Regelform + Automat)", html:
      '<div class="tw"><table class="mono"><thead><tr><th>Typ</th><th>Sprache</th><th>Regelform</th><th>Automat</th></tr></thead><tbody>'
      + '<tr><td>0</td><td>rekursiv aufzählbar</td><td>α → β</td><td>Turingmaschine</td></tr>'
      + '<tr><td>1</td><td>kontextsensitiv</td><td>|α| ≤ |β|</td><td>linear beschr. Automat</td></tr>'
      + '<tr><td>2</td><td>kontextfrei</td><td>A → β</td><td>Kellerautomat</td></tr>'
      + '<tr><td>3</td><td>regulär</td><td>A → aB | a</td><td>endlicher Automat</td></tr>'
      + '</tbody></table></div><p>Hierarchie: <strong>Typ 3 ⊂ Typ 2 ⊂ Typ 1 ⊂ Typ 0</strong>.</p>' },

    { id:"complexity", fach:"TGI", title:"Komplexitätsklassen + Wachstumsordnung", html:
      '<p><strong>Klassen:</strong> LOGSPACE ⊆ P ⊆ NP ⊆ PSPACE ⊆ EXPTIME.</p><p><strong>Wachstum (langsam → schnell):</strong></p><div class="step">O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²) &lt; O(n³) &lt; O(2ⁿ) &lt; O(n!)</div>' },

    { id:"master", fach:"TGI", title:"Master-Theorem — die 3 Fälle  T(n)=a·T(n/b)+nᵏ", html:
      '<div class="step">a &lt; bᵏ   →  T(n) = O(nᵏ)\na = bᵏ   →  T(n) = O(nᵏ · log n)\na &gt; bᵏ   →  T(n) = O(n^(log_b a))</div><p>Zusätzlich: <strong>Chip &amp; Conquer</strong> T(n)=T(n−c)+f(n) → O(∫f); <strong>Chip &amp; be Conquered</strong> T(n)=b·T(n−c)+f(n), b&gt;1 → exponentiell.</p>' },

    { id:"relation", fach:"TGI", title:"Eigenschaften von Relationen (4) + Spezialfälle", html:
      '<ul><li><strong>reflexiv</strong>: ∀x (x,x)∈R</li><li><strong>symmetrisch</strong>: (x,y)∈R → (y,x)∈R</li><li><strong>antisymmetrisch</strong>: (x,y)∈R ∧ (y,x)∈R → x=y</li><li><strong>transitiv</strong>: (x,y),(y,z)∈R → (x,z)∈R</li></ul><p><strong>Äquivalenzrelation</strong> = reflexiv + symmetrisch + transitiv. <strong>Partielle Ordnung</strong> = reflexiv + antisymmetrisch + transitiv.</p>' },

    { id:"dea", fach:"TGI", title:"Endlicher Automat — die 5 Bestandteile (DEA/NEA)", html:
      '<div class="step">M = (Q, Σ, δ, q₀, F)\nQ   endliche Zustandsmenge\nΣ   Eingabealphabet\nδ   Übergangsfunktion\nq₀  Startzustand\nF   Endzustände (⊆ Q)</div><p><strong>DEA:</strong> δ: Q×Σ → Q (eindeutig). <strong>NEA:</strong> δ: Q×Σ → P(Q) (Menge). NEA→DEA: Potenzmengenkonstruktion.</p>' },

    { id:"regex", fach:"TGI", title:"Reguläre Ausdrücke — Operatoren + Äquivalenz", html:
      '<ul><li>∅ (leere Menge), ε (leeres Wort), a (Zeichen)</li><li>u·v Verkettung</li><li>u|v Alternative</li><li>u* Kleene-Stern (0 oder mehr)</li><li>u⁺ = u·u* (1 oder mehr)</li></ul><p>Äquivalent: DEA ↔ NEA ↔ NEAε ↔ reguläre Grammatik ↔ regulärer Ausdruck (alle = reguläre Sprachen, Typ 3).</p>' },

    { id:"matching", fach:"TGI", title:"Matching-/String-Such-Algorithmen (TGI02)", html:
      '<div class="step">Naives Matching   O(n·m)   Zeichen für Zeichen\nKMP               O(n+m)   next[]-Tabelle\nBoyer-Moore       O(n/m)   von rechts, grosse Sprünge\nRabin-Karp        O(n+m)   Hashwert des Fensters</div>' },

    { id:"codier", fach:"TGI", title:"Codierungsarten + Fehlererkennung/-korrektur (ITI22/TGI)", html:
      '<p><strong>Quellencodierung</strong> – Redundanz verringern (Huffman, RLE, MP3). <strong>Kanalcodierung</strong> – Redundanz hinzufügen (Parität, Hamming, CRC). <strong>Leitungscodierung</strong> – ans Medium anpassen (NRZ, Manchester, 4B/5B).</p><p>Hamming-Distanz: Erkennung von e Fehlern <strong>d_min ≥ e+1</strong>; Korrektur von t Fehlern <strong>d_min ≥ 2t+1</strong>.</p>' }
  ]
};
