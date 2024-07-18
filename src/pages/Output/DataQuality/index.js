import React, { useContext, useEffect, useMemo, useState } from "react";
import { getDataStats } from "../../../API/Outputs";
import { AuthContext } from "../../../context/AuthContext";
import { LineChart } from "../../../components/LineChart";
import TreeMap from "../../../components/TreeMap";
import Table from "../../../components/Table";
import Map from "../../../components/Map";
import { generateStatsOptions, setLineData } from "../../../utils/ChartUtils";
import { selectLabels } from "../../../constants/appConstants";
import { HeatMapGrid } from "react-grid-heatmap";
import RadarChart from "../../../components/RadarChart";

const DataQuality = () => {
  const { accessToken, refreshToken } = useContext(AuthContext);
  const [statsData1, setStatsData1] = useState(null);
  const [statsData2, setStatsData2] = useState(null);
  const [statsData3, setStatsData3] = useState(null);
  const [statsData4, setStatsData4] = useState(null);
  const [statsData5, setStatsData5] = useState(null);
  const [statsData6, setStatsData6] = useState(null);
  const [statsData1_1, setStatsData1_1] = useState(null);
  const [labels, setLabels] = useState({
    xLabels: [],
    yLabels: [],
  });

  const [mapData, setMapData] = useState(null);

  const TableColummns = useMemo(() => {
    const USERS_TABLE_COLUMNS = [
      {
        Header: "Specialty",
        accessor: "Physician_Specialty",
      },
      {
        Header: "Specialty Classification",
        accessor: "Specialty_Bucket",
      },
      { Header: "Patient Interactions", accessor: "Total_Claims" },
      { Header: "Patients", accessor: "Total_Patients" },
    ];
    return USERS_TABLE_COLUMNS;
  }, []);

  const secondTableColummns = useMemo(() => {
    const USERS_TABLE_COLUMNS = [
      { Header: "Type", accessor: "Type" },
      { Header: "Patient Interactions", accessor: "Total_Claims" },
      { Header: "Patients", accessor: "Total_Patients" },
    ];
    return USERS_TABLE_COLUMNS;
  }, []);

  const options = useMemo(() => {
    const statsOptions = {
      responsive: true,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "Month/Year",
          },
          ticks: {
            font: {
              size: 14,
              weight: 600,
            },
            callback: function (value, index, ticks) {
              let label = this.getLabelForValue(value);
              let month = parseInt(label && label.split("/")[0]);
              return month % 6 === 0 ? label : null;
            },
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Value",
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Asthma Patients and Claims By Month",
        },
        datalabels: {
          display: false,
        },
      },
    };
    return statsOptions;
  }, []);
  const options_line_2 = useMemo(() => {
    const statsOptions = {
      responsive: true,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "Month/Year",
          },
          ticks: {
            font: {
              size: 14,
              weight: 600,
            },
            callback: function (value, index, ticks) {
              let label = this.getLabelForValue(value);
              let month = parseInt(label && label.split("/")[0]);
              return month % 6 === 0 ? label : null;
            },
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Value",
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Asthma Incidence",
        },
        datalabels: {
          display: false,
        },
      },
    };
    return statsOptions;
  }, []);

  const Line_options = useMemo(() => {
    return generateStatsOptions("Treatment Types over Time");
  }, []);

  useEffect(() => {
    getDataStats("data_stats_1", accessToken, refreshToken)
      .then((res) => {
        if (res) {
          const responseData = res.data;
          const labels = [];
          const distinctPatientsData = [];
          const distinctRowsData = [];
          responseData.sort((a, b) => {
            if (a.Year !== b.Year) {
              return a.Year - b.Year;
            } else {
              return a.Month - b.Month;
            }
          });
          const filteredData = responseData.filter((item) => {
            return item.Year > 2016 || (item.Year === 2016 && item.Month >= 1);
          });
          filteredData.forEach((entry) => {
            const month = entry["Month"];
            const year = entry["Year"];
            const distinctPatients = entry["Distinct_Patients"];
            const distinctRows = entry["Distinct_Rows"];

            labels.push(`${month}/${year}`);
            distinctPatientsData.push(distinctPatients);
            distinctRowsData.push(distinctRows);
          });
          const data = {
            labels: labels,
            datasets: [
              {
                label: "Patients",
                data: distinctPatientsData,
                borderColor: "rgb(255, 99, 132)",
                borderWidth: 2,
                fill: false,
              },
              {
                label: "Claims",
                data: distinctRowsData,
                borderColor: "rgb(54, 162, 235)",
                borderWidth: 2,
                fill: false,
              },
            ],
          };
          setStatsData1(data);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });

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

          setStatsData1_1(newRes);
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
    getDataStats("data_stats_11", accessToken, refreshToken)
      .then((res) => {
        if (res) {
          const responseData = res.data;
          const labels = [];
          const distinctPatientsData = [];
          responseData.sort((a, b) => {
            if (a.Year !== b.Year) {
              return a.Year - b.Year;
            } else {
              return a.Month - b.Month;
            }
          });
          const filteredData = responseData.filter((item) => {
            return item.Year > 2016 || (item.Year === 2016 && item.Month >= 1);
          });
          filteredData.forEach((entry) => {
            const month = entry["Month"];
            const year = entry["Year"];
            const NumberOfPatients = entry["NumberOfPatients"];

            labels.push(`${month}/${year}`);
            distinctPatientsData.push(NumberOfPatients);
          });
          const data = {
            labels: labels,
            datasets: [
              {
                label: "Patients",
                data: distinctPatientsData,
                borderColor: "rgb(25, 99, 132)",
                borderWidth: 2,
                fill: false,
              },
            ],
          };
          setStatsData6(data);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });

    getDataStats("data_stats_10", accessToken, refreshToken)
      .then((res) => {
        if (res) {
          let Types = [];
          const responseData = res.data;
          responseData.forEach((entry) => {
            return Types.push(entry["Type"]);
          });
          let _data = setLineData(res, Types[0], "NumberOfPatients");
          setStatsData5(_data);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });

    getDataStats("data_stats_2", accessToken, refreshToken)
      .then((res) => {
        if (res) {
          const responseData = res.data;
          let response = {};
          responseData.forEach((data) => {
            response[data.State] = {
              State: data.State,
              Asthma_Claims: data.Asthma_Claims,
              Distinct_Patients: data.Distinct_Patients,
            };
          });
          setMapData(response);
          let heatmapData = [
            ["State", "Parent", "Number of Asthma Patients"],
            ["USA", null, 0],
            ...responseData.map((entry) => [
              entry.State,
              "USA",
              entry.Distinct_Patients,
            ]),
          ];
          setStatsData2(heatmapData);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
    getDataStats("data_stats_7", accessToken, refreshToken)
      .then((res) => {
        if (res) {
          const responseData = res.data;

          setStatsData3(responseData);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });

    getDataStats("data_stats_8", accessToken, refreshToken)
      .then((res) => {
        if (res) {
          const responseData = res.data;
          setStatsData4(responseData);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
  }, []);

  return (
    <div>
     
      {/* <RadarChart />
      {statsData1 && (
        <LineChart arbitrary={false} data={statsData1} options={options} />
      )} */}
      {statsData6 && (
        <LineChart
          arbitrary={false}
          data={statsData6}
          options={options_line_2}
        />
      )}
      {statsData2 && (
        <div className="flex w-full flex-col gap-12">
          <div className="flex w-full flex-col gap-2">
            <p className="text-[#888888] font-bold text-xs">
              Asthma Patients by States
            </p>
            <Map dataQuality={true} markersEnabled={false} mapData={mapData} />
          </div>
          <TreeMap needCallbacks={false} data={statsData2} />
        </div>
      )}
      {statsData3 && (
        <Table
          Title="Asthma HCP Specialties by Patient Interactions"
          activeCells={false}
          showSelectionBtns={false}
          TableData={statsData3}
          TableColummns={TableColummns}
        />
      )}
      {statsData4 && (
        <Table
          Title="Patients by Type of Medicine"
          activeCells={false}
          showSelectionBtns={false}
          TableData={statsData4}
          TableColummns={secondTableColummns}
        />
      )}
      {statsData5 && (
        <>
          <LineChart
            height={150}
            arbitrary={false}
            data={statsData5}
            options={Line_options}
          />
        </>
        
      )}
       {statsData1_1 && (
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
                let value = statsData1_1[_x][_y];
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
            data={statsData1_1}
            xLabelWidth={10}
            xLabels={labels.xLabels}
            yLabels={labels.yLabels}
          />
        </div>
      )}
    </div>
  );
};

export default DataQuality;
