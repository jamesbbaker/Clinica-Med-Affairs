import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import geoJson from "./map-data.json";
import data from "./data.json";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2xpbmljYS1haSIsImEiOiJjbHU3eXE2bXUwYWNlMmpvM3Nsd2ZiZDA3In0.BxJb0GE9oDVg2umCg6QBSw";

const active = {
  name: "GDP",
  description: "Estimate total GDP in millions of dollars",
  property: "density",
  stops: [
    [0, "#f8d5cc"],
    [10, "#f4bfb6"],
    [50, "#f1a8a5"],
    [100, "#ee8f9a"],
    [500, "#ec739b"],
    [1000, "#dd5ca8"],
    [2500, "#c44cc0"],
    [50000, "#9f43d7"],
    [100000, "#6e40e6"],
  ],
};

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

    mapRef.current.on("load", () => {
      mapRef.current.addSource("countries", {
        type: "geojson",
        data: data,
      });
      const layers = mapRef.current.getStyle().layers;
      // Find the index of the first symbol layer in the map style.
      let firstSymbolId;
      for (const layer of layers) {
        if (layer.type === "symbol") {
          firstSymbolId = layer.id;
          break;
        }
      }

      mapRef.current.setLayoutProperty("country-label", "text-field", [
        "format",
        ["get", "name_en"],
        { "font-scale": 1.2 },
        "\n",
        {},
        ["get", "name"],
        {
          "font-scale": 0.8,
          "text-font": [
            "literal",
            ["DIN Offc Pro Italic", "Arial Unicode MS Regular"],
          ],
        },
      ]);

      mapRef.current.addLayer(
        {
          id: "countries",
          type: "fill",
          source: "countries",
        },
        firstSymbolId
      );

      mapRef.current.setPaintProperty("countries", "fill-color", {
        property: active.property,
        stops: active.stops,
      });
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
      className="map-container relative w-full h-large"
      ref={mapContainerRef}
    />
  );
};

export default Map;
