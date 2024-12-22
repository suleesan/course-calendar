import {
  startOfWeek,
  addDays,
  setHours,
  setMinutes,
  differenceInMinutes,
} from "date-fns";
import { quarters } from "../components/Quarter";

export const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const loadFromStorage = (key) => {
  return JSON.parse(localStorage.getItem(key)) || {};
};

export const initializeDataByQuarter = (storedData) => {
  const initializedData = { ...storedData };

  quarters.forEach((quarter) => {
    if (!initializedData[quarter]) {
      initializedData[quarter] = { events: [], formDataList: [] };
    }
  });

  return initializedData;
};

const dayMap = { M: 1, T: 2, W: 3, Th: 4, F: 5 };
export const createEvent = ({ id, title, days, startTime, endTime, color }) => {
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  return days.map((day) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const dayOffset = dayMap[day] - 1;
    const dayDate = addDays(currentWeekStart, dayOffset);

    const start = setMinutes(
      setHours(new Date(dayDate), startHours),
      startMinutes
    );
    const end = setMinutes(setHours(new Date(dayDate), endHours), endMinutes);

    return {
      id,
      title,
      start,
      end,
      color,
      height: `${differenceInMinutes(end, start) * (40 / 60)}px`,
      day: dayOffset,
    };
  });
};
