const { object, string, date } = require('yup');
const createProcessLotSchema = object({
    body: object({
        pageNumber: string().required('Page Number is required!!!'),
        articleNumber: string().required('Article Number is required!!!'),
        colour: string().required('Colour is Required'),
        billNumber: string().optional(),
        quantity: string().optional(),
        handWorkerId: string().optional(),
        dupattaWorkerId: string().optional(),
        innerWorkerId: date().nullable().default(null),
    })
});
const updateProcessLotSchema = object({
    body: object({
        pageNumber: string().optional(),
        articleNumber: string().optional(),
        colour: string().optional(),
        billNumber: string().optional(),
        quantity: string().optional(),
        handWorkerId: string().optional(),
        dupattaWorkerId: string().optional(),
        innerWorkerId: string().optional(),
        assignDate: date().nullable().default(null),
    }),
    params: object({
        id: string().required().matches(/^[0-9a-fA-F]{24}$/),
    })
})
const deleteProcessLotSchema = object({
    params: object({
        id: string().required().matches(/^[0-9a-fA-F]{24}$/),
    })
})
module.exports = { createProcessLotSchema, updateProcessLotSchema, deleteProcessLotSchema };