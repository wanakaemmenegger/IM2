let suche = document.querySelector('#suche');
let anzeige = document.querySelector('#anzeige');
let zurueckButton = document.createElement('button');

// Daten von der API abrufen
async function holeDaten(url) {
    try {
        let response = await fetch(url); // Warten auf die Daten von der API
        return await response.json(); // Umwandeln der Daten in JSON-Format
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
    }
}

// Initialdaten laden
async function initialeDatenLaden() {
    let cocktailDaten = await holeDaten('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a');
    datenDarstellen(cocktailDaten.drinks);
    suche.style.display = 'block'; // Suchleiste wieder anzeigen
    zurueckButton.style.display = 'none'; // Zurück-Button verstecken
}
initialeDatenLaden(); // Funktion beim Laden der Seite ausführen

// Funktion zur Darstellung der Cocktails
function datenDarstellen(cocktails) {
    anzeige.innerHTML = ''; // Leeren der Anzeige
    cocktails.forEach(cocktail => {
        let div = document.createElement('div');
        div.classList.add('cocktail-container'); // Klasse für Styling hinzufügen

        let image = document.createElement('img');
        image.src = cocktail.strDrinkThumb;
        image.alt = 'Bild von ' + cocktail.strDrink;

        let titel = document.createElement('h2');
        titel.innerText = cocktail.strDrink;

        // Ereignisbehandler für das Klicken auf einen Cocktail
        div.addEventListener('click', () => {
            cocktailDetailsAnzeigen(cocktail);
        });

        div.appendChild(image);
        div.appendChild(titel);
        anzeige.appendChild(div);
    });
}

// Funktion zur Anzeige der Cocktail-Details
function cocktailDetailsAnzeigen(cocktail) {
    anzeige.innerHTML = ''; // Leeren der Anzeige für Details

    // Ersetzen des Titels h1 durch den Namen des Cocktails
    document.querySelector('h1').innerText = cocktail.strDrink;

    let imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    let detailsContainer = document.createElement('div');
    detailsContainer.className = 'details-container';

    let image = document.createElement('img');
    image.src = cocktail.strDrinkThumb;
    image.alt = 'Bild von ' + cocktail.strDrink;
    image.className = 'detail-image';

    let instructions = document.createElement('div');
    instructions.innerText = 'Anleitung: ' + cocktail.strInstructionsDE;
    instructions.className = 'info-container';

    let glassType = document.createElement('div');
    glassType.innerText = 'Glastyp: ' + cocktail.strGlass;
    glassType.className = 'info-container';

    imageContainer.appendChild(image);
    detailsContainer.appendChild(instructions);
    detailsContainer.appendChild(glassType);

    anzeige.appendChild(imageContainer);
    anzeige.appendChild(detailsContainer);

    suche.style.display = 'none'; // Suchleiste verstecken
    zurueckButton.style.display = 'block'; // Zurück-Button anzeigen
}


// Zurück-Button konfigurieren
zurueckButton.innerText = 'Zurück';
zurueckButton.onclick = initialeDatenLaden; // Zurück zur initialen Ansicht
document.body.appendChild(zurueckButton); // Button zum Body hinzufügen
zurueckButton.style.display = 'none'; // Button standardmäßig verstecken

// Suchfunktion implementieren
suche.addEventListener('input', async function() {
    let query = suche.value;
    if (query.length > 0) {
        let searchUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + query;
        let gefundeneCocktails = await holeDaten(searchUrl);
        if (gefundeneCocktails.drinks) {
            datenDarstellen(gefundeneCocktails.drinks);
        } else {
            anzeige.innerHTML = '<p>Keine Cocktails gefunden.</p>'; // Meldung wenn keine Cocktails gefunden
        }
    } else {
        initialeDatenLaden(); // Zurücksetzen auf initiale Daten, wenn Suchfeld leer ist
    }
});