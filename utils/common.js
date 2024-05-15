const WorkAssignment = require('../models/workAssignmentModel');
const asyncHandler = require('express-async-handler');

const createWorkRecord = asyncHandler(async (processLotId,workerId,workType,res) => {
    const workExist = await WorkAssignment.findOne({processLotId,workerId,workType});    
    if(workExist) {
        res.status(400);
        throw new Error('Work Already exist with this data');
    }
    const work = await WorkAssignment.create({processLotId,workerId,workType});
        if(!work) {
        res.status(400);
        throw new Error('Invalid Work Data');
    }
});

module.exports = {createWorkRecord}