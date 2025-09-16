import React, { useState } from "react";
import {
  getOrCreateCalendarId,
  autoSaveCalendar,
} from "../supabase/calendarFunctions";

const ShareCalendar = ({ dataByQuarter }) => {
  const [name, setName] = useState("");

  const shareCalendar = async () => {
    if (!name.trim()) {
      alert("Please enter your name before sharing the calendar.");
      return;
    }

    try {
      // Save calendar with the provided name
      const success = await autoSaveCalendar(dataByQuarter, name.trim());

      if (!success) {
        alert("Failed to save calendar. Please try again.");
        return;
      }

      const calendarId = getOrCreateCalendarId();
      const shareableLink = `${window.location.origin}/?id=${calendarId}`;

      // Copy link to clipboard
      await navigator.clipboard.writeText(shareableLink);
      alert(
        `Your calendar link has been copied to clipboard: ${shareableLink}`
      );
    } catch (err) {
      console.error("Failed to share calendar:", err);
      alert("Failed to share calendar. Please try again.");
    }
  };

  return (
    <div style={{ marginLeft: "10px" }}>
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          marginRight: "10px",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          maxWidth: "80px",
        }}
      />
      <button
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: "10px",
          cursor: "pointer",
        }}
        onClick={shareCalendar}
      >
        Save/Share Calendar
      </button>
    </div>
  );
};

export default ShareCalendar;
