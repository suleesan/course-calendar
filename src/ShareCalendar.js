import React, { useState } from "react";
import { supabase } from "./supabase/supabase";
import { getOrCreateCalendarId } from "./supabase/calendarFunctions";

const ShareCalendarButton = ({ dataByQuarter }) => {
  const [name, setName] = useState("");

  const shareCalendar = async () => {
    if (!name.trim()) {
      alert("Please enter your name before sharing the calendar.");
      return;
    }

    const calendarId = getOrCreateCalendarId();

    try {
      const sanitizedData = JSON.parse(JSON.stringify(dataByQuarter));

      const { error } = await supabase.from("calendars").upsert(
        {
          calendar_id: calendarId,
          data: sanitizedData,
          name: name.trim(), // Store the owner's name
        },
        { onConflict: "calendar_id" }
      );

      if (error) {
        console.error("Error sharing calendar:", error);
        return;
      }

      const shareableLink = `${window.location.origin}/?id=${calendarId}`;

      // Copy link to clipboard
      await navigator.clipboard.writeText(shareableLink);
      alert(
        `Your calendar link has been copied to clipboard: ${shareableLink}`
      );
    } catch (err) {
      console.error("Failed to share calendar:", err);
    }
  };

  return (
    <div style={{ marginLeft: "10px" }}>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          marginRight: "10px",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
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
        Share Calendar
      </button>
    </div>
  );
};

export default ShareCalendarButton;
