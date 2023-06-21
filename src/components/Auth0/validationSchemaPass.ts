import * as Yup from "yup";

export const validationSchemaPass = Yup.object().shape({
    password: Yup.string()
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
        }),
    confirmPassword: Yup.string()
        .required('Confirmar Contraseña es requerida')
        .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir'),
});
