import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Button from "../../../../Components/Button";
import { Grid } from "@material-ui/core";
import TextField from "../../../../Components/TextInput";
import DropDownTextField from "../../../../Components/Dropdown/SearchableDropdown";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  AddNewBtnStyle: {
    backgroundColor: "#1976D2",
    color: "#FFFFFF",
  },
}));

const BomMaterialForm = (props) => {
  const classes = useStyles();
  var EditBomUnitValue;
  var EditBomMaterialValue;

  var unitRecord = useSelector((state) => state.unitReducer).map((unit) => ({
    title: unit.fullName,
    value: unit.id,
    key: unit.id,
  }));

  var BomMaterials = useSelector((state) => state.bomMaterialReducer).map(
    (bom) => ({
      title: bom.description,
      value: bom.itemDetailId,
      key: bom.itemDetailId,
      unitPrice: bom.unitPrice,
    })
  );

  const [NewBomMaterialValue, setNewBomMaterialValue] = useState(
    EditBomMaterialValue === undefined ? [] : EditBomMaterialValue[0]
  );
  const [NewBomUnitValue, setNewBomUnitValue] = useState(
    EditBomUnitValue === undefined ? [] : EditBomUnitValue[0]
  );
  useEffect(() => {
    EditBomUnitValue = unitRecord
      .filter((x) => x.key === props.bomMaterialFormik.values.unitId)
      .map((item) => ({
        title: item.title,
        value: item.value,
        key: item.key,
        unitPrice: item.unitPrice,
      }));
    EditBomMaterialValue = BomMaterials.filter(
      (x) => x.key === props.bomMaterialFormik.values.itemDetailId
    ).map((item) => ({
      title: item.title,
      value: item.value,
      key: item.key,
    }));
    setNewBomUnitValue(EditBomUnitValue[0]);
    setNewBomMaterialValue(EditBomMaterialValue[0]);
  }, [props.run]);

  return (
    <>
      <form onSubmit={props.bomMaterialFormik.handleSubmit}>
        <Grid
          container
          style={{ marginTop: 20 }}
          justifyContent="space-between"
        >
          <Grid xs={2} sm={2} md={2} lg={2}>
            <DropDownTextField
              variant="standard"
              id="billOfMaterialId"
              label="Item Name *"
              value={NewBomMaterialValue}
              DropDowntitle="Add Item"
              ShowForm={props.setShowProductFormModal}
              showAddButton
              size="small"
              fullWidth
              onChange={(event, value) => {
                props.bomMaterialFormik.setFieldValue(
                  "itemDetailId",
                  value === null || value === undefined
                    ? ""
                    : value.key.toString()
                );
                props.bomMaterialFormik.setFieldValue(
                  "unitPrice",
                  value === null || value === undefined ? 0 : value.unitPrice
                );

                props.bomMaterialFormik.setFieldValue(
                  "itemDetailName",
                  value === null || value === undefined ? "" : value.title
                );
                props.bomMaterialFormik.setFieldValue("quantity", 1);
                setNewBomMaterialValue(
                  value === null || value === undefined ? "" : value
                );
              }}
              data={BomMaterials}
              error={
                props.bomMaterialFormik.touched.billOfMaterialId &&
                Boolean(props.bomMaterialFormik.errors.billOfMaterialId)
              }
              helperText={
                props.bomMaterialFormik.touched.billOfMaterialId &&
                props.bomMaterialFormik.errors.billOfMaterialId
              }
            />
          </Grid>
          <Grid xs={2} sm={2} md={2} lg={2}>
            <TextField
              variant="standard"
              id="description"
              label="Description"
              value={props.bomMaterialFormik.values.description}
              onChange={props.bomMaterialFormik.handleChange}
              size="small"
              fullWidth
              error={
                props.bomMaterialFormik.touched.description &&
                Boolean(props.bomMaterialFormik.errors.description)
              }
              helperText={
                props.bomMaterialFormik.touched.description &&
                props.bomMaterialFormik.errors.description
              }
            />
          </Grid>
          <Grid xs={2} sm={2} md={2} lg={2}>
            <DropDownTextField
              variant="standard"
              id="unitId"
              label="Item Unit *"
              value={NewBomUnitValue}
              ShowForm={props.setShowUnitForm}
              DropDowntitle="Add Unit"
              showAddButton
              size="small"
              fullWidth
              onChange={(event, value) => {
                props.bomMaterialFormik.setFieldValue(
                  "unitId",
                  value === null || value === undefined
                    ? ""
                    : value.key.toString()
                );
                props.bomMaterialFormik.setFieldValue(
                  "unitName",
                  value === null || value === undefined ? "" : value.title
                );

                setNewBomUnitValue(
                  value === null || value === undefined ? "" : value
                );
              }}
              data={unitRecord}
              error={
                props.bomMaterialFormik.touched.unitId &&
                Boolean(props.bomMaterialFormik.errors.unitId)
              }
              helperText={
                props.bomMaterialFormik.touched.unitId &&
                props.bomMaterialFormik.errors.unitId
              }
            />
          </Grid>
          <Grid xs={2} sm={2} md={2} lg={2}>
            <TextField
              variant="standard"
              id="quantity"
              label="Quantity"
              value={props.bomMaterialFormik.values.quantity}
              onChange={props.bomMaterialFormik.handleChange}
              size="small"
              fullWidth
              error={
                props.bomMaterialFormik.touched.quantity &&
                Boolean(props.bomMaterialFormik.errors.quantity)
              }
              helperText={
                props.bomMaterialFormik.touched.quantity &&
                props.bomMaterialFormik.errors.quantity
              }
            />
          </Grid>
          <Grid xs={2} sm={2} md={2} lg={2}>
            <TextField
              variant="standard"
              id="unitPrice"
              label="Unit Price"
              value={props.bomMaterialFormik.values.unitPrice}
              onChange={props.bomMaterialFormik.handleChange}
              size="small"
              fullWidth
              error={
                props.bomMaterialFormik.touched.unitPrice &&
                Boolean(props.bomMaterialFormik.errors.unitPrice)
              }
              helperText={
                props.bomMaterialFormik.touched.unitPrice &&
                props.bomMaterialFormik.errors.unitPrice
              }
            />
          </Grid>
          <Grid item sm={1} md={1} lg={1} style={{ paddingTop: 15 }}>
            <Button
              variant="contained"
              color="primary"
              classes={{ root: classes.AddNewBtnStyle }}
              onClick={props.bomMaterialFormik.handleSubmit}
              fullWidth
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default BomMaterialForm;
