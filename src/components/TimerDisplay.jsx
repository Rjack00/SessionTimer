import "./TimerDisplay.css";

export default function TimerDisplay({timerLabel, timeRemaining}) {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    const formatTime = (num) => (num < 10 ? `0${num}` : num);

    return (
        <div id="timer-container">
            <div id="timer-label">{timerLabel}</div>
            <div id="time-left">
                {`${formatTime(minutes)}:${formatTime(seconds)}`}
            </div>
        </div>
    );
}