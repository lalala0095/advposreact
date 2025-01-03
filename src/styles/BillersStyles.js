// BillersStyles.js
import styled from 'styled-components';

export const FormWrapper = styled.form`
margin-top: 20px;
margin-left: 20px;
padding: 20px;
background-color: #333131;
border: 1px solid #ccc;
border-radius: 8px;
color: #fff;
max-width: 420px;
`;

export const FormRow = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 5px;
  }

  input,
  textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #444;
    color: #fff;
    max-width: 400px;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #fff;
`;

export const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
`;

export const DateInputField = styled.input.attrs({ type: 'date' })`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
  color: #333;
  font-size: 14px;

  &:focus {
    border-color: #007bff; /* Add a highlight color for focus */
    outline: none;
  }

  &::-webkit-calendar-picker-indicator {
    cursor: pointer; /* Ensures the calendar icon is clickable */
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
`;

export const SubmitButton = styled.button`
  width: 30%;
  margin-right: 10px;
  padding: 10px;
  background-color: #007bff;
  border: none;
  color: #fff;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export const CancelButton = styled.button`
  width: 30%;
  margin-left: 150px;
  padding: 10px;
  background-color:rgb(220, 74, 16);
  border: none;
  color: #fff;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export const AddButton = styled.button`
  padding: 8px 16px;
  background-color: #28a745;
  border: none;
  color: #fff;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 15px;

  &:hover {
    background-color: #218838;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const PageContainer = styled.div`
  display: flex;
  height: 100vh;
`;

export const ContentContainer = styled.div`
  flex-grow: 1;
  padding: 20px;
  margin-left: ${({ sidebarOpen }) => (sidebarOpen ? '250px' : '0')};
  transition: margin-left 0.3s ease-in-out;
`;

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
    background-color:rgb(113, 109, 109);
  }
  font-size: 14px;
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
  font-size: 16px;
`;

export const EditButton = styled.button`
  background: none;
  border: none;
  color: green;
  cursor: pointer;
  font-size: 16px;
`;

export const PaginationControlStyle = styled.button`
  margin-top: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 16 px;
`;

export const DropdownWrapper = styled.div`
  .form-select {
    background-color: #f8f9fa;
    border-radius: 0.25rem;
    border: 1px solid #ced4da;
    transition: background-color 0.3s ease, border-color 0.3s ease;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
  }

  .form-select:focus {
    background-color: #fff;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.25rem rgba(38, 143, 255, 0.25);
  }
`;

export const SignupDropdownWrapper = styled.div`
  select {
    margin-bottom: 15px;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #444; /* Dark border */
    border-radius: 5px;
    width: 100%;
    background-color: #2e2e2e; /* Dark input background */
    color: #e0e0e0; /* Light text inside the dropdown */
    max-width: 400px;
    transition: border-color 0.3s ease;
  }

  select:focus {
    outline: none;
    border-color: #4caf50; /* Green border on focus */
  }

  option {
    background-color: #2e2e2e; /* Dark background for options */
    color: #e0e0e0; /* Light text for options */
  }

  select:hover {
    border-color: #45a049; /* Darker green border on hover */
  }
`;

