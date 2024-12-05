import React, { useState } from "react";
import "./ClassInput.css";

const ClassForm = ({ onAddClass }) => {
  const [formData, setFormData] = useState({
    title: "",
    days: [],
    startTime: "",
    endTime: "",
    color: "#0000ff",
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
    console.log(e);
    onAddClass({ ...formData, id: Date.now() });
    setFormData({
      title: "",
      days: [],
      startTime: "",
      endTime: "",
      color: "#0000ff",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-container">
        <div className="input-container">
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
          <div>
            <strong>Select Days:</strong>
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
          <div className="time-container">
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
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <strong>Class color:</strong>
            <input
              type="color"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              className="color-picker"
            />
          </div>
        </div>
        <button type="submit" className="submit-button">
          Add Class
        </button>
      </div>
    </form>
  );
};

export default ClassForm;
