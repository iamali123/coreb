import axios from "axios";
import { baseURL } from "../Client";

export const DeleteCash = async (Id) => {
  return await axios.delete(`${baseURL}/VoucherCash/${Id}`);
};

export const GetCash = async (companyId) => {
  return await axios.get(`${baseURL}/VoucherCash?CompanyId=${companyId}`);
};

export const AddCash = async (Cash) => {
  return await axios.post(`${baseURL}/VoucherCash/`, Cash);
};

export const EditCash = async (Cash) => {
  return await axios.post(`${baseURL}/VoucherCash/`, Cash);
};
