import React, { useState } from "react";
import { quarters } from "./components/Quarter";
import { useSharedCalendar } from "./hooks/useSharedCalendar";
import { useQuarterNavigation } from "./hooks/useQuarterNavigation";
import { useCalendar } from "./hooks/useCalendar";
import ClassForm from "./components/CalendarInput";
import ClassSchedule from "./components/ClassSchedule";
import EventEditor from "./components/EventEditor";
import Calendar from "./components/Calendar";
import ShareCalendar from "./components/ShareCalendar";
import { QuarterSelector, QuarterModal } from "./components/Quarter";
import "./App.css";
import { FiHome } from "react-icons/fi";

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuarterIndex, cycleQuarter] = useQuarterNavigation();

  const {
    dataByQuarter,
    setDataByQuarter, // Get the setter from useCalendar
    selectedEvent,
    setSelectedEvent,
    addClass,
    updateClass,
    deleteClass,
    clearQuarter,
    getCurrentQuarterData,
  } = useCalendar();

  const { isSharedView, sharedDataByQuarter, ownerName, clearSharedView } =
    useSharedCalendar(setDataByQuarter); // Pass the setter

  const selectedQuarter = quarters[selectedQuarterIndex];
  const currentQuarterData = getCurrentQuarterData(
    selectedQuarter,
    sharedDataByQuarter,
    isSharedView
  );

  const handleAddClass = (data) => {
    addClass(data, selectedQuarter);
  };

  const handleUpdateClass = (updatedData) => {
    updateClass(updatedData, selectedQuarter);
  };

  const handleDeleteClass = (title) => {
    deleteClass(title, selectedQuarter);
  };

  const handleClearQuarter = () => {
    clearQuarter(selectedQuarter);
  };

  return (
    <div className="container">
      <h1>
        {isSharedView && ownerName ? `${ownerName}'s ` : ""}Course Calendar
      </h1>
      {isSharedView ? (
        <div style={{ position: "fixed", top: "10px", left: "10px" }}>
          <button
            onClick={clearSharedView}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "0px 10px",
              borderRadius: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <h3>Home</h3> <FiHome style={{ marginLeft: "5px" }} />
          </button>
        </div>
      ) : (
        <></>
      )}
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
        {isSharedView ? (
          <></>
        ) : (
          <div style={{ flex: 1.6 }}>
            <ClassForm onAddClass={handleAddClass} />
          </div>
        )}
        <div
          style={{
            flex: isSharedView ? undefined : 2,
            width: isSharedView ? "50%" : undefined,
          }}
        >
          <ClassSchedule
            formDataList={currentQuarterData.formDataList}
            onEventClick={setSelectedEvent}
            clearQuarter={handleClearQuarter}
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
          onUpdate={handleUpdateClass}
          onDelete={() => handleDeleteClass(selectedEvent.title)}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default App;
