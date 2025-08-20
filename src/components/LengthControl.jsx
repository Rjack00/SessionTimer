export default function LengthControl({label, length, onIncrement, onDecrement}) {
    const idPrefix = label.tolowerCase().split(" ")[0];

    return (
        <div id={`${idPrefix}-length-container`}>
            <div id={`${idPrefix}-label`}>{label}: </div>
            <div id={`${idPrefix}-length`}>{length}</div>
            <button id={`${idPrefix}-increment`} onClick={onIncrement}>+</button>
            <button id={`${idPrefix}-decrement`} onClick={onDecrement}>-</button>
        </div>
    );
}