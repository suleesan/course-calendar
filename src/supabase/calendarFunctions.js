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

// auto-save calendar
export const autoSaveCalendar = async (dataByQuarter, name = null) => {
  const calendarId = getOrCreateCalendarId();

  try {
    const sanitizedData = JSON.parse(JSON.stringify(dataByQuarter));

    // Get existing name if no name provided
    let calendarName = name;
    if (!calendarName) {
      const existingCalendar = await getCalendar(calendarId);
      calendarName = existingCalendar?.name || "My Calendar";
    }

    const { error } = await supabase.from("calendars").upsert(
      {
        calendar_id: calendarId,
        data: sanitizedData,
        name: calendarName,
      },
      { onConflict: "calendar_id" }
    );

    if (error) {
      console.error("Error auto-saving calendar:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to auto-save calendar:", err);
    return false;
  }
};
