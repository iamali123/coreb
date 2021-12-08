import React, { useState } from "react";
import TextField from "../../../../../Components/TextInput";

import { Grid } from "@material-ui/core";

function ItemInventoryDetail({ formik }) {
  return (
    <>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6} md={5}>
          <TextField
            variant="outlined"
            id="minStock"
            label="Minimum Stock"
            value={formik.values.minStock} // != 0 ? formik.values.minStock : ""}
            placeholder="0"
            onChange={formik.handleChange}
            size="small"
            fullWidth
            error={formik.touched.minStock && Boolean(formik.errors.minStock)}
            helperText={formik.touched.minStock && formik.errors.minStock}
          />
        </Grid>
      </Grid>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6} md={5}>
          <TextField
            variant="outlined"
            id="reOrderQuantity"
            label="Re Order Quantity"
            onChange={formik.handleChange}
            value={formik.values.reOrderQuantity} //!= 0? formik.values.reOrderQuantity: ""}
            size="small"
            fullWidth
            placeholder="0"
            error={
              formik.touched.reOrderQuantity &&
              Boolean(formik.errors.reOrderQuantity)
            }
            helperText={
              formik.touched.reOrderQuantity && formik.errors.reOrderQuantity
            }
          />
        </Grid>
      </Grid>
    </>
  );
}

export default ItemInventoryDetail;
