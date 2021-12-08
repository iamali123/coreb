import React, { useState, useEffect } from "react";
import { GetUnits } from "../../../../Api/Actions/unitActions";
import { useSelector, useDispatch } from "react-redux";
import { GetCategories } from "../../../../Api/Actions/categoryActions";
import {
  GET_CATEGORY,
  GET_PRODUCT_TYPE,
  GET_UNITS,
} from "../../../../Redux/Constants";
import CardImage from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core";
import * as Yup from "yup";
import Button from "../../../../Components/Button";
import { Grid, Typography } from "@material-ui/core";
import TextField from "../../../../Components/TextInput";
import DropDownTextField from "../../../../Components/Dropdown/SearchableDropdown";
import BlankImage from "../../../../assets/images/BlankImage.png";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import TopTab from "../TopTab";
import { GetProductType } from "../../../../Api/Actions/productTypeActions";
import UnitForm from "../../Units/UnitForm";
import CategoryForm from "../../Category/CategoryForm";
import ItemTypeForm from "../../ItemType/itemTypeForm";
import "./Servicestyle.css";

const useStyles = makeStyles((theme) => ({
  ImageRootStyle: {
    height: 220,
    margin: "0 auto",
  },
  ImageFooterStyle: {
    paddingTop: 10,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    borderTop: "2px solid #707070",
  },
  addNewImageBtnStyle: {
    backgroundColor: "#1976D2",
  },
  cancelImageBtnStyle: {
    backgroundColor: "#D4D4D4",
    color: "#857D7D",
  },
}));

