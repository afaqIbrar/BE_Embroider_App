// const Joi = require('joi'); 
// const asyncHandler = require('express-async-handler');


// const createUserSchema = Joi.object({
//     userName: Joi.string().required().alphanum().min(3).max(30),
//     password: Joi.string().alphanum().min(5).required(),
//     userType: Joi.string().required(),
// })


// const validateCreateUser = asyncHandler(async (req,res,next) => {
//     const {body} = req;
//     const { error } = await createUserSchema.validate(body);
//     if(error) {
//         res.status(422)
//         throw new Error(error.message);
//     }
//     next()
// })

// module.exports = {validateCreateUser}


