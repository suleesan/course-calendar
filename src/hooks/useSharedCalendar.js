import { useEffect, useState } from "react";
import { getCalendar } from "../supabase/calendarFunctions";
import { initializeDataByQuarter, loadFromStorage } from "../utils/storage";

export const useSharedCalendar = (setDataByQuarter) => {
  const [isSharedView, setIsSharedView] = useState(false);
  const [sharedDataByQuarter, setSharedDataByQuarter] = useState(null);
  const [ownerName, setOwnerName] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const calendarId = queryParams.get("id");

    if (calendarId) {
      setIsSharedView(true);
      getCalendar(calendarId)
        .then((data) => {
          if (data) {
            const initializedData = initializeDataByQuarter(data.data);
            setSharedDataByQuarter(initializedData);
            setOwnerName(data.name || "");
          } else {
            alert("Calendar not found!");
          }
        })
        .catch(() => alert("Failed to load calendar."));
    } else {
      setIsSharedView(false);
      setOwnerName("");
    }
  }, []);

  const clearSharedView = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("id");
    window.history.replaceState({}, document.title, url.toString());

    // Reset to user's data
    const storedData = loadFromStorage("dataByQuarter");
    setDataByQuarter(initializeDataByQuarter(storedData));

    setSharedDataByQuarter(null); // Clear shared data
    setIsSharedView(false);
    setOwnerName("");
  };

  return { isSharedView, sharedDataByQuarter, ownerName, clearSharedView };
};
