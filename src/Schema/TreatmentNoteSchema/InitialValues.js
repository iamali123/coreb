import * as Yup from "yup";
export const treatmentNoteInitialValues = {
  id: "",
  companyId: "",
  treatmentNumber: "",
  treatmentCode: "",
  description: "",
  appointmentId: "0",
  createdDate: new Date(),
};

export const treatmentNoteValidationSchema = Yup.object().shape({
  appointmentId: Yup.string()
    .required("Please select Appointment")
    .label("Appointment"),
});
