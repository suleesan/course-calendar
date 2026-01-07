import React from "react";
import "./Quarter.css";
import { coursesByQuarter } from "../courseData";

const termOrder = { Fall: 0, Winter: 1, Spring: 2 };
const parseQuarter = (quarter) => {
  const [term, yearRange] = quarter.split(" ");
  const [startYear] = (yearRange || "").split("-").map(Number);
  return { termIndex: termOrder[term] ?? 99, startYear: startYear || 0 };
};

export const quarters = Object.keys(coursesByQuarter).sort((a, b) => {
  const first = parseQuarter(a);
  const second = parseQuarter(b);
  if (first.startYear !== second.startYear) {
    return first.startYear - second.startYear;
  }
  return first.termIndex - second.termIndex;
});

// Quarter Selector
export const QuarterSelector = ({ selectedQuarter, onCycle, onOpenModal }) => (
  <div className="quarter-selector">
    <button className="arrow-button" onClick={() => onCycle("prev")}>
      ←
    </button>
    <h2
      className="quarter-label"
      onClick={onOpenModal}
      style={{ cursor: "pointer" }}
    >
      {selectedQuarter}
    </h2>
    <button className="arrow-button" onClick={() => onCycle("next")}>
      →
    </button>
  </div>
);

// Quarter Modal
export const QuarterModal = ({
  modalVisible,
  setModalVisible,
  quarters,
  selectedQuarterIndex,
  setSelectedQuarterIndex,
}) =>
  modalVisible && (
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
        <button className="close-button" onClick={() => setModalVisible(false)}>
          Close
        </button>
      </div>
    </div>
  );
