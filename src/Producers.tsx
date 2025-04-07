import { useEffect, useState, useMemo } from "react";
import LineChart from "./LineChart";
import { Datum } from "./Producer.types";

function Producers({
  startDate,
  endDate,
}: {
  startDate: Date | null;
  endDate: Date | null;
}) {
  const producerIds = useMemo(() => [1, 2, 3, 4, 5], []);
  const [bufferedDataMap, setBufferedDataMap] = useState<Map<number, Datum[]>>(
    new Map()
  );

  useEffect(() => {
    const sockets = new Map<number, WebSocket>();

    producerIds.forEach((id) => {
      const socket = new WebSocket(`ws://localhost:8000/producer/${id}`);
      sockets.set(id, socket);

      socket.onopen = () => {
        console.log("connected!");
      };

      socket.onmessage = (event) => {
        const newData = JSON.parse(event.data);
        // TODO: add buffer to only update state every few seconds
        setBufferedDataMap((prev) => {
          const updatedMap = new Map(prev);
          const existingData = updatedMap.get(id) || [];
          updatedMap.set(id, [...existingData, ...newData]);
          return updatedMap;
        });
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
  }, [producerIds]);

  const chartData = producerIds.map((id) => {
    const data = bufferedDataMap.get(id) || [];
    return data.map((datum) => ({
      x: new Date(datum.timestamp).toISOString(),
      y: datum.value,
    }));
  });

  return (
    <div>
      <h2>Data Producer 1</h2>
      <LineChart data={chartData} startDate={startDate} endDate={endDate} />
    </div>
  );
}

export default Producers;
