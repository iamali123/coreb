import axios from 'axios';
import { baseURL } from '../Client';
export const GetCountries = async () => {
    return await axios.get(`${baseURL}/Country/GetCountries`);
};
