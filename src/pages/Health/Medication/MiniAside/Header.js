import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import Button from "../../../../Components/Button";
import { Grid, Typography } from "@material-ui/core";
import TextField from "../../../../Components/TextInput";
import DropDownTextField from "../../../../Components/Dropdown/SearchableDropdown";
import BackDrop from "../../../../Components/BackDrop";
import Card from "../../../../Components/Card";
import BreadCrumb from "../../../../Components/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, useHistory, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MiniSideBar from "./MiniSideBar";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import PatientFiles from "../MiniAsidePages/PatientFilesPage";
import { Route, Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  CardrootStyle: {
    Width: 200,
    maxHeight: "100%",
    marginRight: "1%",
    paddingLeft: "2%",
    marginTop: "1%",
    marginBottom: "3%",
    height: "100%",
  },
  CardRoot: {
    width: "99%",
    marginTop: 50,
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
    padding: "8px 30px",
  },
}));
function Header({ heading, username, items }) {
  const [ShowSpinner, setShowSpinner] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  return (
    <>
      <Card root={classes.CardRoot}>
        <Grid container spacing={3}>
          <Grid
            item
            sm={12}
            xs={12}
            md={12}
            style={{ display: "flex", gap: "4px" }}
          >
            {items &&
              items.map((item, index) => (
                <>
                  {item.url && (
                    <RouterLink
                      to={item?.url === null ? "" : item.url}
                      key={item.url}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <Typography
                        variant="h6"
                        style={{
                          textTransform: "capitalize",
                          color: "#857D7D",
                          fontSize: 15,

                        }}
                      >
                        {item.title}
                      </Typography>
                    </RouterLink>
                  )}
                  {!item.url && (
                    <Typography
                      variant="h6"

                      style={{ textTransform: "capitalize", color: "#857D7D", fontSize: 15, }}
                    >
                      {item.title}
                    </Typography>
                  )}
                  {index !== items.length - 1 && (
                    <Typography
                      variant="h6"
                      style={{ textTransform: "capitalize", color: "#857D7D", fontSize: 15, }}
                    >
                      {">"}
                    </Typography>
                  )}
                </>
              ))}
          </Grid>
        </Grid>
      </Card>
    </>
  );
}

export default Header;
