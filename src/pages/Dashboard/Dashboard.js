import * as React from "react";
import { styled } from "@material-ui/styles";
import { ThemeProvider, createTheme } from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import Chart from "../../Components/Chart/Chart";
import ChartPR from "../../Components/Chart/ChartPR";
import ChartSL from "../../Components/Chart/ChartSL";
import ChartEXP from "../../Components/Chart/ChartExp";
import Deposits from "../../Components/Chart/deposits";
import CardReceiveable from "../../Components/Chart/cardReceive";
import CardPayables from "../../Components/Chart/cardPayable";
import CardSales from "../../Components/Chart/cardSale";
import CardUser from "../../Components/Chart/cardUsers";
import {
  ArrowDownward,
  ArrowUpward,
  CalendarToday,
  CalendarTodayTwoTone,
  CalendarViewDay,
} from "@material-ui/icons";
import BreadCrumb from "../../Components/BreadCrumb/index";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const mdTheme = createTheme();

function DashboardContent() {
  return (
    <ThemeProvider theme={mdTheme}>
      <BreadCrumb pathname={""} pageName={"Welcome to CoreB"} show={true} />
      <Box sx={{ display: "flex" }}>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  <CardReceiveable />
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  <CardPayables />
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  <CardSales />
                </Paper>
              </Grid>

              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  <CardUser />
                </Paper>
              </Grid>

              {/* Chart */}
              <Grid item xs={12} md={8} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  <ChartSL />
                </Paper>
              </Grid>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  <ChartPR />
                </Paper>
              </Grid>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  <ChartEXP />
                </Paper>
              </Grid>
            </Grid>
            {/* <Copyright sx={{ pt: 4 }} /> */}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
