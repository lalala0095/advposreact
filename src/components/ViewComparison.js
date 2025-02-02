import React from 'react';
import {
  ComparisonWrapper,
  ComparisonHeader,
  ComparisonTable,
  TableHeader,
  TableData,
  TableRow,
  TotalRow,
  ComparisonSubHeader,
  ExpenseTableData,
  CashFlowTableData
} from '../styles/ViewComparisonStyles';
import ExportCSVButton from './ExportCSVButton';
import ExportPDFButton from './ExportPDFButton';

const ViewComparison = ({ plannerData }) => {
  if (!plannerData) return null;

  return (
    
    <ComparisonWrapper>
      <ComparisonHeader>Comparison for Planner: {plannerData.planner_name}</ComparisonHeader>

      <div style={{ display: "flex", gap: "10px", marginTop: "10px", marginBottom: "10px" }}>
        <ExportCSVButton plannerId={plannerData._id}>Export to CSV</ExportCSVButton>
        <ExportPDFButton plannerId={plannerData._id}>Export to PDF</ExportPDFButton>
      </div>

        <ComparisonTable>
          <thead>
            <tr>
              <TableHeader>Metric</TableHeader>
              <TableHeader>Values</TableHeader>
            </tr>
          </thead>
          <tbody>
            <TableRow>
              <TableData>Total Expenses</TableData>
              <TableData>{plannerData.total_expenses || 0}</TableData>
            </TableRow>
            <TableRow>
              <TableData>Total Cash Flows</TableData>
              <TableData>{plannerData.total_cash_flows || 0}</TableData>
            </TableRow>
            <TableRow>
              <TableData>Which is Higher?</TableData>
              {plannerData.which_is_higher === 'Expenses' ? (
                <ExpenseTableData>{plannerData.which_is_higher}</ExpenseTableData>
              ) : plannerData.which_is_higher === 'Cash Flows' ? (
                <CashFlowTableData>{plannerData.which_is_higher}</CashFlowTableData>
              ) : (
                <TableData>{plannerData.which_is_higher}</TableData>
              )}
            </TableRow>
            <TotalRow>
              <TableData>Difference</TableData>
              <TableData>{plannerData.difference || 0}</TableData>
            </TotalRow>
          </tbody>
        </ComparisonTable>

      <ComparisonSubHeader>Expenses</ComparisonSubHeader>
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
