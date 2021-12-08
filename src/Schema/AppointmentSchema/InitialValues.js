import * as Yup from "yup";
var time = new Date()
  .toLocaleTimeString()
  .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");

export const appointmentInitialValues = {
  id: "",
  companyId: "",
  appointmentNumber: "0",
  appointmentCode: "",
  note: "",
  date: new Date(),
  startTime: time,
  endTime: time,
  repeat: 0,
  doctorId: "",
  doctorName: "",
  appointmentTypeId: "",
  appointmentTypeName: "",
  patientId: "",
  patientName: "",
  serviceId: "",
  serviceName: "",
};

export const appointmentValidationSchema = Yup.object().shape({
  patientId: Yup.string().required("Please select patient").label("Patient"),
  doctorId: Yup.string().required("Please select doctor").label("Doctor"),
  serviceId: Yup.string()
    .required("Please select Appointment Service")
    .label("Appointment Service"),
  appointmentTypeId: Yup.string()
    .required("Please select appointment type")
    .label("Appointment Type"),
});
