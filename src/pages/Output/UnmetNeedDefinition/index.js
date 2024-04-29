import React, { useContext, useMemo, useState } from "react";
import unmetChart from "../../../assets/images/unmetChart.png";
import Popup from "reactjs-popup";
import { getDataStats } from "../../../API/Outputs";
import { AuthContext } from "../../../context/AuthContext";
import { generateStatsOptions, setLineData } from "../../../utils/ChartUtils";
import { LineChart } from "../../../components/LineChart";
import BarChart from "../../../components/BarChart";
import Table from "../../../components/Table";

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
    description: "Lorem Ipsum",
    color: "#8CC9E6",
  },
  id3: {
    id: "id3",
    title:
      "Do severe or uncontrolled asthma patients receive IGE and EOS/CBC testing?",
    buttonText: "Improper severe asthma testing",
    description: "Lorem Ipsum",
    color: "#8CC9E6",
  },
  id4: {
    id: "id4",
    title: "Treatment (all lines of therapy)",
    description: "Lorem Ipsum",
    buttonText: "",
    color: "#6FA9D9",
  },
  id5: {
    id: "id5",
    title: "Do patients diagnosed with asthma receive any treatment at all?",
    buttonText: "Untreated patients",
    description: "Lorem Ipsum",
    color: "#6FA9D9",
  },
  id6: {
    id: "id6",
    title:
      "Are uncontrolled or severe patients receiving ICS/beta-agonists escalated to double therapy?",
    buttonText:
      "Failure to escalate uncontrolled/severe patients to double therapy",
    description: "Lorem Ipsum",
    color: "#6FA9D9",
  },
  id17: {
    id: "id17",
    title:
      "Do patients receive excessive OCS by either consistency or quantity of use when receiving ICS/beta-agonists?",
    buttonText: "Excessive steroid usage on ICS/beta-agonist",
    description: "Lorem Ipsum",
    color: "#6FA9D9",
  },
  id7: {
    id: "id7",
    title:
      "How long does it take from demonstrating severe/uncontrolled asthma to treatment escalation?",
    buttonText: "Delay in escalating patients to double therapy",
    description: "Lorem Ipsum",
    color: "#6FA9D9",
  },
  id8: {
    id: "id8",
    title:
      "Are uncontrolled or severe patients receiving double therapies escalated to triple therapy?",
    buttonText:
      "Failure to escalate uncontrolled/severe patients to triple therapy",
    description:
      "Exacerbations are defined as patients going to the ED / ER WITH a primary asthma diagnosis code or a specific asthma treatment (e.g. insert emergency airway, airway inhaltion treatment, or nebulizer with compression.)",
    color: "#6FA9D9",
  },
  id18: {
    id: "id18",
    title:
      "Do patients receive excessive OCS by either consistency or quantity of use when receiving double therapies?",
    buttonText: "Excessive steroid usage on double therapy",
    description:
      "OCS converted to prednisone equivalent milligrams. Dose per month and year calculated using prescribed dose, quantity, and days supply.",
    color: "#6FA9D9",
  },
  id9: {
    id: "id9",
    title:
      "How long does it take from demonstrating severe/uncontrolled asthma to treatment escalation?",
    buttonText: "Delay in escalating patients from double to triple therapy",
    description: "Lorem Ipsum",
    color: "#6FA9D9",
  },
  id10: {
    id: "id10",
    title: "Do patients receive open triple therapies?",
    buttonText: "Suboptimal use of open triple therapy",
    description: "Lorem Ipsum",
    color: "#6FA9D9",
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
    title: "Are patients adherent to their double treatments?",
    buttonText: "Non-adherence to double therapies",
    description: "Lorem Ipsum",
    color: "#94D3A2",
  },
  id14: {
    id: "id14",
    title: "Are patients adherent to open triple treatments?",
    buttonText: "Non-adherence to open triple therapies",
    description: "Lorem Ipsum",
    color: "#94D3A2",
  },
  id15: {
    id: "id15",
    title: "Are patients adherence to closed triple treatments?",
    buttonText: "Non-adherence to closed triple therapies",
    description: "Lorem Ipsum",
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
  const { accessToken, refreshToken } = useContext(AuthContext);

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

  function getBarChart(res, type1, type2) {
    const responseData = res.data;
    responseData.sort((a, b) => a[type1] - b[type1]);

    let _data = {
      labels: responseData.map((item) => item[type1]),
      datasets: [
        {
          data: responseData.map((item) => item[type2]),
          borderColor: "rgb(542, 62, 35,0.8)",
          backgroundColor: "rgb(542, 62, 35)",
          borderWidth: 2,
        },
      ],
    };
    return _data;
  }

  const handleClick = (key) => {
    setModalId(key);
    if (UnmetNeedDefinitionData[key].id === "id8") {
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
          if (res) {
            let _data = getBarChart(
              res,
              "Asthma_Visits_per_Year",
              "Patient_Years",
            );
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
          if (res) {
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
        {Object.keys(UnmetNeedDefinitionData).map((key) => {
          return (
            <div className="col-span-2" key={key}>
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
                    onClick={() => handleClick(key)}
                    style={{ borderColor: UnmetNeedDefinitionData[key].color }}
                    className={`text-gray-700 hover:scale-105 transition-all ease-linear border-2 px-4 py-2`}
                  >
                    {UnmetNeedDefinitionData[key].buttonText}
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
          <div className="w-[70vw] max-h-[80vh] pb-10 overflow-auto h-[auto] flex flex-col gap-2 items-center bg-white">
            <div className="w-[100%] px-2 text-lg text-left py-8 font-[600] text-[#808080]">
              {UnmetNeedDefinitionData[modalId].buttonText}
            </div>
            {statsData6 && (
              <div className="h-[30rem] flex items-center justify-center w-full">
                <Table
                  initialState={{ pageSize: 10, pageIndex: 0 }}
                  marginTop={0}
                  Title="Summary Table"
                  activeCells={false}
                  showSelectionBtns={false}
                  TableData={statsData6}
                  TableColummns={Table_Columns_3}
                />
              </div>
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
            {/* {statsData2 && (
              <BarChart
                height={window.innerWidth > 1400 ? 120 : 80}
                data={statsData2}
                options={_options}
              />
            )} */}
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
            <p className="px-4 py-14 w-full text-left text-sm">
              {UnmetNeedDefinitionData[modalId].description}
            </p>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default UnmetNeedDefinition;
