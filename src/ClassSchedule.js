import React from "react";
import { format } from "date-fns";
import html2canvas from "html2canvas";

const ClassSchedule = ({ formDataList, onEventClick, clearQuarter }) => {
  const handleScreenshot = () => {
    const scheduleElement = document.querySelector("#schedule-container");
    const calendarElement = document.querySelector("#calendar-container");

    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.appendChild(scheduleElement.cloneNode(true));
    container.appendChild(calendarElement.cloneNode(true));
    document.body.appendChild(container);

    html2canvas(container).then((canvas) => {
      const link = document.createElement("a");
      link.download = "schedule-calendar.png";
      link.href = canvas.toDataURL();
      link.click();

      document.body.removeChild(container);
    });
  };

  return (
    <div id="schedule-container" style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "row",
            gap: "20px",
          }}
        >
          <header style={{ fontSize: "24px", fontWeight: "bold" }}>
            Schedule
          </header>
          <button
            onClick={clearQuarter}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Clear All Classes
          </button>
          {/* <button
            onClick={handleScreenshot}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Save Screenshot
          </button> */}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "10px",
        }}
      >
        {formDataList.map((formData, index) => (
          <div
            key={index}
            style={{
              backgroundColor: formData.color,
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            <div
              onClick={() => onEventClick(formData)}
              style={{ cursor: "pointer" }}
            >
              <strong>{formData.title} </strong>
              <span>{formData.days}: </span>
              {formData.startTime} - {formData.endTime}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassSchedule;
