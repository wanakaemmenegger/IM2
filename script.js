let suche = document.querySelector('#suche');
let anzeige = document.querySelector('#anzeige');

//Daten von API holen
async function holeDaten(url) {
    try {
        // wenn daten geladen werden können
        let data = await fetch(url); //1. Warten bis Daten von API zu uns kommen
        return await data.json(); //2. Warten bis Daten in JSON umgewandelt werden
    } catch (e) {
        console.error(e);
        // wenn ein Fehler auftaucht
    }
}

let cocktailDaten = await holeDaten('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a');
console.log(cocktailDaten);

// Funktion um Daten im html darzustellen
function datenDarstellen (cocktails) {
    anzeige.innerHTML = ''; //leert die Anzeige
    cocktails.forEach(cocktail => { 
        let div = document.createElement('div');
        let image = document.createElement('img');
        image.src = cocktail.strDrinkThumb;
        let titel = document.createElement('h2');
        titel.innerText = cocktail.strDrink;
        div.appendChild(titel);
        div.appendChild(image);
        anzeige.appendChild(div);
    })
}

datenDarstellen(cocktailDaten.drinks);
suche.addEventListener('input', function() {
    let ergebnis = suche.value;
})

suche.addEventListener('input', async function() {
    let ergebnis = suche.value;
    let searchUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + ergebnis;
    let cocktails_aus_suche = await holeDaten(searchUrl);
    datenDarstellen(cocktails_aus_suche.drinks); //.drinks weil drinks das Array ist, in dem die Daten liegen
})