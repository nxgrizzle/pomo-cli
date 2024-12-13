import { formatDuration } from "./util.js";
let timerId = null;
let paused = false;
let remainingTime = 0;
let endTime = 0;
let startTime = 0;
let timerPromiseResolve = null; // To hold the resolve function of the timer promise

const interval = 100;

// Starts or resumes the timer
export const timer = (durationMs) => {
  listenForInput(); // Set up input listener
  startTime = Date.now();
  endTime = startTime + durationMs;
  remainingTime = durationMs;

  return new Promise((resolve) => {
    timerPromiseResolve = resolve;
    startCountdown(); // Begin countdown
  });
};

// Handles the countdown logic
const startCountdown = () => {
  const updateTimer = () => {
    const timeLeft = endTime - Date.now();

    if (timeLeft <= 0) {
      clearInterval(timerId);
      timerId = null;
      process.stdout.write(`\rTimer: ${formatDuration(0)}\nTimer ended.`);
      if (timerPromiseResolve) {
        timerPromiseResolve({ time: startTime, duration: remainingTime });
        timerPromiseResolve = null; // Clean up
      }
      return;
    }
    process.stdout.write(`\rTimer: ${formatDuration(timeLeft)}`);
  };

  if (timerId) clearInterval(timerId); // Ensure no overlapping intervals
  timerId = setInterval(updateTimer, interval);
  updateTimer(); // Immediate update
};

// Pauses the timer
export const pauseTimer = () => {
  if (!timerId || paused) return;
  clearInterval(timerId);
  timerId = null;
  paused = true;
  remainingTime = endTime - Date.now(); // Save remaining time
  process.stdout.clearLine();
  process.stdout.write("\rTimer paused.\n");
  showDirections();
};

// Resumes the paused timer
export const resumeTimer = () => {
  if (!paused || remainingTime <= 0) return;
  paused = false;
  endTime = Date.now() + remainingTime; // Recalculate end time
  process.stdout.clearLine();
  process.stdout.write("\rTimer resumed.\n");
  showDirections();
  startCountdown(); // Restart the countdown
};

// Stops the timer

const clearTimer = () => {
  if (timerId) clearInterval(timerId);
  timerId = null;
  paused = false;
  remainingTime = 0;
};

export const stopTimer = () => {
  clearTimer();
  process.stdout.clearLine();
  process.stdout.write("\rTimer stopped.\n");
  if (timerPromiseResolve) {
    timerPromiseResolve({ time: startTime, duration: 0 }); // Resolve the timer's promise
    timerPromiseResolve = null; // Clean up
  }
  process.exit();
};

export const skipTimer = () => {
  clearTimer();
  process.stdout.clearLine();
  process.stdout.write("\rTimer skipped.\n");
  if (timerPromiseResolve) {
    timerPromiseResolve({ time: startTime, duration: 0, skipped: true }); // Resolve the timer's promise
    timerPromiseResolve = null;
  }
};

// Listen for real-time input (keypress without Enter)
export const listenForInput = () => {
  process.stdin.setRawMode(true);
  process.stdin.resume();

  process.stdin.on("data", (key) => {
    const input = key.toString().toLowerCase();
    switch (input) {
      case "p": // Pause
        pauseTimer();
        break;
      case "r": // Resume
        resumeTimer();
        break;
      case "k": // Skip
        skipTimer();
        break;
      case "s": // Stop
      case "\u0003": // Ctrl+C
        stopTimer();
        break;
      default:
        // Ignore unrecognized keys
        break;
    }
  });
  showDirections();
};

const showDirections = () => {
  const ACTIVE_DIRECTIONS = [
    { prompt: "'p' to pause", condition: !paused },
    { prompt: "'r' to resume", condition: paused },
    { prompt: "'s' to stop", condition: true },
    { prompt: "'k' to skip", condition: true },
  ];
  const stdOutString = ACTIVE_DIRECTIONS.filter(
    (direction) => direction.condition == true
  )
    .map((direction) => direction.prompt)
    .join("\n\t-");
  process.stdout.write(`Press:\n\t-${stdOutString}\n`);
};
