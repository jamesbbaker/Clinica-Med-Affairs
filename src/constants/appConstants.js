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
  patient_journey: "Patient Trajectory Insights",
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
"Total ICS-LABA LAMA Patients",
"Number of ICS-LABA LAMA Patients"
];

export const unmetLabels = {
  "Incomplete initial asthma testing": {
    id: "Total No Spirometry",
    percent: "Percent No Spirometry",
  },
  "Incomplete severe asthma testing": {
    id: "Total No EOS Testing",
    percent: "Percent No EOS Testing",
  },
  "Exacerbation Prior to Receiving Single Therapy": {
    id: "Total No Treatment",
    percent: "Percent No Treatment",
  },
  "Failure to Escalate Uncontrolled/Severe Patients from Single to Double Therapy":
    {
      id: "Total ICS High Steroid Usage",
      percent: "Percent ICS High Steroid Usage",
    },
  "Excessive Steroid Usage on Single Therapy": {
    id: "Total ICS Exacerbation Failed Escalation",
    percent: "Percent ICS Exacerbation Failed Escalation",
  },
  "Delay in Escalating Patients from Single to Double Therapy":
    {
      id: "Total ICS Escalation Delay",
      percent: "Percent ICS Escalation Delay",
    },
  "Failure to Escalate Uncontrolled/Severe Patients from Double to Triple Therapy":
    {
      id: "Total ICS-LABA High Steroid Usage",
      percent: "Percent ICS-LABA High Steroid Usage",
    },
  "Excessive Steroid Usage on Double Therapy": {
    id: "Total ICS-LABA Exacerbation Failed Escalation",
    percent: "Percent ICS-LABA Exacerbation Failed Escalation",
  },
  "Delay in Escalating Patients from Double to Triple Therapy": {
    id: "Total ICS-LABA Escalation Delay",
    percent: "Percent ICS-LABA Escalation Delay",
  },
  "Use of open triple therapy": {
    id: "Total ICS-LABA With LAMA",
    percent: "Percent ICS-LABA With LAMA",
  },
  "Non-adherence to single therapy (persistence)": {
    id: "Total ICS Persistence < 360",
    percent: "Percent ICS Persistence < 360",
  },
  "Non-adherence to single therapy (compliance)": {
    id: "Total ICS Compliance < 240",
    percent: "Percent ICS-LABA Compliance < 240",
  },
  "Non-adherence to double therapy (persistence)": {
    id: "Total ICS-LABA Persistence < 360",
    percent: "Percent ICS-LABA Persistence < 360",
  },
  "Non-adherence to double therapy (compliance)": {
    id: "Total ICS-LABA Compliance < 240",
    percent: "Percent ICS-LABA Compliance < 240",
  },
  "Non-adherence to triple therapy (persistence)": {
    id: "Total ICS-LABA LAMA Persistence < 360",
    percent: "Percent ICS-LABA LAMA Persistence < 360",
  },
  "Non-adherence to triple therapy (compliance)": {
    id: "Total ICS-LABA LAMA Compliance < 240",
    percent: "Percent ICS-LABA LAMA Compliance < 240",
  },
};

