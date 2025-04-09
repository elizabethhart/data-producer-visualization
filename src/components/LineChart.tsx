import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import {
  CategoryScale,
  Chart as ChartJS,
  ChartDataset,
  Decimation,
  DecimationAlgorithm,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";
import { formatISO } from "date-fns";
import Box from "@mui/material/Box";

import { ChartDatum } from "../types/Producer.types";

ChartJS.register(
  CategoryScale,
  Decimation,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip
);

function LineChart({
  data,
  startDate,
  endDate,
}: {
  data: ChartDataset<"line", ChartDatum[]>[];
  startDate: Date | null;
  endDate: Date | null;
}) {
  return (
    <Box component="section" sx={{ width: "800px" }}>
      <Line
        options={{
          indexAxis: "x",
          parsing: false,
          elements: {
            // point: {
            //   radius: 0,
            // },
          },
          scales: {
            x: {
              type: "time",
              ticks: {
                source: "auto",
                autoSkip: true,
                maxTicksLimit: 5,
              },
              ...(startDate && { min: formatISO(startDate) }),
              ...(endDate && { max: formatISO(endDate) }),
            },
          },
          responsive: true,
          plugins: {
            // enable decimation to reduce the number of points rendered
            decimation: {
              enabled: true,
              algorithm: "lttb" as DecimationAlgorithm.lttb,
              samples: 40,
              threshold: 1000,
            },
            legend: {
              position: "right",
            },
            // TODO: Add custom tooltip for displaying min/max/avg values
            // tooltip: {
            // },
          },
        }}
        data={{
          datasets: data,
        }}
      />
    </Box>
  );
}

export default LineChart;
