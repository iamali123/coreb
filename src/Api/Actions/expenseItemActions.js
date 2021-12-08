import React from "react";
import axios from "axios";
import { baseURL } from "../Client";
export const GetExpenseItems = async (companyId) => {
  return await axios.get(`${baseURL}/ExpenseItem?CompanyId=${companyId}`);
};
export const AddExpenseItem = async (ExpenseItem) => {
  return await axios.post(`${baseURL}/ExpenseItem`, ExpenseItem);
};
export const DeleteExpenseItem = async (expenseItemId) => {
  return await axios.delete(`${baseURL}/ExpenseItem/${expenseItemId}`);
};
export const EditExpenseItem = async (ExpenseItem) => {
  return await axios.post(`${baseURL}/ExpenseItem`, ExpenseItem);
};
