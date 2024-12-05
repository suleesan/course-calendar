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

const App = () => {
  const [events, setEvents] = useState([]);
  const [formDataList, setFormDataList] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Load events and raw form data from localStorage
  useEffect(() => {
    const storedEvents = localStorage.getItem("events");
    const storedFormDataList = localStorage.getItem("formDataList");

    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
    if (storedFormDataList) {
      setFormDataList(JSON.parse(storedFormDataList));
    }
  }, []);

  // Day mapping
  const dayMap = {
    M: 1,
    T: 2,
    W: 3,
    Th: 4,
    F: 5,
  };

  // Add class
  const addClass = ({ title, days, startTime, endTime, color }) => {
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

    if (!Array.isArray(days) || days.length === 0) {
      console.error("No days selected:", days);
      return;
    }

    // for classSchedule.js
    const newFormData = { title, days, startTime, endTime, color };
    setFormDataList((prevList) => {
      const updatedList = [...prevList, newFormData];
      localStorage.setItem("formDataList", JSON.stringify(updatedList));
      return updatedList;
    });

    // for calendar.js
    const newEvents = days.map((day) => {
      const [startHours, startMinutes] = startTime.split(":").map(Number);
      const [endHours, endMinutes] = endTime.split(":").map(Number);

      const dayOffset = dayMap[day] - 1;

      const dayDate = addDays(currentWeekStart, dayOffset);

      const start = setMinutes(
        setHours(new Date(dayDate), startHours),
        startMinutes
      );
      const end = setMinutes(setHours(new Date(dayDate), endHours), endMinutes);

      // Calculate duration and height
      const duration = differenceInMinutes(end, start);
      const heightPerMinute = 40 / 60;
      const eventHeight = duration * heightPerMinute;

      return {
        id: Date.now() + Math.random(),
        title,
        start: start,
        end: end,
        color,
        height: `${eventHeight}px`,
        day: dayOffset,
      };
    });

    setEvents((prevEvents) => {
      const updatedEvents = [...prevEvents, ...newEvents];
      localStorage.setItem("events", JSON.stringify(updatedEvents));
      return updatedEvents;
    });
  };

  const updateEvent = (updatedEvent) => {
    // update events array for Calendar.js
    const updatedEvents = events.map((event) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );

    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));

    // update formDataList for ClassSchedule.js
    const updatedFormDataList = formDataList.map((formData) =>
      formData.title === updatedEvent.title &&
      formData.startTime === updatedEvent.startTime &&
      formData.endTime === updatedEvent.endTime
        ? { ...formData, ...updatedEvent }
        : formData
    );

    setFormDataList(updatedFormDataList);
    localStorage.setItem("formDataList", JSON.stringify(updatedFormDataList));

    setSelectedEvent(null);
  };

  // Delete an event
  const deleteEvent = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
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
          onUpdate={updateEvent}
          onDelete={deleteEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default App;
