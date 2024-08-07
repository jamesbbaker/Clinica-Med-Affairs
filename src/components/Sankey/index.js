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


const colorsOutput = [
  "#3AAB9D",
  "#D65FDB",
  "#65C5E3",
  "#FC8A71",
  "#7C53A6",
  "#E3B505",
  "#1BB83C",
  "#FDE84D",
  "#8CB3E3",
  "#FF72A5"
]





const Sankey = ({API, title,height="500px", OPTIONS}) => {
  const {accessToken, refreshToken} = useContext(AuthContext)
  const [SankeyData, setSankeyData] = useState(null)
  const [sankeyOptions, setSankeyOptions] = useState(null)

  useEffect(() => {
    if ( SankeyData) {
      const colors = {
        "Emergency and Critical Care": '#00796B',
        "Specialty Care": '#FF6F61',
        "Other": '#A2DED0',
        "Surgical Specialties": '#FFB347',
        "Primary Care Provider": '#6A0572',
        "Hospital Services":"#87CEEB"
      }; 
    
      // Process data to include color information
      const processedData = SankeyData.map((ITEM) => {
        
        const FROM = ITEM[OPTIONS.from]
        const TO = ITEM[OPTIONS.to]
        const COUNT = ITEM[OPTIONS.count]
        const prefix = FROM.match(/^([^_]+)/)[0] // Extract the prefix before "_"
        // Use predefined color if found, otherwise use default color
        let color ;
        if (colors[prefix]) {
      color = colors[prefix] ;
        } else{ 
          colors[prefix] = colorsOutput[Math.floor(Math.random() * colorsOutput.length)] 
          color = colors[prefix] ;
        }
        // Assign color to the link
        return [FROM, TO, COUNT, color];
      });

      
      const options = {
      
        sankey: {  node: { label: { 
        fontSize: 12,
        color: '#000',
        bold: true,
        italic: true },width: 3,    minNodeHeight: 20, height: 10 },
        
          link: { colorMode: 'source',        minLinkLength: 50, }, // Set color mode to 'source' to apply colors directly
        },
      };

      setSankeyOptions({
        data: [[OPTIONS.from, OPTIONS.to, OPTIONS.count, { role: "style" }], ...processedData],
        options: options
      });
    }
  }, [SankeyData]);
 
  useEffect(() => {
    if (API) {
      getDataStats(API,accessToken, refreshToken ).then(res => {
        if (res) {
       
            let dataArr = res.map(item => [item[OPTIONS.from],item[OPTIONS.to], item[OPTIONS.count]])
            dataArr.forEach(item => {
            if (item[0] === "ICS_1") {
           
            }
            })
            
            dataArr.unshift(["Source", "Target", "Value"])
            setSankeyData(res)
        }
      }).catch(err => {
        console.log(err,"err")
      })
    }
  }, [])



  return (
    <div>
      {title && <div className="pb-4 font-700">{title}</div>}
      {sankeyOptions && sankeyOptions.data && <Chart
        chartType="Sankey"
        width="100%"
        height={height}
        data={sankeyOptions.data }
        options={sankeyOptions ? sankeyOptions.options : {}}
      />}
    </div>
  );
};

export default Sankey;
