import axios from 'axios';
import { baseURL } from '../Client';

export const GetVariants = async (companyId, itemId) => {
    return await axios.get(
        `${baseURL}/ItemVariant?CompanyId=${companyId}&ItemId=${itemId}`
    );
};
export const DeleteVariant = async (variantId) => {
    return await axios.delete(`${baseURL}/ItemVariant/${variantId}`);
};
export const EditVariant = async (variant) => {
    return await axios.post(`${baseURL}/ItemVariant`, variant);
};
export const AddVariant = async (variant) => {
    return await axios.post(`${baseURL}/ItemVariant/`, variant);
};
