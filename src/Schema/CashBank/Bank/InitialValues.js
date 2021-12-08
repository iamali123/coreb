import * as Yup from "yup";
export const BankVoucherInitialValues = {
  id: "",
  companyId: "",
  voucherNo: "",
  voucherCode: "",
  voucherDate: new Date(),
  voucherType: 5,
  createdBy: "",
  createdDate: new Date(),
  referenceNo: "",
  paymentMode: true,
  accountId: "",
  accountTitle: "",
  bankAccountId: "",
  bankAccountTitle: "",
  description: "",
  amount: 0,
};

export const BankVoucherValidationSchema = Yup.object().shape({
  accountId: Yup.string()
    .required("Please select Account")
    .label("Account Name"),
  bankAccountId: Yup.string()
    .required("Please select Bank")
    .label("Payment Type"),
});
