'use strict'

const updater = new WebsocketUpdater()
updater.subscribe('data', (data) => {
    document.getElementById('red-bar').style.flex = data.red.total
    document.getElementById('red-score').innerHTML = data.red.total
    document.getElementById('blue-bar').style.flex = data.blue.total
    document.getElementById('blue-score').innerHTML = data.blue.total
})
