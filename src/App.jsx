import { useState, useEffect, useRef } from 'react'
import DateDisplay from "./components/DateDisplay";
import AudioPlayer from "./components/AudioPlayer";
import Controls from "./components/Controls";
import LengthControl from "./components/LengthControl";
import TimerDisplay from "./components/TimerDisplay";
import './App.css'

export default function App() {
  const defaultSession = 25;
  const defaultBreak = 5;

  const [todaysDate, setTodaysDate] = useState("");
  const [sessionLength, setSessionLength] = useState(defaultSession);
  const [breakLength, setBreakLength] = useState(defaultBreak);
  const [isSession, setIsSession] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(defaultSession * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerAtDefault, setTimerAtDefault] = useState(true);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [startStop, setStartStop] = useState("Start");

  const timerId = useRef(null);
  const beepRef = useRef(null);

  // Date updater
  useEffect(() => {
    const updateDate = () => {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      };
      setTodaysDate(new Date().toLocaleString(undefined, options));
    };
    updateDate();
    const dateInterval = setInterval(updateDate, 10000);
    return () => clearInterval(dateInterval);
  }, []);


  // Start timer
  const startTimer = (duration = timeRemaining) => {
    console.log("duration: ", duration);
    clearInterval(timerId.current);
    setTimerAtDefault(false);
    setIsRunning(true);

    const endTime = Date.now() + duration * 1000;

    timerId.current = setInterval(() => {
      const secondsLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeRemaining(secondsLeft);
      setStartStop("Pause");

      if (secondsLeft <= 0) {
        beepRef.current.play();
        clearInterval(timerId.current);
        setTimeout(switchPeriod, 1000);
      }
    }, 1000);
  };

  // Switch between session/break
  const switchPeriod = () => {
    setIsSession((prevIsSession) => {
      const nextIsSession = !prevIsSession;
      const newTime = nextIsSession ? sessionLength * 60 : breakLength * 60;
      setTimeRemaining(newTime);
      setTimerLabel(nextIsSession ? "Session" : "Break");
      setIsRunning(false); // isn't this already false??
      startTimer(newTime);
      return nextIsSession;
    });
    
  };

  const pauseTimer = () => {
    clearInterval(timerId.current);
    setIsRunning(false);
    setStartStop("Start");
  };

  const resetTimer = () => {
    clearInterval(timerId.current);
    setSessionLength(defaultSession);
    setBreakLength(defaultBreak);
    setTimeRemaining(defaultSession * 60);
    setTimerLabel("Session");
    setIsRunning(false);
    setStartStop("Start");
    setTimerAtDefault(true);
    setIsSession(true);
    beepRef.current.pause();
    beepRef.current.currentTime = 0;
  }

  const handleTimeChange = (type, operation) => {
    if (!timerAtDefault) {
      resetTimer();
      return;
    }
    if ((type === "session" && sessionLength >= 60) || (type === "break" && breakLength >= 60)) {
      const typeTitle = type.charAt(0).toUpperCase() + type.slice(1);
      alert(`${typeTitle} cannot be more than 60`);
      return;
    }
    if (type === "session") {
      const newVal = operation === "increment" ? sessionLength +1 : Math.max(1, sessionLength -1);
      setSessionLength(newVal);
      setTimeRemaining(newVal * 60);
    } else {
      const newVal = operation === "increment" ? breakLength +1: Math.max(1, breakLength -1);
      setBreakLength(newVal);
    }
  }


  return (
    <>
      <DateDisplay todaysDate={todaysDate} />
      <h1>Session & Break Timer</h1>
      <LengthControl
        label="Session Length"
        length={sessionLength}
        onIncrement={() => handleTimeChange("session", "increment")}
        onDecrement={() => handleTimeChange("session", "decrement")}
      />
      <LengthControl 
        label="Break Length"
        length={breakLength}
        onIncrement={() => handleTimeChange("break", "increment")}
        onDecrement={() => handleTimeChange("break", "decrement")}
      />

      <TimerDisplay timerLabel={timerLabel} timeRemaining={timeRemaining} />
      
      <Controls 
        startStopText={startStop}
        onStartStop={!isRunning ? () => startTimer() : pauseTimer}
        onReset={resetTimer}
      />

      <AudioPlayer ref={beepRef} src={"./src/assets/new-notification-08-352461.mp3"} />

    </>
  );
}

