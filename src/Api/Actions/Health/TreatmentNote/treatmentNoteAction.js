import axios from "axios";
import { baseURL } from "../../../Client";
export const GetTreatmentNote = async (companyId) => {
  return await axios.get(`${baseURL}/TreatmentNote?CompanyId=${companyId}`);
};
export const DeleteTreatmentNote = async (Id) => {
  return await axios.delete(`${baseURL}/TreatmentNote/${Id}`);
};
export const EditTreatmentNote = async (TreatmentNote) => {
  return await axios.post(`${baseURL}/TreatmentNote`, TreatmentNote);
};
export const AddTreatmentNote = async (TreatmentNote) => {
  return await axios.post(`${baseURL}/TreatmentNote/`, TreatmentNote);
};
export const GetTreatmentNoteSummary = async (companyId, patientId) => {
  return await axios.get(
    `${baseURL}/TreatmentNote/GetTreatmentNoteSummary?companyId=${companyId}&patientId=${patientId}`
  );
};
