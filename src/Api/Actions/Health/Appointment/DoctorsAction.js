import axios from "axios";
import { baseURL } from "../../..//Client";
export const GetDoctors = async (companyId) => {
  return await axios.get(`${baseURL}/Doctor?CompanyId=${companyId}`);
};
export const DeleteDoctor = async (docId) => {
  return await axios.delete(`${baseURL}/Doctor/${docId}`);
};
export const EditDoctor = async (doctor) => {
  return await axios.post(`${baseURL}/Doctor`, doctor);
};
export const AddDoctor = async (doctor) => {
  return await axios.post(`${baseURL}/Doctor/`, doctor);
};
