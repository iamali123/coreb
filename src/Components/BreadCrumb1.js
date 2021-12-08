import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { Grid, Typography } from "@material-ui/core";
import Card from "./Card";
import { useLocation, useParams, useHistory, Link } from "react-router-dom";
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
    margin: "0 auto",
    width: "98%",
    marginTop: 50,
  },
}));
function BreadCrumb1({ items, pageName, show }) {
  const [ShowSpinner, setShowSpinner] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  if (show) {
    return (
      <>
        <Card root={classes.CardRoot}>
          <Grid container>
            <Grid item sm={12} xs={12} md={12} lg={12}>
              <Typography
                style={{ fontFamily: "Roboto", fontSize: 30, color: "#857D7D" }}
              >
                {pageName}
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
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
                        style={{
                          textTransform: "capitalize",
                          color: "#857D7D",
                          fontSize: 15,
                        }}
                      >
                        {item.title}
                      </Typography>
                    )}
                    {index !== items.length - 1 && (
                      <Typography
                        variant="h6"
                        style={{
                          textTransform: "capitalize",
                          color: "#857D7D",
                          fontSize: 15,
                        }}
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
  } else {
    return (
      <Grid container>
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
                      fontSize: 15,
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
                    style={{
                      textTransform: "capitalize",
                      color: "#857D7D",
                      fontSize: 15,
                    }}
                  >
                    {item.title}
                  </Typography>
                )}
                {index !== items.length - 1 && (
                  <Typography
                    variant="h6"
                    style={{
                      textTransform: "capitalize",
                      color: "#857D7D",
                      fontSize: 15,
                    }}
                  >
                    {">"}
                  </Typography>
                )}
              </>
            ))}
        </Grid>
      </Grid>
    );
  }
}

export default BreadCrumb1;
