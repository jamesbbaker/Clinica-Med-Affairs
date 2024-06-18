import React, { useRef, useState } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { breakString } from "../../utils/StringUtils";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const datasets = [
  {
    label: "Segment 1",
    data: [0.2, 0.9, 0.3, 0.5, 0.2, 0.3, 0.2, 0.5],
    backgroundColor: "rgba(255, 99, 132, 0.2)",
    borderColor: "rgba(255, 99, 132, 1)",
    borderWidth: 1,
  },
  {
    label: "Segment 2",
    data: [0.52, 0.33, 0.42, 0.53, 0.59, 0.81, 0.3, 0.5],
    backgroundColor: "rgba(93, 245, 112, 0.2)",
    borderColor: "rgba(93, 245, 112, 1)",
    borderWidth: 1,
  },
  {
    label: "Segment 3",
    data: [0.865, 0.312, 0.542, 0.177, 0.629, 0.444, 0.3, 0.9],
    backgroundColor: "rgba(132, 43, 209, 0.2)",
    borderColor: "rgba(132, 43, 209, 1)",
    borderWidth: 1,
  },
  {
    label: "Segment 4",
    data: [0.158, 0.793, 0.509, 0.645, 0.365, 0.234, 0.3, 0.1],
    backgroundColor: "rgba(201, 88, 113, 0.2)",
    borderColor: "rgba(201, 88, 113, 1)",
    borderWidth: 1,
  },
];

const options = {
  layout: {
    padding: {
      left: 100, // Adjust the left padding as needed
      right: 100, // Adjust the right padding as needed
    },
  },
};

export const data = {
  labels: [
    "Failure to escalate therapy",
    "Failure to manage AEs",
    "High AH risk with no anticoagulant",
    "High AH risk with no anticoagulant",
    "Lack of monitoring by CV specialist",
    "Non-adherence to anticoagulants",
    "Non-adherence to other drug treatments",
    "Suboptimal CV risk testing",
  ],
  datasets: [datasets[0]],
};

export function RadarChart() {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [
      "Failure to escalate therapy",
      "Failure to manage AEs",
      "High AH risk with no anticoagulant",
      "High AH risk with no anticoagulant",
      "Lack of monitoring by CV specialist",
      "Non-adherence to anticoagulants",
      "Non-adherence to other drug treatments",
      "Suboptimal CV risk testing",
    ],
    datasets: [datasets[0]],
  });

  const handleChange = (e) => {
    let newData = datasets.slice(0, e.target.value);
    setChartData({
      labels: [
        "Failure to escalate therapy",
        "Failure to manage AEs",
        "High AH risk with no anticoagulant",
        "High AH risk with no anticoagulant",
        "Lack of monitoring by CV specialist",
        "Non-adherence to anticoagulants",
        "Non-adherence to other drug treatments",
        "Suboptimal CV risk testing",
      ],
      datasets: newData,
    });
  };

  return (
    <div className="w-full flex flex-col items-left gap-2 py-2">
      <div className="text-sm font-medium">
      HCP segmentation
      </div>
      <div className="relative mt-2 flex items-center gap-5 mb-10">
        <div>
          <label className="text-xs" htmlFor="labels-range-input">
            Number of clusters
          </label>
        </div>
        <div className="relative">
          <input
            id="labels-range-input"
            type="range"
            onChange={handleChange}
            defaultValue={0}
            min={1}
            max={4}
            step={1}
            className="w-40 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">
            1
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-1/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">
            2
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-2/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">
            3
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">
            4
          </span>
        </div>
      </div>
      <div className="w-1/2 self-center">
        <Radar ref={chartRef} options={options} data={chartData} />
      </div>
    </div>
  );
}
