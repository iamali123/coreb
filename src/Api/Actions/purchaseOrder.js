import axios from "axios";
import { baseURL } from "../Client";

export const GetPurchaseOrderSummary = async (companyId) => {
  return await axios.get(
    `${baseURL}/Purchase/PurchaseOrderSummary/${companyId}`
  );
};

export const DeletePurchaseOrder = async (PoId) => {
  return await axios.delete(`${baseURL}/Purchase/${PoId}`);
};

export const GetPurchaseOrder = async (companyId) => {
  return await axios.get(`${baseURL}/Purchase?CompanyId=${companyId}`);
};

export const AddPurchaseOrder = async (PurchaseOrder) => {
  return await axios.post(`${baseURL}/Purchase/`, PurchaseOrder);
};

export const EditPurchaseOrderAction = async (PurchaseOrder) => {
  return await axios.post(`${baseURL}/Purchase/`, PurchaseOrder);
};
