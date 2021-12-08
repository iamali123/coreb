import React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Typography, Grid } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import ProductDetail from "./Product/_ProductDetailForm/ProductDetail";
import ServiceDetail from "./Service/_ServiceDetailForm/ServiceDetail";
import Sale from "./ItemSale/sale";
import Purchase from "./ItemPurchase/itemPurchase";
import ProductInventoryDetail from "./Product/_ProductInventoryForm/ProductInventoryDetail";
import VariantList from "./Variants/variant";
import { useParams } from "react-router-dom";
import BomList from "./ItemBom/BomList";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 30,
    backgroundColor: "inherit",
    width: "100%",
    paddingRight: 0,
  },
}));

export default function FullWidthTabs(props) {
  const classes = useStyles();
  const theme = useTheme();
  const params = useParams();
  const productId = params.productId;
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Grid container spacing={2} justifyContent="flex-start">
      <Grid item sm={12} md={12} lg={11}>
        <div className={classes.root}>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              backgroundColor="#F2F2F2"
              aria-label="full width tabs example"
            >
              <Tab label="Detail" {...a11yProps(0)} />
              <Tab
                label="Variant"
                disabled={productId === undefined && true}
                {...a11yProps(1)}
              />
              <Tab
                label="BOM"
                disabled={productId === undefined && true}
                {...a11yProps(2)}
              />
              <Tab
                label="Sales"
                disabled={productId === undefined && true}
                {...a11yProps(3)}
              />
              <Tab
                label="Purchase"
                disabled={productId === undefined && true}
                {...a11yProps(4)}
              />
              <Tab
                label="Inventory"
                disabled={productId === undefined && true}
                {...a11yProps(5)}
              />
              <Tab
                label="Manfacturing"
                disabled={productId === undefined && true}
                {...a11yProps(6)}
              />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              {props.Flag === "Product" ? (
                <ProductDetail
                  formik={props.productFormik}
                  CategoryRecord={props.CategoryRecord}
                  ProductTypeRecord={props.ProductTypeRecord}
                  setShowCategoryForm={props.setShowCategoryForm}
                  setShowProductTypeForm={props.setShowProductTypeForm}
                />
              ) : (
                <ServiceDetail
                  formik={props.serviceFormik}
                  CategoryRecord={props.CategoryRecord}
                  ProductTypeRecord={props.ProductTypeRecord}
                  setShowCategoryForm={props.setShowCategoryForm}
                  setShowProductTypeForm={props.setShowProductTypeForm}
                />
              )}
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <VariantList setShowSpinner={props.setShowSpinner} />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <BomList />
            </TabPanel>
            <TabPanel value={value} index={3} dir={theme.direction}>
              <Sale />
            </TabPanel>
            <TabPanel value={value} index={4} dir={theme.direction}>
              <Purchase />
            </TabPanel>
            <TabPanel value={value} index={5} dir={theme.direction}>
              {props.Flag === "Product" ? (
                <ProductInventoryDetail formik={props.productFormik} />
              ) : (
                <ProductInventoryDetail formik={props.serviceFormik} />
              )}
            </TabPanel>
          </SwipeableViews>
        </div>
      </Grid>
    </Grid>
  );
}
