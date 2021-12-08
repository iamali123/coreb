import * as Yup from "yup";
import "yup-phone";
export let BomInitialValues = {
  id: "",
  bomCode: "",
  bomNo: "",
  bomName: "",
  itemDetailId: "",
  itemCode: "",
  itemName: "",
  description: "",
  stockValue: 0.0,
  companyId: "",
  itemId: "",
  billOfMaterialDetails: [],
};

export const BomValidationSchema = Yup.object().shape({
  itemDetailId: Yup.string().label("Item Variant"),
});
export let BomMaterialInitialValues = {
  id: "0",
  billOfMaterialId: "0",
  itemDetailId: "",
  itemDetailName: "",
  unitId: "",
  unitName: "",
  unitPrice: 0.0,
  quantity: 0.0,
  description: "",
};

export const BomMaterialValidationSchema = Yup.object().shape({
  itemDetailId: Yup.string()
    .required("Please Select an item")
    .label("Item Name"),
  unitId: Yup.string()
    .required("Please Select an item Unit")
    .label("Item Unit"),
  quantity: Yup.number().required("Please add quantity").label("Quantity"),
});
