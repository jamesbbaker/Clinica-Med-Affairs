import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useContext,
} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import countryGeoJSON from "../../../../components/Map/data.json"; // Load your country GeoJSON
import CustomDropdown from "../../../../components/CustomDropdown";
import {
  invertedMapLabels,
  selectLabels,
} from "../../../../constants/appConstants";
import { MultiSelect } from "react-multi-select-component";
import Table, { CustomOptionRenderer } from "../../../../components/Table";
import { IoArrowBackCircle } from "react-icons/io5";
import { filterOutLabels } from "../../../../utils/MapUtils";
import { AuthContext } from "../../../../context/AuthContext";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2xpbmljYS1haSIsImEiOiJjbHU3eXE2bXUwYWNlMmpvM3Nsd2ZiZDA3In0.BxJb0GE9oDVg2umCg6QBSw";

const generateRegionsGeoJSON = (
  regionsData,
  stateData,
  countryGeoJSON,
  region,
  period1,
  period2,
  unmetNeed
) => {
  const regionsGeoJSON = {
    type: "FeatureCollection",
    features: [],
  };

  let regionValues = {};

  region.data.forEach((item) => {
    if (regionValues.hasOwnProperty(item.Region)) {
      regionValues[item.Region].push(item);
    } else {
      regionValues[item.Region] = [item];
    }
  });

  Object.keys(regionsData).forEach((regionName, index) => {
    const countriesInRegion = regionsData[regionName];
    const regionFeatures = countryGeoJSON.features.filter((feature) =>
      countriesInRegion.includes(feature.properties.name)
    );
    // Adjust coordinates structure if necessary
    const coordinates = regionFeatures
      .map((feature) => {
        if (feature.geometry.type === "Polygon") {
          return [feature.geometry.coordinates];
        } else if (feature.geometry.type === "MultiPolygon") {
          return feature.geometry.coordinates;
        } else {
          return [];
        }
      })
      .flat();

    const combinedGeometry = {
      type: "MultiPolygon",
      coordinates: coordinates,
    };
    let _period2 = regionValues[regionName].filter(
      (item) => item.Quarter === period2
    )[0][invertedMapLabels[unmetNeed]];
    let _period1 = regionValues[regionName].filter(
      (item) => item.Quarter === period1
    )[0][invertedMapLabels[unmetNeed]];
    let percentageChange = (_period2 - _period1) / _period1;

    regionsGeoJSON.features.push({
      type: "Feature",
      id: index + 1,
      geometry: combinedGeometry,
      properties: {
        name: regionName,
        item: regionValues,
        stateValue: percentageChange,
        color: `hsl(${index * 60}, 70%, 50%)`,
      },
    });
  });

  return regionsGeoJSON;
};

const filterOptions = [...Object.keys(selectLabels)];

const quartersWithDates = [
  { quarter: "Q1-2016", date: "2016-01-01" },
  { quarter: "Q2-2016", date: "2016-04-01" },
  { quarter: "Q3-2016", date: "2016-07-01" },
  { quarter: "Q4-2016", date: "2016-10-01" },
  { quarter: "Q1-2017", date: "2017-01-01" },
  { quarter: "Q2-2017", date: "2017-04-01" },
  { quarter: "Q3-2017", date: "2017-07-01" },
  { quarter: "Q4-2017", date: "2017-10-01" },
  { quarter: "Q1-2018", date: "2018-01-01" },
  { quarter: "Q2-2018", date: "2018-04-01" },
  { quarter: "Q3-2018", date: "2018-07-01" },
  { quarter: "Q4-2018", date: "2018-10-01" },
  { quarter: "Q1-2019", date: "2019-01-01" },
  { quarter: "Q2-2019", date: "2019-04-01" },
  { quarter: "Q3-2019", date: "2019-07-01" },
  { quarter: "Q4-2019", date: "2019-10-01" },
  { quarter: "Q1-2020", date: "2020-01-01" },
  { quarter: "Q2-2020", date: "2020-04-01" },
  { quarter: "Q3-2020", date: "2020-07-01" },
  { quarter: "Q4-2020", date: "2020-10-01" },
  { quarter: "Q1-2021", date: "2021-01-01" },
  { quarter: "Q2-2021", date: "2021-04-01" },
  { quarter: "Q3-2021", date: "2021-07-01" },
  { quarter: "Q4-2021", date: "2021-10-01" },
  { quarter: "Q1-2022", date: "2022-01-01" },
  { quarter: "Q2-2022", date: "2022-04-01" },
  { quarter: "Q3-2022", date: "2022-07-01" },
  { quarter: "Q4-2022", date: "2022-10-01" },
  { quarter: "Q1-2023", date: "2023-01-01" },
  { quarter: "Q2-2023", date: "2023-04-01" },
  { quarter: "Q3-2023", date: "2023-07-01" },
  { quarter: "Q4-2023", date: "2023-10-01" },
  // { quarter: "Q1-2024", date: "2024-01-01" },
  // { quarter: "Q2-2024", date: "2024-04-01" },
  // { quarter: "Q3-2024", date: "2024-07-01" },
  // { quarter: "Q4-2024", date: "2024-10-01" },
];

