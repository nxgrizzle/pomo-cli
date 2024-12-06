import { insertPomo, getDB, updateConfig, getConfig } from "./db.js";
import { timer } from "./timer.js";
import { __dirname, formatDuration } from "./util.js";
import notifier from "node-notifier";
import { join } from "node:path";
const { notify } = notifier;


export const getPomoValues = async (argv) => {
  const config = await getConfig();
  const workTime = argv.work ?? config.work;
  const workBreakTime = argv.break ?? config.break;
  const totalRounds = argv.rounds ?? config.rounds;
  return {
    work: workTime,
    workBreak: workBreakTime,
    rounds: totalRounds,
  };
};

export const updateConfigValues = async (argv) => {
  const config = await getConfig();

  const data = {
    work: argv.work ?? config.work,
    break: argv.Break ?? config.break,
    rounds: argv.rounds ?? config.rounds,
  };
  await updateConfig(data);
};

const writeMessage = (message) => {
  notify({
    title: "Pomo Notification",
    message,
    icon: join(__dirname, "./assets/tomato.png"),
  });
  process.stdout.write(`${message}\n`);
};

export const handleRounds = async (argv) => {
  const { work, workBreak, rounds } = await getPomoValues(argv);
  // for all rounds
  for (let i = 0; i < rounds; i++) {
    process.stdout.write(`Round ${i + 1} of ${rounds} of work\n`);
    writeMessage(`Beginning work cycle. . .`);
    // wait for work to finish
    const wData = await timer(work * 60 * 1000);
    const workData = { ...wData, type: "work" };
    await insertPomo(workData);

    writeMessage(`Beginning break cycle. . .`);
    // wait for the break to finish
    const bData = await timer(workBreak * 60 * 1000);
    const breakData = { ...bData, type: "break" };
    await insertPomo(breakData);
  }
  process.stdout.write("All rounds completed - Good job!")
  process.exit(0);
};

const getPomos = async () => {
  const db = await getDB();
  return db.pomos;
};

// Group Pomodoros by date
const getGroupedPomos = (pomos) => {
  return pomos.groupBy((pomo) => pomo.time.toDateString());
};

// Compute statistics for a list of Pomodoros
const getSessionStats = (pomoList) => {
  const breakList = pomoList.filter((pomo) => pomo.type === "break");
  const workList = pomoList.filter((pomo) => pomo.type === "work");

  const totalWorkTime = workList.reduce((acc, work) => acc + work.duration, 0);
  const totalBreakTime = breakList.reduce(
    (acc, workBreak) => acc + workBreak.duration,
    0
  );

  const avgWorkDuration = totalWorkTime / workList.length || 0;
  const avgBreakDuration = totalBreakTime / breakList.length || 0;

  const longestWorkSession = Math.max(
    ...workList.map((work) => work.duration),
    0
  );
  const longestBreakSession = Math.max(
    ...breakList.map((workBreak) => workBreak.duration),
    0
  );

  return {
    totalWorkTime,
    totalBreakTime,
    avgWorkDuration,
    avgBreakDuration,
    longestWorkSession,
    longestBreakSession,
    totalSessions: pomoList.length,
    totalWorkSessions: workList.length,
    totalBreakSessions: breakList.length,
  };
};

// Format the session statistics into readable output
const formatSessionStats = (date, stats) => {
  const {
    totalWorkTime,
    totalBreakTime,
    avgWorkDuration,
    avgBreakDuration,
    longestWorkSession,
    longestBreakSession,
    totalSessions,
    totalWorkSessions,
    totalBreakSessions,
  } = stats;

  return `On ${date}, ${totalSessions} sessions were had - ${totalWorkSessions} work session${
    totalWorkSessions === 1 ? "" : "s"
  } and ${totalBreakSessions} break session${
    totalBreakSessions === 1 ? "" : "s"
  }.\n
  Total work time: ${formatDuration(
    totalWorkTime
  )}. Total break time: ${formatDuration(totalBreakTime)}\n
  Average work duration: ${formatDuration(
    avgWorkDuration
  )}. Average break time: ${formatDuration(avgBreakDuration)}.\n
  The longest work session on ${date} is ${formatDuration(
    longestWorkSession
  )}.\n
  The longest break session on ${date} is ${formatDuration(
    longestBreakSession
  )}.\n\n`;
};

// Orchestrator function
export const getHistory = async () => {
  const rawPomos = await getPomos();
  const formattedPomos = rawPomos.map((pomo) => {
    const time = new Date(pomo.time);
    return { ...pomo, time };
  });

  const groupedPomos = getGroupedPomos(formattedPomos);

  for (const [date, pomoList] of Object.entries(groupedPomos)) {
    const stats = getSessionStats(pomoList);
    const output = formatSessionStats(date, stats);
    process.stdout.write(output);
  }
};
