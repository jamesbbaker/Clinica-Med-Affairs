import React, { useContext, useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { getDataStats } from "../../API/Outputs";
import { AuthContext } from "../../context/AuthContext";
import { useRef } from "react";

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

var colors = ['blue', 'green', 'red', "yellow" ]



var options = {
  height: 500,
  sankey: {
    // iterations: 0,
    node: {
      colors: colors,
      
    },
    link: {
      colorMode: 'target',
      colors: colors
    }
  }
};



const Sankey = () => {
  const {accessToken, refreshToken} = useContext(AuthContext)
  const [SankeyData, setSankeyData] = useState(null)

  const [sankeyOptions, setSankeyOptions] = useState(null)


  useEffect(() => {
    if ( SankeyData) {
      const defaultColor = '#000000'; // Default color for links
      const colors = {
        "Emergency and Critical Care": '#00796B',
        "Specialty Care": '#FF6F61',
        "Other": '#A2DED0',
        "Surgical Specialties": '#FFB347',
        "Primary Care Provider": '#6A0572',
        "Hospital Services":"#87CEEB"
      }; 

    
      // Process data to include color information
      const processedData = SankeyData.map(({ From_Specialty, To_Specialty, Patient_Count }) => {
        const prefix = From_Specialty.match(/^([^_]+)/)[0] // Extract the prefix before "_"
        // Use predefined color if found, otherwise use default color
        const color = colors[prefix] || defaultColor;
        // Assign color to the link
        return [From_Specialty, To_Specialty, Patient_Count, color];
      });

      
      const options = {
      
        sankey: {  node: { label: { 
        fontSize: 16,
        color: '#000',
        bold: true,
        italic: true },width: 3 },
      
          link: { colorMode: 'source' }, // Set color mode to 'source' to apply colors directly
        },
      };

      setSankeyOptions({
        data: [["From_Specialty", "To_Specialty", "Patient_Count", { role: "style" }], ...processedData],
        options: options
      });
    }
  }, [SankeyData]);

  // Function to generate a random color
  const getRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  };
  
 
  useEffect(() => {
    getDataStats("sankey_data_6",accessToken, refreshToken ).then(res => {
      if (res) {
      
        let dataArr = res.map(item => [item.From_Specialty,item.To_Specialty, item.Patient_Count])
        dataArr.unshift(["Source", "Target", "Value"])
        setSankeyData(res)
      }
    }).catch(err => {
      console.log(err,"err")
    })
  }, [])



  return (
    <div className="px-2 py-4">
      {sankeyOptions && sankeyOptions.data && <Chart
        chartType="Sankey"
        width="100%"
        height="500px"
        data={sankeyOptions.data }
        options={sankeyOptions ? sankeyOptions.options : {}}
      />}
    </div>
  );
};

export default Sankey;
