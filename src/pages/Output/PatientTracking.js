import React, { useContext, useEffect, useMemo, useState } from "react";
import Sankey from "../../components/Sankey";
import HcpInsight from "./HcpInsights";
import { getDataStats } from "../../API/Outputs";
import { AuthContext } from "../../context/AuthContext";
import { generateStatsOptions, setLineData } from "../../utils/ChartUtils";
import { LineChart } from "../../components/LineChart";
import DataQuality from "./DataQuality";
import Table from "../../components/Table";


const PatientTracking = () => {
  const [statsData7, setStatsData7] = useState(null);
  const { accessToken, refreshToken } = useContext(AuthContext);
  const [statsData8, setStatsData8] = useState(null);
 

  const Line_options_2 = useMemo(() => {
    return generateStatsOptions("Patient Starts by Therapy Type");
  }, []);

  useEffect(() => {
    getDataStats("data_stats_13", accessToken, refreshToken)
      .then((res) => {
        if (res) {
          let Types = [];
          const responseData = res.data;
          responseData.forEach((entry) => {
            return Types.push(entry["Type"]);
          });
          let _data = setLineData(res, Types[0], "Patients");
          setStatsData7(_data);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
      getDataStats("data_stats_15", accessToken, refreshToken)
      .then((res) => {
        if (res) {
          const responseData = res.data;
          setStatsData8(responseData);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
   
  }, []);

  const Table_Columns_3 = useMemo(() => {
    const USERS_TABLE_COLUMNS = [
      {
        Header: "Metric",
        accessor: "Metric",
      },
      {
        Header: "Value",
        accessor: "Value",
      },
    ];
    return USERS_TABLE_COLUMNS;
  }, []);

  return (
    <div>
       {statsData8 && (
        <Table
          initialState={{
            pageSize: 10,
            pageIndex: 0,
            sortBy: [
              {
                id: "Value",
                desc: true,
              },
            ],
          }}
          marginTop="0"
          Title="Summary Table"
          activeCells={false}
          showSelectionBtns={false}
          TableData={statsData8}
          TableColummns={Table_Columns_3}
        />
      )}
      <div className="mb-10">
        <Sankey
          API={"sankey_data_6"}
          title={"Patient Transitions through HCP Specialty by Asthma Visit"}
          OPTIONS={{
            from: "From_Specialty",
            to: "To_Specialty",
            count: "Patient_Count",
          }}
        />
      </div>
      <div className="my-10">
        <Sankey
          API={"sankey_data_9"}
          title={"Patient Transitions through Therapies"}
          height="800px"
          OPTIONS={{
            from: "From_Therapy",
            to: "To_Therapy",
            count: "Patient_Count",
          }}
        />
      </div>

      {statsData7 && (
        <>
          <LineChart
            height={150}
            arbitrary={false}
            data={statsData7}
            options={Line_options_2}
          />
        </>
      )}
      <div className="w-full mt-6">
        <DataQuality />
      </div>
    </div>
  );
};

export default PatientTracking;
