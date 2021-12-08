import axios from "axios";
import { baseURL } from "../Client";
export const GetPaymentTerm = async (companyId) => {
  return await axios.get(`${baseURL}/PaymentTerm?CompanyId=${companyId}`);
};
export const DeletePaymentTerm = async (paymentId) => {
  return await axios.delete(`${baseURL}/PaymentTerm/${paymentId}`);
};
export const EditPaymentTerm = async (paymentTerm) => {
  return await axios.post(`${baseURL}/PaymentTerm`, paymentTerm);
};
export const AddPaymentTerm = async (paymentTerm) => {
  return await axios.post(`${baseURL}/PaymentTerm/`, paymentTerm);
};
