import React, { useState, useEffect } from "react";
import { GetUnits } from "../../../../Api/Actions/unitActions";
import { GetProductType } from "../../../../Api/Actions/productTypeActions";
import { GetCategories } from "../../../../Api/Actions/categoryActions";
import {
  GET_CATEGORY,
  GET_UNITS,
  GET_PRODUCT_TYPE,
} from "../../../../Redux/Constants";
import { useSelector, useDispatch } from "react-redux";
import CardImage from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core";
import Button from "../../../../Components/Button";
import { Grid, Typography } from "@material-ui/core";
import TextField from "../../../../Components/TextInput";
import DropDownTextField from "../../../../Components/Dropdown/SearchableDropdown";
import BlankImage from "../../../../assets/images/BlankImage.png";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import TopTab from "../TopTab";
import UnitForm from "../../Units/UnitForm";
import CategoryForm from "../../Category/CategoryForm";
import ItemTypeForm from "../../ItemType/itemTypeForm";
import "./Productstyle.css";
const useStyles = makeStyles((theme) => ({
  ImageRootStyle: {
    height: 170,
    margin: "0 auto",
  },
  ImageFooterStyle: {
    //paddingTop: 10,
    //marginTop: 10,
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

const ItemForm = ({ productFormik, setShowTopNavBtn, setShowSpinner }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  var companyId;
  var userRecord = useSelector((state) => state.userReducer);
  if (userRecord === undefined) {
    companyId = userRecord.userState.companyId;
  } else {
    companyId = userRecord.companyId;
  }

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
    .filter((x) => x.key === productFormik.values.itemUnit)
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
        productFormik.setFieldValue("itemImage", reader.result);
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
                  label="Product Code *"
                  autoFocus
                  value={productFormik.values.itemCode}
                  onChange={productFormik.handleChange}
                  size="small"
                  fullWidth
                  error={
                    productFormik.touched.itemCode &&
                    Boolean(productFormik.errors.itemCode)
                  }
                  helperText={
                    productFormik.touched.itemCode &&
                    productFormik.errors.itemCode
                  }
                />
              </Grid>
            </Grid>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={8} md={10}>
                <TextField
                  variant="outlined"
                  id="itemName"
                  label="Product Name *"
                  value={productFormik.values.itemName}
                  onChange={productFormik.handleChange}
                  size="small"
                  fullWidth
                  error={
                    productFormik.touched.itemName &&
                    Boolean(productFormik.errors.itemName)
                  }
                  helperText={
                    productFormik.touched.itemName &&
                    productFormik.errors.itemName
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
                  value={productFormik.values.itemBarCode}
                  onChange={productFormik.handleChange}
                  size="small"
                  fullWidth
                  error={
                    productFormik.touched.itemBarCode &&
                    Boolean(productFormik.errors.itemBarCode)
                  }
                  helperText={
                    productFormik.touched.itemBarCode &&
                    productFormik.errors.itemBarCode
                  }
                />
              </Grid>
            </Grid>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={8} md={10} lg={10} xl={10}>
                <DropDownTextField
                  variant="standard"
                  id="itemUnit"
                  label="Product Unit *"
                  value={newUnitValue}
                  showAddButton
                  size="small"
                  fullWidth
                  DropDowntitle="Add Unit"
                  onChange={(event, value) => {
                    productFormik.setFieldValue(
                      "itemUnit",
                      value === 0 ||
                        value === undefined ||
                        value === null ||
                        value.key === undefined ||
                        value.key === null
                        ? ""
                        : value.key.toString()
                    );
                    productFormik.setFieldValue(
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
                  data={unitRecord}
                  ShowForm={setShowUnitForm}
                  formik={productFormik}
                  error={
                    productFormik.touched.itemUnit &&
                    Boolean(productFormik.errors.itemUnit)
                  }
                  helperText={
                    productFormik.touched.itemUnit &&
                    productFormik.errors.itemUnit
                  }
                />
              </Grid>
            </Grid>
          </div>
          <div style={{ width: "35%" }}>
            <Grid container justifyContent="center">
              <Grid md={10} lg={7} xs={12}>
                <CardImage>
                  <CardActionArea>
                    <CardMedia
                      classes={{ root: classes.ImageRootStyle }}
                      image={
                        productFormik.values.itemImage === "" ||
                        productFormik.values.itemImage === "string"
                          ? BlankImage
                          : productFormik.values.itemImage
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
                        productFormik.setFieldValue("itemImage", "");
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
          <div style={{ width: "25%" }}></div>
        </div>
        <TopTab
          productFormik={productFormik}
          CategoryRecord={CategoryRecord}
          ProductTypeRecord={ProductTypeRecord}
          Flag="Product"
          setShowCategoryForm={setShowCategoryForm}
          setShowProductTypeForm={setShowProductTypeForm}
          setShowSpinner={setShowSpinner}
        />
      </form>
    </>
  );
};

export default ItemForm;
