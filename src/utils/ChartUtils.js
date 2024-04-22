
export function setLineData(res, _type, dataKey) {
    const responseData = res.data;
  
    const dataByType = {};
    const distinctRowsData = [];
    responseData.sort((a, b) => {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(a.Date) - new Date(b.Date);
    });

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


    const organizedData = {};
    responseData.forEach((item) => {
      let Type = item.Type;
      let Date = item.Date
      let NumberOfPatients = item[dataKey]
      if (!organizedData[Type]) {
        organizedData[Type] = {};
      }
      if (!organizedData[Type][Date]) {
        organizedData[Type][Date] = [];
      }
      organizedData[Type][Date].push(NumberOfPatients);
    });
  
    // Create datasets from organized data
    const datasets = Object.keys(organizedData).map((Type, index) => {
      const data = Object.keys(organizedData[Type]).map((Date) => {
        return {
          x: Date,
          y: organizedData[Type][Date].reduce((a, b) => a + b, 0), // Sum patients for each Date
        };
      });
  
      return {
        label: Type,
        data: data,
        borderColor:colorsOutput[index], // Random color for each type
        fill: false,
      };
    });
  
    // Extract labels from organized data
   const labels = Object.keys(responseData.reduce((acc, { Date }) => ({ ...acc, [Date]: true }), {}));
  
    // Chart.js data object
    const chartData = {
      labels: labels,
      datasets: datasets,
    };
    return chartData
  }

  export function generateStatsOptions(text) {
    const statsOptions = {
      responsive: true,
      scales: {
        x: {
          grid: {
            display: false,
          },
          display: true,
          title: {
            display: true,
            text: "Date",
          },
          ticks: {
            font: {
              size: 14,
              weight: 600,
            },
            callback: function (value, index, ticks) {
              let label = this.getLabelForValue(value);
              return label
              // let month = parseInt(label && label.split("/")[0]);
              // return month % 6 === 0 ? label : null;
            },
          },
        },
        y: {
          
          display: true,
          title: {
            display: true,
            text: "Value",
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: text
        },
      },
    };
    return statsOptions
  }