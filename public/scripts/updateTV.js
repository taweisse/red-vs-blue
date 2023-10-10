'use strict'

const updater = new WebsocketUpdater()
updater.subscribe('data', (data) => {
    document.getElementById('red-bar').style.flex = data.totals.red
    document.getElementById('red-score').innerHTML = data.totals.red
    document.getElementById('blue-bar').style.flex = data.totals.blue
    document.getElementById('blue-score').innerHTML = data.totals.blue
})
