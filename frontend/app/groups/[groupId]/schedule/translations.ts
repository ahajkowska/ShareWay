export const scheduleTranslations = {
  pl: {
    schedule: "Harmonogram wyjazdu",
    daysOfTravel: "dni podróży",
    day: "dzień",
    days: "dni",
    addDay: "Dodaj dzień",
    activity: "aktywność",
    activities: "aktywności",
    today: "Dziś",
    dayNumber: "Dzień",
    noDaysPlanned: "Brak zaplanowanych dni",
    addFirstDay: "Dodaj pierwszy dzień aby rozpocząć planowanie",
    addActivity: "Dodaj aktywność",
    tryAgain: "Spróbuj ponownie",
    loadError: "Nie udało się załadować harmonogramu",
    createDayError: "Błąd podczas dodawania dnia",
  },
  en: {
    schedule: "Trip Schedule",
    daysOfTravel: "days of travel",
    day: "day",
    days: "days",
    addDay: "Add Day",
    activity: "activity",
    activities: "activities",
    today: "Today",
    dayNumber: "Day",
    noDaysPlanned: "No planned days",
    addFirstDay: "Add first day to start planning",
    addActivity: "Add Activity",
    tryAgain: "Try Again",
    loadError: "Failed to load schedule",
    createDayError: "Error adding day",
  },
};

export type ScheduleLang = keyof typeof scheduleTranslations;

export function getScheduleTranslations(lang: ScheduleLang = 'pl') {
  return scheduleTranslations[lang];
}