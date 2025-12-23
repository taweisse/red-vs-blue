
var startTime = null
var endTime = null
var winner = null

function startCountdown() {
    function tick() {
        if (startTime === null || endTime === null) {
            return;
        }

        let countdownElem = document.getElementById('countdown')

        const now = Math.floor(Date.now() / 1000);
        let remaining = startTime - now;
        let gamesRemaining = endTime - now;

        console.log(gamesRemaining)

        if (remaining <= 0) {
            if (gamesRemaining <= 0) {
                winnerElem = document.getElementById('winner-text')
                winnerElem.innerHTML = winner
                winnerElem.style.visibility = 'visible'
                document.getElementById('score-section').style.visibility = 'hidden'
                clearInterval(timerId)
                return;
            }

            countdownElem.style.visibility = 'hidden'
            document.getElementById('score-section').style.visibility = 'visible'
            return;
        } else {
            countdownElem.style.visibility = 'visible'
            document.getElementById('score-section').style.visibility = 'hidden'
        }

        const hours = Math.floor(remaining / 3600);
        remaining %= 3600;
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;

        let timeRemaining = `${String(hours).padStart(2, '0')}:` + `${String(minutes).padStart(2, '0')}:` + `${String(seconds).padStart(2, '0')}`
        document.getElementById('countdown-timer').innerHTML = timeRemaining
    }

    tick();
    const timerId = setInterval(tick, 250);
}

const countdownUpdater = new WebsocketUpdater();
countdownUpdater.subscribe('activityData', (data) => {
    startTime = data.startTime
    endTime = data.endTime
    
    if (data.totals.red === data.totals.blue) {
        winner = "TIE!"
    } else if (data.totals.red < data.totals.blue) {
        winner = "BLUE TEAM WINS!"
    } else {
        winner = "RED TEAM WINS!"
    }
})

startCountdown();
