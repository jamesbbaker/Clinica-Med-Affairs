import React, { useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export const _options = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 1,
    },
  },
  responsive: true,
  scales: {
    y: {
      ticks: {
        stepSize: 1,
        min: 0,
        autoSkip: false,
        font: {
          size: 13.5,
          weight: 500,
        },
        color: "#000",
      },
    },
    x: {
      title: {
        display: true,
        text: "Patients",
      },
      ticks: {
        callback: function (value, index, values) {
          if (value === 0) return "0";
          else if (value >= 1e6 || value <= -1e6) {
            // Convert to million with one decimal place
            return `${(value / 1e6).toFixed(value % 1e6 !== 0 ? 1 : 0)}m`;
          } else if (value >= 1e3 || value <= -1e3) {
            // Convert to thousand with one decimal place
            return `${(value / 1e3).toFixed(value % 1e3 !== 0 ? 1 : 0)}k`;
          } else {
            return `${value}`;
          }
        },
        font: {
          size: 12,
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      display: false,
    },
  },
};

const labels = [
  "Improper CV risk testing",
  "Incomplete comorbidity testing",
  ["Continued AF without", "treatment escalation"],
  ["Repeated cardioversions without", "treatment escalation"],
  "Improper calcium channel blocker",
  "Off-label treatment",
  "High AF stroke risk without anticoagulant",
  "Improper support of therapy",
  "Failure to manage AEs",
  "Lack of monitoring by CV specialist",
  "Non-adherence to anticoagulants",
  ["Non-adherence to other", "AF drug treatments"],
  "Failure to complete follow-up testing",
];

export const _data = {
  labels,
  datasets: [
    {
      data: [
        28795, 34325, 43017, 18139, 37761, 16982, 20873, 21435, 31948, 14192,
        12540, 22449, 29210,
      ],
      barThickness: 10,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

const BarChart = ({
  label,
  height = 250,
  data = _data,
  options = _options,
}) => {
  const chartRef = useRef(null);

  return (
    <div className="px-2 w-full h-full mt-2 rounded-lg">
      {label && <div className="text-[500] text-[#000] text-md">{label}</div>}
      <Bar height={height} ref={chartRef} options={options} data={data} />
    </div>
  );
};

export default BarChart;
