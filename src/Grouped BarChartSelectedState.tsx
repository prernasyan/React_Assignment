import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";

const GroupedBarChartSelectedState = () => {
  const [chartData, setChartData] = useState<any[]>([]);

  const selectedStates = [
    "Uttar Pradesh",
    "Madhya Pradesh",
    "Punjab",
    "Andhra Pradesh",
    "Telangana",
  ];

  useEffect(() => {
    axios
      .get(
        "https://ckan.indiadataportal.com/api/3/action/datastore_search?limit=10000&resource_id=b60eab85-13ba-45dc-b903-20838b71f088"
      )
      .then((response) => {
        const records = response.data.result.records;

        const groupedData: { [state: string]: { [group: string]: number } } =
          {};

        records.filter((record: any) =>
          selectedStates.includes(record.state_name)
        );

        records.forEach((record: any) => {
          const stateName = record.state_name;
          const socialGroup = record.social_group;
          const holdingNum = parseInt(record.holding_num, 10);

          if (!groupedData[stateName]) {
            groupedData[stateName] = {};
          }

          if (!groupedData[stateName][socialGroup]) {
            groupedData[stateName][socialGroup] = 0;
          }

          groupedData[stateName][socialGroup] += holdingNum;
        });

        const traces = selectedStates.map((state) => ({
          x: Object.keys(groupedData[state]),
          y: Object.values(groupedData[state]),
          name: state,
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
          title: "Social Group by Holding Number",
          xaxis: { title: "Social Group" },
          yaxis: { title: "Holding Number" },
          barmode: "group",
          width: 1215,
          height: 600,
        }}
      />
    </div>
  );
};

export default GroupedBarChartSelectedState;
