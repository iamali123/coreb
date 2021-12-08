import React from "react";
import axios from "axios";
import { baseURL } from "../Client";
export const GetExpenseCategorys = async (companyId) => {
  return await axios.get(`${baseURL}/ExpenseCategory?CompanyId=${companyId}`);
};
export const AddExpenseCategory = async (ExpenseCategory) => {
  return await axios.post(`${baseURL}/ExpenseCategory`, ExpenseCategory);
};
export const DeleteExpenseCategory = async (expenseCategoryId) => {
  return await axios.delete(`${baseURL}/ExpenseCategory/${expenseCategoryId}`);
};
export const EditExpenseCategory = async (ExpenseCategory) => {
  return await axios.post(`${baseURL}/ExpenseCategory`, ExpenseCategory);
};
