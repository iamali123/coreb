import * as Yup from "yup";
const date = new Date();
export const purchaseBillInitialValues = {
  id: "",
  companyId: "",
  referenceNumber: "",
  billNumber: "",
  billCode: "",
  description: "",
  billDate: date,
  supplierId: "0",
  supplierName: "",
  currencyId: "0",
  currencyName: "",
  accountId: "0",
  accountName: "",
  paymentTermId: "0",
  paymentTermName: "",
  shipmentTermId: "0",
  shipmentTermName: "",
  shipmentModeId: "0",
  shipmentModeName: "",
  discount: 0.0,
  discountAmount: 0.0,
  gross: 0.0,
  taxId: "0",
  tax: 0.0,
  taxName: "",
  taxAmount: 0.0,
  totalAmount: 0.0,
  freightAmount: 0.0,
  netAmount: 0.0,
  amountPaid: 0.0,
  purchaseOrderId: 0,
  purchaseBillItemDetails: [],
};

export const purchaseBillItemDetailsInitialValues = {
  id: "0",
  purchaseBillId: "",
  itemDetailId: "",
  itemDetailCode: "",
  itemDetailName: "",
  quantity: 0,
  unitPrice: 0.0,
  totalPrice: 0.0,
  description: "",
};
export const PurchaseBillValidationSchema = Yup.object().shape({
  supplierId: Yup.string()
    .required("Please select supplier")
    .label("Supplier Name"),
  currencyId: Yup.string().required("Please select currency").label("Currency"),
});
export const PurchaseBillItemDetailValidationSchema = Yup.object().shape({
  itemDetailId: Yup.string()
    .required("Please Select an Item")
    .label("Product Code"),
  unitPrice: Yup.number().required("Please add unit price").label("Unit Price"),
  quantity: Yup.number()
    .required("Please add unit quantity ")
    .label("Unit Quantity"),
});
