const { object, string } =  require('yup');
const createWorkSchema = object({
    body: object({
        processLotId: string().required('processLotId is required!!!').matches(/^[0-9a-fA-F]{24}$/),
        workerId: string().required('workerId is required!!!').matches(/^[0-9a-fA-F]{24}$/),
    })
});
const updateWorkSchema = object({
    body: object({
        processLotId: string(),
        workerId: string(),
        quantityLog: string(),
        quantityReturned: string(),
        rate: string(),
        total: string(),
        lotClearDate: string(),
        paymentGiven: string(),
        paymentMode: string(),
        paymentDate: string(),
        reference: string()
    }),
    params: object({
        id: string().required().matches(/^[0-9a-fA-F]{24}$/),
    })
})
const deleteWorkSchema = object({
    params: object({
        id: string().required().matches(/^[0-9a-fA-F]{24}$/),
    })
})
const getByIdSchema = object({
    params: object({
        id: string().required().matches(/^[0-9a-fA-F]{24}$/),
    })
})
 module.exports = {createWorkSchema,updateWorkSchema,deleteWorkSchema,getByIdSchema};