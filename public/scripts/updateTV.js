'use strict'

const updater = new WebsocketUpdater()
updater.subscribe('activityData', (data) => {
    document.getElementById('red-bar').style.flex = (data.totals.red > 0 ? data.totals.red : 1)
    document.getElementById('red-score').innerHTML = data.totals.red
    document.getElementById('blue-bar').style.flex = (data.totals.blue > 0 ? data.totals.blue : 1)
    document.getElementById('blue-score').innerHTML = data.totals.blue
})

updater.subscribe('songData', (data) => {
    document.getElementById('song').innerHTML = data.song
    document.getElementById('artist').innerHTML = data.artist
    document.body.style.backgroundImage = `url('${data.artwork}')`;
    console.log(data)
})