export const mapSelectLabels = {
  "Number of Asthma Patients": "Number of Asthma Patients",
  "Number of ICS Patients": "Number of ICS Patients",
  // "Number of ICS Exacerbation": "Number of ICS Exacerbation",
  "Number of ICS-LABA Patients": "Number of ICS-LABA Patients",
  // "Number of ICS-LABA Exacerbation": "Number of ICS-LABA Exacerbation",
  "Number of ICS-LABA LAMA Patients": "Number of ICS-LABA-LAMA Patients",
  "Number of No Spirometry": "Incomplete initial asthma testing",
  "Percent of No Spirometry": "Incomplete initial asthma testing percent",
  "Number of No EOS Testing": "Incomplete severe asthma testing",
  "Percent of No EOS Testing": "Incomplete severe asthma testing percent",
  "Number of No Treatment": "Exacerbation Prior to Receiving Single Therapy",
  "Percent of No Treatment":
    "Exacerbation Prior to Receiving Single Therapy percent",
  "Number of ICS High Steroid Usage":
    "Failure to Escalate from Single to Double Therapy",
  "Percent of ICS High Steroid Usage":
    "Failure to Escalate from Single to Double Therapy percent",
  "Number of ICS Exacerbation Failed Escalation":
    "Excessive Steroid Usage on Single Therapy",
  "Percent of ICS Exacerbation Failed Escalation":
    "Excessive Steroid Usage on Single Therapy percent",
  "Number of ICS Escalation Delay":
    "Delay in Escalating Patients from Single to Double Therapy",
  "Percent of ICS Escalation Delay":
    "Delay in Escalating Patients from Single to Double Therapy percent",
  "Number of ICS-LABA High Steroid Usage":
    "Failure to Escalate Patients from Double to Triple Therapy",
  "Percent of ICS-LABA High Steroid Usage":
    "Failure to Escalate from Double to Triple Therapy percent",
  "Number of ICS-LABA Exacerbation Failed Escalation":
    "Excessive Steroid Usage on Double Therapy",
  "Percent of ICS-LABA Exacerbation Failed Escalation":
    "Excessive Steroid Usage on Double Therapy percent",
  "Number of ICS-LABA Escalation Delay":
    "Delay in Escalating Patients from Double to Triple Therapy",
  "Percent of ICS-LABA Escalation Delay":
    "Delay in Escalating Patients from Double to Triple Therapy percent",
  "Number of ICS-LABA Patients with LAMA": "Use of open triple therapy",
  "Percent of ICS-LABA Patients with LAMA":
    "Use of open triple therapy percent",
  "Number of ICS Persistence < 360":
    "Non-adherence to single therapy (persistence)",
  "Percent of ICS Persistence < 360":
    "Non-adherence to single therapy (persistence) percent",
  "Number of ICS Compliance < 240":
    "Non-adherence to single therapy (compliance)",
  "Percent of ICS Compliance < 240":
    "Non-adherence to single therapy (compliance) percent",
  "Number of ICS-LABA Persistence < 360":
    "Non-adherence to double therapy (persistence)",
  "Percent of ICS-LABA Persistence < 360":
    "Non-adherence to double therapy (persistence) percent",
  "Number of ICS-LABA Compliance < 240":
    "Non-adherence to double therapy (compliance)",
  "Percent of ICS-LABA Compliance < 240":
    "Non-adherence to double therapy (compliance) percent",
  "Number of ICS-LABA LAMA Persistence < 360":
    "Non-adherence to triple therapy (persistence)",
  "Percent of ICS-LABA LAMA Persistence < 360":
    "Non-adherence to triple therapy (persistence) percent",
  "Number of ICS-LABA LAMA Compliance < 240":
    "Non-adherence to triple therapy (compliance)",
  "Percent of ICS-LABA LAMA Compliance < 240":
    "Non-adherence to triple therapy (compliance) percent",
}


