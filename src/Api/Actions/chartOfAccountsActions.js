import axios from "axios";
import { baseURL } from "../Client";
export const GetChartOfAccount = async (companyId) => {
  return await axios.get(`${baseURL}/ChartOfAccount?CompanyId=${companyId}`);
};
export const DeleteChartOfAccount = async (ChartOfAccountId) => {
  return await axios.delete(`${baseURL}/ChartOfAccount/${ChartOfAccountId}`);
};
export const EditChartOfAccount = async (ChartOfAccount) => {
  return await axios.post(`${baseURL}/ChartOfAccount`, ChartOfAccount);
};
export const AddChartOfAccount = async (ChartOfAccount) => {
  return await axios.post(`${baseURL}/ChartOfAccount/`, ChartOfAccount);
};
