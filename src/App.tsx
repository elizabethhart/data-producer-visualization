import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { addMinutes, subMinutes } from "date-fns";

import Producer from "./Producer";

import "./App.css";
import { useState } from "react";

function App() {
  const [startTime, setStartTime] = useState<Date | null>(
    subMinutes(Date.now(), 1)
  );
  const [endTime, setEndTime] = useState<Date | null>(
    addMinutes(Date.now(), 1)
  );

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TimePicker
          label="Start"
          value={startTime}
          onChange={(newValue) => setStartTime(newValue)}
        />
        <TimePicker
          label="End"
          value={endTime}
          onChange={(newValue) => setEndTime(newValue)}
        />
      </LocalizationProvider>

      {/* {Array.from({ length: 10 }, (_, i) => i + 1).map((producer) => ( */}
      <Producer id={1} key={1} startDate={startTime} endDate={endTime} />
      {/* ))} */}
    </div>
  );
}

export default App;
