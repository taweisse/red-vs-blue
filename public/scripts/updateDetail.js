'use strict'

const updater = new WebsocketUpdater()
updater.subscribe('data', (data) => {

    console.log(data)

    const table = document.getElementById('activities')
    
    data.activities.forEach((activity) => {
        
    })
})
