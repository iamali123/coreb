import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { IntlProvider } from "react-intl";
import Layout from "./Layout";
import messages from "./messages";
import "./styles/App.scss";
import LogoImage from "../../assets/images/Logo.png";
import Logout from "../Logout";
const drawerWidth = 250;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },

  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: { fontSize: 100 },
  hide: {
    display: "none",
  },
}));
export default function AppContainer({ children }) {
  const [locale, setLocale] = useState("en");
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [ScreenSize, setScreenSize] = useState(window.innerWidth);

  const handleCollapsedChange = (checked) => {
    setCollapsed(!collapsed);
  };
  const handleToggleSidebar = (value) => {
    setToggled(!toggled);
  };
  const handleResize = () => {
    setScreenSize(window.innerWidth);
  };
  window.addEventListener("resize", handleResize);

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        style={{ background: "#F9F9F9", minHeight: "55px", height: "55px" }}
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              height: "100%",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconButton
                aria-label="open drawer"
                onClick={
                  ScreenSize >= 768
                    ? handleCollapsedChange
                    : handleToggleSidebar
                }
                edge="start"
                className={clsx(classes.menuButton)}
                style={{ padding: "0" }}
              >
                <MenuIcon fontSize="large" />
              </IconButton>{" "}
              <img src={LogoImage} alt={"Coreb Logo"} width={120} />
            </div>
            <div>
              <Logout />
            </div>
          </div>
        </Toolbar>
      </AppBar>

      <IntlProvider locale={locale} messages={messages[locale]}>
        <Layout
          setLocale={setLocale}
          content={children}
          collapsed={collapsed}
          handleCollapsedChange={handleCollapsedChange}
          handleToggleSidebar={handleToggleSidebar}
          toggled={toggled}
        />
      </IntlProvider>
    </div>
  );
}
