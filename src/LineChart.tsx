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
import { faker } from "@faker-js/faker";

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

const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

function LineChart({
  data,
  startDate,
  endDate,
}: {
  data: { x: string; y: number }[][];
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
        datasets: data.map((dataset, index) => ({
          label: `Producer ${index + 1}`,
          data: dataset,
          borderColor: colors[index],
        })),
      }}
    />
  );
}

export default LineChart;
