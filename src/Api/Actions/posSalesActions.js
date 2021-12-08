import axios from "axios";
import { baseURL } from "../Client";

export const GetPosSalesSummary = async (companyId) => {
  return await axios.get(`${baseURL}/PosSales/PosSalesSummary/${companyId}`);
};

export const DeletePosSales = async (SoId) => {
  return await axios.delete(`${baseURL}/PosSales/${SoId}`);
};

export const GetPosSales = async (companyId) => {
  return await axios.get(`${baseURL}/PosSales?CompanyId=${companyId}`);
};

export const AddPosSales = async (PosSales) => {
  return await axios.post(`${baseURL}/PosSales/`, PosSales);
};

export const EditPosSalesAction = async (PosSales) => {
  return await axios.post(`${baseURL}/PosSales/`, PosSales);
};
