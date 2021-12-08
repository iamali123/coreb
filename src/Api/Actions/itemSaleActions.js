import axios from 'axios';
import { baseURL } from '../Client';
export const GetItemSales = async (companyId, itemId) => {
    return await axios.get(
        `${baseURL}/CustomerItemPrice?CompanyId=${companyId}&ItemId=${itemId}`
    );
};
export const DeleteItemSale = async (saleId) => {
    return await axios.delete(`${baseURL}/CustomerItemPrice/${saleId}`);
};
export const EditItemSale = async (saleItem) => {
    return await axios.post(`${baseURL}/CustomerItemPrice`, saleItem);
};
export const AddItemSales = async (saleItem) => {
    return await axios.post(`${baseURL}/CustomerItemPrice`, saleItem);
};
