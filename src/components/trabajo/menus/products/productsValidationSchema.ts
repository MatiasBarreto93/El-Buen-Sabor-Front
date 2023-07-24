import * as Yup from "yup";

const MAX_STRING_SIZE_BASE64 = 3 * 1024 * 1024; // size of 3MiB

export const formikMultiStepProductSchema = (id: number) => [

    Yup.object({
        name: Yup.string().required('El nombre es requerido'),
        categoryId: Yup.number().integer().min(1, 'Debe seleccionar un rubro').required('Debe seleccionar un rubro'),
    }),

    Yup.object({
        description: Yup.string().required('La descripción es requerida'),
        image: Yup.string()
            .required('La imagen es requerida')
            .max(MAX_STRING_SIZE_BASE64, 'La imagen debe ser de tamaño 2MB o menos')
            .test(
                'fileFormat',
                'La imagen debe ser en formato JPG o JPEG',
                value => value && (value.startsWith('data:image/jpeg;base64,')
                    || value.startsWith('data:image/jpg;base64,')),
            ),
    }),

    Yup.object({
        recipeDescription: Yup.string().required('La descripcion de la receta no debe ser vacia'),
        categoryIngredientId: Yup.number().integer().min(1, 'Debe seleccionar un rubro').required('Debe seleccionar un rubro'),
        ingredientId: Yup.number().integer().min(1, 'Debe seleccionar un ingrediente').required('Debe seleccionar un ingrediente'),
        ingredientQuantity: Yup.number().integer().min(1, 'La cantidad debe ser mayor a 0').required('La cantidad debe ser mayor a 0'),
    })

]