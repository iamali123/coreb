import axios from "axios";
import { baseURL } from "../Client";

export const DeletePaymentIn = async (Id) => {
  return await axios.delete(`${baseURL}/VoucherIn/${Id}`);
};

export const GetPaymentIn = async (companyId) => {
  return await axios.get(
    `${baseURL}/VoucherIn?CompanyId=${companyId}&voucherType=1`
  );
};

export const AddPaymentIn = async (PaymentIn) => {
  return await axios.post(`${baseURL}/VoucherIn/`, PaymentIn);
};

export const EditPaymentIn = async (PaymentIn) => {
  return await axios.post(`${baseURL}/VoucherIn/`, PaymentIn);
};
