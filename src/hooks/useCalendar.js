import { useMemo } from "react";
import { initializeDataByQuarter, createEvent } from "../utils/storage";
import { coursesByQuarter } from "../courseData";

const generateId = (item, fallbackSeed) => {
  const text = `${item.title || "course"}-${(item.days || []).join("")}-${
    item.startTime || ""
  }-${item.endTime || ""}-${fallbackSeed}`;
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0; // convert to 32bit int
  }
  return Math.abs(hash);
};

export const useCalendar = () => {
  const dataByQuarter = useMemo(() => {
    const initialized = initializeDataByQuarter(coursesByQuarter);
    return Object.fromEntries(
      Object.entries(initialized).map(([quarter, data]) => {
        const formDataList = Array.isArray(data)
          ? data
          : Array.isArray(data?.formDataList)
          ? data.formDataList
          : [];

        const normalizedFormData = formDataList.map((item, index) => {
          const hasValidId = typeof item.id === "number";
          return {
            ...item,
            id: hasValidId ? item.id : generateId(item, index),
          };
        });

        const events = normalizedFormData.flatMap(createEvent);
        return [
          quarter,
          { ...data, formDataList: normalizedFormData, events },
        ];
      })
    );
  }, []);

  const getCurrentQuarterData = (selectedQuarter) =>
    dataByQuarter[selectedQuarter] || { events: [], formDataList: [] };

  return {
    dataByQuarter,
    getCurrentQuarterData,
  };
};
