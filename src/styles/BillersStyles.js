// BillersStyles.js
import styled from 'styled-components';

export const FormWrapper = styled.div`
  background-color: #333131;
  margin: 20px;
  padding: 20px;
  width: 100%;
  max-width: 500px;
  overflow-x: auto;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

export const FormRow = styled.div`
  margin-bottom: 15px;
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

export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
`;

export const SubmitButton = styled.button`
  width: 100%;
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
