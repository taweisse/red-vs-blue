'use strict'

const updater = new WebsocketUpdater();
updater.subscribe('activityData', (data) => {
    const table = document.getElementById('activities');
    table.innerHTML = '';

    data.activities.forEach((activity) => {
        let redScore = document.createElement('td');
        redScore.classList.add('red-score');
        redScore.innerHTML = activity.red;

        let blueScore = document.createElement('td');
        blueScore.classList.add('blue-score');
        blueScore.innerHTML = activity.blue;

        let activityName = document.createElement('td');
        activityName.classList.add('activity-name');
        activityName.innerHTML = activity.name;

        // Cross out activities that both teams have completed.
        if (! isNaN(activity.red) && ! isNaN(activity.blue)) {
            activityName.classList.add('strike');
        }

        let newRow = document.createElement('tr');
        newRow.appendChild(redScore);
        newRow.appendChild(activityName);
        newRow.appendChild(blueScore);

        table.appendChild(newRow);
    });

    document.getElementById('song-suggest').style.visibility = 'visible';
})
