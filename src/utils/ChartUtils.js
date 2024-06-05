
export function setLineData(res, _type, dataKey) {
     const responseData = res.data;

    const dataByType = {};
    const distinctRowsData = [];
    responseData.sort((a, b) => {
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
      "#FF72A5",
      "#FF9F1C",
      "#00B159",
      "#00AEEF",
      "#F37735",
      "#8E44AD",
      "#F1C40F",
      "#3498DB",
      "#2C3E50",
      "#E74C3C",
      "#9B59B6"
  ];
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
        const data = Object.keys(organizedData[Type]).map((DateString) => {
            // Convert DateString to Date object
            const [year, month, day] = DateString.split('-').map(Number);
            const dateObj = new Date(year, month - 1, day); // Note: month is zero-based in Date constructor

            // Create a Date object for January 2016
            const jan2016 = new Date(2016, 0, 1); // January is month 0

            // Check if the date is after January 2016
            if (dateObj >= jan2016) {
                return {
                    x: DateString,
                    y: organizedData[Type][DateString].reduce((a, b) => a + b, 0), // Sum patients for each Date
                };
            }
            return null; // Exclude data before January 2016
        }).filter(dataObj => dataObj !== null);

        return {
            label: Type,
            data: data,
            borderColor: colorsOutput[index], // Random color for each type
            fill: false,
        };
    });

    // Extract labels from organized data and filter dates after January 2016
    const labels = Object.keys(responseData.reduce((acc, item) => {
        const [year, month, day] = item.Date.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day); // Note: month is zero-based in Date constructor
        const jan2016 = new Date(2016, 0, 1); // January is month 0
        if (dateObj >= jan2016) {
            acc[item.Date] = true;
        }
        return acc;
    }, {}));

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
        datalabels: {
          display: false,
        },
      },
    };
    return statsOptions
  }