const WorkAssignment = require('../models/workAssignmentModel');
const asyncHandler = require('express-async-handler');

const createWorkRecord = asyncHandler(async (processLotId, workerId, workType, res) => {
    const workExist = await WorkAssignment.findOne({ processLotId, workerId, workType });
    if (workExist) {
        res.status(400);
        throw new Error('Work Already exist with this data');
    }
    const work = await WorkAssignment.create({ processLotId, workerId, workType });
    if (!work) {
        res.status(400);
        throw new Error('Invalid Work Data');
    }
});

const deleteWorkRecord = asyncHandler(async (processLotId, workerId, workType, res) => {
    const workExist = await WorkAssignment.findOne({ processLotId, workerId, workType });
    if (!workExist) {
        res.status(400);
        throw new Error('Work record does not exist with this data');
    }
    const workDeleted = await WorkAssignment.deleteOne({ processLotId, workerId });
    if (!workDeleted) {
        res.status(400);
        throw new Error('Failed to delete work record');
    }
});

module.exports = { createWorkRecord, deleteWorkRecord }