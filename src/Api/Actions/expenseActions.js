import axios from "axios";
import { baseURL } from "../Client";

export const GetExpenseSummary = async (companyId) => {
  return await axios.get(`${baseURL}/Expense/ExpenseSummary/${companyId}`);
};

export const DeleteExpense = async (SoId) => {
  return await axios.delete(`${baseURL}/Expense/${SoId}`);
};

export const GetExpense = async (companyId) => {
  return await axios.get(`${baseURL}/Expense?CompanyId=${companyId}`);
};

export const AddExpense = async (Expense) => {
  return await axios.post(`${baseURL}/Expense/`, Expense);
};

export const EditExpenseAction = async (Expense) => {
  return await axios.post(`${baseURL}/Expense/`, Expense);
};
