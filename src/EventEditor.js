import React, { useState } from "react";
import "./EventEditor.css"; // Import CSS for styling

const EventEditor = ({ event, onUpdate, onDelete, onClose }) => {
  const [formData, setFormData] = useState({
    title: event.title,
    days: event.days,
    startTime: event.startTime,
    endTime: event.endTime,
    color: event.color,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...event, ...formData }); // Pass updated event data
    onClose(); // Close the modal
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Event</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div>
            <label>Color:</label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
            />
          </div>
          <div>
            <label>Days:</label>
            <input
              type="text"
              value={formData.days}
              onChange={(e) =>
                setFormData({ ...formData, days: e.target.value })
              }
            />
          </div>
          <div>
            <label>Start Time:</label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
            />
          </div>
          <div>
            <label>End Time:</label>
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
              onClick={() => onDelete(event.id)}
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
