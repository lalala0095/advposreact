import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import apiService from "../services/apiService";

const DailyChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.getDailyReports();
        setData(response.daily_chart)
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Day" />
        <YAxis />
        <Tooltip 
            content={({ payload }) => {
                if (payload && payload.length > 0) {
                    const { Day, "Cash Flows Label": cashFlowLabel, "Expenses Label": expensesLabel } = payload[0].payload;
                    return (
                        <div>
                            <strong>Day: {Day}</strong>
                            <br />
                            {cashFlowLabel && <strong>Cash Flows: {cashFlowLabel}</strong>}
                            <br />
                            {expensesLabel && <strong>Cash Flows: {expensesLabel}</strong>}
                        </div>
                    );
                }
                return null;
            }}
        />
        <Legend />
        <Bar dataKey="Cash Flows" fill="#8884d8" name="Cash Flows" />
        <Bar dataKey="Expenses" fill="#82ca9d" name="Expenses" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DailyChart;
