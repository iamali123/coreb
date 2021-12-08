import * as Yup from "yup";

export let productInitialValues = {
  itemId: "",
  companyId: "",
  itemName: "",
  itemCode: "",
  itemBarCode: "",
  type: 0,
  description: "",
  salePrice: 0.0,
  purchasePrice: 0.0,
  openStock: 0.0,
  atPrice: 0.0,
  minStock: 0.0,
  reOrderQuantity: 0.0,
  location: "",
  asOfDate: "",
  itemUnit: "",
  itemUnitTitle: "",
  itemCategory: "",
  itemCatgoryTitle: "",
  itemTypeId: "",
  itemTypeName: "",
  itemImage: "",
};
// ******************Service Form InitialValuess ************************
export let serviceInitialValues = {
  itemId: "",
  companyId: "",
  itemName: "",
  itemCode: "",
  itemBarCode: "",
  type: 1,
  description: "",
  salePrice: 0.0,
  purchasePrice: 0.0,
  openStock: 0.0,
  atPrice: 0.0,
  minStock: 0.0,
  reOrderQuantity: 0.0,
  location: "",
  asOfDate: "",
  itemUnit: "",
  itemUnitTitle: "",
  itemCategory: "",
  itemCatgoryTitle: "",
  itemTypeId: "",
  itemTypeName: "",
  itemImage: "",
};
// ****************************Product Form Validation Schema*******************
export const productValidationSchema = Yup.object().shape({
  companyId: Yup.string().label("CompanyId"),
  itemName: Yup.string()
    .required("Please enter the product name")
    .label("Product Name"),
  itemCode: Yup.string()
    .required("Please enter the product code")
    .label("Product Code"),
  itemBarCode: Yup.string().label("ISBN"),
  itemCategory: Yup.string()
    .required("Please select the product category")
    .label("Product Category"),
  itemTypeId: Yup.string()
    .required("Please select the product type")
    .label("Product Type"),
  type: Yup.number().label("Type"),
  description: Yup.string().label("Description"),
  salePrice: Yup.number().required().label("Sale Price"),
  purchasePrice: Yup.number().required().label("Purchase Price"),
  openStock: Yup.number().label("Open Stock"),
  atPrice: Yup.number().label("At Price"),
  minStock: Yup.number().label("Min Stock"),
  location: Yup.string().label("Location"),
  asOfDate: Yup.string().label("As Of Date"),
  itemUnit: Yup.string()
    .required("Please select the product unit")
    .label("Product Unit"),
  itemImage: Yup.string().label("Item Image"),
});
// ****************************Service Form Validation Schema*******************
export const serviceValidationSchema = Yup.object().shape({
  companyId: Yup.string().label("CompanyId"),
  itemName: Yup.string()
    .required("Please enter the service name")
    .label("Service Name"),
  itemCode: Yup.string()
    .required("Please enter the service code")
    .label("Service Code"),
  itemBarCode: Yup.string().label("ISBN"),
  itemCategory: Yup.string()
    .required("Please select the service category")
    .label("Service Category"),
  itemTypeId: Yup.string()
    .required("Please select the service type")
    .label("Service Type"),
  type: Yup.number().label("Type"),
  description: Yup.string().label("Description"),
  salePrice: Yup.number().required().label("Sale Price"),
  purchasePrice: Yup.number().required().label("Purchase Price"),
  openStock: Yup.number().label("Open Stock"),
  atPrice: Yup.number().label("At Price"),
  minStock: Yup.number().label("Min Stock"),
  location: Yup.string().label("Location"),
  asOfDate: Yup.string().label("As Of Date"),
  itemUnit: Yup.string()
    .required("Please select the service unit ")
    .label("Service Unit"),
  itemImage: Yup.string().label("Item Image"),
});
