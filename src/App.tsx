import { useState } from "react";
import { addMinutes, subMinutes } from "date-fns";
import Grid from "@mui/material/Grid";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import Producers from "./Producers";

import "./App.css";

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
        <Grid container spacing={2}>
          <Grid size={5}>
            <TimePicker
              label="Start"
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
            />
          </Grid>
          <Grid size={5}>
            <TimePicker
              label="End"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>

      <Producers startDate={startTime} endDate={endTime} />
    </div>
  );
}

export default App;
