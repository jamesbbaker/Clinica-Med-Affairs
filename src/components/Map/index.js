import mapboxgl from "mapbox-gl";
import React, { useContext, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import geoJson from "./map-data.json";
import mapDataJson from "./data.json";
import { getDataStats } from "../../API/Outputs";
import { AuthContext } from "../../context/AuthContext";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2xpbmljYS1haSIsImEiOiJjbHU3eXE2bXUwYWNlMmpvM3Nsd2ZiZDA3In0.BxJb0GE9oDVg2umCg6QBSw";

const defaultActive = {
  name: "GDP",
  description: "Estimate total GDP in millions of dollars",
  property: "density",
  stops: [
    [2740504, "#ffef96"],
    [13103255, "#ff6e73"],
    [29285938, "#d2177a"],
  ],
};

const stateAbbreviations = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

function MapAddLayer(map, data) {
  map.on("load", () => {
    map.addSource("countries", {
      type: "geojson",
      data: data,
    });
    const layers = map.getStyle().layers;
    // Find the index of the first symbol layer in the map style.
    let firstSymbolId;
    for (const layer of layers) {
      if (layer.type === "symbol") {
        firstSymbolId = layer.id;
        break;
      }
    }

    map.setLayoutProperty("country-label", "text-field", [
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

    map.addLayer(
      {
        id: "countries",
        type: "fill",
        source: "countries",
      },
      firstSymbolId
    );

    map.setPaintProperty("countries", "fill-color", {
      property: defaultActive.property,
      stops: defaultActive.stops,
    });

    map.addLayer({
      id: "country-fills-hover",
      type: "fill",
      source: "countries",
      layout: {},
      paint: {
        "fill-color": "#000000",
        "fill-opacity": 0.2,
      },
      filter: ["==", "name", ""],
    });

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    // Add country hover effect
    map.on("mousemove", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["countries"],
      });
      const feature = features[0];
      if (features.length) {
        map.getCanvas().style.cursor = "pointer";
        map.setFilter("country-fills-hover", [
          "==",
          "name",
          features[0].properties.name,
        ]);
        popup.setHTML(`<strong>${feature.properties.density.toLocaleString()}</strong>`);
    
        // Display the popup at the mouse pointer's location
        popup.setLngLat(e.lngLat).addTo(map);
      } else {
        map.setFilter("country-fills-hover", ["==", "name", ""]);
        map.getCanvas().style.cursor = "";
        popup.remove();
      }
    });

    // Add country un-hover effect
    map.on("mouseout", () => {
      map.getCanvas().style.cursor = "auto";
      // map.getCanvas().style.cursor = '';
      map.setFilter("country-fills-hover", ["==", "name", ""]);
    });

    // Add country onclick effect
    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["country-fills"],
      });
      if (!features.length) return;
      const { properties } = features[0];
      const { property, description } = defaultActive;
      alert(`(${properties.name}) ${properties[property]} ${description}`);
    });
  });

  // Render custom marker components
}

const Map = ({ mapData, LayerFn = MapAddLayer, markersEnabled = true }) => {
  const [data, setData] = useState(mapDataJson);
  const { accessToken, refreshToken } = useContext(AuthContext);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [latitude, setLatitude] = useState(-90);
  const [longitude, setLongitude] = useState(40);
  const [zoom, setZoom] = useState(3.5);

  useEffect(() => {
    if (mapData) {
      
      setData((prev) => {
        let _prev = { ...prev };
        _prev.features.forEach((feature) => {
          feature.properties.density = mapData[feature.properties.name]
            ? mapData[feature.properties.name].Asthma_Claims
            : 0;
        });

        return _prev;
      });
    }
  }, [mapData]);

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
      maxZoom: 10,
      minZoom: 3.5,
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [latitude, longitude],
      zoom: zoom,
    });
    LayerFn(mapRef.current, data);
    if (markersEnabled) {
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
    }
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
