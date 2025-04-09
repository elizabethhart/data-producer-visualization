import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Grid from "@mui/material/Grid";

const validateDate = (date: Date | null) => {
  const timestamp = date ? Date.parse(date.toString()) : NaN;

  if (isNaN(timestamp)) {
    return null;
  }

  return date;
};

function RangePicker({
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}: {
  startTime: Date | null;
  setStartTime: (date: Date | null) => void;
  endTime: Date | null;
  setEndTime: (date: Date | null) => void;
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={2}>
        <Grid>
          <TimePicker
            label="Start"
            value={startTime}
            maxTime={endTime ? new Date(endTime) : undefined}
            onChange={(newValue) => {
              setStartTime(validateDate(newValue));
            }}
          />
        </Grid>
        <Grid>
          <TimePicker
            label="End"
            value={endTime}
            minTime={startTime ? new Date(startTime) : undefined}
            onChange={(newValue) => {
              setEndTime(validateDate(newValue));
            }}
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}

export default RangePicker;
