import React, { useState } from "react";
import { quarters } from "./components/Quarter";
import { useQuarterNavigation } from "./hooks/useQuarterNavigation";
import { useCalendar } from "./hooks/useCalendar";
import ClassSchedule from "./components/ClassSchedule";
import Calendar from "./components/Calendar";
import { QuarterSelector, QuarterModal } from "./components/Quarter";
import "./App.css";

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuarterIndex, cycleQuarter] = useQuarterNavigation();

  const { getCurrentQuarterData } = useCalendar();

  const selectedQuarter = quarters[selectedQuarterIndex];
  const currentQuarterData = getCurrentQuarterData(selectedQuarter);

  return (
    <div className="container">
      <h1>Susan's Stanford Calendar</h1>
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
        <ClassSchedule formDataList={currentQuarterData.formDataList} />
      </div>
      <Calendar events={currentQuarterData.events} />
    </div>
  );
};

export default App;
