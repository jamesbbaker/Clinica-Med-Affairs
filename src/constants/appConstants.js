export const sidebarRoutes = {
  USERS: "users",
  DASHBOARD: "dashboard",
};

export const EPL_TABLE_COLUMNS = [
  {
    Header: "Improper CV risk testing",
    accessor: "cvRisk",
  },
  {
    Header: "Improper calcium channel blocker",
    accessor: "calciumBlocker",
  },
  { Header: "Lack of monitoring by CV specialist", accessor: "monitoring" },
  {
    Header: "Off-label treatment High AF stroke risk without anticoagulant",
    accessor: "offLabelTreatment",
  },
  {
    Header: "Non-adherence to anticoagulants",
    accessor: "nonAdherenceAnticoagulants",
  },
  {
    Header:
      "Incomplete comorbidity testing Continued AF without treatment escalation",
    accessor: "incompleteTesting",
  },
  {
    Header: "Repeated cardioversions without treatment escalation",
    accessor: "repeatedCardioversions",
  },
  { Header: "Improper support of therapy", accessor: "supportTherapy" },
  { Header: "Failure to manage AEs", accessor: "manageAEs" },
  {
    Header: "Non-adherence to other AF drug treatments",
    accessor: "nonAdherenceAFDrugs",
  },
  {
    Header: "Failure to complete follow-up testing",
    accessor: "failureFollowUp",
  },
];

export const USERS_TABLE_COLUMNS = [
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Region",
    accessor: "region",
  },
  { Header: "Company", accessor: "company" },
];

export const APP_ROUTES = {
  users: "users",
  outputs: "outputs",
  patient_opportunity_mapping_and_strategy:
    "patient_opportunity_mapping_and_strategy",
  hcp_segmentation: "hcp_segmentation",
  eligible_patient_locator: "eligible_patient_locator",
  hcp_profiles: "hcp_profiles",
  lead_indicators: "lead_indicators",
  patient_journey: "patient_journey",
  impact_tracking: "impact_tracking",
  institutional_variation: "institutional_variation",
  data_quality: "data_quality",
  unmet_need_definition: "unmet_need_definition",
};

export const APP_ROUTES_LABEL = {
  home: "Home",
  users: "Users",
  outputs: "Outputs",
  patient_opportunity_mapping_and_strategy:
    "Patient Opportunity Mapping and Strategy",
  hcp_segmentation: "HCP Segmentation",
  eligible_patient_locator: "Eligible Patient Locator",
  hcp_profiles: "HCP Profiles",
  lead_indicators: "Leading Indicators",
  patient_journey: "Patient Trajectory",
  impact_tracking: "Impact Tracking",
  institutional_variation: "Institutional Variation",
  data_quality: "Data Quality",
  unmet_need_definition: "Unmet Need Definitions",
};
