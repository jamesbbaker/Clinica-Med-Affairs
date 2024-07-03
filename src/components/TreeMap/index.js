import React, { useState } from "react";
import { Chart } from "react-google-charts";
import { getRandomInt } from "../../utils/MathUtils";
import Popup from "reactjs-popup";
import { breakString, removeCommasFromString } from "../../utils/StringUtils";
import BarChart from "../BarChart";
import { EPL_TABLE_COLUMNS } from "../../constants/appConstants";
import tableData from "../Table/table-data.json";

export const defaultData = [
  [
    "Location",
    "Parent",
    "Market trade volume (size)",
    "Market increase/decrease (color)",
  ],
  ["Global", null, 0, 0],
  ["America", "Global", 0, 0],
  ["Europe", "Global", 0, 0],
  ["Asia", "Global", 0, 0],
  ["Australia", "Global", 0, 0],
  ["Africa", "Global", 0, 0],
  ["Brazil", "America", 11, 10],
  ["USA", "America", 52, 31],
  ["Mexico", "America", 24, 12],
  ["Canada", "America", 16, -23],
  ["France", "Europe", 42, -11],
  ["Germany", "Europe", 31, -2],
  ["Sweden", "Europe", 22, -13],
  ["Italy", "Europe", 17, 4],
  ["UK", "Europe", 21, -5],
  ["China", "Asia", 36, 4],
  ["Japan", "Asia", 20, -12],
  ["India", "Asia", 40, 63],
  ["Laos", "Asia", 4, 34],
  ["Mongolia", "Asia", 1, -5],
  ["Israel", "Asia", 12, 24],
  ["Iran", "Asia", 18, 13],
  ["Pakistan", "Asia", 11, -52],
  ["Egypt", "Africa", 21, 0],
  ["S. Africa", "Africa", 30, 43],
  ["Sudan", "Africa", 12, 2],
  ["Congo", "Africa", 10, 12],
  ["Zaire", "Africa", 8, 10],
  ["Alabama", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Alaska", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Arizona", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Arkansas", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["California", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Colorado", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Connecticut", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Delaware", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Florida", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Georgia", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Hawaii", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Idaho", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Illinois", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Indiana", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Iowa", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Kansas", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Kentucky", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Louisiana", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Maine", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Maryland", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Massachusetts", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Michigan", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Minnesota", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Mississippi", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Missouri", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Montana", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Nebraska", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Nevada", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["New Hampshire", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["New Jersey", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["New Mexico", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["New York", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["North Carolina", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["North Dakota", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Ohio", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Oklahoma", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Oregon", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Pennsylvania", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Rhode Island", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["South Carolina", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["South Dakota", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Tennessee", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Texas", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Utah", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Vermont", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Virginia", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Washington", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["West Virginia", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Wisconsin", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
  ["Wyoming", "USA", getRandomInt(0, 100), getRandomInt(-50, 50)],
];

export const defaultOptions = {
  minColor: "#ffef96",
  midColor: "#ff6e73",
  maxColor: "#d2177a",
  headerHeight: 15,
  fontColor: "black",
  title: "Asthma Patients by States",
  titleTextStyle: {
    color: "#888",
    textAlign: "center",
  },
  colorAxis: {
    values: [0, 1000, 10000, 100005, 1000000], // Define custom values for the color axis
    colors: ["#ffef96", "#ff6e73", "white", "white", "#d2177a"], // Define colors for the color axis
  },
  showScale: false,
  generateTooltip: (_row, _size, value) => {
    return (
      '<div style="background:rgb(0 141 218); color:#fff; padding:10px; border-style:solid, zIndex: 10"> ' +
      _size.toLocaleString() +
      "</div>"
    );
  },
};

const BarChartOptions = {
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
        font: {
          size: 10,
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
        // Include a dollar sign in the ticks
        callback: function (value, index, ticks) {
          return value ? `${value}%` : 0;
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
    tooltip: {
      callbacks: {
        title: function (context) {
          let title = context[0].label;
          return removeCommasFromString(title);
        },
        label: function (context) {
          let label = context.formattedValue;
          return label ? `${label}%` : 0;
        },
      },
    },
  },
};

const TreeMap = ({
  values,
  chartEvents,
  payerTable=false,
  preventDrill = false,
  needCallbacks = true,
  options = defaultOptions,
  data = defaultData,
  handleOpen = () => {},
}) => {
  const [openPopup, setOpenPopup] = useState(false);

  const [barChartConfig, setBarChartConfig] = useState(null);
  const handleClick = (row, value, data) => {
    
    if(preventDrill) {
      handleOpen(row, value, data);
      return
    }
    setOpenPopup((o) => !o);
 
    return;
    const barChartData = {
      labels: EPL_TABLE_COLUMNS.map((item) => breakString(item.Header, 40)),
      datasets: [
        {
          data: Object.values(
            tableData.find((obj) => parseInt(obj[row].split("%")[0]) === value)
          ).map((item) => item.split("%")[0]),
          borderColor: "rgb(155, 249, 122)",
          backgroundColor: "rgb(155, 249, 122, 0.4)",
        },
      ],
    };
    setBarChartConfig(barChartData);
  };

  const handleClose = () => {
    setOpenPopup((o) => !o);
    setBarChartConfig(null);
  };

  const handleChartClick = () => {
    console.log("first");
  };


  return (
    <div className="relative">
      {values && <div className="flex absolute justify-between -top-5 w-[32%] right-[2%]">
        <div>{values.min}</div>
        <div>{values.max}</div>
        </div>}
      <Chart
        chartType="TreeMap"
        width="100%"
        height={"800px"}
        data={data}
        options={options}
        chartEvents={[
          {
            eventName: "select",
            callback: ({ chartWrapper, google }) => {
              if (!needCallbacks) {
                return;
              }
              const chart = chartWrapper.getChart();
              const data = chartWrapper.getDataTable();
              google.visualization.events.addListener(
                chart,
                "select",
                function (e) {
                  var selection = chart.getSelection();
                  if (selection.length > 0) {
                    if (data.getValue(selection[0].row, 0).length > 2) {
                      let column = data
                      .getValue(selection[0].row, 0)
                      .split("_")[0];
                      let value = data.getValue(selection[0].row, 2);
                      let _data = data.getValue(selection[0].row, 3);
                      handleClick(column, value, _data);
                    }
                  }
                }
              );
            },
          },
        ]}
      />
      {/* <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: '20px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#ffef96', marginRight: '5px' }}></div>
          <span>0</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: '20px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#ff6e73', marginRight: '5px' }}></div>
          <span>25</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: '20px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: 'white', border: '1px solid black', marginRight: '5px' }}></div>
          <span>50</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: '20px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: 'white', border: '1px solid black', marginRight: '5px' }}></div>
          <span>75</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#d2177a', marginRight: '5px' }}></div>
          <span>100</span>
        </div>
      </div> */}
      <Popup
        onClose={handleClose}
        modal
        open={openPopup}
        position="center center"
      >
        <div className="w-extraLarge">
          {barChartConfig && (
            <BarChart
              height={250}
              data={barChartConfig}
              options={BarChartOptions}
            />
          )}
        </div>
      </Popup>
    </div>
  );
};

export default TreeMap;
