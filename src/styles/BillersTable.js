import styled from 'styled-components';

export const TableWrapper = styled.div`
  padding: 20px;
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

export const TableHeader = styled.th`
  padding: 10px;
  background-color:rgb(51, 47, 47);
  border: 1px solid #ddd;
`;

export const TableRow = styled.tr`
  &:hover {
    background-color: #f1f1f1;
  }
`;

export const TableData = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 18px;
`;

export const EditButton = styled.button`
  background: none;
  border: none;
  color: green;
  cursor: pointer;
  font-size: 18px;
`;

export const PaginationControl = styled.button`
  margin-top: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 18px;
`;