import React, { useContext, useEffect, useState } from "react";
import EligiblePatientLocator from "../EligiblePatientLocator";
import InstitutionalVariationTable from "../InstitutionalVariationTable";
import PayerVariationTable from "../PayerVariationTable";
import { getDataStats } from "../../../API/Outputs";
import { AuthContext } from "../../../context/AuthContext";
import { MultiSelect } from "react-multi-select-component";
import { filterOutLabels } from "../../../utils/MapUtils";
import {
  labelsMatrix,
  patientTotals,
  selectLabels,
} from "../../../constants/appConstants";
import { LineChart } from "../../../components/LineChart";
import CustomDropdown from "../../../components/CustomDropdown";
import { convertToQuarter } from "../PatientOpportunityMapping/Popup";
import { CustomOptionRenderer } from "../../../components/Table";

const filterOptions = [...Object.keys(selectLabels)];

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

const TargetList = () => {
  const [filters, setFilters] = useState({
    hcp: [],
    hospital: [],
    payer: [],
  });
  const { accessToken, refreshToken } = useContext(AuthContext);
  const [isScatterMapOpen, setIsScatterMapOpen] = useState(false);

  useEffect(() => {
    getDataStats("get_list", accessToken, refreshToken)
      .then((res) => {
        if (res.data) {
          let _data = {
            hcp: [],
            hospital: [],
            payer: [],
          };

          res.data.forEach((item) => {
            if (item.type === "HCP") {
              _data.hcp.push(item.key);
            } else if (item.type === "Hospital") {
              _data.hospital.push({ value: item.key, label: item.key });
            } else if (item.type === "Plan") {
              _data.payer.push({ value: item.key, label: item.key });
            }
          });

          setFilters(_data);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  return (
    <>
      {filters ? (
        <div className="flex flex-col items-start gap-4">
          {filters.hcp && (
            <>
              <EligiblePatientLocator
                showDelete={true}
                filterName="hcp"
                setFilters={setFilters}
                setIsScatterMapOpen={setIsScatterMapOpen}
                title={"HCPs"}
                providerId={filters.hcp}
              />
              <TargetLine selectedChart={"HCP"} />
            </>
          )}
          {filters.hospital && (
            <>
              <InstitutionalVariationTable
                setIsScatterMapOpen={setIsScatterMapOpen}
                setFilters={setFilters}
                filterName="hospital"
                title="Clinic / Hospitals"
                cleanedAffilitionInput={filters.hospital}
                showDelete={true}
              />
              <TargetLine selectedChart={"Hospital"} />
            </>
          )}
          {filters.payer && (
            <>
              <PayerVariationTable
                setFilters={setFilters}
                showDelete={true}
                filterName="payer"
                setIsScatterMapOpen={setIsScatterMapOpen}
                title="Plans"
                planNameInput={filters.payer}
              />
              <TargetLine selectedChart={"Plan"} />
            </>
          )}
        </div>
      ) : (
        <div className="w-full h-[100vh] grid place-content-center">
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
  );
};

export default TargetList;

export const TargetLine = ({ selectedChart }) => {
  const [lineChartData, setLineChartData] = useState(null);
  const { selectedUnmet, accessToken, refreshToken } = useContext(AuthContext);
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState(null);
  const [unmetNeed, setUnmetNeed] = useState([
    {
      label: "Incomplete initial asthma testing",
      value: "Number of No Spirometry",
    },
  ]);

  function addLineData(_data) {
    if (!_data) {
      return;
    }
    let lineDataFilter = [..._data];
    let _labels = [];
    if (_data[0].Quarter !== 0) {
      lineDataFilter = _data.filter((item) => {
        const year = parseInt(item.Quarter.split("-")[0]);
        const month = parseInt(item.Quarter.split("-")[1]);

        // Filter for years from 2016 to 2023 (inclusive) and exclude January 2024
        return (
          (year > 2016 || (year === 2016 && month >= 1)) &&
          (year < 2024 || (year === 2023 && month <= 12))
        );
      });
      lineDataFilter.sort((a, b) => new Date(a.Quarter) - new Date(b.Quarter));
      _labels = lineDataFilter.map((item) => convertToQuarter(item.Quarter));
    } else {
      _labels = _data.map((item) => item.Quarter);
    }

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
    setLoading(true);
    getDataStats(
      `get_priority_quarterly?Type=${selectedChart}`,
      accessToken,
      refreshToken
    )
      .then((res) => {
        let _data = JSON.parse(res.replaceAll("NaN", 0));
        addLineData(_data.data);
        setFetchedData(_data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(true)
        setLoading(false);
        console.log(err, "err");
      });
  }, [selectedChart]);

  useEffect(() => {
    if (fetchedData) {
      addLineData(fetchedData);
    }
  }, [unmetNeed, fetchedData]);

  useEffect(() => {
    if (selectedUnmet && selectedUnmet.length > 0) {
      let defaultUnmet = selectedUnmet.find(
        (item) => !item.value.toLowerCase().includes("percent")
      );
      setUnmetNeed([defaultUnmet]);
    }
  }, [selectedUnmet]);

  const handleSelectMultipleUnmet = (val) => {
    setUnmetNeed(val);
  };

  return (
    <>
      {lineChartData && !loading ? (
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

          <div className="grid  w-full custom:grid-cols-2 grid-cols-1 items-center">
            {lineChartData.chart1 && (
              <LineChart
                options={lineChartOptions}
                data={lineChartData.chart1}
                arbitrary={false}
              />
            )}
            {lineChartData.chart2 && (
              <LineChart
                options={lineChartOptions2}
                data={lineChartData.chart2}
                arbitrary={false}
              />
            )}
          </div>
        </>
      ) : !error && (
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
  );
};
