import React, { useState, useEffect } from "react";
import {
  startOfWeek,
  addDays,
  setHours,
  setMinutes,
  differenceInMinutes,
} from "date-fns";
import ClassForm from "./CalendarInput";
import ClassSchedule from "./ClassSchedule";
import EventEditor from "./EventEditor";
import Calendar from "./Calendar";
import "./App.css";

const saveToStorage = (key, data) =>
  localStorage.setItem(key, JSON.stringify(data));

const loadFromStorage = (key) => JSON.parse(localStorage.getItem(key)) || {};

const dayMap = { M: 1, T: 2, W: 3, Th: 4, F: 5 };
const quarters = [
  "Fall 2021-2022",
  "Winter 2021-2022",
  "Spring 2021-2022",
  "Fall 2023-2024",
  "Winter 2023-2024",
  "Spring 2023-2024",
  "Fall 2024-2025",
  "Winter 2024-2025",
  "Spring 2024-2025",
  "Fall 2025-2026",
  "Winter 2025-2026",
  "Spring 2025-2026",
  "Fall 2026-2027",
  "Winter 2026-2027",
  "Spring 2026-2027",
  "Fall 2027-2028",
  "Winter 2027-2028",
  "Spring 2027-2028",
  "Fall 2028-2029",
  "Winter 2028-2029",
  "Spring 2028-2029",
  "Fall 2029-2030",
  "Winter 2029-2030",
  "Spring 2029-2030",
  "Fall 2030-2031",
  "Winter 2030-2031",
  "Spring 2030-2031",
];

const App = () => {
  const [dataByQuarter, setDataByQuarter] = useState(() => {
    const storedData = loadFromStorage("dataByQuarter");
    return Object.keys(storedData).length
      ? storedData
      : quarters.reduce((acc, quarter) => {
          acc[quarter] = { events: [], formDataList: [] };
          return acc;
        }, {});
  });
  const [selectedQuarterIndex, setSelectedQuarterIndex] = useState(7);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const selectedQuarter = quarters[selectedQuarterIndex];
  const currentQuarterData = dataByQuarter[selectedQuarter];

  useEffect(() => {
    saveToStorage("dataByQuarter", dataByQuarter);
  }, [dataByQuarter]);

  // Create event (for calendar)
  const createEvent = ({ id, title, days, startTime, endTime, color }) => {
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

  // Update quarter data, used in addClass, updateClass, deleteClass, clearQuarter
  const updateQuarterData = (updateFn) => {
    setDataByQuarter((prevData) => {
      const updatedQuarterData = updateFn(prevData[selectedQuarter]);
      return { ...prevData, [selectedQuarter]: updatedQuarterData };
    });
  };

  // Add a new class
  const addClass = (data) => {
    if (!Array.isArray(data.days) || data.days.length === 0) {
      console.error("No days selected:", data.days);
      return;
    }

    const newEvents = createEvent(data);
    updateQuarterData((quarterData) => ({
      ...quarterData,
      events: [...quarterData.events, ...newEvents],
      formDataList: [...quarterData.formDataList, data],
    }));
  };

  // Update a class
  const updateClass = (updatedData) => {
    if (!Array.isArray(updatedData.days)) {
      updatedData.days = updatedData.days.split(",");
    }

    updateQuarterData((quarterData) => {
      const updatedFormDataList = quarterData.formDataList.map((formData) =>
        formData.title === updatedData.title ? updatedData : formData
      );
      const updatedEvents = updatedFormDataList.flatMap(createEvent);

      return {
        ...quarterData,
        formDataList: updatedFormDataList,
        events: updatedEvents,
      };
    });
  };

  // Delete a class
  const deleteClass = (title) => {
    updateQuarterData((quarterData) => ({
      ...quarterData,
      events: quarterData.events.filter((event) => event.title !== title),
      formDataList: quarterData.formDataList.filter(
        (formData) => formData.title !== title
      ),
    }));
    setSelectedEvent(null);
  };

  // Clear all classes for the current quarter only
  const clearQuarter = () => {
    updateQuarterData(() => ({ events: [], formDataList: [] }));
  };

  const cycleQuarter = (direction) => {
    setSelectedQuarterIndex((prevIndex) => {
      if (direction === "prev")
        return prevIndex === 0 ? quarters.length - 1 : prevIndex - 1;
      if (direction === "next")
        return prevIndex === quarters.length - 1 ? 0 : prevIndex + 1;
      return prevIndex;
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: "scale(0.75)",
        transformOrigin: "top center",
      }}
    >
      <h1>Course Scheduler</h1>
      <div className="quarter-selector">
        <button className="arrow-button" onClick={() => cycleQuarter("prev")}>
          ←
        </button>
        <h3
          className="quarter-label"
          onClick={() => setModalVisible(true)}
          style={{ cursor: "pointer" }}
        >
          {selectedQuarter}
        </h3>
        <button className="arrow-button" onClick={() => cycleQuarter("next")}>
          →
        </button>
      </div>
      {modalVisible && (
        <div
          className="dropdown-modal-overlay"
          onClick={(e) => {
            if (e.target.className === "dropdown-modal-overlay") {
              setModalVisible(false);
            }
          }}
        >
          <div className="dropdown-modal-content">
            <h2>Select a Quarter</h2>
            <div className="dropdown">
              {quarters.map((quarter, index) => (
                <div
                  key={index}
                  className={`dropdown-item ${
                    index === selectedQuarterIndex ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedQuarterIndex(index);
                    setModalVisible(false);
                  }}
                >
                  {quarter}
                </div>
              ))}
            </div>
            <button
              className="close-button"
              onClick={() => setModalVisible(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="interface">
        <div>
          <ClassForm onAddClass={addClass} />
        </div>
        <div style={{ flex: 3, width: "100%" }}>
          <ClassSchedule
            formDataList={currentQuarterData.formDataList}
            onEventClick={(event) => {
              setSelectedEvent(event);
            }}
            clearQuarter={clearQuarter}
          />
        </div>
      </div>
      <Calendar events={currentQuarterData.events} />
      {selectedEvent && (
        <EventEditor
          event={selectedEvent}
          onUpdate={updateClass}
          onDelete={() => deleteClass(selectedEvent.title)}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default App;
