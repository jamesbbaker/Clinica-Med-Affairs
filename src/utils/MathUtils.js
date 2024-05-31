export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export const getLowestValue = (data,label) => {
 const lowestValue =  data.reduce((min, obj) => {
    return obj[label] < min ? obj[label] : min;
  }, Infinity);
  return lowestValue;
}


export const highestValue = (data,label) => {
 
  const highestValue = data.reduce((max, obj) => {
    return obj[label] > max ? obj[label] : max;
  }, -Infinity);
  return highestValue
  
}