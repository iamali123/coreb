import axios from "axios";
import { baseURL } from "../../../Client";
export const GetPatients = async (companyId) => {
  return await axios.get(`${baseURL}/Patient?companyId=${companyId}`);
};
export const GetPatientsSummary = async (companyId) => {
  return await axios.get(`${baseURL}/Patient/PatientSummary/${companyId}`);
};
export const DeletePatient = async (patientId) => {
  return await axios.delete(`${baseURL}/Patient/${patientId}`);
};
export const EditPatientAction = async (patient) => {
  return await axios.post(`${baseURL}/Patient`, patient);
};
export const AddPatient = async (patient) => {
  return await axios.post(`${baseURL}/Patient/`, patient);
};
