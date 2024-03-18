const containerGral = document.getElementById("caja")
const loaderIcons = document.querySelector(".rickmortys-container")
const form = document.getElementById("form")
const searchInput = document.querySelector(".search_input")

//2-Funcion controladora de la app
const appState = {
    currentURL: "https://rickandmortyapi.com/api/character?page=1",
    isFetching: false,
}


//7-template: Esto lo usamos por si tenemos valores mas extenso
const rickMortyTemplate = (character) => {
    return {
        id: character.id,
        name: character.name,
        image: character.image,
        specie: character.species,
        gender: character.gender,
        status: character.status,
        location: character.location.name
    }
}

//6-Crear el personaje en una card html
const createCharacterCard = (character) => {
    const { id, image, name, status, specie, location, gender } = rickMortyTemplate(character)
    return `
     <div class="rickmorty"> 
        <img src="${image}">
        <h2>${name}</h2>
        <span class="specie"> ${specie} </span>
        <div class="tipo-rickmorty ">
            <span class="${gender} spanText"> ${gender} </span>
            <span class="${status} spanText"> ${status} </span>
        </div>
        <p class="location">${location}</p>
        <p class="id-rickmorty">${id}</p>
     </div>
    `
}

//4-Función para renderizar las cards
const renderRickMortyList = (characterList) => {
    containerGral.innerHTML += characterList.map(personaje => createCharacterCard(personaje)).join("")
}

//10-Funcion para mostrar el loader x cantidad de tiempo----
const renderOnScroll = (characterList) => {
    loaderIcons.classList.toggle('show')
    setTimeout(() => {
        loaderIcons.classList.toggle('show')
        renderRickMortyList(characterList)
        appState.isFetching = false;
    }, 1500);
}

//5- Funcion que se encarga de traer la data de los 20 personajes
const getCharacterData = async () => {
    const { info, results } = await fetchRickMorty(appState.currentURL)
    appState.currentURL = info.next;

    const rickMortyUrls = results.map(result => result.url)
    // console.log(rickMortyUrls);

    //? Utilizamos Promise.all: Trae un array nuevo con todo la información que necesitamos y poder renderizar || Resolvemos la promesa de todos los personajes
    const charactersData = await Promise.all(
        rickMortyUrls.map(async (url) => {
            const nextCharactersData = await fetch(url);
            return await nextCharactersData.json()
        })
    )

    // console.log(charactersData);
    return charactersData
}

//3-Funcion para obtener la data a renderizar
const loadAndRenderRickMorty = async (renderRickMortinFun) => {
    const rickMortyData = await getCharacterData()
    renderRickMortinFun(rickMortyData)
}

//9- Funcion para verificar si estamos abajo de todo de la página----
const loadNextCharacters = async () => {
    //scrollTop: Altura total en pixeles que hemos scrolleado
    //clientHeight: Altura total del elemento del html
    //scrollHeight: Altura total del documento
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement
    const bottom = scrollTop + clientHeight >= scrollHeight - 11 //Pa' que llegue antes

    if (bottom && !appState.isFetching) {
        appState.isFetching = true;
        loadAndRenderRickMorty(renderOnScroll)
    }
}

const getCharacterByName = async (e) => {
    const urlName = `https://rickandmortyapi.com/api/character/?name=`
    const value = e.target.value
    const data = await fetchRickMorty(urlName + value)

    containerGral.innerHTML = "";
    renderRickMortyList(data.results);
}

const searchCharacter = (e) => {
    e.preventDefault()
}

const init = () => {
    //cuando cargue la pag haga fetch
    window.addEventListener('DOMContentLoaded', async () => await loadAndRenderRickMorty(renderRickMortyList));
    //8
    window.addEventListener('scroll', async () => await loadNextCharacters())//----


    form.addEventListener('submit', searchCharacter)
    searchInput.addEventListener('keyup', getCharacterByName)
}

init()