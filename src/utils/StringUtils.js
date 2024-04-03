export const breakString = (sentence, segmentLength) => {
  const segments = [];
  let currentIndex = 0;

  while (currentIndex < sentence.length) {
    let endIndex = currentIndex + segmentLength;
    if (endIndex >= sentence.length) {
      segments.push(sentence.substr(currentIndex));
      break;
    }
    // Find the last whitespace before the endIndex
    while (sentence[endIndex] !== " " && endIndex > currentIndex) {
      endIndex--;
    }
    segments.push(sentence.substring(currentIndex, endIndex).trim());
    currentIndex = endIndex + 1;
  }

  return segments;
};

export const removeCommasFromString = (str) => {
  return str.replace(/,/g, " ");
};
