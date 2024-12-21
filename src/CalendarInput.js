import React, { useState } from "react";
import "./CalendarInput.css";

const ClassForm = ({ onAddClass }) => {
  const colors = [
    "#FFB3BA",
    "#FFDFBA",
    "#FFFFBA",
    "#BAFFC9",
    "#BAE1FF",
    "#D4BAFF",
    "#FFC2E2",
    "#C2FFFF",
    "#FF968A",
    "#55CBCD",
    "#FEE1E8",
  ];

  const ColorPalette = () => {
    return (
      <div>
        <strong>Select Class Color:</strong>
        <div className="color-palette">
          {colors.map((color) => (
            <div
              key={color}
              className={`color-swatch ${
                formData.color === color ? "selected" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setFormData({ ...formData, color })}
            />
          ))}
        </div>
      </div>
    );
  };

  const [formData, setFormData] = useState({
    title: "",
    days: [],
    startTime: "",
    endTime: "",
    color: "#0000ff",
    units: "",
  });

  const handleCheckboxChange = (day) => {
    setFormData((prevData) => {
      const newDays = prevData.days.includes(day)
        ? prevData.days.filter((d) => d !== day)
        : [...prevData.days, day];
      return { ...prevData, days: newDays };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddClass({ ...formData, id: Date.now() });
    setFormData({
      title: "",
      days: [],
      startTime: "",
      endTime: "",
      color: "#0000ff",
      units: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-container">
        <div className="input-container">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <strong>Class: </strong>
            <input
              type="text"
              placeholder="Class Name"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="input"
              required
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div>
              <strong style={{ marginRight: "4px" }}>Days:</strong>
              {["M", "T", "W", "Th", "F"].map((day) => (
                <label key={day}>
                  <input
                    type="checkbox"
                    checked={formData.days.includes(day)}
                    onChange={() => handleCheckboxChange(day)}
                  />
                  {day}
                </label>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <strong>Units: </strong>
              <input
                type="text"
                placeholder="Units"
                value={formData.units}
                className="input"
                onChange={(e) =>
                  setFormData({ ...formData, units: e.target.value })
                }
              />
            </div>
          </div>
          <div className="time-container">
            <strong>Time: </strong>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              className="input"
              required
            />
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
              className="input"
              required
            />
          </div>
          <ColorPalette />
          <button type="submit" className="submit-button">
            Add Class
          </button>
        </div>
      </div>
    </form>
  );
};

export default ClassForm;
