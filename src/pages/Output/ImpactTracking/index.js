import React, { useContext, useEffect, useState } from "react";
import { getDataStats } from "../../../API/Outputs";
import { AuthContext } from "../../../context/AuthContext";
import ImpactLineChart from "./ImpactLineChart";
import ImpactMap from "./ImpactMap";
import { capitalize } from "lodash";
import CustomDropdown from "../../../components/CustomDropdown";

export const options = {
  responsive: true,
  scales: {
    x: {
      title: {
        display: false,
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
        // autoSkip: false,
        // callback: function (value) {
        //   return value;
        // },
      },
    },
    y: {
      ticks: {
        // Include a dollar sign in the ticks
        callback: function (value, index, ticks) {
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
  },
};

function generateValues() {
  const values = [];
  const maxIndex = 10;

  for (let i = 0; i < maxIndex; i++) {
    values.push(Math.floor(Math.random() * maxIndex));
  }

  return values;
}
const labels = Array.from({ length: 10 }, (_, i) => i);

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: generateValues(),
      borderColor: "rgb(15,255, 122)",
      backgroundColor: "rgb(15,255, 122, 0.2)",
    },
    {
      label: "Dataset 2",
      data: generateValues(),
      borderColor: "rgb(150,25, 152)",
      backgroundColor: "rgb(150,25, 152, 0.2)",
    },
  ],
};

const ImpactTracking = () => {
  const { accessToken, refreshToken } = useContext(AuthContext);
  const [regionDataCoordinates, setRegionDataCoordinates] = useState({});
  const [stateCoordinates, setStateCoordinates] = useState({});
  const [nationalData, setNationalData] = useState(null);
  const [regionData, setRegionData] = useState(null);
  const [stateData, setStateData] = useState(null);
  const [chartShow, setChartShow] = useState("national");

  useEffect(() => {
    getDataStats("national_data_quarterly", accessToken, refreshToken).then(
      (res) => {
        let data = [];
        Object.entries(res.summary_data).map((item) =>
          data.push({ ...item[1], Quarter: item[0] })
        );
        setNationalData(data);
      }
    );

    getDataStats("region_level_data", accessToken, refreshToken)
      .then((res) => {
        if (res) {
          let newObj = {};
          res.data.forEach((item) => {
            newObj[item.Region] = [item.LONG, item.LAT];
          });
          setRegionDataCoordinates(newObj);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
    getDataStats("state_level_data", accessToken, refreshToken)
      .then(async (res) => {
        if (res) {
          let _data = JSON.parse(res.replaceAll("NaN", 0));
          let newObj = {};
          _data.data.forEach((item) => {
            newObj[item["State Name"]] = [item.LONG, item.LAT];
          });
          setStateCoordinates(newObj);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });

    getDataStats("state_level_quarterly", accessToken, refreshToken).then(
      (res) => {
        let data = JSON.parse(res.replaceAll(NaN, "0"));
        setStateData(data);
      }
    );
    getDataStats("region_level_quarterly", accessToken, refreshToken).then(
      (res) => {
        let data = JSON.parse(res.replaceAll(NaN, "0"));

        setRegionData(data);
      }
    );
  }, []);

  const [mapLoading, setMapLoading] = useState(false);

  const handleReset = () => {
    setMapLoading(true);
    setTimeout(() => {
      setMapLoading(false);
    });
  };

  const handleSelectChart = (val) => {
    setChartShow(val);
  };

  return (
    <div className="flex flex-col gap-8">
      {stateData && regionData ? (
        <div className="flex flex-col items-start gap-2 w-full">
          <CustomDropdown
            labelClassName="mb-0"
            className={"flex z-[15]  mb-4 items-center gap-2"}
            input={{
              label: "Select Chart",
              name: "Select Chart",
              type: "select",
              options: ["national", "region", "state"].map((item) => ({
                name: capitalize(item),
                value: item,
              })),
              id: "xLabel",
            }}
            handleSelect={(val) => handleSelectChart(val)}
            value={chartShow}
          />
          {chartShow === "national" && (
            <ImpactLineChart lineData={nationalData} />
          )}
          {chartShow === "region" && (
            <ImpactLineChart type="Region" lineData={regionData.data} />
          )}
          {chartShow === "state" && (
            <ImpactLineChart type="State" lineData={stateData.data} />
          )}
        </div>
      ) : (
        <div className="h-[40vh] flex justify-center items-center">
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
        </div>
      )}
      {!mapLoading ? (
        <ImpactMap
          regionDataCoordinates={regionDataCoordinates}
          stateCoordinates={stateCoordinates}
          handleReset={handleReset}
          regionData={regionData}
          stateData={stateData}
        />
      ) : (
        <div className="h-[80vh] flex justify-center items-center">
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
        </div>
      )}
      {/* <div className="flex w-full flex-col items-start">
        <CustomDropdown
          showColors
          labelClassName="mb-0"
          className={"flex  mb-4 items-center gap-2"}
          input={{
            label: "Unmet Need select",
            name: "Unmet Need select",
            type: "select",
            options: filterOptions.map((item) => ({
              name: selectLabels[item] ? selectLabels[item] : item,
              value: item,
            })),
            id: "xLabel",
          }}
          handleSelect={(val) => handleSelectTree(val)}
          value={unmetNeed}
        />
      </div> */}
    </div>
  );
};

export default ImpactTracking;
