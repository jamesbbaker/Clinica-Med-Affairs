import React, { useContext, useEffect, useMemo, useState } from "react";
import unmetChart from "../../../assets/images/unmetChart.png";
import Popup from "reactjs-popup";
import { getDataStats } from "../../../API/Outputs";
import { AuthContext } from "../../../context/AuthContext";
import { generateStatsOptions, setLineData } from "../../../utils/ChartUtils";
import { LineChart } from "../../../components/LineChart";
import BarChart from "../../../components/BarChart";
import Table from "../../../components/Table";
import { selectLabels, unmetLabels } from "../../../constants/appConstants";

const UnmetNeedDefinitionData = {
  id1: {
    id: "id1",
    title: "Key treatment decisions",
    buttonText: "",
    description: "Lorem Ipsum",
    color: "#8CC9E6",
  },
  id2: {
    id: "id2",
    title: "After diagnosis, do patients receive a spirometry test?",
    buttonText: "Incomplete initial asthma testing",
    column: "No spirometry",
    description: (
      <div>
        Patients who do not receive one of the following codes that indicate
        spirometry testing:
        <ul>
          <li>94010 - Breathing capacity test (spirometry)</li>
          <li>
            94060 - Evaluation of wheezing (spirometry with bronchodilator)
          </li>
          <li>
            94070 - Evaluation of wheezing (bronchospasm evaluation; spirometry
            as part of the test)
          </li>
          <li>94375 - Respiratory flow volume loop (part of spirometry)</li>
        </ul>
      </div>
    ),
    color: "#8CC9E6",
  },
  id3: {
    id: "id3",
    title:
      "Do severe or uncontrolled asthma patients receive IGE and EOS/CBC testing?",
    buttonText: "Incomplete severe asthma testing",
    column: "No EOS",
    description: (
      <div>
        Patients with at least one asthma exacerbation who do not receive one of
        the following EOS tests:
        <ul>
          <li>
            85025 - Complete blood count (CBC) with automated differential WBC
            count
          </li>
          <li>85048 - Leukocyte (WBC), automated</li>
          <li>85004 - Automated differential WBC count</li>
          <li>85013 - Blood count; eosinophil count, direct</li>
        </ul>
      </div>
    ),
    color: "#8CC9E6",
  },
  id4: {
    id: "id4",
    title: "Treatment (prior to receiving ICS or beta-agonist)",
    description: "Lorem Ipsum",
    buttonText: "",
    color: "#6FA9D9",
  },
  id5: {
    id: "id5",
    title: "Do patients diagnosed with asthma receive any treatment at all?",
    buttonText: "Exacerbation Prior to Receiving Single Therapy",
    column: "No treatment",
    description:
      "Patients who have at least one exacerbation but never receive ICS or beta-agonist treatment after their asthma diagnosis. Exacerbations are defined as visits to the ED/ER with a primary asthma diagnosis code or specific asthma treatments (e.g., emergency airway insertion, airway inhalation treatment, or nebulizer with compression).",
    color: "#6FA9D9",
  },
  id19: {
    id: "id19",
    title: "Treatment (ICS or beta-agonist)",
    description: "Lorem Ipsum",
    buttonText: "",
    color: "#81BEBB",
  },
  id6: {
    id: "id6",
    title:
      "Are uncontrolled or severe patients receiving ICS/beta-agonists escalated to double therapy?",
    buttonText:
      "Failure to Escalate Uncontrolled/Severe Patients from Single to Double Therapy",
    column: "ICS failed escalation",
    description:
      "Patients on ICS or beta-agonists with at least one exacerbations that are not escalated to double therapy. Exacerbations are defined as visits to the ED/ER with a primary asthma diagnosis code or specific asthma treatments (e.g., emergency airway insertion, airway inhalation treatment, or nebulizer with compression).",
    color: "#81BEBB",
  },
  id17: {
    id: "id17",
    title:
      "Do patients receive excessive OCS by either consistency or quantity of use when receiving ICS/beta-agonists?",
    buttonText: "Excessive Steroid Usage on Single Therapy",
    column: "ICS High steroid usage",
    description:
      "Patients on ICS or beta-agonists who receive more than 450mg of OCS in a year. OCS is converted to prednisone equivalent milligrams, calculated using prescribed dose, quantity, and days supply.",
    color: "#81BEBB",
  },
  id7: {
    id: "id7",
    title:
      "How long does it take from demonstrating severe/uncontrolled asthma to treatment escalation?",
    buttonText: "Delay in Escalating Patients from Single to Double Therapy",
    column: "ICS escalation delay",
    description:
      "Patients who are escalated from single to double therapy more than 60 days after their first exacerbation. Exacerbations are defined as visits to the ED/ER with a primary asthma diagnosis code or specific asthma treatments (e.g., emergency airway insertion, airway inhalation treatment, or nebulizer with compression).",
    color: "#81BEBB",
  },
  id21: {
    id: "id21",
    title: "Treatment (ICS-LABA)",
    description: "Lorem Ipsum",
    buttonText: "",
    color: "#88C8B7",
  },
  id8: {
    id: "id8",
    title:
      "Are uncontrolled or severe patients receiving double therapies escalated to triple therapy?",
    buttonText:
      "Failure to Escalate Uncontrolled/Severe Patients from Double to Triple Therapy",
    Column: "ICS-LABA failed escalation",
    description:
      "Patients on double therapy who experience exacerbations but are not escalated to triple therapy or biologics. Exacerbations are defined as visits to the ED/ER with a primary asthma diagnosis code or specific asthma treatments (e.g., emergency airway insertion, airway inhalation treatment, or nebulizer with compression).",
    color: "#88C8B7",
  },
  id18: {
    id: "id18",
    title:
      "Do patients receive excessive OCS by either consistency or quantity of use when receiving double therapies?",
    buttonText: "Excessive Steroid Usage on Double Therapy",
    column: "ICS-LABA high steroid usage",
    description:
      "Patients on double therapy who receive more than 450mg of OCS in a year. OCS is converted to prednisone equivalent milligrams, calculated using prescribed dose, quantity, and days supply.",
    color: "#88C8B7",
  },
  id9: {
    id: "id9",
    title:
      "How long does it take from demonstrating severe/uncontrolled asthma to treatment escalation?",
    buttonText: "Delay in Escalating Patients from Double to Triple Therapy",
    column: "ICS-LABA escalation delay",
    description:
      "Patients who are escalated from double to triple therapy more than 60 days after their first exacerbation. Exacerbations are defined as visits to the ED/ER with a primary asthma diagnosis code or specific asthma treatments (e.g., emergency airway insertion, airway inhalation treatment, or nebulizer with compression).",
    color: "#88C8B7",
  },
  id10: {
    id: "id10",
    title: "Do patients receive open triple therapies?",
    buttonText: "Use of open triple therapy",
    column: "ICS-LABA with LAMA",
    description:
      "Patients on double therapy who are escalated to a separate LAMA therapy.",
    color: "#94D3A2",
  },
  id12: {
    id: "id12",
    title: "Therapy support and adherence",
    description: "Lorem Ipsum",
    buttonText: "",
    color: "#94D3A2",
  },
  id13: {
    id: "id13",
    title: "Are patients persistence on single therapy?",
    buttonText: "Non-adherence to single therapy (persistence)",
    column: "ICS persistence",
    description:
      "Patients who discontinue ICS or beta-agonist treatment within 1 year of beginning therapy.",
    color: "#94D3A2",
  },
  id14: {
    id: "id14",
    title: "Are patients compliant on single therapy?",
    buttonText: "Non-adherence to single therapy (compliance)",
    column: "ICS compliance",
    description:
      "Patients who receive less than 240 days supply of ICS or beta-agonist in their first year on therapy.",
    color: "#94D3A2",
  },
  id15: {
    id: "id15",
    title: "Are patients persistence on double therapy?",
    column: "ICS-LABA persistence",
    buttonText: "Non-adherence to double therapy (persistence)",
    description:
      "Patients who discontinue ICS-LABA treatment within 1 year of beginning therapy.",
    color: "#94D3A2",
  },
  id30: {
    id: "id30",
    title: "Are patients compliant on double therapy?",
    column: "ICS-LABA compliance",
    buttonText: "Non-adherence to double therapy (compliance)",
    description:
      "Patients who receive less than 240 days supply of ICS-LABA in their first year on therapy.",
    color: "#94D3A2",
  },
  id31: {
    id: "id31",
    title: "Are patients persistence on triple therapy?",
    buttonText: "Non-adherence to triple therapy (persistence)",
    column: "ICS-LABA-LAMA persistence",
    description:
      "Patients who discontinue ICS-LABA-LAMA treatment within 1 year of beginning therapy.",
    color: "#94D3A2",
  },
  id32: {
    id: "id32",
    title: "Are patients compliant on triple therapy?",
    column: "ICS-LABA-LAMA compliance",
    buttonText: "Non-adherence to triple therapy (compliance)",
    description:
      "Patients who receive less than 240 days supply of ICS-LABA-LAMA in their first year on therapy.",
    color: "#94D3A2",
  },
};

