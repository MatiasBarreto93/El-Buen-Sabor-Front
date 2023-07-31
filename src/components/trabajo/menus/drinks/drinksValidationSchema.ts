import * as Yup from "yup";

const MAX_STRING_SIZE_BASE64 = 3 * 1024 * 1024; // size of 3MiB

export const formikMultiStepDrinkSchema = (id: number) => [

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
        currentStock: Yup.number().integer().min(1, 'El stock debe ser mayor a 0').required('El stock debe ser mayor a 0'),
        minStock: Yup.number().integer().min(1, 'El min stock debe ser mayor a 0').required('El min stock debe ser mayor a 0'),
        maxStock: Yup.number().integer().min(1, 'El max stock debe ser mayor a 0').required('El max stock debe ser mayor a 0'),
        sellPrice: Yup.number().integer().min(1, 'El precio de venta debe ser mayor a 0').required('El precio de venta debe ser mayor a 0'),
        costPrice: Yup.number().integer().min(1, 'El costo debe ser mayor a 0').required('El costo debe ser mayor a 0'),
    })

]