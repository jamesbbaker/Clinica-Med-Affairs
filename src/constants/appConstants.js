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
  hcp_insights: "hcp_insights",
  eligible_patient_locator: "eligible_patient_locator",
  hcp_profiles: "hcp_profiles",
  lead_indicators: "lead_indicators",
  patient_journey: "patient_journey",
  impact_tracking: "impact_tracking",
  institutional_variation: "institutional_variation",
  medical_affair_toolbox: "medical_affair_toolbox",
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
  hcp_insights: "HCP Insights",
  hcp_profiles: "HCP Profiles",
  lead_indicators: "Leading Indicators",
  patient_journey: "Patient Trajectory",
  impact_tracking: "Impact Tracking",
  institutional_variation: "Institutional Variation",
  medical_affair_toolbox: "Medical Affairs Toolbox",
  data_quality: "Data Quality",
  unmet_need_definition: "Unmet Need Definitions",
};

export const patientTotals = [
  "Number of Asthma Patients",
  "Number of ICS Patients",
  "Number of ICS Exacerbation",
  "Number of ICS-LABA Patients",
  "Number of ICS-LABA Exacerbation",
  "Total Asthma Patients",
  "Total ICS Patients",
  "Total ICS Exacerbations",
  "Total ICS-LABA Patients",
  "Total ICS-LABA Exacerbations",
];

export const unmetLabels = {
  "Incomplete initial asthma testing": {
    id: "Total No Spirometry",
    percent: "Percent No Spirometry",
  },
  "Improper severe asthma testing": {
    id: "Total No EOS Testing",
    percent: "Percent No EOS Testing",
  },
  "Exacerbation prior to receiving ICS/beta-agonist": {
    id: "Total No Treatment",
    percent: "Percent No Treatment",
  },
  "Failure to escalate uncontrolled/severe patients to double therapy": {
    id: "Total ICS High Steroid Usage",
    percent: "Percent ICS High Steroid Usage",
  },
  "Excessive steroid usage on ICS/beta-agonist": {
    id: "Total ICS Exacerbation Failed Escalation",
    percent: "Percent ICS Exacerbation Failed Escalation",
  },
  "Delay in escalating patients to double therapy": {
    id: "Total ICS Escalation Delay",
    percent: "Percent ICS Escalation Delay",
  },
  "Failure to escalate uncontrolled/severe patients to triple therapy": {
    id: "Total ICS-LABA High Steroid Usage",
    percent: "Percent ICS-LABA High Steroid Usage",
  },
  "Excessive steroid usage on double therapy": {
    id: "Total ICS-LABA Exacerbation Failed Escalation",
    percent: "Percent ICS-LABA Exacerbation Failed Escalation",
  },
  "Delay in escalating patients from double to triple therapy": {
    id: "Total ICS-LABA Escalation Delay",
    percent: "Percent ICS-LABA Escalation Delay",
  },
  "Suboptimal use of open triple therapy": {
    id: "",
    percent: "",
  },
  "Non-adherence to double therapies": {
    id: "",
    percent: "",
  },
  "Non-adherence to open triple therapies": {
    id: "",
    percent: "",
  },
  "Non-adherence to closed triple therapies": {
    id: "",
    percent: "",
  },
};

export const selectLabels = {
  "Number of Asthma Patients": "Number of Asthma Patients",
  "Number of ICS Patients": "Number of ICS Patients",
  "Number of ICS Exacerbation": "Number of ICS Exacerbation",
  "Number of ICS-LABA Patients": "Number of ICS-LABA Patients",
  "Number of ICS-LABA Exacerbation": "Number of ICS-LABA Exacerbation",
  "Number of No Spirometry": "Incomplete initial asthma testing",
  "Percent of No Spirometry": "Incomplete initial asthma testing percent",
  "Number of No EOS Testing": "Improper severe asthma testing",
  "Percent of No EOS Testing": "Improper severe asthma testing percent",
  "Number of No Treatment": "Exacerbation prior to receiving ICS/beta-agonist",
  "Percent of No Treatment":
    "Exacerbation prior to receiving ICS/beta-agonist percent",
  "Number of ICS High Steroid Usage":
    "Excessive steroid usage on ICS/beta-agonist",
  "Percent of ICS High Steroid Usage":
    "Excessive steroid usage on ICS/beta-agonist percent",
  "Number of ICS Exacerbation Failed Escalation":
    "Failure to escalate uncontrolled/severe patients to double therapy",
  "Percent of ICS Exacerbation Failed Escalation":
    "Failure to escalate uncontrolled/severe patients to double therapy percent",
  "Number of ICS Escalation Delay":
    "Delay in escalating patients to double therapy",
  "Percent of ICS Escalation Delay":
    "Delay in escalating patients to double therapy percent",
  "Number of ICS-LABA High Steroid Usage":
    "Excessive steroid usage on double therapy",
  "Percent of ICS-LABA High Steroid Usage":
    "Excessive steroid usage on double therapy percent",
  "Number of ICS-LABA Exacerbation Failed Escalation":
    "Failure to escalate uncontrolled/severe patients to triple therapy",
  "Percent of ICS-LABA Exacerbation Failed Escalation":
    "Failure to escalate uncontrolled/severe patients to triple therapy percent",
  "Number of ICS-LABA Escalation Delay":
    "Delay in escalating patients from double to triple therapy",
  "Percent of ICS-LABA Escalation Delay":
    "Delay in escalating patients from double to triple therapy percent",
  "Number of Suboptimal Use of Open Triple Therapy":
    "Suboptimal use of open triple therapy",
  "Percent of Suboptimal Use of Open Triple Therapy":
    "Suboptimal use of open triple therapy percent",
  "Number of Non-adherence to Double Therapies":
    "Non-adherence to double therapies",
  "Percent of Non-adherence to Double Therapies":
    "Non-adherence to double therapies percent",
  "Number of Non-adherence to Open Triple Therapies":
    "Non-adherence to open triple therapies",
  "Percent of Non-adherence to Open Triple Therapies":
    "Non-adherence to open triple therapies percent",
  "Number of Non-adherence to Closed Triple Therapies":
    "Non-adherence to closed triple therapies",
  "Percent of Non-adherence to Closed Triple Therapies":
    "Non-adherence to closed triple therapies percent",
};

