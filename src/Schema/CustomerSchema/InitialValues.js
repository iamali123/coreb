import * as Yup from "yup";
import "yup-phone";
export const customerInitialValues = {
  customerId: "",
  customerCode: "",
  customerName: "",
  companyId: "",
  address: "",
  countryId: 0,
  countryName: "",
  city: "",
  postalCode: "",
  contactPerson: "",
  contact: "",
  email: "",
  website: "",
  openingBalance: 0,
  asOfDate: "2021-01-13",
  balanceType: 0,
};

export const customerValidationSchema = Yup.object().shape({
  customerId: Yup.string().label("id"),
  customerName: Yup.string()
    .required("Please enter customer name")
    .label("Name"),
  contactPerson: Yup.string()
    .required("Please enter contact Person name")
    .label("Name"),
  customerCode: Yup.string()
    .required("Please enter customer code")
    .label("Customer Code"),
  companyId: Yup.string().label("companyId"),
  //contact: Yup.string().phone().label("Contact"),
  email: Yup.string().email("Please enter valid email address").label("email"),
  //website: Yup.string().label("Website"),
});