export const selectLabels = {
  "Number of Asthma Patients": "Number of Asthma Patients",
  "Number of ICS Patients": "Number of ICS Patients",
  // "Number of ICS Exacerbation": "Number of ICS Exacerbation",
  "Number of ICS-LABA Patients": "Number of ICS-LABA Patients",
  // "Number of ICS-LABA Exacerbation": "Number of ICS-LABA Exacerbation",
  "Number of ICS-LABA LAMA Patients": "Number of ICS-LABA-LAMA Patients",
  "Number of No Spirometry": "Incomplete initial asthma testing",
  "Percent of No Spirometry": "Incomplete initial asthma testing percent",
  "Number of No EOS Testing": "Incomplete severe asthma testing",
  "Percent of No EOS Testing": "Incomplete severe asthma testing percent",
  "Number of No Treatment": "Exacerbation Prior to Receiving Single Therapy",
  "Percent of No Treatment":
    "Exacerbation Prior to Receiving Single Therapy percent",
  "Number of ICS High Steroid Usage":
    "Failure to Escalate Uncontrolled/Severe Patients from Single to Double Therapy",
  "Percent of ICS High Steroid Usage":
    "Failure to Escalate Uncontrolled/Severe Patients from Single to Double Therapy percent",
  "Number of ICS Exacerbation Failed Escalation":
    "Excessive Steroid Usage on Single Therapy",
  "Percent of ICS Exacerbation Failed Escalation":
    "Excessive Steroid Usage on Single Therapy percent",
  "Number of ICS Escalation Delay":
    "Delay in Escalating Patients from Single to Double Therapy",
  "Percent of ICS Escalation Delay":
    "Delay in Escalating Patients from Single to Double Therapy percent",
  "Number of ICS-LABA High Steroid Usage":
    "Failure to Escalate Uncontrolled/Severe Patients from Double to Triple Therapy",
  "Percent of ICS-LABA High Steroid Usage":
    "Failure to Escalate Uncontrolled/Severe Patients from Double to Triple Therapy percent",
  "Number of ICS-LABA Exacerbation Failed Escalation":
    "Excessive Steroid Usage on Double Therapy",
  "Percent of ICS-LABA Exacerbation Failed Escalation":
    "Excessive Steroid Usage on Double Therapy percent",
  "Number of ICS-LABA Escalation Delay":
    "Delay in Escalating Patients from Double to Triple Therapy",
  "Percent of ICS-LABA Escalation Delay":
    "Delay in Escalating Patients from Double to Triple Therapy percent",
  "Number of ICS-LABA Patients with LAMA": "Use of open triple therapy",
  "Percent of ICS-LABA Patients with LAMA":
    "Use of open triple therapy percent",
  "Number of ICS Persistence < 360":
    "Non-adherence to single therapy (persistence)",
  "Percent of ICS Persistence < 360":
    "Non-adherence to single therapy (persistence) percent",
  "Number of ICS Compliance < 240":
    "Non-adherence to single therapy (compliance)",
  "Percent of ICS Compliance < 240":
    "Non-adherence to single therapy (compliance) percent",
  "Number of ICS-LABA Persistence < 360":
    "Non-adherence to double therapy (persistence)",
  "Percent of ICS-LABA Persistence < 360":
    "Non-adherence to double therapy (persistence) percent",
  "Number of ICS-LABA Compliance < 240":
    "Non-adherence to double therapy (compliance)",
  "Percent of ICS-LABA Compliance < 240":
    "Non-adherence to double therapy (compliance) percent",
  "Number of ICS-LABA LAMA Persistence < 360":
    "Non-adherence to triple therapy (persistence)",
  "Percent of ICS-LABA LAMA Persistence < 360":
    "Non-adherence to triple therapy (persistence) percent",
  "Number of ICS-LABA LAMA Compliance < 240":
    "Non-adherence to triple therapy (compliance)",
  "Percent of ICS-LABA LAMA Compliance < 240":
    "Non-adherence to triple therapy (compliance) percent",
};

export const mapLabels = {
    "Total Asthma Patients": "Number of Asthma Patients",
    "Total No Spirometry": "Number of No Spirometry",
    "Percent No Spirometry": "Percent of No Spirometry",
    "Total No EOS Testing": "Number of No EOS Testing",
    "Percent No EOS Testing": "Percent of No EOS Testing",
    "Total No Treatment": "Number of No Treatment",
    "Percent No Treatment": "Percent of No Treatment",
    "Total ICS Patients": "Number of ICS Patients",
    "Total ICS Compliance < 240": "Number of ICS Compliance < 240",
    "Percent ICS Compliance < 240": "Percent of ICS Compliance < 240",
    "Total ICS Persistence < 360": "Number of ICS Persistence < 360",
    "Percent ICS Persistence < 360": "Percent of ICS Persistence < 360",
    "Total ICS High Steroid Usage": "Number of ICS High Steroid Usage",
    "Percent ICS High Steroid Usage": "Percent of ICS High Steroid Usage",
    "Total ICS Exacerbations": "Number of ICS Exacerbation",
    "Total ICS Exacerbation Failed Escalation": "Number of ICS Exacerbation Failed Escalation",
    "Percent ICS Exacerbation Failed Escalation": "Percent of ICS Exacerbation Failed Escalation",
    "Total ICS Escalation Delay": "Number of ICS Escalation Delay",
    "Percent ICS Escalation Delay": "Percent of ICS Escalation Delay",
    "Total ICS-LABA Patients": "Number of ICS-LABA Patients",
    "Total ICS-LABA Compliance < 240": "Number of ICS-LABA Compliance < 240",
    "Percent ICS-LABA Compliance < 240": "Percent of ICS-LABA Compliance < 240",
    "Total ICS-LABA Persistence < 360": "Number of ICS-LABA Persistence < 360",
    "Percent ICS-LABA Persistence < 360": "Percent of ICS-LABA Persistence < 360",
    "Total ICS-LABA High Steroid Usage": "Number of ICS-LABA High Steroid Usage",
    "Percent ICS-LABA High Steroid Usage": "Percent of ICS-LABA High Steroid Usage",
    "Total ICS-LABA Exacerbations": "Number of ICS-LABA Exacerbation",
    "Total ICS-LABA Exacerbation Failed Escalation": "Number of ICS-LABA Exacerbation Failed Escalation",
    "Percent ICS-LABA Exacerbation Failed Escalation": "Percent of ICS-LABA Exacerbation Failed Escalation",
    "Total ICS-LABA Escalation Delay": "Number of ICS-LABA Escalation Delay",
    "Percent ICS-LABA Escalation Delay": "Percent of ICS-LABA Escalation Delay",
    "Total ICS-LABA LAMA Patients": "Number of ICS-LABA LAMA Patients",
    "Total ICS-LABA LAMA Compliance < 240": "Number of ICS-LABA LAMA Compliance < 240",
    "Percent ICS-LABA LAMA Compliance < 240": "Percent of ICS-LABA LAMA Compliance < 240",
    "Total ICS-LABA LAMA Persistence < 360": "Number of ICS-LABA LAMA Persistence < 360",
    "Percent ICS-LABA LAMA Persistence < 360": "Percent of ICS-LABA LAMA Persistence < 360",
    "Total ICS-LABA With LAMA": "Number of ICS-LABA Patients with LAMA",
    "Percent ICS-LABA With LAMA": "Percent of ICS-LABA Patients with LAMA"  
};

