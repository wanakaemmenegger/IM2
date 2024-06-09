
# Dokumentation IM2
Projekt von Agnes Boldis, Maria Reichmuth und Wanaka Emmenegger - Gruppe Code Mixers- Klasse mmp23cv
## Kurbeschrieb des Projekts
Unsere Website findet den Cocktail, den User suchen. Dabei kann entweder nach dem Namen oder einer bestimmten Zutat gesucht werden. Zusätzlich gibt es vier vordefinierte Filter, um Cocktails die Vodka, Gin oder Rum im Namen oder der Zutatenlisten enthalten anzeigen.
 
Die Suchergebnisse können angeklickt werden und zeigen dann die benötigten Zutaten, die Zubereitung und das zu verwendende Glass. Durch die Aktivierung der Pfeile im Headerbild oder die Betätigung der Pfeiltasten kann zum nächsten und vorherigen Suchergebnis gewechselt werden. Mit einem Klick auf den "Back to Results"-Button gelangt man zurück zu den Suchergebnissen. Ein Klick auf das Logo im Header führt zu einem Reload der Seite und damit zurück zur Homepage mit der Suchleiste.
 
Am Ende der Seite ist ein Footer mit den Favoriten Cocktails des Teams zu finden. Fährt man über das Bild, gibt es zusätzliche Angaben, wer was in unserem Cocktail-Webseiten Projekt umgesetzt hat.
## Learnings
Die Arbeit mit ChatGPT hat einiges erleichtert. Allerdings musste man nach jeder Überarbeitung prüfen ob alles noch funktioniert, oder ob in der Generierung Sachen angepasst wurden, die man gar nicht wollte. Am einfachsten war es jeweils nach spezifischen Anpassungen zu fragen und dann die spezifischen Code-Teile auszutauschen.
Um unsere einzelne ToDos und abgeschlossenen Aufgaben für die gesamte Gruppe festzuhalten haben wir direkt das ReadMe File verwendet. So hatten wir immer einen sehr praktischen Überblick. In GitHub haben wir die erledigten Aufgaben
## Schwierigkeiten
Die doppelte Suche nach Zutat und Name hat uns einiges erschwert. In einem ersten Schritt haben wir nur die Suche nach Namen programmiert. Da hat es gut funktioniert, dass die Suchergebnisse direkt bei der Eingabe aktualisiert wurden. Als wir dann aber die Abfrage auf die Zutatenliste erweitert haben, wurden die Ergebnisse erst dann angezeigt, als das gesamte Wort eingegeben wurde. (Also z.B. erst wenn "Vodka" und nicht wenn "Vodk" in der Suchleiste stand.) In einem Coaching konnten wir das mit Lea anaschauen und sie hat uns erklärt, dass wir in der Abfrage ein ? einsetzen müssen, damit die Ergebnisse auch angezeigt werden, wenn sie "null" oder "undefined" sind.
Auch das responsive Design hat viel Zeit in Anspruch genommen. Vor allem die Zentrierung der Cocktail-Vorschau in der Mobile Ansicht in Kombination mit der Zentrierung der letzten Reihe der Suchergebnisse war schwerer als gedacht. Es hat immer entweder das eine oder das andere funktioniert. Schlussendlich stellt sich heraus, dass am einen Ort mit einem Grid und am anderen Ort mit Flex-Boxen gearbeitet wurde und des deswegen Probleme gab.
## Benutzte Ressourcen
Wir haben unseren Code mit Hilfe von ChatGPT und der darin eingebundenen "AI JavaScript Programmierung API"- und "Tailwind CSS"-GPT erarbeitet. Wir konnten damit einzelne gewünschte Funktionen eingeben und haben unseren Code mit den entsprechenden Zeilen ergänzt. 
### H3
- Liste
- Liste

Suche nach Zutat und Cocktail, ? für live Abfrage Suche
# To Dos

- Strukturierung und Bereinigung Code
- Anhand von Gruppierung werden Bilder Detail getauscht (nach Glasstyp) - optional
- Animationen - Boxen Suchresutlate leicht animieren - optional

# Erledigt
- Bilder komprimieren
- Text Vorschläge + Korrektur Suche weg
- Suchfunktion "live" aktualisieren (ging schon mal)
- Header / Footer
- Filter (All, Vodka, Gin, Rum), verschwindet in Detailansicht
- Filter "All" ist aktiv wenn man etwas sucht
- Zurück-Button führt zurück zu Suchergebnissen,
- Detailansicht mit Bild (ohne abgerdundete Ecken), Ingredients, Instructions, Glass Type
- previous und next button sind links und rechts vom Titel platziert und führen zum vorherigen und nachherigen Cocktail
- Vorstellung des Teams integrieren
- Zurück-Button über Ingredients plazieren (Fixe Plazierung im Bild - Back to top button)
- Previous / Next - Rechts Links (Slider mittels Pfeiltaste)
- Klick auf "Logo" oben für Reset zur Suchmaske / "Homepage"
- Zum Anfang der Seite / nach oben springen, wenn Detail Seite geöffnet wird (Scroll to the top of the page)
- Suche Input, Placeholder weniger Deckkraft, Luppe Icon
- Hover Bild mit Transition
- Sucheregenise ganze Box Cursor
- default Cursor bei H1
- Gewisse Ingredients / Instructions sind leer? Schuld der API? - Fehlermeldung einbauen
- Alle Seiten-Inhalte Englisch - z.B. Fehlermeldungen
- Suchanfrage leeren sobald Filter angeklickt werden
- Responsive (Bilder dürfen bei Suche weniger Ergenissen nicht grösser werden)
- Responsive (Achtung bei wenigen Cocktail anzeigen)
