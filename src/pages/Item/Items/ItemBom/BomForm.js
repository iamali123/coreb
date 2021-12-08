import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Button from "../../../../Components/Button";
import { Grid, Typography, TextareaAutosize } from "@material-ui/core";
import TextField from "../../../../Components/TextInput";
import DropDownTextField from "../../../../Components/Dropdown/SearchableDropdown";
import ErrorAlert from "../../../../Components/Alert/ErrorAlert";
import SuccessAlert from "../../../../Components/Alert/SuccessAlert";
import DeleteAlert from "../../../../Components/Alert/ConfirmationAlert";
import BackDrop from "../../../../Components/BackDrop";
import Card from "../../../../Components/Card";
import BreadCrumb from "../../../../Components/BreadCrumb1";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, useHistory } from "react-router-dom";
import ProductFormModal from "../Product/ProductFormModal";
import {
  GetBOMDetail,
  GetBOMMaterials,
} from "../../../../Api/Actions/bomDetailsAction";
import { AddBOM, EditBOM } from "../../../../Api/Actions/bomActions";
import {
  ADD_BOM,
  EDIT_BOM,
  GET_BOM_DETAIL,
  GET_BOM_MATERIALS,
} from "../../../../Redux/Constants";
import {
  BomInitialValues,
  BomValidationSchema,
  BomMaterialInitialValues,
  BomMaterialValidationSchema,
} from "../../../../Schema/BOMSchema/InitialValues";
import { useFormik } from "formik";
import UnitForm from "../../Units/UnitForm";
import BomMaterialList from "./BomMaterialList";
import BomMaterialForm from "./BomMaterialForm";

const useStyles = makeStyles((theme) => ({
  CardrootStyle: {
    Width: 200,
    maxHeight: "100%",
    marginRight: "1%",
    paddingLeft: "2%",
    marginTop: "1%",
    marginBottom: "3%",
  },
  CardRoot: {
    width: "99%",
    marginTop: 50,
  },
  CancelButtonStyle: {
    marginRight: 20,
    backgroundColor: "#D4D4D4",
  },
  savebtnStyle: {
    backgroundColor: "#1976D2",
    padding: "8px 30px",
  },
}));