export const invertedMapLabels = {
  "Number of Asthma Patients": "Total Asthma Patients",
  "Number of No Spirometry": "Total No Spirometry",
  "Percent of No Spirometry": "Percent No Spirometry",
  "Number of No EOS Testing": "Total No EOS Testing",
  "Percent of No EOS Testing": "Percent No EOS Testing",
  "Number of No Treatment": "Total No Treatment",
  "Percent of No Treatment": "Percent No Treatment",
  "Number of ICS Patients": "Total ICS Patients",
  "Number of ICS Compliance < 240": "Total ICS Compliance < 240",
  "Percent of ICS Compliance < 240": "Percent ICS Compliance < 240",
  "Number of ICS Persistence < 360": "Total ICS Persistence < 360",
  "Percent of ICS Persistence < 360": "Percent ICS Persistence < 360",
  "Number of ICS High Steroid Usage": "Total ICS High Steroid Usage",
  "Percent of ICS High Steroid Usage": "Percent ICS High Steroid Usage",
  "Number of ICS Exacerbation": "Total ICS Exacerbations",
  "Number of ICS Exacerbation Failed Escalation": "Total ICS Exacerbation Failed Escalation",
  "Percent of ICS Exacerbation Failed Escalation": "Percent ICS Exacerbation Failed Escalation",
  "Number of ICS Escalation Delay": "Total ICS Escalation Delay",
  "Percent of ICS Escalation Delay": "Percent ICS Escalation Delay",
  "Number of ICS-LABA Patients": "Total ICS-LABA Patients",
  "Number of ICS-LABA Compliance < 240": "Total ICS-LABA Compliance < 240",
  "Percent of ICS-LABA Compliance < 240": "Percent ICS-LABA Compliance < 240",
  "Number of ICS-LABA Persistence < 360": "Total ICS-LABA Persistence < 360",
  "Percent of ICS-LABA Persistence < 360": "Percent ICS-LABA Persistence < 360",
  "Number of ICS-LABA High Steroid Usage": "Total ICS-LABA High Steroid Usage",
  "Percent of ICS-LABA High Steroid Usage": "Percent ICS-LABA High Steroid Usage",
  "Number of ICS-LABA Exacerbation": "Total ICS-LABA Exacerbations",
  "Number of ICS-LABA Exacerbation Failed Escalation": "Total ICS-LABA Exacerbation Failed Escalation",
  "Percent of ICS-LABA Exacerbation Failed Escalation": "Percent ICS-LABA Exacerbation Failed Escalation",
  "Number of ICS-LABA Escalation Delay": "Total ICS-LABA Escalation Delay",
  "Percent of ICS-LABA Escalation Delay": "Percent ICS-LABA Escalation Delay",
  "Number of ICS-LABA LAMA Patients": "Total ICS-LABA LAMA Patients",
  "Number of ICS-LABA LAMA Compliance < 240": "Total ICS-LABA LAMA Compliance < 240",
  "Percent of ICS-LABA LAMA Compliance < 240": "Percent ICS-LABA LAMA Compliance < 240",
  "Number of ICS-LABA LAMA Persistence < 360": "Total ICS-LABA LAMA Persistence < 360",
  "Percent of ICS-LABA LAMA Persistence < 360": "Percent ICS-LABA LAMA Persistence < 360",
  "Number of ICS-LABA Patients with LAMA": "Total ICS-LABA With LAMA",
  "Percent of ICS-LABA Patients with LAMA": "Percent ICS-LABA With LAMA"  
};


