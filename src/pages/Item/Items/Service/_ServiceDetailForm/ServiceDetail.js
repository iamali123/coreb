import React, { useState } from 'react';
import TextField from '../../../../../Components/TextInput';
import DropDownTextField from '../../../../../Components/Dropdown/SearchableDropdown';
import { Grid } from '@material-ui/core';

function ServiceDetail({
    formik,
    CategoryRecord,
    ProductTypeRecord,
    setShowCategoryForm,
    setShowProductTypeForm,
}) {
    const EditItemCategoryValue = CategoryRecord.filter(
        (x) => x.key === formik.values.itemCategory
    ).map((item) => ({
        title: item.title,
        value: item.value,
        key: item.key,
    }));
    const EditItemTypeValue = ProductTypeRecord.filter(
        (x) => x.key === formik.values.itemTypeId.toString()
    ).map((item) => ({
        title: item.title,
        value: item.value,
        key: item.key,
    }));

    const [newCategoryValue, setNewCategoryValue] = useState(
        EditItemCategoryValue[0]
    );
    const [newItemTypeValue, setNewItemTypeValue] = useState(
        EditItemTypeValue[0]
    );

    return (
        <>
            <Grid container spacing={5}>
                <Grid item xs={12} sm={6} md={5}>
                    <DropDownTextField
                        variant="standard"
                        id="itemCategory"
                        label="Serive Category *"
                        DropDowntitle="Add Category"
                        ShowForm={setShowCategoryForm}
                        value={newCategoryValue}
                        showAddButton
                        onChange={(event, value) => {
                            if (value.value !== 0) {
                                formik.setFieldValue(
                                    'itemCategory',
                                    value === 0 ||
                    value === undefined ||
                    value === null ||
                    value.key === undefined ||
                    value.key === null
                                        ? ''
                                        : value.key.toString()
                                );
                                formik.setFieldValue(
                                    'itemCategoryTitle',
                                    value === 0 ||
                    value === undefined ||
                    value === null ||
                    value.title === undefined ||
                    value.title === null
                                        ? ''
                                        : value.title
                                );
                                setNewCategoryValue(
                                    value === null || value === undefined ? '' : value
                                );
                            }
                        }}
                        size="small"
                        fullWidth
                        data={CategoryRecord}
                        error={
                            formik.touched.itemCategory && Boolean(formik.errors.itemCategory)
                        }
                        helperText={
                            formik.touched.itemCategory && formik.errors.itemCategory
                        }
                    />
                </Grid>
            </Grid>
            <Grid container spacing={5}>
                <Grid item xs={12} sm={6} md={5}>
                    <DropDownTextField
                        variant="standard"
                        id="itemTypeId"
                        label="Service Type *"
                        DropDowntitle="Add Service Type"
                        ShowForm={setShowProductTypeForm}
                        showAddButton
                        value={newItemTypeValue}
                        onChange={(event, value) => {
                            formik.setFieldValue(
                                'itemTypeId',
                                value === 0 ||
                  value === undefined ||
                  value === null ||
                  value.key === undefined ||
                  value.key === null
                                    ? ''
                                    : value.key.toString()
                            );
                            formik.setFieldValue(
                                'itemTypeName',
                                value === 0 ||
                  value === undefined ||
                  value === null ||
                  value.title === undefined ||
                  value.title === null
                                    ? ''
                                    : value.title
                            );
                            setNewItemTypeValue(
                                value === null || value === undefined ? '' : value
                            );
                        }}
                        size="small"
                        fullWidth
                        data={ProductTypeRecord}
                        error={
                            formik.touched.itemTypeId && Boolean(formik.errors.itemTypeId)
                        }
                        helperText={formik.touched.itemTypeId && formik.errors.itemTypeId}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={5}>
                <Grid item xs={12} sm={4} md={5}>
                    <TextField
                        variant="outlined"
                        id="salePrice"
                        label="Sale Price"
                        placeholder="0"
                        value={formik.values.salePrice != 0 ? formik.values.salePrice : ''}
                        onChange={formik.handleChange}
                        size="small"
                        fullWidth
                        error={formik.touched.salePrice && Boolean(formik.errors.salePrice)}
                        helperText={formik.touched.salePrice && formik.errors.salePrice}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default ServiceDetail;
