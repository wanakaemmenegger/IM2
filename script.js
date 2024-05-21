let suche = document.querySelector('#suche');
let anzeige = document.querySelector('#anzeige');
let ueberschrift = document.querySelector('h1');
let filterZeile = document.querySelector('.white-bar');
let zurueckButton = document.createElement('button');
zurueckButton.id = 'zurueckButton';
zurueckButton.innerText = 'Back to results';
zurueckButton.style.display = 'none';
document.body.appendChild(zurueckButton);

let headerImage = document.querySelector('#header');
let originalTitel = ueberschrift.innerText; // Originaltitel speichern
let letzteErgebnisse = []; // Speichern der letzten Such- oder Filterergebnisse

// Funktion zum Abrufen von Daten von der API
async function holeDaten(url) {
    try {
        let antwort = await fetch(url);
        if (!antwort.ok) {
            throw new Error(`HTTP-Fehler! Status: ${antwort.status}`);
        }
        return await antwort.json();
    } catch (fehler) {
        console.error('Fehler beim Laden der Daten:', fehler);
    }
}

// Initialdaten laden
async function initialeDatenLaden() {
    headerImage.src = 'img/Cocktail_Finder_Header.jpg'; // Originales Header-Bild setzen
    let cocktailDaten = await holeDaten('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a');
    letzteErgebnisse = cocktailDaten.drinks; // Speichern der Ergebnisse
    datenAnzeigen(cocktailDaten.drinks);
    suche.style.display = 'block';
    zurueckButton.style.display = 'none';
    filterZeile.style.display = 'flex';
    ueberschrift.innerText = originalTitel;
}
initialeDatenLaden();

// Funktion zur Darstellung der Cocktails
function datenAnzeigen(cocktails) {
    anzeige.innerHTML = '';
    if (!cocktails || cocktails.length === 0) {
        anzeige.innerHTML = '<p>No cocktails with this name or ingredients found. Please try again.</p>';
        return;
    }
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
    // "All"-Filter aktivieren
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.filter-btn[data-type="a"]').classList.add('active');
    
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

    letzteErgebnisse = kombinierteErgebnisse; // Speichern der Ergebnisse
    datenAnzeigen(kombinierteErgebnisse);
}

// Funktion zur Anzeige der Cocktail-Details
function cocktailDetailsAnzeigen(cocktail) {
    anzeige.innerHTML = '';
    ueberschrift.innerText = cocktail.strDrink;
    headerImage.src = 'img/Cocktail_Finder_Header_Detail.jpg'; // Detail-Header-Bild setzen

    let bildContainer = document.createElement('div');
    let detailsContainer = document.createElement('div');

    let bild = document.createElement('img');
    bild.src = cocktail.strDrinkThumb;
    bild.alt = 'Bild von ' + cocktail.strDrink;
    bild.className = 'detail-bild';

    let zutatenContainer = document.createElement('div');
    zutatenContainer.className = 'info-container';

    let zutatenTitel = document.createElement('h3');
    zutatenTitel.innerText = 'Ingredients';
    zutatenContainer.appendChild(zutatenTitel);

    console.log('Cocktail Details:', cocktail); // Log the cocktail details

    for (let i = 1; i <= 15; i++) {
        let zutatName = cocktail[`strIngredient${i}`];
        let mass = cocktail[`strMeasure${i}`];
        if (zutatName) {
            let zutatElement = document.createElement('div');
            zutatElement.innerText = `${mass || ''} ${zutatName}`.trim();
            zutatenContainer.appendChild(zutatElement);
        } else {
            console.log(`Ingredient ${i} is missing for ${cocktail.strDrink}`);
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
    detailsContainer.appendChild(zurueckButton); // Zurück-Button hinzufügen
    detailsContainer.appendChild(zutatenContainer);
    detailsContainer.appendChild(anleitungContainer);
    detailsContainer.appendChild(glasContainer);

    anzeige.appendChild(bildContainer);
    anzeige.appendChild(detailsContainer);

    suche.style.display = 'none';
    filterZeile.style.display = 'none'; // Hide the filter buttons
    ueberschrift.innerText = cocktail.strDrink; // Set the cocktail title in the white bar
    zurueckButton.style.display = 'block';
}

// Zurück-Button konfigurieren
zurueckButton.onclick = function() {
    headerImage.src = 'img/Cocktail_Finder_Header.jpg'; // Originales Header-Bild wiederherstellen
    datenAnzeigen(letzteErgebnisse); // Letzte Such- oder Filterergebnisse anzeigen
    suche.style.display = 'block';
    filterZeile.style.display = 'flex'; // Show the filter buttons again
    zurueckButton.style.display = 'none';
    ueberschrift.innerText = originalTitel;
};

// Event-Listener für die Filter-Buttons hinzufügen
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', async function() {
        let filter = this.getAttribute('data-type');
        if (filter === 'a') {
            await initialeDatenLaden();
        } else {
            await filterSuche(filter);
        }
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    });
});

async function filterSuche(filter) {
    let nameSuchUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + filter;
    let zutatSuchUrl = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + filter;

    let nameSuchErgebnisse = holeDaten(nameSuchUrl);
    let zutatSuchErgebnisse = holeDaten(zutatSuchUrl);

    let ergebnisse = await Promise.all([nameSuchErgebnisse, zutatSuchErgebnisse]);
    let nameErgebnisse = ergebnisse[0]?.drinks || [];
    let zutatErgebnisse = ergebnisse[1]?.drinks || [];

    let kombinierteErgebnisse = [...nameErgebnisse];
    let gesehen = new Set(nameErgebnisse.map(drink => drink.idDrink));

    zutatErgebnisse.forEach(drink => {
        if (!gesehen.has(drink.idDrink)) {
            kombinierteErgebnisse.push(drink);
        }
    });

    letzteErgebnisse = kombinierteErgebnisse; // Speichern der Ergebnisse
    datenAnzeigen(kombinierteErgebnisse);
}
