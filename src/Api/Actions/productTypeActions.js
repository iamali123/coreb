import axios from 'axios';
import { baseURL } from '../Client';
export const GetProductType = async (companyId) => {
    return await axios.get(`${baseURL}/ItemType?CompanyId=${companyId}`);
};
export const DeleteProductType = async (productTypeId) => {
    return await axios.delete(`${baseURL}/ItemType/${productTypeId}`);
};
export const EditProductType = async (ProuctType) => {
    return await axios.post(`${baseURL}/ItemType`, ProuctType);
};
export const AddProductType = async (ProuctType) => {
    return await axios.post(`${baseURL}/ItemType/`, ProuctType);
};
