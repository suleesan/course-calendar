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
import { quarters, QuarterSelector, QuarterModal } from "./Quarter";
import "./App.css";
import { getCalendar } from "./supabase/calendarFunctions";

const saveToStorage = (key, data) =>
  localStorage.setItem(key, JSON.stringify(data));

const loadFromStorage = (key) => JSON.parse(localStorage.getItem(key)) || {};

const dayMap = { M: 1, T: 2, W: 3, Th: 4, F: 5 };

const App = () => {
  // add new quarters that i forgot (keep for future errors / quarter updates to avoid disrupting localStorage)
  const initializeDataByQuarter = (storedData) => {
    const initializedData = { ...storedData };

    quarters.forEach((quarter) => {
      if (!initializedData[quarter]) {
        initializedData[quarter] = { events: [], formDataList: [] };
      }
    });

    return initializedData;
  };

  // get quarter data from storage
  const [dataByQuarter, setDataByQuarter] = useState(() => {
    const storedData = loadFromStorage("dataByQuarter");
    return initializeDataByQuarter(storedData);
  });
  const [selectedQuarterIndex, setSelectedQuarterIndex] = useState(7);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // for quarter dropdown selection
  const [isSharedView, setIsSharedView] = useState(false); // for shared calendar
  const [ownerName, setOwnerName] = useState("");

  const selectedQuarter = quarters[selectedQuarterIndex];
  const currentQuarterData = dataByQuarter[selectedQuarter];

  useEffect(() => {
    saveToStorage("dataByQuarter", dataByQuarter);
  }, [dataByQuarter]);

  // get calendar from id if loading calendar from shared link
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const calendarId = queryParams.get("id");

    if (calendarId) {
      setIsSharedView(true);
      getCalendar(calendarId)
        .then((data) => {
          if (data) {
            if (
              typeof data.data === "object" &&
              Object.keys(data.data).every((key) => quarters.includes(key))
            ) {
              setDataByQuarter(data.data);
              setOwnerName(data.name || "");
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
    } else {
      setIsSharedView(false);
      setOwnerName("");
    }
  }, []);

  const goToHome = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("id");
    window.history.replaceState({}, document.title, url.toString());
    window.location.reload(); // get back to user's own calendar
  };

  const updateQuarterData = (updateFn) => {
    setDataByQuarter((prevData) => {
      const updatedQuarterData = updateFn(prevData[selectedQuarter]);
      return { ...prevData, [selectedQuarter]: { ...updatedQuarterData } };
    });
  };

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

  const updateClass = (updatedData) => {
    if (!Array.isArray(updatedData.days)) {
      updatedData.days = updatedData.days.split(",");
    }

    updateQuarterData((quarterData) => {
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
  };

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
    <div className="container">
      <h1>
        {isSharedView && ownerName ? `${ownerName}'s ` : ""}Course Calendar
      </h1>
      <QuarterSelector
        selectedQuarter={selectedQuarter}
        onCycle={cycleQuarter}
        onOpenModal={() => setModalVisible(true)}
      />
      <QuarterModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        quarters={quarters}
        selectedQuarterIndex={selectedQuarterIndex}
        setSelectedQuarterIndex={setSelectedQuarterIndex}
      />
      <div className="interface">
        <div style={{ flex: 1.6 }}>
          <ClassForm onAddClass={addClass} />
        </div>
        <div style={{ flex: 2 }}>
          <ClassSchedule
            formDataList={currentQuarterData.formDataList}
            onEventClick={(event) => {
              setSelectedEvent(event);
            }}
            clearQuarter={clearQuarter}
            dataByQuarter={dataByQuarter}
            isSharedView={isSharedView}
            goToHome={goToHome}
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
