import axios from 'axios';
import { baseURL } from '../Client';
export const GetCategories = async (companyId) => {
    return await axios.get(`${baseURL}/ItemCategories?CompanyId=${companyId}`);
};
export const DeleteCategory = async (categoryId) => {
    return await axios.delete(`${baseURL}/ItemCategories/${categoryId}`);
};
export const EditCategory = async (category) => {
    return await axios.post(`${baseURL}/ItemCategories`, category);
};
export const AddCategory = async (category) => {
    return await axios.post(`${baseURL}/ItemCategories/`, category);
};
