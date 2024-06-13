import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import countryGeoJSON from "../../../../components/Map/data.json"; // Load your country GeoJSON
import CustomDropdown from "../../../../components/CustomDropdown";
import {
  invertedMapLabels,
  mapLabels,
  selectLabels,
} from "../../../../constants/appConstants";
import { MultiSelect } from "react-multi-select-component";
import Table from "../../../../components/Table";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2xpbmljYS1haSIsImEiOiJjbHU3eXE2bXUwYWNlMmpvM3Nsd2ZiZDA3In0.BxJb0GE9oDVg2umCg6QBSw";

const generateRegionsGeoJSON = (
  regionsData,
  stateData,
  countryGeoJSON,
  region,
  period1,
  period2
) => {
  const regionsGeoJSON = {
    type: "FeatureCollection",
    features: [],
  };

  let regionValues = {};

  region.data.map((item) => {
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

    const combinedGeometry = {
      type: "MultiPolygon",
      coordinates: regionFeatures.map(
        (feature) => feature.geometry.coordinates
      ),
    };

    regionsGeoJSON.features.push({
      type: "Feature",
      id: index,
      geometry: combinedGeometry,
      properties: {
        name: regionName,
        item: regionValues,
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
  { quarter: "Q1-2024", date: "2024-01-01" },
  { quarter: "Q2-2024", date: "2024-04-01" },
  { quarter: "Q3-2024", date: "2024-07-01" },
  { quarter: "Q4-2024", date: "2024-10-01" },
];

const ImpactMap = ({ handleReset,regionData, stateData }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [unmetNeed, setUnmetNeed] = useState([
    { label: filterOptions[0], value: filterOptions[0] },
  ]);
  const [period1, setPeriod1] = useState("2023-10-01");
  const [period2, setPeriod2] = useState("2023-07-01");
  const [tableData, setTableData] = useState(null)
  const [hoverInfo, setHoverInfo] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const handleSelectMultipleUnmet = (val) => {
    setUnmetNeed(val);
  };

  const handlePeriod = (val, type) => {
    if (type == "period1") {
      setPeriod1(val);
    } else {
      setPeriod2(val);
    }
  };

  const generatePercentageChange = (hoverInfo) => {
    if (hoverInfo.stateFeatures) {
      let percentageMap = unmetNeed.map((item) => {
        let _period2 = hoverInfo.stateFeatures.filter(
          (item) => item.Quarter == period2
        )[0][invertedMapLabels[item.value]];
        let _period1 = hoverInfo.stateFeatures.filter(
          (item) => item.Quarter == period1
        )[0][invertedMapLabels[item.value]];
        let percentageChange = (_period2 - _period1) / _period1;
        return { percentageChange, item: selectLabels[item.label] };
      });

      return percentageMap;
    }

    let period1Values = {};
    let period2Values = {};
    let regionName = hoverInfo.name;
    hoverInfo.item[regionName].map((item) => {
      if (item.Quarter == period1) {
        period1Values[regionName] = item;
      }
      if (item.Quarter == period2) {
        period2Values[regionName] = item;
      }
    });

    let percentageMap = unmetNeed.map((item) => {
      let _period2 = period2Values[regionName][invertedMapLabels[item.value]];
      let _period1 = period1Values[regionName][invertedMapLabels[item.value]];
      let percentageChange = (_period2 - _period1) / _period1;
      return { percentageChange, item: selectLabels[item.label] };
    });

    return percentageMap;
  };

  useEffect(() => {
    const initializeMap = (region, stateData, period1, period2) => {
      let regionsData = {};
      stateData.data.map((item) => {
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
        period2
      );

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v9",
        center: [-98, 40],
        minZoom: 3.5,
        zoom: 4.1,
      });

      map.on("load", () => {
        // Add regions layer
        map.addSource("regions", {
          type: "geojson",
          data: regionsGeoJSON,
        });

        map.addLayer({
          id: "regions-layer",
          type: "fill",
          source: "regions",
          paint: {
            "fill-color": ["get", "color"],
            "fill-opacity": 0.2,
          },
        });

        // Add countries layer
        map.addSource("countries", {
          type: "geojson",
          data: countryGeoJSON,
        });

        map.addLayer({
          id: "countries-layer",
          type: "fill",
          source: "countries",
          paint: {
            "fill-color": "#0080ff",
            "fill-opacity": 0.5,
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

        // Highlight region on hover
        map.on("mousemove", "regions-layer", (e) => {
          map.getCanvas().style.cursor = "pointer";

          const region = e.features[0];
          const item = e.features[0].properties.item;
          map.setFeatureState(
            { source: "regions", id: region.id },
            { hover: true }
          );
          const coordinates = e.features[0].geometry.coordinates.slice();
          const bounds = new mapboxgl.LngLatBounds();
          if (!bounds) {
            return
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
            if (prev && prev.name == region.properties.name) {
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
          map.getCanvas().style.cursor = "";
          setHoverInfo(null);

          map.getSource("regions").setData(regionsGeoJSON);
        });

        // Click region to show countries
        map.on("click", "regions-layer", (e) => {
          map.setLayoutProperty("countries-layer", "visibility", "visible");
          map.setLayoutProperty("countries-outline", "visibility", "visible");

          const regionName = e.features[0].properties.name;
          const countriesInRegion = regionsData[regionName];
          setSelectedRegion(regionName)
          setTableData({data: stateData.data.filter(item=> item.Region == regionName), headers: stateData.headers})

          // Filter countryGeoJSON to include only countries in the clicked region
          const filteredCountries = countryGeoJSON.features.filter((feature) =>
            countriesInRegion.includes(feature.properties.name)
          );

          // Update the data of the countries layer to show only countries in the region
          map.getSource("countries").setData({
            type: "FeatureCollection",
            features: filteredCountries,
          });

          const bounds = new mapboxgl.LngLatBounds();
          filteredCountries.forEach((feature) => {
            feature.geometry.coordinates[0].forEach((coord) =>
              bounds.extend(coord)
            );
          });

          map.fitBounds(bounds, { padding: 20 });
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
              (item) => item["State Name"] == e.features[0].properties.name
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

    if (!map && regionData && stateData) {
        setTableData(regionData)
        initializeMap(regionData, stateData, period1, period2);
    }

    // return () => map && map.remove();
  }, [map, regionData, stateData]);

  return (
    <div>
      <div className="flex flex-col items-start gap-4">
        <div className="flex my-4 items-center gap-4">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Select Unmet Need
          </label>
          <MultiSelect
            labelledBy=""
            options={filterOptions.map((item) => ({
              label: selectLabels[item] ? selectLabels[item] : item,
              value: item,
            }))}
            className="w-[20rem] z-[5]"
            value={unmetNeed || []}
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
              {generatePercentageChange(hoverInfo).map((item) => {
                return (
                  <div className="flex items-center gap-2">
                    <div className="font-[600]">{item.item}: </div>
                    <div className="font-[400]">{item.percentageChange}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <button onClick={handleReset} className="flex px-2 py-2 rounded-sm border">Reset Map</button>
        <div ref={mapContainerRef} style={{ width: "100%", height: "70vh" }} />
        {tableData && <Table
          initialState={{
            pageSize: 10,
            pageIndex: 0,
          }}
          activeCells={false}
          Title="Impact Tracking Table"
          showSelectionBtns={false}
          TableData={tableData.data.filter(item => item.Quarter == period1 || item.Quarter == period2)}
          marginTop={30}
          TableColummns={tableData.headers.map(item => ({Header: mapLabels[item] ? selectLabels[mapLabels[item]] : item, accessor: item}))}
        />}
      </div>
    </div>
  );
};

export default ImpactMap;
