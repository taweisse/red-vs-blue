const fetch = require('node-fetch')
const papa = require('papaparse')
const { google } = require('googleapis')
const secrets = require('./secrets.json')

async function readSheetData() {
    const sheets = google.sheets({
        version: "v4",
        auth: secrets.google.sheets.api_key
    })

    const spreadsheetId = secrets.google.sheets.sheet_id

    const activityRange = "Sheet1!A2:D200"
    const activityRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: activityRange
    })

    const startEndTimeRange = "Sheet1!F2:G2"
    const startEndTimeRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: startEndTimeRange
    })

    const totalsRange = "Sheet1!I2:J2"
    const totalsRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: totalsRange
    })

    var activities = []
    activityRes.data.values.forEach((val, i) => {
        while (val.length < 4) {
            val.push('')
        }

        var total = val[3] == '' ? 10 : Number(val[3])
        var activity = {
            'name': `#${i + 1} ${val[0]} [${total}]`,
            'red': val[1] == '' ? null : Number(val[1]),
            'blue': val[2] == '' ? null : Number(val[2]),
        }

        activities.push(activity)
    })

    totals = {
        'red': totalsRes.data.values[0][0],
        'blue': totalsRes.data.values[0][1]
    }

    // Parse start and end time into a number of seconds since the epoch.
    var startTimeStr = startEndTimeRes.data.values[0][0]
    var endTimeStr = startEndTimeRes.data.values[0][1]

    var now = new Date()
    var year = now.getFullYear()
    var month = String(now.getMonth() + 1).padStart(2, '0')
    var day = String(now.getDate()).padStart(2, '0')

    var startDateTimeStr = `${year}-${month}-${day} ${startTimeStr}`
    var endDateTimeStr = `${year}-${month}-${day} ${endTimeStr}`

    var startDate = new Date(startDateTimeStr)
    var endDate = new Date(endDateTimeStr)

    data = {
        'activities': activities,
        'totals': totals,
        'startTime': startDate.getTime() / 1000,
        'endTime': endDate.getTime() / 1000
    }

    return data
}

async function updateClients(io) {
    try {
        parsed = await readSheetData()
        io.emit('activityData', parsed)
    } catch (err) {
        console.error('Error updating clients: ' + err.message)
    }   
}

module.exports = updateClients;
