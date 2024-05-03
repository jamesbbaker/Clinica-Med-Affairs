import React, { useContext, useEffect, useMemo, useState } from 'react'
import Table from '../../../components/Table'
import { getDataStats } from '../../../API/Outputs'
import { AuthContext } from '../../../context/AuthContext'

const EligiblePatientLocator = () => {
    const [statsData1, setStatsData1] = useState(null)
  const { accessToken, refreshToken } = useContext(AuthContext);
 

    useEffect(() => {
        getDataStats("data_stats_19", accessToken, refreshToken)
        .then((res) => {
          let _data = JSON.parse(res.replaceAll("NaN",0))
          console.log(_data)
            // const data = JSON.parse(_data)
            // // const _res = JSON.parse(data.data)
            // console.log(data, "responseee")
          if (res) {
            const responseData = res.data;
            
            setStatsData1(responseData);
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    }, [])

    const Table_Columns_1 = useMemo(() => {
        const column_names = [
            { header: 'Provider ID', accessor: 'providerId' },
            { header: 'Organization Name', accessor: 'orgName' },
            { header: 'Last Name', accessor: 'lastName' },
            { header: 'First Name', accessor: 'firstName' },
            { header: 'Primary Specialty Description', accessor: 'primarySpecialty' },
            { header: 'ZIP', accessor: 'zipCode' },
            { header: 'Number of ICS-LABA Patients', accessor: 'icsLabaPatients' },
            { header: 'Number of High Steroid Usage Patients', accessor: 'highSteroidPatients' },
            { header: 'Number of Severe Exacerbations', accessor: 'severeExacerbations' },
            { header: 'Percent of High Steroid Usage Patients', accessor: 'percentHighSteroid' },
            { header: 'Percent of Severe Exacerbations', accessor: 'percentSevereExacerbations' }
        ];
    
        const USERS_TABLE_COLUMNS = column_names.map(column => ({
            Header: column.header,
            accessor: column.accessor,
        }));
    
        return USERS_TABLE_COLUMNS;
    }, []);

  return (
    statsData1 && 
       <Table
       marginTop="0"
       Title="Summary Table"
       activeCells={true}
       showSelectionBtns={true}
       TableData={statsData1}
       TableColummns={Table_Columns_1}
     />
      
  )
}

export default EligiblePatientLocator