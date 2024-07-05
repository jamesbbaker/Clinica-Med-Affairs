import React, { useEffect, useState } from "react";
import { LineChart } from "../../../../components/LineChart";
import {
  invertedMapLabels,
  mapLabels,
  selectLabels,
} from "../../../../constants/appConstants";
import { MultiSelect } from "react-multi-select-component";
import { convertToQuarter } from "../../PatientOpportunityMapping/Popup";
import { customOptionRenderer } from "../../../../components/Table";

const customStyles = {
  menu: (provided) => ({
    ...provided,
    zIndex: 1000, // Increase this value as needed
  }),
};

const options = {
  responsive: true,
  scales: {
    x: {
      title: {
        display: false,
      },
      type: "category",
      scaleLabel: {
        display: true,
        labelString: 'Date',
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
      //     console.log(value, "value")
      //     const date = new Date(value);
      //     const year = date.getFullYear();
      //     const month = date.getMonth();

      //     let quarter;
      //     if (month < 3) {
      //       quarter = "Q1";
      //     } else if (month < 6) {
      //       quarter = "Q2";
      //     } else if (month < 9) {
      //       quarter = "Q3";
      //     } else {
      //       quarter = "Q4";
      //     }

      //     return `${quarter}-${year}`;
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

const filterOptions = [...Object.keys(selectLabels)];

const ImpactLineChart = ({ lineData, type = "National" }) => {
  const [lineChartData, setLineChartData] = useState();
  const [unmetNeed, setUnmetNeed] = useState([
    { label: filterOptions[0], value: filterOptions[0] },
  ]);
  const [RegionsList, setRegionsList] = useState();
  const [stateList, setStatesList] = useState();
  const [selectedStates, setSelectedStates] = useState();
  const [selectedRegion, setSelectedRegion] = useState([]);
  const [loading, setLoading] = useState(false);

  function addLineData(initial) {
    let filtersName = {};
    Object.entries(mapLabels).forEach((item) => {
      filtersName[item[1]] = item[0];
    });
    let lineDataFilter = lineData.filter((item) => {
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
    let data = {};
    if (type === "Region") {
      const lineDataByRegion = {};
      lineDataFilter.forEach((item) => {
        if (!lineDataByRegion[item.Region]) {
          lineDataByRegion[item.Region] = {
            id: item.Region,
            data: [],
          };
        }

        // lineDataByRegion[item.Region].data.push(item[filtersName[unmetNeed]]);
        lineDataByRegion[item.Region].data.push(item);
      });
      setRegionsList(Object.keys(lineDataByRegion));
      let _selectedRegions = [];
      if (initial) {
        _selectedRegions = Object.keys(lineDataByRegion).map((item) => ({
          value: item,
          label: item,
        }));
        setSelectedRegion(_selectedRegions);
      } else {
        if (selectedRegion) {
          _selectedRegions = [...selectedRegion];
        } else {
          _selectedRegions = [];
        }
      }
      if (_selectedRegions) {
        _selectedRegions = _selectedRegions.map((item) => item.value);
      }

      let _index = 0;

      let datasets = [];
      unmetNeed.map((unmet, index) =>
        Object.values(lineDataByRegion)
          .filter((item) => _selectedRegions.includes(item.id))
          .forEach((item) => {
            datasets.push({
              label: `${item.id} (${unmet.value})`,
              data: item.data.map((_item) => _item[filtersName[unmet.value]]),
              borderColor: randomColors[_index]
                ? randomColors[_index]
                : "#c4c4c4c4",
              backgroundColor: randomColors[_index]
                ? randomColors[_index]
                : "#c4c4c4c4",
            });
            _index++;
          })
      );
      data = {
        labels: [...new Set(_labels)],
        datasets: datasets,
      };
    } else if (type === "State") {
      const lineDataByState = {};

      lineDataFilter.filter(item => item["State ID"]).forEach((item) => {
        if (!lineDataByState[item["State ID"]]) {
          lineDataByState[item["State ID"]] = {
            id: item["State ID"],
            data: [],
          };
        }
        lineDataByState[item["State ID"]].data.push(item);
      });
      setStatesList(Object.keys(lineDataByState));
      let _selectedStates = [];
      if (initial) {
        _selectedStates = Object.keys(lineDataByState)
          .map((item) => ({
            value: item,
            label: item,
          }))
          .filter((item, index) => index <= 5);
        setSelectedStates(_selectedStates);
      } else {
        if (selectedStates) {
          _selectedStates = [...selectedStates];
        } else {
          _selectedStates = [];
        }
      }
      if (_selectedStates) {
        _selectedStates = _selectedStates.map((item) => item.value);
      }
      let datasets = [];
      let _index = 0;
      unmetNeed.map((unmet, index) =>
        Object.values(lineDataByState)
          .filter((item) => _selectedStates.includes(item.id))
          .forEach((item) => {
            datasets.push({
              label: `${item.id} (${unmet.value})`,
              data: item.data.map((_item) => _item[filtersName[unmet.value]]),
              borderColor: randomColors[_index]
                ? randomColors[_index]
                : "#c4c4c4",
              backgroundColor: randomColors[_index]
                ? randomColors[_index]
                : "#c4c4c4",
            });
            _index++;
          })
      );

      data = {
        labels: [...new Set(_labels)],
        datasets: datasets,
      };
    } else {
      data = {
        labels: _labels,
        datasets: unmetNeed.map((item, index) => {
          return {
            label: item.label,
            data: lineDataFilter.map(
              (_item) => _item[invertedMapLabels[item.value]]
            ),
            borderColor: randomColors[index] ? randomColors[index] : "#c4c4c4",
            backgroundColor: randomColors[index]
              ? randomColors[index]
              : "#c4c4c4",
          };
        }),
      };
    }
    setLineChartData(data);
    setLoading(false);
  }

  useEffect(() => {
    if (lineData) {
      addLineData();
    }
  }, [unmetNeed]);

  useEffect(() => {
    if (lineData) {
      addLineData(true);
    }
  }, [lineData]);


  const handleToggleSelect = (val, type) => {
    if (type === "region") {
      setSelectedRegion(val);
    } else {
      setSelectedStates(val);
    }
  };

  const handleApplyFilter = () => {
    setLoading(true)
    addLineData();
  };

  const handleSelectMultipleUnmet = (val) => {
    setUnmetNeed(val);
  };

  return lineChartData ? (
    <div className="mt-4 mb-8 w-full">
      <div className="flex flex-col items-start w-full justify-between">
        <div className="flex items-center gap-8">
          {RegionsList && type === "Region" && (
            <div className="flex items-center gap-4">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Region Select
              </label>
              <MultiSelect
                labelledBy=""
                options={RegionsList.map((item) => ({
                  label: item,
                  value: item,
                }))}
                className="w-[10rem] z-[10]"
                value={selectedRegion || []}
                onChange={(val) => handleToggleSelect(val, "region")}
                styles={customStyles} 
              />
            </div>
          )}
          {stateList && type === "State" && (
            <div className="flex items-center gap-4">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                State Select
              </label>
              <MultiSelect
                labelledBy=""
                options={stateList.map((item) => ({
                  label: item,
                  value: item,
                }))}
                className="w-[10rem] z-[10]"
                value={selectedStates || []}
                onChange={(val) => handleToggleSelect(val, "state")}
                styles={customStyles} 
              />
            </div>
          )}
          {type !== "National" && (
            <button
              disabled={loading}
              onClick={handleApplyFilter}
              className="w-40 font-[600] h-10 border border-black rounded-md hover:bg-[#c4c4c4]"
            >
              {loading ? (
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
              ) : (
                "Apply Filter"
              )}
            </button>
          )}
        </div>
        <div className="flex mt-4 items-center gap-4">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Select Unmet Need
          </label>
          <MultiSelect
              ItemRenderer={customOptionRenderer}
            labelledBy=""
            options={filterOptions.map((item) => ({
              label: selectLabels[item] ? selectLabels[item] : item,
              value: item,
            }))}
            className="w-[20rem] z-[5]"
            value={unmetNeed || []}
            onChange={(val) => handleSelectMultipleUnmet(val)}
            styles={customStyles} 
          />
        </div>
      </div>

      <LineChart options={options} data={lineChartData} arbitrary={false} />
    </div>
  ) : (
    <div className="h-[200px] flex flex-col items-center justify-center">
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
  );
};

export default ImpactLineChart;
