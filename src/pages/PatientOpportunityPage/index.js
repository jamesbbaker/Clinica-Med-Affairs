import React, { useContext, useEffect, useState } from "react";
import UnmetNeedDefinition from "../Output/UnmetNeedDefinition";
import PatientOpportunityMapping from "../Output/PatientOpportunityMapping";
import ImpactTracking from "../Output/ImpactTracking";
import { selectLabels } from "../../constants/appConstants";
import { AuthContext } from "../../context/AuthContext";
import { getDataStats } from "../../API/Outputs";
import { HeatMapGrid } from "react-grid-heatmap";
import { RadarChart } from "../../components/RadarChart";
import { LineChart } from "../../components/LineChart";
import CustomDropdown from "../../components/CustomDropdown";
import Prioitize from "../../components/Prioritize";
import { filterOutLabels } from "../../utils/MapUtils";

const defaultOptions = {
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
        stepSize: 1000,
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
    legend: {
      display: false, // Hide the legend
    },
  },
};

const PatientOpportunityPage = () => {
  const [statsData1, setStatsData1] = useState(null);
  const [labels, setLabels] = useState({
    xLabels: [],
    yLabels: [],
  });
  const [crfData, setCrfData] = useState({});
  const [crfLineData, setCrfLineData] = useState({});
  const [crfUnmetNeed, setCrfUnmetNeed] = useState(null);
  const { accessToken, refreshToken ,selectedUnmet} = useContext(AuthContext);

  const handleSelectFilter = (val) => {
    setCrfUnmetNeed(val);
    let _data = {
      labels: crfData[val]["HCP Index"],
      datasets: [
        {
          label: "Dataset 1",
          data: crfData[val]["Cumulative Unmet Need"],
          borderColor: "rgb(0, 0, 139)",
          backgroundColor: "rgb(0, 0, 139, 0.2)",
        },
      ],
    };
    setCrfLineData(_data);
  };

  useEffect(() => {
    getDataStats("hcp_correlation_matrix", accessToken, refreshToken)
      .then((res) => {
        if (res) {
          let _newObj = {};
          res.forEach((item) => {
            let _item = { ...item };
            delete _item.index;
            _newObj[item.index] = _item;
          });

          let newRes = [];
          Object.keys(selectLabels).forEach((item) => {
            if (_newObj.hasOwnProperty(item)) {
              let newObj = [];
              Object.keys(selectLabels).forEach((_item) => {
                if (_newObj[item].hasOwnProperty(_item)) {
                  newObj.push(_newObj[item][_item]);
                }
              });
              newRes.push(newObj);
            }
          });

          setStatsData1(newRes);
          setLabels({
            xLabels: Object.keys(selectLabels)
              .filter((item) => _newObj.hasOwnProperty(item))
              .map((item) => selectLabels[item]),
            yLabels: Object.keys(selectLabels)
              .filter((item) => _newObj.hasOwnProperty(item))
              .map((item) => selectLabels[item]),
          });
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
    getDataStats("hcp_crf", accessToken, refreshToken)
      .then((res) => {
        setCrfData(res.crf_data);
        setCrfUnmetNeed("Number of No Spirometry");
        let _data = {
          labels: res.crf_data["Number of No Spirometry"]["HCP Index"],
          datasets: [
            {
              label: "Dataset 1",
              data: res.crf_data["Number of No Spirometry"][
                "Cumulative Unmet Need"
              ],
              borderColor: "rgb(0, 0, 139)",
              backgroundColor: "rgb(0, 0, 139, 0.2)",
            },
          ],
        };
        setCrfLineData(_data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="flex flex-col gap-8 items-start w-full">
      <UnmetNeedDefinition />
      <PatientOpportunityMapping patientPage />
      <ImpactTracking patientPage />
      {statsData1 && (
        <div className="p-6 w-full overflow-auto">
          <h4 className="mb-8 ml-2 font-[500]">
            Unmet Need Correlation Heatmap
          </h4>
          <HeatMapGrid
            cellRender={(x, y, value) => {
              if (x >= y) {
                // Only render cells where x >= y (bottom-left triangle)
                return (
                  <div
                    style={{ fontSize: "0.5rem" }}
                    title={`Pos(${x}, ${y}) = ${value}`}
                  >
                    {value.toFixed(2)}
                  </div>
                );
              }
              return null; // Hide cells where x < y
            }}
            xLabelsPos="bottom"
            yLabelsStyle={() => ({
              fontSize: ".65rem",
              width: "15rem",
              textAlign: "center",
              display: "grid",
              placeContent: "center",
              lineHeight: 1,
              height: "2.5rem",
            })}
            xLabelsStyle={() => ({
              fontSize: ".5rem",
            })}
            cellStyle={(_x, _y, ratio) => {
              if (_x >= _y) {
                let value = statsData1[_x][_y];
                return {
                  background:
                    value > 0
                      ? `rgb(12, 160, 44, ${ratio})`
                      : `rgba(255,74,48, ${Math.abs(value)})`,
                  fontSize: ".8rem",
                  color: `rgb(0, 0, 0, ${ratio / 2 + 0.4})`,
                };
              } else {
                return {
                  background: "rgba(0,0,0,0)",
                  fontSize: ".8rem",
                  color: "rgba(255,255,255,0.8)",
                };
              }
            }}
            cellHeight="2.5rem"
            data={statsData1}
            xLabelWidth={10}
            xLabels={labels.xLabels}
            yLabels={labels.yLabels}
          />
        </div>
      )}
      <div className="w-full mt-4">
        <Prioitize />

        <div className="flex flex-col items-center ">
          {crfData && crfLineData && crfUnmetNeed ? (
            <>
              <div className=" self-start">
                <CustomDropdown
                  showColors
                  labelClassName="mb-0"
                  className={"flex items-center gap-2"}
                  input={{
                    label: "Unmet Need select",
                    name: "Unmet Need select",
                    type: "select",
                    options: filterOutLabels(Object.keys(selectLabels), selectedUnmet)
                      .filter((item) => crfData.hasOwnProperty(item))
                      .map((item) => ({
                        name: selectLabels[item] ? selectLabels[item] : item,
                        value: item,
                      })),
                    id: "yLabel",
                  }}
                  value={crfUnmetNeed}
                  handleSelect={(val) => handleSelectFilter(val)}
                />
              </div>
              <LineChart
                options={defaultOptions}
                data={crfLineData}
                height={100}
              />
            </>
          ) : (
            <>
              <div className="w-full h-[400px] grid place-content-center">
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
            </>
          )}
          <RadarChart />
        </div>
      </div>
    </div>
  );
};

export default PatientOpportunityPage;
