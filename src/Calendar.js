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
    const doEventsOverlap = (eventA, eventB) => {
      return (
        new Date(eventA.start) < new Date(eventB.end) &&
        new Date(eventA.end) > new Date(eventB.start)
      );
    };

    const groups = [];
    dayEvents.forEach((event) => {
      let addedToGroup = false;

      for (const group of groups) {
        if (group.some((groupEvent) => doEventsOverlap(event, groupEvent))) {
          group.push(event);
          addedToGroup = true;
          break;
        }
      }

      if (!addedToGroup) {
        groups.push([event]);
      }
    });

    // Figure out styles for events
    const styledEvents = [];
    groups.forEach((group) => {
      const groupSize = group.length;
      group.forEach((event, index) => {
        const width = `${100 / groupSize}%`;
        const left = `${(index / groupSize) * 100}%`;

        styledEvents.push({
          ...event,
          style: {
            width,
            left,
            position: "absolute",
          },
        });
      });
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
