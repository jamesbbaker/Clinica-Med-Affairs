import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import geoJson from "./map-data.json";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2xpbmljYS1haSIsImEiOiJjbHU3eXE2bXUwYWNlMmpvM3Nsd2ZiZDA3In0.BxJb0GE9oDVg2umCg6QBSw";

const Map = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [latitude, setLatitude] = useState(-90);
  const [longitude, setLongitude] = useState(40);
  const [zoom, setZoom] = useState(3);

  const Marker = ({ onClick, children, feature }) => {
    const _onClick = () => {
      onClick(feature.geometry.coordinates);
    };

    return (
      <button onClick={_onClick} className="marker">
        {children}
      </button>
    );
  };

  // Initialize map when component mounts
  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [latitude, longitude],
      zoom: zoom,
    });

    // Render custom marker components
    geoJson.features.forEach((feature) => {
      // Create a React ref
      const ref = React.createRef();
      // Create a new DOM node and save it to the React ref
      ref.current = document.createElement("div");
      // Render a Marker Component on our new DOM node
      createRoot(ref.current).render(
        <Marker onClick={markerClicked} feature={feature} />
      );

      // Create a Mapbox Marker at our new DOM node
      new mapboxgl.Marker(ref.current)
        .setLngLat(feature.geometry.coordinates)
        .addTo(mapRef.current);
    });

    // Add navigation control (the +/- zoom buttons)
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Clean up on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const markerClicked = (coordinates) => {
    mapRef.current.flyTo({
      center: coordinates,
      zoom: 10,
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
    });
    // window.alert(title);
  };

  return (
    <div
      className="map-container relative w-full h-extraLarge"
      ref={mapContainerRef}
    />
  );
};

export default Map;
