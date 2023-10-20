import React from "react";
import Plotly from "react-plotly.js";

const ChoroplethMap: React.FC = () => {
  return (
    <div className="App">
      <Plotly
        data={[
          {
            type: "choropleth",
            locations: ["IND"],
            z: [1],
            locationmode: "country names",
            showscale: true,
          },
        ]}
        layout={{
          geo: {
            scope: "asia",
            resolution: 50,
          },
        }}
      />
    </div>
  );
};

export default ChoroplethMap;
