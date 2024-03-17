const fetchRickMorty = async (url) => {
    try {
        const response = await fetch(url)
        if (!response.ok) {
            console.error('Error al traer los datos');
        }
        const data = await response.json()
        return data
    } catch (error) {
        throw new Error(`No se puede acceder, error: ${error}`)
    }
}

// fetchRickMorty("https://rickandmortyapi.com/api/character?page=1")