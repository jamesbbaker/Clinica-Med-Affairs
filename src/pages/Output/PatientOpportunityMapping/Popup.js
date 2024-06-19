import React, { useContext, useEffect, useState } from "react";
import BarChart, { _data } from "../../../components/BarChart";
import { getDataStats } from "../../../API/Outputs";
import { AuthContext } from "../../../context/AuthContext";
import { LineChart } from "../../../components/LineChart";
import {
  selectLabels,
} from "../../../constants/appConstants";
import { MultiSelect } from "react-multi-select-component";

const randomColors = [
  "#d43c1b",
  "#3b5fb0",
  "#9ec342",
  "#e8a62d",
  "#7167f4",
  "#4de38a",
  "#e048bb",
  "#bcff2b",
  "#fa5766",
  "#5cd8e3",
  "#a3fa34",
  "#f1c76b",
  "#57b4a8",
  "#d20e8c",
  "#473e27",
];

export function convertToQuarter(dateStr) {
  // Split the input date string
  let [year, month] = dateStr.split('-');

  // Convert month to zero-indexed integer
  let monthIndex = parseInt(month, 10) - 1; // Subtract 1 because months are zero-indexed in JavaScript
  
  // Check if the parsed values are valid
  if (isNaN(year) || isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
      return "Invalid Date";
  }

  // Create a new Date object with extracted year and month
  let date = new Date(year, monthIndex);

  // Get the quarter and year
  let quarter = Math.floor(date.getMonth() / 3) + 1; // Calculate quarter
  let formattedYear = date.getFullYear();

  // Construct the quarter-year string
  let quarterStr = `Q${quarter}-${formattedYear}`;

  return quarterStr;
}

const options = {
  responsive: true,
  scales: {
    x: {
      title: {
        display: false,
      },
      type: "category",
      time: {
        unit: "month",
      },

      grid: {
        display: false,
      },
      // grid: {
      //   drawOnChartArea: false,
      //   drawOnAxisArea: false,
      // },
      // ticks: {
      //   callback: function (value) {
      //     console.log(value)
      //     return `${convertToQuarter(value)}`;
      //   },
      // },
    },
    y: {
      ticks: {
        // Include a dollar sign in the ticks
        callback: function (value, index, ticks) {
          return `${value}`;
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
    datalabels: {
      display: false,
    },
  },
};

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "m";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + "k";
  }
  return num.toLocaleString();
};

const filterOptions = [...Object.keys(selectLabels)];

const BarChartPopup = ({ data1 }) => {
  const { accessToken, refreshToken } = useContext(AuthContext);
  const [fetchedData, setFetchedData] = useState(null);
  const [unmetNeed, setUnmetNeed] = useState([
    { label: filterOptions[0], value: filterOptions[0] },
  ]);
  const [lineChartData, setLineChartData] = useState(null);

  function addLineData(_data) {
    let lineDataFilter = _data.filter((item) => {
      const year = parseInt(item.Quarter.split("-")[0]);
      const month = parseInt(item.Quarter.split("-")[1]);

      // Filter for years from 2016 to 2023 (inclusive) and exclude January 2024
      return (
        (year > 2016 || (year === 2016 && month >= 1)) &&
        (year < 2024 || (year === 2023 && month <= 12))
      );
    });
    lineDataFilter.sort((a, b) => new Date(a.Quarter) - new Date(b.Quarter));
    let _labels = lineDataFilter.map((item) => convertToQuarter(item.Quarter));
   
    let data = {
      labels: _labels,
      datasets: unmetNeed.map((item, index) => {
        return {
          label: item.label,
          data: lineDataFilter.map((_item) => _item[item.value]),
          borderColor: randomColors[index] ? randomColors[index] : "#c4c4c4",
          backgroundColor: randomColors[index]
            ? randomColors[index]
            : "#c4c4c4",
        };
      }),
    };

    setLineChartData(data);
  }

  useEffect(() => {
    if (data1) {
      getDataStats(
        `hcp_quarterly?Provider_ID=${data1[0]["Provider ID"]}`,
        accessToken,
        refreshToken
      )
        .then((res) => {
          let response = { ...res };
          addLineData(response.data);
          setFetchedData(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [data1]);

  useEffect(() => {
    if (fetchedData) {
      addLineData(fetchedData);
    }
  }, [unmetNeed]);

  const handleSelectMultipleUnmet = (val) => {
    setUnmetNeed(val);
  };

  return (
    <div className="flex flex-col h-[80vh] overflow-y-auto items-start gap-4">
      <div className="flex text-lg py-6 flex-col mt-4 items-start gap-4">
        <div className="flex items-center">
          Name:{" "}
          <strong className="ml-2">
            {data1["0"]["Assigned Physician Name"]}
          </strong>
        </div>
        <div className="flex items-center">
          Primary Specialty Description:{" "}
          <strong className="ml-2">
            {data1["0"]["Primary Specialty Description"]}
          </strong>
        </div>
        <div className="flex items-center">
          Region: <strong className="ml-2">{data1["0"]["Region"]}</strong>
        </div>
      </div>
      <div className="w-[80vw] gap-5 grid grid-cols-2">
        <div>
          <BarChart
            label={`Diagnosis and Investigation`}
            height={80}
            data={data1.mapValue1}
          />
        </div>
        <div>
          <BarChart
            label={`Treatment (ICS or beta-agonist)`}
            height={80}
            data={data1.mapValue3}
          />
        </div>
        <div>
          <BarChart
            label={`Treatment (ICS-LABA)`}
            height={80}
            data={data1.mapValue4}
          />
        </div>
        <div>
          <BarChart
            label={`Treatment (ICS-LABA-LAMA)`}
            height={80}
            data={data1.mapValue5}
          />
        </div>
      </div>
      <div className="flex mt-4 items-center gap-4">
        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          Select Unmet Need
        </label>
        <MultiSelect
          labelledBy=""
          options={filterOptions.map((item) => ({
            label: selectLabels[item] ? selectLabels[item] : item,
            value: item,
          }))}
          className="w-[20rem] z-[5]"
          value={unmetNeed || []}
          onChange={(val) => handleSelectMultipleUnmet(val)}
        />
      </div>
      {lineChartData ? (
        <LineChart data={lineChartData} options={options} arbitrary={false} />
      ) : (
        <div className="flex flex-col w-full h-[400px] justify-center items-center">
          <div className="text-center">
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarChartPopup;
