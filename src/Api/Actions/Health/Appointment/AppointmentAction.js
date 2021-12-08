import axios from "axios";
import { baseURL } from "../../../Client";
export const GetAppointment = async (companyId) => {
  return await axios.get(`${baseURL}/Appointment?CompanyId=${companyId}`);
};
export const GetAppointmentById = async (companyId, appointmentId) => {
  return await axios.get(
    `${baseURL}/Appointment/${companyId},${appointmentId}`
  );
};
export const UpdateAppointmentStatus = async (
  companyId,
  appointmentId,
  status
) => {
  return await axios.get(
    `${baseURL}/Appointment/update/${companyId},${appointmentId},${status}`
  );
};
export const DeleteAppointment = async (AppointmentId) => {
  return await axios.delete(`${baseURL}/Appointment/${AppointmentId}`);
};
export const EditAppointment = async (Appointment) => {
  return await axios.post(`${baseURL}/Appointment`, Appointment);
};
export const AddAppointment = async (Appointment) => {
  return await axios.post(`${baseURL}/Appointment`, Appointment);
};
