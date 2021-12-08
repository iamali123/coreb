import * as Yup from "yup";
export const PaymentInInitialValues = {
  id: "",
  companyId: "",
  voucherNo: "",
  voucherCode: "",
  voucherDate: new Date(),
  voucherType: 1,
  chequeNo: "",
  chequeDate: new Date(1121),
  createdBy: "",
  createdDate: new Date(),
  invoiceId: "0",
  patientInvoiceId: "0",
  billId: "0",
  expenseId: "0",
  referenceNo: "",
  accountDebitId: "",
  accountTitleDebit: "",
  accountCreditId: "",
  accountTitleCredit: "",
  description: "",
  amount: 0,
};

export const PaymentInValidationSchema = Yup.object().shape({
  accountDebitId: Yup.string()
    .required("Please select Account")
    .label("Account Name"),
  accountCreditId: Yup.string()
    .required("Please select Payment Type")
    .label("Payment Type"),
});
