let suche = document.querySelector('#suche');
let anzeige = document.querySelector('#anzeige');
let h1Element = document.querySelector('h1');
let zurueckButton = document.createElement('button');
let originalTitle = h1Element.innerText; // Originaltitel speichern

// Funktion zum Abrufen von Daten von der API
async function holeDaten(url) {
    try {
        let response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
    }
}

// Initialdaten laden
async function initialeDatenLaden() {
    let cocktailDaten = await holeDaten('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a');
    datenDarstellen(cocktailDaten.drinks);
    suche.style.display = 'block';
    zurueckButton.style.display = 'none';
    h1Element.innerText = originalTitle;
}
initialeDatenLaden();

// Funktion zur Darstellung der Cocktails
function datenDarstellen(cocktails) {
    anzeige.innerHTML = '';
    cocktails.forEach(cocktail => {
        let div = document.createElement('div');
        div.classList.add('cocktail-container');

        let image = document.createElement('img');
        image.src = cocktail.strDrinkThumb;
        image.alt = 'Bild von ' + cocktail.strDrink;

        let titel = document.createElement('h2');
        titel.innerText = cocktail.strDrink;

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
    anzeige.innerHTML = '';
    h1Element.innerText = cocktail.strDrink;

    let imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    let detailsContainer = document.createElement('div');
    detailsContainer.className = 'details-container';

    let image = document.createElement('img');
    image.src = cocktail.strDrinkThumb;
    image.alt = 'Bild von ' + cocktail.strDrink;
    image.className = 'detail-image';

    let ingredientsContainer = document.createElement('div');
    ingredientsContainer.className = 'info-container';

    let ingredientsTitle = document.createElement('h3');
    ingredientsTitle.innerText = 'Ingredients';
    ingredientsContainer.appendChild(ingredientsTitle);

    for (let i = 1; i <= 15; i++) {
        let ingredientName = cocktail[`strIngredient${i}`];
        let measurement = cocktail[`strMeasure${i}`];
        if (ingredientName) {
            let ingredientItem = document.createElement('div');
            ingredientItem.innerText = `${measurement || ''} ${ingredientName}`.trim();
            ingredientsContainer.appendChild(ingredientItem);
        }
    }

    let instructionsContainer = document.createElement('div');
    instructionsContainer.className = 'info-container';

    let instructionsTitle = document.createElement('h3');
    instructionsTitle.innerText = 'Instructions';
    instructionsContainer.appendChild(instructionsTitle);

    let instructions = document.createElement('div');
    instructions.innerText = cocktail.strInstructions || 'No instructions available';
    instructionsContainer.appendChild(instructions);

    let glassContainer = document.createElement('div');
    glassContainer.className = 'info-container';

    let glassTitle = document.createElement('h3');
    glassTitle.innerText = 'Glass';
    glassContainer.appendChild(glassTitle);

    let glassType = document.createElement('div');
    glassType.innerText = cocktail.strGlass || 'No glass information available';
    glassContainer.appendChild(glassType);

    imageContainer.appendChild(image);
    detailsContainer.appendChild(ingredientsContainer);
    detailsContainer.appendChild(instructionsContainer);
    detailsContainer.appendChild(glassContainer);

    anzeige.appendChild(imageContainer);
    anzeige.appendChild(detailsContainer);

    suche.style.display = 'none';
    zurueckButton.style.display = 'block';
}

// Zurück-Button konfigurieren
zurueckButton.innerText = 'Zurück';
zurueckButton.onclick = initialeDatenLaden;
document.body.appendChild(zurueckButton);
zurueckButton.style.display = 'none';

// Suchfunktion implementieren
suche.addEventListener('input', async function() {
    let query = suche.value;
    if (query.length > 0) {
        let searchUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + query;
        let gefundeneCocktails = await holeDaten(searchUrl);
        if (gefundeneCocktails.drinks) {
            datenDarstellen(gefundeneCocktails.drinks);
        } else {
            anzeige.innerHTML = '<p>Keine Cocktails gefunden.</p>';
        }
    } else {
        initialeDatenLaden();
    }
});

