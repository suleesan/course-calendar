import { supabase } from "./supabase";

// export const saveCalendar = async (calendarData) => {
//   try {
//     const calendarId = getOrCreateCalendarId(); // Get or create a unique calendar ID

//     const { error } = await supabase.from("calendars").upsert(
//       { id: calendarId, data: calendarData },
//       { onConflict: "id" } // Ensures that if the ID exists, it updates instead of inserting a new row
//     );

//     if (error) throw error;

//     return calendarId;
//   } catch (error) {
//     console.error("Error saving calendar:", error);
//     throw error;
//   }
// };

export const getCalendar = async (calendarId) => {
  try {
    const { data, error } = await supabase
      .from("calendars")
      .select("data")
      .eq("calendar_id", calendarId) // Match calendar_id here
      .single();
    if (error) throw error;
    return data?.data; // Return the `data` field
  } catch (error) {
    console.error("Error retrieving calendar:", error);
    throw error;
  }
};

export function getOrCreateCalendarId() {
  let calendarId = localStorage.getItem("calendar_id");
  if (!calendarId) {
    calendarId = crypto.randomUUID();
    localStorage.setItem("calendar_id", calendarId);
  }
  return calendarId;
}
