import { GET_BOM_MATERIALS } from "../Constants";
function bomMaterialReducer(bomMaterials = [], action) {
  switch (action.type) {
    case GET_BOM_MATERIALS:
      bomMaterials = action.payload;
      return bomMaterials;
    default:
      return bomMaterials;
  }
}

export default bomMaterialReducer;
