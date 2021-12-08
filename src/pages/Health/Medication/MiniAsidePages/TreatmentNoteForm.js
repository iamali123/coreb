import React, { useState, useEffect } from "react";
import {
  CssBaseline,
  Container,
  Typography,
  TextareaAutosize,
  Grid,
  Divider,
  makeStyles,
  Checkbox,
  IconButton,
} from "@material-ui/core";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import MiniSideBar from "../MiniAside/MiniSideBar";
import Button from "../../../../Components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dateformat from "dateformat";
import BackDrop from "../../../../Components/BackDrop";
import Card from "../../../../Components/Card";
import { useParams, useHistory, useLocation } from "react-router-dom";
import Header from "../MiniAside/Header";
import DropDownTextField from "../../../../Components/Dropdown/SearchableDropdown";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import MedicinAvtar from "../../../../assets/images/Medicin.png";
import {
  treatmentNoteInitialValues,
  treatmentNoteValidationSchema,
} from "../../../../Schema/TreatmentNoteSchema/InitialValues";
import ItemCard from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import TextField from "../../../../Components/TextInput";
import { SearchOutlined } from "@material-ui/icons";
import Toast from "../../../../Components/Toast";
import { AddTreatmentNote } from "../../../../Api/Actions/Health/TreatmentNote/treatmentNoteAction";
import Swal from "sweetalert2";
import { ADD_TREATMENT_NOTE } from "../../../../Redux/Constants";
const useStyles = makeStyles((theme) => ({
  CardrootStyle: {
    Width: 200,
    maxHeight: "100%",
    marginRight: "1%",
    paddingLeft: "2%",
    marginTop: "1%",
    marginBottom: "3%",
    height: "100%",
    overflow: "hidden",
  },

  CancelButtonStyle: {
    marginRight: 20,
    backgroundColor: "#D4D4D4",
  },
  HeaderButtonStyle: {
    backgroundColor: "#D4D4D4",
  },

  MedicalAlertButtonStyle: {
    marginRight: 20,
    backgroundColor: "#1976D2",
  },

  savebtnStyle: {
    backgroundColor: "#1976D2",
    padding: "5px 25px",
  },
  root: {
    maxWidth: 300,
    marginBottom: 5,
    marginLeft: 5,
  },
  incrementBtn: {
    minWidth: 0,
    padding: 3,
    borderRadius: 0,
  },
  decrementBtn: {
    minWidth: 0,
    padding: 3,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 0,
  },
  qtyInput: {
    fontSize: 8,
  },
}));
const CheckTypes = {
  MORNING: "morning",
  MORNING_QTY: "morning_qty",
  AFTERNOON: "afternoon",
  AFTERNOON_QTY: "afternoon_qty",
  NIGHT: "night",
  NIGHT_QTY: "night_qty",
  REMARKS: "remarks",
};
function TreatmentNoteForm() {
  const medicinList = useSelector((item) => item.itemReducer);
  const [FilterValue, setFilterValue] = useState(medicinList);

  const classes = useStyles();
  const [ShowSpinner, setShowSpinner] = useState(false);
  const [MedicineCart, setMedicineCart] = useState([]);
  const [NewAppointmentValue, setNewAppointmentValue] = useState({
    title: "none",
    key: 0,
    id: 0,
  });
  let param = useParams();
  const history = useHistory();
  let location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer);
  const companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;
  const Patient = useSelector((state) => state.patientReducer).find(
    (e) => e.id === param.PatientId
  );
  let AppointmentList = useSelector(
    (appointment) => appointment.appointmentReducer
  )
    .filter((app) => app?.patientId === param?.PatientId)
    .map((item, index) => ({
      title:
        dateformat(item?.date, "dd mmm yyyy") +
        " " +
        new Date(item?.startTime)
          .toLocaleTimeString()
          .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") +
        "-" +
        new Date(item?.endTime)
          .toLocaleTimeString()
          .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") +
        " " +
        item?.appointmentTypeName,
      key: item?.id,
      value: item?.id,
    }));
  const TreatmentNoteFormik = useFormik({
    initialValues: treatmentNoteInitialValues,
    validationSchema: treatmentNoteValidationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      let TreatmentNoteObject = {
        id: values?.id ?? "",
        companyId: companyId,
        treatmentNumber: values?.treatmentNumber ?? "0",
        treatmentCode: values?.treatmentCode ?? "",
        description: values.description,
        appointmentId: values.appointmentId,
        createdDate: new Date(),
        treatmentNoteDetails: MedicineCart,
      };
      setShowSpinner(true);
      AddTreatmentNote(TreatmentNoteObject)
        .then((res) => {
          dispatch({ type: ADD_TREATMENT_NOTE, payload: res.data });
          setShowSpinner(false);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Saved",
            text: "Note Save SuccessFully",
            showConfirmButton: false,
            timer: 1500,
          });
          resetForm();
          setTimeout(() => {
            history.push(`/TreatmentNotes/PatientId=${param.PatientId}`);
          }, 1200);
        })
        .catch((error) => {
          if (error.response !== undefined) {
            Swal.fire({
              title: `${error.response.data.title}`,
              text: `${error.response.data.message}`,
              icon: "error",
              showConfirmButton: true,
            });
          } else {
            Swal.fire({
              title: "Error",
              text: `Network Error`,
              icon: "error",
              showConfirmButton: true,
            });
          }
          setShowSpinner(false);
        });
    },
  });
  const updateMedicineDoseCheck = (med, check, e) => {
    let update = MedicineCart.find((e) => e.itemDetailId === med.itemDetailId);
    if (update && check === CheckTypes.MORNING) {
      update.morningMedicineTime = !med.morningMedicineTime;
    }
    if (update && check === CheckTypes.AFTERNOON) {
      update.afterNoonMedicineTime = !med.afterNoonMedicineTime;
    }
    if (update && check === CheckTypes.NIGHT) {
      update.nightMedicineTime = !med.nightMedicineTime;
    }
    if (update && check === CheckTypes.MORNING_QTY) {
      update.morningMedicineQty = e;
    }
    if (update && check === CheckTypes.AFTERNOON_QTY) {
      update.afterNoonMedicineQty = e;
    }
    if (update && check === CheckTypes.NIGHT_QTY) {
      update.nightMedicineQty = e;
    }
    if (update && check === CheckTypes.REMARKS) {
      update.remarks = e;
    }
    const updatedCart = MedicineCart.map((cart) => {
      if (cart.itemDetailId === med.itemDetailId) {
        return {
          ...cart,
          ...update,
        };
      }
      return cart;
    });
    setMedicineCart(updatedCart);
  };
  const deleteMedicineFromCart = (med) => {
    setMedicineCart(MedicineCart.filter((e) => e.itemDetailId !== med));
  };

  const EditTreatmentNote = useSelector(
    (treatmentNote) => treatmentNote?.treatmentNoteReducer
  ).find((e) => e?.id?.toString() === location?.noteId?.toString());
  useEffect(() => {
    if (EditTreatmentNote) {
      setMedicineCart(EditTreatmentNote?.treatmentNoteDetails);
      TreatmentNoteFormik.setFieldValue(
        "appointmentId",
        EditTreatmentNote?.appointmentId
      );
      TreatmentNoteFormik.setFieldValue(
        "treatmentCode",
        EditTreatmentNote?.treatmentCode
      );
      TreatmentNoteFormik.setFieldValue(
        "treatmentNumber",
        EditTreatmentNote?.treatmentNumber
      );
      TreatmentNoteFormik.setFieldValue(
        "createdDate",
        EditTreatmentNote?.createdDate
      );
      TreatmentNoteFormik.setFieldValue("id", EditTreatmentNote?.id);
      TreatmentNoteFormik.setFieldValue(
        "description",
        EditTreatmentNote?.description
      );
      TreatmentNoteFormik.setFieldValue(
        "companyId",
        EditTreatmentNote?.companyId
      );
      setNewAppointmentValue(
        AppointmentList.find(
          (e) =>
            e.key.toString() === EditTreatmentNote?.appointmentId?.toString()
        )
      );
    }
  }, [EditTreatmentNote]);
  return (
    <>
      <BackDrop open={ShowSpinner} />
      <Header
        items={[
          {
            title: `Welcome ${
              user?.UserState?.username ?? user?.username ?? ""
            } to CoreB`,
            url: null,
            type: "",
          },
          {
            title: "TreatmentNote",
            url: `/TreatmentNotes/PatientId=${param?.PatientId}`,
            type: "",
          },
          {
            title: Patient?.firstName ?? "",
            url: null,
            type: "",
          },
        ]}
      />
      <Card root={classes.CardrootStyle}>
        <Grid item sm={12} md={6} lg={6} xl={6}>
          <Button
            variant="contained"
            color="primary"
            classes={{ root: classes.MedicalAlertButtonStyle }}
            onClick={() => {
              history.push(`/PatientInvoice`);
            }}
            size="large"
          >
            <FontAwesomeIcon
              icon={faPlus}
              fontSize="medium"
              color="#ffffff"
              cursor="pointer"
              title="Print"
            />{" "}
            <Typography
              style={{
                fontFamily: "Roboto",
                fontSize: 15,
                fontWeight: "bold",
                color: "#ffffff",
              }}
            >
              Add Medical Alert
            </Typography>
          </Button>
        </Grid>
        <Grid
          container
          style={{ borderTop: "1px solid black", marginTop: 5, height: "100%" }}
        >
          <Grid
            item
            sm={3}
            lg={2}
            md={3}
            xl={2}
            style={{
              paddingLeft: 5,
              borderRight: "1px solid black",
              height: "100%",
            }}
          >
            <MiniSideBar />
          </Grid>
          <Grid container sm={9} md={9} lg={10} xl={10}>
            <Grid
              item
              sm={6}
              md={6}
              lg={6}
              xl={6}
              style={{
                paddingLeft: 5,
                marginTop: 10,
              }}
            >
              <Grid item sm={11} md={11} lg={11} xl={11}>
                <DropDownTextField
                  variant="standard"
                  id="appointmentId"
                  label="Appointment *"
                  value={NewAppointmentValue}
                  size="small"
                  fullWidth
                  data={AppointmentList}
                  onChange={(event, value) => {
                    console.log("value", value);
                    TreatmentNoteFormik.setFieldValue(
                      "appointmentId",
                      value === null ||
                        value === undefined ||
                        value.key === null ||
                        value.key === undefined
                        ? ""
                        : value.key.toString()
                    );
                    setNewAppointmentValue(
                      value === null || value === undefined
                        ? { title: "none", key: 0, id: 0 }
                        : value
                    );
                  }}
                />
              </Grid>
              <Grid
                item
                sm={11}
                md={11}
                lg={11}
                xl={11}
                style={{ paddingLeft: 5, marginTop: 10 }}
              >
                <TextareaAutosize
                  maxRows={4}
                  id="description"
                  aria-label="maximum height"
                  placeholder="Presenting Symptoms"
                  value={TreatmentNoteFormik.values.description}
                  onChange={TreatmentNoteFormik.handleChange}
                  style={{ height: 100, fontFamily: "Roboto", width: "95%" }}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid
                container
                sm={12}
                md={12}
                lg={12}
                xl={12}
                style={{
                  paddingLeft: 5,
                  marginTop: 10,
                  overflowY: "scroll",
                  maxHeight: 550,
                }}
              >
                {MedicineCart?.map((cart, index) => {
                  return (
                    <MedicineCartComponent
                      medicine={cart}
                      updateMedicineDoseCheck={updateMedicineDoseCheck}
                      deleteMedicineFromCart={deleteMedicineFromCart}
                    />
                  );
                })}
              </Grid>
            </Grid>
            <Grid
              item
              sm={6}
              md={6}
              lg={6}
              xl={6}
              style={{
                border: "1px solid black",
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                overflowY: "scroll",
                maxHeight: 550,
                minHeight: 550,
              }}
            >
              <Grid container style={{ marginTop: 10 }} justifyContent="center">
                <Grid item sm={11} md={11} lg={11} xl={11}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Search"
                    InputProps={{
                      endAdornment: (
                        <IconButton>
                          <SearchOutlined />
                        </IconButton>
                      ),
                    }}
                    onChange={(r) => {
                      let searchItems = medicinList?.filter((e) =>
                        e?.itemName
                          ?.toUpperCase()
                          ?.includes(r.target.value.toUpperCase())
                      );
                      setFilterValue(searchItems);
                    }}
                  />
                </Grid>
              </Grid>
              {FilterValue?.length > 0 ? (
                FilterValue?.map((item, index) => {
                  return (
                    <>
                      <Grid item sm={6} md={6} lg={6} xl={6} key={index}>
                        <ItemCardComponent
                          item={item}
                          MedicineCart={MedicineCart}
                          setMedicineCart={setMedicineCart}
                        />
                      </Grid>
                    </>
                  );
                })
              ) : (
                <Grid container justifyContent="center">
                  <Grid item sm={11} md={11} lg={11} xl={11}>
                    <Typography
                      variant="h4"
                      component="p"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        color: "#857D7D",
                      }}
                    >
                      No Record Found
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </Grid>
            <Grid container justifyContent="flex-end" style={{ marginTop: 40 }}>
              <Grid
                container
                sm={6}
                md={6}
                lg={6}
                xl={6}
                justifyContent="flex-end"
              >
                <Grid item sm={3} md={3} lg={3} xl={3}>
                  <Button
                    variant="contained"
                    color="#857D7D"
                    classes={{ root: classes.CancelButtonStyle }}
                    onClick={() => {
                      window.open(
                        `/Patient/PatientId=${param.PatientId}`,
                        "_blank"
                      );
                    }}
                    size="small"
                  >
                    <Typography
                      style={{
                        fontFamily: "Roboto",
                        fontSize: 15,
                        fontWeight: "bold",
                        paddingLeft: 3,
                      }}
                    >
                      Cancel
                    </Typography>
                  </Button>
                </Grid>
                <Grid item sm={3} md={3} lg={3} xl={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    classes={{ root: classes.savebtnStyle }}
                    onClick={TreatmentNoteFormik.handleSubmit}
                    size="small"
                  >
                    <Typography
                      style={{
                        fontFamily: "Roboto",
                        fontSize: 15,
                        fontWeight: "bold",
                        paddingLeft: 3,
                      }}
                    >
                      Save
                    </Typography>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
function ItemCardComponent(props) {
  const classes = useStyles();
  const [openToast, setOpenToast] = useState(false);
  const AddMedicinIntoCart = (medicine) => {
    let IsMedicineExistInCart = props.MedicineCart.find(
      (e) => e.itemDetailId === medicine.itemDetailId
    );
    if (IsMedicineExistInCart) {
      setOpenToast(true);
    } else {
      props.setMedicineCart([...props.MedicineCart, medicine]);
    }
  };

  return (
    <>
      {openToast && (
        <Toast
          open={openToast}
          handleClose={() => {
            setOpenToast(false);
          }}
          message="Medicine Already in a cart !!!"
        />
      )}

      <ItemCard className={classes.root}>
        <CardActionArea>
          <CardMedia
            component="img"
            alt="Contemplative Reptile"
            height="100"
            image={
              props.item.itemImage !== "" ? props.item.itemImage : MedicinAvtar
            }
            title={props?.item?.itemName ?? "N/A"}
            style={{ objectFit: "scale-down", borderBottom: "1px solid grey" }}
            onClick={() => {
              let Medicine = {
                id: "0",
                itemDetailId: props?.item?.itemId,
                itemDetailCode: props?.item?.itemCode,
                itemDetailName: props?.item?.itemName,
                morningMedicineTime: true,
                morningMedicineQty: 1,
                afterNoonMedicineTime: true,
                afterNoonMedicineQty: 1,
                nightMedicineTime: true,
                nightMedicineQty: 1,
                remarks: "",
                treatmentNoteId: "0",
              };
              AddMedicinIntoCart(Medicine);
            }}
          />
          <CardContent style={{ backgroundColor: "#D6D6D6" }}>
            <Typography
              gutterBottom
              variant="p"
              component="h4"
              style={{ color: "#1976D2" }}
            >
              {props.item.itemName}
            </Typography>
            <Typography
              gutterBottom
              variant="p"
              component="h4"
              style={{ color: "#1976D2" }}
            >
              {props.item.itemCode}
            </Typography>
          </CardContent>
        </CardActionArea>
      </ItemCard>
    </>
  );
}
function MedicineCartComponent(props) {
  const classes = useStyles();
  return (
    <>
      <Grid
        container
        style={{ backgroundColor: "#D4D4D4" }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item sm={6} md={6} lg={6} xl={6}>
          <Typography variant="h6" component="p">
            {props?.medicine?.itemDetailCode} -{" "}
            {props?.medicine?.itemDetailName}
          </Typography>
        </Grid>
        <Grid
          item
          sm={6}
          md={6}
          lg={6}
          xl={6}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <FontAwesomeIcon
            icon={faTrash}
            size="md"
            color="#DC143C"
            title="Delete"
            style={{ marginRight: 10, cursor: "pointer" }}
            onClick={() => {
              props.deleteMedicineFromCart(props?.medicine?.itemDetailId);
            }}
          />
        </Grid>
      </Grid>
      <Grid container alignItems="center" justifyContent="space-evenly">
        <Grid item sm={4} md={4} lg={3} xl={3}>
          <Checkbox
            size="small"
            style={{ paddingRight: 0 }}
            checked={props?.medicine?.morningMedicineTime}
            onChange={() => {
              props.updateMedicineDoseCheck(
                props?.medicine,
                CheckTypes.MORNING
              );
            }}
          />
          <span style={{ fontSize: 10, fontWeight: "bold" }}>Morning</span>
        </Grid>
        <Grid item sm={4} md={4} lg={3} xl={3}>
          <Checkbox
            checked={props?.medicine?.afterNoonMedicineTime}
            size="small"
            style={{ paddingRight: 0 }}
            onChange={() => {
              props.updateMedicineDoseCheck(
                props?.medicine,
                CheckTypes.AFTERNOON
              );
            }}
          />
          <span style={{ fontSize: 10, fontWeight: "bold" }}>Afternoon</span>
        </Grid>
        <Grid item sm={4} md={4} lg={3} xl={3}>
          <Checkbox
            size="small"
            style={{ paddingRight: 0 }}
            checked={props?.medicine?.nightMedicineTime}
            onChange={() => {
              props.updateMedicineDoseCheck(props?.medicine, CheckTypes.NIGHT);
            }}
          />{" "}
          <span style={{ fontSize: 10, fontWeight: "bold" }}>Night</span>
        </Grid>
      </Grid>
      <Grid
        container
        style={{ display: "flex", justifyContent: "space-around" }}
      >
        <Grid item sm={4} md={4} lg={2} xl={2}>
          <TextField
            variant="outlined"
            label="Mor Qty"
            id="morningMedicineQty"
            value={props?.medicine?.morningMedicineQty}
            onChange={(e) => {
              props.updateMedicineDoseCheck(
                props?.medicine,
                CheckTypes.MORNING_QTY,
                e.target.value
              );
            }}
          />
        </Grid>
        <Grid item sm={4} md={4} lg={2} xl={2}>
          <TextField
            variant="outlined"
            label="Noon Qty"
            id="afterNoonMedicineQty"
            value={props?.medicine?.afterNoonMedicineQty}
            onChange={(e) => {
              props.updateMedicineDoseCheck(
                props?.medicine,
                CheckTypes.AFTERNOON_QTY,
                e.target.value
              );
            }}
          />
        </Grid>
        <Grid item sm={4} md={4} lg={2} xl={2}>
          <TextField
            variant="outlined"
            label="Night Qty"
            id="nightMedicineQty"
            value={props?.medicine?.nightMedicineQty}
            onChange={(e) => {
              props.updateMedicineDoseCheck(
                props?.medicine,
                CheckTypes.NIGHT_QTY,
                e.target.value
              );
            }}
          />
        </Grid>
      </Grid>
      <Grid container justifyContent="center">
        <Grid item sm={12} md={12} lg={10} xl={10} style={{ marginTop: 15 }}>
          <TextField
            variant="outlined"
            fullWidth
            label="Remarks"
            id="remarks"
            value={props?.medicine?.remarks}
            onChange={(e) => {
              props.updateMedicineDoseCheck(
                props?.medicine,
                CheckTypes.REMARKS,
                e.target.value
              );
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default TreatmentNoteForm;
