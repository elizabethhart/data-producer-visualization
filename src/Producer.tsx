import { useEffect, useState } from "react";

type Datum = {
  timestamp: string;
  value: number;
};

function Producer({ id }: { id: number }) {
  const [data, setData] = useState<Datum[]>([]);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/producer/${id}`);

    socket.onopen = () => {
      console.log("connected!");
    };

    socket.onmessage = (event) => {
      console.log("data received:", event.data);
      setData((prev) => [...prev, ...event.data]);
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
      {/* TODO: Display data */}
    </div>
  );
}

export default Producer;
