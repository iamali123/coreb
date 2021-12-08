import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import TextField from "../../../Components/TextInput";
import DropDownTextField from "../../../Components/Dropdown/SearchableDropdown";
import { useSelector } from "react-redux";
import MuiPhoneNumber from "material-ui-phone-number";
import { ContactType } from "../../../Enums/PatientEnum";

const PatientContactInformationForm = ({ patientFormik, run, setrun }) => {
  var EditContactTypeValue;
  var EditCountryValue;
  var formik = patientFormik;
  var ContactTypeList = ContactType.map((contact) => ({
    title: contact.Title,
    value: contact.value,
    key: contact.value,
  }));
  var countryRecord = useSelector((state) => state.countryReducer).map(
    (country) => ({
      title: country.countryName,
      value: country.countryId,
      key: country.countryId,
    })
  );
  const [NewContactTypeValue, setNewContactTypeValue] = useState(
    EditContactTypeValue === undefined ? [] : EditContactTypeValue[0]
  );
  const [newCountryValue, setnewCountryValue] = useState(
    EditCountryValue === undefined ? [] : EditCountryValue[0]
  );
  useEffect(() => {
    EditContactTypeValue = ContactTypeList.filter(
      (x) => x.key.toString() === formik.values.numberType.toString()
    ).map((contact) => ({
      title: contact.title,
      value: contact.value,
      key: contact.value,
    }));
    EditCountryValue = countryRecord
      .filter((x) => x.key.toString() === formik.values.countryId.toString())
      .map((item) => ({
        title: item.title,
        value: item.value,
        key: item.key,
      }));
    setNewContactTypeValue(EditContactTypeValue[0]);
    setnewCountryValue(EditCountryValue[0]);
  }, [run]);
  return (
    <>
      <Grid container style={{ marginTop: 20 }}>
        <Grid xs={6} sm={3} md={3} lg={2} xl={1}>
          <DropDownTextField
            variant="standard"
            id="numberType"
            label="Number Type"
            value={NewContactTypeValue}
            size="small"
            fullWidth
            onChange={(event, value) => {
              formik.setFieldValue(
                "numberType",
                value === null || value === undefined
                  ? ""
                  : value.key.toString()
              );
              formik.setFieldValue(
                "numberType",
                value === null ||
                  value === undefined ||
                  value.key === null ||
                  value.key === undefined
                  ? ""
                  : value.key.toString()
              );

              setNewContactTypeValue(
                value === null || value === undefined ? "" : value
              );
            }}
            data={ContactTypeList}
          />
        </Grid>
        <Grid xs={8} sm={5} md={5} lg={5} style={{ marginTop: 5 }}>
          <MuiPhoneNumber
            variant="outlined"
            name="contactNumber"
            id="contactNumber"
            label="Phone Number"
            defaultCountry={"pk"}
            style={{ width: "100%" }}
            size="small"
            value={formik.values.contactNumber}
            onChange={(e) => {
              formik.setFieldValue("contactNumber", e);
            }}
            error={
              formik.touched.contactNumber &&
              Boolean(formik.errors.contactNumber)
            }
            helperText={
              formik.touched.contactNumber && formik.errors.contactNumber
            }
          />
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: 20 }}>
        <Grid xs={12} sm={6} md={6} lg={6}>
          <TextField
            variant="outlined"
            id="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            size="small"
            fullWidth
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: 20 }}>
        <Grid xs={12} sm={6} md={6} lg={6}>
          <TextField
            variant="outlined"
            id="streetAddress"
            label="Street Address"
            value={formik.values.streetAddress}
            onChange={formik.handleChange}
            size="small"
            fullWidth
            error={
              formik.touched.streetAddress &&
              Boolean(formik.errors.streetAddress)
            }
            helperText={
              formik.touched.streetAddress && formik.errors.streetAddress
            }
          />
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: 20 }}>
        <Grid
          xs={12}
          sm={6}
          md={6}
          lg={6}
          container
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid xs={12} sm={5} md={5} lg={5}>
            <TextField
              variant="outlined"
              id="city"
              label="City"
              value={formik.values.city}
              onChange={formik.handleChange}
              size="small"
              fullWidth
              error={formik.touched.city && Boolean(formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
            />
          </Grid>
          <Grid xs={12} sm={5} md={5} lg={5}>
            <TextField
              variant="outlined"
              id="state"
              label="State"
              value={formik.values.state}
              onChange={formik.handleChange}
              size="small"
              fullWidth
              error={formik.touched.state && Boolean(formik.errors.state)}
              helperText={formik.touched.state && formik.errors.state}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: 20 }}>
        <Grid
          xs={12}
          sm={6}
          md={6}
          lg={6}
          container
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid xs={12} sm={5} md={5} lg={5}>
            <TextField
              variant="outlined"
              id="postalCode"
              label="postalCode"
              value={formik.values.postalCode}
              onChange={formik.handleChange}
              size="small"
              fullWidth
              error={
                formik.touched.postalCode && Boolean(formik.errors.postalCode)
              }
              helperText={formik.touched.postalCode && formik.errors.postalCode}
            />
          </Grid>
          <Grid xs={12} sm={5} md={5} lg={5}>
            <DropDownTextField
              variant="standard"
              id="country"
              label="Country"
              value={newCountryValue}
              size="small"
              fullWidth
              onChange={(event, value) => {
                formik.setFieldValue(
                  "countryId",
                  value === 0 ||
                    value === undefined ||
                    value === null ||
                    value.key === undefined ||
                    value.key === null
                    ? ""
                    : value.key.toString()
                );
                formik.setFieldValue(
                  "countryName",
                  value === 0 ||
                    value === undefined ||
                    value === null ||
                    value.title === undefined ||
                    value.title === null
                    ? ""
                    : value.title
                );
                setnewCountryValue(
                  value === null || value === undefined ? "" : value
                );
              }}
              data={countryRecord}
              error={
                formik.touched.countryId && Boolean(formik.errors.countryId)
              }
              helperText={formik.touched.countryId && formik.errors.countryId}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
export default PatientContactInformationForm;
