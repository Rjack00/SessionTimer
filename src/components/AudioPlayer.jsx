import { forwardRef } from "react";

const AudioPlayer = forwardRef(({ src }, ref) => {
    return (
        <audio
        id="beep"
        ref={ref}
        src={src}
        type="audio/mp3"
        preload="auto"
        />
    );
});

export default AudioPlayer;