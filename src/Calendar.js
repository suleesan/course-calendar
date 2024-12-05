import React from "react";
import { format, setHours, setMinutes } from "date-fns";

const Calendar = ({ events }) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const startHour = 9;
  const endHour = 21;

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(setMinutes(setHours(new Date(), hour), 0));
    }
    return slots;
  };

  return (
    <div style={{ width: "80%" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "90px repeat(7, 1fr)",
        }}
      >
        <div style={{ border: "1px solid #ddd" }}>
          <strong>Time</strong>
          <div>
            {generateTimeSlots().map((timeSlot, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ccc",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {format(timeSlot, "h:mm a")}
              </div>
            ))}
          </div>
        </div>
        {daysOfWeek.map((day, dayIndex) => (
          <div key={day} style={{ border: "1px solid #ccc" }}>
            <strong>{day}</strong>
            <div>
              {generateTimeSlots().map((_, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #ccc",
                    height: "40px",
                    position: "relative",
                  }}
                >
                  {events
                    .filter((event) => {
                      const eventDay = new Date(event.start).getDay();
                      const eventHour = new Date(event.start).getHours();
                      return (
                        eventDay === dayIndex && eventHour === index + startHour
                      );
                    })
                    .map((event) => (
                      <div
                        key={event.id}
                        style={{
                          backgroundColor: event.color,
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: event.height,
                          padding: "5px",
                          boxSizing: "border-box",
                          borderRadius: "5px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 1,
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
