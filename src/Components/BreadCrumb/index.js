import React from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { makeStyles } from "@material-ui/core";
import { Route, Link as RouterLink } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { Grid } from "@material-ui/core";
import Card from "../Card";
const useStyles = makeStyles((theme) => ({
  root: {
    fontWeight: "700",
    color: "black",
    fontSize: 15,
    textTransform: "capitalize",
    fontFamily: "roboto",
  },
  CardRoot: {
    margin: "0 auto",
    width: "98%",
    marginTop: 50,
  },
}));
export default function Index({ pathname, pageName, show }) {
  const classes = useStyles();
  const pathnames = pathname.split("/").filter((x) => x);
  const user = useSelector((user) => user.userReducer);

  if (show === true) {
    return (
      <Card root={classes.CardRoot}>
        <Grid container spacing={3}>
          <Grid item sm={12} xs={12} md={12} lg={12}>
            <Typography
              style={{ fontFamily: "Roboto", fontSize: 30, color: "#857D7D" }}
            >
              {pageName}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item sm={6} xs={6} md={6}>
            <Typography style={{ textTransform: "capitalize" }}>
              <Route>
                <Breadcrumbs
                  aria-label="Breadcrumb"
                  separator={<NavigateNextIcon fontSize="medium" />}
                >
                  {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join("/")}`;

                    return last ? (
                      <Typography
                        variant="h6"
                        key={to}
                        color="inherit"
                        classes={{ root: classes.root }}
                      >
                        {value}
                      </Typography>
                    ) : (
                      <RouterLink
                        to={to}
                        key={to}
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <Typography
                          variant="h6"
                          key={to}
                          style={{ textTransform: "capitalize" }}
                        >
                          {value}
                        </Typography>
                      </RouterLink>
                    );
                  })}
                </Breadcrumbs>
              </Route>
            </Typography>
          </Grid>
        </Grid>
      </Card>
    );
  } else {
    return (
      <Route>
        <Breadcrumbs
          aria-label="Breadcrumb"
          separator={<NavigateNextIcon fontSize="medium" />}
        >
          {pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;

            return last ? (
              <Typography
                variant="h6"
                key={to}
                color="inherit"
                classes={{ root: classes.root }}
              >
                {value}
              </Typography>
            ) : (
              <RouterLink
                to={to}
                key={to}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <Typography variant="h6" key={to}>
                  {value}
                </Typography>
              </RouterLink>
            );
          })}
        </Breadcrumbs>
      </Route>
    );
  }
}
