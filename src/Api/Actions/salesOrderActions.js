import axios from "axios";
import { baseURL } from "../Client";

export const GetSalesOrderSummary = async (companyId) => {
  return await axios.get(
    `${baseURL}/SalesOrder/SalesOrderSummary/${companyId}`
  );
};

export const DeleteSalesOrder = async (SoId) => {
  return await axios.delete(`${baseURL}/SalesOrder/${SoId}`);
};

export const GetSalesOrder = async (companyId) => {
  return await axios.get(`${baseURL}/SalesOrder?CompanyId=${companyId}`);
};

export const AddSalesOrder = async (SalesOrder) => {
  return await axios.post(`${baseURL}/SalesOrder/`, SalesOrder);
};

export const EditSalesOrderAction = async (SalesOrder) => {
  return await axios.post(`${baseURL}/SalesOrder/`, SalesOrder);
};
