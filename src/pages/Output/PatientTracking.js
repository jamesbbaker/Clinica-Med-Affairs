import React from "react";
import Sankey from "../../components/Sankey";

const PatientTracking = () => {
  console.log("snake");
  return (
    <div className="px-12 py-10">
      <Sankey
        API={"sankey_data_6"}
        title={"Patient Transitions through HCP Specialty by Asthma Visit"}
        OPTIONS={{
          from: "From_Specialty",
          to: "To_Specialty",
          count: "Patient_Count",
        }}
      />
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
  );
};

export default PatientTracking;
