document.addEventListener('DOMContentLoaded', function() {
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

    let headerIcon = document.querySelector('.header-icon');
    let headerText = document.querySelector('.header-text');

    let headerImage = document.querySelector('#header');
    let originalTitel = ueberschrift.innerText;
    let letzteErgebnisse = [];
    let aktuellerIndex = 0;

    const searchWrapper = document.querySelector('.search-wrapper');
    const detailView = document.querySelector('.details-container');

    if (detailView) {
        searchWrapper.style.display = 'none';
    } else {
        searchWrapper.style.display = 'block';
    }

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

    async function initialeDatenLaden() {
        headerImage.src = 'img/Cocktail_Finder_Header.jpg';
        let cocktailDaten = await holeDaten('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a');
        letzteErgebnisse = cocktailDaten.drinks;
        datenAnzeigen(cocktailDaten.drinks);
        suche.style.display = 'block';
        buttonContainer.style.display = 'none';
        cocktailTitleContainer.style.display = 'none';
        filterZeile.style.display = 'flex';
        ueberschrift.style.display = 'block';
        ueberschrift.innerText = originalTitel;
        previousButton.style.display = 'none';
        nextButton.style.display = 'none';
    }
    initialeDatenLaden();

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

        fillGrid();
    }

    function fillGrid() {
        const items = anzeige.children.length;
        const emptyItems = (6 - (items % 6)) % 6;

        const existingEmptyItems = document.querySelectorAll('.empty-grid-item');
        existingEmptyItems.forEach(item => item.remove());

        if (emptyItems !== 0) {
            for (let i = 0; i < emptyItems; i++) {
                const emptyDiv = document.createElement('div');
                emptyDiv.classList.add('empty-grid-item');
                anzeige.appendChild(emptyDiv);
            }
        }
    }

    suche.addEventListener('input', async function() {
        let abfrage = suche.value;
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
        let nameErgebnisse = ergebnisse[0]?.drinks || [];
        let zutatErgebnisse = ergebnisse[1]?.drinks || [];

        let kombinierteErgebnisse = [...nameErgebnisse];
        let gesehen = new Set(nameErgebnisse.map(drink => drink.idDrink));

        zutatErgebnisse.forEach(drink => {
            if (!gesehen.has(drink.idDrink)) {
                kombinierteErgebnisse.push(drink);
            }
        });

        letzteErgebnisse = kombinierteErgebnisse;
        datenAnzeigen(kombinierteErgebnisse);
    }

    function cocktailDetailsAnzeigen(cocktail) {
        anzeige.innerHTML = '';
        cocktailTitle.innerText = cocktail.strDrink;
        headerImage.src = 'img/Cocktail_Finder_Header_Detail.jpg';

        let detailsBox = document.createElement('div');
        detailsBox.className = 'details-container';

        let bild = document.createElement('img');
        bild.src = cocktail.strDrinkThumb;
        bild.alt = 'Bild von ' + cocktail.strDrink;
        bild.className = 'detail-bild';

        let infoContainer = document.createElement('div');
        infoContainer.className = 'info-container';

        let zutatenContainer = document.createElement('div');
        zutatenContainer.className = 'ingredients-list';

        let zutatenTitel = document.createElement('h3');
        zutatenTitel.innerText = 'Ingredients';
        zutatenContainer.appendChild(zutatenTitel);

        let ingredientsAvailable = false;

        for (let i = 1; i <= 15; i++) {
            let zutatName = cocktail[`strIngredient${i}`];
            let mass = cocktail[`strMeasure${i}`];
            if (zutatName) {
                let zutatElement = document.createElement('div');
                zutatElement.innerText = `${mass || ''} ${zutatName}`.trim();
                zutatenContainer.appendChild(zutatElement);
                ingredientsAvailable = true;
            }
        }

        if (!ingredientsAvailable) {
            let noIngredientsMessage = document.createElement('div');
            noIngredientsMessage.innerText = 'No ingredients available';
            zutatenContainer.appendChild(noIngredientsMessage);
        }

        let anleitungContainer = document.createElement('div');
        anleitungContainer.className = 'instructions-list';

        let anleitungTitel = document.createElement('h3');
        anleitungTitel.innerText = 'Instructions';
        anleitungContainer.appendChild(anleitungTitel);

        let anleitung = document.createElement('div');
        anleitung.innerText = cocktail.strInstructions || 'No instructions available';
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

        anzeige.appendChild(buttonContainer);
        buttonContainer.style.display = 'flex';
        anzeige.appendChild(detailsBox);

        cocktailTitleContainer.style.display = 'flex';

        ueberschrift.style.display = 'none';

        suche.style.display = 'none';
        searchWrapper.style.display = 'none';
        filterZeile.style.display = 'none';
        zurueckButton.style.display = 'block';

        previousButton.style.display = 'block';
        nextButton.style.display = 'block';

        window.scrollTo(0, 0);
    }

    zurueckButton.onclick = function() {
        headerImage.src = 'img/Cocktail_Finder_Header.jpg';
        datenAnzeigen(letzteErgebnisse);
        suche.style.display = 'block';
        searchWrapper.style.display = 'block';
        filterZeile.style.display = 'flex';
        buttonContainer.style.display = 'none';
        cocktailTitleContainer.style.display = 'none';
        ueberschrift.style.display = 'block';
        ueberschrift.innerText = originalTitel;

        previousButton.style.display = 'none';
        nextButton.style.display = 'none';

        window.scrollTo(0, 0);
    };

    headerIcon.onclick = zurueckButton.onclick;
    headerText.onclick = zurueckButton.onclick;

    previousButton.onclick = function() {
        if (letzteErgebnisse.length > 0) {
            aktuellerIndex = (aktuellerIndex - 1 + letzteErgebnisse.length) % letzteErgebnisse.length;
            cocktailDetailsAnzeigen(letzteErgebnisse[aktuellerIndex]);
        }
    };

    nextButton.onclick = function() {
        if (letzteErgebnisse.length > 0) {
            aktuellerIndex = (aktuellerIndex + 1) % letzteErgebnisse.length;
            cocktailDetailsAnzeigen(letzteErgebnisse[aktuellerIndex]);
        }
    };

    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', async function() {
            suche.value = '';

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

    document.querySelector('.clear-icon').addEventListener('click', function() {
        suche.value = '';
        suche.focus();
        initialeDatenLaden();
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

        letzteErgebnisse = kombinierteErgebnisse;
        datenAnzeigen(kombinierteErgebnisse);
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            previousButton.click();
        } else if (event.key === 'ArrowRight') {
            nextButton.click();
        }
    });

    function updatePlaceholder() {
        if (window.innerWidth <= 400) {
            suche.placeholder = 'Search';
        } else if (window.innerWidth <= 1000) {
            suche.placeholder = 'Search for cocktail';
        } else {
            suche.placeholder = 'Search for cocktail or ingredient';
        }
    }

    updatePlaceholder();

    window.addEventListener('resize', updatePlaceholder);
});
