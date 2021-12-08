import React, { useState, useEffect, useRef } from "react";
import {
  posSalesItemDetailsInitialValues,
  PosSalesItemDetailValidationSchema,
} from "../../../Schema/Sales/PosSales/InitialValues";
import { GET_BOM_MATERIALS } from "../../../Redux/Constants";
import DropDownTextField from "../../../Components/Dropdown/SearchableDropdown";
import Button from "../../../Components/Button";
import { makeStyles, Card } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";

import {
  Grid,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
} from "@material-ui/core";
import TextField from "../../../Components/TextInput";
import { GetBOMMaterials } from "../../../Api/Actions/bomDetailsAction";
import POSItemDetailsList from "./POSItemDetailsList";
import { Divider } from "semantic-ui-react";
import { DeleteForeverIcon } from "@material-ui/icons/DeleteForever";
import GridIcon from "@material-ui/icons/GridOn";
import ViewListIcon from "@material-ui/icons/ViewList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
function POSItemDetailsForm(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [run, setrun] = useState(false);

  const [showGrid, setShowGrid] = useState(true);

  const qtyRef = React.useRef();
  const priceRef = React.useRef();
  const totalPriceRef = React.useRef();
  const addRef = React.useRef();

  useEffect(() => {
    GetBOMMaterials(props.companyId)
      .then((res) => {
        dispatch({ type: GET_BOM_MATERIALS, payload: res.data });
      })
      .catch((error) => {
        console.log("error BOM Matrials", error.response);
      });
  }, []);
  var Materials = useSelector((state) => state.bomMaterialReducer).map(
    (material) => ({
      title: material.description,
      value: material.itemDetailId,
      key: material.itemDetailId,
      unitPrice: material.unitPrice,
      code: material.itemDetailCode,
    })
  );
  var EditMaterial;
  const itemDetailFormik = useFormik({
    initialValues: posSalesItemDetailsInitialValues,
    validationSchema: PosSalesItemDetailValidationSchema,
    onSubmit: (values, { resetForm }) => {
      let isDuplicateEntry = props.PosSalesMaterials.filter(
        (material) => material.itemDetailId === values.itemDetailId
      ).length;
      if (isDuplicateEntry > 0) {
        props.setPosSalesMaterials(
          props.PosSalesMaterials.map((material) => {
            if (material.itemDetailId === values.itemDetailId) {
              return {
                ...material,
                ...values,
              };
            } else {
              //console.log("Valuessad", values);
              return material;
            }
          })
        );
        resetForm();
        setrun(!run);
      } else {
        props.setPosSalesMaterials([...props.PosSalesMaterials, values]);
        resetForm();
        setrun(!run);
      }
    },
  });
  const [NewMaterialValue, setNewMaterialValue] = useState(
    EditMaterial === undefined ? [] : EditMaterial[0]
  );

  useEffect(() => {
    EditMaterial = Materials.filter(
      (x) => x.key === itemDetailFormik.values.itemDetailId
    ).map((item) => ({
      title: item.title,
      value: item.value,
      key: item.key,
      unitPrice: item.unitPrice,
      code: item.ItemDetailCode,
    }));
    setNewMaterialValue(EditMaterial[0]);

    qtyRef.current && qtyRef.current.focus();
  }, [run]);

  const EditposSalesItemDetail = (rowData) => {
    itemDetailFormik.setFieldValue("itemDetailId", rowData.itemDetailId);
    itemDetailFormik.setFieldValue("itemDetailName", rowData.itemDetailName);
    itemDetailFormik.setFieldValue("itemDetailCode", rowData.itemDetailCode);
    itemDetailFormik.setFieldValue("posSalesId", rowData.posSalesId);
    itemDetailFormik.setFieldValue("quantity", rowData.quantity);
    itemDetailFormik.setFieldValue("unitPrice", rowData.unitPrice);
    itemDetailFormik.setFieldValue("totalPrice", rowData.totalPrice);
    itemDetailFormik.setFieldValue("description", rowData.description);
    itemDetailFormik.setFieldValue("id", rowData.id);
    setrun(!run);
  };

  const POSDetail = (values, { resetForm }) => {
    // console.log("Materials", props.PosSalesMaterials);
    let isDuplicateEntry = props.PosSalesMaterials.filter(
      (material) =>
        material.itemDetailId.toString() === values.itemDetailId.toString()
    ).length;

    //console.log("values", values);
    //console.log("isDuplicateEntry", isDuplicateEntry);

    if (isDuplicateEntry > 0) {
      props.setPosSalesMaterials(
        props.PosSalesMaterials.map((material) => {
          if (material.itemDetailId === values.itemDetailId) {
            // console.log("IF", values);
            return {
              ...material,
              ...values,
            };
          } else {
            //console.log("ELSE", values);
            return material;
          }
        })
      );
      setrun(!run);
    } else {
      props.setPosSalesMaterials([...props.PosSalesMaterials, values]);

      setrun(!run);
    }
    values = resetForm;
  };

  const CalculateAmount = (v) => {
    let qty = v.quantity;
    let price = v.unitPrice;

    v.totalPrice = qty * price;
    //console.log("DisValue", v);
    POSDetail(v, posSalesItemDetailsInitialValues);
  };

  useEffect(() => {
    itemDetailFormik.setFieldValue(
      "totalPrice",
      itemDetailFormik.values.quantity * itemDetailFormik.values.unitPrice
    );
  }, [itemDetailFormik.values.quantity, itemDetailFormik.values.unitPrice]);
  return (
    <>
      <Divider variant="inset" component="li" />
      <Grid container justifyContent="space-between">
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <div
            style={{
              flex: 1,
              flexDirection: "row",
              display: "flex",
            }}
          >
            <GridIcon
              style={showGrid == true ? { color: "black" } : { color: "grey" }}
              onClick={() => {
                setShowGrid(true);
              }}
            />
            <ViewListIcon
              style={showGrid == false ? { color: "black" } : { color: "grey" }}
              onClick={() => {
                setShowGrid(false);
              }}
            />
          </div>
          <Divider variant="inset" component="li" />

          <form onSubmit={itemDetailFormik.handleSubmit}>
            <div style={{ width: "100%" }}>
              <Box
                sx={{
                  maxHeight: 450,
                  maxwidth: "50%",
                  bgcolor: "background.paper",
                  overflow: "auto",
                }}
              >
                {showGrid == false ? (
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                    }}
                  >
                    {Materials.map((l, i) => (
                      <>
                        <ListItem
                          alignItems="flex-start"
                          key={l.key}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            var ItemDetail;
                            ItemDetail = posSalesItemDetailsInitialValues;

                            ItemDetail.itemDetailId = l.key;
                            ItemDetail.itemDetailName = l.title;
                            ItemDetail.description = l.title;
                            ItemDetail.itemDetailCode = l.code;
                            ItemDetail.unitPrice = l.unitPrice;
                            ItemDetail.totalPrice = l.unitPrice * 1;
                            ItemDetail.quantity = 1;
                            POSDetail(
                              ItemDetail,
                              posSalesItemDetailsInitialValues
                            );
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              alt={l.title}
                              src={"/static/images/avatar/1.jpg"}
                            />
                          </ListItemAvatar>
                          <ListItemText>
                            <Typography
                              style={{
                                lineHeight: 2.5,
                              }}
                            >
                              {l.title}
                            </Typography>
                          </ListItemText>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </>
                    ))}
                  </List>
                ) : (
                  // <div style={{ display: "inline-flex", height: 400 }}>
                  <Grid
                    container
                    justifyContent="center"
                    spacing={1}
                    style={{ height: "400" }}
                  >
                    {Materials.map((l, i) => (
                      <Grid key={l.key} item>
                        <div
                          style={{
                            cursor: "pointer",
                            // //position: "relative",
                            height: 100,
                            width: 100,
                            padding: 5,
                            border: 1,
                            borderColor: "black",
                            borderStyle: "solid",
                            //margin: 5,
                            // boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                          }}
                          onClick={() => {
                            var ItemDetail;
                            ItemDetail = posSalesItemDetailsInitialValues;

                            ItemDetail.itemDetailId = l.key;
                            ItemDetail.itemDetailName = l.title;
                            ItemDetail.description = l.title;
                            ItemDetail.itemDetailCode = l.code;
                            ItemDetail.unitPrice = l.unitPrice;
                            ItemDetail.totalPrice = l.unitPrice * 1;
                            ItemDetail.quantity = 1;
                            POSDetail(
                              ItemDetail,
                              posSalesItemDetailsInitialValues
                            );
                          }}
                        >
                          <img
                            alt={l.code}
                            src={"../../../../public/logo192.png"}
                            style={{ height: 50, width: 50 }}
                          />

                          <Typography
                          // style={{
                          //   lineHeight: 2.5,
                          // }}
                          >
                            {l.title}
                          </Typography>
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </div>
          </form>
        </Grid>
        <Grid
          item
          xs={6}
          sm={6}
          md={6}
          lg={6}
          style={{
            borderLeft: 1,
            borderColor: "black",
          }}
        >
          <div
            style={{
              flexDirection: "row",
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 700,
            }}
          >
            <div
              style={{ width: "5%", display: "flex", justifyContent: "center" }}
            >
              #
            </div>
            <div
              style={{
                width: "40%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              Product
            </div>
            <div
              style={{
                width: "15%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              Quantity
            </div>
            <div
              style={{
                width: "15%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              Price
            </div>
            <div
              style={{
                width: "20%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              Amount
            </div>
            <div
              style={{ width: "5%", display: "flex", justifyContent: "center" }}
            ></div>
          </div>
          <Divider />
          <Box
            sx={{
              //width: 300,
              //margin: "0 auto 16px",
              maxHeight: 400,
              bgcolor: "background.paper",
              overflow: "auto",
            }}
          >
            {props?.PosSalesMaterials?.map((l, i) => {
              return (
                <div
                  id={l.id}
                  style={{
                    width: "100%",
                    borderBottom: 1,
                    borderBottomStyle: "solid",
                    borderBottomColor: "rgb(231,231,233)",
                  }}
                >
                  <div
                    style={{
                      flexDirection: "row",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "5%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {i + 1}
                    </div>
                    <div
                      style={{
                        width: "40%",
                        fontStyle: "calibri",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {l.description}
                    </div>
                    <div
                      style={{
                        width: "15%",
                      }}
                    >
                      <TextField
                        variant="outlined"
                        id="quantity"
                        placeholder="0"
                        value={l.quantity != 0 ? l.quantity : ""}
                        onChange={(e) => {
                          //console.log("Qty", e);
                          var q = e.target.value;
                          l.quantity = q;
                          CalculateAmount(l);
                        }}
                        size="small"
                        type="number"
                        fullWidth
                      />
                    </div>
                    <div style={{ width: "15%" }}>
                      <TextField
                        variant="outlined"
                        id="unitPrice"
                        placeholder="0"
                        value={l.unitPrice != 0 ? l.unitPrice : ""}
                        onChange={(e) => {
                          //console.log("Qty", e);
                          var p = e.target.value;
                          l.unitPrice = p;
                          CalculateAmount(l);
                        }}
                        size="small"
                        type="number"
                        fullWidth
                      />
                    </div>
                    <div
                      style={{
                        width: "20%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {l.totalPrice}
                    </div>
                    <div
                      style={{
                        width: "5%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        fontSize="medium"
                        color="#1976D2"
                        cursor="pointer"
                        title="Delete"
                        onClick={() => {
                          props.setPosSalesMaterials(
                            props.PosSalesMaterials.filter(
                              (posMaterials) =>
                                posMaterials.itemDetailId !== l.itemDetailId
                            )
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
const useStyles = makeStyles((theme) => ({
  AddNewBtnStyle: {
    backgroundColor: "#1976D2",
    color: "#FFFFFF",
  },
}));
export default POSItemDetailsForm;
