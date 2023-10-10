const https = require('https')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const address = 'https://docs.google.com/spreadsheets/d/1eRZ2XRWsTXAz9iUjMNHXZsOKUowm2Tf22ljts8zQ008/htmlview'

function parseTotals(row) {
    let cols = row.querySelectorAll('td')
    
    let left = cols[1].innerHTML
    let right = cols[2].innerHTML

    return {
        left: left,
        right: right
    }
}

function parseSides(row) {
    let cols = row.querySelectorAll('td')

    let leftSide = 'red'
    let rightSide = 'blue'
    if (cols[1].innerHTML.toLowerCase().includes('blue')) {
        leftSide = 'blue'
        rightSide = 'red'
    }

    return {
        left: leftSide,
        right: rightSide
    }
}

function parseActivity(row) {
    let cols = row.querySelectorAll('td')
    
    let name = cols[0].innerHTML
    let leftScore = cols[1].innerHTML
    let rightScore = cols[2].innerHTML

    return {
        name: name,
        left: leftScore,
        right: rightScore
    }
}

function compileData(sides, totals, activities) {
    let compiled = {
        totals: {},
        activities: []
    }

    compiled.totals[sides['left']] = totals['left']
    compiled.totals[sides['right']] = totals['right']

    activities.forEach((activity) => {
        let newActivity = {
            name: activity.name
        }

        newActivity[sides['left']] = activity['left']
        newActivity[sides['right']] = activity['right']

        compiled.activities.push(newActivity)
    })

    return compiled
}

function parseData(data) {
    var totals = {};
    var sides = {};
    var activities = [];
    var activitiesFlag = false;

    var dom = new JSDOM(data)
    var table = dom.window.document.querySelectorAll('table tbody tr')
    table.forEach((row) => {
        if (row.querySelector('td').innerHTML.toLowerCase() === 'totals') {
            totals = parseTotals(row)
        } else if (row.querySelector('td').innerHTML.toLowerCase() === "activity") {
            sides = parseSides(row)
            activitiesFlag = true
        } else if (activitiesFlag === true) {
            activities.push(parseActivity(row))
        }
    })

    return compileData(sides, totals, activities)
}

function updateClients(io) {
    https.get(address, (resp) => {
        let data = ''

        resp.on('data', (chunk) => {
            data += chunk
        })

        resp.on('end', () => {
            parsed = parseData(data)
            io.emit('data', parsed)
        })
    })
    .on('error', (err) => {
        console.error('Error updating clients: ' + err.message)
    })
}

module.exports = updateClients;