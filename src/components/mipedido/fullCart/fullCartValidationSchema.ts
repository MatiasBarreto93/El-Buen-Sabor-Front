import * as Yup from "yup";

export const fullCartValidationSchema = (deliveryType: number) => Yup.object().shape({
    id: Yup.number().integer().min(0),
    name: Yup.string().required('El nombre es requerido'),
    lastname: Yup.string().required('El apellido es requerido'),
    phone: deliveryType === 1 ? Yup.string().required('El teléfono es requerido') : Yup.string(),
    address: deliveryType === 1 ? Yup.string().required('La dirección es requerida') : Yup.string(),
    apartment: deliveryType === 1 ? Yup.string().required('El apartamento es requerido') : Yup.string(),
});

