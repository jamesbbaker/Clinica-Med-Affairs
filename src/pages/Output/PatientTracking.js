import React, { useContext, useEffect, useMemo, useState } from "react";
import Sankey from "../../components/Sankey";
import HcpInsight from "./HcpInsights";
import { getDataStats } from "../../API/Outputs";
import { AuthContext } from "../../context/AuthContext";
import { generateStatsOptions, setLineData } from "../../utils/ChartUtils";
import { LineChart } from "../../components/LineChart";
import { HeatMapGrid } from "react-grid-heatmap";
import { selectLabels } from "../../constants/appConstants";

const PatientTracking = () => {
  const [statsData7, setStatsData7] = useState(null);
  const { accessToken, refreshToken } = useContext(AuthContext);
  const [statsData1, setStatsData1] = useState(null);
  const [labels, setLabels] = useState({
    xLabels: [],
    yLabels: [],
  });

  const Line_options_2 = useMemo(() => {
    return generateStatsOptions("Patient Starts by Therapy Type");
  }, []);

  useEffect(() => {
    getDataStats("hcp_correlation_matrix", accessToken, refreshToken)
      .then((res) => {
        if (res) {
          let _newObj = {};
          res.forEach((item) => {
            let _item = { ...item };
            delete _item.index;
            _newObj[item.index] = _item;
          });

          let newRes = [];
          Object.keys(selectLabels).forEach((item) => {
            if (_newObj.hasOwnProperty(item)) {
              let newObj = [];
              Object.keys(selectLabels).forEach((_item) => {
                if (_newObj[item].hasOwnProperty(_item)) {
                  newObj.push(_newObj[item][_item]);
                }
              });
              newRes.push(newObj);
            }
          });
        
          setStatsData1(newRes);
          setLabels({
            xLabels: Object.keys(selectLabels)
              .filter((item) => _newObj.hasOwnProperty(item))
              .map((item) => selectLabels[item]),
            yLabels: Object.keys(selectLabels)
              .filter((item) => _newObj.hasOwnProperty(item))
              .map((item) => selectLabels[item]),
          });
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
    getDataStats("data_stats_13", accessToken, refreshToken)
      .then((res) => {
        if (res) {
          let Types = [];
          const responseData = res.data;
          responseData.forEach((entry) => {
            return Types.push(entry["Type"]);
          });
          let _data = setLineData(res, Types[0], "Patients");
          setStatsData7(_data);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
  }, []);

  return (
    <div>
      <div className="mb-10">
        <Sankey
          API={"sankey_data_6"}
          title={"Patient Transitions through HCP Specialty by Asthma Visit"}
          OPTIONS={{
            from: "From_Specialty",
            to: "To_Specialty",
            count: "Patient_Count",
          }}
        />
      </div>
      <div className="mt-10">
        <HcpInsight />
      </div>
      <div className="mb-10 mt-10">
        <Sankey
          API={"sankey_data_9"}
          title={"Patient Transitions through Therapies"}
          height="800px"
          OPTIONS={{
            from: "From_Therapy",
            to: "To_Therapy",
            count: "Patient_Count",
          }}
        />
      </div>

      {statsData7 && (
        <>
          <LineChart
            height={150}
            arbitrary={false}
            data={statsData7}
            options={Line_options_2}
          />
        </>
      )}
      {statsData1 && (
        <div className="p-6 w-full overflow-auto">
          <HeatMapGrid
            cellRender={(x, y, value) => (
              <div
                style={{ fontSize: "0.5rem" }}
                title={`Pos(${x}, ${y}) = ${value}`}
              >
                {value.toFixed(2)}
              </div>
            )}
            xLabelsPos="bottom"
            yLabelsStyle={() => ({
              fontSize: ".65rem",
              width: "15rem",
              textAlign: "center",
              display: "grid",
              placeContent: "center",
              lineHeight: 1,
              height: "2.5rem",
            })}
            xLabelsStyle={() => ({
              fontSize: ".5rem",
            })}
            cellStyle={(_x, _y, ratio) => {
              let value = statsData1[_x][_y];

              return {
                background:
                  value > 0
                    ? `rgb(12, 160, 44, ${ratio})`
                    : `rgba(255,74,48, ${Math.abs(value)})`,
                fontSize: ".8rem",
                color: `rgb(0, 0, 0, ${ratio / 2 + 0.4})`,
              };
            }}
            cellHeight="2.5rem"
            data={statsData1}
            xLabelWidth={10}
            xLabels={labels.xLabels}
            yLabels={labels.yLabels}
          />
        </div>
      )}
    </div>
  );
};

export default PatientTracking;
