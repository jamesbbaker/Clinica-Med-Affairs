import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Line } from "react-chartjs-2";

import { Chart as ChartJS, registerables } from "chart.js";
import "chartjs-adapter-date-fns"; // Import the date-fns adapter
import BarChart from "../BarChart";

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

let arbitraryLine = {
  id: "arbitraryLine",
  beforeDatasetsDraw(chart, args, pluginOptions) {},
};

const colors = [
  { name: "Pulmonary Specialist", rgba: "rgba(135, 206, 235, 1)" },
  { name: "Allergy Specialist", rgba: "rgba(34, 139, 34, 1)" },
  { name: "Primary Care Provider", rgba: "rgba(220, 20, 60, 1)" },
  { name: "Others", rgba: "rgba(255, 215, 0, 1)" },
];

const calculateShapes = (val) => {
  let shape1Count = 0;
  let shape2Count = 0;
  let shape3Count = 0;
  let shape4Count = 0;
  let shape1 = [
    "PULMONARY DISEASE",
    "PEDIATRIC PULMONOLOGY",
    "PULMONARY CRITICAL CARE MEDICINE",
  ];
  let shape2 = ["ALLERGY & IMMUNOLOGY"];
  let shape3 = [
    "FAMILY MEDICINE",
    "PEDIATRICS",
    "INTERNAL MEDICINE",
    "GENERAL PRACTICE",
    "INTERNAL MEDICINE/PEDIATRICS",
    "GERIATRIC MEDICINE (INTERNAL MEDICINE)",
    "GERIATRIC MEDICINE (FAMILY MEDICINE)",
  ];
  val.forEach((item) => {
    if (shape1.includes(item)) {
      shape1Count += 1;
    } else if (shape2.includes(item)) {
      shape2Count += 1;
    } else if (shape3.includes(item)) {
      shape3Count += 1;
    } else {
      shape4Count += 1;
    }
  });

  return [shape1Count, shape2Count, shape3Count, shape4Count];
};

export const _options = {
  indexAxis: "x",
  elements: {
    bar: {
      borderWidth: 1,
    },
  },
  responsive: true,
  scales: {
    x: {
      ticks: {
        min: 0,
        autoSkip: false,
        font: {
          size: 13.5,
          weight: 500,
        },
        color: "#000",
      },
    },
    y: {
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

export function LineChart({
  arb_value = 0,
  setPageData = () => {},
  primarySpecialtyData,
  key = null,
  arbitrary = true,
  options = defaultOptions,
  data = defaultData,
  height = 100,
  updateRef,
  barchartData,
  setBarChartData = () => {}
}) {
  const [selectedValue, setSelectedValue] = useState(0);
  const [chartData, setChartData] = useState(data);
  const [arbitraryLineValues, setArbitraryLine] = useState({
    min: 0,
    max: 0,
  });

  const timerRef = useRef(null);


  useEffect(() => {
    if (arb_value && !updateRef.current) {
      updateRef.current = true
      handleChange({target: {value: arb_value}});
    } 
  }, [arb_value]);

  const handleChange = (e) => {
    let _val = parseInt(e.target.value);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      if (lineRef.current) {
        arbitraryLine.beforeDatasetsDraw(lineRef.current);
        lineRef.current.setActiveElements([
          { datasetIndex: _val - 1, hovered: false, index: _val },
        ]);
        lineRef.current.update();
        if (primarySpecialtyData && _val) {
          let _newPrimaryData = [...primarySpecialtyData];
          
          let primaryData = _newPrimaryData.splice(0, _val);

          let data = calculateShapes(primaryData);
          let _barChartData = {
            labels: colors.map((item) => item.name),
            datasets: [
              {
                data,
                borderColor: colors.map((item) => item.rgba),
                backgroundColor: colors.map((item) => item.rgba),
              },
            ],
          };
          setBarChartData(_barChartData);
        }
        if (_val === 0) {
          setBarChartData(null);
        }
        setPageData((prev) => ({
          ...prev,
          value: _val,
        }));
      }
    }, 50);
    setSelectedValue(_val);
  };

  useEffect(() => {
    if (data) {
      // setSelectedValue(0);
      setChartData(data);
      // if (updateRef.current) {
      //   handleChange({target: {value: 0}})
      // }
      setArbitraryLine((prev) => ({
        ...prev,
        max: data.labels.length,
      }));
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [data]);

  const intersectDataVerticalLine = useMemo(
    () => ({
      id: "intersectDataVerticalLine",
      afterDraw: (chart) => {
        if (chart.getActiveElements().length) {
          const activePoint = chart.getActiveElements()[0];
          const {
            ctx,
            chartArea: { top, bottom },
            scales: { x },
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
    }),
    []
  );

  const lineRef = useRef(null);

  return (
    <div className="w-full h-full px-2 pt-4">
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
      {barchartData && (
        <div className="my-8 w-full">
          <BarChart
            height={60}
            data={barchartData}
            options={_options}
            // options={BarChartOptions}
          />
        </div>
      )}

      {arbitrary && (
        <div className="px-2 py-4">
          <div className="text-xs flex items-center justify-between w-full">
            <input
              id="labels-range-input"
              type="number"
              // value={lineX}
              value={selectedValue}
              // max={maxX}
              onChange={handleChange}
              className="w-[30%] p-4 h-1 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-xs" htmlFor="labels-range-input">
              Number of HCPs to prioritize
            </label>
            <input
              id="labels-range-input"
              type="range"
              min={0}
              value={selectedValue}
              max={arbitraryLineValues.max}
              onChange={handleChange}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
