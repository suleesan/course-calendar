import React from "react";
import "./Quarter.css";

export const quarters = [
  "Fall 2021-2022",
  "Winter 2021-2022",
  "Spring 2021-2022",
  "Fall 2022-2023",
  "Winter 2022-2023",
  "Spring 2022-2023",
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
