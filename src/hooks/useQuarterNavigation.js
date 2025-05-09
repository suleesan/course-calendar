import { useState } from "react";
import { quarters } from "../components/Quarter";

export const useQuarterNavigation = () => {
  const [selectedQuarterIndex, setSelectedQuarterIndex] = useState(11);

  const cycleQuarter = (direction, index = null) => {
    if (index !== null) {
      setSelectedQuarterIndex(index);
    } else {
      setSelectedQuarterIndex((prevIndex) => {
        if (direction === "prev")
          return prevIndex === 0 ? quarters.length - 1 : prevIndex - 1;
        if (direction === "next")
          return prevIndex === quarters.length - 1 ? 0 : prevIndex + 1;
        return prevIndex;
      });
    }
  };

  return [selectedQuarterIndex, cycleQuarter];
};
