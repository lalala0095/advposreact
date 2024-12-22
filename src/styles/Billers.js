import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  height: 100vh;
`;

export const ContentContainer = styled.div`
  flex-grow: 1;
  padding: 20px;
  margin-left: ${({ sidebarOpen }) => (sidebarOpen ? '250px' : '0')}; /* Adjust for sidebar */
  transition: margin-left 0.3s ease-in-out;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const AddButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
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

export const SubmitButton = styled.button`
  background-color: #28a745;
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838;
  }
`;

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

export const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #fff;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
`;