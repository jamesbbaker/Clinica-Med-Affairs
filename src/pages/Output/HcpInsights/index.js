import React, { useContext, useEffect, useState } from "react";
import Table, { CustomOptionRenderer } from "../../../components/Table";
import { getDataStats } from "../../../API/Outputs";
import { AuthContext } from "../../../context/AuthContext";
import { MultiSelect } from "react-multi-select-component";
import {
  invertedMapLabels,
  mapLabels,
  patientTotals,
  selectLabels,
} from "../../../constants/appConstants";
import { filterOutLabels } from "../../../utils/MapUtils";

const filterOptions = [...Object.keys(selectLabels)];

const HcpInsight = () => {
  const [statsData2, setStatsData2] = useState(null);
  const [tableColumns, setTableColumns] = useState([{}]);
  const { accessToken, selectedUnmet, refreshToken } = useContext(AuthContext);
  const [rawHeaders, setRawHeaders] = useState([]);
  const [selectedUnmetValue, setSelectedUnmet] = useState([]);
  const handleSelectMultipleUnmet = (val) => {
    setSelectedUnmet(val);
    setTableColumns([
      { Header: "Specialty Category", accessor: "Specialty_Bucket" },
      { Header: "Number of Providers", accessor: "Number of Providers" },
      ...val.map((item) => {
        return {
          Header:selectLabels[item.value] ?selectLabels[item.value]:  selectLabels[mapLabels[item.value]],
          accessor:invertedMapLabels[item.value] ? invertedMapLabels[item.value]:  item.value,
        };
      }),
    ]);
  };

  useEffect(() => {
    if (setStatsData2 && rawHeaders && selectedUnmet.length > 0) {
    
      let selectedValues = selectedUnmet.filter(
        (item) =>
         ( rawHeaders.includes(mapLabels[item.value]) || rawHeaders.includes(invertedMapLabels[item.value])) &&
          (item.value.toLowerCase().includes("percent"))
      );

      handleSelectMultipleUnmet([
        {
          label: "Number of ICS-LABA Patients",
          value: "Number of ICS-LABA Patients",
        },
        ...selectedValues,
      ]);
    }
  }, [selectedUnmet, statsData2]);

  useEffect(() => {
    getDataStats("data_stats_23", accessToken, refreshToken)
      .then((responseData) => {
        if (responseData) {
          setRawHeaders(responseData.headers);
          let _data = responseData.data.map((item) => {
            let newItem = { ...item };
            responseData.headers.forEach((header) => {
              if (header.includes("Percent")) {
                newItem[header] = `${item[header].toFixed(2)}%`;
              }
            });
            return newItem;
          });

          setStatsData2(_data);
          setTableColumns([
            { Header: "Specialty Category", accessor: "Specialty_Bucket" },
            { Header: "Number of Providers", accessor: "Number of Providers" },
            {
              Header: "Number of ICS-LABA Patients",
              accessor: "Number of ICS-LABA Patients",
            },
          ]);
          setSelectedUnmet([
            {
              label: "Number of ICS-LABA Patients",
              value: "Number of ICS-LABA Patients",
            },
          ]);
        }
      })
      .catch((err) => console.log(err));
  }, []);



  return statsData2 ? (
    <>
      <div className="flex flex-col gap-2 w-full items-start">
        <h2 className="font-[500] text-md mb-6">Summary of Unmet Need by Specialty</h2>
        <div>Select Unmet Needs</div>
        <MultiSelect
          ItemRenderer={CustomOptionRenderer}
          labelledBy=""
          options={filterOutLabels(filterOptions, selectedUnmet)
            .filter((item) => item === "Number of ICS-LABA Patients" || rawHeaders.includes(mapLabels[item]) || rawHeaders.includes(invertedMapLabels[item]))
            .map((item) => ({
              label: selectLabels[item],
              value: item,
            }))}
          className="w-[40rem] mb-10 z-[5]"
          value={selectedUnmetValue}
          onChange={(val) => handleSelectMultipleUnmet(val)}
        />
      </div>
      <Table
        initialState={{
          pageSize: 10,
          pageIndex: 0,
          sortBy: [
            {
              id: "Total ICS-LABA Patients",
              desc: true,
            },
          ],
        }}
        activeCells={false}
      
        showSelectionBtns={false}
        TableData={statsData2}
        marginTop={0}
        TableColummns={tableColumns}
      />
    </>
  ) : (
    <div role="status" className="grid place-content-center h-[200px]">
      <svg
        aria-hidden="true"
        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default HcpInsight;
