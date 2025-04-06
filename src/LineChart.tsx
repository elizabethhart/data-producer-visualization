import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { subMinutes, formatISO, addMinutes } from "date-fns";
import { Datum } from "./Producer.types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LineChart({
  data,
  startDate,
  endDate,
}: {
  data: Datum[];
  startDate: Date | null;
  endDate: Date | null;
}) {
  return (
    <Line
      options={{
        scales: {
          x: {
            type: "time",
            time: {
              unit: "second",
            },
            min: startDate
              ? formatISO(startDate)
              : formatISO(subMinutes(Date.now(), 1)),
            max: endDate
              ? formatISO(endDate)
              : formatISO(addMinutes(Date.now(), 1)),
          },
        },
        plugins: {
          decimation: {
            enabled: true,
            algorithm: "lttb",
          },
        },
      }}
      data={{
        datasets: [
          {
            label: "Data",
            data: data.map((item) => ({
              x: new Date(item.timestamp).toISOString(),
              y: item.value,
            })),
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.2)",
            fill: true,
          },
        ],
      }}
    />
  );
}

export default LineChart;
