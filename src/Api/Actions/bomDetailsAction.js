import axios from "axios";
import { baseURL } from "../Client";
export const GetBOMDetail = async (companyId, ItemId) => {
  return await axios.get(
    `${baseURL}/ItemVariant/ItemDetail/${companyId},${ItemId}`
  );
};
export const GetBOMMaterials = async (companyId) => {
  return await axios.get(`${baseURL}/ItemVariant/ItemDetailAll/${companyId}`);
};
