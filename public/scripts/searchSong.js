document.getElementById('song-search-button').addEventListener('click', (event) => {
    searchStr = document.getElementById('song-search-box').value
    searchSong(searchStr)
})

document.getElementById('song-search-box').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchSong(event.target.value);
    }
});

function searchSong(searchStr) {
    const params = new URLSearchParams({ string: searchStr });

    fetch(`/detail/song-search?${params}`)
    .then((response) => {
        if (!response.ok) {
            return response.json({error: "response not ok"})
        }
        populateResults(response.json())
    })
    .catch((error) => {
        return response.json({error: "error in request"})
    });
}

function populateResults(results) {
    console.log(results)
}
