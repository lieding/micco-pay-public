const MonthsInFrench = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
export function formateMonth(monthNum: number): string {
  return MonthsInFrench[Math.min(11, monthNum)];
}

function formateMonthInShort(monthNum: number): string {
  const monthStr = MonthsInFrench[Math.min(11, monthNum)];
  if (monthStr.startsWith('Jui'))
    return monthStr.slice(0, 4);
  return monthStr.slice(0, 3);
}

const DatePeriods = {
  matin: "matin",
  midi: "midi",
  apresMidi: "après-midi",
  soir: "soir",
};

const WeekDayInFrench = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

export function formatWeekDay(day: number) {
  return WeekDayInFrench[Math.min(day, 6)];
}

export function formatTime(date: Date): string {
  const hourInNumner = date.getHours();
  if (hourInNumner > 6 && hourInNumner < 12) return DatePeriods.matin;
  else if (hourInNumner >= 12 && hourInNumner <= 13) return DatePeriods.midi;
  else if (hourInNumner > 13 && hourInNumner < 18)
    return DatePeriods.apresMidi;
  return DatePeriods.soir;
}

export function formatDate (date: Date) {
  const monthStr = formateMonthInShort(date.getMonth());
  const dateStr = date.getDate().toString().padStart(2, '0');

  return `${monthStr} ${dateStr}, ${formatWeekDay(date.getDay())}`;
}

export function getDateAndPeriodInfo () {
  const date = new Date();
  const monthStr = formateMonth(date.getMonth()),
    yearStr = date.getFullYear(),
    weekdayStr = formatWeekDay(date.getDay()),
    period = formatTime(date);
  return `${date.getDate()} ${monthStr} ${yearStr}, ${weekdayStr} ${period}`;
}

const DayTimeDelta = 1000 * 3600 * 24;

export function deltaDays (date: Date, days = 7) {
  const timestamp = date.getTime() + DayTimeDelta * days;
  return new Date(timestamp);
}