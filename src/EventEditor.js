import React, { useState, useEffect } from "react";
import "./EventEditor.css";

const EventEditor = ({ event, onUpdate, onDelete, onClose }) => {
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

  const [formData, setFormData] = useState({
    title: event.title,
    days: event.days,
    startTime: event.startTime,
    endTime: event.endTime,
    color: event.color,
  });

  useEffect(() => {
    setFormData({
      title: event.title,
      days: event.days,
      startTime: event.startTime,
      endTime: event.endTime,
      color: event.color,
    });
  }, [event]);

  const handleColorSelect = (color) => {
    setFormData((prevData) => ({ ...prevData, color }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...event, ...formData });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Event</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div className="content">
            <strong>Title:</strong>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div>
            <strong>Class Color:</strong>
            <div className="color-palette">
              {colors.map((color) => (
                <div
                  key={color}
                  className={`color-swatch ${
                    formData.color === color ? "selected" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </div>

            <div>
              <strong>Custom color: </strong>
              <input
                type="color"
                label="Custom"
                value={formData.color}
                onChange={(e) => handleColorSelect(e.target.value)}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                }}
              />
            </div>
          </div>
          <div className="content">
            <strong>Days:</strong>
            <input
              type="text"
              value={formData.days}
              onChange={(e) =>
                setFormData({ ...formData, days: e.target.value })
              }
            />
          </div>
          <div className="content">
            <strong>Start Time: </strong>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
            />
          </div>
          <div className="content">
            <strong>End Time: </strong>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
            />
          </div>
          <div style={{ marginTop: "20px" }}>
            <button type="submit">Update Event</button>
            <button
              type="button"
              onClick={() => onDelete(event.title)}
              style={{ marginLeft: "10px" }}
            >
              Delete Event
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventEditor;
