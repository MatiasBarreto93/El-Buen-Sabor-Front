import * as Yup from "yup";

export const customerDataValidationSchema = Yup.object().shape({
    id: Yup.number().integer().min(0),
    name: Yup.string().required('El nombre es requerido'),
    lastname: Yup.string().required('El apellido es requerido'),
    phone: Yup.string().required('El teléfono es requerido'),
    address: Yup.string().required('La dirección es requerida'),
    apartment: Yup.string().required('El apartamento es requerido'),
});