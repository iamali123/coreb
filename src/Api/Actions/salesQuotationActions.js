import axios from "axios";
import { baseURL } from "../Client";

export const GetSalesQuotationSummary = async (companyId) => {
  return await axios.get(
    `${baseURL}/SalesQuotation/SalesQuotationSummary/${companyId}`
  );
};

export const DeleteSalesQuotation = async (SoId) => {
  return await axios.delete(`${baseURL}/SalesQuotation/${SoId}`);
};

export const GetSalesQuotation = async (companyId) => {
  return await axios.get(`${baseURL}/SalesQuotation?CompanyId=${companyId}`);
};

export const AddSalesQuotation = async (SalesQuotation) => {
  return await axios.post(`${baseURL}/SalesQuotation/`, SalesQuotation);
};

export const EditSalesQuotation = async (SalesQuotation) => {
  return await axios.post(`${baseURL}/SalesQuotation/`, SalesQuotation);
};
