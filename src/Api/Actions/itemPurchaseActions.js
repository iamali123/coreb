import axios from 'axios';
import { baseURL } from '../Client';
export const GetItemPurchase = async (companyId, itemId) => {
    return await axios.get(
        `${baseURL}/SupplierItemPrice?CompanyId=${companyId}&ItemId=${itemId}`
    );
};
export const DeleteItemPurchase = async (purchaseId) => {
    return await axios.delete(`${baseURL}/SupplierItemPrice/${purchaseId}`);
};
export const EditItemPurchase = async (purchaseItem) => {
    return await axios.post(`${baseURL}/SupplierItemPrice`, purchaseItem);
};
export const AddItemPurchase = async (purchaseItem) => {
    return await axios.post(`${baseURL}/SupplierItemPrice`, purchaseItem);
};