const ServiceForm = ({ serviceFormik, setShowTopNavBtn }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [ItemFlag, seteItemFlag] = useState("Product");
  var companyId;
  var userRecord = useSelector((state) => state.userReducer);
  companyId = userRecord.companyId;

  //*************************************GET Units Record in UnitReducer*************************/
  var unitRecord = useSelector((state) => state.unitReducer).map((unit) => ({
    title: unit.fullName,
    value: unit.id,
    key: unit.id,
  }));
  var CategoryRecord = useSelector((state) => state.categoryReducer).map(
    (category) => ({
      title: category.title,
      value: category.id,
      key: category.id,
    })
  );
  var ProductTypeRecord = useSelector((state) => state.productTypeReducer).map(
    (type) => ({
      title: type.name,
      value: type.id,
      key: type.id,
    })
  );
  const EditUnitValue = unitRecord
    .filter((x) => x.key === serviceFormik.values.itemUnit)
    .map((item) => ({
      title: item.title,
      value: item.value,
      key: item.key,
    }));
  const [newUnitValue, setNewUnitValue] = useState(EditUnitValue[0]);
  const [ShowUnitForm, setShowUnitForm] = useState(false);
  const [ShowCategoryForm, setShowCategoryForm] = useState(false);
  const [ShowProductTypeForm, setShowProductTypeForm] = useState(false);
  const [SelectedData, setSelectedData] = useState("");
  const imageHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        serviceFormik.setFieldValue("itemImage", reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  return (
    <>
      {ShowUnitForm === true && (
        <UnitForm
          open={ShowUnitForm}
          close={() => {
            setShowUnitForm(false);
          }}
          setShowUnitForm={setShowUnitForm}
          SelectedData={SelectedData}
        />
      )}
      {ShowCategoryForm === true && (
        <CategoryForm
          open={ShowCategoryForm}
          close={() => {
            setShowCategoryForm(false);
          }}
          SelectedData={SelectedData}
          setShowCategoryForm={setShowCategoryForm}
        />
      )}
      {ShowProductTypeForm === true && (
        <ItemTypeForm
          open={ShowProductTypeForm}
          close={() => {
            setShowProductTypeForm(false);
          }}
          SelectedData={SelectedData}
          setSelectedData={setSelectedData}
          setShowProductTypeForm={setShowProductTypeForm}
        />
      )}
      <form>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "40%" }}>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={8} md={10}>
                <TextField
                  variant="outlined"
                  id="itemCode"
                  label="Service Code *"
                  autoFocus
                  value={serviceFormik.values.itemCode}
                  onChange={serviceFormik.handleChange}
                  size="small"
                  fullWidth
                  error={
                    serviceFormik.touched.itemCode &&
                    Boolean(serviceFormik.errors.itemCode)
                  }
                  helperText={
                    serviceFormik.touched.itemCode &&
                    serviceFormik.errors.itemCode
                  }
                />
              </Grid>
            </Grid>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={8} md={10}>
                <TextField
                  variant="outlined"
                  id="itemName"
                  label="Service Name *"
                  value={serviceFormik.values.itemName}
                  onChange={serviceFormik.handleChange}
                  size="small"
                  fullWidth
                  error={
                    serviceFormik.touched.itemName &&
                    Boolean(serviceFormik.errors.itemName)
                  }
                  helperText={
                    serviceFormik.touched.itemName &&
                    serviceFormik.errors.itemName
                  }
                />
              </Grid>
            </Grid>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={8} md={10}>
                <TextField
                  variant="outlined"
                  id="itemBarCode"
                  label="IBAN Number"
                  value={serviceFormik.values.itemBarCode}
                  onChange={serviceFormik.handleChange}
                  size="small"
                  fullWidth
                  error={
                    serviceFormik.touched.itemBarCode &&
                    Boolean(serviceFormik.errors.itemBarCode)
                  }
                  helperText={
                    serviceFormik.touched.itemBarCode &&
                    serviceFormik.errors.itemBarCode
                  }
                />
              </Grid>
            </Grid>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={8} md={10}>
                <DropDownTextField
                  variant="standard"
                  id="itemUnit"
                  label="Service Unit *"
                  value={newUnitValue}
                  showAddButton
                  DropDowntitle="Add Unit"
                  ShowForm={setShowUnitForm}
                  onChange={(event, value) => {
                    serviceFormik.setFieldValue(
                      "itemUnit",
                      value === 0 ||
                        value === undefined ||
                        value === null ||
                        value.key === undefined ||
                        value.key === null
                        ? ""
                        : value.key.toString()
                    );
                    serviceFormik.setFieldValue(
                      "itemUnitTitle",
                      value === 0 ||
                        value === undefined ||
                        value === null ||
                        value.title === undefined ||
                        value.title === null
                        ? ""
                        : value.title
                    );
                    setNewUnitValue(
                      value === null || value === undefined ? "" : value
                    );
                  }}
                  size="small"
                  fullWidth
                  data={unitRecord}
                  error={
                    serviceFormik.touched.itemUnit &&
                    Boolean(serviceFormik.errors.itemUnit)
                  }
                  helperText={
                    serviceFormik.touched.itemUnit &&
                    serviceFormik.errors.itemUnit
                  }
                />
              </Grid>
            </Grid>
          </div>
          <div style={{ width: "40%" }}>
            <Grid container justifyContent="center">
              <Grid md={10} lg={7} xs={12}>
                <CardImage>
                  <CardActionArea>
                    <CardMedia
                      classes={{ root: classes.ImageRootStyle }}
                      image={
                        serviceFormik.values.itemImage === ""
                          ? BlankImage
                          : serviceFormik.values.itemImage
                      }
                    />
                  </CardActionArea>
                  <Typography
                    style={{
                      fontFamily: "Roboto",
                      fontSize: 11,
                      fontWeight: "normal",
                      color: "#AEA9A9",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    Drag and drop or upload image of your product
                  </Typography>
                  <CardActions classes={{ root: classes.ImageFooterStyle }}>
                    <Button
                      size="medium"
                      color="#D4D4D4"
                      variant="contained"
                      classes={{ root: classes.cancelImageBtnStyle }}
                      onClick={() => {
                        serviceFormik.setFieldValue("itemImage", "");
                      }}
                    >
                      Remove
                    </Button>
                    <label htmlFor="file-upload" className="custom-file-upload">
                      Upload
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      onChange={(e) => imageHandler(e)}
                    />
                  </CardActions>
                </CardImage>
              </Grid>
            </Grid>
          </div>
        </div>
        <Grid container sm={12} xs={12} md={12} lg={12} xl={12}>
          <TopTab
            serviceFormik={serviceFormik}
            CategoryRecord={CategoryRecord}
            ProductTypeRecord={ProductTypeRecord}
            setShowTopNavBtn={setShowTopNavBtn}
            setShowCategoryForm={setShowCategoryForm}
            setShowProductTypeForm={setShowProductTypeForm}
          />
        </Grid>
      </form>
    </>
  );
};

export default ServiceForm;
