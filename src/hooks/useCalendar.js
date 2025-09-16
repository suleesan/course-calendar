import { useState, useEffect, useCallback } from "react";
import {
  saveToStorage,
  loadFromStorage,
  initializeDataByQuarter,
  createEvent,
} from "../utils/storage";
import { autoSaveCalendar } from "../supabase/calendarFunctions";
import { quarters } from "../components/Quarter";

export const useCalendar = (isSharedView = false) => {
  const [dataByQuarter, setDataByQuarter] = useState(() => {
    const storedData = loadFromStorage("dataByQuarter");
    return initializeDataByQuarter(storedData);
  });

  const [selectedEvent, setSelectedEvent] = useState(null);

  // save to both supabase and localStorage
  useEffect(() => {
    if (!isSharedView) {
      saveToStorage("dataByQuarter", dataByQuarter);
      autoSaveCalendar(dataByQuarter);
    }
  }, [dataByQuarter, isSharedView]);

  // update the entire quarter data
  const updateQuarterData = useCallback((selectedQuarter, updateFn) => {
    setDataByQuarter((prevData) => {
      const updatedQuarterData = updateFn(prevData[selectedQuarter]);
      return { ...prevData, [selectedQuarter]: { ...updatedQuarterData } };
    });
  }, []);

  // add new class
  const addClass = useCallback(
    (data, selectedQuarter) => {
      if (!Array.isArray(data.days) || data.days.length === 0) {
        console.error("No days selected:", data.days);
        return;
      }

      const newEvents = createEvent(data);
      updateQuarterData(selectedQuarter, (quarterData) => ({
        ...quarterData,
        events: [...quarterData.events, ...newEvents],
        formDataList: [...quarterData.formDataList, data],
      }));
    },
    [updateQuarterData]
  );

  // update existing class
  const updateClass = useCallback(
    (updatedData, selectedQuarter) => {
      updateQuarterData(selectedQuarter, (quarterData) => {
        const updatedFormDataList = quarterData.formDataList.map((formData) =>
          formData.id === updatedData.id ? updatedData : formData
        );

        const updatedEvents = updatedFormDataList.flatMap(createEvent);

        return {
          ...quarterData,
          formDataList: updatedFormDataList,
          events: updatedEvents,
        };
      });
    },
    [updateQuarterData]
  );

  // delete a class
  const deleteClass = useCallback(
    (title, selectedQuarter) => {
      updateQuarterData(selectedQuarter, (quarterData) => ({
        ...quarterData,
        events: quarterData.events.filter((event) => event.title !== title),
        formDataList: quarterData.formDataList.filter(
          (formData) => formData.title !== title
        ),
      }));
      setSelectedEvent(null);
    },
    [updateQuarterData]
  );

  // clear ALL classes from selected quarter
  const clearQuarter = useCallback(
    (selectedQuarter) => {
      updateQuarterData(selectedQuarter, () => ({
        events: [],
        formDataList: [],
      }));
    },
    [updateQuarterData]
  );

  // get current quarter data
  const getCurrentQuarterData = useCallback(
    (selectedQuarter, sharedDataByQuarter, isSharedView) => {
      return isSharedView
        ? sharedDataByQuarter?.[selectedQuarter] || {
            events: [],
            formDataList: [],
          }
        : dataByQuarter[selectedQuarter];
    },
    [dataByQuarter]
  );

  return {
    dataByQuarter,
    setDataByQuarter, // Expose the setter for useSharedCalendar
    selectedEvent,
    setSelectedEvent,
    addClass,
    updateClass,
    deleteClass,
    clearQuarter,
    getCurrentQuarterData,
  };
};
