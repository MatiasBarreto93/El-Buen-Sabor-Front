import * as Yup from "yup";

export const formikMultiStepTestSchema = (id:number) => [

    //Schema[0]
    Yup.object({
        name: Yup.string().required('El nombre es requerido'),
        lastname: Yup.string().required('El apellido es requerido'),
    }),

    //Schema[1]
    Yup.object({
        phone: Yup.string().required('El teléfono es requerido'),
        user: Yup.object().shape({
            email: Yup.string().email('Ingresa un correo electrónico válido').required('El correo electrónico es requerido'),
        })
    }),

    //Schema[2]
    Yup.object({
        address: Yup.string().required('La dirección es requerida'),
        apartment: Yup.string().required('El apartamento es requerido'),
    }),

    //Schema[3]
    Yup.object({
        user: Yup.object().shape({
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
        })
    }),

    //Schema[4]
    Yup.object({
        user: Yup.object().shape({
            role: Yup.object().shape({
                id: Yup.string().required(),
                denomination: Yup.string().required(),
                auth0RolId: Yup.string().required(),
            }),
        })
    }),
]