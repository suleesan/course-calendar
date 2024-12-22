import React from "react";
import { format, setHours, setMinutes } from "date-fns";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const startHour = 7;
const endHour = 22;

const Calendar = ({ events }) => {
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(setMinutes(setHours(new Date(), hour), 0));
    }
    return slots;
  };

  // for overlapping events
  const calculateEventStyles = (dayEvents) => {
    const styledEvents = dayEvents.map((event, index) => {
      const overlaps = dayEvents.filter(
        (otherEvent) =>
          event !== otherEvent &&
          ((new Date(otherEvent.start) < new Date(event.end) &&
            new Date(otherEvent.end) > new Date(event.start)) ||
            (new Date(event.start) < new Date(otherEvent.end) &&
              new Date(event.end) > new Date(otherEvent.start)))
      );

      const width =
        overlaps.length > 0 ? `${100 / (overlaps.length + 1)}%` : "100%";
      const left = `${
        (index % (overlaps.length + 1)) * (100 / (overlaps.length + 1))
      }%`;

      return {
        ...event,
        style: {
          width,
          left,
          position: "absolute",
        },
      };
    });

    return styledEvents;
  };

  return (
    <div style={{ width: "80%" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "100px repeat(7, 1fr)",
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
        {daysOfWeek.map((day, dayIndex) => {
          const dayEvents = events.filter(
            (event) => new Date(event.start).getDay() === dayIndex
          );
          const styledDayEvents = calculateEventStyles(dayEvents);

          return (
            <div key={day} style={{ border: "1px solid #ccc" }}>
              <strong style={{ textAlign: "center" }}>{day}</strong>
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
                    {styledDayEvents
                      .filter(
                        (event) =>
                          new Date(event.start).getHours() === index + startHour
                      )
                      .map((event) => {
                        const eventMinute = new Date(event.start).getMinutes();
                        const topPosition = (eventMinute / 60) * 40;

                        return (
                          <div
                            key={event.id}
                            style={{
                              ...event.style,
                              backgroundColor: event.color,
                              top: topPosition,
                              height: event.height,
                              padding: "5px",
                              boxSizing: "border-box",
                              borderRadius: "6px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              zIndex: 1,
                            }}
                          >
                            {event.title}
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
