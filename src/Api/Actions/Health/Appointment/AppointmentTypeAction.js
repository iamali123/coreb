import axios from "axios";
import { baseURL } from "../../..//Client";
export const GetAppointmentType = async (companyId) => {
  return await axios.get(`${baseURL}/AppointmentType?CompanyId=${companyId}`);
};
export const DeleteAppointmentType = async (TypeId) => {
  return await axios.delete(`${baseURL}/AppointmentType/${TypeId}`);
};
export const EditAppointmentType = async (AppointmentType) => {
  return await axios.post(`${baseURL}/AppointmentType`, AppointmentType);
};
export const AddAppointmentType = async (AppointmentType) => {
  return await axios.post(`${baseURL}/AppointmentType`, AppointmentType);
};
