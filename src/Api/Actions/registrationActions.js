import { baseURL } from "../Client";
import axios from "axios";
import Cookies from "universal-cookie";
import Swal from "sweetalert2";
const cookies = new Cookies();
const date = new Date();
date.setTime(date.getTime() + 1440 * 60 * 1000);

var verificationdata = [];

const headers = {
  headers: { "Content-Type": "application/json" },
  withCredentials: "false",
};
export const Register = (Registration) => {
  axios
    .post(`${baseURL}/Registration`, Registration)
    .then((res) => {})
    .catch((error) => {});
};

export const SendVerificationCode = async (email, ForgotPasswordStatus) => {
  return await axios.post(
    `${baseURL}/Registration/${email},${ForgotPasswordStatus}`
  );
};

export const getOrganizationType = () =>
  axios.get(`${baseURL}/OrganizationType`);

export const getOrganizationSubCategories = () =>
  axios.get(`${baseURL}/OrganizationCategory`);

export const getOrganizationCategories = () =>
  axios.get(`${baseURL}/CompanyCategory`);

export const RegisterOrganization = (Registration) =>
  axios.post(`${baseURL}/Registration`, Registration);

export const Login = async (Credentials) =>
  await axios.post(`${baseURL}/User/authenticate`, Credentials, {
    headers,
  });

export let getUser = () => {
  return cookies.get("user");
};
