let root = document.documentElement;
let maxPokemons = 964;
let maxUsedPokemons = 150;

let typeSlide = 1;
let folderPath = "assets/";
let containers;
let typeNames = ["All", "Fire", "Water", "Electric", "Grass",
"Ice", "Fighting", "Poison", "Ground", "Flying",
"Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark",
"Steel", "Fairy" ];

let typeImgs = ["all.png", "fire.png", "water.png", "electric.png", 
"grass.png", "ice.png", "fighting.png", "poison.png", "ground.png", 
"flying.png", "psychic.png", "bug.png", "rock.png", "ghost.png", 
"dragon.png", "dark.png", "steel.png", "fairy.png" ];

let pokemonData = new Array();

function plusType(n) {
    typeSlide += n;
    if (typeSlide >= typeNames.length) {typeSlide = 0}
    if (typeSlide < 0) {typeSlide = typeNames.length-1}
    updateTypeToShow();
}

function resetCarousel() {
    let carousel = document.getElementsByClassName("carousel-inner")[0];
    while (carousel.firstChild) {
        carousel.removeChild(carousel.firstChild);
    }
    pokemonData = new Array();

}

function updateTypeToShow() {

    let imgFile = typeImgs[typeSlide];
    let newTitle = typeNames[typeSlide].toUpperCase();

    let image = document.getElementsByClassName("card-img")[0];
    image.src = folderPath + imgFile;

    let title = document.getElementsByClassName("type-title")[0];
    title.innerHTML = newTitle; 
    
    resetCarousel();
    getPokemonTypeList();
}

function createCarouselContainers(pokeRows) {

    //let containers = new Array(); // Carousel item
    let structure = "";

    let aux = document.createElement("SECTION");

    let cItem = document.createElement("SECTION");
    cItem.classList.add("carousel-item");
    
    let cCont = document.createElement("SECTION");
    cCont.classList.add("container");

    cItem.appendChild(cCont);
    aux.appendChild(cItem);

    for (i = 0; i < pokeRows.length; i++) {
        if (i%2 == 0) {
            if (i > 0) { 
                structure += aux.innerHTML;
                //containers.push(itm);
            }    
            while(cCont.firstChild) {
                cCont.removeChild(cCont.firstChild);
            }
        }
        cCont.appendChild(pokeRows[i]);
    }
    structure += aux.innerHTML;
    containers = document.createRange().createContextualFragment(structure);
    containers.children[0].classList.add("active");
    return containers.children;
}

function createCarouselRows(pokemonData) {

    let pokeRows = new Array(); // Pokemons rows
    let row = document.createElement("SECTION");
    row.classList.add("row");
    row.classList.add("row-cols-1");
    row.classList.add("mb-4");

    for (i = 0; i < pokemonData.length; i++) {
        if (i%3 == 0) {
            if (i > 0) { pokeRows.push(row);}
            row = document.createElement("SECTION");
            row.classList.add("row");
            row.classList.add("row-cols-1");
            row.classList.add("mb-4");
        }
        row.appendChild(pokemonData[i]);
    }
    pokeRows.push(row);
    return pokeRows;
}

function createPokemonCard(name, url) {
    let column = document.createElement("SECTION");
    column.classList.add("col-lg");
    column.classList.add("my-1");

    let card = `
    <section class="card">
        <img src="${url}" alt="${name}">
        <h3 class="card-title text-center">${name}</h3>
    </section>`;
    column.innerHTML = card;
    //document.createRange().createContextualFragment(card)
    return column;
}

async function getPokemonInfo(pokemon) {

    await fetch(pokemon.url)
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        p = myJson;  
        if (p !== undefined) {
            pokemonData.push(createPokemonCard(p.name, p.sprites.front_default));
        }      
    })
    .catch(function(error) {
    console.log('Hubo un problema con la petición Fetch:' + error.message);
    });
}

function getPokemonTypeList() {
   
    if (typeSlide > 0) {

        var url = 'https://pokeapi.co/api/v2/type/' + 
        typeNames[typeSlide].toLowerCase() + '/';

        fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(async function(myJson) {
            let pokemons = myJson.pokemon;  

            for (i = 0; i < pokemons.length; i++) {
                p = pokemons[i].pokemon;
                if (p !== undefined) { 
                    let foo = await getPokemonInfo(p);
                }
            }        
            let pokeRows = createCarouselRows(pokemonData); // Pokemons row  

            let carContainers = createCarouselContainers(pokeRows);
            
            let inn = document.getElementsByClassName("carousel-inner")[0];
            for (i = 0; i < carContainers.length; i++) {
                inn.appendChild(carContainers[i]);
            }
        })
        .catch(function(error) {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
        });
    } else {
        getAllPokemons();
    }

    return null;
}

async function getAllPokemons() {

    let containerBox = 0;
    let counter = 0;

    for (i = 1; i < maxUsedPokemons; i++) {
        var urlAux = 'https://pokeapi.co/api/v2/pokemon/' + i + '/';
        let foo = await getPokemonInfo({url: "" + urlAux});
    }
      
    let pokeRows = createCarouselRows(pokemonData); // Pokemons row  

    let carContainers = createCarouselContainers(pokeRows);
    
    let inn = document.getElementsByClassName("carousel-inner")[0];
    for (i = 0; i < carContainers.length; i++) {
        inn.appendChild(carContainers[i]);
    }

    return null;
}








