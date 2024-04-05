import React, { useContext, useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { getDataStats } from "../../API/Outputs";
import { AuthContext } from "../../context/AuthContext";

export const data = [
  ["From", "To", "Percentage"],
  ["A", "X", 5],
  ["A", "Y", 7],
  ["A", "Z", 6],
  ["B", "X", 2],
  ["B", "Y", 9],
  ["B", "Z", 4],
  ["X", "S", 2],
  ["X", "T", 4],
  ["X", "V", 2],
  ["Y", "V", 4],
  ["Y", "T", 2],
  ["Z", "V", 1],
  ["Z", "T", 3],
];

var colors = ['#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f',
'#cab2d6', '#ffff99', '#1f78b4', '#33a02c'];



var options = {
  height: 400,
  sankey: {
    // iterations: 0,
    node: {
      colors: colors,
      labelPadding: 10 ,
      label: {  
      fontSize: 11,
      color: '#871b47',
      bold: true,
      italic: true } 
    },
    link: {
      colorMode: 'gradient',
      colors: colors
    }
  }
};



const Sankey = () => {
  const {accessToken, refreshToken} = useContext(AuthContext)
  const [SankeyData, setSankeyData] = useState(null)

  useEffect(() => {
    getDataStats("sankey_data_6",accessToken, refreshToken ).then(res => {
      if (res) {
        let dataArr = res.map(item => [item.From_Specialty,item.To_Specialty, item.Patient_Count])
        dataArr.unshift(["Source", "Target", "Value"])
        setSankeyData(dataArr)
      }
    }).catch(err => {
      console.log(err,"err")
    })
  }, [])

  return (
    <div className="px-2 py-4">
      {SankeyData && <Chart
        chartType="Sankey"
        width="100%"
        height="500px"
        data={SankeyData}
        options={options}
      />}
    </div>
  );
};

export default Sankey;
