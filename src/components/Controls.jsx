export default function Controls ({ startStopText, onStartStop, onReset}) {
    return (
        <div>
            <button id="start_stop" onClick={onStartStop}>
                {startStopText}
            </button>
            <button id="reset" onClick={onReset}>
                Reset
            </button>
        </div>
    );
}