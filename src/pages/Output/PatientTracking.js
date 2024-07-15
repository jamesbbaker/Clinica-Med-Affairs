import React, { useContext, useEffect, useMemo, useState } from "react";
import Sankey from "../../components/Sankey";
import HcpInsight from "./HcpInsights";
import { getDataStats } from "../../API/Outputs";
import { AuthContext } from "../../context/AuthContext";
import { generateStatsOptions, setLineData } from "../../utils/ChartUtils";
import { LineChart } from "../../components/LineChart";
import DataQuality from "./DataQuality";


const PatientTracking = () => {
  const [statsData7, setStatsData7] = useState(null);
  const { accessToken, refreshToken } = useContext(AuthContext);
 

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
   
  }, []);

  return (
    <div>
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
      <div className="mt-4">
        <HcpInsight />
      </div>
     

      <div className="mb-10 mt-10">
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
