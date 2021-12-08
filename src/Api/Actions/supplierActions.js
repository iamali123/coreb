import axios from 'axios';
import { baseURL } from '../Client';
export const GetSuppliers = async (companyId) => {
    return await axios.get(`${baseURL}/Supplier?CompanyId=${companyId}`);
};
export const DeleteSupplier = async (supplierId) => {
    return await axios.delete(`${baseURL}/Supplier/${supplierId}`);
};
export const EditSupplier = async (supplier) => {
    return await axios.post(`${baseURL}/Supplier`, supplier);
};
export const AddSupplier = async (supplier) => {
    return await axios.post(`${baseURL}/Supplier`, supplier);
};
