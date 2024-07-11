import React, { useState } from "react";
import PatientOpportunityMapping from "../Output/PatientOpportunityMapping";
import EligiblePatientLocator from "../Output/EligiblePatientLocator";
import MedicalAffairToolbox from "../Output/MedicalAffairsToolbox";

const PhysicianCareProfile = () => {
  const [hcpProfilePage, setHcpProfilePage] = useState(null);
  return (
    <div className="w-full flex  flex-col items-start gap-12">
      <div
        style={{
          display:
            hcpProfilePage === "table" || hcpProfilePage === "scatter"
              ? "none"
              : "block",
        }}
        className="w-full"
      >
        <PatientOpportunityMapping setHcpProfilePage={setHcpProfilePage} />
      </div>
      <div
        style={{
          display:
            hcpProfilePage === "map" || hcpProfilePage === "scatter"
              ? "none"
              : "block",
        }}
        className="w-full"
      >
        <EligiblePatientLocator setHcpProfilePage={setHcpProfilePage} />
      </div>
      <div
        style={{
          display:
            hcpProfilePage === "map" || hcpProfilePage === "table"
              ? "none"
              : "block",
        }}
        className="w-full"
      >
        <MedicalAffairToolbox setHcpProfilePage={setHcpProfilePage} />
      </div>
    </div>
  );
};

export default PhysicianCareProfile;
