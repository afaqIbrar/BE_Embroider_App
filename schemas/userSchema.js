const { object, string, ref } =  require('yup');
const  mongoose = require('mongoose');

const createUserSchema = object({
    body: object({
        password: string()
            .required('password is required')
            .min(6, 'Password is too short - Should be min 6 characters').required(),
        userName: string().required(),
        userType: string().required('User Type is rquired'),
    })
});
const updateUserSchema = object({
    body: object({
        password: string(),
        userName: string(),
        userType: string()
    }),
    params: object({
        id: string().required().matches(/^[0-9a-fA-F]{24}$/),
    })
})
const updateUserProfileSchema = object({
    body: object({
        password: string(),
        userName: string(),
        userType: string()
    }),
})
const deleteUserSchema = object({
    params: object({
        id: string().required().matches(/^[0-9a-fA-F]{24}$/),
    })
})
const loginUserSchema = object({
    body: object({
        password: string()
                .required('password is required'),
        userName: string().required(),
    })
})
module.exports = {updateUserProfileSchema,createUserSchema,loginUserSchema,updateUserSchema,deleteUserSchema}