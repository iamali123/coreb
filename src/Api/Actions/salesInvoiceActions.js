import axios from "axios";
import { baseURL } from "../Client";

export const GetSalesInvoiceSummary = async (companyId) => {
  return await axios.get(
    `${baseURL}/SalesInvoice/SalesInvoiceSummary/${companyId}`
  );
};

export const DeleteSalesInvoice = async (SoId) => {
  return await axios.delete(`${baseURL}/SalesInvoice/${SoId}`);
};

export const GetSalesInvoice = async (companyId) => {
  return await axios.get(`${baseURL}/SalesInvoice?CompanyId=${companyId}`);
};

export const AddSalesInvoice = async (SalesInvoice) => {
  return await axios.post(`${baseURL}/SalesInvoice/`, SalesInvoice);
};

export const EditSalesInvoiceAction = async (SalesInvoice) => {
  return await axios.post(`${baseURL}/SalesInvoice/`, SalesInvoice);
};
