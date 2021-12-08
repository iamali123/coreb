import * as Yup from "yup";
export const salesOrderInitialValues = {
  id: "",
  companyId: "",
  orderNumber: "",
  orderCode: "",
  orderDate: new Date(),
  orderReceiveDate: new Date(), //"2021-10-11T05:46:15.270Z",
  shipmentDate: new Date(), // "2021-10-11T05:46:15.270Z",
  customerId: "",
  customerName: "",
  currencyId: "",
  currencyName: "",
  accountId: "0",
  accountName: "",
  shipmentTermId: "0",
  shipmentTermName: "",
  shipmentModeId: "0",
  shipmentModeName: "",
  paymentTermId: "0",
  paymentTermName: "",
  referenceNo: "",
  description: "",
  discount: 0.0,
  discountAmount: 0.0,
  gross: 0.0,
  taxId: "0",
  taxName: "",
  tax: 0.0,
  taxAmount: 0.0,
  totalAmount: 0.0,
  freightAmount: 0.0,
  netAmount: 0.0,
  salesQuotationId: 0,
  salesOrderItemDetailModel: [],
};

export const salesOrderItemDetailsInitialValues = {
  id: "0",
  salesOrderId: "",
  itemDetailId: "",
  itemDetailCode: "",
  itemDetailName: "",
  quantity: 0,
  unitPrice: 0.0,
  totalPrice: 0.0,
  description: "",
};
export const SalesOrderValidationSchema = Yup.object().shape({
  customerId: Yup.string()
    .required("Please select Customer")
    .label("Customer Name"),
  currencyId: Yup.string().required("Please select currency").label("Currency"),
});
export const SalesOrderItemDetailValidationSchema = Yup.object().shape({
  itemDetailId: Yup.string()
    .required("Please Select an Item")
    .label("Product Code"),
  unitPrice: Yup.number().required("Please add unit price").label("Unit Price"),
  quantity: Yup.number()
    .required("Please add unit quantity ")
    .label("Unit Quantity"),
});
