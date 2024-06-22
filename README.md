# Dokumentation IM2
Projekt von Agnes Boldis, Maria Reichmuth und Wanaka Emmenegger - Gruppe Code Mixers- Klasse mmp23cv

## Kurbeschrieb des Projekts
Unsere Website findet den Cocktail, den User suchen. Dabei kann entweder nach dem Namen oder einer bestimmten Zutat gesucht werden. Zusätzlich gibt es vier vordefinierte Filter, um Cocktails die Vodka, Gin oder Rum im Namen oder der Zutatenlisten enthalten anzeigen.
 
Die Suchergebnisse können angeklickt werden und zeigen dann die benötigten Zutaten, die Zubereitung und das zu verwendende Glass. Durch die Aktivierung der Pfeile im Headerbild oder die Betätigung der Pfeiltasten kann zum nächsten und vorherigen Suchergebnis gewechselt werden. Mit einem Klick auf den "Back to Results"-Button gelangt man zurück zu den Suchergebnissen. Ein Klick auf das Logo im Header führt zu einem Reload der Seite und damit zurück zur Homepage mit der Suchleiste.
 
Am Ende der Seite ist ein Footer mit den Favoriten Cocktails des Teams zu finden. Hovert man über das Bild eines Teammitglieds, gibt es zusätzliche Angaben, wer was in unserem Cocktail-Webseiten Projekt umgesetzt hat.

## Learnings
Unsere API wurde bereits im Unterricht als Beispiel verwendet. Für uns war das sehr praktisch, da wir vor allem vor dieser Übung gar nicht gewusst hätten, wo wir mit dem Projekt starten sollten. Ein Learing, dass wir daraus zieh konnten, ist das man 

Die Arbeit mit ChatGPT hat einiges erleichtert. Allerdings musste man nach jeder Überarbeitung prüfen ob alles bisherige noch funktioniert, oder ob in der Generierung Sachen angepasst wurden, die man gar nicht wollte. Am einfachsten war es jeweils nach spezifischen Anpassungen zu fragen und dann die spezifischen Code-Teile auszutauschen.

Ebenfalls gab es durch die Generierung mit ChatGPT am Ende viele Funktionen, IDs und Classes die nicht optimal benannt oder kommentiert waren. Durch eine Überarbeitung konnten wir das gut beheben.

Um unsere einzelne ToDos und abgeschlossenen Aufgaben für die gesamte Gruppe festzuhalten haben wir direkt das ReadMe File verwendet. So hatten wir immer einen sehr praktischen Überblick. Beim Upload GitHub haben wir die erledigten Aufgaben jeweils im Summary festgehalten. Wir würden unsere Gruppenarbeit jederzeit wieder so organisieren.

## Schwierigkeiten
Die doppelte Suche nach Zutat und Name hat uns einiges erschwert. In einem ersten Schritt haben wir nur die Suche nach Namen programmiert. Da hat es gut funktioniert, dass die Suchergebnisse direkt bei der Eingabe aktualisiert wurden. Als wir dann aber die Abfrage auf die Zutatenliste erweitert haben, wurden die Ergebnisse erst dann angezeigt, als das gesamte Wort eingegeben wurde. (Also z.B. erst wenn "Vodka" und nicht wenn "Vodk" in der Suchleiste stand.) In einem Coaching konnten wir das mit Lea anaschauen und sie hat uns erklärt, dass wir in der Abfrage ein ? einsetzen müssen, damit die Ergebnisse auch angezeigt werden, wenn sie "null" oder "undefined" sind.

Auch das responsive Design hat viel Zeit in Anspruch genommen. Vor allem die Zentrierung der Cocktail-Vorschau in der Mobile Ansicht in Kombination mit der Zentrierung der letzten Reihe der Suchergebnisse war schwerer als gedacht. Es hat immer entweder das eine oder das andere funktioniert. Schlussendlich stellt sich heraus, dass am einen Ort mit einem Grid und am anderen Ort mit Flex-Boxen gearbeitet wurde und des deswegen Probleme gab.

Bei der UX-Gestaltung  war es zeitaufwendig bis alle notwendigen Funktionen mit unseren Filtern etc. korrekt eingebaut und intuitiv waren. Zum Beispiel soll der Klick oben aufs Logo zurück zur allgemeinen Cocktail-Übersicht führen. Dabei muss zudem der Filter zurück auf "All" und das Suchfeld geleert werden. Bis wir all diese "Fehler" oder bessergesagt inkonsequenten Darstellungen gefunden haben, dauerte es seine Zeit. Durch viele test ist unsere Website nun aber intuitiv aufgebaut und die Klicks machen das, was ein User erwartet.

## Benutzte Ressourcen
Wir haben unseren Code mit Hilfe von ChatGPT und der darin eingebundenen "AI JavaScript Programmierung API"- und "Tailwind CSS"-GPT erarbeitet. Wir konnten damit einzelne gewünschte Funktionen eingeben und haben unseren Code mit den entsprechenden Zeilen ergänzt. Auch die Website W3schools wurde als Spickzettel für spezifische Fragen verwendet.