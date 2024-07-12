import { getRandomInt } from "./MathUtils";

export function removeOrAddColumn(data, columnName) {
  const columnRemoved = data.some((row) => row[0].startsWith(columnName));
  if (columnRemoved) {
    return data.filter((row) => !row[0].startsWith(columnName));
  } else {
    // Find the index of the first row and insert the new rows after it
    const index = data.findIndex((row) => row[0] === "Location");
    if (index !== -1) {
      const newRows = Array.from({ length: 9 }, (_, i) => [
        `${columnName}_${i + 1}`,
        `${i + 1}`,
        getRandomInt(30, 60),
        getRandomInt(-50, 50),
      ]);
      return [
        ...data.slice(0, index + 1),
        ...newRows,
        ...data.slice(index + 1),
      ];
    } else {
      // Handle case where 'Location' row doesn't exist
      console.error("Location row not found in data.");
      return data;
    }
  }
}

export function filterOutLabels(array, selectedUnmet) {
  let unmetObj = {}
  if (!selectedUnmet) {
    return array
  }
  selectedUnmet.forEach(element => {
    unmetObj[element.value] = element
  });
  let filteredArray =  array.filter(item => !unmetObj.hasOwnProperty(item));
  return [...selectedUnmet.map(item => item.value), ...filteredArray];
  
}


export function filterOutLabelsTable(array, selectedUnmet) {
  let unmetObj = {}
  if (!selectedUnmet) {
    return array
  }
  selectedUnmet.forEach(element => {
    unmetObj[element.value] = element
  });
  console.log(array)
  let filteredArray =  array.filter(item => !unmetObj.hasOwnProperty(item.id));
  let filteredArray1 =  array.filter(item => unmetObj.hasOwnProperty(item.id));
  return [...filteredArray1, ...filteredArray];
  
}
