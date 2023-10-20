import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import "./App.css";

const GroupedBarChart = () => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Fetch data from the JSON API
    axios
      .get(
        "https://ckan.indiadataportal.com/api/3/action/datastore_search?limit=10000&resource_id=b60eab85-13ba-45dc-b903-20838b71f088"
      )
      .then((response) => {
        const records = response.data.result.records;

        // Group data by state_name and social_group
        const groupedData: { [state: string]: { [group: string]: number[] } } =
          {};

        records.forEach((record: any) => {
          const stateName = record.state_name;
          const socialGroup = record.social_group;
          const holdingNum = parseInt(record.holding_num, 10);

          if (!groupedData[stateName]) {
            groupedData[stateName] = {};
          }

          if (!groupedData[stateName][socialGroup]) {
            groupedData[stateName][socialGroup] = [];
          }

          groupedData[stateName][socialGroup].push(holdingNum);
        });

        // Prepare data for the chart
        const traces = Object.keys(groupedData).map((stateName) => ({
          x: Object.keys(groupedData[stateName]),
          y: Object.values(groupedData[stateName]).map(
            (holdingNums: number[]) =>
              holdingNums.reduce((acc, curr) => acc + curr, 0)
          ),
          name: stateName,
          type: "bar",
        }));

        setChartData(traces);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      <Plot
        data={chartData}
        layout={{
          title: " Social Group by Holding Number",
          xaxis: { title: "Social Group" },
          yaxis: { title: "Holding Number" },
          width: 1215,
          height: 600,
          barmode: "group", // Create grouped bars
        }}
      />
    </div>
  );
};

export default GroupedBarChart;
