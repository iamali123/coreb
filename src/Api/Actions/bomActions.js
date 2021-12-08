import axios from "axios";
import { baseURL } from "../Client";
export const GetBOMSummary = async (companyId, itemId) => {
  return await axios.get(
    `${baseURL}/BillOfMaterial/BOMSummary/${companyId},${itemId}`
  );
};
export const DeleteBOM = async (BomId) => {
  return await axios.delete(`${baseURL}/BillOfMaterial/${BomId}`);
};
export const GetBOM = async (companyId, itemId) => {
  return await axios.get(
    `${baseURL}/BillOfMaterial?CompanyId=${companyId}&ItemId=${itemId}`
  );
};

export const AddBOM = async (BOM) => {
  return await axios.post(`${baseURL}/BillOfMaterial/`, BOM);
};
export const EditBOM = async (BOM) => {
  return await axios.post(`${baseURL}/BillOfMaterial/`, BOM);
};
