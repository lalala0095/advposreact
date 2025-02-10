import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';

const StyledResponsiveContainer = styled(ResponsiveContainer)`
  border: 1px solid green;
  width: 100%;
  height: 50vh;
  height: 100%;
  border: 1px solid
`;

const CashFlowPieChart = ({ data }) => {
  const chartData = data.map(item => ({
    name: item["Cash Flow Type"],  // This is what will show in the legend and tooltip by default
    value: item.Amount,           // This is the value used to size the slices
    label: item["Amount Text"],   // Custom label to show in tooltip and legend (with peso sign)
  }));
  console.log("Chart Data:", chartData);

  const COLORS = ["#4BC0C0", "#FF9F40", "#23781e", "9ca2d1", "ef8ae1" ];

  return (
    <StyledResponsiveContainer>
      <PieChart height={400} minWidth={400} maxWidth={400}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
            const entry = chartData[index];
            const label = entry ? entry.label : ''; // Get the label with the peso sign
            // Calculate the position of the label
            const RADIAN = Math.PI / 180;
            const radius = innerRadius + (outerRadius - innerRadius) / 2;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
            
            return (
              <text
                x={x}
                y={y}
                fill="#fff"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="16"
              >
                {label}
              </text>
            );
          }}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip 
          // Display custom label with peso sign in the tooltip
          formatter={(value, name, props) => {
            const item = chartData.find(entry => entry.name === name);
            return item ? item.label : value;  // Show custom label with peso sign
          }}
        />
        
        <Legend 
          // Display custom label with peso sign in the legend
          formatter={(value) => {
            const item = chartData.find(entry => entry.name === value);
            if (item) {
              return item.name;
            }
            return value;
          }}
        />
      </PieChart>
    </StyledResponsiveContainer>
  );
};

export default CashFlowPieChart;
