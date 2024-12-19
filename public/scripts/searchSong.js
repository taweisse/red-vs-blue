// Define the base URL
const baseUrl = '/detail/song-search';

// Define the query string parameter
const params = new URLSearchParams({ name: 'John' });

document.getElementById('song-search-box').addEventListener('input', (event) => {
    // Search for the current input.
    fetch(`${baseUrl}?${params}`)
    .then((response) => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json(); // Parse the response as JSON.
    })
    .then((data) => {
    console.log('Response data:', data);
    })
    .catch((error) => {
    console.error('Error:', error);
    });
})