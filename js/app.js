

let root = document.documentElement;
let maxPokemons = 964;
let maxUsedPokemons = 150;

let typeSlide = 1;
let folderPath = "assets/";
let containers;

const MEDIUM_SIZE = 768;
const SMALL_SIZE = 576;

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

function plusType(n) {
    typeSlide += n;
    if (typeSlide >= typeNames.length) {typeSlide = 0}
    if (typeSlide < 0) {typeSlide = typeNames.length-1}
    resetCarousel();
    updateTypeToShow();
}

function resetCarousel() {
    let carousel = document.getElementsByClassName("carousel-inner")[0];
    while (carousel.firstChild) {
        carousel.removeChild(carousel.firstChild);
    }
}

function updateTypeToShow() {

    let imgFile = typeImgs[typeSlide];
    let newTitle = typeNames[typeSlide].toUpperCase();

    let image = document.getElementsByClassName("card-img")[0];
    image.src = folderPath + imgFile;

    let title = document.getElementsByClassName("type-title")[0];
    title.innerHTML = newTitle; 
    
    getPokemonTypeList();
}

function createCarouselContainersPC(size) {
    
    container = document.getElementsByClassName("carousel-inner")[0];
    let itemsSize = Math.ceil(size/6);
    for (i = 0; i < itemsSize; i++) {
        
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

function createCarouselContainersMobile(size) {
    
    container = document.getElementsByClassName("carousel-inner")[0];
    for (i = 0; i < size/2; i++) {
        
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
    let pageWidth = document.documentElement.clientWidth;
    let isMobile = false;
    if (pageWidth <= SMALL_SIZE) {isMobile=true;}

    if (!isMobile) { column.classList.add("col-md-4");} else {
        column.classList.add("col");
    }
    column.classList.add("my-1");

    let card = `
    <section class="card">
        <img src="${url}" alt="${name}">
        <h3 class="card-title text-center">${name}</h3>
    </section>`;
    column.innerHTML = card;
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
            
            let pageWidth = document.documentElement.clientWidth;
            let isMobile = false;
            if (pageWidth <= SMALL_SIZE) {isMobile=true;}

            if (isMobile) {
                createCarouselContainersMobile(pokemons.length);

                let pag = 0;
                for (i = 0; i < pokemons.length; i++) {
                    p = pokemons[i].pokemon;
                    if (p !== undefined) { 
                        if (i%2 == 0 && i > 0) pag++;
                        let foo = getPokemonInfo(p, pag);
                    }
                } 

            } else {
                createCarouselContainersPC(pokemons.length);

                let pag = 0;
                for (i = 0; i < pokemons.length; i++) {
                    p = pokemons[i].pokemon;
                    if (p !== undefined) { 
                        if (i%6 == 0 && i > 0) pag++;
                        let foo = getPokemonInfo(p, pag);
                    }
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
    let pag = 0;

    let pageWidth = document.documentElement.clientWidth;
    let isMobile = false;
    if (pageWidth <= SMALL_SIZE) {isMobile=true;}

    if (isMobile) {
        createCarouselContainersMobile(maxUsedPokemons);
        for (i = 1; i < maxUsedPokemons; i++) {
            var urlAux = 'https://pokeapi.co/api/v2/pokemon/' + i + '/';
            if (i%2 == 0 && i > 0) pag++;
            let foo = getPokemonInfo({url: "" + urlAux}, pag);
        } 
    } else {
        createCarouselContainersPC(maxUsedPokemons);
        for (i = 1; i < maxUsedPokemons; i++) {
            var urlAux = 'https://pokeapi.co/api/v2/pokemon/' + i + '/';
            if (i%6 == 0 && i > 0) pag++;
            let foo = getPokemonInfo({url: "" + urlAux}, pag);
        } 
    }

    

    return null;
}
async function showPokemon(){
    var inputText= document.getElementById('pokemonInput').value;
    var urlPokemon = 'https://pokeapi.co/api/v2/pokemon/' + inputText;
    fetch(urlPokemon)
    .then(function(response) {
        return response.json();
    })
    .then(function(pokemon) {
        document.getElementById('pokemonTitle').innerText= pokemon.name;
        document.getElementById('pokeImage').src= pokemon.sprites.front_default;
        //pokemon.types[0].type.name;
        $('#pokemonModal').modal() 
    })
    .catch(function(error) {
        $('.toast').toast('show');
    console.log('Hubo un problema con la petición Fetch:' + error.message);
    });
    
}







