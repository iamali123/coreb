import axios from "axios";
import { baseURL } from "../../../Client";
export const GetPatientInvoices = async (companyId) => {
  return await axios.get(`${baseURL}/PatientInvoice?CompanyId=${companyId}`);
};
export const GetPatientInvoiceByAppointmentId = async (
  companyId,
  appointmentId
) => {
  return await axios.get(
    `${baseURL}/PatientInvoice/${companyId},${appointmentId}`
  );
};
export const DeletePatientInvoice = async (Id) => {
  return await axios.delete(`${baseURL}/PatientInvoice/${Id}`);
};
export const EditPatientInvoice = async (PatientInvoice) => {
  return await axios.post(`${baseURL}/PatientInvoice`, PatientInvoice);
};
export const AddPatientInvoice = async (PatientInvoice) => {
  return await axios.post(`${baseURL}/PatientInvoice/`, PatientInvoice);
};
export const GetPatientInvoiceSummary = async (companyId) => {
  return await axios.get(
    `${baseURL}/PatientInvoice/PatientInvoiceSummary/${companyId}`
  );
};
export const GetPatientInvoiceById = async (companyId, invoiceId) => {
  return await axios.get(`${baseURL}/PatientInvoice/GetPatientInvoice/${companyId},${invoiceId}`);
};
