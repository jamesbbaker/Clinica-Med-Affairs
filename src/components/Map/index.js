import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import geoJson from "./map-data.json";
import geoJson2 from "./map-data-2.json";
import mapDataJson from "./data.json";

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

function MapAddLayer(
  map,
  data,
  markerClicked,
  loaded = false,
  removeOldLayer = false,
  layerId = "countries",
  _layerAdded,
  markersAdd = false
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

    map.setPaintProperty(layerId, "fill-color", {
      property: defaultActive.property,
      stops: defaultActive.stops,
    });

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

const Map = ({
  stateData,
  currentToggle,
  mapStateData,
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
  const [detailsPosition, setDetailsPosition] = useState(null);


  useEffect(() => {
    if (markers && stateData) {
      handleRegionMarkers(markers, "marker2");
    }
  }, [markers, stateData]);

  useEffect(() => {
    if (markedStates) {
  
      handleStateLevelMarkers(markedStates, "marker1");
    }
  }, [markedStates]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.on("load", () => {
        mapRef.current.on("click", "countries", (e) => {
         
          stateClicked(e, mapRef);
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
            "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
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
            "circle-radius": 8,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
          },
        });
      });

      window.mapRemoveLayer = () => {
        if (
          mapRef.current &&
          mapRef.current.getStyle() &&
          mapRef.current.getStyle().layers
        ) {
          mapRef.current.getStyle().layers.forEach(function (layer) {
            if (
              layer.id == "country-fills-hover" ||
              layer.id == "countries" ||
              layer.id == "markers"
            ) {
              // Keep the background layer if needed
              mapRef.current.removeLayer(layer.id);
            }
          });
        }

        var sources = mapRef.current.getStyle().sources;
        for (var sourceId in sources) {
          if (sourceId == "countries") {
            mapRef.current.removeSource(sourceId);
          }
        }
      };
    }
  }, [mapRef.current]);

  useEffect(() => {
    if (mapStateData) {
      window.mapRemoveLayer();
      LayerFn(mapRef.current, mapStateData, true, true, true, `countries`);
    }
  }, [mapStateData]);

  useEffect(() => {
    if (currentToggle && mapRef.current) {
      // mapRef.current.off("click", "unclustered-point");
      // mapRef.current.off("mouseenter", "unclustered-point");
      // mapRef.current.off("mouseleave", "unclustered-point");
      handleToggleData(currentToggle);
    }
  }, [currentToggle]);

  const handleToggleData = (toggleId) => {
    popups.forEach((popup) => popup.remove());
    setPopups([]);

    // let clickListener = (e) => {
    //   e.preventDefault();
    //   const coordinates = e.features[0].geometry.coordinates.slice();
    //   const item = e.features[0].properties;

    //   let _popup = new mapboxgl.Popup()
    //     .setLngLat(coordinates)
    //     .setHTML(
    //       `<div className"flex flex-col items-center">
    //         <h4>Name: ${item["First Name"]} ${item["Last Name"]}</h4>
    //         <h4>${toggleId}: ${item[toggleId]}</h4>
    //       </div>`
    //     )
    //     .addTo(mapRef.current);
    //   setPopups((prev) => [...prev, _popup]);
    // };

    // let hoverOutListener = () => {
    //   mapRef.current.getCanvas().style.cursor = "pointer";
    // };
    // // mapRef.current.on("click", "unclustered-point", clickListener);
    // mapRef.current.on("mouseenter", "unclustered-point", clickListener);
    // mapRef.current.on("mouseleave", "unclustered-point", hoverOutListener);

    if (toggleId == "Number of High Steroid Usage Patients") {
      mapRef.current.setPaintProperty(
        "unclustered-point",
        "circle-color",
        "#11b4da"
      ); // Change marker color to red
      mapRef.current.setPaintProperty("unclustered-point", "circle-radius", 8); // Change marker radius to 12 pixels
    } else {
      mapRef.current.setPaintProperty(
        "unclustered-point",
        "circle-color",
        "#f28cb1"
      ); // Change marker color to red
      mapRef.current.setPaintProperty("unclustered-point", "circle-radius", 12); // Change marker radius to 12 pixels
    }
  };

  const handleStateLevelMarkers = (data, markerClass) => {
    mapRef.current.off("click", "unclustered-point");
    mapRef.current.off("mouseenter", "unclustered-point");
    mapRef.current.off("mouseleave", "unclustered-point");
    stateMapMarkers.forEach((marker) => marker.remove());
    setStateMapMarkers([]);
    const geojson = {
      type: "FeatureCollection",
      features: data.map((marker) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [marker.LONG, marker.LAT],
        },
        properties: { ...marker }, // You can add additional properties if needed
      })),
    };

    mapRef.current.getSource("markers").setData(geojson);
    let _popup = null

    // Add event listeners for marker clicks and hover
    let clickListener = (e) => {
      e.preventDefault();
      if (e.features && e.features.length > 0) {
        const stateFeature = e.features.find(
          (feature) => feature.layer.id === "countries"
        );

        if (!stateFeature) {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const item = e.features[0].properties;
          const pixel = mapRef.current.project(coordinates);
          setDetailsPosition({ left: pixel.x, top: pixel.y });

          setDetailsItem(item);

          // _popup = new mapboxgl.Popup()
          //   .setLngLat(coordinates)
          //   .setHTML(
          //     `<div className"flex flex-col items-center">  
          //   <h4>Name: ${item["First Name"]} ${item["Last Name"]}</h4>
          //   <h4>Primary Specialty Description: ${item["Primary Specialty Description"]}</h4>
          //   <h4>${currentToggle}: ${item[currentToggle]}</h4>
          // </div>`
          //   )
          //   .addTo(mapRef.current);
          // setPopups((prev) => [...prev, _popup]);
        }
      }
    };

    let hoverOutListener = () => {
      // _popup.remove()
      setDetailsItem(null);
    };

    // mapRef.current.on("click", "unclustered-point", clickListener);
    mapRef.current.on("mouseenter", "unclustered-point", clickListener);
    mapRef.current.on("mouseleave", "unclustered-point", hoverOutListener);
  };

  const handleRegionMarkers = (data, markerClass) => {
    const newMapMarkers = data.map((feature) => {
      let coordinates = [feature.LONG, feature.LAT];
      if (feature.Region != 0) {
        const ref = React.createRef();
        ref.current = document.createElement("div");
        createRoot(ref.current).render(
          <Marker
            markerClass={markerClass}
            onClick={regionClicked}
            feature={feature}
            coordinates={feature}
          />
        );
        const marker = new mapboxgl.Marker(ref.current)
          .setLngLat(coordinates)
          .addTo(mapRef.current);

        return marker;
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

  const Marker = ({ markerClass = "marker1", onClick, children, feature }) => {
    const _onClick = () => {
      onClick(feature);
    };
    return (
      <button onClick={_onClick} className={`${markerClass} animate-fade-in`}>
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
    // mapRef.current.on("load", () => {
    //   LayerFn(mapRef.current, data, true, true, true, `countries`, true);
    // })
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

  const regionClicked = (feature) => {
    if (  mapRef.current.getSource("markers")) { 
      mapRef.current.getSource("markers").setData({});
    }
  
    let coordinates = [feature.LONG, feature.LAT];

    mapRef.current.flyTo({
      center: coordinates,
      zoom: 4,
      essential: true,
    });
    markerClickedFn(feature);
  };
  return (
    <div className="relative">
       {detailsItem && (
      <div
      className="bg-white px-2 py-2"
        style={{
          position: 'absolute',
          left: detailsPosition.left,
          top: detailsPosition.top,
          zIndex: 9999, // Ensure details appear above the map
        }}
      >
        <DetailsComponent item={detailsItem} currentToggle={currentToggle} />
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


const DetailsComponent = ({ item, currentToggle }) => {
  return (
    <div className="flex flex-col items-start">
      <h4>Name: <span className="font-bold">{item["First Name"]} {item["Last Name"]}</span></h4>
      <h4>Primary Specialty Description: <span className="font-bold">{item["Primary Specialty Description"]}</span></h4>
      <h4>{currentToggle}: <span className="font-bold">{item[currentToggle]}</span></h4>
    </div>
  );
};

