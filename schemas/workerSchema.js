const { object, string } =  require('yup');
const createWorkerSchema = object({
    body: object({
        workerName: string().required('Worker Name is required!!!'),
        workerType: string().required('Worker Type is required!!!'),
        phoneNumber: string(),
    })
});
const updateWorkerSchema = object({
    body: object({
        workerName: string(),
        workerType: string(),
        phoneNumber: string()
    }),
    params: object({
        id: string().required().matches(/^[0-9a-fA-F]{24}$/),
    })
})
const deleteWorkerSchema = object({
    params: object({
        id: string().required().matches(/^[0-9a-fA-F]{24}$/),
    })
})
const getByIdSchema = object({
    params: object({
        id: string().required().matches(/^[0-9a-fA-F]{24}$/),
    })
})
module.exports = {createWorkerSchema,updateWorkerSchema,deleteWorkerSchema,getByIdSchema};