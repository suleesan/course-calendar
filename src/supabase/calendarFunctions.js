import { supabase } from "./supabase";

export const getCalendar = async (calendarId) => {
  const { data, error } = await supabase
    .from("calendars")
    .select("data, name")
    .eq("calendar_id", calendarId)
    .single();

  if (error) {
    console.error("Error fetching calendar:", error);
    return null;
  }

  return data;
};

export function getOrCreateCalendarId() {
  let calendarId = localStorage.getItem("calendar_id");
  if (!calendarId) {
    calendarId = crypto.randomUUID();
    localStorage.setItem("calendar_id", calendarId);
  }
  return calendarId;
}
