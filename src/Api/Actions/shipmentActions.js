import axios from "axios";
import { baseURL } from "../Client";

// ***********************Shipment Term Actions*******************
export const GetShipmentTerm = async (companyId) => {
  return await axios.get(`${baseURL}/Shipment/ShipmentTerm/${companyId}`);
};
export const AddShipmentTerm = async (shipmentTerm) => {
  return await axios.post(`${baseURL}/Shipment/ShipmentTerm/${shipmentTerm}`);
};
export const EditPaymentTerm = async (shipmentTerm) => {
  return await axios.post(`${baseURL}/Shipment/ShipmentTerm/${shipmentTerm}`);
};
export const DeleteShipmentTerm = async (shipmentTermId) => {
  return await axios.delete(
    `${baseURL}/Shipment/ShipmentTerm/${shipmentTermId}`
  );
};

// ***********************Shipment Mode Actions*******************
export const GetShipmentMode = async (companyId) => {
  return await axios.get(`${baseURL}/Shipment/ShipmentMode/${companyId}`);
};
export const AddShipmentMode = async (shipmentMode) => {
  return await axios.post(`${baseURL}/Shipment/ShipmentMode/${shipmentMode}`);
};
export const EditShipmentMode = async (shipmentMode) => {
  return await axios.post(`${baseURL}/Shipment/ShipmentMode/${shipmentMode}`);
};
export const DeleteShipmentMode = async (shipmentModeId) => {
  return await axios.delete(
    `${baseURL}/Shipment/ShipmentMode/${shipmentModeId}`
  );
};
