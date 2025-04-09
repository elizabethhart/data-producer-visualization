import { useEffect, useState, useRef } from "react";
import LineChart from "./LineChart";
import { ChartDatum, Datum } from "./Producer.types";

function Producers({
  producers,
  selectedProducers,
  startDate,
  endDate,
}: {
  producers: number[];
  selectedProducers: number[];
  startDate: Date | null;
  endDate: Date | null;
}) {
  const [dataMap, setDataMap] = useState<Map<number, ChartDatum[]>>(new Map());
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
    const existingBufferedData = dataMap.get(id);

    if (existingBufferedData && existingBufferedData.length > 1) {
      // if there is no data for the id, add it (first message received)
      updateDataMap(id);
    } else if (messageQueue && messageQueue.length >= 1000 * 2) {
      // if the queue at least 2000 messages, add the data to the map
      updateDataMap(id);
    }

    // otherwise, do nothing
  };

  useEffect(() => {
    const sockets = new Map<number, WebSocket>();

    producers.forEach((id) => {
      const socket = new WebSocket(`ws://localhost:8000/producer/${id}`);
      sockets.set(id, socket);

      socket.onopen = () => {
        console.log("connected!");
      };

      socket.onmessage = (message) => {
        console.log("message received:");

        processMessageData(id, JSON.parse(message.data));
      };

      socket.onclose = () => {
        console.log("connection closed");
      };

      socket.onerror = (error) => {
        console.error("error:", error);
      };
    });

    return () => {
      sockets.forEach((socket) => socket.close());
    };
  }, [producers]);

  return (
    <div>
      <h2>Data Producers</h2>
      <LineChart
        data={selectedProducers.map((key) => ({
          label: `Producer ${key}`,
          data: [...(dataMap.get(key) || [])],
          borderColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
          ][key - 1],
        }))}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}

export default Producers;
