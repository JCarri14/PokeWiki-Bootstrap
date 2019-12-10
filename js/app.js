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


class PokeType {
    constructor(typeName, pokemons) {
        this.typeName = typeName;
        this.pokemons = pokemons || new Array();
    }

    addPokemon (p) {
        this.pokemons.push(p);
    }
}

let pokeData = new Array();

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

function createCarouselContainers(size) {
    
    container = document.getElementsByClassName("carousel-inner")[0];

    let itemsSize = Math.ceil(size/6);
    for (i = 0; i < size; i++) {
        
        let cItem = document.createElement("SECTION");
        cItem.classList.add("carousel-item");

        if (i == 0) {
            cItem.classList.add("active");
        }
        
        let cCont = document.createElement("SECTION");
        cCont.classList.add("container");

        let row = document.createElement("SECTION");
        row.classList.add("row");
        row.classList.add("row-cols-1");
        row.classList.add("mb-4");
        row.classList.add("pag" + i);

        cCont.appendChild(row);
        cItem.appendChild(cCont);
        container.appendChild(cItem);
    }

}

function createPokemonCard(name, url) {
    let column = document.createElement("SECTION");
    column.classList.add("col-md-4");
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

function getPokemonInfo(pokemon, pagId) {

    fetch(pokemon.url)
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        p = myJson;  
        if (p !== undefined) {
            let page = document.getElementsByClassName("pag" + pagId)[0];
            page.appendChild(createPokemonCard(p.name, p.sprites.front_default));
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
        .then(function(myJson) {
            let pokemons = myJson.pokemon;
            
            createCarouselContainers(pokemons.length);
            
            let pag = 0;
            for (i = 0; i < pokemons.length; i++) {
                p = pokemons[i].pokemon;
                if (p !== undefined) { 
                    if (i%6 == 0 && i > 0) pag++;
                    let foo = getPokemonInfo(p, pag);
                }
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








