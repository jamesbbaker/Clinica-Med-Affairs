import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import geoJson from "./map-data.json";
import mapDataJson from "./data.json";
import Popup from "reactjs-popup";
import CustomMarker from "./Marker";
import Spiderfy from '@nazka/map-gl-js-spiderfy';

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
        "fill-color": "#000000",
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
      const feature = features[0];
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
    ["Number of High Steroid Usage Patients"]: "Total High Steroid Usage",
    ["Number of Severe Exacerbations"]: "Total Severe Exacerbations",
  },
  state: {
    ["Number of High Steroid Usage Patients"]: "Total High Steroid Usage",
    ["Number of Severe Exacerbations"]: "Total Severe Exacerbations",
  },
  hcp: {
    ["Number of High Steroid Usage Patients"]:
      "Number of High Steroid Usage Patients",
    ["Number of Severe Exacerbations"]: "Number of Severe Exacerbations",
  },
};

const Map = ({
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
  LayerFn = MapAddLayer,
  markersEnabled = true,
}) => {
  const [data, setData] = useState(mapDataJson);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [latitude, setLatitude] = useState(-90);
  const [longitude, setLongitude] = useState(40);

  const [zoom, setZoom] = useState(3.5);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [stateMapMarkers, setStateMapMarkers] = useState([]);
  const [popups, setPopups] = useState([]);
  const [detailsItem, setDetailsItem] = useState(null);
  const [regionData, setRegionData] = useState(null);
  const [stateMarkers, setStateMarkers] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null)
  const [detailsPosition, setDetailsPosition] = useState(null);
  const mapboxglMarker = useRef([]);
  const mapStateboxglMarker = useRef([]);
  const [layerAdded, setLayerAdded] = useState(false);
  const [modalDetails, setModalDetails] = useState(null);




  useEffect(() => {
    if (markers && stateData && layerAdded) {
      let _itemValues = [];
    Object.values(stateData).map((item) => {
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
      window.mapRemoveLayer()

      handleRegionMarkers(markers, "marker2");
      mapRef.current.setPaintProperty("countries", "fill-color", {
        property: "name",
        type: "categorical",
        stops: _itemValues,
      });
    }
  }, [markers,stateData, layerAdded]);

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
            console.log(layer)
            if (layer.id == "country-label" || layer.id == "settlement-label") {
              mapRef.current.removeLayer(layer.id);
            }
          });
        }

        var sources = mapRef.current.getStyle().sources;
        for (var sourceId in sources) {
          console.log(sourceId)
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
    popups.forEach((popup) => popup.remove());
    setPopups([]);
    if (markedStates) {
      handleStateLevelMarkers(markedStates, "marker1", "#f28cb1");
    }

    if (toggleId == "Number of High Steroid Usage Patients") {
      mapRef.current.setPaintProperty(
        "unclustered-point",
        "circle-color",
        "#11b4da"
      );
    } else {
      mapRef.current.setPaintProperty(
        "unclustered-point",
        "circle-color",
        "#f28cb1"
      );
    }
  };

  const closeModal = () => {
    setModalDetails(null);
  };

  const handleStateLevelMarkers = (
    data,
    markerClass,
    circleColor = "#f28cb1"
  ) => {
    const geojson = {
      type: "FeatureCollection",
      features: data.map((marker) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [marker.LONG, marker.LAT],
        },
        properties: { ...marker, size: marker[currentToggle] },
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
      8, // If size is 1, radius is 12,
      10,
      18,
      20,
      28,
      30,
      38,
      40,
      48,
    ]);
    const spiderfy = new Spiderfy(mapRef.current, {
      onLeafClick: f => console.log(f),
      minZoomLevel: 12,
      zoomIncrement: 2,
    });

    let hoverListener = (e) => {
      e.preventDefault();
      if (e.features && e.features.length > 0) {
        const stateFeature = e.features.find(
          (feature) => feature.layer.id === "countries"
        );

        if (!stateFeature) {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const item = e.features[0].properties;
          const pixel = mapRef.current.project(coordinates);
          setCurrentLevel("hcp");
          setDetailsPosition({ left: pixel.x, top: pixel.y });

          setDetailsItem(item);
        }
      }
    };

    const clickListener = (e) => {
      e.preventDefault();
      if (e.features && e.features.length > 0) {  
        const stateFeature = e.features.find(
          (feature) => feature.layer.id === "countries"
        );

        if (!stateFeature) {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const item = e.features[0].properties;
          const pixel = mapRef.current.project(coordinates);
          setCurrentLevel("hcp");
          setDetailsPosition({ left: pixel.x, top: pixel.y });
          setModalDetails(item);
        }
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
    setDetailsItem(null)
    stateClicked(feature, mapRef);
    mapStateboxglMarker.current.forEach((marker) => marker && marker.remove());
    mapStateboxglMarker.current=[]
  };

  const handleStateMarkers = (data, markerClass) => {
   
    setCurrentLevel("state");
    const newStateMarkers = data.map((feature) => {
      if (feature.Region != 0) {
        return feature;
      }
    });
    setStateMarkers(newStateMarkers);
     mapboxglMarker.current.forEach((marker) => marker && marker.remove());
    mapboxglMarker.current=[]
  };

  const handleRegionMarkers = (data, markerClass) => {
    const newMapMarkers = data.map((feature) => {
      if (feature.Region != 0) {
        return feature;
      }
    });
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
      const maxRadius = 100;
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

  // Initialize map when component mounts
  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      // maxZoom: 10,
      minZoom: 3.5,
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [latitude, longitude],
      zoom: zoom,
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
            "circle-color": "#11b4da",
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

    setCurrentRegion(feature.Region)
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
        mapMarkers.map((marker) => {
          if (!marker) {
            return;
          }
          return (
            <CustomMarker
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
        stateMarkers &&currentRegion &&
        stateMarkers.map((marker) => {
          if (!marker) {
            return;
          }
          return (
            <CustomMarker
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
          className="bg-white border shadow-xl border-[#000] px-2 py-2"
          style={{
            position: "absolute",
            left: detailsPosition.left,
            top: detailsPosition.top,
            transform: "translateY(-120%)",
            zIndex: 9999,
          }}
        >
          <DetailsComponent
            item={detailsItem}
            currentLevel={currentLevel}
            currentToggle={levelToggles && currentLevel && currentToggle ? levelToggles[currentLevel][currentToggle] : null}
          />
        </div>
      )}
      <div
        className="map-container relative w-full h-large"
        ref={mapContainerRef}
      />
      <Popup
        onClose={closeModal}
        modal
        open={modalDetails != null}
        position="center center"
      >
        <DetailsComponent
          item={modalDetails}
          currentLevel={currentLevel}
          currentToggle={levelToggles && currentLevel && currentToggle ? levelToggles[currentLevel][currentToggle] : null}
        />
      </Popup>
    </div>
  );
};

export default Map;

const DetailsComponent = ({ item, currentLevel, currentToggle }) => {
  return (
    <div className="flex flex-col items-start">
      {currentLevel == "hcp" && (
        <h4>
          Name:{" "}
          <span className="font-bold">
            {item["First Name"]} {item["Last Name"]}
          </span>
        </h4>
      )}
      {currentLevel == "region" && (
        <h4 className="font-bold">{item["Region"]}</h4>
      )}
      {currentLevel == "state" && (
        <h4 className="font-bold">{item["State Name"]}</h4>
      )}
      {currentLevel == "hcp" && (
        <h4>
          Primary Specialty Description:{" "}
          <span className="font-bold">
            {item["Primary Specialty Description"]}
          </span>
        </h4>
      )}
      <h4>
        {currentToggle}:{" "}
        <span className="font-bold">
          {item && currentToggle && item[currentToggle].toLocaleString()}
        </span>
      </h4>
    </div>
  );
};
