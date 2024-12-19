const https = require('https')
const querystring = require('querystring');

const client_id = '505749c539004314a989380054b05574';
const client_secret = 'e86f1475c2aa47b9be1f09929b4809f6';
const refresh_token = 'AQDdVCZ0eiJWP8a3THzDsp904gUORSPplO7mkLQs-gWpve3MdlYVhF55NYZG7xU3o50g0OsUABy8JA9xKNZTskLxbp9seE8Wglpf-mfY6SKZINcaHWV8eILU925OVZev7Y4';
    
var access_token = null;

async function getSpotifyAccessToken(clientId, clientSecret, refreshToken) {
    const tokenUrl = "https://accounts.spotify.com/api/token";
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64"); // Base64 encode clientId:clientSecret
    const postData = querystring.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
    });

    const options = {
        method: "POST",
        hostname: "accounts.spotify.com",
        path: "/api/token",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${credentials}`,
            "Content-Length": Buffer.byteLength(postData),
        },
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                if (res.statusCode === 200) {
                    try {
                        const parsedData = JSON.parse(data);
                        resolve(parsedData.access_token); // Resolve with the new access token.
                    } catch (err) {
                        reject(new Error("Failed to parse response JSON."));
                    }
                } else {
                    reject(new Error(`HTTP error! Status: ${res.statusCode} - ${data}`));
                }
            });
        });

        req.on("error", (err) => {
            reject(err);
        });

        req.write(postData); // Send the request body
        req.end(); // End the request
    });
}

function updateAccessToken() {
    getSpotifyAccessToken(client_id, client_secret, refresh_token)
    .then(token => {
        access_token = token;
        console.log("Updated access token:", access_token)
    })
    .catch(error => {
        console.error("Error updating access token:", error)
    })
}

function updateNowPlaying(io) {
    if (access_token === null) {
        console.log("No access token, cannot update current song!")
        return;
    }

    const options = {
        method: "GET",
        hostname: "api.spotify.com",
        path: "/v1/me/player/currently-playing",
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                if (res.statusCode === 200) {
                    try {
                        const parsedData = JSON.parse(data);
                        var songData = {
                            song: parsedData['item']['name'],
                            artist: parsedData['item']['artists'][0]['name'],
                            album: parsedData['item']['album']['name'],
                            artwork: parsedData['item']['album']['images'][0]['url'],
                            current_ms: parsedData['progress_ms'],
                            total_ms: parsedData['item']['duration_ms']
                        }

                        io.emit('songData', songData)
                    } catch (err) {
                        reject(new Error("Failed to parse response JSON."));
                    }
                } else if (res.statusCode === 204) {
                    io.emit('songData', {})
                }
            });
        });

        req.on("error", (err) => {
            reject(err);
        });

        req.end();
    });
}

function searchSong(search_str) {
    if (access_token === null) {
        console.log("No access token, cannot perform song search!")
        return;
    }

    const params = { q: 'This is a test', market: 'US', type: 'track', limit: '5', offset: '0' };
    const query_string = new URLSearchParams(params).toString();

    const options = {
        method: "GET",
        hostname: "api.spotify.com",
        path: `/v1/search?${query_string}`,
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                if (res.statusCode === 200) {
                    try {
                        const parsedData = JSON.parse(data);
                        searchResults = [];

                        parsedData.tracks.items.forEach((item) => {
                            console.log(item)
                            searchResults.push({
                                name: item.name,
                                artist: item.artists[0].name,
                                artwork: item.album.images[0].url,
                                track_id: item.id
                            })
                        });

                        resolve(searchResults)
                    } catch (err) {
                        reject(new Error("Failed to parse response JSON."));
                    }
                } else {
                    reject(new Error(`Status ${res.statusCode}`))
                }
            });
        });

        req.on("error", (err) => {
            reject(err);
        });

        req.end();
    });
}

updateAccessToken()
setInterval(updateAccessToken, 600000);

module.exports = { updateNowPlaying, searchSong};
