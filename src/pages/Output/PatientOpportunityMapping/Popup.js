import React, { useContext, useEffect, useState } from "react";
import BarChart from "../../../components/BarChart";
import { getDataStats } from "../../../API/Outputs";
import { AuthContext } from "../../../context/AuthContext";
import { LineChart } from "../../../components/LineChart";
import {
  invertedMapLabels,
  labelsMatrix,
  patientTotals,
  selectLabels,
} from "../../../constants/appConstants";
import { MultiSelect } from "react-multi-select-component";
import { IoArrowBackCircle } from "react-icons/io5";
import PrimaryBtn from "../../../components/PrimaryBtn";
import InputField from "../../../components/InputField";
import { filterOutLabels } from "../../../utils/MapUtils";
import { CustomOptionRenderer } from "../../../components/Table";
import { Bounce, toast, ToastContainer } from "react-toastify";

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
  let [year, month] = dateStr.split("-");

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

const lineChartOptions = {
  responsive: true,
  scales: {
    x: {
      title: {
        display: false,
      },
      type: "category",
      scaleLabel: {
        display: true,
        labelString: "Date",
      },

      grid: {
        display: false,
      },
    },
    y: {
      ticks: {
        callback: function (value) {
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
const lineChartOptions2 = {
  responsive: true,
  scales: {
    x: {
      title: {
        display: false,
      },
      type: "category",
      scaleLabel: {
        display: true,
        labelString: "Date",
      },

      grid: {
        display: false,
      },
    },
    y: {
      ticks: {
        callback: function (value) {
          return `${value}%`;
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
const defaultOptions = {
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
const filterOptions = [...Object.keys(selectLabels)];

const BarChartPopup = ({
  type = "",
  insititutional = false,
  InstitutionalTreeMap = false,
  closeModal,
  secondaryType,
  data1,
  payer = false,
  payerData = false,
}) => {
  const { accessToken, refreshToken } = useContext(AuthContext);
  const [fetchedData, setFetchedData] = useState(null);
  const [saveInfo, setSaveInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unmetNeed, setUnmetNeed] = useState([
    {
      label: "Incomplete initial asthma testing",
      value: "Number of No Spirometry",
    },
  ]);
  const { selectedUnmet } = useContext(AuthContext);

  useEffect(() => {
    if (selectedUnmet && selectedUnmet.length > 0) {
      let defaultUnmet = selectedUnmet.find(
        (item) => !item.value.toLowerCase().includes("percent")
      );
      setUnmetNeed([defaultUnmet]);
    }
  }, [selectedUnmet]);
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

    console.log(unmetNeed);
    let data = {
      chart1: {
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
      },
      chart2: {
        labels: _labels,
        datasets: [
          ...unmetNeed
            .filter(
              (item) =>
                labelsMatrix[item.value] && [labelsMatrix[item.value].Percent]
            )
            .map((item, index) => {
              return {
                label: selectLabels[labelsMatrix[item.value].Percent],
                data: lineDataFilter.map(
                  (_item) => _item[labelsMatrix[item.value].Percent]
                ),
                borderColor: randomColors[index]
                  ? randomColors[index]
                  : "#c4c4c4",
                backgroundColor: randomColors[index]
                  ? randomColors[index]
                  : "#c4c4c4",
              };
            }),
        ],
      },
    };

    setLineChartData(data);
  }

  useEffect(() => {
    if (data1) {
      let key = "";
      if (type === "HCP") {
        key = data1[0]["Provider ID"].toString();
      } else if (type === "Hospital") {
        key = data1[0]["Hospital"].toString();
      } else if (type === "Plan") {
        key = data1[0]["Plan Name"].toString();
      } else if (type === "planTreeMap") {
        key = data1[0].Item.toString().split("_")[0];
      } else if (type === "hospitalTreeMap") {
        key = data1[0].Hospital
          ? data1[0].Hospital.toString()
          : data1[0].Item.toString().split("_")[0];
      }

      setSaveInfo({
        type:
          type === "planTreeMap"
            ? "Plan"
            : type === "hospitalTreeMap"
            ? "Hospital"
            : type,
        key,
      });
    }
    if (data1) {
      if (type === "Hospital" || type === "hospitalTreeMap") {
        let key = data1[0].Hospital
          ? data1[0].Hospital.toString()
          : data1[0].Item.toString().split("_")[0];
        getDataStats(
          `hospital_quarterly?Hospital=${key}`,
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
      } else if (!payerData) {
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
      } else {
        getDataStats(
          `plan_quarterly?Plan=${data1[0]["Plan Name"]}`,
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
    }
  }, [data1, type]);

  useEffect(() => {
    if (fetchedData) {
      addLineData(fetchedData);
    }
  }, [unmetNeed, fetchedData]);

  const handleSelectMultipleUnmet = (val) => {
    setUnmetNeed(val);
  };

  const handleSave = async () => {
    setLoading(true);
    let data = { ...saveInfo };
    try {
      const response = await fetch(
        "https://clinica-server.replit.app/set_list",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        }
      );
      const res = await response.json();
      setLoading(false);
      toast.success("Saved successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.log(res, "res");
    } catch (err) {
      console.log(err);
      throw new Error();
    }
  };

  const [options, setOptions] = useState(defaultOptions);

  useEffect(() => {
    if (selectedUnmet.length > 0) {
      let _selectedUnmetsObj = {};
      selectedUnmet.forEach((element) => {
        _selectedUnmetsObj[element.label] = element;
      });
      let _options = {
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
              font: function (context) {
                const label = context.tick.label;
                // Example condition: Make 'Career' label bold
                return _selectedUnmetsObj.hasOwnProperty(label)
                  ? { size: 13.5, weight: "bold" }
                  : { size: 13.5 };
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
      setOptions(_options);
    }
  }, [selectedUnmet]);

  return (
    <div
      className={`flex flex-col ${
        !InstitutionalTreeMap && `items-start`
      } gap-4`}
    >
      <ToastContainer />
      <div className="flex w-full justify-between items-center">
      <button
        onClick={closeModal}
        className="flex-end  text-md rounded-sm"
      >
        <IoArrowBackCircle size={30} />
      </button>
      <div className="flex ml-auto items-center gap-1">
        <PrimaryBtn
          disabled={loading}
          className={"px-4 text-[#fff]"}
          text={"Save to List"}
          onClick={handleSave}
        />
      </div>
      </div>
      <div
        style={{
          justifyContent: payerData && !payer ? "space-between" : "flex-start",
          width: "100%",
          gap: payerData && !payer ? "unset" : "1rem",
          flexDirection: payerData && !payer ? "row" : "column",
        }}
        className="flex text-lg py-6 flex-col mt-4 items-start"
      >
        {insititutional ? (
          <div className="flex w-full justify-between items-start">
            <div className="flex flex-col items-start">
              <div className="flex items-center">
                Hospital / Clinic Affiliation
                <strong className="ml-2">
                  {InstitutionalTreeMap
                    ? type === "hospitalTreeMap" && secondaryType !== "Treemap"
                      ? data1[0].Hospital
                      : data1[0]["Item"] && data1[0]["Item"].split("_")[0]
                    : data1[0]["Cleaned Affiliation"]}
                </strong>
              </div>
              <div className="flex items-center">
                Cleaned IDN/Parent Hospital
                <strong className="ml-2">
                  {InstitutionalTreeMap
                    ? type === "hospitalTreeMap" && secondaryType !== "Treemap"
                      ? data1[0].System
                      : data1[0]["Parent"] && data1[0]["Parent"] === "GLOBAL"
                      ? data1[0]["Item"] && data1[0]["Item"].split("_")[0]
                      : data1[0]["Parent"].split("_")[0]
                    : data1[0]["Cleaned IDN/Parent Hospital"]}
                </strong>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex w-full justify-between items-start">
              <div className="flex w-1/2 flex-col items-start">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    Name:{" "}
                    <strong className="ml-2">
                      {payerData && !payer
                        ? data1[0]["Item"].split("_")[0]
                        : payer
                        ? data1["0"]["Payer Name"]
                        : data1["0"]["Assigned Physician Name"]}
                    </strong>
                  </div>

                  {/* {type === "HCP" && <div className="flex items-center gap-3">
                HCP Name: <InputField  input={type: "text"} /></div>} */}
                </div>
                {!payer && !insititutional && (
                  <div className="flex flex-col items-start">
                    <div className="flex items-center">
                      Hospital / Clinic:{" "}
                      <strong className="ml-2">{data1["0"]["Hospital"]}</strong>
                    </div>
                    <div className="flex items-center">
                      Health System / IDN:{" "}
                      <strong className="ml-2">{data1["0"]["System"]}</strong>
                    </div>
                  </div>
                )}
                {payer && (
                  <div className="flex items-center">
                    Plan name:{" "}
                    <strong className="ml-2">
                      {payerData && !payer
                        ? data1[0]["Item"].split("_")[0]
                        : payer
                        ? data1["0"]["Plan Name"]
                        : data1["0"]["Assigned Physician Name"]}
                    </strong>
                  </div>
                )}

                {!payerData && (
                  <>
                    <div className="flex items-center">
                      Primary Specialty Description:{" "}
                      <strong className="ml-2">
                        {data1["0"]["Primary Specialty Description"]}
                      </strong>
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-col w-1/2 gap-3 items-start justify-between">
                {data1 && data1["0"] && data1["0"]["Region"] && (
                  <div className="flex items-center">
                    Region:{" "}
                    <strong className="ml-2">{data1["0"]["Region"]}</strong>
                  </div>
                )}
                {data1["0"] && (
                  <div className="flex items-center">
                    State Name:{" "}
                    <strong className="ml-2">{data1["0"]["State Name"]}</strong>
                  </div>
                )}
                {data1["0"] && (
                  <div className="flex items-center">
                    City: <strong className="ml-2">{data1["0"]["City"]}</strong>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="w-[80vw] gap-5 grid grid-cols-2">
        <div>
          <BarChart
            label={`Diagnosis and Investigation`}
            height={110}
            options={options}
            data={data1.mapValue1}
          />
        </div>
        <div>
          <BarChart
            label={`Treatment (ICS or beta-agonist)`}
            height={110}
            options={options}
            data={data1.mapValue3}
          />
        </div>
        <div>
          <BarChart
            label={`Treatment (ICS-LABA)`}
            height={110}
            options={options}
            data={data1.mapValue4}
          />
        </div>
        <div>
          <BarChart
            label={`Treatment (ICS-LABA-LAMA)`}
            height={110}
            options={options}
            data={data1.mapValue5}
          />
        </div>
      </div>

      <>
        <div className="flex mt-4 items-center gap-4">
          <label className="block text-sm font-medium text-gray-900 ">
            Select Unmet Need
          </label>
          <MultiSelect
            labelledBy=""
            ItemRenderer={CustomOptionRenderer}
            options={filterOutLabels(filterOptions, selectedUnmet)
              .filter(
                (item) =>
                  !item.toLowerCase().includes("percent") &&
                  !patientTotals.includes(item)
              )
              .map((item) => ({
                label: selectLabels[item] ? selectLabels[item] : item,
                value: item,
              }))}
            className="w-[40rem] z-[5]"
            value={unmetNeed || []}
            onChange={(val) => handleSelectMultipleUnmet(val)}
          />
        </div>
        {lineChartData ? (
          <div className="grid  w-full grid-cols-2 items-center">
            {lineChartData.chart1 && (
              <LineChart
                height={150}
                options={lineChartOptions}
                data={lineChartData.chart1}
                arbitrary={false}
              />
            )}
            {lineChartData.chart2 && (
              <LineChart
                height={150}
                options={lineChartOptions2}
                data={lineChartData.chart2}
                arbitrary={false}
              />
            )}
          </div>
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
      </>
    </div>
  );
};

export default BarChartPopup;
