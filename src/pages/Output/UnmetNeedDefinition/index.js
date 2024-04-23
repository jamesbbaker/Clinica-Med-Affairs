import React, { useContext, useMemo, useState } from "react";
import unmetChart from "../../../assets/images/unmetChart.png";
import Popup from "reactjs-popup";
import { getDataStats } from "../../../API/Outputs";
import { AuthContext } from "../../../context/AuthContext";
import { generateStatsOptions, setLineData } from "../../../utils/ChartUtils";
import { LineChart } from "../../../components/LineChart";
import BarChart from "../../../components/BarChart";

const UnmetNeedDefinitionData = {
  id1: {
    id: "id1",
    treatmentDecision: "Key treatment decisions",
    patientNeed: "",
    color: "#8CC9E6",
  },
  id2: {
    id: "id2",
    treatmentDecision:
      "After diagnosis, do patients receive a spirometry test?",
    patientNeed: "Incomplete initial asthma testing",
    color: "#8CC9E6",
  },
  id3: {
    id: "id3",
    treatmentDecision:
      "Do severe or uncontrolled asthma patients receive IGE and EOS/CBC testing?",
    patientNeed: "Improper severe asthma testing",
    color: "#8CC9E6",
  },
  id4: {
    id: "id4",
    treatmentDecision: "Treatment (all lines of therapy)",
    patientNeed: "",
    color: "#6FA9D9",
  },
  id5: {
    id: "id5",
    treatmentDecision:
      "Do patients diagnosed with asthma receive any treatment at all?",
    patientNeed: "Untreated patients",
    color: "#6FA9D9",
  },
  id6: {
    id: "id6",
    treatmentDecision:
      "Are uncontrolled or severe patients receiving ICS/beta-agonists escalated to double therapy?",
    patientNeed:
      "Failure to escalate uncontrolled/severe patients to double therapy",
    color: "#6FA9D9",
  },
  id17: {
    id: "id17",
    treatmentDecision:
      "Do patients receive excessive OCS by either consistency or quantity of use when receiving ICS/beta-agonists?",
    patientNeed: "Excessive steroid usage on ICS/beta-agonist",
    color: "#6FA9D9",
  },
  id7: {
    id: "id7",
    treatmentDecision:
      "How long does it take from demonstrating severe/uncontrolled asthma to treatment escalation?",
    patientNeed: "Delay in escalating patients to double therapy",
    color: "#6FA9D9",
  },
  id8: {
    id: "id8",
    treatmentDecision:
      "Are uncontrolled or severe patients receiving double therapies escalated to triple therapy?",
    patientNeed:
      "Failure to escalate uncontrolled/severe patients to triple therapy",
    color: "#6FA9D9",
  },
  id18: {
    id: "id18",
    treatmentDecision:
      "Do patients receive excessive OCS by either consistency or quantity of use when receiving double therapies?",
    patientNeed: "Excessive steroid usage on double therapy",
    color: "#6FA9D9",
  },
  id9: {
    id: "id9",
    treatmentDecision:
      "How long does it take from demonstrating severe/uncontrolled asthma to treatment escalation?",
    patientNeed: "Delay in escalating patients from double to triple therapy",
    color: "#6FA9D9",
  },
  id10: {
    id: "id10",
    treatmentDecision: "Do patients receive open triple therapies?",
    patientNeed: "Suboptimal use of open triple therapy",
    color: "#6FA9D9",
  },
  id12: {
    id: "id12",
    treatmentDecision: "Therapy support and adherence",
    patientNeed: "",
    color: "#94D3A2",
  },
  id13: {
    id: "id13",
    treatmentDecision: "Are patients adherent to their double treatments?",
    patientNeed: "Non-adherence to double therapies",
    color: "#94D3A2",
  },
  id14: {
    id: "id14",
    treatmentDecision: "Are patients adherent to open triple treatments?",
    patientNeed: "Non-adherence to open triple therapies",
    color: "#94D3A2",
  },
  id15: {
    id: "id15",
    treatmentDecision: "Are patients adherence to closed triple treatments?",
    patientNeed: "Non-adherence to closed triple therapies",
    color: "#94D3A2",
  },
  id16: {
    id: "id16",
    treatmentDecision: "Therapy support and adherence",
    patientNeed: "No specific patient need mentioned",
    color: "#7DD892"
}
  
};

const UnmetNeedDefinition = () => {
  const [modalId, setModalId] = useState(null);
  const [statsData1, setStatsData1] = useState(null);
  const [statsData2, setStatsData2] = useState(null);
  const { accessToken, refreshToken } = useContext(AuthContext);

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
      },
    };
  }, []);

  const Line_options_2 = useMemo(() => {
    return generateStatsOptions("Escalation from double therapies");
  }, []);

  const handleClose = () => {
    setStatsData1(null);
    setStatsData2(null);
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

    responseData.forEach((entry) => {
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

  function getBarChart(res) {
    const responseData = res.data;
    responseData.sort((a,b) => a.Asthma_Visits_per_Year - b.Asthma_Visits_per_Year)

    let _data = {
      labels: responseData.map((item) => item.Asthma_Visits_per_Year),
      datasets: [
        {
          data: responseData.map((item) => item.Patient_Years),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderWidth: 2,
        },
      ],
    };
    setStatsData2(_data);
  }

  const handleClick = (key) => {
    setModalId(key);
    if (UnmetNeedDefinitionData[key].id === "id6") {
      getDataStats("data_stats_12", accessToken, refreshToken)
        .then((res) => {
          if (res) {
            getLineChart(res);
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    } else if (UnmetNeedDefinitionData[key].id === "id8") {
      getDataStats("data_stats_14", accessToken, refreshToken)
        .then((res) => {
          if (res) {
            getBarChart(res);
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    }
  };

  return (
    <div className="grid grid-cols-3 items-center pb-32">
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
        {Object.keys(UnmetNeedDefinitionData).map((key) => {
          return (
            <div className="col-span-2" key={key}>
              <div
                className={`bg-white px-4 ${
                  UnmetNeedDefinitionData[key].patientNeed ? "py-2" : "py-1"
                } gap-6 grid grid-cols-2 items-center rounded`}
              >
                <div className="flex col-span-1 items-center justify-between">
                  <h2
                    style={
                      UnmetNeedDefinitionData[key].patientNeed
                        ? {}
                        : { color: `${UnmetNeedDefinitionData[key].color}` }
                    }
                    className={`text-sm ${
                      UnmetNeedDefinitionData[key].patientNeed
                        ? `font-medium text-gray-700`
                        : `font-bold`
                    } `}
                  >
                    {UnmetNeedDefinitionData[key].treatmentDecision}
                  </h2>
                </div>
                {UnmetNeedDefinitionData[key].patientNeed && (
                  <button
                    onClick={() => handleClick(key)}
                    style={{ borderColor: UnmetNeedDefinitionData[key].color }}
                    className={`text-gray-700 hover:scale-105 transition-all ease-linear border-2 px-4 py-2`}
                  >
                    {UnmetNeedDefinitionData[key].patientNeed}
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
          <div className="w-[70vw] h-[auto] flex flex-col gap-2 items-center justify-center bg-white">
            {statsData1 && (
              <LineChart
                height={140}
                arbitrary={false}
                data={statsData1}
                options={Line_options_2}
              />
            )}
            {statsData2 && (
              <BarChart height={150} data={statsData2} options={_options} />
            )}
          </div>
        )}
      </Popup>
    </div>
  );
};

export default UnmetNeedDefinition;
