import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";

export interface RecordsEntity {
  state_name: string;
  holding_num: number;
}

const BarChart = () => {
  const [chartData, setChartData] = useState<
    { stateName: string; holdingNum: number }[]
  >([]);

  useEffect(() => {
    axios
      .get(
        "https://ckan.indiadataportal.com/api/3/action/datastore_search?limit=10000&resource_id=b60eab85-13ba-45dc-b903-20838b71f088"
      )
      .then((response) => {
        const records = response.data.result.records;
        const data = records.map((record: any) => ({
          stateName: record.state_name,
          holdingNum: parseInt(record.holding_num, 10), // Ensure it's parsed as a number
        }));
        setChartData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  return (
    <div>
      <Plot
        data={[
          {
            x: chartData.map((item) => item.stateName),
            y: chartData.map((item) => item.holdingNum),
            type: "bar",
          },
        ]}
        layout={{
          title: "Total Number of Holdings by State",
          xaxis: { title: "State Name" },
          yaxis: { title: "Total Number of Holdings" },
          width: 1225,
          height: 500,
        }}
      />
    </div>
  );
};

export default BarChart;