const UnmetNeedDefinition = () => {
  const [modalId, setModalId] = useState(null);
  const [statsData1, setStatsData1] = useState(null);
  const [statsData2, setStatsData2] = useState(null);
  const [statsData3, setStatsData3] = useState(null);
  const [statsData4, setStatsData4] = useState(null);
  const [statsData5, setStatsData5] = useState(null);
  const [statsData6, setStatsData6] = useState(null);
  const [statsData7, setStatsData7] = useState(null);
  const [statsData8, setStatsData8] = useState(null);
  const [statsData9, setStatsData9] = useState(null);
  const [statsData10, setStatsData10] = useState(null);
  const [statsData11, setStatsData11] = useState(null);
  const [statsData12, setStatsData12] = useState(null);
  const [nationalData, setNationalData] = useState(null);
  const [statsData13, setStatsData13] = useState(null);
  const [statsData14, setStatsData14] = useState(null);
  const [statsData15, setStatsData15] = useState(null);
  const [statsData16, setStatsData16] = useState(null);
  const [statsData18, setStatsData18] = useState(null);
  const [statsData19, setStatsData19] = useState(null);
  const [statsData20, setStatsData20] = useState(null);
  const [statsData21, setStatsData21] = useState(null);
  const [statsData22, setStatsData22] = useState(null);
  const [statsData23, setStatsData23] = useState(null);
  const [statsData24, setStatsData24] = useState(null);
  const [statsData25, setStatsData25] = useState(null);
  const [dataValue, setDataValue] = useState(null);
  const { accessToken, refreshToken } = useContext(AuthContext);
  const [showTooltip, setTooltip] = useState({
    id: "",
    index: null,
  });

  useEffect(() => {
    getDataStats("national_data", accessToken, refreshToken).then(
      async (res) => {
        if (res) {
          setNationalData(res.summary_data);
        }
      }
    );
  }, []);

  const Table_Columns_3 = useMemo(() => {
    const USERS_TABLE_COLUMNS = [
      {
        Header: "Metric",
        accessor: "Metric",
      },
      {
        Header: "Value",
        accessor: "Value",
      },
    ];
    return USERS_TABLE_COLUMNS;
  }, []);

  const compliance_options = useMemo(() => {
    return {
      indexAxis: "x",
      elements: {
        bar: {
          borderWidth: 1,
        },
      },
      responsive: true,
      scales: {
        y: {
          title: {
            display: true,
            text: "patients",
          },
        },
        x: {
          title: {
            display: true,
            text: "Total Days Supply in First Year on Therapy",
          },
          grid: {
            display: false, // Turn off grid lines for x-axis
          },
          ticks: {
            font: {
              size: 10,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          display: false,
        },
      },
    };
  }, []);

  const excessive_double_2 = useMemo(() => {
    return {
      indexAxis: "x",
      elements: {
        bar: {
          borderWidth: 1,
        },
      },
      responsive: true,
      scales: {
        y: {
          title: {
            display: true,
            text: "patients",
          },
        },
        x: {
          title: {
            display: true,
            text: "Days Supply in Year after receiving OCS",
          },
          grid: {
            display: false, // Turn off grid lines for x-axis
          },
          ticks: {
            font: {
              size: 10,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          display: false,
        },
      },
    };
  }, []);

  const excessive_ocs_options_2 = useMemo(() => {
    return {
      indexAxis: "x",
      elements: {
        bar: {
          borderWidth: 1,
        },
      },
      responsive: true,
      scales: {
        y: {
          title: {
            display: true,
            text: "patients",
          },
        },
        x: {
          title: {
            display: true,
            text: "Number of distinct OCS prescriptions in year on treatment",
          },
          grid: {
            display: false, // Turn off grid lines for x-axis
          },
          ticks: {
            font: {
              size: 10,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          display: false,
        },
      },
    };
  }, []);

  const excessive_options_2 = useMemo(() => {
    return {
      indexAxis: "x",
      elements: {
        bar: {
          borderWidth: 1,
        },
      },
      responsive: true,
      scales: {
        y: {
          title: {
            display: true,
            text: "patients",
          },
        },
        x: {
          title: {
            display: true,
            text: "Number of Distinct Calendar Months with OCS Prescription",
          },
          grid: {
            display: false, // Turn off grid lines for x-axis
          },
          ticks: {
            font: {
              size: 10,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          display: false,
        },
      },
    };
  }, []);

  const excessive_options = useMemo(() => {
    return {
      indexAxis: "x",
      elements: {
        bar: {
          borderWidth: 1,
        },
      },
      responsive: true,
      scales: {
        y: {
          title: {
            display: true,
            text: "patients",
          },
        },
        x: {
          title: {
            display: true,
            text: "Days Supply in Year after receiving Single Therapy",
          },
          grid: {
            display: false, // Turn off grid lines for x-axis
          },
          ticks: {
            font: {
              size: 10,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          display: false,
        },
      },
    };
  }, []);

  const persistence_options = useMemo(() => {
    return {
      indexAxis: "x",
      elements: {
        bar: {
          borderWidth: 1,
        },
      },
      responsive: true,
      scales: {
        y: {
          title: {
            display: true,
            text: "patients",
          },
        },
        x: {
          title: {
            display: true,
            text: "Days from Start of Therapy to Discontinuation",
          },
          grid: {
            display: false, // Turn off grid lines for x-axis
          },
          ticks: {
            font: {
              size: 10,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          display: false,
        },
      },
    };
  }, []);
  const chart_8_options = useMemo(() => {
    return {
      indexAxis: "x",
      elements: {
        bar: {
          borderWidth: 1,
        },
      },
      responsive: true,
      scales: {
        y: {
          title: {
            display: true,
            text: "patients",
          },
        },
        x: {
          title: {
            display: true,
            text: "Time from diagnosis to spirometry testing",
          },
          grid: {
            display: false, // Turn off grid lines for x-axis
          },
          ticks: {
            font: {
              size: 10,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          display: false,
        },
      },
    };
  }, []);

  const chart_9_options = useMemo(() => {
    return {
      indexAxis: "x",
      elements: {
        bar: {
          borderWidth: 1,
        },
      },
      responsive: true,
      scales: {
        y: {
          title: {
            display: true,
            text: "patients",
          },
        },
        x: {
          title: {
            display: true,
            text: "Time from diagnosis to EOS / CBC testing",
          },
          grid: {
            display: false, // Turn off grid lines for x-axis
          },
          ticks: {
            font: {
              size: 10,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          display: false,
        },
      },
    };
  }, []);

  const chart_10_options = useMemo(() => {
    return {
      indexAxis: "x",
      elements: {
        bar: {
          borderWidth: 1,
        },
      },
      responsive: true,
      scales: {
        y: {
          title: {
            display: true,
            text: "patients",
          },
        },
        x: {
          title: {
            display: true,
            text: "Time from exacerbation to escalation",
          },
          grid: {
            display: false, // Turn off grid lines for x-axis
          },
          ticks: {
            font: {
              size: 10,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          display: false,
        },
      },
    };
  }, []);

  const _options = useMemo(() => {
    return {
      indexAxis: "x",
      elements: {
        bar: {
          borderWidth: 1,
        },
      },
      responsive: true,
      scales: {
        y: {
          title: {
            display: true,
            text: "Patient Years",
          },
        },
        x: {
          title: {
            display: true,
            text: "Asthma Visits per Year",
          },
          grid: {
            display: false, // Turn off grid lines for x-axis
          },
          ticks: {
            font: {
              size: 10,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          display: false,
        },
      },
    };
  }, []);

  const chart_2_options = useMemo(() => {
    return {
      indexAxis: "x",
      elements: {
        bar: {
          borderWidth: 1,
        },
      },
      responsive: true,
      scales: {
        y: {
          // min: 0, // Set minimum value for the x-axis
          // max: 2000,
          title: {
            display: true,
            text: "Patients",
          },
        },
        x: {
          title: {
            display: true,
            text: "Max Monthly Steroid MGs",
          },
          grid: {
            display: false, // Turn off grid lines for x-axis
          },
          ticks: {
            font: {
              size: 10,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Max Monthly Steroid Dosage for ICS-LABA patients", // Chart title
          font: {
            size: 14, // Increase font size
          },
        },
        datalabels: {
          display: false,
        },
      },
    };
  }, []);

  const chart_3_options = useMemo(() => {
    return {
      indexAxis: "x",
      elements: {
        bar: {
          borderWidth: 1,
        },
      },
      responsive: true,
      scales: {
        y: {
          // min: 0, // Set minimum value for the x-axis
          // max: 2000,
          title: {
            display: true,
            text: "Patients",
          },
        },
        x: {
          //   min: 0, // Set minimum value for the x-axis
          // max: 2500,
          title: {
            display: true,
            text: "Max Yearly Steroid MGs",
          },
          grid: {
            display: false, // Turn off grid lines for x-axis
          },
          ticks: {
            font: {
              size: 10,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Max Yearly Steroid Dosage for ICS-LABA patients",
          font: {
            size: 14, // Increase font size
          },
        },
        datalabels: {
          display: false,
        },
      },
    };
  }, []);

  const Line_options_2 = useMemo(() => {
    return generateStatsOptions("Escalation from double therapies");
  }, []);

  const handleClose = () => {
    setStatsData1(null);
    setStatsData2(null);
    setStatsData3(null);
    setStatsData4(null);
    setStatsData5(null);
    setStatsData6(null);
    setStatsData7(null);
    setStatsData8(null);
    setStatsData9(null);
    setStatsData10(null);
    setStatsData11(null);
    setStatsData12(null);
    setStatsData13(null);
    setStatsData14(null);
    setStatsData15(null);
    setStatsData16(null);
    setStatsData18(null);
    setStatsData19(null);
    setStatsData20(null);
    setStatsData21(null);
    setStatsData22(null);
    setStatsData23(null);
    setStatsData24(null);
    setStatsData25(null);
    setModalId(null);
  };

  function getLineChart(res) {
    const responseData = res.data;

    const labels = [];
    const New_ICS_LABA_PatientsData = [];
    const Receive_BiologicData = [];
    const Receive_Closed_TripleData = [];
    const Receive_LAMAData = [];
    const Receive_LTRAData = [];
    responseData.sort((a, b) => {
      return new Date(a.Date) - new Date(b.Date);
    });
    const filteredData = responseData.filter((item) => {
      // Convert Date string to Date object
      const date = new Date(item.Date);

      // Create a Date object for January 2016
      const jan2016 = new Date(2016, 0, 1); // January is month 0

      // Check if the date is after January 2016
      return date >= jan2016;
    });
    filteredData.forEach((entry) => {
      const Date = entry["Date"];
      const New_ICS_LABA_Patients = entry["New_ICS_LABA_Patients"];
      const Receive_Biologic = entry["Receive_Biologic"];
      const Receive_Closed_Triple = entry["Receive_Closed_Triple"];
      const Receive_LAMA = entry["Receive_LAMA"];
      const Receive_LTRA = entry["Receive_LTRA"];
      labels.push(`${Date}`);
      New_ICS_LABA_PatientsData.push(New_ICS_LABA_Patients);
      Receive_BiologicData.push(Receive_Biologic);
      Receive_Closed_TripleData.push(Receive_Closed_Triple);
      Receive_LAMAData.push(Receive_LAMA);
      Receive_LTRAData.push(Receive_LTRA);
    });

    const data = {
      labels: labels,
      datasets: [
        {
          label: "New ICS LABA Patients",
          data: New_ICS_LABA_PatientsData,
          borderColor: "rgb(255, 99, 132)",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Receive Biologic",
          data: Receive_BiologicData,
          borderColor: "rgb(54, 162, 235)",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Receive Closed Triple",
          data: Receive_Closed_TripleData,
          borderColor: "rgb(542, 62, 35)",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Receive LAMA",
          data: Receive_LAMAData,
          borderColor: "rgb(142, 162, 35)",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Receive LTRA",
          data: Receive_LTRAData,
          borderColor: "rgb(42, 262, 195)",
          borderWidth: 2,
          fill: false,
        },
      ],
    };
    setStatsData1(data);
  }
  function getIntValue(item) {
    let value = item;
    if (item.includes("-")) {
      value = item.split("-")[1];
    }
    value = parseInt(value.split("mg")[0]);
    return value;
  }

  function getBarChart(res, type1, type2, sortFn) {
   
    let responseData = res.data;
    if (sortFn) {
      responseData = sortFn(res.data);
    } else {
      responseData.sort((a, b) => a[type1] - b[type1]);
    }
    let zeroIndex = responseData[0][type2]

    if (zeroIndex ==0) {
      responseData.shift()
    }
    

    let _data = {
      labels: responseData.map((item) => item[type1]),
      datasets: [
        {
          data: responseData.map((item) => item[type2]),
          borderColor: sortFn
            ? "rgb(542, 62, 35, 0.8)"
            : responseData.map((item) =>
                getIntValue(item[type1]) <= 450
                  ? "rgb(542, 62, 35, 0.8)"
                  : "rgb(0,212,100, 0.7)"
              ),
          backgroundColor: responseData.map((item) =>
            sortFn
              ? "rgb(542, 62, 35, 0.8)"
              : getIntValue(item[type1]) <= 450
              ? "rgb(542, 62, 35)"
              : "rgb(0,212,100)"
          ),
          borderWidth: 2,
        },
      ],
    };
    return _data;
  }

  const handleClick = (key) => {
    if (nationalData) {
     
      setModalId(key);
      setDataValue({
        id: nationalData[
          unmetLabels[UnmetNeedDefinitionData[key].buttonText].id
        ],
        percent:
          nationalData[
            unmetLabels[UnmetNeedDefinitionData[key].buttonText].percent
          ],
      });
    }

    if (UnmetNeedDefinitionData[key].id == "id17") {
      getDataStats(
        "ics_patient_ocs_max_days_supply",
        accessToken,
        refreshToken
      ).then((res) => {
        if (res) {
          let _data = getBarChart(res, res.headers[0], res.headers[1]);

          setStatsData20(_data);
        }
      });
      getDataStats("ics_patient_ocs_distinct_months", accessToken, refreshToken)
        .then((res) => {
          if (res) {
            let _data = getBarChart(res, res.headers[0], res.headers[1]);

            setStatsData21(_data);
          }
        })
        .catch((Err) => {
          console.log(Err);
        });
      getDataStats("ics_patient_ocs_num_encounters", accessToken, refreshToken)
        .then((res) => {
          let _data = getBarChart(res, res.headers[0], res.headers[1]);
          

          setStatsData24(_data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (UnmetNeedDefinitionData[key].id == "id18") {
      getDataStats(
        "ics_laba_patient_ocs_max_days_supply",
        accessToken,
        refreshToken
      ).then((res) => {
        if (res) {
          let _data = getBarChart(res, res.headers[0], res.headers[1]);

          setStatsData22(_data);
        }
      });
      getDataStats(
        "ics_laba_patient_ocs_distinct_months",
        accessToken,
        refreshToken
      ).then((res) => {
        if (res) {
          let _data = getBarChart(res, res.headers[0], res.headers[1]);

          setStatsData23(_data);
        }
      });
      getDataStats(
        "ics_laba_patient_ocs_num_encounters",
        accessToken,
        refreshToken
      )
        .then((res) => {
          let _data = getBarChart(res, res.headers[0], res.headers[1]);

          setStatsData25(_data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (UnmetNeedDefinitionData[key].id === "id15") {
      getDataStats("data_stats_33", accessToken, refreshToken).then((res) => {
        if (res) {
          const sortFn = (data) => {
            data.sort((a, b) => {
              const parseRange = (str) => {
                if (str.includes("+")) {
                  return Number.MAX_VALUE;
                } else {
                  return parseInt(str.split("-")[0]);
                }
              };
              return (
                parseRange(a.persistence_bucket) -
                parseRange(b.persistence_bucket)
              );
            });
            return data;
          };

          let _data = getBarChart(res, res.headers[0], res.headers[1], sortFn);

          setStatsData16(_data);
        }
      });
    }

    if (UnmetNeedDefinitionData[key].id === "id31") {
      getDataStats("data_stats_35", accessToken, refreshToken).then((res) => {
        if (res) {
          const sortFn = (data) => {
            data.sort((a, b) => {
              const parseRange = (str) => {
                if (str.includes("+")) {
                  return Number.MAX_VALUE;
                } else {
                  return parseInt(str.split("-")[0]);
                }
              };
              return (
                parseRange(a.persistence_bucket) -
                parseRange(b.persistence_bucket)
              );
            });
            return data;
          };

          let _data = getBarChart(res, res.headers[0], res.headers[1], sortFn);

          setStatsData19(_data);
        }
      });
    }
    if (UnmetNeedDefinitionData[key].id === "id13") {
      getDataStats("data_stats_31", accessToken, refreshToken).then((res) => {
        if (res) {
          const sortFn = (data) => {
            data.sort((a, b) => {
              const parseRange = (str) => {
                if (str.includes("+")) {
                  return Number.MAX_VALUE;
                } else {
                  return parseInt(str.split("-")[0]);
                }
              };
              return (
                parseRange(a.persistence_bucket) -
                parseRange(b.persistence_bucket)
              );
            });
            return data;
          };

          let _data = getBarChart(res, res.headers[0], res.headers[1], sortFn);

          setStatsData14(_data);
        }
      });
    }

    if (UnmetNeedDefinitionData[key].id === "id30") {
      getDataStats("data_stats_32", accessToken, refreshToken).then((res) => {
        if (res) {
          const sortFn = (data) => {
            data.sort((a, b) => {
              const parseRange = (str) => {
                if (str.includes("+")) {
                  return Number.MAX_VALUE;
                } else {
                  return parseInt(str.split("-")[0]);
                }
              };
              return (
                parseRange(a.compliance_bucket) -
                parseRange(b.compliance_bucket)
              );
            });
            return data;
          };

          let _data = getBarChart(res, res.headers[0], res.headers[1], sortFn);

          setStatsData15(_data);
        }
      });
    }
    if (UnmetNeedDefinitionData[key].id === "id32") {
      getDataStats("data_stats_34", accessToken, refreshToken).then((res) => {
        if (res) {
          const sortFn = (data) => {
            data.sort((a, b) => {
              const parseRange = (str) => {
                if (str.includes("+")) {
                  return Number.MAX_VALUE;
                } else {
                  return parseInt(str.split("-")[0]);
                }
              };
              return (
                parseRange(a.compliance_bucket) -
                parseRange(b.compliance_bucket)
              );
            });
            return data;
          };

          let _data = getBarChart(res, res.headers[0], res.headers[1], sortFn);

          setStatsData18(_data);
        }
      });
    }
    if (UnmetNeedDefinitionData[key].id === "id14") {
      getDataStats("data_stats_30", accessToken, refreshToken).then((res) => {
        if (res) {
          const sortFn = (data) => {
            data.sort((a, b) => {
              const parseRange = (str) => {
                if (str.includes("+")) {
                  return Number.MAX_VALUE;
                } else {
                  return parseInt(str.split("-")[0]);
                }
              };
              return (
                parseRange(a.compliance_bucket) -
                parseRange(b.compliance_bucket)
              );
            });
            return data;
          };

          let _data = getBarChart(res, res.headers[0], res.headers[1], sortFn);

          setStatsData13(_data);
        }
      });
    }
    if (UnmetNeedDefinitionData[key].id === "id2") {
      getDataStats("data_stats_25", accessToken, refreshToken).then((res) => {
        if (res) {
          const sortFn = (data) => {
            data.sort((a, b) => {
              const parseRange = (str) => {
                if (str.includes("+")) {
                  return Number.MAX_VALUE;
                } else {
                  return parseInt(str.split("-")[0]);
                }
              };
              return parseRange(a.delay_bucket) - parseRange(b.delay_bucket);
            });
            return data;
          };

          let _data = getBarChart(res, res.headers[0], res.headers[1], sortFn);

          setStatsData8(_data);
        }
      });
    }
    if (UnmetNeedDefinitionData[key].id === "id3") {
      getDataStats("data_stats_26", accessToken, refreshToken).then((res) => {
        if (res) {
          const sortFn = (data) => {
            data.sort((a, b) => {
              const parseRange = (str) => {
                if (str.includes("+")) {
                  return Number.MAX_VALUE;
                } else {
                  return parseInt(str.split("-")[0]);
                }
              };
              return parseRange(a.delay_bucket) - parseRange(b.delay_bucket);
            });
            return data;
          };

          let _data = getBarChart(res, res.headers[0], res.headers[1], sortFn);

          setStatsData9(_data);
        }
      });
    }
    if (UnmetNeedDefinitionData[key].id == "id7") {
      getDataStats("data_stats_28", accessToken, refreshToken).then((res) => {
        if (res) {
          const sortFn = (data) => {
            data.sort((a, b) => {
              const parseRange = (str) => {
                if (str.includes("+")) {
                  return Number.MAX_VALUE;
                } else {
                  return parseInt(str.split("-")[0]);
                }
              };
              return parseRange(a.delay_bucket) - parseRange(b.delay_bucket);
            });
            return data;
          };

          let _data = getBarChart(res, res.headers[0], res.headers[1], sortFn);

          setStatsData11(_data);
        }
      });
    }
    if (UnmetNeedDefinitionData[key].id == "id9") {
      getDataStats("data_stats_29", accessToken, refreshToken).then((res) => {
        if (res) {
          const sortFn = (data) => {
            data.sort((a, b) => {
              const parseRange = (str) => {
                if (str.includes("+")) {
                  return Number.MAX_VALUE;
                } else {
                  return parseInt(str.split("-")[0]);
                }
              };
              return parseRange(a.delay_bucket) - parseRange(b.delay_bucket);
            });
            return data;
          };

          let _data = getBarChart(res, res.headers[0], res.headers[1], sortFn);

          setStatsData12(_data);
        }
      });
    }
    if (
      UnmetNeedDefinitionData[key].id === "id2" ||
      UnmetNeedDefinitionData[key].id === "id3"
    ) {
      getDataStats("data_stats_24", accessToken, refreshToken).then((res) => {
        if (res) {
          setStatsData7(res);
        }
      });
    } else if (UnmetNeedDefinitionData[key].id === "id8") {
      getDataStats("data_stats_18", accessToken, refreshToken)
        .then((res) => {
          if (res) {
            const responseData = [...res.data];
            setStatsData5(responseData);
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
      getDataStats("data_stats_12", accessToken, refreshToken)
        .then((res) => {
          if (res) {
            getLineChart(res);
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
      getDataStats("data_stats_14", accessToken, refreshToken)
        .then((res) => {
          if (res && res.headers) {
            let _data = getBarChart(res, res.headers[0], res.headers[1]);

            setStatsData2(_data);
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    } else if (UnmetNeedDefinitionData[key].id === "id18") {
      getDataStats("data_stats_18_b", accessToken, refreshToken)
        .then((res) => {
          if (res) {
            const responseData = [...res.data];
            setStatsData6(responseData);
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
      getDataStats("data_stats_16", accessToken, refreshToken)
        .then((res) => {
          if (res && res.headers) {
            let _data = getBarChart(res, res.headers[0], res.headers[1]);
            setStatsData3(_data);
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
      getDataStats("data_stats_17", accessToken, refreshToken)
        .then((res) => {
          if (res) {
            let _data = getBarChart(res, res.headers[0], res.headers[1]);
            setStatsData4(_data);
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    } else if (UnmetNeedDefinitionData[key].id === "id5") {
      getDataStats("data_stats_27", accessToken, refreshToken).then((res) => {
        if (res) {
          setStatsData10(res);
        }
      });
    }
  };

  const mouseOver = (key, index) => {
    if (
      nationalData &&
      UnmetNeedDefinitionData[key].buttonText &&
      UnmetNeedDefinitionData[key].buttonText.length > 0
    ) {
      setTooltip({
        id: nationalData[
          unmetLabels[UnmetNeedDefinitionData[key].buttonText].id
        ],
        index: index,
      });
    }
  };

  return (
    <div className="grid grid-cols-3 items-center">
      <div className="px-4 py-2 font-semibold text-lg">
        Key Treatment Decisions
      </div>
      <div className="px-4 py-2 font-semibold text-lg">
        Area of patient need
      </div>
      <div className="px-4 py-2 font-semibold text-lg">
        Asthma Clinical Patient Treatment Trajectory
      </div>
      <div className="grid grid-cols-2 col-span-2 ">
        {Object.keys(UnmetNeedDefinitionData).map((key, index) => {
          return (
            <div className="col-span-2 relative" key={key}>
              <div
                className={`bg-white px-4 ${
                  UnmetNeedDefinitionData[key].buttonText ? "py-2" : "py-1"
                } gap-6 grid grid-cols-2 items-center rounded`}
              >
                <div className="flex col-span-1 items-center justify-between">
                  <h2
                    style={
                      UnmetNeedDefinitionData[key].buttonText
                        ? {}
                        : { color: `${UnmetNeedDefinitionData[key].color}` }
                    }
                    className={`text-sm ${
                      UnmetNeedDefinitionData[key].buttonText
                        ? `font-medium text-gray-700`
                        : `font-bold`
                    } `}
                  >
                    {UnmetNeedDefinitionData[key].title}
                  </h2>
                </div>
                {UnmetNeedDefinitionData[key].buttonText && (
                  <button
                    onMouseOver={() => mouseOver(key, index)}
                    onMouseLeave={() => setTooltip({ id: "", index: null })}
                    onClick={() => handleClick(key)}
                    style={{ borderColor: UnmetNeedDefinitionData[key].color }}
                    className={`text-gray-700 hover:scale-105 transition-all ease-linear border-2 px-4 py-2`}
                  >
                    {UnmetNeedDefinitionData[key].buttonText}
                    {showTooltip.index == index && nationalData && (
                      <div className="absolute -top-[1rem] bg-[#fff] text-[#000] border px-2 py-2">
                        Number of Patients:{" "}
                        {showTooltip ? showTooltip.id.toLocaleString() : ""}
                      </div>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="col-span-1">
        <img
          src={unmetChart}
          className="w-100 h-100 border-l-2 border-l-slate-900"
          alt="unmetChart"
        />
      </div>
      <Popup
        onClose={handleClose}
        modal
        open={modalId != null}
        position="center center"
      >
        {modalId && (
          <div className="flex flex-col items-center w-[70vw] max-h-[80vh] overflow-y-auto">
            <div className="w-[100%] sticky top-0 bg-white z-20 px-2 text-lg text-left py-8 font-[600] text-[#808080]">
              {UnmetNeedDefinitionData[modalId].buttonText}
            </div>
            {dataValue && (
              <div className="flex flex-col mb-2 items-start w-full">
                <div>
                  Number of Patients: <strong>{dataValue.id}</strong>
                </div>
                <div>
                  Eligible Patients:{" "}
                  <strong>
                    {Math.round(dataValue.id / (dataValue.percent / 100))}
                  </strong>
                </div>
                <div>
                  Percent of Eligible Patients with Unmet Need:{" "}
                  <strong>{Math.round(dataValue.percent)}%</strong>
                </div>
              </div>
            )}
            <p className="px-2 w-full text-[#808080] pb-4 text-left text-sm">
              {UnmetNeedDefinitionData[modalId].description}
            </p>
            <div className="w-full max-h-[80vh] pb-10 overflow-auto h-[auto] flex flex-col gap-2 items-center bg-white">
              {statsData6 && (
                <div className="h-[30rem] flex items-center justify-center w-full">
                  <Table
                    initialState={{ pageSize: 10, pageIndex: 0 }}
                    marginTop={0}
                    Title="No treatment"
                    activeCells={false}
                    showSelectionBtns={false}
                    TableData={statsData6}
                    TableColummns={Table_Columns_3}
                  />
                </div>
              )}
              {statsData10 && (
                <div className="h-[30rem] flex items-center justify-center w-full">
                  <Table
                    initialState={{ pageSize: 10, pageIndex: 0 }}
                    marginTop={0}
                    Title="Testing Counts"
                    activeCells={false}
                    showSelectionBtns={false}
                    TableData={statsData10.data}
                    TableColummns={statsData10.headers.map((item, index) => ({
                      Header: item,
                      accessor: item,
                    }))}
                  />
                </div>
              )}
              {statsData7 && (
                <div className="h-[30rem] flex items-center justify-center w-full">
                  <Table
                    initialState={{ pageSize: 10, pageIndex: 0 }}
                    marginTop={0}
                    Title="Testing Counts"
                    activeCells={false}
                    showSelectionBtns={false}
                    TableData={statsData7.data}
                    TableColummns={statsData7.headers.map((item, index) => ({
                      Header: item,
                      accessor: item,
                    }))}
                  />
                </div>
              )}
              {statsData8 && (
                <>
                  <div className="flex font-[500] text-left w-full mt-2 text-[#808080]">
                    Delay from Diagnosis to Spirometry testing
                  </div>
                  <BarChart
                    height={window.innerWidth > 1400 ? 120 : 80}
                    data={statsData8}
                    options={chart_8_options}
                  />
                </>
              )}
              {statsData13 && (
                <>
                  <div className="flex font-[500] text-left w-full mt-2 text-[#808080]">
                    First Year Compliance to Therapy
                  </div>
                  <BarChart
                    height={window.innerWidth > 1400 ? 120 : 80}
                    data={statsData13}
                    options={compliance_options}
                  />
                </>
              )}
              {statsData15 && (
                <>
                  <div className="flex font-[500] text-left w-full mt-2 text-[#808080]">
                    First Year Compliance to Therapy
                  </div>
                  <BarChart
                    height={window.innerWidth > 1400 ? 120 : 80}
                    data={statsData15}
                    options={compliance_options}
                  />
                </>
              )}
              {statsData18 && (
                <>
                  <div className="flex font-[500] text-left w-full mt-2 text-[#808080]">
                    First Year Compliance to Therapy
                  </div>
                  <BarChart
                    height={window.innerWidth > 1400 ? 120 : 80}
                    data={statsData18}
                    options={compliance_options}
                  />
                </>
              )}
              {statsData14 && (
                <>
                  <div className="flex font-[500] text-left w-full mt-2 text-[#808080]">
                    Persistence on Therapy
                  </div>
                  <BarChart
                    height={window.innerWidth > 1400 ? 120 : 80}
                    data={statsData14}
                    options={persistence_options}
                  />
                </>
              )}
              {statsData16 && (
                <>
                  <div className="flex font-[500] text-left w-full mt-2 text-[#808080]">
                    Persistence on Therapy
                  </div>
                  <BarChart
                    height={window.innerWidth > 1400 ? 120 : 80}
                    data={statsData16}
                    options={persistence_options}
                  />
                </>
              )}
              {statsData20 && (
                <>
                  <div className="flex font-[500] text-left w-full mt-2 text-[#808080]">
                    Days Supply in first Year after receiving OCS (Single
                    patients)'
                  </div>
                  <BarChart
                    height={window.innerWidth > 1400 ? 120 : 80}
                    data={statsData20}
                    options={excessive_options}
                  />
                </>
              )}
              {statsData21 && (
                <>
                  <div className="flex font-[500] text-left w-full mt-2 text-[#808080]">
                    Distinct Calendar Months with OCS Prescription (Single
                    patients)
                  </div>
                  <BarChart
                    height={window.innerWidth > 1400 ? 120 : 80}
                    data={statsData21}
                    options={excessive_options_2}
                  />
                </>
              )}

              {statsData19 && (
                <>
                  <div className="flex font-[500] text-left w-full mt-2 text-[#808080]">
                    Persistence on Therapy
                  </div>
                  <BarChart
                    height={window.innerWidth > 1400 ? 120 : 80}
                    data={statsData19}
                    options={persistence_options}
                  />
                </>
              )}
              {statsData11 && (
                <>
                  <div className="flex font-[500] text-left w-full mt-2 text-[#808080]">
                    Delay between Exacerbation and Escalation
                  </div>
                  <BarChart
                    height={window.innerWidth > 1400 ? 120 : 80}
                    data={statsData11}
                    options={chart_10_options}
                  />
                </>
              )}
              {statsData12 && (
                <>
                  <div className="flex font-[500] text-left w-full mt-2 text-[#808080]">
                    Delay between Exacerbation and Escalation
                  </div>
                  <BarChart
                    height={window.innerWidth > 1400 ? 120 : 80}
                    data={statsData12}
                    options={chart_10_options}
                  />
                </>
              )}
              {statsData9 && (
                <>
                  <div className="flex font-[500] text-left w-full mt-2 text-[#808080]">
                    Delay from Diagnosis to EOS / CBC testing
                  </div>
                  <BarChart
                    height={window.innerWidth > 1400 ? 120 : 80}
                    data={statsData9}
                    options={chart_9_options}
                  />
                </>
              )}
              {statsData5 && (
                <div className="h-[30rem] flex items-center justify-center w-full">
                  <Table
                    initialState={{ pageSize: 10, pageIndex: 0 }}
                    marginTop={0}
                    Title="Summary Table"
                    activeCells={false}
                    showSelectionBtns={false}
                    TableData={statsData5}
                    TableColummns={Table_Columns_3}
                  />
                </div>
              )}
              {statsData1 && (
                <LineChart
                  height={window.innerWidth > 1400 ? 120 : 80}
                  arbitrary={false}
                  data={statsData1}
                  options={Line_options_2}
                />
              )}
              {statsData2 && (
                <BarChart
                  height={window.innerWidth > 1400 ? 120 : 80}
                  data={statsData2}
                  options={_options}
                />
              )}
              {statsData4 && (
                <div className="my-10 w-full h-auto">
                  <BarChart
                    height={window.innerWidth > 1400 ? 80 : 90}
                    data={statsData4}
                    options={chart_3_options}
                  />
                </div>
              )}
              {statsData3 && (
                <BarChart
                  height={window.innerWidth > 1400 ? 80 : 90}
                  data={statsData3}
                  options={chart_2_options}
                />
              )}
              {statsData22 && (
                <>
                  <div className="flex font-[500] text-left w-full mt-2 text-[#808080]">
                    Days Supply in first Year after receiving OCS (Double
                    patients)'
                  </div>
                  <BarChart
                    height={window.innerWidth > 1400 ? 120 : 80}
                    data={statsData22}
                    options={excessive_double_2}
                  />
                </>
              )}
              {statsData23 && (
                <>
                  <div className="flex font-[500] text-left w-full mt-2 text-[#808080]">
                    Distinct Calendar Months with OCS Prescription (Double
                    patients)
                  </div>
                  <BarChart
                    height={window.innerWidth > 1400 ? 120 : 80}
                    data={statsData23}
                    options={excessive_options_2}
                  />
                </>
              )}
              {statsData24 && (
                <>
                  <div className="flex font-[500] text-left w-full mt-2 text-[#808080]">
                    Number of patients by distinct OCS prescriptions in year on
                    treatment (Single)
                  </div>
                  <BarChart
                    height={window.innerWidth > 1400 ? 120 : 80}
                    data={statsData24}
                    options={excessive_ocs_options_2}
                  />
                </>
              )}
              {statsData25 && (
                <>
                  <div className="flex font-[500] text-left w-full mt-2 text-[#808080]">
                    Number of patients by distinct OCS prescriptions in year on
                    treatment (Double)
                  </div>
                  <BarChart
                    height={window.innerWidth > 1400 ? 120 : 80}
                    data={statsData25}
                    options={excessive_ocs_options_2}
                  />
                </>
              )}
            </div>
            {dataValue && (modalId =="id18") &&  (
              <div className="flex py-4 flex-col mb-2 items-start w-full">
                <div>
                  {selectLabels["Number of ICS-LABA >900mg/year steroids"]}:{" "}
                  <strong>
                    {nationalData["Number of ICS-LABA >900mg/year steroids"]}
                  </strong>
                </div>
                <div>
                  {selectLabels["Percent of ICS-LABA >900mg/year steroids"]}:{" "}
                  <strong>
                    {nationalData["Percent of ICS-LABA >900mg/year steroids"].toFixed(2)}%
                  </strong>
                </div>
                <div>
                  {
                    selectLabels[
                      "Number of ICS-LABA High Steroid Usage with ER visit"
                    ]
                  }
                  :{" "}
                  <strong>
                    {
                      nationalData[
                        "Number of ICS-LABA High Steroid Usage with ER visit"
                      ]
                    }
                  </strong>
                </div>
                <div>
                  {
                    selectLabels[
                      "Percent of ICS-LABA High Steroid Usage with ER visit"
                    ]
                  }
                  :{" "}
                  <strong>
                    {
                      nationalData[
                        "Percent of ICS-LABA High Steroid Usage with ER visit"
                      ].toFixed(2)
                    }%
                  </strong>
                </div>
                <div>
                  {
                    selectLabels[
                      "Number of ICS-LABA High Steroid Usage without ER visit"
                    ]
                  }
                  :{" "}
                  <strong>
                    {
                      nationalData[
                        "Number of ICS-LABA High Steroid Usage without ER visit"
                      ]
                    }
                  </strong>
                </div>
                <div>
                  {
                    selectLabels[
                      "Percent of ICS-LABA High Steroid Usage without ER visit"
                    ]
                  }
                  :{" "}
                  <strong>
                    {
                      nationalData[
                        "Percent of ICS-LABA High Steroid Usage without ER visit"
                      ].toFixed(2)
                    }%
                  </strong>
                </div>
              </div>
            )}
          </div>
        )}
      </Popup>
    </div>
  );
};

export default UnmetNeedDefinition;