export const mapLabels = {
  "Total Asthma Patients": "Number of Asthma Patients",
  "Total ICS Patients": "Number of ICS Patients",
  "Total ICS Exacerbations": "Number of ICS Exacerbation",
  "Total ICS-LABA Patients": "Number of ICS-LABA Patients",
  "Total ICS-LABA Exacerbations": "Number of ICS-LABA Exacerbation",
  "Total No Spirometry": "Number of No Spirometry",
  "Percent No Spirometry": "Percent of No Spirometry",
  "Total No EOS Testing": "Number of No EOS Testing",
  "Percent No EOS Testing": "Percent of No EOS Testing",
  "Total No Treatment": "Number of No Treatment",
  "Percent No Treatment": "Percent of No Treatment",
  "Total ICS High Steroid Usage": "Number of ICS High Steroid Usage",
  "Percent ICS High Steroid Usage": "Percent of ICS High Steroid Usage",
  "Total ICS Exacerbation Failed Escalation":
    "Number of ICS Exacerbation Failed Escalation",
  "Percent ICS Exacerbation Failed Escalation":
    "Percent of ICS Exacerbation Failed Escalation",
  "Total ICS Escalation Delay": "Number of ICS Escalation Delay",
  "Percent ICS Escalation Delay": "Percent of ICS Escalation Delay",
  "Total ICS-LABA High Steroid Usage": "Number of ICS-LABA High Steroid Usage",
  "Percent ICS-LABA High Steroid Usage":
    "Percent of ICS-LABA High Steroid Usage",
  "Total ICS-LABA Exacerbation Failed Escalation":
    "Number of ICS-LABA Exacerbation Failed Escalation",
  "Percent ICS-LABA Exacerbation Failed Escalation":
    "Percent of ICS-LABA Exacerbation Failed Escalation",
  "Total ICS-LABA Escalation Delay": "Number of ICS-LABA Escalation Delay",
  "Percent ICS-LABA Escalation Delay": "Percent of ICS-LABA Escalation Delay",
  "Number of Suboptimal Use of Open Triple Therapy":
    "Suboptimal use of open triple therapy",
  "Percent of Suboptimal Use of Open Triple Therapy":
    "Suboptimal use of open triple therapy percent",
  "Number of Non-adherence to Double Therapies":
    "Non-adherence to double therapies",
  "Percent of Non-adherence to Double Therapies":
    "Non-adherence to double therapies percent",
  "Number of Non-adherence to Open Triple Therapies":
    "Non-adherence to open triple therapies",
  "Percent of Non-adherence to Open Triple Therapies":
    "Non-adherence to open triple therapies percent",
  "Number of Non-adherence to Closed Triple Therapies":
    "Non-adherence to closed triple therapies",
  "Percent of Non-adherence to Closed Triple Therapies":
    "Non-adherence to closed triple therapies percent",
};

export const mapBarCharts = {
  chart1: [
    "Total Asthma Patients",
    "Total No Spirometry",
    "Total No EOS Testing",
  ],
  chart2: ["Total Asthma Patients", "Total No Treatment"],
  chart3: [  "Total ICS Patients",
  "Total ICS Exacerbation",
    "Total ICS Exacerbation Failed Escalation",
    "Total ICS High Steroid Usage",
    "Total ICS Escalation Delay",
  ],
  chart4: [
    "Total ICS-LABA Patients",
    "Total ICS-LABA Exacerbations",
    "Total ICS-LABA Exacerbation Failed Escalation",
    "Total ICS-LABA High Steroid Usage",
    "Total ICS-LABA Escalation Delay",
  ],
};
