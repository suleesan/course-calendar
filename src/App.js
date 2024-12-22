import React, { useState, useEffect } from "react";
import {
  saveToStorage,
  loadFromStorage,
  initializeDataByQuarter,
  createEvent,
} from "./utils/storage";
import { quarters } from "./components/Quarter";
import { useSharedCalendar } from "./hooks/useSharedCalendar";
import { useQuarterNavigation } from "./hooks/useQuarterNavigation";
import ClassForm from "./components/CalendarInput";
import ClassSchedule from "./components/ClassSchedule";
import EventEditor from "./components/EventEditor";
import Calendar from "./components/Calendar";
import { QuarterSelector, QuarterModal } from "./components/Quarter";
import "./App.css";

const App = () => {
  const [dataByQuarter, setDataByQuarter] = useState(() => {
    const storedData = loadFromStorage("dataByQuarter");
    return initializeDataByQuarter(storedData);
  });

  const [selectedQuarterIndex, cycleQuarter] = useQuarterNavigation();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { isSharedView, sharedDataByQuarter, ownerName, clearSharedView } =
    useSharedCalendar(setDataByQuarter);

  const selectedQuarter = quarters[selectedQuarterIndex];
  const currentQuarterData = isSharedView
    ? sharedDataByQuarter?.[selectedQuarter] || { events: [], formDataList: [] }
    : dataByQuarter[selectedQuarter];

  useEffect(() => {
    if (!isSharedView) {
      saveToStorage("dataByQuarter", dataByQuarter);
    }
  }, [dataByQuarter, isSharedView]);

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
        setSelectedQuarterIndex={(index) => cycleQuarter("set", index)}
      />
      <div className="interface">
        <div style={{ flex: 1.6 }}>
          <ClassForm onAddClass={addClass} />
        </div>
        <div style={{ flex: 2 }}>
          <ClassSchedule
            formDataList={currentQuarterData.formDataList}
            onEventClick={setSelectedEvent}
            clearQuarter={() =>
              updateQuarterData(() => ({ events: [], formDataList: [] }))
            }
            dataByQuarter={dataByQuarter}
            isSharedView={isSharedView}
            goToHome={clearSharedView}
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
