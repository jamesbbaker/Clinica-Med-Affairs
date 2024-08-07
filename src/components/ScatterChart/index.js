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
  registerables,
} from "chart.js";
import {
  mapBarCharts,
  mapLabels,
  mapSelectLabels,
  patientTotals,
  selectLabels,
} from "../../constants/appConstants";
import BarChartPopup from "../../pages/Output/PatientOpportunityMapping/Popup";
import { IoTriangle } from "react-icons/io5";
import { FaCircle } from "react-icons/fa";
import { MdOutlineStar } from "react-icons/md";
import { FaSquare } from "react-icons/fa";

// Register required components from Chart.js
ChartJS.register(LinearScale, PointElement, Tooltip, Legend, BubbleController);
ChartJS.register(...registerables);

// Custom plugin for different marker shapes
// ChartJS.register({
//   id: "customBubbleShapes",
//   afterDraw: function (chart, args, options) {
//     const ctx = chart.ctx;
//     const datasets = chart.config.data.datasets;

//     datasets.forEach((dataset, i) => {
//       const meta = chart.getDatasetMeta(i);

//       if (!meta.hidden) {
//         meta.data.forEach((point, index) => {
//           const { x, y } = point.getProps(["x", "y"]);
//           const radius = point.options.radius;
//           if (dataset && dataset.shape && dataset.shape[index]) {
//             const shape = dataset.shape[index];
//             const color = dataset.backgroundColor[index];

//             ctx.save();
//             ctx.fillStyle = color;
//             ctx.beginPath();

//             switch (shape) {
//               case "circle":
//                 ctx.arc(x, y, radius, 0, Math.PI * 2);
//                 break;
//               case "square":
//                 ctx.rect(x - radius, y - radius, radius * 2, radius * 2);
//                 break;
//               case "triangle":
//                 ctx.moveTo(x, y - radius);
//                 ctx.lineTo(x + radius, y + radius);
//                 ctx.lineTo(x - radius, y + radius);
//                 ctx.closePath();
//                 break;
//               case "star":
//                 const outerRadius = radius;
//                 const innerRadius = radius / 2;
//                 for (let j = 0; j < 5; j++) {
//                   ctx.lineTo(
//                     x + outerRadius * Math.cos(((18 + j * 72) / 180) * Math.PI),
//                     y - outerRadius * Math.sin(((18 + j * 72) / 180) * Math.PI)
//                   );
//                   ctx.lineTo(
//                     x + innerRadius * Math.cos(((54 + j * 72) / 180) * Math.PI),
//                     y - innerRadius * Math.sin(((54 + j * 72) / 180) * Math.PI)
//                   );
//                 }
//                 ctx.closePath();
//                 break;
//               default:
//                 ctx.arc(x, y, radius, 0, Math.PI * 2);
//                 break;
//             }

