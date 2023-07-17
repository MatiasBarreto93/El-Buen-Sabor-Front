import * as Yup from "yup";

export const formilMultiStepProductSchema = (id: number) => {
    Yup.object({
        name: Yup.string().required('El nombre es requerido'),
    })
}