import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, getElementAtEvent } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
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
          size: 9,
          weight: 700,
        },
      },
    },
    x: {
      title: {
        display: true,
        text: "Patients",
      },
      ticks: {
        callback: function(value) {
          if (value === 0) return '0';
          else if (value >= 1e6) return `${Math.round(value / 1e6)}m`;
          else if (value >= 1e3) return `${Math.round(value / 1e3)}k`;
          else return `${value}`;
      },
        font: {
          size: 10,
        },
      },
    },
  },
  plugins: {
    legend: {
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
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

const BarChart = ({ height = 250, data = _data, options = _options }) => {
  const chartRef = useRef(null);
  const [selectedValue, setSelectedValue] = useState(0);

  const onClick = (event) => {
    if (getElementAtEvent(chartRef.current, event).length > 0) {
      setSelectedValue(
        getElementAtEvent(chartRef.current, event)[0].element.$context.raw
      );
    }
  };

  return (
    <div className="px-4 w-full h-full mt-2 rounded-lg py-4">
      <Bar
        height={height}
        ref={chartRef}
        options={options}
        onClick={onClick}
        data={data}
      />
    </div>
  );
};

export default BarChart;
