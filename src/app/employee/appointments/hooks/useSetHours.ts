import { useState } from "react";

const functions = {
  getTime(date: string, hours: string) {
    if (date.length === 0 || hours.length === 0) return;
    const dateTime = date + "T" + hours + ":00";
    return new Date(dateTime);
  },
  verifyFutureDate(date: string, hours: string) {
    if (date.length === 0 || hours.length === 0) return;
    const dateNow = new Date().getTime();
    const dateTime = new Date(date + "T" + hours + ":00").getTime();
    return dateTime > dateNow;
  },
};

export default function useSetDate() {
  const [date, setDate] = useState<string>("");
  const [hours, setHours] = useState<string>("");

  return {
    date,
    setDate,
    hours,
    setHours,
    ...functions,
  };
}
