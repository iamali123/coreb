import * as Yup from "yup";
export const posSalesInitialValues = {
  id: "",
  companyId: "",
  invoiceNumber: "",
  invoiceCode: "",
  invoiceDate: new Date(),
  customerId: "",
  customerName: "",
  accountId: "0",
  accountName: "",
  referenceNo: "",
  description: "",
  totalAmount: 0.0,
  discount: 0.0,
  discountAmount: 0.0,
  gross: 0.0,
  taxId: "0",
  taxName: "",
  tax: 0.0,
  taxAmount: 0.0,
  netAmount: 0.0,
  tendered: 0.0,

  posSalesItemDetailModel: [],
};

export const posSalesItemDetailsInitialValues = {
  id: "0",
  posSalesId: "",
  itemDetailId: "",
  itemDetailCode: "",
  itemDetailName: "",
  quantity: 0,
  unitPrice: 0.0,
  totalPrice: 0.0,
  description: "",
};
export const PosSalesValidationSchema = Yup.object().shape({
  customerId: Yup.string()
    .required("Please select Customer")
    .label("Customer Name"),
  //currencyId: Yup.string().required("Please select currency").label("Currency"),
});
export const PosSalesItemDetailValidationSchema = Yup.object().shape({
  itemDetailId: Yup.string()
    .required("Please Select an Item")
    .label("Product Code"),
  unitPrice: Yup.number().required("Please add unit price").label("Unit Price"),
  quantity: Yup.number()
    .required("Please add unit quantity ")
    .label("Unit Quantity"),
});