export const filterColors = {
  "Total Asthma Patients": "#5b0c0f",
  "Total No Spirometry": "#2b262c",
  "Percent No Spirometry": "#31c2b2",
  "Total No EOS Testing": "#244cef",
  "Percent No EOS Testing": "#5d6cdd",
  "Total No Treatment": "#c77542",
  "Percent No Treatment": "#bc1a14",
  "Total ICS Patients": "#d5eba5",
  "Total ICS Compliance < 240": "#53249c",
  "Percent ICS Compliance < 240": "#1ac807",
  "Total ICS Persistence < 360": "#0512d2",
  "Percent ICS Persistence < 360": "#b04b3c",
  "Total ICS High Steroid Usage": "#72025e",
  "Percent ICS High Steroid Usage": "#56a44f",
  "Total ICS Exacerbations": "#298f07",
  "Total ICS Exacerbation Failed Escalation": "#8bdae5",
  "Percent ICS Exacerbation Failed Escalation": "#8fa0d3",
  "Total ICS Escalation Delay": "#8cacc3",
  "Percent ICS Escalation Delay": "#cb136d",
  "Total ICS-LABA Patients": "#1b6454",
  "Total ICS-LABA Compliance < 240": "#8340d4",
  "Percent ICS-LABA Compliance < 240": "#13e058",
  "Total ICS-LABA Persistence < 360": "#90bbc3",
  "Percent ICS-LABA Persistence < 360": "#bd3ef0",
  "Total ICS-LABA High Steroid Usage": "#5df04f",
  "Percent ICS-LABA High Steroid Usage": "#66a6f1",
  "Total ICS-LABA Exacerbations": "#8fadb4",
  "Total ICS-LABA Exacerbation Failed Escalation": "#827479",
  "Percent ICS-LABA Exacerbation Failed Escalation": "#d19fa4",
  "Total ICS-LABA Escalation Delay": "#d0e371",
  "Percent ICS-LABA Escalation Delay": "#17f36c",
  "Total ICS-LABA LAMA Patients": "#09af84",
  "Total ICS-LABA LAMA Compliance < 240": "#751423",
  "Percent ICS-LABA LAMA Compliance < 240": "#3530b8",
  "Total ICS-LABA LAMA Persistence < 360": "#05950f",
  "Percent ICS-LABA LAMA Persistence < 360": "#27d953",
  "Total ICS-LABA With LAMA": "#bddc13",
  "Percent ICS-LABA With LAMA": "#82820d"
}

export const mapBarCharts = {
  chart1: [
    "Total Asthma Patients",
    "Total No Spirometry",
    "Total No EOS Testing",
    "Total No Treatment"
  ],
  chart2: ["Total Asthma Patients", "Total No Treatment"],
  chart3: [
    "Total ICS Patients",
    "Total ICS Exacerbation Failed Escalation",
    "Total ICS High Steroid Usage",
    "Total ICS Escalation Delay",
    "Total ICS Persistence < 360",
    "Total ICS Compliance < 240",
    
  ],
  chart4: [
    "Total ICS-LABA Patients",
    "Total ICS-LABA Exacerbation Failed Escalation",
    "Total ICS-LABA High Steroid Usage",
    "Total ICS-LABA Escalation Delay",
    "Total ICS-LABA Persistence < 360",
    "Total ICS-LABA Compliance < 240",
    
  ],
  chart5: [
    "Total ICS-LABA LAMA Patients",
    "Total ICS-LABA LAMA Persistence < 360",
    "Total ICS-LABA LAMA Compliance < 240",
    'Total ICS-LABA With LAMA',
  ],
};


