import React, { useContext, useState } from "react";
import UnmetNeedDefinition from "../Output/UnmetNeedDefinition";
import PatientOpportunityMapping from "../Output/PatientOpportunityMapping";
import ImpactTracking from "../Output/ImpactTracking";

import Prioitize from "../../components/Prioritize";
import { AuthContext } from "../../context/AuthContext";
import PrimaryBtn from "../../components/PrimaryBtn";

const PatientOpportunityPage = () => {
  const [loading, setLoading] = useState(false);
  const { accessToken, selectedUnmet } = useContext(AuthContext);
  const [showPopup, setShowPopup] = useState(false);

  const handlePrioritize = async (val) => {
    setLoading(true);
    let prioritiesList = "";
    val.forEach((element) => {
      prioritiesList += `${element.value},`;
    });

    let data = {
      priorities: prioritiesList,
    };
    try {
      const response = await fetch(
        "https://clinica-server.replit.app/set_priorities",
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
      return res;
    } catch (err) {
      console.log(err);
      throw new Error();
    }
  };

  const handleSave = () => {
    handlePrioritize(selectedUnmet);
  };

  return (
    <div className="flex flex-col gap-8 items-start w-full">
      <UnmetNeedDefinition setShowPopup={setShowPopup} />
      {!showPopup && (
        <>
          <PatientOpportunityMapping patientPage />
          <ImpactTracking patientPage />
          <div className="w-full mt-4">
            <Prioitize />
            <div className="w-full flex mb-48 items-center justify-center">
              <PrimaryBtn
                disabled={loading}
                className={"w-[10rem] text-[#fff]"}
                text={"Save"}
                onClick={handleSave}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientOpportunityPage;
