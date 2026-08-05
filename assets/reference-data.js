/* Kuratierte Nachschlage-Inhalte (aus dem Heftstoff zusammengestellt):
   Portnummern, OSI-Schichten, IP-Adressklassen sowie Zahlensystem-Umrechnungen
   mit Beispielen. Wird von wiederholen.html im "Referenz"- und "Formeln"-Tab genutzt. */
window.ITI_REFERENCE = {

  referenz: [
    { title: "Portnummern (Auswahl aus ITI24 / ITI26)", html:
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
      + '<div class="box"><span class="lbl">Portbereiche &amp; Socket</span><p>Portnummern sind <strong>16 Bit</strong> (0–65535). <strong>0–1023</strong> Well-Known / System Ports · <strong>1024–49151</strong> Registered Ports · <strong>49152–65535</strong> Dynamic / Private Ports. Ein <strong>Socket</strong> = IP-Adresse + Portnummer; er charakterisiert einen Verbindungsendpunkt.</p></div>' },

    { title: "OSI-Schichtenmodell (ITI21)", html:
      '<div class="tw"><table class="mono"><thead><tr><th>#</th><th>Schicht</th><th>Aufgabe</th><th>Dateneinheit</th></tr></thead><tbody>'
      + '<tr><td>7</td><td>Anwendung</td><td>Schnittstelle zum Nutzer, Anwendungsdienste</td><td>Daten / Nachricht</td></tr>'
      + '<tr><td>6</td><td>Darstellung</td><td>Codierung, Kompression, Verschlüsselung</td><td>–</td></tr>'
      + '<tr><td>5</td><td>Sitzung</td><td>Dialogsteuerung, Synchronisation</td><td>–</td></tr>'
      + '<tr><td>4</td><td>Transport</td><td>Ende-zu-Ende-Verbindung, Portadressierung</td><td>Segment</td></tr>'
      + '<tr><td>3</td><td>Vermittlung</td><td>Routing, logische Adressierung (IP)</td><td>Paket / Datagramm</td></tr>'
      + '<tr><td>2</td><td>Sicherung</td><td>Fehlererkennung, Zugriff aufs Medium (MAC)</td><td>Frame</td></tr>'
      + '<tr><td>1</td><td>Bitübertragung</td><td>physikalische Übertragung der Bits</td><td>Bit / Signal</td></tr>'
      + '</tbody></table></div>'
      + '<div class="box"><span class="lbl">Eselsbrücke (7 → 1)</span><p><strong>A</strong>ll <strong>P</strong>eople <strong>S</strong>eem <strong>T</strong>o <strong>N</strong>eed <strong>D</strong>ata <strong>P</strong>rocessing. Schichten 1–4 transportorientiert, 5–7 anwendungsorientiert. Switch = Schicht 1–2, Router = Schicht 1–3.</p></div>' },

    { title: "IP-Adressklassen &amp; Sonderadressen (ITI24)", html:
      '<div class="tw"><table class="mono"><thead><tr><th>Klasse</th><th>1. Oktett</th><th>Präfix</th><th>Netze / Hosts</th></tr></thead><tbody>'
      + '<tr><td>A</td><td>1–126</td><td>0…</td><td>126 / 16.777.214</td></tr>'
      + '<tr><td>B</td><td>128–191</td><td>10…</td><td>16.384 / 65.534</td></tr>'
      + '<tr><td>C</td><td>192–223</td><td>110…</td><td>2.097.152 / 254</td></tr>'
      + '<tr><td>D</td><td>224–239</td><td>1110…</td><td>Multicast</td></tr>'
      + '<tr><td>E</td><td>240–255</td><td>1111…</td><td>reserviert</td></tr>'
      + '</tbody></table></div>'
      + '<div class="box"><span class="lbl">Private Bereiche (RFC 1918) &amp; Sonderadressen</span><p>Privat: <strong>10.0.0.0/8</strong> · <strong>172.16.0.0/12</strong> · <strong>192.168.0.0/16</strong>. Loopback <strong>127.0.0.1</strong> · APIPA <strong>169.254.0.0/16</strong> · Netzadresse = alle Hostbits 0 · Broadcast = alle Hostbits 1.</p></div>' }
  ],

  conversions: { title: "Zahlensysteme &amp; Umrechnungen — mit Beispielen (GDI01)", html:
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
      + '<h4>Duale Subtraktion (Zweierkomplement)</h4><p>Einerkomplement bilden (alle Bits kippen), + 1 = Zweierkomplement, dann addieren. Darstellbarer Bereich bei n Bit: <strong>−2ⁿ⁻¹ … 2ⁿ⁻¹ − 1</strong>.</p>'
      + '<div class="step">Beispiel 7 − 5 (4 Bit):  5 = 0101 → Einerkompl. 1010 → +1 = 1011 (= −5)\n0111 (7) + 1011 (−5) = 1 0010 → Übertrag verwerfen → 0010 = 2</div>' }
};
