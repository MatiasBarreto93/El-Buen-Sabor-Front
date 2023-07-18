import * as Yup from "yup";

export const formikMultiStepProductSchema = (id: number) => [

    Yup.object({
        name: Yup.string().required('El nombre es requerido'),
    }),

    Yup.object({
        description: Yup.string().required('La descripción es requerida'),
        image: Yup.mixed().test('fileType', 'El archivo debe ser una imagen en formato JPG o JPEG', (value) => {
            if (!value) return false;
            return value && (value.type === 'image/jpeg' || value.type === 'image/jpg');
        }).required('La imagen es requerida'),
    }),

    Yup.object({
        recipeDescription: Yup.string().required('La descripcion de la receta no debe ser vacia'),
    })

]