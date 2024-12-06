import { fileURLToPath } from "url";
import { dirname } from "path";
// Get the directory of the current module
export const DEFAULT_CONFIG_VALUES = { work: 25, break: 5, rounds: 4 };
export const DEFAULT_DB = {
  config:DEFAULT_CONFIG_VALUES,
  pomos:[]
}
export const __dirname = dirname(fileURLToPath(import.meta.url));
export const formatDuration = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000); // Convert ms to seconds
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  // Format hours, minutes, and seconds with leading zeros
  const formattedHrs = hrs > 0 ? `${hrs}:` : "";
  const formattedMins = `${hrs > 0 ? String(mins).padStart(2, "0") : mins}:`;
  const formattedSecs = String(secs).padStart(2, "0");

  return `${formattedHrs}${formattedMins}${formattedSecs}`;
};
