import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { highestValue } from "../../../utils/MathUtils";

const CustomMarker = ({
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

  function interpolateRadius(value) {
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

  useEffect(() => {
    if (markerRef.current && markersData) {
      const _maxValue = highestValue(
        markersData,
        levelToggles.region[currentToggle]
      );

      setMaxValue(_maxValue);
      let coordinates = [feature.LONG, feature.LAT];
      const marker = new mapboxgl.Marker(markerRef.current, { ...props });
      marker.setLngLat(coordinates);
      marker.addTo(mapRef.current); // Assuming mapRef.current is a valid Mapbox GL map instance
      handleCustomAddMarkers(marker)
    }
  }, [feature]);

  return (
    <div
      style={{
        cursor: "pointer",
        border: '1px solid #fff',
        backgroundColor: currentToggle == "Number of High Steroid Usage Patients" ? "#11b4da" : '#f28cb1',
        width: maxValue
          ? interpolateRadius(feature[levelToggles[currentLevel][currentToggle]])
          : "1rem",
        height: maxValue
          ? interpolateRadius(feature[levelToggles[currentLevel][currentToggle]])
          : "1rem",
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
