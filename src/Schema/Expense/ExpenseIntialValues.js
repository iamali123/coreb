import * as Yup from "yup";
export const expenseInitialValues = {
  id: "",
  companyId: "",
  expesneNumber: "",
  expenseCode: "",
  expenseDate: new Date(),
  expenseCategoryId: "",
  expesneCategoryName: "",
  currencyId: "",
  currencyName: "",
  accountId: "0",
  accountName: "",

  paymentTermId: "0",
  paymentTermName: "",
  description: "",
  totalAmount: 0.0,
  paid: 0.0,
  amountReceived: 0.0,
  salesOrderId: 0,
  expenseItemDetailModel: [],
};

export const expenseItemDetailsInitialValues = {
  id: "0",
  expenseId: "",
  expenseItemId: "",
  expenseItemName: "",
  quantity: 0,
  price: 0.0,
  amount: 0.0,
  description: "",
};
export const ExpenseValidationSchema = Yup.object().shape({
  expenseCategoryId: Yup.string()
    .required("Please select Expense")
    .label("Expense Name"),
  currencyId: Yup.string().required("Please select currency").label("Currency"),
});
export const ExpenseItemDetailValidationSchema = Yup.object().shape({
  expenseItemId: Yup.string()
    .required("Please Select an Expense Item")
    .label("Product Code"),
  price: Yup.number().required("Please add price").label("Price"),
  quantity: Yup.number().required("Please add quantity ").label("Quantity"),
});
