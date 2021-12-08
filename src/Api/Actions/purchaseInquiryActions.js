import axios from "axios";
import { baseURL } from "../Client";
export const GetPurchaseInquirySummary = async (companyId) => {
  return await axios.get(
    `${baseURL}/PurchaseInquiry/PurchaseInquirySummary/${companyId}`
  );
};
export const DeletePurchaseInquiry = async (PoInquiryId) => {
  return await axios.delete(`${baseURL}/PurchaseInquiry/${PoInquiryId}`);
};
export const GetPurchaseInquiry = async (companyId) => {
  return await axios.get(`${baseURL}/PurchaseInquiry?CompanyId=${companyId}`);
};
export const AddPurchaseInquiry = async (PurchaseInquiry) => {
  return await axios.post(`${baseURL}/PurchaseInquiry/`, PurchaseInquiry);
};
export const EditPurchaseInquiryAction = async (PurchaseInquiry) => {
  return await axios.post(`${baseURL}/PurchaseInquiry/`, PurchaseInquiry);
};
