import React, { useEffect, useRef, useState } from "react";
import { Bubble } from "react-chartjs-2";
import "chart.js/auto";
import "chartjs-plugin-annotation";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  BubbleController,
} from "chart.js";
import { highestValue } from "../../utils/MathUtils";
import { selectLabels } from "../../constants/appConstants";

// Register required components from Chart.js
ChartJS.register(LinearScale, PointElement, Tooltip, Legend, BubbleController);

// Register the arbitrary line plugin globally
const arbitraryLinePlugin = {
  id: "arbitraryLine",
  afterDraw: (chart) => {
    if (
      chart.config &&
      chart.config.options &&
      chart.config.options.plugins &&
      chart.config.options.plugins.arbitraryLine
    ) {
      const {
        ctx,
        chartArea: { top, bottom, left, right },
        scales: { x, y },
      } = chart;
      const { lineX, lineY } = chart.config.options.plugins.arbitraryLine;

      if (x && lineX !== undefined) {
        const xValue = x.getPixelForValue(lineX);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(xValue, top);
        ctx.lineTo(xValue, bottom);
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }
      if (y && lineY !== undefined) {
        const yValue = y.getPixelForValue(lineY);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(left, yValue);
        ctx.lineTo(right, yValue);
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }
    }
  },
};

ChartJS.register(arbitraryLinePlugin);

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
    datalabels: {
      display: false,
    },
  },
};

const ScatterChart = ({
  quadrantValues,
  lineX,
  lineY,
  setLineX,
  setLineY,
  state,
  data = defaultData,
  options = defaultOptions,
}) => {
  const chartRef = useRef(null);
  const [dataOptions, setOptions] = useState(options);
  const [maxX, setMaxX] = useState();
  const [maxY, setMaxY] = useState();

  useEffect(() => {
    const _defaultOptions = {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          title: {
            display: true,
            text: selectLabels[state.xLabel], // Replace with your x-axis label
          },
        },
        y: {
          type: "linear",
          title: {
            display: true,
            text: selectLabels[state.yLabel], // Replace with your y-axis label
          },
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
              return `Name: ${context.raw.name}, ${[selectLabels[state.xLabel]]}:${
                context.raw.x
              }, ${selectLabels[state.yLabel]}:${
                context.raw.y
              }, Number of ICS-LABA Patients: ${context.raw.value}`;
            },
          },
        },
        datalabels: {
          display: false,
        },
      },
    };
    setOptions(_defaultOptions);
  }, [state.xLabel, state.yLabel]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.options.plugins.arbitraryLine.lineX = lineX;
      chartRef.current.update();
    }
  }, [lineX]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.options.plugins.arbitraryLine.lineY = lineY;
      chartRef.current.update();
    }
  }, [lineY]);

  useEffect(() => {
    const data = chartRef.current?.data.datasets[0]?.data;
    if (data) {
      const maxXValue = Math.max(...data.map((point) => point.x));
      setMaxX(maxXValue);
    }
  }, [chartRef.current, data]);

  useEffect(() => {
    const data = chartRef.current?.data.datasets[0]?.data;
    if (data) {
      const maxXValue = Math.max(...data.map((point) => point.y));
      setMaxY(maxXValue);
    }
  }, [chartRef.current, data]);

  const handleChangeX = (e) => {
    setLineX(Number(e.target.value));
  };

  const handleChangeY = (e) => {
    setLineY(Number(e.target.value));
  };
  return (
    <div className="h-[800px] relative w-full">
      <Bubble ref={chartRef} data={data} options={dataOptions} />
      <div className="absolute text-[#4B0082] font-[700] top-[8%] left-[10%]">
        {quadrantValues.topLeft}
      </div>
      {chartRef.current && (
        <div
          style={{ left: `calc(${chartRef.current.width}px - 10%)` }}
          className="absolute text-[#FF0000] font-[700] top-[8%]"
        >
          {quadrantValues.topRight}
        </div>
      )}
      {chartRef.current && (
        <div
          style={{ top: `calc(${chartRef.current.height}px - 10%)` }}
          className="absolute text-[#d4d4d4] font-[700] left-[10%]"
        >
          {quadrantValues.bottomLeft}
        </div>
      )}
      {chartRef.current && (
        <div
          style={{
            top: `calc(${chartRef.current.height}px - 10%)`,
            left: `calc(${chartRef.current.width}px - 10%)`,
          }}
          className="absolute text-[#D8BFD8] font-[700]"
        >
          {quadrantValues.bottomRight}
        </div>
      )}
      <div className="flex w-full mt-4 flex-col items-start gap-2">
        <div className="flex w-full mt-2 items-center gap-2">
          <label
            className="text-xs font-[500] whitespace-nowrap"
            htmlFor="labels-range-input"
          >
           {selectLabels[state.xLabel]}
          </label>
          <input
            id="labels-range-input"
            type="range"
            min={0}
            max={maxX}
            onChange={handleChangeX}
            defaultValue={0}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-500"
          />
          <div className="w-40 ml-10">{lineX}</div>
        </div>
        <div className="flex w-full mt-2 items-center gap-2">
          <label
            className="text-xs font-[500] whitespace-nowrap"
            htmlFor="labels-range-input"
          >
            {selectLabels[state.yLabel]}
          </label>
          <input
            id="labels-range-input"
            type="range"
            min={0}
            max={maxY}
            onChange={handleChangeY}
            defaultValue={0}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-500"
          />
          <div className="w-40 ml-10">{lineY}</div>
        </div>
      </div>
    </div>
  );
};

export default ScatterChart;
