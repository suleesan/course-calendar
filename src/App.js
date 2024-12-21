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
import {
  getCalendar,
  getOrCreateCalendarId,
} from "./supabase/calendarFunctions";
import { supabase } from "./supabase/supabase";

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
];

const App = () => {
  // load data from calendar id if opening link
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const calendarId = queryParams.get("id");

    if (calendarId) {
      getCalendar(calendarId)
        .then((data) => {
          if (data) {
            if (
              typeof data === "object" &&
              Object.keys(data).every((key) => quarters.includes(key))
            ) {
              setDataByQuarter(data);
            } else {
              console.error("Invalid calendar data structure:", data);
              alert("Failed to load calendar. Data format is invalid.");
            }
          } else {
            alert("Calendar not found!");
          }
        })
        .catch((error) => {
          console.error("Error loading calendar:", error);
          alert("Failed to load calendar.");
        });
    }
  }, []);

  // else get data from local storage (clean link)
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
      return { ...prevData, [selectedQuarter]: { ...updatedQuarterData } };
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

  async function shareCalendar() {
    const calendarId = getOrCreateCalendarId();

    try {
      const sanitizedData = JSON.parse(JSON.stringify(dataByQuarter));

      const { error } = await supabase.from("calendars").upsert(
        {
          calendar_id: calendarId,
          data: sanitizedData,
        },
        { onConflict: "calendar_id" }
      );

      if (error) {
        console.error("Error sharing calendar:", error);
        return;
      }

      const shareableLink = `${window.location.origin}/?id=${calendarId}`;
      alert(`Your calendar is shareable at this link: ${shareableLink}`);
    } catch (err) {
      console.error("Failed to share calendar:", err);
    }
  }

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
      <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
        <h1>Course Calendar</h1>
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
          }}
        >
          <button
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "10px 20px",
              cursor: "pointer",
            }}
            onClick={shareCalendar}
          >
            Share Calendar
          </button>
        </div>
      </div>
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
