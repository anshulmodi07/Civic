import { useEffect, useState } from "react";
import { getComplaintSummary } from "../api/analytics.api";
import ChartView from "../components/ChartView";

export default function Analytics() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    getComplaintSummary().then((res) => {
      const formatted = Object.entries(res.data).map(
        ([key, value]) => ({
          name: key,
          count: value,
        })
      );
      setChartData(formatted);
    });
  }, []);

  return (
    <div>
      <h2>Analytics</h2>
      <ChartView data={chartData} />
    </div>
  );
}
