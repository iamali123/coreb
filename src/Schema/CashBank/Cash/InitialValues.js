import * as Yup from "yup";
export const CashInitialValues = {
  id: "",
  companyId: "",
  voucherNo: "",
  voucherCode: "",
  voucherDate: new Date(),
  voucherType: 3,
  createdBy: "",
  createdDate: new Date(),
  referenceNo: "",
  paymentMode: true,
  accountId: "",
  accountTitle: "",
  cashAccountId: "",
  cashAccountTitle: "",
  description: "",
  amount: 0,
};

export const CashValidationSchema = Yup.object().shape({
  accountId: Yup.string()
    .required("Please select Account")
    .label("Account Name"),
  // accountCreditId: Yup.string()
  //   .required("Please select Payment Type")
  //   .label("Payment Type"),
});
