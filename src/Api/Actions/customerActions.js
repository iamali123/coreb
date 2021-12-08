import axios from 'axios';
import { baseURL } from '../Client';
export const GetCustomers = async (companyId) => {
    return await axios.get(`${baseURL}/Customer?CompanyId=${companyId}`);
};
export const DeleteCustomer = async (customerId) => {
    return await axios.delete(`${baseURL}/Customer/${customerId}`);
};
export const EditCustomer = async (Customer) => {
    return await axios.post(`${baseURL}/Customer`, Customer);
};
export const AddCustomer = async (Customer) => {
    return await axios.post(`${baseURL}/Customer`, Customer);
};
