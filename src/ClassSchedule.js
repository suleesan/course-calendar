import React from "react";
import ShareCalendarButton from "./ShareCalendar";
import { FiEdit2, FiHome } from "react-icons/fi";

const ClassSchedule = ({
  formDataList,
  onEventClick,
  clearQuarter,
  dataByQuarter,
  isSharedView,
  goToHome,
}) => {
  const formatTo12Hour = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return {
      formattedTime: `${formattedHours}:${minutes.toString().padStart(2, "0")}`,
      ampm,
    };
  };

  const totalUnits = formDataList.reduce((sum, formData) => {
    const units = parseInt(formData.units) || 0;
    return sum + units;
  }, 0);

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
        <div style={{ display: "flex", gap: "20px" }}>
          <header style={{ fontSize: "24px", fontWeight: "bold" }}>
            Schedule ({totalUnits})
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
            Clear
          </button>
          {isSharedView ? (
            <button
              onClick={goToHome}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              Home <FiHome style={{ marginLeft: "5px" }} />
            </button>
          ) : (
            <ShareCalendarButton dataByQuarter={dataByQuarter} />
          )}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "10px",
        }}
      >
        {formDataList.map((formData, index) => {
          const start = formatTo12Hour(formData.startTime);
          const end = formatTo12Hour(formData.endTime);

          return (
            <div
              key={index}
              style={{
                backgroundColor: formData.color,
                borderRadius: "6px",
                padding: "12px 24px 12px 12px",
              }}
            >
              <div
                onClick={() => onEventClick(formData)}
                style={{
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <strong>
                  {formData.title} ({formData.units}){" "}
                </strong>
                <span>{formData.days}: </span>
                {start.formattedTime}{" "}
                {start.ampm === end.ampm
                  ? `- ${end.formattedTime} ${end.ampm}`
                  : `${start.ampm} - ${end.formattedTime} ${end.ampm}`}
                <FiEdit2
                  style={{ position: "absolute", top: "-8px", right: "-20px" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClassSchedule;
