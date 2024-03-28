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

export const APP_ROUTES = {
  outputs: "outputs",
  patient_opportunity_mapping_and_strategy:
    "patient_opportunity_mapping_and_strategy",
  hcp_segmentation: "hcp_segmentation",
  eligible_patient_locator: "eligible_patient_locator",
  hcp_profiles: "hcp_profiles",
  lead_indicators: "lead_indicators",
  patient_journey: "patient_journey",
};
