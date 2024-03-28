import React, { useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const defaultOptions = {
  responsive: true,
  scales: {
    x: {
      title: {
        display: true,
        text: "HCPs ranked by patients with suboptimal care",
      },
    },
    y: {
      ticks: {
        // Include a dollar sign in the ticks
        callback: function (value, index, ticks) {
          return (value / 10) % 2 !== 0 ? "" : `${value}%`;
        },
        font: {
          size: 10,
        },
      },
    },
  },
  plugins: {
    legend: {
      position: "top",
    },
  },
};

const labels = [0, 500, 1000, 1500, 2000, 2500, 3000];

export const defaultData = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: [
        0, 60, 70, 76.598150033144236, 85.9379290825167, 89.52586321905159,
        91.00924915363173,
      ],
      borderColor: "rgb(15,255, 122)",
      backgroundColor: "rgb(15,255, 122, 0.2)",
      yAxisID: "left",
    },
    // {
    //   label: "Dataset 1",
    //   data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   borderColor: "rgb(15,255, 122)",
    //   backgroundColor: "rgb(15,255, 122, 0.2)",
    //   yAxisID: "right",
    // },
  ],
};

export function LineChart({ options = defaultOptions, data = defaultData }) {
  const [selectedValue, setSelectedValue] = useState(0);
  const [chartData, setChartData] = useState(data);

  const lineRef = useRef(null);

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
  };

  return (
    <div className="w-full px-2 py-4">
      <Line ref={lineRef} options={options} data={chartData} />
      <div className="px-2 py-4">
        <div className="text-xs border border-slate-200 px-2">
          {selectedValue}
        </div>
        <div>
          <label className="text-xs" for="labels-range-input">
            Number of HCPs to prioritize
          </label>
          <input
            id="labels-range-input"
            type="range"
            min={0}
            max={2500}
            value={selectedValue}
            onChange={handleChange}
            defaultValue={0}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-500"
          />
        </div>
      </div>
    </div>
  );
}
