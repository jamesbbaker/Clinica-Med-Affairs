import React from "react";
import { Bubble } from "react-chartjs-2";
import "chart.js/auto";
import 'chartjs-plugin-annotation';

const defaultData = {
  datasets: [
    {
      label: "HCP value",
      data: [
        { x: 10, y: 20, r: 15 },
        { x: 15, y: 10, r: 10 },
        { x: 20, y: 30, r: 20 },
        { x: 25, y: 25, r: 25 },
        { x: 30, y: 15, r: 12 },
      ],
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
  ],
};

const defaultOptions = {
  scales: {
    x: {
      type: "linear",
      position: "bottom",
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `Name: ${context.raw.name}, x:${context.raw.x}, y:${context.raw.y}, Number of ICS-LABA Patients: ${context.raw.value}`;
        },
      },
    },
    annotation: {
        annotations: [
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: 20,
            borderColor: 'red',
            borderWidth: 2,
            label: {
              enabled: true,
              content: 'Prioritization Line',
              position: 'right',
            },
          },
          {
            type: 'line',
            mode: 'vertical',
            scaleID: 'x-axis-0',
            value: 20,
            borderColor: 'red',
            borderWidth: 2,
            label: {
              enabled: true,
              content: 'Prioritization Line',
              position: 'top',
            },
          },
        ],
      },
  },
};

const ScatterChart = ({ data = defaultData, options = defaultOptions }) => {
  return <div className="h-[800px] w-full"><Bubble data={data} options={options} /></div>
};

export default ScatterChart;
