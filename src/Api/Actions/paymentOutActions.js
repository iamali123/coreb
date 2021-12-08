import axios from "axios";
import { baseURL } from "../Client";
export const GetVouherOut = async (companyId) => {
  return await axios.get(
    `${baseURL}/VouherOut?CompanyId=${companyId}&voucherType=2`
  );
};
export const DeleteVouherOut = async (VouherOutId) => {
  return await axios.delete(`${baseURL}/VouherOut/${VouherOutId}`);
};
export const EditVouherOut = async (VouherOut) => {
  return await axios.post(`${baseURL}/VouherOut`, VouherOut);
};
export const AddVouherOut = async (VouherOut) => {
  return await axios.post(`${baseURL}/VouherOut/`, VouherOut);
};
