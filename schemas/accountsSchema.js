const { object, string } =  require('yup');

const createTransactionSchema = object({
    body: object({
        workerId: string().required('workerId is required'),
        description: string().required('Description is Required'),
        amount: string().required('Amount is rquired'),
    })
});
const updateTransactionSchema = object({
    body: object({
        description: string(),
        amount: string().required('Amount is rquired'),
    }),
    params: object({
        id: string().required().matches(/^[0-9a-fA-F]{24}$/),
    })
})
const getByIdSchema = object({
    params: object({
        workerId: string().required().matches(/^[0-9a-fA-F]{24}$/),
    })
})

module.exports = {createTransactionSchema,updateTransactionSchema,getByIdSchema}