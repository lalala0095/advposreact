import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import apiService from "../services/apiService";

const DailyCashFlowChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.getDailyCashFlows();
        setData(response)
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
                    const { Day, "Amount Text": amountText } = payload[0].payload;
                    return (
                        <div>
                            <strong>Day: {Day}</strong>
                            <br />
                            <strong>Amount: {amountText}</strong>
                        </div>
                    );
                }
                return null;
            }}
        />
        <Bar dataKey="Amount" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DailyCashFlowChart;
