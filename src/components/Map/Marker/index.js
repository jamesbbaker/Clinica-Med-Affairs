import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { highestValue } from "../../../utils/MathUtils";

const CustomMarker = ({
  allMarkers = [],
  mapboxGlMarker,
  handleCustomAddMarkers,
  currentLevel,
  mapRef,
  markersData,
  levelToggles,
  currentToggle,
  onClick,
  feature,
  setCurrentLevel,
  setDetailsItem,
  setDetailsPosition,
  className,
  ...props
}) => {
  const markerRef = useRef(null);
  const [maxValue, setMaxValue] = useState(null);

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  useEffect(() => {
    if (maxValue) {
      let _MaxValue = highestValue(
        allMarkers,
        levelToggles[currentLevel][currentToggle]
      );
      let width = interpolateRadius(
        feature[levelToggles[currentLevel][currentToggle]],_MaxValue
      );

      let height = interpolateRadius(
        feature[levelToggles[currentLevel][currentToggle]],_MaxValue
      );

      setDimensions({
        width,
        height,
      });
    }
  }, [maxValue, currentToggle]);
  const hoverListener = (e) => {
    const coordinates = [feature.LONG, feature.LAT];
    const item = { ...feature };
    const pixel = mapRef.current.project(coordinates);
    setDetailsPosition({ left: pixel.x, top: pixel.y });
    setDetailsItem(item);
  };

  const hoverOutListener = () => {
    setDetailsItem(null);
  };

  function interpolateRadius(value, maxValue) {
    const minRadius = 0;
    const maxRadius = 100;
    // Maximum value

    // Ensure value is within range [0, maxValue]
    const clampedValue = Math.min(Math.max(value, 0), maxValue);

    // Linear interpolation formula
    const radius =
      (clampedValue / maxValue) * (maxRadius - minRadius) + minRadius;

    return radius;
  }

  function convertToDecimal(num) {
    let numString = num.toString();
    let length = numString.length;
    let divisor = Math.pow(10, length - 2);
    let decimalNumber = num / divisor;
    return decimalNumber;
  }
  useEffect(() => {
    if (markerRef.current && markersData) {
      const _maxValue = highestValue(
        markersData,
        levelToggles.region[currentToggle]
      );
      setMaxValue(_maxValue);
      let LATITUDE = feature.LAT;
      if (LATITUDE > 90) {
        LATITUDE = convertToDecimal(feature.LAT);
      }
      let coordinates = [feature.LONG, LATITUDE];
      const marker = new mapboxgl.Marker(markerRef.current, { ...props });
      marker.setLngLat(coordinates);
      marker.addTo(mapRef.current); // Assuming mapRef.current is a valid Mapbox GL map instance
      handleCustomAddMarkers(marker);
    }
  }, [feature]);

  return (
    <div
      style={{
        cursor: "pointer",
        border: "1px solid #fff",
        backgroundColor:
          currentToggle.includes("Percent")
            ? "#11b4da"
            : "#f28cb1",
        width:dimensions.width,
        height: dimensions.height,
      }}
      onMouseOver={hoverListener}
      onMouseLeave={hoverOutListener}
      onClick={() => onClick(feature)}
      ref={markerRef}
      className={className}
    >
      {/* Your custom marker content (icons, text, etc.) */}
    </div>
  );
};

export default CustomMarker;
