import React from "react";
import { APP_ROUTES } from "../../constants/appConstants";
import { useSelector } from "react-redux";
import ImpactTracking from "./ImpactTracking";
import InstitutionalVariation from "./InstituitonalVariation";
import DataQuality from "./DataQuality";
import PatientTracking from "./PatientTracking";
import UnmetNeedDefinition from "./UnmetNeedDefinition";
import PriorityEngagement from "../PriorityEngagement";
import HcpInsight from "./HcpInsights";
import MedicalAffairToolbox from "./MedicalAffairsToolbox";
import PayerVariation from "./PayerVariation";
import PatientOpportunityPage from "../PatientOpportunityPage";
import PhysicianCareProfile from "../PhysicianCareProfile";

const Output = () => {
  const { currentMenu } = useSelector((state) => state.menu);

  return (
    <>
      {currentMenu === APP_ROUTES.patient_journey && <PatientTracking />}
      {currentMenu === APP_ROUTES.patient_opportunity_mapping_and_strategy && (
        <PatientOpportunityPage />
      )}
      {/* {currentMenu === APP_ROUTES.hcp_segmentation && (
       
      )} */}
      {currentMenu === APP_ROUTES.priority_engagement_opportunity_page && (
        <PriorityEngagement />
      )}
      {currentMenu === APP_ROUTES.data_quality && <DataQuality />}
      {currentMenu === APP_ROUTES.hcp_insights && <HcpInsight />}
      {currentMenu === APP_ROUTES.eligible_patient_locator && (
        <PhysicianCareProfile />
      )}
      {currentMenu === APP_ROUTES.payer_variation && <PayerVariation />}
      {currentMenu === APP_ROUTES.institutional_variation && (
        <InstitutionalVariation />
      )}
      {currentMenu === APP_ROUTES.medical_affair_toolbox && (
        <MedicalAffairToolbox />
      )}
      {currentMenu === APP_ROUTES.impact_tracking && <ImpactTracking />}
      {currentMenu === APP_ROUTES.unmet_need_definition && (
        <UnmetNeedDefinition />
      )}
    </>
  );
};

export default Output;
