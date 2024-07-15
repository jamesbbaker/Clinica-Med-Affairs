import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import geoJson from "./map-data.json";
import mapDataJson from "./data.json";
import CustomMarker from "./Marker";
import MapboxglSpiderifier from "mapboxgl-spiderifier";
import {
  mapBarCharts,
  mapLabels,
  mapSelectLabels,
  patientTotals,
  selectLabels,
} from "../../constants/appConstants";


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

const regionColors = {
  MW: "#FFD1DC",
  NE: "#B0E0E6",
  SW: "#98FB98",
  SE: "#FFD700",
  NW: "#FFA07A",
  AK: "#9932CC",
  HI: "#6A5ACD",
  PR: "#3CB371",
};

function MapAddLayer(
  map,
  data,
  markerClicked,
  loaded = false,
  removeOldLayer = false,
  layerId = "countries",
  _layerAdded,
  dataQuality = false,
  setLayerAdded = () => {}
) {
  function LayerAddition() {
    // Remove all layers

    map.addSource(layerId, {
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

    map.addLayer(
      {
        id: layerId,
        type: "fill",
        source: layerId,
      },
      firstSymbolId
    );

    if (dataQuality) {
      map.setPaintProperty(layerId, "fill-color", {
        property: defaultActive.property,
        stops: defaultActive.stops,
      });
    }

    map.addLayer({
      id: "country-fills-hover",
      type: "fill",
      source: layerId,
      layout: {},
      paint: {
     
        "fill-opacity": 0.2,
      },
      filter: ["==", "name", ""],
    });
    setLayerAdded(true);

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    // Add country hover effect
    map.on("mousemove", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [layerId],
      });
      if (features.length) {
        map.getCanvas().style.cursor = "pointer";
        map.setFilter("country-fills-hover", [
          "==",
          "name",
          features[0].properties.name,
        ]);
        // popup.setHTML(
        //   `<strong>${feature.properties.density.toLocaleString()}</strong>`
        // );

        // // Display the popup at the mouse pointer's location
        // popup.setLngLat(e.lngLat).addTo(map);
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
  }
  if (loaded) {
    LayerAddition();
  } else {
    map.on("load", () => LayerAddition);
  }

  // Render custom marker components
}

const levelToggles = {
  region: {
    "Number of Asthma Patients": "Total Asthma Patients",
    "Number of No Spirometry": "Total No Spirometry",
    "Percent of No Spirometry": "Percent No Spirometry",
    "Number of No EOS Testing": "Total No EOS Testing",
    "Percent of No EOS Testing": "Percent No EOS Testing",
    "Number of No Treatment": "Total No Treatment",
    "Percent of No Treatment": "Percent No Treatment",
    "Number of ICS Patients": "Total ICS Patients",
    "Number of ICS Compliance < 240": "Total ICS Compliance < 240",
    "Percent of ICS Compliance < 240": "Percent ICS Compliance < 240",
    "Number of ICS Persistence < 360": "Total ICS Persistence < 360",
    "Percent of ICS Persistence < 360": "Percent ICS Persistence < 360",
    "Number of ICS High Steroid Usage": "Total ICS High Steroid Usage",
    "Percent of ICS High Steroid Usage": "Percent ICS High Steroid Usage",
    "Number of ICS Exacerbation": "Total ICS Exacerbations",
    "Number of ICS Exacerbation Failed Escalation":
      "Total ICS Exacerbation Failed Escalation",
    "Percent of ICS Exacerbation Failed Escalation":
      "Percent ICS Exacerbation Failed Escalation",
    "Number of ICS Escalation Delay": "Total ICS Escalation Delay",
    "Percent of ICS Escalation Delay": "Percent ICS Escalation Delay",
    "Number of ICS-LABA Patients": "Total ICS-LABA Patients",
    "Number of ICS-LABA Compliance < 240": "Total ICS-LABA Compliance < 240",
    "Percent of ICS-LABA Compliance < 240": "Percent ICS-LABA Compliance < 240",
    "Number of ICS-LABA Persistence < 360": "Total ICS-LABA Persistence < 360",
    "Percent of ICS-LABA Persistence < 360":
      "Percent ICS-LABA Persistence < 360",
    "Number of ICS-LABA High Steroid Usage":
      "Total ICS-LABA High Steroid Usage",
    "Percent of ICS-LABA High Steroid Usage":
      "Percent ICS-LABA High Steroid Usage",
    "Number of ICS-LABA Exacerbation": "Total ICS-LABA Exacerbations",
    "Number of ICS-LABA Exacerbation Failed Escalation":
      "Total ICS-LABA Exacerbation Failed Escalation",
    "Percent of ICS-LABA Exacerbation Failed Escalation":
      "Percent ICS-LABA Exacerbation Failed Escalation",
    "Number of ICS-LABA Escalation Delay": "Total ICS-LABA Escalation Delay",
    "Percent of ICS-LABA Escalation Delay": "Percent ICS-LABA Escalation Delay",
    "Number of ICS-LABA LAMA Patients": "Total ICS-LABA LAMA Patients",
    "Number of ICS-LABA LAMA Compliance < 240":
      "Total ICS-LABA LAMA Compliance < 240",
    "Percent of ICS-LABA LAMA Compliance < 240":
      "Percent ICS-LABA LAMA Compliance < 240",
    "Number of ICS-LABA LAMA Persistence < 360":
      "Total ICS-LABA LAMA Persistence < 360",
    "Percent of ICS-LABA LAMA Persistence < 360":
      "Percent ICS-LABA LAMA Persistence < 360",
    "Number of ICS-LABA Patients with LAMA": "Total ICS-LABA With LAMA",
    "Percent of ICS-LABA Patients with LAMA": "Percent ICS-LABA With LAMA",
    "Number of ICS-LABA >900mg/year steroids":
      "Number of ICS-LABA >900mg/year steroids",
    "Percent of ICS-LABA >900mg/year steroids":
      "Percent of ICS-LABA >900mg/year steroids",
    "Number of ICS-LABA High Steroid Usage with ER visit":
      "Number of ICS-LABA High Steroid Usage with ER visit",
    "Percent of ICS-LABA High Steroid Usage with ER visit":
      "Percent of ICS-LABA High Steroid Usage with ER visit",
    "Number of ICS-LABA High Steroid Usage without ER visit":
      "Number of ICS-LABA High Steroid Usage without ER visit",
    "Percent of ICS-LABA High Steroid Usage without ER visit":
      "Percent of ICS-LABA High Steroid Usage without ER visit",
    "Number of Failure To Escalate With 3 Exacerbations":
      "Number of Failure To Escalate With 3 Exacerbations",
    "Percent of Failure To Escalate With 3 Exacerbations":
      "Percent of Failure To Escalate With 3 Exacerbations",
      "Number of Biologic Before Triple":'Number of Biologic Before Triple',
      "Percent of Biologic Before Triple":"Percent of Biologic Before Triple",
      "Number of Exacerbation Without Spirometry":"Number of Exacerbation Without Spirometry",
      "Percent of Exacerbation Without Spirometry":"Percent of Exacerbation Without Spirometry"
  },
  state: {
    "Number of Asthma Patients": "Total Asthma Patients",
    "Number of No Spirometry": "Total No Spirometry",
    "Percent of No Spirometry": "Percent No Spirometry",
    "Number of No EOS Testing": "Total No EOS Testing",
    "Percent of No EOS Testing": "Percent No EOS Testing",
    "Number of No Treatment": "Total No Treatment",
    "Percent of No Treatment": "Percent No Treatment",
    "Number of ICS Patients": "Total ICS Patients",
    "Number of ICS Compliance < 240": "Total ICS Compliance < 240",
    "Percent of ICS Compliance < 240": "Percent ICS Compliance < 240",
    "Number of ICS Persistence < 360": "Total ICS Persistence < 360",
    "Percent of ICS Persistence < 360": "Percent ICS Persistence < 360",
    "Number of ICS High Steroid Usage": "Total ICS High Steroid Usage",
    "Percent of ICS High Steroid Usage": "Percent ICS High Steroid Usage",
    "Number of ICS Exacerbation": "Total ICS Exacerbations",
    "Number of ICS Exacerbation Failed Escalation":
      "Total ICS Exacerbation Failed Escalation",
    "Percent of ICS Exacerbation Failed Escalation":
      "Percent ICS Exacerbation Failed Escalation",
    "Number of ICS Escalation Delay": "Total ICS Escalation Delay",
    "Percent of ICS Escalation Delay": "Percent ICS Escalation Delay",
    "Number of ICS-LABA Patients": "Total ICS-LABA Patients",
    "Number of ICS-LABA Compliance < 240": "Total ICS-LABA Compliance < 240",
    "Percent of ICS-LABA Compliance < 240": "Percent ICS-LABA Compliance < 240",
    "Number of ICS-LABA Persistence < 360": "Total ICS-LABA Persistence < 360",
    "Percent of ICS-LABA Persistence < 360":
      "Percent ICS-LABA Persistence < 360",
    "Number of ICS-LABA High Steroid Usage":
      "Total ICS-LABA High Steroid Usage",
    "Percent of ICS-LABA High Steroid Usage":
      "Percent ICS-LABA High Steroid Usage",
    "Number of ICS-LABA Exacerbation": "Total ICS-LABA Exacerbations",
    "Number of ICS-LABA Exacerbation Failed Escalation":
      "Total ICS-LABA Exacerbation Failed Escalation",
    "Percent of ICS-LABA Exacerbation Failed Escalation":
      "Percent ICS-LABA Exacerbation Failed Escalation",
    "Number of ICS-LABA Escalation Delay": "Total ICS-LABA Escalation Delay",
    "Percent of ICS-LABA Escalation Delay": "Percent ICS-LABA Escalation Delay",
    "Number of ICS-LABA LAMA Patients": "Total ICS-LABA LAMA Patients",
    "Number of ICS-LABA >900mg/year steroids":
      "Number of ICS-LABA >900mg/year steroids",
    "Percent of ICS-LABA >900mg/year steroids":
      "Percent of ICS-LABA >900mg/year steroids",
    "Number of ICS-LABA High Steroid Usage with ER visit":
      "Number of ICS-LABA High Steroid Usage with ER visit",
    "Percent of ICS-LABA High Steroid Usage with ER visit":
      "Percent of ICS-LABA High Steroid Usage with ER visit",
    "Number of ICS-LABA High Steroid Usage without ER visit":
      "Number of ICS-LABA High Steroid Usage without ER visit",
    "Percent of ICS-LABA High Steroid Usage without ER visit":
      "Percent of ICS-LABA High Steroid Usage without ER visit",
    "Number of ICS-LABA LAMA Compliance < 240":
      "Total ICS-LABA LAMA Compliance < 240",
    "Percent of ICS-LABA LAMA Compliance < 240":
      "Percent ICS-LABA LAMA Compliance < 240",
    "Number of ICS-LABA LAMA Persistence < 360":
      "Total ICS-LABA LAMA Persistence < 360",
    "Percent of ICS-LABA LAMA Persistence < 360":
      "Percent ICS-LABA LAMA Persistence < 360",
    "Number of ICS-LABA Patients with LAMA": "Total ICS-LABA With LAMA",
    "Percent of ICS-LABA Patients with LAMA": "Percent ICS-LABA With LAMA",
    "Number of Failure To Escalate With 3 Exacerbations":
    "Number of Failure To Escalate With 3 Exacerbations",
  "Percent of Failure To Escalate With 3 Exacerbations":
    "Percent of Failure To Escalate With 3 Exacerbations",
    "Number of Biologic Before Triple":'Number of Biologic Before Triple',
    "Percent of Biologic Before Triple":"Percent of Biologic Before Triple",
    "Number of Exacerbation Without Spirometry":"Number of Exacerbation Without Spirometry",
    "Percent of Exacerbation Without Spirometry":"Percent of Exacerbation Without Spirometry"
  },
  hcp: {
    "Number of Asthma Patients": "Number of Asthma Patients",
    "Number of No Spirometry": "Number of No Spirometry",
    "Percent of No Spirometry": "Percent of No Spirometry",
    "Number of No EOS Testing": "Number of No EOS Testing",
    "Percent of No EOS Testing": "Percent of No EOS Testing",
    "Number of No Treatment": "Number of No Treatment",
    "Percent of No Treatment": "Percent of No Treatment",
    "Number of ICS Patients": "Number of ICS Patients",
    "Number of ICS Compliance < 240": "Number of ICS Compliance < 240",
    "Percent of ICS Compliance < 240": "Percent of ICS Compliance < 240",
    "Number of ICS Persistence < 360": "Number of ICS Persistence < 360",
    "Percent of ICS Persistence < 360": "Percent of ICS Persistence < 360",
    "Number of ICS High Steroid Usage": "Number of ICS High Steroid Usage",
    "Percent of ICS High Steroid Usage": "Percent of ICS High Steroid Usage",
    "Number of ICS Exacerbation": "Number of ICS Exacerbation",
    "Number of ICS Exacerbation Failed Escalation":
      "Number of ICS Exacerbation Failed Escalation",
    "Percent of ICS Exacerbation Failed Escalation":
      "Percent of ICS Exacerbation Failed Escalation",
    "Number of ICS Escalation Delay": "Number of ICS Escalation Delay",
    "Percent of ICS Escalation Delay": "Percent of ICS Escalation Delay",
    "Number of ICS-LABA Patients": "Number of ICS-LABA Patients",
    "Number of ICS-LABA Compliance < 240":
      "Number of ICS-LABA Compliance < 240",
    "Percent of ICS-LABA Compliance < 240":
      "Percent of ICS-LABA Compliance < 240",
    "Number of ICS-LABA Persistence < 360":
      "Number of ICS-LABA Persistence < 360",
    "Percent of ICS-LABA Persistence < 360":
      "Percent of ICS-LABA Persistence < 360",
    "Number of ICS-LABA High Steroid Usage":
      "Number of ICS-LABA High Steroid Usage",
    "Percent of ICS-LABA High Steroid Usage":
      "Percent of ICS-LABA High Steroid Usage",
    "Number of ICS-LABA Exacerbation": "Number of ICS-LABA Exacerbation",
    "Number of ICS-LABA Exacerbation Failed Escalation":
      "Number of ICS-LABA Exacerbation Failed Escalation",
    "Percent of ICS-LABA Exacerbation Failed Escalation":
      "Percent of ICS-LABA Exacerbation Failed Escalation",
    "Number of ICS-LABA Escalation Delay":
      "Number of ICS-LABA Escalation Delay",
    "Percent of ICS-LABA Escalation Delay":
      "Percent of ICS-LABA Escalation Delay",
    "Number of ICS-LABA LAMA Patients": "Number of ICS-LABA LAMA Patients",
    "Number of ICS-LABA LAMA Compliance < 240":
      "Number of ICS-LABA LAMA Compliance < 240",
    "Percent of ICS-LABA LAMA Compliance < 240":
      "Percent of ICS-LABA LAMA Compliance < 240",
    "Number of ICS-LABA LAMA Persistence < 360":
      "Number of ICS-LABA LAMA Persistence < 360",
    "Percent of ICS-LABA LAMA Persistence < 360":
      "Percent of ICS-LABA LAMA Persistence < 360",
    "Number of ICS-LABA Patients with LAMA": "Number of ICS-LABA With LAMA",
    "Percent of ICS-LABA Patients with LAMA": "Percent of ICS-LABA With LAMA",
    "Number of Failure To Escalate With 3 Exacerbations":
    "Number of Failure To Escalate With 3 Exacerbations",
  "Percent of Failure To Escalate With 3 Exacerbations":
    "Percent of Failure To Escalate With 3 Exacerbations",
    "Number of Biologic Before Triple":'Number of Biologic Before Triple',
    "Percent of Biologic Before Triple":"Percent of Biologic Before Triple",
    "Number of Exacerbation Without Spirometry":"Number of Exacerbation Without Spirometry",
    "Percent of Exacerbation Without Spirometry":"Percent of Exacerbation Without Spirometry"
  },
};

const Map = ({
  setHcpProfilePage=() => {},
  impactLayer = () => {},
  impactMap,
  currentLevel,
  setCurrentLevel,
  stateData,
  currentToggle,
  dataQuality,
  stateClicked,
  markedStates,
  markers,
  markerClickedFn,
  mapData,
  data1,
  setData1,
  LayerFn = MapAddLayer,
  markersEnabled = true,
}) => {
  const [data, setData] = useState(mapDataJson);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const spiderifier = useRef(null);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [popups, setPopups] = useState([]);
  const [detailsItem, setDetailsItem] = useState(null);
  const [stateMarkers, setStateMarkers] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [detailsPosition, setDetailsPosition] = useState(null);
  const mapboxglMarker = useRef([]);
  const mapStateboxglMarker = useRef([]);
  const [layerAdded, setLayerAdded] = useState(false);

  useEffect(() => {
    if (impactMap) {
      impactLayer();
    }
  }, []);

  useEffect(() => {
    if (markers && stateData && layerAdded) {
      let _itemValues = [];

      Object.values(stateData).forEach((item) => {
        item.forEach((_state) => {
          if (regionColors[_state.Region]) {
            _itemValues.push([
              _state["State Name"],
              regionColors[_state.Region],
            ]);
          } else {
            console.log(_state);
          }
        });
      });
      if (window.mapRemoveLayer) {
        window.mapRemoveLayer();
      }

      handleRegionMarkers(markers, "marker2");

      mapRef.current.setPaintProperty("countries", "fill-color", {
        property: "name",
        type: "categorical",
        stops: _itemValues,
      });
    }
  }, [markers, stateData, layerAdded]);

  useEffect(() => {
    if (markedStates) {
      handleStateLevelMarkers(markedStates, "marker1");
    }
  }, [markedStates]);

  useEffect(() => {
    if (mapRef.current) {
      window.mapRemoveLayer = () => {
        if (
          mapRef.current &&
          mapRef.current.getStyle() &&
          mapRef.current.getStyle().layers
        ) {
          mapRef.current.getStyle().layers.forEach(function (layer) {
            // if (layer.id == "country-label" || layer.id == "settlement-label") {
            //   mapRef.current.removeLayer(layer.id);
            // }
          });
        }
      };
    }
  }, [mapRef.current]);

  // useEffect(() => {
  //   if (mapStateData) {
  //     window.mapRemoveLayer();
  //     LayerFn(mapRef.current, mapStateData, true, true, true, `countries`);
  //   }
  // }, [mapStateData]);

  useEffect(() => {
    if (currentToggle && mapRef.current) {
      handleToggleData(currentToggle);
    }
  }, [currentToggle]);

  const handleToggleData = (toggleId) => {
    if (!popups || !spiderifier.current) {
      return
    }
    popups.forEach((popup) => popup.remove());
    setPopups([]);
    if (markedStates) {
      handleStateLevelMarkers(markedStates, "marker1", "#f28cb1");
    }
    spiderifier.current.unspiderfy();
    spiderifier.current = new MapboxglSpiderifier(mapRef.current, {
      onClick: function (e, spiderLeg) {
        var feature = spiderLeg.feature;
        setChartDataValue(setData1, null, [feature.properties]);
        setHcpProfilePage("map")
     
      },
      initializeLeg: function initializeSpiderLeg(spiderLeg) {
        var pinElem = spiderLeg.elements.pin;
        var feature = spiderLeg.feature;
        var popup;

        pinElem.className = pinElem.className + "marker1";
        function interpolateRadius(value) {
          const minRadius = 10;
          const maxRadius =
            currentToggle === "Number of High Steroid Usage Patients" ? 50 : 100;
          // Maximum value

          // Ensure value is within range [0, maxValue]
          const clampedValue = Math.min(Math.max(value, 0), 20);

          // Linear interpolation formula
          const radius =
            (clampedValue / 40) * (maxRadius - minRadius) + minRadius;

          return radius;
        }

        pinElem.style.width = `${interpolateRadius(
          feature.properties[currentToggle]
        )}px`;
        pinElem.style.height = `${interpolateRadius(
          feature.properties[currentToggle]
        )}px`;
        pinElem.style.borderRadius = `50%`;
        pinElem.style.background = !patientTotals.includes(currentToggle)
          ? "#800000"
          : "#00008B";
        pinElem.style.border = "1px solid #fff";

        pinElem.addEventListener("mouseenter", function () {
          let newObject = {
            ...spiderLeg,
            param: {
              x: spiderLeg.param.x,
              y: spiderLeg.param.y - 35,
            },
          };
          popup = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: false,
            offset: MapboxglSpiderifier.popupOffsetForSpiderLeg(newObject),
          });

          popup
            .setHTML(
              `<div className="text-sm max-w-[10rem]"><h4 className="text-xs">Name: <strong className="font-bold">${
                feature.properties["Assigned Physician Name"]
              }</strong></h4><h4 className="text-xs">Primary Specialty Description: <strong className="font-bold">${
                feature.properties["Assigned Specialty"]
              }</strong></h4> <h4 className="text-xs">${
                selectLabels[currentToggle]
              }: <strong className="font-bold">${
                feature.properties &&
                currentToggle &&
                feature.properties[currentToggle].toLocaleString()
              }</strong></h4></div>`
            )
            .addTo(mapRef.current);

          spiderLeg.mapboxMarker.setPopup(popup);
        });
        pinElem.addEventListener("mouseleave", function () {
          if (popup) {
            popup.remove();
          }
        });
      },
      markerWidth: 40,
      markerHeight: 40,
    });

    if (!patientTotals.includes(currentToggle)) {
      mapRef.current.setPaintProperty(
        "unclustered-point",
        "circle-color",
        "#800000"
      );
    } else {
      mapRef.current.setPaintProperty(
        "unclustered-point",
        "circle-color",
        "#00008B"
      );
    }
  };



 

  const handleStateLevelMarkers = (
    data,
    markerClass,
    circleColor = "#f28cb1"
  ) => {
    let groupObj = {};
    data.forEach((marker, index) => {
      let size = marker[currentToggle];
      const key = `${marker.LONG},${marker.LAT}`;
      if (groupObj.hasOwnProperty(key)) {
        let prevObj = groupObj[key];
        let newSize = prevObj.size > size ? prevObj.size : size;
        groupObj[key] = {
          ...prevObj,
          size: newSize,
          coordinates: [marker.LONG, marker.LAT],
          [`marker${index}`]: JSON.stringify({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [marker.LONG, marker.LAT],
            },
            properties: { ...marker, size },
          }),
        };
      } else {
        groupObj[key] = {
          size,
          coordinates: [marker.LONG, marker.LAT],
          [`marker${index}`]: JSON.stringify({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [marker.LONG, marker.LAT],
            },
            properties: { ...marker, size },
          }),
        };
      }
    });

    const geojson = {
      type: "FeatureCollection",
      features: Object.values(groupObj).map((marker) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: marker.coordinates,
        },
        properties: { ...marker, size: marker.size },
      })),
    };

    if (mapRef.current.getSource("markers")) {
      mapRef.current.getSource("markers").setData(geojson);
    }

    mapRef.current.setPaintProperty("unclustered-point", "circle-radius", [
      "interpolate",
      ["linear"],
      ["get", "size"],
      0, // If size is 0, radius is 0
      0, // If size is 0, radius is 0
      1, // If size is 1, radius is 12
      4, // If size is 1, radius is 12,
      10,
      9,
      20,
      14,
      30,
      19,
      40,
      24,
    ]);

    let hoverListener = (e) => {
      e.preventDefault();
      if (e.features && e.features.length > 0) {
        const stateFeature = e.features[0].properties;
        let newArr = [];
        if (stateFeature) {
          Object.values(stateFeature).forEach((item) => {
            newArr.push(JSON.parse(item));
          });
        }
        // newArr.splice(0,2)
        let filteredArr = [
          ...newArr.filter(
            (item) => item.properties && item.properties.size !== 0
          ),
        ];
        //   console.log(filteredArr)
        //   const spiralMarkers = createSpiralMarkers(newArr[1], filteredArr);
        //   const geojson = {
        //     type: "FeatureCollection",
        //     features: spiralMarkers,
        // };

        const coordinates = e.features[0].geometry.coordinates.slice();
        const pixel = mapRef.current.project(coordinates);
        setCurrentLevel("hcp");
        setDetailsPosition({ left: pixel.x, top: pixel.y });

        setDetailsItem(filteredArr);
      }
    };

    const clickListener = (e) => {
      e.preventDefault();
      if (e.features && e.features.length > 0) {
        const stateFeature = e.features[0].properties;
        let newArr = [];
        if (stateFeature) {
          Object.values(stateFeature).forEach((item) => {
            newArr.push(JSON.parse(item));
          });
        }
        // newArr.splice(0,2)
        let filteredArr = [
          ...newArr.filter(
            (item) => item.properties && item.properties.size !== 0
          ),
        ];
        if (filteredArr.length > 1) {
          spiderifier.current.unspiderfy();
          spiderifier.current.spiderfy(
            e.features[0].geometry.coordinates,
            filteredArr
          );
        } else {


          setChartDataValue(setData1, null, [filteredArr[0].properties]);
          setHcpProfilePage("map")
       
        }

        // const stateFeature = e.features.find(
        //   (feature) => feature.layer.id === "countries"
        // );

        // if (!stateFeature) {
        //   const coordinates = e.features[0].geometry.coordinates.slice();
        //   const item = e.features[0].properties;
        //   const pixel = mapRef.current.project(coordinates);
        //   setCurrentLevel("hcp");
        //   setDetailsPosition({ left: pixel.x, top: pixel.y });
        //   setModalDetails(item);
        // }
      }
    };

    let hoverOutListener = () => {
      setDetailsItem(null);
    };

    mapRef.current.on("mouseenter", "unclustered-point", hoverListener);
    mapRef.current.on("click", "unclustered-point", clickListener);
    mapRef.current.on("mouseleave", "unclustered-point", hoverOutListener);
  };

  const handleClick = (feature) => {
    setDetailsItem(null);
    stateClicked(feature, mapRef);
    mapStateboxglMarker.current.forEach((marker) => marker && marker.remove());
    mapStateboxglMarker.current = [];
  };

  const handleStateMarkers = (data, markerClass) => {
    setCurrentLevel("state");
    const newStateMarkers = data.filter(feature => (feature.Region !== 0))
    setStateMarkers(newStateMarkers);
    mapboxglMarker.current.forEach((marker) => marker && marker.remove());
    mapboxglMarker.current = [];
  };

  const handleRegionMarkers = (data, markerClass) => {
    const newMapMarkers = data.filter(feature => (feature.Region !== 0))
    setMapMarkers(newMapMarkers);
  };

  const handleAddMarker = (data, markerClass) => {
    mapMarkers.forEach((marker) => marker.remove());
    setMapMarkers([]);

    const newMapMarkers = data.features.map((feature) => {
      const ref = React.createRef();
      ref.current = document.createElement("div");
      createRoot(ref.current).render(
        <Marker
          markerClass={markerClass}
          onClick={markerClicked}
          feature={feature}
        />
      );
      const marker = new mapboxgl.Marker(ref.current)
        .setLngLat(feature.geometry.coordinates)
        .addTo(mapRef.current);

      return marker;
    });
    setMapMarkers(newMapMarkers);
  };

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

  const Marker = ({
    currentToggle,
    maxValue = 3000000,
    markerClass = "marker1",
    onClick,
    handleMouseEnter,
    handleMouseLeave,
    children,
    feature,
  }) => {
    const _onClick = () => {
      onClick(feature);
    };

    function interpolateRadius(value) {
      const minRadius = 0;
      const maxRadius = 50;
      // Maximum value

      // Ensure value is within range [0, maxValue]
      const clampedValue = Math.min(Math.max(value, 0), maxValue);

      // Linear interpolation formula
      const radius =
        (clampedValue / maxValue) * (maxRadius - minRadius) + minRadius;

      return radius;
    }

    return (
      <button
        style={{
          width: interpolateRadius(
            feature[levelToggles["region"][currentToggle]]
          ),
          height: interpolateRadius(
            feature[levelToggles["region"][currentToggle]]
          ),
        }}
        onMouseEnter={() => handleMouseEnter(feature)}
        onMouseLeave={handleMouseLeave}
        onClick={_onClick}
        className={`${markerClass} animate-fade-in`}
      >
        {children}
      </button>
    );
  };

  function setChartDataValue(setValue, API_labels, data) {
    function generateChartData(array) {
      let _value = [];
      // console.log(array, data[0])
      array.forEach((item) => {
        _value.push(data[0][mapLabels[item]]);
      });
      let labels = array.map((item) => mapSelectLabels[mapLabels[item]]);

      return {
        labels,
        datasets: [
          {
            data: _value,
            borderColor: array.map((item) =>
              !patientTotals.includes(item) ? "#800000" : "#00008B"
            ),
            backgroundColor: array.map((item) =>
              !patientTotals.includes(item) ? "#800000" : "#00008B"
            ),
            barThickness: 20, // Set a specific thickness for the bar
            maxBarThickness: 20,
          },
        ],
      };
    }

    setValue({
      mapValue1: generateChartData(mapBarCharts.chart1),
      mapValue2: generateChartData(mapBarCharts.chart2),
      mapValue3: generateChartData(mapBarCharts.chart3),
      mapValue4: generateChartData(mapBarCharts.chart4),
      mapValue5: generateChartData(mapBarCharts.chart5),
      ...data,
    });
  }

  // Initialize map when component mounts
  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      // maxZoom: 10,
      minZoom: 3.5,
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v9",
      center: [-90, 40],
      zoom: 3.5,
    });
    mapRef.current.on("load", () => {
      LayerFn(
        mapRef.current,
        data,
        true,
        true,
        true,
        `countries`,
        true,
        dataQuality,
        setLayerAdded
      );
      spiderifier.current = new MapboxglSpiderifier(mapRef.current, {
        onClick: function (e, spiderLeg) {
          var feature = spiderLeg.feature;
          setChartDataValue(setData1, null, [feature.properties]);
          setHcpProfilePage("map")
  
        },
        initializeLeg: function initializeSpiderLeg(spiderLeg) {
          var pinElem = spiderLeg.elements.pin;
          var feature = spiderLeg.feature;
          var popup;

          pinElem.className = pinElem.className + "marker1";
          // let maxValue = highestValue(markedStates, currentToggle);
          function interpolateRadius(value) {
            const minRadius = 10;
            const maxRadius = 50;
            // Maximum value

            // Ensure value is within range [0, maxValue]
            const clampedValue = Math.min(Math.max(value, 0), 20);

            // Linear interpolation formula
            const radius =
              (clampedValue / 40) * (maxRadius - minRadius) + minRadius;

            return radius;
          }

          pinElem.style.width = `${interpolateRadius(
            feature.properties[currentToggle]
          )}px`;
          pinElem.style.height = `${interpolateRadius(
            feature.properties[currentToggle]
          )}px`;
          pinElem.style.borderRadius = `50%`;
          pinElem.style.background = !patientTotals.includes(currentToggle)
            ? "#800000"
            : "#00008B";
          pinElem.style.border = "1px solid #fff";
          pinElem.addEventListener("mouseenter", function () {
            let newObject = {
              ...spiderLeg,
              param: {
                x: spiderLeg.param.x,
                y: spiderLeg.param.y - 35,
              },
            };
            popup = new mapboxgl.Popup({
              closeButton: true,
              closeOnClick: false,
              offset: MapboxglSpiderifier.popupOffsetForSpiderLeg(newObject),
            });

            popup
              .setHTML(
                `<div className="text-sm max-w-[10rem]"><h4 className="text-xs">Name: <strong className="font-bold">${
                  feature.properties["Assigned Physician Name"]
                }</strong></h4><h4 className="text-xs">Primary Specialty Description: <strong className="font-bold">${
                  feature.properties["Assigned Specialty"]
                }</strong></h4> <h4 className="text-xs">${
                  selectLabels[currentToggle]
                }: <strong className="font-bold">${
                  feature.properties &&
                  currentToggle &&
                  feature.properties[currentToggle].toLocaleString()
                }</strong></h4></div>`
              )
              .addTo(mapRef.current);

            spiderLeg.mapboxMarker.setPopup(popup);
          });
          pinElem.addEventListener("mouseleave", function () {
            if (popup) {
              popup.remove();
            }
          });
        },
        markerWidth: 40,
        markerHeight: 40,
      });

      mapRef.current.addSource("markers", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [], // Initial empty array of features
        },
      });

      mapRef.current.addLayer({
        id: "clusters",
        type: "circle",
        source: "markers",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            100,
            "#f1f075",
            750,
            "#f28cb1",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40,
          ],
        },
      });

      mapRef.current.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "markers",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      mapRef.current.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "markers",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#00008B",
          "circle-radius": ["get", "size"], // Assuming 'size' is a property in your marker data
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });
    });
    if (markersEnabled) {
      handleAddMarker(geoJson, "marker1");
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

  const markerClicked = (feature) => {
    mapRef.current.flyTo({
      center: feature.geometry.coordinates,
      zoom: 10,
      essential: true,
    });
  };

  const regionClicked = async (feature) => {
    if (mapRef.current.getSource("markers")) {
      mapRef.current.getSource("markers").setData({});
    }
    let coordinates = [feature.LONG, feature.LAT];
    mapRef.current.flyTo({
      center: coordinates,
      zoom: 4,
      essential: true,
    });

    setCurrentRegion(feature.Region);
    markerClickedFn(feature);
    handleStateMarkers(stateData[feature.Region], "marker1");
  };

  const handleCustomAddMarkers = (marker) => {
    if (
      mapboxglMarker.current &&
      mapMarkers &&
      mapboxglMarker.current.length !== mapMarkers.length
    ) {
      let mapArr = [...mapboxglMarker.current];

      mapArr.push(marker);
      mapboxglMarker.current = [...mapArr];
    }
  };

  const handleCustomAddStateMarkers = (marker) => {
    if (
      mapMarkers &&
      mapStateboxglMarker.current.length !== stateMarkers.length
    ) {
      let mapArr = [...mapStateboxglMarker.current];

      mapArr.push(marker);
      mapStateboxglMarker.current = [...mapArr];
    }
  };

  return (
    <div className="relative">
      {mapRef.current &&
        mapMarkers &&
        mapMarkers.filter(marker => marker).map((marker, index) => {
          return (
            <CustomMarker
              key={index}
              allMarkers={mapMarkers}
              handleCustomAddMarkers={handleCustomAddMarkers}
              levelToggles={levelToggles}
              currentToggle={currentToggle}
              markersData={markers}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
              setDetailsItem={setDetailsItem}
              setDetailsPosition={setDetailsPosition}
              onClick={regionClicked}
              className={"marker1"}
              mapRef={mapRef}
              feature={marker}
            />
          );
        })}
      {mapRef.current &&
        stateMarkers &&
        currentRegion &&
        stateMarkers.filter(marker => marker).map((marker, index) => {
          return (
            <CustomMarker
              allMarkers={stateMarkers}
              key={index}
              currentLevel={currentLevel}
              handleCustomAddMarkers={handleCustomAddStateMarkers}
              levelToggles={levelToggles}
              currentToggle={currentToggle}
              markersData={stateData[currentRegion]}
              setCurrentLevel={setCurrentLevel}
              setDetailsItem={setDetailsItem}
              setDetailsPosition={setDetailsPosition}
              onClick={handleClick}
              className={"marker1"}
              mapRef={mapRef}
              feature={marker}
            />
          );
        })}
      {detailsItem && (
        <div
          className="bg-white shadow-xl pointer-events-none px-2 py-2"
          style={{
            position: "absolute",
            left: detailsPosition.left,
            top: detailsPosition.top,
            transform:
              currentLevel === "hcp"
                ? "translateY(-50%) transalteX(-40px)"
                : "translateY(-120%)",
            zIndex: 9999,
          }}
        >
          <DetailsComponent
            item={detailsItem}
            currentLevel={currentLevel}
            currentToggle={
              levelToggles && currentLevel && currentToggle
                ? levelToggles[currentLevel][currentToggle]
                : null
            }
          />
        </div>
      )}
      <div
        className="map-container relative w-full h-large"
        ref={mapContainerRef}
      />
    </div>
  );
};

