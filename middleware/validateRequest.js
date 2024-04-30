const asyncHandler = require('express-async-handler');
const validateRequest = (schema) => {
    return asyncHandler(async (req, res, next) => {
        try {
            await schema.validate({
                body: req.body,
                query: req.query,
                params: req.params
            });
            next();
        } catch (error) {
            throw new Error(error['errors']) // Pass error to Express error handler
        }
    });
};

module.exports = { validateRequest };