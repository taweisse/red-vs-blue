
var startTime = null
var endTime = null

function startCountdown() {
    function tick() {
        if (startTime === null || endTime === null) {
            return;
        }

        let sectionElem = document.getElementById('countdown')
        let timerElem = document.getElementById('countdown-timer')

        sectionElem.style.visibility = 'visible'

        const now = Math.floor(Date.now() / 1000);
        let remaining = startTime - now;

        if (remaining <= 0) {
            sectionElem.style.visibility = 'hidden'
            document.getElementById('score-section').style.visibility = 'visible'
            clearInterval(timerId);
            return;
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
})

startCountdown();
