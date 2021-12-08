import * as Yup from 'yup';
import 'yup-phone';

export const supplierInitialValues = {
    supplierId: '',
    supplierCode: '',
    supplierName: '',
    companyId: '',
    address: '',
    countryId: 0,
    countryName: '',
    city: '',
    postalCode: '',
    contactPerson: '',
    contact: '',
    email: '',
    website: '',
    openingBalance: 0,
    asOfDate: '2021-09-24',
    balanceType: 0,
};

export const supplierValidationSchema = Yup.object().shape({
    supplierId: Yup.string().label('id'),
    supplierName: Yup.string()
        .required('Please enter supplier name')
        .label('Name'),
    contactPerson: Yup.string()
        .required('Please enter contact Person name')
        .label('Name'),
    supplierCode: Yup.string()
        .required('Please enter supplier code')
        .label('Supplier Code'),
    companyId: Yup.string().label('companyId'),
    contact: Yup.string().phone().label('Contact'),

    email: Yup.string().email('Please enter valid email address').label('email'),
    website: Yup.string().label('Website'),
});
