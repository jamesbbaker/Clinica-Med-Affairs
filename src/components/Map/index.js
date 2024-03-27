import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import geoJson from "./map-data.json";
import data from "./data.json";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2xpbmljYS1haSIsImEiOiJjbHU3eXE2bXUwYWNlMmpvM3Nsd2ZiZDA3In0.BxJb0GE9oDVg2umCg6QBSw";

const Map = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [latitude, setLatitude] = useState(-90);
  const [longitude, setLongitude] = useState(40);
  const [zoom, setZoom] = useState(3);
  const options = [
    {
      name: "Population",
      description: "Estimated total population",
      property: "pop_est",
      stops: [
        [0, "#f8d5cc"],
        [1000000, "#f4bfb6"],
        [5000000, "#f1a8a5"],
        [10000000, "#ee8f9a"],
        [50000000, "#ec739b"],
        [100000000, "#dd5ca8"],
        [250000000, "#c44cc0"],
        [500000000, "#9f43d7"],
        [1000000000, "#6e40e6"],
      ],
    },
    {
      name: "GDP",
      description: "Estimate total GDP in millions of dollars",
      property: "gdp_md_est",
      stops: [
        [0, "#f8d5cc"],
        [1000, "#f4bfb6"],
        [5000, "#f1a8a5"],
        [10000, "#ee8f9a"],
        [50000, "#ec739b"],
        [100000, "#dd5ca8"],
        [250000, "#c44cc0"],
        [5000000, "#9f43d7"],
        [10000000, "#6e40e6"],
      ],
    },
  ];
  const [active, setActive] = useState(options[0]);

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
        data,
      });

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
          id: "country-fills",
          type: "fill",
          source: "countries",
          paint: {
            "fill-color": "#c4c4c4",
            "fill-opacity": 0.5,
          },
        },
        "country-label"
      );

      // mapRef.current.setPaintProperty("country-fills", "fill-color", {
      //   property: active.property,
      //   stops: active.stops,
      // });

      // Add country borders
      mapRef.current.addLayer({
        id: "country-borders",
        type: "line",
        source: "countries",
        layout: {},
        paint: {
          "line-color": "#627BC1",
          "line-width": 0.25,
        },
      });

      // Add country hover layer
      mapRef.current.addLayer({
        id: "country-fills-hover",
        type: "fill",
        source: "countries",
        layout: {},
        paint: {
          "fill-color": "#000000",
          "fill-opacity": 0.3,
        },
        filter: ["==", "name", ""],
      });

      // Add country hover effect
      mapRef.current.on("mousemove", (e) => {
        const features = mapRef.current.queryRenderedFeatures(e.point, {
          layers: ["country-fills"],
        });

        if (features.length) {
          mapRef.current.getCanvas().style.cursor = "pointer";
          mapRef.current.setFilter("country-fills-hover", [
            "==",
            "name",
            features[0].properties.name,
          ]);
        } else {
          mapRef.current.setFilter("country-fills-hover", ["==", "name", ""]);
          mapRef.current.getCanvas().style.cursor = "";
        }
      });

      // Add country un-hover effect
      mapRef.current.on("mouseout", () => {
        mapRef.current.getCanvas().style.cursor = "auto";
        mapRef.current.setFilter("country-fills-hover", ["==", "name", ""]);
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
