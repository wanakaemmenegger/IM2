let suche = document.querySelector('#suche');
let anzeige = document.querySelector('#anzeige');
let ueberschrift = document.querySelector('#page-title');
let cocktailTitle = document.querySelector('#cocktail-title');
let filterZeile = document.querySelector('.white-bar');
let buttonContainer = document.querySelector('#button-container');
let zurueckButton = document.querySelector('#zurueckButton');
let previousButton = document.querySelector('#previousButton');
let nextButton = document.querySelector('#nextButton');
let cocktailTitleContainer = document.querySelector('#cocktail-title-container');

let headerIcon = document.querySelector('.header-icon'); // Logo im Header
let headerText = document.querySelector('.header-text'); // Schriftzug im Header

let headerImage = document.querySelector('#header');
let originalTitel = ueberschrift.innerText; // Originaltitel speichern
let letzteErgebnisse = []; // Speichern der letzten Such- oder Filterergebnisse
let aktuellerIndex = 0; // Speichern des aktuellen Cocktail-Index

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
    buttonContainer.style.display = 'none';
    cocktailTitleContainer.style.display = 'none';
    filterZeile.style.display = 'flex';
    ueberschrift.style.display = 'block';
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
    cocktails.forEach((cocktail, index) => {
        let div = document.createElement('div');
        div.classList.add('cocktail-container');

        let bild = document.createElement('img');
        bild.src = cocktail.strDrinkThumb;
        bild.alt = 'Bild von ' + cocktail.strDrink;

        let titel = document.createElement('h2');
        titel.innerText = cocktail.strDrink;

        div.addEventListener('click', () => {
            aktuellerIndex = index;
            cocktailDetailsAnzeigen(cocktail);
        });

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
    console.log(ergebnisse);
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

// Funktion zur Anzeige der Cocktail-Details
function cocktailDetailsAnzeigen(cocktail) {
    anzeige.innerHTML = '';
    cocktailTitle.innerText = cocktail.strDrink;
    headerImage.src = 'img/Cocktail_Finder_Header_Detail.jpg'; // Detail-Header-Bild setzen

    let detailsBox = document.createElement('div');
    detailsBox.className = 'details-container'; // Set the class for styling

    let bild = document.createElement('img');
    bild.src = cocktail.strDrinkThumb;
    bild.alt = 'Bild von ' + cocktail.strDrink;
    bild.className = 'detail-bild';

    let infoContainer = document.createElement('div');
    infoContainer.className = 'info-container'; // Add info-container class

    let zutatenContainer = document.createElement('div');
    zutatenContainer.className = 'ingredients-list';

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
    anleitungContainer.className = 'instructions-list';
    
    let anleitungTitel = document.createElement('h3');
    anleitungTitel.innerText = 'Instructions';
    anleitungContainer.appendChild(anleitungTitel);
    
    let anleitung = document.createElement('div');
    anleitung.innerText = cocktail.strInstructions || 'no instructions available';
    anleitungContainer.appendChild(anleitung);
    
    let glasContainer = document.createElement('div');
    glasContainer.className = 'glasstype-list';
    
    let glasTitel = document.createElement('h3');
    glasTitel.innerText = 'Glass Type';
    glasContainer.appendChild(glasTitel);
    
    let glasTyp = document.createElement('div');
    glasTyp.innerText = cocktail.strGlass || 'Take a glass of your choice';
    glasContainer.appendChild(glasTyp);
    
    infoContainer.appendChild(zutatenContainer);
    infoContainer.appendChild(anleitungContainer);
    infoContainer.appendChild(glasContainer);
    
    detailsBox.appendChild(bild);
    detailsBox.appendChild(infoContainer);
    
    // Button-Container und Titel über dem Inhalt einfügen
    anzeige.appendChild(buttonContainer);
    buttonContainer.style.display = 'flex';
    anzeige.appendChild(detailsBox);
    
    // Titel und Navigationsbuttons anzeigen
    cocktailTitleContainer.style.display = 'flex';
    
    // Ursprünglichen Titel verbergen
    ueberschrift.style.display = 'none';
    
    suche.style.display = 'none';
    filterZeile.style.display = 'none'; // Hide the filter buttons
    zurueckButton.style.display = 'block';
    
    // Seite nach oben scrollen
    window.scrollTo(0, 0);
}

// Zurück-Button konfigurieren
zurueckButton.onclick = function() {
    headerImage.src = 'img/Cocktail_Finder_Header.jpg'; // Originales Header-Bild wiederherstellen
    datenAnzeigen(letzteErgebnisse); // Letzte Such- oder Filterergebnisse anzeigen
    suche.style.display = 'block';
    filterZeile.style.display = 'flex'; // Show the filter buttons again
    buttonContainer.style.display = 'none';
    cocktailTitleContainer.style.display = 'none';
    ueberschrift.style.display = 'block';
    ueberschrift.innerText = originalTitel;

    // Seite nach oben scrollen zur Startseite
    window.scrollTo(0, 0);
};

// Logo und Schriftzug im Header konfigurieren
headerIcon.onclick = zurueckButton.onclick;
headerText.onclick = zurueckButton.onclick;

// Previous-Button konfigurieren
previousButton.onclick = function() {
    if (letzteErgebnisse.length > 0) {
        aktuellerIndex = (aktuellerIndex - 1 + letzteErgebnisse.length) % letzteErgebnisse.length;
        cocktailDetailsAnzeigen(letzteErgebnisse[aktuellerIndex]);
    }
};

// Next-Button konfigurieren
nextButton.onclick = function() {
    if (letzteErgebnisse.length > 0) {
        aktuellerIndex = (aktuellerIndex + 1) % letzteErgebnisse.length;
        cocktailDetailsAnzeigen(letzteErgebnisse[aktuellerIndex]);
    }
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