//             ctx.fill();
//             ctx.restore();
//           }
//         });
//       }
//     });
//   },
// });

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
  scatterValue = true,
  setHcpProfilePage = () => {},
  type,
  setIsScatterMapOpen = () => {},
  quadrantValues,
  shapes = [
    {
      icon: <IoTriangle />,
      name: "Pulmonary Specialist",
    },
    {
      icon: <FaCircle />,
      name: "Allergy Specialist",
    },
    {
      icon: <FaSquare />,
      name: "Primary Care Provider",
    },
    {
      icon: <MdOutlineStar />,
      name: "Others",
    },
  ],
  lineX,
  lineY,
  payer = false,
  setLineX,
  handleDispatchData,
  setLineY,
  state,
  insititutional,
  data = defaultData,
  options = defaultOptions,
}) => {
  const chartRef = useRef(null);
  const [dataOptions, setOptions] = useState(options);

  function setChartDataValue(setValue, API_labels, data) {
    function generateChartData(array) {
      let _value = [];
      // console.log(array, data[0])
      array.forEach((item) => {
        _value.push(data[0][mapLabels[item]]);
      });
      return {
        labels: array.map((item) => mapSelectLabels[mapLabels[item]]),
        datasets: [
          {
            data: _value,
            borderColor: array.map((item) =>
              !patientTotals.includes(item) ? "#800000" : "#00008B"
            ),
            backgroundColor: array.map((item) =>
              !patientTotals.includes(item) ? "#800000" : "#00008B"
            ),
            barThickness: 20, // Set a specific thickness for the bar
            maxBarThickness: 20,
          },
        ],
      };
    }

    setValue({
      mapValue1: generateChartData(mapBarCharts.chart1),
      mapValue2: generateChartData(mapBarCharts.chart2),
      mapValue3: generateChartData(mapBarCharts.chart3),
      mapValue4: generateChartData(mapBarCharts.chart4),
      mapValue5: generateChartData(mapBarCharts.chart5),
      ...data,
    });
  }

  const [maxX, setMaxX] = useState();
  const [maxY, setMaxY] = useState();
  const [data1, setData1] = useState();
  const [lineValues, setLineValues] = useState({
    x: 0,
    y: 0,
  });

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
      elements: {
        point: {
          radius: 10,
        },
      },
      onClick: (evt) => {
        const elements = chartRef.current.getElementsAtEventForMode(
          evt,
          "nearest",
          { intersect: true },
          false
        );
        if (elements.length > 0) {
          const { datasetIndex, index } = elements[0];
          const dataset = data.datasets[datasetIndex];
          const dataPoint = dataset.data[index];
          setIsScatterMapOpen(scatterValue);
          setChartDataValue(setData1, null, [dataPoint]);
          setHcpProfilePage("scatter");
        }
      },
      responsive: true,
      plugins: {
        legend: {
          display: false, // Disable default legend
        },
        customBubbleShapes: {},
        tooltip: {
          callbacks: {
            label: function (context) {
              return payer
                ? `Payer Name: ${context.raw.name}, Plan Name: ${
                    context.raw["Plan Name"]
                  }, ${[selectLabels[state.xLabel]]}:${context.raw.x}, ${
                    selectLabels[state.yLabel]
                  }:${context.raw.y}, Number of ICS-LABA Patients: ${
                    context.raw.value
                  }`
                : insititutional
                ? `Hospital / Clinic Affiliation: ${
                    context.raw["Cleaned Affiliation"] ?  context.raw["Cleaned Affiliation"]  :  context.raw["Hospital"] 
                  }, Cleaned IDN/Parent Hospital: ${
                    context.raw["Cleaned IDN/Parent Hospital"] ?   context.raw["Cleaned IDN/Parent Hospital"] : context.raw["System"]
                  }, ${[selectLabels[state.xLabel]]}:${context.raw.x}, ${
                    selectLabels[state.yLabel]
                  }:${context.raw.y}, Number of ICS-LABA Patients: ${
                    context.raw.value
                  }`
                : `Name: ${context.raw.name}, ${[selectLabels[state.xLabel]]}:${
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

    return () => {
      if (timerX.current) {
        clearTimeout(timerX.current);
      }
      if (timerY.current) {
        clearTimeout(timerY.current);
      }
    };
  }, [state.xLabel, state.yLabel]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.options.plugins.arbitraryLine.lineX = lineX;
      chartRef.current.update();
      let labelValue = {
        xLabel: state.xLabel,
        yLabel: state.yLabel,
      };
      if (data && data.datasets) {
        handleDispatchData(labelValue);
      }
      setLineValues((prev) => ({
        ...prev,
        x: Number(lineX),
      }));
    }
  }, [lineX, dataOptions]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.options.plugins.arbitraryLine.lineY = lineY;
      chartRef.current.update();
      let labelValue = {
        xLabel: state.xLabel,
        yLabel: state.yLabel,
      };
      if (data && data.datasets) {
        handleDispatchData(labelValue);
      }
      setLineValues((prev) => ({
        ...prev,
        y: Number(lineY),
      }));
    }
  }, [lineY, dataOptions]);

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

  const timerX = useRef(null);
  const timerY = useRef(null);

  const handleChangeX = (e) => {
    setLineValues((prev) => ({
      ...prev,
      x: Number(e.target.value),
    }));
    if (timerX.current) {
      clearTimeout(timerX.current);
    }
    timerX.current = setTimeout(() => {
      setLineX(Number(e.target.value));
    }, 1000);
  };

  const closeModal = () => {
    setIsScatterMapOpen(false);
    setData1(null);
    setHcpProfilePage(null);
  };

  const handleChangeY = (e) => {
    setLineValues((prev) => ({
      ...prev,
      y: Number(e.target.value),
    }));
    if (timerY.current) {
      clearTimeout(timerY.current);
    }
    timerY.current = setTimeout(() => {
      setLineY(Number(e.target.value));
    }, 1000);
  };

  return (
    <div className="min-h-[400px] relative w-full">
      {data1 ? (
        <BarChartPopup
          type={type}
          InstitutionalTreeMap={false}
          insititutional={insititutional}
          payer={payer}
          payerData={payer}
          closeModal={closeModal}
          data1={data1}
        />
      ) : (
        <>
          <div className="w-full flex -mb-[1%] justify-center gap-4">
            {shapes.map((item, index) => (
              <div key={index} className="flex gap-1 items-center">
                {item.icon}
                <div className="text-sm">{item.name}</div>
              </div>
            ))}
          </div>
          <div className="relative w-auto h-auto">
            <div className="absolute border text-[#4B0082] font-[700] top-[14%] left-[8%]">
              {quadrantValues.topLeft}
            </div>

            <div className="absolute border text-[#FF0000] font-[700] right-[8%] top-[14%]">
              {quadrantValues.topRight}
            </div>

            {chartRef.current && (
              <div
                style={{ bottom: `14%` }}
                className="absolute border text-[#000] font-[700] left-[8%]"
              >
                {quadrantValues.bottomLeft}
              </div>
            )}
            {chartRef.current && (
              <div
                style={{
                  bottom: `14%`,
                  right: `8%`,
                }}
                className="absolute border text-[#D8BFD8] font-[700]"
              >
                {quadrantValues.bottomRight}
              </div>
            )}
            <Bubble height={100} ref={chartRef} data={data} options={dataOptions} />
          </div>

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
                value={lineValues.x}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-500"
              />
              <div className="w-40 ml-10">
                <input
                  id="labels-range-input"
                  type="number"
                  value={lineValues.x}
                  max={maxX}
                  onChange={handleChangeX}
                  className="w-full p-4 h-1 cursor-pointer"
                />
              </div>
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
                value={lineValues.y}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-500"
              />
              <div className="w-40 ml-10">
                <input
                  id="labels-range-input"
                  type="number"
                  value={lineValues.y}
                  max={maxY}
                  onChange={handleChangeY}
                  className="w-full p-4 h-1 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ScatterChart;
