import * as Yup from "yup";
import {checkEmailExists} from "../../../../util/checkEmailExists.ts";
let timer:any = null;

export const employeeValidationSchema = (id:number, token:string) =>{
    return  Yup.object().shape({

        //CUSTOMER
        id: Yup.number().integer().min(0),
        name: Yup.string().required('El nombre es requerido'),
        lastname: Yup.string().required('El apellido es requerido'),
        phone: Yup.string().required('El teléfono es requerido'),
        address: Yup.string().required('La dirección es requerida'),
        apartment: Yup.string().required('El apartamento es requerido'),

        //USER
        user: Yup.object().shape({
            id: Yup.number().integer().min(0),
            auth0Id: Yup.string(),
            email: Yup.string().email('Ingrese un correo electrónico válido')
                .required('El correo electrónico es requerido')
                .test('checkEmail', 'El correo electrónico ya existe',
                    value => {
                        if (!value || id > 0) return true;
                        clearTimeout(timer);
                        return new Promise((resolve) => {
                            timer = setTimeout(() => {
                                checkEmailExists(value, token)
                                    .then(exists => resolve(!exists))
                                    .catch(() => resolve(false));
                            }, 500);
                        });
                    }
                ),
            blocked: Yup.boolean(),

            //PASSWORD
            password: id === 0
                ? Yup.string()
                    .required('Contraseña es requerida')
                    .min(8, 'Debe tener al menos 8 caracteres de longitud')
                    .matches(/(?=.*[a-z])/g, 'Debe contener al menos una letra minúscula (a-z)')
                    .matches(/(?=.*[A-Z])/g, 'Debe contener al menos una letra mayúscula (A-Z)')
                    .matches(/(?=.*\d)/g, 'Debe contener al menos un número (0-9)')
                    .matches(/(?=.*[!@#$%^&*])/g, 'Debe contener al menos un carácter especial (como !@#$%^&)')
                    .test('passwordComplexity', 'Debe contener al menos 3 de los siguientes 4 tipos de caracteres', (value) => {
                        if (!value) return false;
                        const counts = [/[a-z]/, /[A-Z]/, /\d/, /[!@#$%^&*]/].map((regex) => regex.test(value)).filter((match) => match).length;
                        return counts >= 3;
                    })
                : Yup.string().nullable().notRequired(),
            confirmPassword: id === 0
                ? Yup.string()
                    .required('Confirmar Contraseña es requerida')
                    .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
                : Yup.string().nullable().notRequired(),

            //ROL
            role: Yup.object().shape({
                id: Yup.string().required(),
                denomination: Yup.string().required(),
                auth0RolId: Yup.string().required(),
            }),
        }),
        orders: Yup.array(),
    });
}