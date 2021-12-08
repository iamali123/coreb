import * as Yup from "yup";
const date = new Date();
export const purchaseOrderInitialValues = {
  id: "",
  companyId: "",
  referenceNumber: "",
  orderCode: "",
  description: "",
  orderNumber: "",
  orderDate: date,
  orderReceiveDate: date,
  orderShipmentDate: date,
  supplierId: "",
  supplierName: "",
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
  discount: 0.0,
  discountAmount: 0.0,
  gross: 0.0,
  taxId: "0",
  taxName: "",
  tax: 0,
  taxAmount: 0.0,
  totalAmount: 0.0,
  freightAmount: 0,
  netAmount: 0.0,
  PurchaseInquiryId: 0,
  purchaseOrderItemDetails: [],
};

export const purchaseOrderItemDetailsInitialValues = {
  id: "0",
  purchaseOrderId: "",
  itemDetailId: "",
  itemDetailCode: "",
  itemDetailName: "",
  quantity: 0,
  unitPrice: 0.0,
  totalPrice: 0.0,
  description: "",
};
export const PurchaseOrderValidationSchema = Yup.object().shape({
  supplierId: Yup.string()
    .required("Please select supplier")
    .label("Supplier Name"),
  currencyId: Yup.string().required("Please select currency").label("Currency"),
});
export const PurchaseOrderItemDetailValidationSchema = Yup.object().shape({
  itemDetailId: Yup.string()
    .required("Please Select an Item")
    .label("Product Code"),
  unitPrice: Yup.number().required("Please add unit price").label("Unit Price"),
  quantity: Yup.number()
    .required("Please add unit quantity ")
    .label("Unit Quantity"),
});
