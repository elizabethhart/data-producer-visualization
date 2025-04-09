import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import Producers from "./components/Producers";

import "./App.css";

const producers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function App() {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [selectedProducers, setSelectedProducers] =
    useState<number[]>(producers);

  const handleChange = (producer: number, checked: boolean) => {
    if (checked) {
      setSelectedProducers((prev) => [...prev, producer]);
    } else {
      setSelectedProducers((prev) => prev.filter((p) => p !== producer));
    }
  };

  return (
    <Grid container direction="row" justifyContent="start">
      <Grid alignSelf="center">
        <FormGroup>
          {producers.map((producer) => (
            <FormControlLabel
              key={producer}
              control={
                <Checkbox
                  checked={selectedProducers.includes(producer)}
                  onChange={(e) => handleChange(producer, e.target.checked)}
                  name={producer.toString()}
                />
              }
              label={`Producer ${producer}`}
            />
          ))}
        </FormGroup>
      </Grid>
      <Grid container gap={2} direction="column">
        <Grid>
          <Producers
            producers={producers}
            selectedProducers={selectedProducers}
            startDate={startTime}
            endDate={endTime}
          />
        </Grid>
        <Grid alignSelf="center">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2}>
              <Grid>
                <TimePicker
                  label="Start"
                  value={startTime}
                  onChange={(newValue) => setStartTime(newValue)}
                />
              </Grid>
              <Grid>
                <TimePicker
                  label="End"
                  value={endTime}
                  onChange={(newValue) => setEndTime(newValue)}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default App;
