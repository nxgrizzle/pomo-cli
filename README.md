# Pomodoro CLI
A Command Line Interface (CLI) tool to help you manage your time effectively using the Pomodoro Technique. With this tool, you can configure, start, and view statistics about your Pomodoro sessions directly from the terminal.

## Features
- Start a customizable Pomodoro timer session with configurable work, break, and round durations.
- View statistics about previous Pomodoro cycles.
- Set default configuration values for work, break, and round durations.


## Usage
Run the CLI tool with the following commands:

start
Start a Pomodoro session with custom or default values.

```pomo start [options]```

Options:

--work, -w (optional): Duration of the work period in minutes.
--break, -b (optional): Duration of the break period in minutes.
--rounds, -r (optional): Number of Pomodoro cycles.

Example:

```pomo start -w 25 -b 5 -r 4```

history
Display statistics about previous Pomodoro cycles.

```pomo history```

config
Set default values for work, break, and round durations.

```pomo config [options]```

Options:

--work, -w: Default duration of the work period in minutes.
--break, -b: Default duration of the break period in minutes.
--rounds, -r: Default number of Pomodoro cycles.

Example:

```pomo config -w 25 -b 5 -r 4```

reset-config
Reset the default configuration values to their initial state.

```pomo reset-config```

## License
This project is licensed under the MIT License.