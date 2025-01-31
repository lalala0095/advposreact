import styled from 'styled-components';

export const ComparisonWrapper = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #444;
  border-radius: 8px;
  background-color: #333131;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.3);
  width: 50%;
  color: #fff;
`;

export const ComparisonHeader = styled.h3`
  font-size: 20px;
  color: #fff;
  margin-bottom: 15px;
`;

export const ComparisonTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background: #222;
`;

export const TableHeader = styled.th`
  background: rgba(43, 46, 49, 0.06);
  color: white;
  padding: 10px;
  text-align: left;
  border: 1px solid #555;
`;

export const TableData = styled.td`
  padding: 10px;
  border: 1px solid #555;
  color: #ddd;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background: #2a2a2a;
  }

  &:nth-child(odd) {
    background: #222;
  }
`;

export const TotalRow = styled.tr`
  background:rgba(43, 46, 49, 0.06);
  color: white;
  font-weight: bold;
`;
