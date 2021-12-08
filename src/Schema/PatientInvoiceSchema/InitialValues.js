import * as Yup from "yup";
export let patientInvoiceInitialValues = {
  id: "",
  companyId: "",
  patient_InvoiceNumber: "0",
  patient_InvoiceCode: "",
  patient_InvoiceDate: new Date(),
  appointmentId: "",
  patientId: "",
  patientName: "",
  doctorId: "",
  doctorName: "",
  discount: 0,
  discountAmount: 0,
  gross: 0,
  taxId: "0",
  tax: 0,
  taxAmount: 0,
  totalAmount: 0,
  netAmount: 0,
  amountReceived: 0,
  items: [],
};

export let patientInvoiceItemInitilaValues = {
  id: "0",
  patientInvoiceId: "0",
  itemDetailId: "",
  itemDetailCode: "",
  itemDetailName: "",
  quantity: 0,
  unitPrice: 0,
  totalPrice: 0,
  description: "",
};
export const patientInvoiceValidationSchema = Yup.object().shape({
  companyId: Yup.string().label("CompanyId"),
  appointmentId: Yup.string()
    .required("Please select the appointment")
    .label("Appointment"),
  doctorId: Yup.string().required("Please select the doctor").label("Doctor"),
  patientId: Yup.string()
    .required("Please select the patient")
    .label("Patient"),
});
export const patientInvoiceItemValidationSchema = Yup.object().shape({
  quantity: Yup.number().required("Please add quantity").label("Quantity"),
  unitPrice: Yup.number().required("Please add unitprice").label("UnitPrice"),
  itemDetailId: Yup.string()
    .required("Please select the service")
    .label("Service"),
});
