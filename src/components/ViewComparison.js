import React from 'react';
import {
  ComparisonWrapper,
  ComparisonHeader,
  ComparisonTable,
  TableHeader,
  TableData,
  TableRow,
  TotalRow
} from '../styles/ViewComparisonStyles'; // Import the styles

const ViewComparison = ({ plannerData }) => {
  if (!plannerData) return null; // Avoid rendering empty content

  return (
    <ComparisonWrapper>
      <ComparisonHeader>Comparison for Planner: {plannerData.planner_name}</ComparisonHeader>

      <ComparisonTable>
        <thead>
          <tr>
            <TableHeader>Metric</TableHeader>
            <TableHeader>Amount</TableHeader>
          </tr>
        </thead>
        <tbody>
          <TableRow>
            <TableData>Total Expenses</TableData>
            <TableData>{plannerData.total_expenses}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Total Cash Flows</TableData>
            <TableData>{plannerData.total_cash_flows}</TableData>
          </TableRow>
          <TotalRow>
            <TableData>Cash Flow Left After Expenses</TableData>
            <TableData>{plannerData.cash_flow_left}</TableData>
          </TotalRow>
        </tbody>
      </ComparisonTable>

      <ComparisonHeader>Expenses</ComparisonHeader>
      <ComparisonTable>
        <thead>
          <tr>
            <TableHeader>Description</TableHeader>
            <TableHeader>Amount</TableHeader>
          </tr>
        </thead>
        <tbody>
          {plannerData.expenses.map((expense, index) => (
            <TableRow key={index}>
              <TableData>{expense.description}</TableData>
              <TableData>{expense.amount}</TableData>
            </TableRow>
          ))}
        </tbody>
      </ComparisonTable>

      <ComparisonHeader>Cash Flows</ComparisonHeader>
      <ComparisonTable>
        <thead>
          <tr>
            <TableHeader>Name</TableHeader>
            <TableHeader>Amount</TableHeader>
          </tr>
        </thead>
        <tbody>
          {plannerData.cash_flows.map((cashFlow, index) => (
            <TableRow key={index}>
              <TableData>{cashFlow.cash_flow_name}</TableData>
              <TableData>{cashFlow.amount}</TableData>
            </TableRow>
          ))}
        </tbody>
      </ComparisonTable>
    </ComparisonWrapper>
  );
};

export default ViewComparison;