const BomForm = () => {
  const params = useParams();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  var itemId;
  var BomId;
  if (params.ProductId !== null || params.ProductId !== undefined) {
    itemId = params.ProductId;
  }
  if (params.BomId !== null || params.BomId !== undefined) {
    BomId = params.BomId;
  }

  const [showWarningAlert, setshowWarningAlert] = useState(false);
  const [showSuccessAlert, setshowSuccessAlert] = useState(false);
  const [showErrorAlert, setshowErrorAlert] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState([]);
  const [ShowSpinner, setShowSpinner] = useState(false);
  const [BOMMaterials, setBOMMaterials] = useState([]);
  const [ShowUnitForm, setShowUnitForm] = useState(false);
  const [ShowProductFormModal, setShowProductFormModal] = useState(false);
  const [run, setrun] = useState(false);
  var EditBomRecord;
  const user = useSelector((state) => state.userReducer);
  const companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;
  var EditBomDetailsValue;
  var itemRecord = useSelector((state) => state.itemReducer)
    .filter((e) => e.itemId === itemId)
    .map((d) => {
      return {
        itemCode: d.itemCode,
        itemName: d.itemName,
      };
    });
  //*************************************GET BOM DETAIL Record in BOM Details*************************/
  var BomDetails = useSelector((state) => state.bomDetailsReducer).map(
    (bom) => ({
      title: bom.description,
      value: bom.itemDetailId,
      key: bom.itemDetailId,
    })
  );

  const bomDetailFormik = useFormik({
    initialValues: BomInitialValues,
    validationSchema: BomValidationSchema,
    onSubmit: (values, { resetForm }) => {
      if (BOMMaterials.length > 0) {
        if (values.id === "") {
          const BOM = {
            id: "",
            bomCode: values.bomCode,
            bomNo: values.bomNo,
            bomName: values.bomName,
            itemDetailId: values.itemDetailId,
            itemCode: values.itemCode,
            itemName: values.itemName,
            description: values.description,
            stockValue: values.stockValue,
            companyId: companyId,
            itemId: itemId,
            billOfMaterialDetails: BOMMaterials,
          };
          setShowSpinner(true);
          AddBOM(BOM)
            .then((res) => {
              if (res.status === 200) {
                dispatch({ type: ADD_BOM, payload: res.data });
                setShowSpinner(false);
                setshowSuccessAlert(true);
                setTimeout(() => {
                  history.push(`/Product/ProductId=${itemId}`);
                }, 1200);
              }
            })
            .catch((error) => {
              if (error.response === undefined) {
                setErrorMessage({ message: "Network Error" });
              } else {
                setErrorMessage({ message: error.response.data.message });
              }
              setShowSpinner(false);
              setshowErrorAlert(true);
            });
        } else {
          const BOM = {
            id: values.id,
            bomCode: values.bomCode,
            bomNo: values.bomNo,
            bomName: values.bomName,
            itemDetailId: values.itemDetailId,
            itemCode: values.itemCode,
            itemName: values.itemName,
            description: values.description,
            stockValue: values.stockValue,
            companyId: companyId,
            itemId: itemId,
            billOfMaterialDetails: BOMMaterials,
          };
          setShowSpinner(true);
          EditBOM(BOM)
            .then((res) => {
              dispatch({ type: EDIT_BOM, payload: res.data });
              setShowSpinner(false);
              setshowSuccessAlert(true);
              setTimeout(() => {
                history.push(`/Product/ProductId=${itemId}`);
              }, 1200);
            })
            .catch((error) => {
              if (error.response === undefined) {
                setErrorMessage({ message: "Network Error" });
              } else {
                setErrorMessage({ message: error.response.data.message });
              }
              setShowSpinner(false);
              setshowErrorAlert(true);
            });
        }
      } else {
        setErrorMessage({ message: "Please Add Atleast One Bom Material" });
        setshowErrorAlert(true);
      }
    },
  });
  const bomMaterialFormik = useFormik({
    initialValues: BomMaterialInitialValues,
    validationSchema: BomMaterialValidationSchema,
    onSubmit: (values, { resetForm }) => {
      let isDuplicateEntry = BOMMaterials.filter(
        (material) => material.itemDetailId === values.itemDetailId
      ).length;
      if (isDuplicateEntry > 0) {
        setBOMMaterials(
          BOMMaterials.map((material) => {
            if (material.itemDetailId === values.itemDetailId) {
              return {
                ...material,
                ...values,
              };
            } else {
              return material;
            }
          })
        );
        resetForm();
        setrun(!run);
      } else {
        setBOMMaterials([...BOMMaterials, values]);
        resetForm();
        setrun(!run);
      }
    },
  });
  const [SelectedData, setSelectedData] = useState("");
  const [NewBomDetailValue, setNewBomDetailValue] = useState(
    EditBomDetailsValue === undefined ? [] : EditBomDetailsValue[0]
  );

  if (BomId !== undefined) {
    EditBomRecord = useSelector((state) => state.bomReducer).find(
      (e) => e.itemDetailId === BomId
    );
  }
  useEffect(() => {
    setBOMMaterials(EditBomRecord?.billOfMaterialDetails ?? []);
    if (EditBomRecord !== undefined) {
      bomDetailFormik.setFieldValue(
        "id",
        EditBomRecord !== undefined && EditBomRecord.id
      );
      bomDetailFormik.setFieldValue(
        "bomCode",
        EditBomRecord !== undefined && EditBomRecord.bomCode
      );
      bomDetailFormik.setFieldValue(
        "bomName",
        EditBomRecord !== undefined && EditBomRecord.bomName
      );
      bomDetailFormik.setFieldValue(
        "itemDetailId",
        EditBomRecord !== undefined && EditBomRecord.itemDetailId
      );
      bomDetailFormik.setFieldValue(
        "description",
        EditBomRecord !== undefined && EditBomRecord.description
      );
      bomDetailFormik.setFieldValue(
        "stockValue",
        EditBomRecord !== undefined && EditBomRecord.stockValue
      );
      bomDetailFormik.setFieldValue(
        "itemId",
        EditBomRecord !== undefined && EditBomRecord.itemId
      );
      setrun(!run);
    }
  }, [EditBomRecord]);
  useEffect(() => {
    GetBOMDetail(companyId, itemId)
      .then((res) => {
        dispatch({ type: GET_BOM_DETAIL, payload: res.data });
      })
      .catch((error) => { });
    GetBOMMaterials(companyId)
      .then((res) => {
        dispatch({ type: GET_BOM_MATERIALS, payload: res.data });
      })
      .catch((error) => { });
    bomDetailFormik.setFieldValue("itemName", itemRecord?.[0]?.itemName ?? "");
    bomDetailFormik.setFieldValue("itemCode", itemRecord?.[0]?.itemCode ?? "");
  }, [ShowProductFormModal]);

  useEffect(() => {
    EditBomDetailsValue = BomDetails.filter(
      (x) => x.key === bomDetailFormik.values.itemDetailId
    ).map((item) => ({
      title: item.title,
      value: item.value,
      key: item.key,
    }));
    setNewBomDetailValue(EditBomDetailsValue[0]);
  }, [run]);

  const EditBomMaterialHandler = (rowData) => {
    bomMaterialFormik.setFieldValue("itemDetailId", rowData.itemDetailId);
    bomMaterialFormik.setFieldValue("itemDetailName", rowData.itemDetailName);
    bomMaterialFormik.setFieldValue("quantity", rowData.quantity);
    bomMaterialFormik.setFieldValue("unitId", rowData.unitId);
    bomMaterialFormik.setFieldValue("unitName", rowData.unitName);
    bomMaterialFormik.setFieldValue("unitPrice", rowData.unitPrice);
    bomMaterialFormik.setFieldValue("description", rowData.description);
    bomMaterialFormik.setFieldValue("id", rowData.id);
    setrun(!run);
  };
  const DeleteBomMaterialHandler = () => {
    setBOMMaterials(
      BOMMaterials.filter(
        (bomMaterial) => bomMaterial.itemDetailId !== SelectedData.itemDetailId
      )
    );
    setshowWarningAlert(false);
    setSelectedData("");
  };
  return (
    <>
      <BackDrop open={ShowSpinner} />
      {ShowUnitForm === true && (
        <UnitForm
          open={ShowUnitForm}
          close={() => {
            setShowUnitForm(false);
          }}
          SelectedData={SelectedData}
          setSelectedData={setSelectedData}
          setErrorMessage={setErrorMessage}
          setshowSuccessAlert={setshowSuccessAlert}
          setshowErrorAlert={setshowErrorAlert}
        />
      )}
      {ShowProductFormModal === true && (
        <ProductFormModal
          open={ShowProductFormModal}
          close={() => {
            setShowProductFormModal(false);
          }}
          SelectedData={SelectedData}
          setSelectedData={setSelectedData}
          setErrorMessage={setErrorMessage}
          setshowSuccessAlert={setshowSuccessAlert}
          setshowErrorAlert={setshowErrorAlert}
        />
      )}

      {showSuccessAlert && (
        <SuccessAlert
          message="Updated SuccessFully"
          title="Success"
          open={SuccessAlert}
          onClick={setshowSuccessAlert}
        />
      )}
      {showWarningAlert && (
        <DeleteAlert
          title="Are You Sure ? "
          message={"you want to delete this."}
          open={showWarningAlert}
          onClose={() => {
            setshowWarningAlert(false);
            setSelectedData("");
          }}
          onClick={DeleteBomMaterialHandler}
        />
      )}
      {showErrorAlert && (
        <ErrorAlert
          open={setshowErrorAlert}
          onClick={() => {
            setshowErrorAlert(false);
          }}
          title={ErrorMessage.title}
          message={ErrorMessage.message}
        />
      )}

      <Card root={classes.CardRoot}>
        <Grid container spacing={3}>
          <Grid item sm={6} xs={6} md={6}>

            <BreadCrumb
              items={[
                {
                  title: `Welcome ${user?.UserState?.username ?? user?.username ?? ""
                    } to CoreB`,
                  url: "/",
                  type: "",
                },
                {
                  title: `Product ${itemRecord[0]?.itemName}`,
                  url: `/Product/productId=${params?.ProductId}`,
                  type: "",
                },
                {
                  title: "Product BOM",
                  url: null,
                  type: "",
                },
              ]}
              show={false}
            />
          </Grid>

          <Grid
            item
            sm={6}
            xs={6}
            md={6}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignSelf: "flex-end",
            }}
          >
            <Button
              variant="contained"
              color="#857D7D"
              classes={{ root: classes.CancelButtonStyle }}
              onClick={() => {
                history.push(`/Product/ProductId=${itemId}`);
              }}
              size="large"
            >
              <Typography
                style={{
                  fontFamily: "Roboto",
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                Cancel
              </Typography>
            </Button>
            <Button
              variant="contained"
              color="primary"
              classes={{ root: classes.savebtnStyle }}
              size="large"
              onClick={bomDetailFormik.handleSubmit}
            >
              <Typography
                style={{
                  fontFamily: "Roboto",
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                Save
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Card>
      <Card root={classes.CardrootStyle}>
        <form onSubmit={bomDetailFormik.handleSubmit}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="itemCode"
                label="Product Code"
                disabled
                value={bomDetailFormik.values.itemCode}
                onChange={bomDetailFormik.handleChange}
                size="small"
                fullWidth
                error={
                  bomDetailFormik.touched.itemCode &&
                  Boolean(bomDetailFormik.errors.itemCode)
                }
                helperText={
                  bomDetailFormik.touched.itemCode &&
                  bomDetailFormik.errors.itemCode
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="itemName"
                label="Product Name"
                value={bomDetailFormik.values.itemName}
                onChange={bomDetailFormik.handleChange}
                size="small"
                disabled
                fullWidth
                error={
                  bomDetailFormik.touched.itemName &&
                  Boolean(bomDetailFormik.errors.itemName)
                }
                helperText={
                  bomDetailFormik.touched.itemName &&
                  bomDetailFormik.errors.itemName
                }
              />
            </Grid>
          </Grid>

          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            style={{ marginTop: 20 }}
          >
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DropDownTextField
                variant="standard"
                id="itemDetailId"
                label="Item Variant *"
                value={NewBomDetailValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  bomDetailFormik.setFieldValue(
                    "itemDetailId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  bomDetailFormik.setFieldValue(
                    "bomName",
                    value === null || value === undefined ? "" : value.title
                  );
                  setNewBomDetailValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={BomDetails}
                formik={bomDetailFormik}
                error={
                  bomDetailFormik.touched.itemDetailId &&
                  Boolean(bomDetailFormik.errors.itemDetailId)
                }
                helperText={
                  bomDetailFormik.touched.itemDetailId &&
                  bomDetailFormik.errors.itemDetailId
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="bomName"
                label="BOM Name"
                value={bomDetailFormik.values.bomName}
                onChange={bomDetailFormik.handleChange}
                size="small"
                disabled
                fullWidth
                error={
                  bomDetailFormik.touched.bomName &&
                  Boolean(bomDetailFormik.errors.bomName)
                }
                helperText={
                  bomDetailFormik.touched.bomName &&
                  bomDetailFormik.errors.bomName
                }
              />
            </Grid>
          </Grid>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <div style={{ width: "40%" }}>
              <TextareaAutosize
                maxRows={4}
                aria-label="maximum height"
                placeholder="Description"
                style={{ height: 100 }}
                value={bomDetailFormik.values.description}
                onChange={bomDetailFormik.handleChange}
                size="small"
                fullWidth
                error={
                  bomDetailFormik.touched.description &&
                  Boolean(bomDetailFormik.errors.description)
                }
                helperText={
                  bomDetailFormik.touched.description &&
                  bomDetailFormik.errors.description
                }
              />
            </div>
            <div
              style={{
                width: "50%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <Grid xs={12} sm={10} md={10} lg={10}>
                <TextField
                  variant="outlined"
                  id="stockValue"
                  label="Stock Value"
                  value={bomDetailFormik.values.stockValue}
                  onChange={bomDetailFormik.handleChange}
                  size="small"
                  fullWidth
                  error={
                    bomDetailFormik.touched.stockValue &&
                    Boolean(bomDetailFormik.errors.stockValue)
                  }
                  helperText={
                    bomDetailFormik.touched.stockValue &&
                    bomDetailFormik.errors.stockValue
                  }
                />
              </Grid>
            </div>
          </div>
        </form>
        <BomMaterialForm
          bomMaterialFormik={bomMaterialFormik}
          setShowProductFormModal={setShowProductFormModal}
          setShowUnitForm={setShowUnitForm}
          run={run}
        />
        <BomMaterialList
          BOMMaterials={BOMMaterials}
          setSelectedData={setSelectedData}
          setshowWarningAlert={setshowWarningAlert}
          EditBomMaterialHandler={EditBomMaterialHandler}
        />
      </Card>
    </>
  );
};

export default BomForm;
