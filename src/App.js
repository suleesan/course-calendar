import React, { useState, useEffect } from "react";
import {
  startOfWeek,
  addDays,
  setHours,
  setMinutes,
  differenceInMinutes,
} from "date-fns";
import Calendar from "./Calendar";
import ClassForm from "./CalendarInput";
import ClassSchedule from "./ClassSchedule";
import EventEditor from "./EventEditor";

const saveToStorage = (key, data) =>
  localStorage.setItem(key, JSON.stringify(data));
const loadFromStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];

const dayMap = { M: 1, T: 2, W: 3, Th: 4, F: 5 };

const App = () => {
  const [events, setEvents] = useState([]);
  const [formDataList, setFormDataList] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    setEvents(loadFromStorage("events"));
    setFormDataList(loadFromStorage("formDataList"));
  }, []);

  // Create events for a class (for the calendar)
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

  // Add a new class
  const addClass = (data) => {
    if (!Array.isArray(data.days) || data.days.length === 0) {
      console.error("No days selected:", data.days);
      return;
    }

    const newEvents = createEvent(data);
    setEvents((prev) => {
      const updated = [...prev, ...newEvents];
      saveToStorage("events", updated);
      return updated;
    });

    setFormDataList((prev) => {
      const updated = [...prev, data];
      saveToStorage("formDataList", updated);
      return updated;
    });
  };

  // Update a class
  const updateClass = ({ id, title, days, startTime, endTime, color }) => {
    if (!Array.isArray(days)) {
      days = days.split(",");
    }

    if (days.length === 0) {
      console.error("You must have at least 1 day!");
      return;
    }

    const updatedFormData = { id, title, days, startTime, endTime, color };
    const updatedFormDataList = formDataList.map((formData) =>
      formData.title === title ? updatedFormData : formData
    );

    setFormDataList(updatedFormDataList);
    saveToStorage("formDataList", updatedFormDataList);

    const newEvents = updatedFormDataList.flatMap(createEvent);
    setEvents(newEvents);
    saveToStorage("events", newEvents);
  };

  // Delete a class
  const deleteClass = (title) => {
    const updatedEvents = events.filter((event) => event.title !== title);

    const updatedFormDataList = formDataList.filter(
      (formData) => formData.title !== title
    );

    saveToStorage("events", updatedEvents);
    saveToStorage("formDataList", updatedFormDataList);

    setEvents(updatedEvents);
    setFormDataList(updatedFormDataList);

    setSelectedEvent(null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <h1>Course Scheduler</h1>
      <div style={{ display: "flex", flexDirection: "row", gap: "50px" }}>
        <ClassForm onAddClass={addClass} />
        <ClassSchedule
          formDataList={formDataList}
          onEventClick={setSelectedEvent}
        />
      </div>
      <Calendar events={events} />
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
