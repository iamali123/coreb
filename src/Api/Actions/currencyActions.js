import axios from 'axios';
import { baseURL } from '../Client';
export const GetCurrency = async () => {
    return await axios.get(`${baseURL}/Currency/GetCurrencies`);
};
