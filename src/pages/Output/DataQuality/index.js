import React, { useContext, useEffect, useMemo, useState } from "react";
import { getDataStats } from "../../../API/Outputs";
import { AuthContext } from "../../../context/AuthContext";
import { LineChart } from "../../../components/LineChart";
import TreeMap from "../../../components/TreeMap";
import Table from "../../../components/Table";
import Map from "../../../components/Map"

const DataQuality = () => {
  const { accessToken, refreshToken } = useContext(AuthContext);
  const [statsData1, setStatsData1] = useState(null);
  const [statsData2, setStatsData2] = useState(null);
  const [statsData3, setStatsData3] = useState(null);
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
          text: "Number of Asthma Patients and Claims By Month",
        },
      },
    };
    return statsOptions;
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

          responseData.forEach((entry) => {
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
                label: "Distinct Patients",
                data: distinctPatientsData,
                borderColor: "rgb(255, 99, 132)",
                borderWidth: 2,
                fill: false,
              },
              {
                label: "Distinct Claims",
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

    getDataStats("data_stats_2", accessToken, refreshToken)
      .then((res) => {
        if (res) {
          const responseData = res.data;
          let response = {}
          console.log(responseData)
           responseData.forEach(data => {
            response[data.State] =
            {  State: data.State,
              Asthma_Claims: data.Asthma_Claims,
             Distinct_Patients: data.Distinct_Patients}
           })
          setMapData(response)
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
  }, []);

  return (
    <div className="pb-44">
      {statsData1 && (
        <LineChart arbitrary={false} data={statsData1} options={options} />
      )}
      {statsData2 && <div className="flex w-full flex-col gap-12">
        <Map markersEnabled={false} mapData={mapData} />
        <TreeMap needCallbacks={false} data={statsData2} /></div> }
      {statsData3 && (
        <Table
          Title="Asthma HCP Specialties by Patient Interactions"
          activeCells={false}
          showSelectionBtns={false}
          TableData={statsData3}
          TableColummns={TableColummns}
        />
      )}
    </div>
  );
};

export default DataQuality;
