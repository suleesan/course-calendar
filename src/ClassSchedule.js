import React from "react";
import { format } from "date-fns";
import html2canvas from "html2canvas";

const ClassSchedule = ({ formDataList, onEventClick }) => {
  const handleScreenshot = () => {
    // Capture both schedule and calendar
    const scheduleElement = document.querySelector("#schedule-container");
    const calendarElement = document.querySelector("#calendar-container");

    // Create a temporary container
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.appendChild(scheduleElement.cloneNode(true));
    container.appendChild(calendarElement.cloneNode(true));
    document.body.appendChild(container);

    html2canvas(container).then((canvas) => {
      // Create download link
      const link = document.createElement("a");
      link.download = "schedule-calendar.png";
      link.href = canvas.toDataURL();
      link.click();

      // Cleanup
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
        <div style={{ display: "flex", justifyContent: "row", gap: "20px" }}>
          <header style={{ fontSize: "24px", fontWeight: "bold" }}>
            Schedule
          </header>
          <button
            onClick={() => {
              localStorage.removeItem("formDataList");
              localStorage.removeItem("events");
              window.location.reload();
            }}
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
          <button
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
          </button>
        </div>
      </div>
      {formDataList.map((formData, index) => (
        <div
          key={index}
          style={{
            backgroundColor: formData.color,
            borderRadius: "5px",
            padding: "10px",
            marginBottom: "10px",
            color: "#fff",
          }}
        >
          <div
            onClick={() => onEventClick(formData)}
            style={{ fontSize: "14px", marginTop: "5px" }}
          >
            <strong style={{ fontSize: "18px" }}>{formData.title} </strong>
            <span>{formData.days}: </span>
            {formData.startTime} - {formData.endTime}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassSchedule;
