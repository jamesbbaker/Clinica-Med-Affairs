import React from "react";
import { APP_ROUTES, APP_ROUTES_LABEL } from "../../constants/appConstants";
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
import TargetList from "./TargetLists";
import { useParams } from "react-router-dom";

const NavigationMenu = [
  {
    name: APP_ROUTES_LABEL.patient_opportunity_mapping_and_strategy,
    id: APP_ROUTES.patient_opportunity_mapping_and_strategy,
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.patient_opportunity_mapping_and_strategy}`,
    color: "#800080",
    description: "Prioritize key areas of unmet need for Medical intervention",
  },
  {
    name: APP_ROUTES_LABEL.priority_engagement_opportunity_page,
    id: APP_ROUTES.priority_engagement_opportunity_page,
    color: "#800080",
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.priority_engagement_opportunity_page}`,
    description:
      "Explore unmet need by HCP, hospital / clinic / system, and payer / plan to identify priority target",
  },
  {
    name: APP_ROUTES_LABEL.eligible_patient_locator,
    id: APP_ROUTES.eligible_patient_locator,
    color: "#FF6666",
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.eligible_patient_locator}`,
    description: "Deep clinical profiles for top HCPs by priority unmet needs",
  },
  {
    name: APP_ROUTES_LABEL.institutional_variation,
    id: APP_ROUTES.institutional_variation,
    color: "#FF6666",
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.institutional_variation}`,
    description:
      "Deep clinical profiles for top hospitals, clinics, IDNs, and systems by priority unmet needs",
  },
  {
    name: APP_ROUTES_LABEL.payer_variation,
    id: APP_ROUTES.payer_variation,
    color: "#FF6666",
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.payer_variation}`,
    description:
      "Deep clinical profiles for top plans and payers by priority unmet needs",
  },
  {
    name: APP_ROUTES_LABEL.target_lists,
    id: APP_ROUTES.target_lists,
    color: "#0000FF",
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.target_lists}`,
    description: "Your selected HCPs, hospitals / systems, and plans",
  },
  {
    name: APP_ROUTES_LABEL.impact_tracking,
    id: APP_ROUTES.impact_tracking,
    color: "#0000FF",
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.impact_tracking}`,
    description:
      "Measure changes in patient care and the impact of initiatives",
  },
  {
    name: APP_ROUTES_LABEL.patient_journey,
    id: APP_ROUTES.patient_journey,
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.patient_journey}`,
    color: "#c4c4c4",
    description: "Gain a deeper understanding of asthma care patterns",
  },
  {
    name: APP_ROUTES_LABEL.help,
    id: APP_ROUTES.help,
    route: APP_ROUTES.help,
    color: "#c4c4c4",
    description: "Learn about the app or contact support",
  },
];

const labelsPageData = {};
NavigationMenu.forEach((item) => {
  labelsPageData[item.id] = item;
});

const Output = () => {
  const { currentMenu, isProfileOpen } = useSelector((state) => state.menu);
  const { id } = useParams();

  return (
    <>
      {isProfileOpen && (
        <>
          <h1 className="text-xl font-[500]">{APP_ROUTES_LABEL[id]}</h1>
          <p className="text-sm mb-10">
            {labelsPageData[id] ? labelsPageData[id].description : ""}
          </p>
        </>
      )}
      {currentMenu === APP_ROUTES.patient_journey && <PatientTracking />}
      {currentMenu === APP_ROUTES.patient_opportunity_mapping_and_strategy && (
        <PatientOpportunityPage />
      )}
      {currentMenu === APP_ROUTES.priority_engagement_opportunity_page && (
        <PriorityEngagement />
      )}
      {currentMenu === APP_ROUTES.data_quality && <DataQuality />}
      {currentMenu === APP_ROUTES.hcp_insights && <HcpInsight />}
      {currentMenu === APP_ROUTES.eligible_patient_locator && (
        <PhysicianCareProfile />
      )}
      {currentMenu === APP_ROUTES.target_lists && <TargetList />}
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
