import { formatDuration } from "./util.js";
let timerId = null;
let paused = false;
let remainingTime = 0;
let endTime = 0;
let startTime = 0;
const interval = 100;

// Starts or resumes the timer
export const timer = (durationMs) => {
  listenForInput();
  startTime = Date.now();
  endTime = startTime + durationMs;

  return new Promise((resolve) => {
    const updateTimer = () => {
      const timeLeft = endTime - Date.now();

      if (timeLeft <= 0) {
        clearInterval(timerId);
        timerId = null;
        process.stdout.write("\rTimer: 00:00\nTimer ended.");
        resolve({ time: startTime, duration: durationMs }); // Resolve the promise when the timer ends
        return;
      }
      process.stdout.clearLine(0); // Clear current line
      process.stdout.write(`\rTimer: ${formatDuration(timeLeft)}`);
    };

    if (timerId) clearInterval(timerId); // Ensure no overlapping intervals
    timerId = setInterval(updateTimer, interval);
    updateTimer(); // Immediate update
  });
};

// Pauses the timer
export const pauseTimer = () => {
  if (!timerId) return;
  clearInterval(timerId);
  timerId = null;
  paused = true;
  remainingTime = endTime - Date.now();
  process.stdout.clearLine();
  process.stdout.write("\rTimer paused.\n");
};

// Resumes the paused timer
export const resumeTimer = () => {
  if (!paused || remainingTime <= 0) return;
  paused = false;
  timer(remainingTime); // Restart with the remaining time
  process.stdout.clearLine();
  process.stdout.write("\rTimer resumed.\n");
};

export const stopTimer = () => {
  paused = false;
  remainingTime = 0;
  timerId = null;
  clearInterval(timerId);
  process.stdout.clearLine();
  process.stdout.write("\rTimer ended.");
  process.exit();
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
      case "s": // Stop
      case "\u0003":
        stopTimer();
        break;
      default:
        // Ignore unrecognized keys
        break;
    }
  });

  process.stdout.write("Press 'p' to pause, 'r' to resume, or 's' to stop.\n");
};
