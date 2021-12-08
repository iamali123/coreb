import * as Yup from "yup";
export const PatientInitailValues = {
  id: "",
  patientNumber: "",
  firstName: "",
  lastName: "",
  dateOfBirth: new Date(),
  cnic: "",
  gender: 0,
  occupation: "",
  age: "0",
  numberType: 0,
  contactNumber: "",
  email: "",
  streetAddress: "",
  city: "",
  state: "",
  postalCode: "",
  countryId: "97",
  countryName: "Pakistan",
  companyId: "",
  allowBookingConfirmationEmail: true,
  allowMarketingMessagesEmail: true,
  reminderType: 0,
  patientRelationShipModel: [],
  patientPrivacyPolicieModel: [],
};
export const patientRelationShipModel = {
  id: "0",
  relationShips: 0,
  patientId: "0",
};
export const patientPrivacyPolicieModel = {
  id: "0",
  privacyPolicyStatus: true,
  patientId: "0",
};
export const patientCommunicationPreferenceModel = {
  id: "0",
  allowBookingConfirmationEmail: true,
  allowMarketingMessagesEmail: true,
  reminderType: 0,
  patientId: "0",
};
export const PatientInformationSchema = Yup.object().shape({
  firstName: Yup.string().required("Please Enter FirstName").label("FirstName"),
  lastName: Yup.string().required("Please Enter LastName").label("LastName"),
  dateOfBirth: Yup.string().required("Please Enter DOB").label("Date Of Birth"),
});
