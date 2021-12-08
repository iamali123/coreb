import axios from 'axios';
import { baseURL } from '../Client';
export const GetUnits = async (companyId) => {
    return await axios.get(`${baseURL}/ItemUnit?CompanyId=${companyId}`);
};
export const DeleteUnit = async (unitId) => {
    return await axios.delete(`${baseURL}/ItemUnit/${unitId}`);
};
export const EditUnit = async (unit) => {
    return await axios.post(`${baseURL}/ItemUnit`, unit);
};
export const AddUnit = async (unit) => {
    return await axios.post(`${baseURL}/ItemUnit/`, unit);
};
