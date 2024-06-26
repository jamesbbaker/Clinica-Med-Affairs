import React, { useEffect, useMemo, useRef, useState } from "react";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  TimeScale,
  registerables,
} from "chart.js";
import "chartjs-adapter-date-fns"; // Import the date-fns adapter

ChartJS.register(...registerables);
export const defaultOptions = {
  responsive: true,
  scales: {
    x: {
      title: {
        display: true,
        text: "HCPs ranked by patients with suboptimal care",
      },

      grid: {
        display: false,
      },
      // grid: {
      //   drawOnChartArea: false,
      //   drawOnAxisArea: false,
      // },
      ticks: {
        // stepSize: 1,
        // min: 0,
        autoSkip: false,
        callback: function (value) {
          return value % 500 !== 0 ? "" : value;
        },
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
    datalabels: {
      display: false,
    },
  },
};

function generateValues() {
  const values = [];
  const maxIndex = 3000;

  for (let i = 0; i < maxIndex; i++) {
    if (i < 1000) {
      // Values increase quickly from 0 to 100
      values.push((100 / 1000) * i);
    } else {
      // Values increase slowly after reaching 100
      const slowIncrease = ((i - 1000) * Math.log(i)) / 400;
      values.push(100 + slowIncrease);
    }
  }

  return values;
}

const labels = Array.from({ length: 3001 }, (_, i) => i);

export const defaultData = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: generateValues(),
      borderColor: "rgb(15,255, 122)",
      backgroundColor: "rgb(15,255, 122, 0.2)",
    },
  ],
};

export function LineChart({
  key = null,
  arbitrary = true,
  options = defaultOptions,
  data = defaultData,
  height = 100,
}) {
  const [selectedValue, setSelectedValue] = useState(0);
  const [chartData, setChartData] = useState(data);
  const [arbitraryLineValues, setArbitraryLine] = useState({
    min:0,
    max: 0
  })
  const [loading, setLoading] = useState(false);
  let arbitraryLine = {
    id: "arbitraryLine",
    beforeDatasetsDraw(chart, args, pluginOptions) {},
  };

  useEffect(() => {
    setChartData(data);
    setArbitraryLine(prev => ({
      ...prev,
      max: data.labels.length
    }))
  }, [data]);

  const intersectDataVerticalLine = {
    id: "intersectDataVerticalLine",
    afterDraw: (chart) => {
      if (chart.getActiveElements().length) {
        const activePoint = chart.getActiveElements()[0];
        const {
          ctx,
          chartArea: { top, bottom, left, right, width, height },
          scales: { x, y },
        } = chart;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "black";
        ctx.setLineDash([10, 15]);
        ctx.moveTo(x.getPixelForValue(activePoint.datasetIndex), top);
        ctx.lineTo(x.getPixelForValue(activePoint.datasetIndex), bottom);
        ctx.stroke();
        ctx.restore();
      }
    },
  };

  const lineRef = useRef(null);

  const handleChange = (e) => {
    arbitraryLine.beforeDatasetsDraw(lineRef.current);
    let _val = parseInt(e.target.value);
    lineRef.current.setActiveElements([
      { datasetIndex: _val, hovered: false, index: _val + 1 },
    ]);
    lineRef.current.update();
    setSelectedValue(_val);
  };

  return (
    <div className="w-full h-full px-2 pt-4">
      {!loading && (
        <div className={`${arbitrary && "pointer-events-none"}`}>
          <Line
            key={key}
            height={height}
            ref={lineRef}
            plugins={arbitrary && [intersectDataVerticalLine]}
            options={options}
            data={chartData}
          />
        </div>
      )}
      {arbitrary && (
        <div className="px-2 py-4">
          <div className="text-xs border border-slate-200 px-2">
            {selectedValue}
          </div>
          <div>
            <label className="text-xs" htmlFor="labels-range-input">
              Number of HCPs to prioritize
            </label>
            <input
              id="labels-range-input"
              type="range"
              min={0}
              max={arbitraryLineValues.max}
              onChange={handleChange}
              defaultValue={0}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
