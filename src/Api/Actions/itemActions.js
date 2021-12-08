import React from 'react';
import axios from 'axios';
import { baseURL } from '../Client';
export const GetItems = async (companyId) => {
    return await axios.get(`${baseURL}/Item?CompanyId=${companyId}`);
};
export const AddItem = async (Item) => {
    return await axios.post(`${baseURL}/Item`, Item);
};
export const DeleteItem = async (itemId) => {
    return await axios.delete(`${baseURL}/Item/${itemId}`);
};
export const EditItem = async (Item) => {
    return await axios.post(`${baseURL}/Item`, Item);
};
