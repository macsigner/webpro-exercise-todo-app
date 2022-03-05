Web Pro Todo List
=================

# Todos

- [ ] Rewrite Checkbox to use span. Flickery roundet border fix.
- [ ] Change app-container CSS class to match later Javascript ligic
- [ ] Rework github pages work flow. Adding orphan branch?
- [ ] Add readme content. :)
- [ ] Fix Counter
- [ ] Show edit actions on mobile

## Infos für Kilian

- Header Image ist aus dem Grund ein `::before`, da ich mir dachte, dass es ja
  nicht direkt ein Inhaltsbild ist, sondern eher atmosphärisch. Plus einfacher
  wechsel durch CSS-Klasse.
- Aufbau nicht Mobile First, da ich _Custom Properties_ im einsatz habe.
  Tendenziell sind ja auf Mobile eher die aktuelleren Geräte im Einsatz als auf
  Desktoprechnern. Fallbacks gebe ich so nur auf Desktop an. Auf Mobile
  überschreibe ich dann einfach die Properties.
- Für die Checkbox wollte ich versuchen nur mit einem Element auszukommen. Der
  erste Versuch war noch mit `border-image` und `border-radius`. Hat im Chrome
  zwar funktioniert aber nicht in Firefox und Safari. Auf hochauflösenden
  Displays sieht die Checkbox halbwegs anständig aus aber nicht auf normalen
  Screens. Deswegen strebe ich noch einen Aufbau mit separatem `<span>` an.\
  _Checkmark_ extra nicht als `content` eingefügt, da ein leichter, vertikaler
  Versatz bei hochauflösenden Screens sichtbar war. Grössenkorrekturen sind als
  Hintergrundbild auch einfacher möglich.
- Javascript bitte ignorieren. Ist nur grob um den Aufbau kurz zu testen.
- Counter ebenfalls nur aus Spass an der Freude per CSS umgesetzt. Später ersatz
  mit Javascript. Update beim hinzufügen neuer einträge ist jetzt auch nicht
  Sichergestellt, da es erst aktualisiert, wenn ein Eintrag de- oder aktiviert
  wird.
- Farben stimmen unter Umständen überhaupt nicht.
- Umsetzung mit _Custom Properties_ für die Hell/Dunkel Farbschemata.
- Bearbeitungsfunktionen beim Todoitem sind in einem separaten Wrapper, damit
  allenfalls später noch Funktionen (Bearbeiten, Detail, IDK) hinzugefügt werden
  können.
- Alignment der Checkbox absichtlich auf `flex-start`, da nach meinem Gutdünken
  optisch schöner bei mehrzeiligen Listeneinträgen.
