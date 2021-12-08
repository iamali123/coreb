import * as Yup from "yup";
const date = new Date();

export const paymentOutIntitialValues = {
  id: "",
  companyId: "",
  voucherNo: "",
  voucherCode: "",
  voucherDate: date,
  voucherType: 2,
  chequeNo: "",
  chequeDate: date,
  createdBy: "",
  createdDate: date,
  billId: "0",
  invoiceId: "0",
  expenseId: "0",
  referenceNo: "",
  accountCreditId: "",
  accountTitleCredit: "",
  accountDebitId: "",
  accountTitleDebit: "",
  description: "",
  amount: 0,
};
export const paymentOutValidationSchema = Yup.object().shape({
  accountCreditId: Yup.string()
    .required("Please select account Name")
    .label("Account Name"),
  accountDebitId: Yup.string()
    .required("Please select payment term")
    .label("Payment Term"),
  amount: Yup.number().required("Please add an amount").label("Amount"),
});
