import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { getHistory, handleRounds, updateConfigValues } from "./pomo.js";
import { DEFAULT_CONFIG_VALUES } from "./util.js";
yargs(hideBin(process.argv))
  .command(
    "start",
    "start a pomodoro session",
    () => {},
    async (argv) => {
      await handleRounds(argv);
    }
  )
  .option("work", {
    alias: "w",
    type: "string",
    description: "duration of the work period in minutes",
  })

  .option("break", {
    alias: "b",
    type: "string",
    description: "duration of the break period in minutes",
  })
  .option("rounds", {
    alias: "r",
    type: "string",
    description: "number of pomodoro cycles",
  })
  .command(
    "history",
    "show statistics about previous pomo cycles",
    () => {},
    async () => {
      await getHistory()
    }
  )
  .command(
    "config",
    "set the default work/break/rounds to use when using 'pomo start' ",
    () => {},
    async (argv) => {
      await updateConfigValues(argv);
    }
  )
  .option("work", {
    alias: "w",
    type: "string",
    description: "duration of the work period",
  })

  .option("break", {
    alias: "b",
    type: "string",
    description: "duration of the break period",
  })
  .option("rounds", {
    alias: "r",
    type: "string",
    description: "number of pomodoro cycles",
  })
  .command(
    "reset-config",
    "reset the number of work/break/rounds in the config to the default",
    () => {},
    async () => {
      await updateConfigValues(DEFAULT_CONFIG_VALUES)
    }
  )
  .demandCommand(1)
  .parse();