const ImpactMap = ({
  regionDataCoordinates,
  stateCoordinates,
  handleReset,
  regionData,
  stateData,
}) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [unmetNeed, setUnmetNeed] = useState(filterOptions[0]);
  const [tableUnmetNeed, setTableUnmetNeed] = useState([
    { label: filterOptions[0], value: filterOptions[0] },
  ]);
  const { selectedUnmet } = useContext(AuthContext);
  const [period1, setPeriod1] = useState("2023-07-01");
  const [period2, setPeriod2] = useState("2023-10-01");
  const [tablePeriod1, setTablePeriod1] = useState("2023-07-01");
  const [tablePerioid2, setTablePeriod2] = useState("2023-10-01");
  const [tableData, setTableData] = useState(null);
  const [region, setRegion] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const mapref = useRef(null);
  const [update, setUpdate] = useState(false);

  const handleSelect = (val) => {
    setUnmetNeed(val);
  };

  useEffect(() => {
    if (selectedUnmet && selectedUnmet.length> 0) {
      setUnmetNeed(selectedUnmet[0].value)
    }
  },[selectedUnmet])

  const handlePeriod = (val, type) => {
    if (type === "period1") {
      setPeriod1(val);
    } else {
      setPeriod2(val);
    }
  };

  const generateStateJSON = useCallback(
    (
      countryGeoJSON,
      unmetNeed,
      stateData
    ) => {
      if (!countryGeoJSON || !unmetNeed || !stateData) {
        return;
      }
      let stateByName = {};
      stateData.data.forEach((item) => {
        if (stateByName[item["State Name"]]) {
          stateByName[item["State Name"]].push(item);
        } else {
          stateByName[item["State Name"]] = [];
          stateByName[item["State Name"]].push(item);
        }
      });
      let newFeatures = countryGeoJSON.features
        .filter((item) => stateByName.hasOwnProperty(item.properties.name))
        .map((item) => {
          let _state = stateByName[item.properties.name];
          let _peroid1 = _state.filter((_item) => _item.Quarter === period1)[0][
            invertedMapLabels[unmetNeed]
          ];
          let _peroid2 = _state.filter((_item) => _item.Quarter === period2)[0][
            invertedMapLabels[unmetNeed]
          ];
          let percentageChange = (_peroid2 - _peroid1) / _peroid1;
          return {
            ...item,
            properties: { ...item.properties, stateValue: percentageChange },
          };
        });
      let newGeoJson = { type: "FeatureCollection", features: newFeatures };
      return newGeoJson;
    },
    [period1, period2]
  );

  const generatePercentageChange = (hoverInfo) => {
    if (hoverInfo.stateFeatures) {
      let _period2 = hoverInfo.stateFeatures.filter(
        (item) => item.Quarter === period2
      )[0][invertedMapLabels[unmetNeed]];
      let _period1 = hoverInfo.stateFeatures.filter(
        (item) => item.Quarter === period1
      )[0][invertedMapLabels[unmetNeed]];
      let percentageChange = (_period2 - _period1) / _period1;
      return [{ percentageChange, item: selectLabels[unmetNeed] }];
    }

    let period1Values = {};
    let period2Values = {};
    let regionName = hoverInfo.name;
    hoverInfo.item[regionName].forEach((item) => {
      if (item.Quarter === period1) {
        period1Values[regionName] = item;
      }
      if (item.Quarter === period2) {
        period2Values[regionName] = item;
      }
    });

    let _period2 = period2Values[regionName][invertedMapLabels[unmetNeed]];
    let _period1 = period1Values[regionName][invertedMapLabels[unmetNeed]];
    let percentageChange = (_period2 - _period1) / _period1;
    return [{ percentageChange, item: selectLabels[unmetNeed] }];
  };

  const getMinValue = useCallback((updatedRegionsGeoJSON) => {
    let minValue = 0;
    updatedRegionsGeoJSON.features.forEach((item) => {
      if (item.properties.stateValue < minValue) {
        minValue = item.properties.stateValue;
      }
    });
    return minValue;
  }, []);

  const getMaxValue = useCallback((updatedRegionsGeoJSON) => {
    let maxValue = 0;
    updatedRegionsGeoJSON.features.forEach((item) => {
      if (item.properties.stateValue > maxValue) {
        maxValue = item.properties.stateValue;
      }
    });
    return maxValue;
  }, []);

  useEffect(() => {
    if (
      stateData &&
      regionData &&
      countryGeoJSON &&
      regionDataCoordinates &&
      stateCoordinates
    ) {
      let regionsData = {};
      stateData.data.forEach((item) => {
        if (!item.Region) {
          return;
        }
        if (regionsData.hasOwnProperty(item.Region)) {
          regionsData[item.Region].push(item["State Name"]);
        } else {
          regionsData[item.Region] = [item["State Name"]];
        }
      });
      const updatedRegionsGeoJSON = generateRegionsGeoJSON(
        regionsData,
        stateData,
        countryGeoJSON,
        regionData,
        period1,
        period2,
        unmetNeed
      );
      if (map && map.getSource("regions")) {
        const regionLabelsGeoJSON = {
          type: "FeatureCollection",
          features: updatedRegionsGeoJSON.features.map((feature) => {
            const center = regionDataCoordinates[feature.properties.name];
            return {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: center,
              },
              properties: {
                value: `${(feature.properties.stateValue * 100).toFixed(1)}%`,
              },
            };
          }),
        };
        map.getSource("region-labels").setData(regionLabelsGeoJSON);
        map.getSource("regions").setData(updatedRegionsGeoJSON);

        let minVal = getMinValue(updatedRegionsGeoJSON);
        let maxVal = getMaxValue(updatedRegionsGeoJSON);
        let midValue = (maxVal - Math.abs(minVal)) / 2;

        map.setPaintProperty("regions-layer", "fill-color", [
          "interpolate",
          ["linear"],
          ["get", "stateValue"],
          minVal,
          "green", // Example: stateValue -1 maps to green
          midValue,
          "white", // Example: stateValue 0 maps to yellow
          maxVal,
          "red", // Example: stateValue 1 maps to red
        ]);
      }
      if (region) {
        const countriesInRegion = region.countriesInRegion;

        // Filter countryGeoJSON to include only countries in the clicked region
        const filteredCountries = countryGeoJSON.features.filter((feature) =>
          countriesInRegion.includes(feature.properties.name)
        );
        const generateJSON = generateStateJSON(
          {
            type: "FeatureCollection",
            features: filteredCountries,
          },

          unmetNeed,
          stateData
        );
        if (map && map.getSource("countries")) {
          const countryLabelsGeoJSON = {
            type: "FeatureCollection",
            features: generateJSON.features.map((feature) => {
              const center = stateCoordinates[feature.properties.name];
              return {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: center,
                },
                properties: {
                  value: `${(feature.properties.stateValue * 100).toFixed(1)}%`,
                },
              };
            }),
          };
          map.getSource("country-labels").setData(countryLabelsGeoJSON);
          map.getSource("countries").setData(generateJSON);

          let minVal = getMinValue(generateJSON);
          let maxVal = getMaxValue(generateJSON);
          let midValue = (maxVal - Math.abs(minVal)) / 2;
          map.setPaintProperty("countries-layer", "fill-color", [
            "interpolate",
            ["linear"],
            ["get", "stateValue"],
            minVal,
            "green", // Example: stateValue -1 maps to green
            midValue,
            "white", // Example: stateValue 0 maps to yellow
            maxVal,
            "red", // Example: stateValue 1 maps to red
          ]);
        }
      }
    }
  }, [
    period1,
    update,
    period2,
    unmetNeed,
    stateData,
    regionData,
    regionDataCoordinates,
    stateCoordinates,
    map,
    region,
    generateStateJSON,
    getMinValue,
    getMaxValue,
  ]);

  const generatTableData = useCallback(
    (data, tableKey) => {
      let filteredData = data.filter(
        (item) =>
          item.Quarter === tablePeriod1 || item.Quarter === tablePerioid2
      );
      let _period2 = filteredData.filter(
        (item) => item.Quarter === tablePerioid2
      );
      let _period1 = filteredData.filter(
        (item) => item.Quarter === tablePeriod1
      );

      let newArr = [];
      _period2.forEach((item) => {
        let obj = {};
        let _region = item[tableKey];
        Object.values(invertedMapLabels).forEach((label) => {
          let _peroid1Selected = _period1.filter(
            (__item) => __item[tableKey] === _region
          )[0];
          let calculatedValue =
            (item[label] - _peroid1Selected[label]) / _peroid1Selected[label];
          obj[label] = calculatedValue.toFixed(2);
        });
        obj[tableKey] = _region;
        newArr.push(obj);
      });
      return newArr;
    },
    [tablePeriod1, tablePerioid2]
  );

  useEffect(() => {
    if (tablePeriod1 && tablePerioid2 && regionData && stateData) {
      if (selectedRegion) {
        let _stateData = stateData.data.filter(
          (item) => item.Region === selectedRegion
        );
        let tableData = generatTableData(_stateData, "State Name");
        setTableData(tableData);
      } else {
        let filteredData = regionData.data.filter(
          (item) =>
            item.Quarter === tablePeriod1 || item.Quarter === tablePerioid2
        );
        let _period2 = filteredData.filter(
          (item) => item.Quarter === tablePerioid2
        );
        let _period1 = filteredData.filter(
          (item) => item.Quarter === tablePeriod1
        );

        let newArr = [];
        _period2.forEach((item) => {
          let obj = {};
          let _region = item.Region;
          Object.values(invertedMapLabels).forEach((label) => {
            let _peroid1Selected = _period1.filter(
              (__item) => __item.Region === _region
            )[0];
            let calculatedValue =
              (item[label] - _peroid1Selected[label]) / _peroid1Selected[label];
            obj[label] = calculatedValue.toFixed(2);
          });
          obj.Region = _region;
          newArr.push(obj);
        });

        setTableData(newArr);
      }
    }
  }, [
    generatTableData,
    regionData,
    selectedRegion,
    stateData,
    tablePeriod1,
    tablePerioid2,
  ]);

  useEffect(() => {
    const initializeMap = (region, stateData, period1, period2, unmetNeed) => {
      let regionsData = {};
      stateData.data.forEach((item) => {
        if (!item.Region) {
          return;
        }
        if (regionsData.hasOwnProperty(item.Region)) {
          regionsData[item.Region].push(item["State Name"]);
        } else {
          regionsData[item.Region] = [item["State Name"]];
        }
      });
      const regionsGeoJSON = generateRegionsGeoJSON(
        regionsData,
        stateData,
        countryGeoJSON,
        region,
        period1,
        period2,
        unmetNeed
      );

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v9",
        center: [-98, 40],
        minZoom: 3.5,
        zoom: 4.1,
      });

      map.on("load", () => {
        mapref.current = map;
        // Add regions layer
        map.addSource("regions", {
          type: "geojson",
          data: regionsGeoJSON,
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

        let minVal = getMinValue(regionsGeoJSON);
        let maxVal = getMaxValue(regionsGeoJSON);
        let midValue = (maxVal - Math.abs(minVal)) / 2;

        map.addLayer(
          {
            id: "regions-layer",
            type: "fill",
            source: "regions",
            paint: {
              "fill-color": [
                "interpolate",
                ["linear"],
                ["get", "stateValue"],
                minVal,
                "green", // Example: stateValue -1 maps to green
                midValue,
                "white", // Example: stateValue 0 maps to yellow
                maxVal,
                "red", // Example: stateValue 1 maps to red
              ],
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                1, // Opacity when hovered
                0.7, // Default opacity
              ],
            },
          },
          firstSymbolId
        );

        const generateJSON = generateStateJSON(
          countryGeoJSON,

          unmetNeed,
          stateData
        );

        const regionLabelsGeoJSON = {
          type: "FeatureCollection",
          features: regionsGeoJSON.features.map((feature) => {
            const center = regionDataCoordinates[feature.properties.name];
            return {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: center,
              },
              properties: {
                value: `${(feature.properties.stateValue * 100).toFixed(1)}%`,
              },
            };
          }),
        };

        map.addSource("region-labels", {
          type: "geojson",
          data: regionLabelsGeoJSON,
        });

        map.addLayer({
          id: "region-labels-layer",
          type: "symbol",
          source: "region-labels",
          layout: {
            "text-field": ["get", "value"],
            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
            "text-size": 14,
            "text-anchor": "center", // Center the text over the centroid
            "text-offset": [0, 0],
          },
          paint: {
            "text-color": "#000",
          },
        });

        // Add countries layer
        map.addSource("countries", {
          type: "geojson",
          data: generateJSON,
        });

        let minValCountry = getMinValue(generateJSON);
        let maxValCountry = getMaxValue(generateJSON);
        let midValueCountry = (maxVal - Math.abs(minVal)) / 2;

        map.addLayer({
          id: "countries-layer",
          type: "fill",
          source: "countries",
          paint: {
            "fill-color": [
              "interpolate",
              ["linear"],
              ["get", "stateValue"],
              minValCountry,
              "green",
              midValueCountry,
              "white",
              maxValCountry,
              "red",
            ],
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              0.4, // Opacity when hovered
              0.4, // Default opacity
            ],
          },
          layout: {
            visibility: "none", // Initially hide the countries layer
          },
        });

        map.addLayer({
          id: "countries-outline",
          type: "line",
          source: "countries",
          paint: {
            "line-color": "#000",
            "line-width": 1,
          },
          layout: {
            visibility: "none", // Initially hide the countries outline layer
          },
        });

        // Calculate centroids and create labels data for countries
        const countryLabelsGeoJSON = {
          type: "FeatureCollection",
          features: generateJSON.features.map((feature) => {
            const center = stateCoordinates[feature.properties.name];
            return {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: center,
              },
              properties: {
                value: `${(feature.properties.stateValue * 100).toFixed(1)}%`,
              },
            };
          }),
        };

        map.addSource("country-labels", {
          type: "geojson",
          data: countryLabelsGeoJSON,
        });

        map.addLayer({
          id: "country-labels-layer",
          type: "symbol",
          source: "country-labels",
          layout: {
            "text-field": ["get", "value"],
            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
            "text-size": 15,
            "text-anchor": "center", // Center the text over the centroid
            "text-offset": [0, 0], // Ensure no offset
            visibility: "none",
          },
          paint: {
            "text-color": "#000",
          },
        });

        let hoveredStateId = null;

        // Highlight region on hover
        map.on("mousemove", "regions-layer", (e) => {
          map.getCanvas().style.cursor = "pointer";
          if (hoveredStateId) {
            map.setFeatureState(
              { source: "regions", id: hoveredStateId },
              { hover: false }
            );
          }
          hoveredStateId = e.features[0].id;
          map.setFeatureState(
            { source: "regions", id: hoveredStateId },
            { hover: true }
          );

          const region = e.features[0];
          const item = e.features[0].properties.item;
          map.setFeatureState(
            { source: "regions", id: region.id },
            { hover: true }
          );
          const coordinates = e.features[0].geometry.coordinates.slice();
          const bounds = new mapboxgl.LngLatBounds();
          if (!bounds) {
            return;
          }

          coordinates.forEach((polygon) => {
            polygon.forEach((ring) => {
              ring.forEach((coord) => {
                bounds.extend(coord);
              });
            });
          });

          const center = bounds.getCenter();

          const pixel = map.project(center);

          setHoverInfo((prev) => {
            if (prev && prev.name === region.properties.name) {
              return prev;
            } else {
              return {
                item: JSON.parse(item),
                lngLat: e.lngLat,
                left: pixel.x,
                top: pixel.y,
                name: region.properties.name,
              };
            }
          });
        });

        map.on("mouseleave", "regions-layer", () => {
          if (hoveredStateId) {
            map.setFeatureState(
              { source: "regions", id: hoveredStateId },
              { hover: false }
            );
          }
          hoveredStateId = null;
          map.getCanvas().style.cursor = "";
          setHoverInfo(null);
        });

        // Click region to show countries
        map.on("click", "regions-layer", (e) => {
          setUpdate((prev) => !prev);
          const regionName = e.features[0].properties.name;
          const countriesInRegion = regionsData[regionName];
          setRegion({
            regionName,
            countriesInRegion,
          });

          // Filter countryGeoJSON to include only countries in the clicked region
          const filteredCountries = countryGeoJSON.features.filter((feature) =>
            countriesInRegion.includes(feature.properties.name)
          );

          const filteredCountriesGeoJSON = generateStateJSON(
            {
              type: "FeatureCollection",
              features: filteredCountries,
            },

            unmetNeed,
            stateData
          );

          map.getSource("countries").setData(filteredCountriesGeoJSON);

          const countryLabelsGeoJSON = {
            type: "FeatureCollection",
            features: filteredCountriesGeoJSON.features.map((feature) => {
              const center = stateCoordinates[feature.properties.name];
              return {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: center,
                },
                properties: {
                  value: `${(feature.properties.stateValue * 100).toFixed(1)}%`,
                },
              };
            }),
          };
          map.getSource("country-labels").setData(countryLabelsGeoJSON);
          map.setLayoutProperty("countries-layer", "visibility", "visible");
          map.setLayoutProperty("countries-outline", "visibility", "visible");
          map.setLayoutProperty("region-labels-layer", "visibility", "none");
          map.setLayoutProperty(
            "country-labels-layer",
            "visibility",
            "visible"
          );

          const bounds = new mapboxgl.LngLatBounds();

          if (!bounds) {
            return;
          }
          filteredCountries.forEach((feature) => {
            if (feature.geometry.type === "Polygon") {
              feature.geometry.coordinates.forEach((ring) => {
                ring.forEach((coord) => {
                  if (
                    Array.isArray(coord) &&
                    coord.length === 2 &&
                    !isNaN(coord[0]) &&
                    !isNaN(coord[1])
                  ) {
                    bounds.extend(coord);
                  }
                });
              });
            } else if (feature.geometry.type === "MultiPolygon") {
              feature.geometry.coordinates.forEach((polygon) => {
                polygon.forEach((ring) => {
                  ring.forEach((coord) => {
                    if (
                      Array.isArray(coord) &&
                      coord.length === 2 &&
                      !isNaN(coord[0]) &&
                      !isNaN(coord[1])
                    ) {
                      bounds.extend(coord);
                    }
                  });
                });
              });
            }
          });

          if (bounds.isEmpty()) {
            console.error("Bounds are not valid");
            return;
          }

          map.fitBounds(bounds, { padding: 0, maxZoom: 5 });

          // // Optionally, center the map if not centered correctly
          // map.setCenter(bounds.getCenter());
        });

        // Hover info for countries
        let hoveredCountryId = null;
        map.on("mousemove", "countries-layer", (e) => {
          if (e.features.length > 0) {
            if (hoveredCountryId) {
              map.setFeatureState(
                { source: "countries", id: hoveredCountryId },
                { hover: false }
              );
            }
            hoveredCountryId = e.features[0].id;
            map.setFeatureState(
              { source: "countries", id: hoveredCountryId },
              { hover: true }
            );

            let stateFeatures = stateData.data.filter(
              (item) => item["State Name"] === e.features[0].properties.name
            );

            const coordinates = e.lngLat;

            const pixel = map.project(coordinates);

            setHoverInfo({
              lngLat: e.lngLat,
              name: e.features[0].properties.name,
              stateFeatures,
              left: pixel.x,
              top: pixel.y,
            });
          }
        });

        map.on("mouseleave", "countries-layer", () => {
          if (hoveredCountryId) {
            map.setFeatureState(
              { source: "countries", id: hoveredCountryId },
              { hover: false }
            );
          }
          hoveredCountryId = null;
          setHoverInfo(null);
        });

        setMap(map);
      });
    };

    if (
      !map &&
      regionData &&
      regionData.data &&
      stateData &&
      regionDataCoordinates &&
      stateCoordinates
    ) {
      let filteredData = regionData.data.filter(
        (item) =>
          item.Quarter === tablePeriod1 || item.Quarter === tablePerioid2
      );
      let _period2 = filteredData.filter(
        (item) => item.Quarter === tablePerioid2
      );
      let _period1 = filteredData.filter(
        (item) => item.Quarter === tablePeriod1
      );

      let newArr = [];
      _period2.forEach((item) => {
        let obj = {};
        let _region = item.Region;
        Object.values(invertedMapLabels).forEach((label) => {
          let _peroid1Selected = _period1.filter(
            (__item) => __item.Region === _region
          )[0];
          let calculatedValue =
            (item[label] - _peroid1Selected[label]) / _peroid1Selected[label];
          obj[label] = calculatedValue.toFixed(2);
        });
        obj.Region = _region;
        newArr.push(obj);
      });

      setTableData(newArr);
      initializeMap(regionData, stateData, period1, period2, unmetNeed);
    }

    // return () => map && map.remove();
  }, [
    map,
    regionData,
    stateData,
    regionDataCoordinates,
    stateCoordinates,
    generateStateJSON,
    period1,
    period2,
    unmetNeed,
    tablePeriod1,
    tablePerioid2,
    getMinValue,
    getMaxValue,
  ]);

  const handleCellClick = (row) => {
    let regionName = row.original.Region;
    setSelectedRegion(regionName);
    let _stateData = stateData.data.filter(
      (item) => item.Region === regionName
    );
    let tableData = generatTableData(_stateData, "State Name");
    setTableData(tableData);
  };

  const handleSelectMultipleUnmet = (val) => {
    setTableUnmetNeed(val);
  };

  const handleTablePeriod = (val, type) => {
    if (type === "period1") {
      setTablePeriod1(val);
    } else {
      setTablePeriod2(val);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-start gap-4">
        <div className="flex my-4 items-center gap-4">
          <CustomDropdown
            showColors
          buttonWidth="40rem"
            labelClassName="mb-0"
            className={"flex w-[40rem] mb-4 items-center gap-2"}
            input={{
              label: "Select Unmet Need",
              name: "Select Unmet Need",
              type: "select",
              options: filterOutLabels(filterOptions, selectedUnmet).map(
                (item) => ({
                  name: selectLabels[item] ? selectLabels[item] : item,
                  value: item,
                })
              ),
              id: "xLabel",
            }}
            value={unmetNeed}
            handleSelect={(val) => handleSelect(val)}
          />
        </div>
        <div className="flex items-center w-full gap-2">
          <CustomDropdown
            showImpactColors
            labelClassName="mb-0"
            className={"flex mb-4 items-center gap-2"}
            input={{
              label: "Period 1",
              name: "Period 1",
              type: "select",
              options: quartersWithDates.map((item) => ({
                name: item.quarter,
                value: item.date,
              })),
              id: "xLabel",
            }}
            value={period1}
            handleSelect={(val) => handlePeriod(val, "period1")}
          />
          <CustomDropdown
            showImpactColors
            labelClassName="mb-0"
            className={"flex mb-4 items-center gap-2"}
            input={{
              label: "Period 2",
              name: "Period 2",
              type: "select",
              options: quartersWithDates.map((item) => ({
                name: item.quarter,
                value: item.date,
              })),
              id: "xLabel",
            }}
            value={period2}
            handleSelect={(val) => handlePeriod(val, "period2")}
          />
        </div>
      </div>
      <div style={{ position: "relative" }}>
        {hoverInfo && (
          <div
            style={{
              position: "absolute",
              left: hoverInfo.left,
              top: hoverInfo.top,
              zIndex: 11111,
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "3px",
              pointerEvents: "none",
            }}
          >
            <div className="flex font-[600] flex-col items-start">
              <div>{hoverInfo.name}</div>
              {generatePercentageChange(hoverInfo).map((item, index) => {
                return (
                  <div key={index} className="flex items-center gap-2">
                    <div className="font-[600]">{item.item}: </div>
                    <div className="font-[400]">{`${(
                      item.percentageChange * 100
                    ).toFixed(1)}%`}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {region !== null && <button
          onClick={handleReset}
          className="flex mr-auto py-4 items-center gap-1"
        >
          <IoArrowBackCircle size={30} />
        </button>}
        <div ref={mapContainerRef} style={{ width: "100%", height: "70vh" }} />
        {tableData && false && (
          <div className="flex mt-8 flex-col items-start">
            <div className="flex mt-4 items-center gap-4">
              <label className="block text-sm font-medium text-gray-900 ">
                Select Unmet Need
              </label>
              <MultiSelect
                ItemRenderer={CustomOptionRenderer}
                labelledBy=""
                options={filterOptions.map((item) => ({
                  label: selectLabels[item] ? selectLabels[item] : item,
                  value: item,
                }))}
                className="w-[20rem] z-[5]"
                value={tableUnmetNeed || []}
                onChange={(val) => handleSelectMultipleUnmet(val)}
              />
            </div>
            <div className="flex items-center w-full gap-2">
              <CustomDropdown
                showImpactColors
                labelClassName="mb-0"
                className={"flex mb-4 items-center gap-2"}
                input={{
                  label: "Period 1",
                  name: "Period 1",
                  type: "select",
                  options: quartersWithDates.map((item) => ({
                    name: item.quarter,
                    value: item.date,
                  })),
                  id: "xLabel",
                }}
                value={tablePeriod1}
                handleSelect={(val) => handleTablePeriod(val, "period1")}
              />
              <CustomDropdown
                showImpactColors
                labelClassName="mb-0"
                className={"flex mb-4 items-center gap-2"}
                input={{
                  label: "Period 2",
                  name: "Period 2",
                  type: "select",
                  options: quartersWithDates.map((item) => ({
                    name: item.quarter,
                    value: item.date,
                  })),
                  id: "xLabel",
                }}
                value={tablePerioid2}
                handleSelect={(val) => handleTablePeriod(val, "period2")}
              />
            </div>
            <button
              onClick={handleReset}
              className="flex px-2 py-2 rounded-sm border"
            >
              Reset Table
            </button>
            <Table
              initialState={{
                pageSize: 10,
                pageIndex: 0,
              }}
              colorCells={true}
              activeCells={false}
              cellClicked={handleCellClick}
              Title="Impact Tracking Table"
              showSelectionBtns={false}
              TableData={tableData}
              marginTop={30}
              TableColummns={[
                {
                  Header: selectedRegion ? "State Name" : "Region",
                  accessor: selectedRegion ? "State Name" : "Region",
                },
                ...tableUnmetNeed.map((item) => ({
                  Header: item.label,
                  accessor: invertedMapLabels[item.value],
                })),
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImpactMap;