export default Map;

const DetailsComponent = ({ item, currentLevel, currentToggle }) => {
  const [itemValue, setItemValue] = useState(null);
  useEffect(() => {
    if (item.length) {
      let totalValue = item.length;
      let val = 0;
      item.forEach((_item) => {
        val += _item.properties[currentToggle];
      });
      let totalCurrentToggles = val;

      setItemValue({
        totalValue,
        totalCurrentToggles,
      });
    }
  }, [item]);

  return currentLevel === "hcp" ? (
    <div className="flex max-h-[40vh] flex-wrap flex-col items-start">
      {item.length === 1 ? (
        item.map((_detail, index) => {
          return (
            <div key={index} className="text-sm max-w-[10rem]">
              <h4 className="text-xs">
                Name:{" "}
                <span className="font-bold">
                  {_detail.properties["Assigned Physician Name"]}
                </span>
              </h4>
              <h4 className="text-xs">
                Primary Specialty Description:{" "}
                <span className="font-bold">
                  {_detail.properties["Assigned Specialty"]}
                </span>
              </h4>
              <h4 className="text-xs">
                {selectLabels[currentToggle]}:{" "}
                <span className="font-bold">
                  {_detail.properties &&
                    currentToggle &&
                    _detail.properties[currentToggle].toLocaleString()}
                </span>
              </h4>
            </div>
          );
        })
      ) : itemValue ? (
        <div className="text-sm max-w-[10rem]">
          <h4 className="text-xs">
            Total: <span className="font-bold">{itemValue.totalValue}</span>
          </h4>
          <h4 className="text-xs">
            Total {selectLabels[currentToggle]}
            <span className="font-bold">: {itemValue.totalCurrentToggles}</span>
          </h4>
        </div>
      ) : null}
    </div>
  ) : (
    <div className="flex flex-col items-start">
      {currentLevel === "hcp" && (
        <h4>
          Name:{" "}
          <span className="font-bold">{item["Assigned Physician Name"]}</span>
        </h4>
      )}
      {currentLevel === "region" && (
        <h4 className="font-bold">{item["Region"]}</h4>
      )}
      {currentLevel === "state" && (
        <h4 className="font-bold">{item["State Name"]}</h4>
      )}
      {currentLevel === "hcp" && (
        <h4>
          Primary Specialty Description:{" "}
          <span className="font-bold">{item["Assigned Specialty"]}</span>
        </h4>
      )}
      <h4>
        {selectLabels[mapLabels[currentToggle]]}:{" "}
        <span className="font-bold">
          {item && currentToggle && item[currentToggle].toLocaleString()}
        </span>
      </h4>
    </div>
  );
};
