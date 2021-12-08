import axios from "axios";
import { baseURL } from "../Client";

export const DeleteBankVoucher = async (Id) => {
  return await axios.delete(`${baseURL}/VoucherBank/${Id}`);
};

export const GetBankVoucher = async (companyId) => {
  return await axios.get(`${baseURL}/VoucherBank?CompanyId=${companyId}`);
};

export const AddBankVoucher = async (Bank) => {
  return await axios.post(`${baseURL}/VoucherBank/`, Bank);
};

export const EditBankVoucher = async (Bank) => {
  return await axios.post(`${baseURL}/VoucherBank/`, Bank);
};
