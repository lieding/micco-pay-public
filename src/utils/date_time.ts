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

export function getDateAndPeriodInfo () {
  const date = new Date();
  const monthStr = formateMonth(date.getMonth()),
    yearStr = date.getFullYear(),
    weekdayStr = formatWeekDay(date.getDay()),
    period = formatTime(date);
  return `${date.getDate()} ${monthStr} ${yearStr}, ${weekdayStr} ${period}`;
}