import React, { useContext, useEffect, useMemo, useState } from "react";
import Table from "../../../components/Table";
import { getDataStats } from "../../../API/Outputs";
import { AuthContext } from "../../../context/AuthContext";

const EligiblePatientLocator = () => {
  const [statsData1, setStatsData1] = useState(null);
  const { accessToken, refreshToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSize, setcurrentSize] = useState(5);
  const [totalPage, settotalPage] = useState(1);

  useEffect(() => {
    if (!statsData1) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [statsData1]);

  const fetchData = (page = 1, size = 5) => {
    setStatsData1(null);

    getDataStats(
      `hcp_data?Primary Specialty Description=HOSPITALIST&min_ics_laba_patients=10&sort_by=State Name&sort_order=asc&page=${page}&page_size=${size}`,
      accessToken,
      refreshToken
    )
      .then((res) => {
        let _data = JSON.parse(res.replaceAll("NaN", 0));

        if (_data) {
          settotalPage(Math.floor(_data.total / currentSize));
          const responseData = _data.data;

          setStatsData1(responseData);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  useEffect(() => {
    fetchData(currentPage, currentSize);
  }, [currentPage, currentSize]);

 

  const Table_Columns_1 = useMemo(() => {
    const column_names = [
      { header: "Provider ID", accessor: "Provider ID" },
      { header: "Organization Name", accessor: "Organization Name" },
      { header: "Last Name", accessor: "Last Name" },
      { header: "First Name", accessor: "First Name" },
      {
        header: "Primary Specialty Description",
        accessor: "Primary Specialty Description",
      },
      { header: "ZIP", accessor: "ZIP" },
      { header: "LAT", accessor: "LAT" },
      { header: "LONG", accessor: "LONG" },
      { header: "City", accessor: "City" },
      { header: "State ID", accessor: "State ID" },
      { header: "State Name", accessor: "State Name" },
      { header: "Region", accessor: "Region" },
      {
        header: "Number of ICS-LABA Patients",
        accessor: "Number of ICS-LABA Patients",
      },
      {
        header: "Number of High Steroid Usage Patients",
        accessor: "Number of High Steroid Usage Patients",
      },
      {
        header: "Number of Severe Exacerbations",
        accessor: "Number of Severe Exacerbations",
      },
      {
        header: "Percent of High Steroid Usage Patients",
        accessor: "Percent of High Steroid Usage Patients",
      },
      {
        header: "Percent of Severe Exacerbations",
        accessor: "Percent of Severe Exacerbations",
      },
    ];

    const USERS_TABLE_COLUMNS = column_names.map((column) => ({
      Header: column.header,
      accessor: column.accessor,
    }));

    return USERS_TABLE_COLUMNS;
  }, []);

  return statsData1 && !loading ? (
    <Table
      totalPage={totalPage}
      currentSize={currentSize}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      marginTop="0"
      Title="Summary Table"
      activeCells={true}
      showSelectionBtns={true}
      TableData={statsData1}
      TableColummns={Table_Columns_1}
    />
  ) : (
    <div class="flex justify-center items-center h-24">
      <div class="w-6 h-6 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default EligiblePatientLocator;
