import axios from "axios";
import { baseURL } from "../Client";
export const GetPurchaseBillSummary = async (companyId) => {
  return await axios.get(
    `${baseURL}/PurchaseBill/PurchaseBillSummary/${companyId}`
  );
};
export const DeletePurchaseBill = async (Id) => {
  return await axios.delete(`${baseURL}/PurchaseBill/${Id}`);
};
export const GetPurchaseBill = async (companyId) => {
  return await axios.get(`${baseURL}/PurchaseBill?CompanyId=${companyId}`);
};
export const AddPurchaseBill = async (PurchaseBill) => {
  return await axios.post(`${baseURL}/PurchaseBill/`, PurchaseBill);
};
export const EditPurchaseBillAction = async (PurchaseBill) => {
  return await axios.post(`${baseURL}/PurchaseBill/`, PurchaseBill);
};
