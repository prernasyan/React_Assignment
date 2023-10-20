import { useEffect, useState } from "react";
import Plotly from "react-plotly.js";
//import geojson from "./india_states.geojson";

function Map() {
  const [districtData, setDistrictData] = useState([]);

  useEffect(() => {
    fetch(
      "https://ckan.indiadataportal.com/api/3/action/datastore_search?limit=10000&resource_id=c0f168be-3532-4d08-b908-473ded89bd8b"
    )
      .then((response) => response.json())
      .then((data) => {
        const apiData = data.result.records;

        const districtData = apiData.map((record: any) => ({
          state_code: record.state_code,
          holding_area: record.holding_area,
        }));
        setDistrictData(districtData);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="App">
      <Plotly
        data={[
          {
            type: "choropleth",
            //geojson: geojson,
            locations: districtData.map((record: any) => record.state_code),
            z: districtData.map((record: any) => record.holding_area),
            locationmode: "country names",
            colorscale: "Viridis",
            showscale: true,
          },
        ]}
        layout={{
          geo: {
            scope: "india",
          },
        }}
      />
    </div>
  );
}

export default Map;
