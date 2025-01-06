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

const DailyChart = ({ data_input }) => {
  const chartData = data_input.map(item => ({
    Day: item["Day"],
    "Cash Flows": item["Cash Flows"],
    "Expenses": item["Expenses"],
    "Cash Flows Label": item["Cash Flows Label"],
    "Expenses Label": item["Expenses Label"],
  }));

  return (
    <ResponsiveContainer width="100%" height={400} >
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
