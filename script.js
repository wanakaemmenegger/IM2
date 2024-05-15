let suche = document.querySelector('#suche');
let anzeige = document.querySelector('#anzeige');
let ueberschrift = document.querySelector('h1');
let zurueckButton = document.createElement('button');
let originalTitel = ueberschrift.innerText; // Originaltitel speichern

// Funktion zum Abrufen von Daten von der API
async function holeDaten(url) {
    try {
        let antwort = await fetch(url);
        return await antwort.json();
    } catch (fehler) {
        console.error('Fehler beim Laden der Daten:', fehler);
    }
}

// Initialdaten laden
async function initialeDatenLaden() {
    let cocktailDaten = await holeDaten('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a');
    datenAnzeigen(cocktailDaten.drinks);
    suche.style.display = 'block';
    zurueckButton.style.display = 'none';
    ueberschrift.innerText = originalTitel;
}
initialeDatenLaden();

// Funktion zur Darstellung der Cocktails
function datenAnzeigen(cocktails) {
    anzeige.innerHTML = '';
    if (!cocktails) return;
    cocktails.forEach(cocktail => {
        let div = document.createElement('div');
        div.classList.add('cocktail-container');

        let bild = document.createElement('img');
        bild.src = cocktail.strDrinkThumb;
        bild.alt = 'Bild von ' + cocktail.strDrink;

        let titel = document.createElement('h2');
        titel.innerText = cocktail.strDrink;

        div.addEventListener('click', () => cocktailDetailsAnzeigen(cocktail));

        div.appendChild(bild);
        div.appendChild(titel);
        anzeige.appendChild(div);
    });
}

// Suchfunktion implementieren
suche.addEventListener('input', async function() {
    let abfrage = suche.value;
    if (abfrage.length > 0) {
        await kombinierteSuche(abfrage);
    } else {
        initialeDatenLaden();
    }
});

async function kombinierteSuche(abfrage) {
    let nameSuchUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + abfrage;
    let zutatSuchUrl = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + abfrage;

    let nameSuchErgebnisse = holeDaten(nameSuchUrl);
    let zutatSuchErgebnisse = holeDaten(zutatSuchUrl);

    let ergebnisse = await Promise.all([nameSuchErgebnisse, zutatSuchErgebnisse]);
    let nameErgebnisse = ergebnisse[0].drinks || [];
    let zutatErgebnisse = ergebnisse[1].drinks || [];

    let kombinierteErgebnisse = [...nameErgebnisse];
    let gesehen = new Set(nameErgebnisse.map(drink => drink.idDrink));

    zutatErgebnisse.forEach(drink => {
        if (!gesehen.has(drink.idDrink)) {
            kombinierteErgebnisse.push(drink);
        }
    });

    if (kombinierteErgebnisse.length > 0) {
        datenAnzeigen(kombinierteErgebnisse);
    } else {
        anzeige.innerHTML = '<p>Keine Cocktails gefunden.</p>';
    }
}

// Funktion zur Anzeige der Cocktail-Details
function cocktailDetailsAnzeigen(cocktail) {
    anzeige.innerHTML = '';
    ueberschrift.innerText = cocktail.strDrink;

    let bildContainer = document.createElement('div');
    bildContainer.className = 'image-container';
    let detailsContainer = document.createElement('div');
    detailsContainer.className = 'details-container';

    let bild = document.createElement('img');
    bild.src = cocktail.strDrinkThumb;
    bild.alt = 'Bild von ' + cocktail.strDrink;
    bild.className = 'detail-bild';

    let zutatenContainer = document.createElement('div');
    zutatenContainer.className = 'info-container';

    let zutatenTitel = document.createElement('h3');
    zutatenTitel.innerText = 'Ingredients';
    zutatenContainer.appendChild(zutatenTitel);

    for (let i = 1; i <= 15; i++) {
        let zutatName = cocktail[`strIngredient${i}`];
        let mass = cocktail[`strMeasure${i}`];
        if (zutatName) {
            let zutatElement = document.createElement('div');
            zutatElement.innerText = `${mass || ''} ${zutatName}`.trim();
            zutatenContainer.appendChild(zutatElement);
        }
    }

    let anleitungContainer = document.createElement('div');
    anleitungContainer.className = 'info-container';

    let anleitungTitel = document.createElement('h3');
    anleitungTitel.innerText = 'Instructions';
    anleitungContainer.appendChild(anleitungTitel);

    let anleitung = document.createElement('div');
    anleitung.innerText = cocktail.strInstructions || 'no instructions available';
    anleitungContainer.appendChild(anleitung);

    let glasContainer = document.createElement('div');
    glasContainer.className = 'info-container';

    let glasTitel = document.createElement('h3');
    glasTitel.innerText = 'Glass Type';
    glasContainer.appendChild(glasTitel);

    let glasTyp = document.createElement('div');
    glasTyp.innerText = cocktail.strGlass || 'Take a glass of your choice';
    glasContainer.appendChild(glasTyp);

    bildContainer.appendChild(bild);
    detailsContainer.appendChild(zutatenContainer);
    detailsContainer.appendChild(anleitungContainer);
    detailsContainer.appendChild(glasContainer);

    anzeige.appendChild(bildContainer);
    anzeige.appendChild(detailsContainer);

    suche.style.display = 'none';
    zurueckButton.style.display = 'block';
}

// Zurück-Button konfigurieren
zurueckButton.innerText = 'Back to search results';
zurueckButton.onclick = initialeDatenLaden;
document.body.appendChild(zurueckButton);
zurueckButton.style.display = 'none';
