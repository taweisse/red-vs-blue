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

    let redSide = 'left'
    let blueSide = 'right'
    if (cols[1].innerHTML.toLowerCase().includes('blue')) {
        blueSide = 'left'
        redSide = 'right'
    }

    return {
        red: redSide,
        blue: blueSide
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

function parseTeam(team, sides, totals, activities) {
    let side = sides[team]

    let parsed = {
        total: totals[side],
        activities: []
    }

    activities.forEach((activity) => {
        parsed.activities.push({
            name: activity.name,
            score: activity[side]
        })
    })

    return parsed
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

    // Combine data from both sides into one object.
    let redData = parseTeam('red', sides, totals, activities)
    let blueData = parseTeam('blue', sides, totals, activities)
    let parsed = {
        red: redData,
        blue: blueData
    }

    return parsed;
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