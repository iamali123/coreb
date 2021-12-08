import axios from "axios";
import { baseURL } from "../Client";
export const GetBanks = async (companyId) => {
  return await axios.get(`${baseURL}/BankAccounts?CompanyId=${companyId}`);
};
export const DeleteBank = async (bankId) => {
  return await axios.delete(`${baseURL}/BankAccounts/${bankId}`);
};
export const EditBank = async (Bank) => {
  return await axios.post(`${baseURL}/BankAccounts`, Bank);
};
export const AddBank = async (paymentTerm) => {
  return await axios.post(`${baseURL}/BankAccounts/`, paymentTerm);
};
