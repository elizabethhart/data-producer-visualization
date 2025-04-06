import { useEffect, useState } from "react";
import LineChart from "./LineChart";
import { Datum } from "./Producer.types";

function Producer({
  id,
  startDate,
  endDate,
}: {
  id: number;
  startDate: Date | null;
  endDate: Date | null;
}) {
  const [bufferedData, setBufferedData] = useState<Datum[]>([]);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/producer/${id}`);

    socket.onopen = () => {
      console.log("connected!");
    };

    socket.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setBufferedData((prev) => [...prev, ...newData]);
    };

    socket.onclose = () => {
      console.log("connection closed");
    };

    socket.onerror = (error) => {
      console.error("error:", error);
    };

    return () => {
      socket.close();
    };
  }, [id]);

  return (
    <div>
      <h2>Data Producer {id}</h2>
      <LineChart data={bufferedData} startDate={startDate} endDate={endDate} />
    </div>
  );
}

export default Producer;
