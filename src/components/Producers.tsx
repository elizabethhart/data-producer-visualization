import { useEffect, useState, useRef } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";

import { ChartDatum, Datum } from "../types/Producer.types";
import LineChart from "./LineChart";
import RangePicker from "./RangePicker";
import ProducerSelection from "./ProducerSelection";

const colors = [
  "#c12e34",
  "#e6b600",
  "#0098d9",
  "#2b821d",
  "#005eaa",
  "#339ca8",
  "#d87c7b",
  "#32a487",
  "#E690D1",
  "#001852",
];

function Producers({ producers }: { producers: number[] }) {
  const [selectedProducers, setSelectedProducers] =
    useState<number[]>(producers);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [decimationEnabled, setDecimationEnabled] = useState(true);
  const [dataMap, setDataMap] = useState<Map<number, ChartDatum[]>>(new Map());

  // manage queued messages in ref to presist producer data and avoid unnecessary re-renders
  const messageQueues = useRef<Map<number, Datum[]>>(new Map());

  const updateDataMap = (id: number) => {
    const messageQueue = messageQueues.current.get(id);

    // map data into the format required by the chart
    const newData = messageQueue?.map((datum: Datum) => ({
      x: Date.parse(datum.timestamp),
      y: datum.value,
    })) as ChartDatum[];

    // update state with the new data
    setDataMap((prev) => {
      const updatedMap = new Map(prev);
      const existingData = updatedMap.get(id) || [];
      updatedMap.set(id, [...existingData, ...newData]);
      return updatedMap;
    });

    // clear the queue
    messageQueues.current.delete(id);
  };

  /**
   * Accepts a websocket message event for a given producer
   * If the data is already in the map, it will be added to the existing data
   * To limit state updates, the dataMap is only updated once it's received a certain amount of data
   * If the data is not in the map, it will be added as a new entry
   * @param id
   */
  const processMessageData = (id: number, newData: Datum[]) => {
    messageQueues.current.set(id, [
      ...(messageQueues.current.get(id) || []),
      ...newData,
    ]);

    const messageQueue = messageQueues.current.get(id);

    // TODO: this decreases re-renders, but causes a lag in the chart animation
    if (messageQueue && messageQueue.length >= 2000) {
      // if the queue has at least 2000 messages, add the data to the map
      updateDataMap(id);
    }

    // otherwise, do nothing
  };

  // on initial render, create a websocket connection for each producer
  useEffect(() => {
    const sockets = new Map<number, WebSocket>();

    producers.forEach((id) => {
      const socket = new WebSocket(`ws://localhost:8000/producer/${id}`);
      sockets.set(id, socket);

      socket.onopen = () => {
        console.log(`connected to producer ${id}!`);
      };

      socket.onmessage = (message) => {
        processMessageData(id, JSON.parse(message.data));
      };

      socket.onclose = () => {
        console.log(`disconnected from producer ${id}!`);
        // TODO: handle reconnection
      };

      socket.onerror = (error) => {
        console.error(`error from producer ${id}!`, error);
        // TODO: deduce error type and handle it
      };
    });

    return () => {
      sockets.forEach((socket) => socket.close());
    };
  }, []);

  return (
    <Grid container direction="row" justifyContent="start">
      <Grid alignSelf="center">
        <ProducerSelection
          producers={producers}
          selectedProducers={selectedProducers}
          setSelectedProducers={setSelectedProducers}
        />
      </Grid>
      <Grid container gap={2} direction="column">
        <Grid>
          <Grid container gap={2} direction="column">
            <h2>Data Producers</h2>
            <LineChart
              decimationEnabled={decimationEnabled}
              data={selectedProducers.map((key) => ({
                label: `Producer ${key}`,
                data: [...(dataMap.get(key) || [])],
                borderColor: colors[key - 1],
              }))}
              startDate={startTime}
              // TODO: Investigate why changing endDate causes chart issues
              endDate={endTime}
            />
            <Grid container gap={2} alignSelf="center" marginTop={2}>
              <Grid alignSelf="center">
                <RangePicker
                  startTime={startTime}
                  setStartTime={setStartTime}
                  endTime={endTime}
                  setEndTime={setEndTime}
                />
              </Grid>
              <Grid>
                {/* TODO: Make data decimation sample size configurable in the UI */}
                <FormControlLabel
                  control={
                    <Switch
                      defaultChecked
                      onChange={(e) => setDecimationEnabled(e.target.checked)}
                    />
                  }
                  label={
                    <Tooltip
                      title="Enable the 'lttb' algorithm. This reduces the number of data points to show trends in the data."
                      placement="top"
                    >
                      <div>Enable Data Decimation</div>
                    </Tooltip>
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Producers;
