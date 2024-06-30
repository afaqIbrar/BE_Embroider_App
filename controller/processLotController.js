const asyncHandler = require('express-async-handler');
const ProcessLot = require('../models/processLotModel');
const { createWorkRecord } = require('../utils/common');

const getAllProcessLot = asyncHandler(
    async (req, res) => {
        let query = {};
        let { search, pageValue } = req.query;
        if (search) {
            query.articleNumber = { $regex: search, $options: 'i' };
        }
        if (req.query.pageValue.length > 0) {
            query.$expr = {
                $and: [
                    { $gte: [{ $toDouble: "$pageNumber" }, Number(pageValue[0])] },
                    { $lte: [{ $toDouble: "$pageNumber" }, Number(pageValue[1])] }
                ]
            };
        }
        const processLot = await ProcessLot.find(query).populate('handWorkerId dupattaWorkerId innerWorkerId');
        processLot.sort((a, b) => b.pageNumber - a.pageNumber);
        res.status(200).json(processLot);
    }
);

const createProcessLot = asyncHandler(async (req, res) => {
    const { pageNumber, articleNumber, colour, billNumber, quantity, handWorkerId, dupattaWorkerId, innerWorkerId, assignDate } = req.body;
    const processLotExist = await ProcessLot.findOne({ pageNumber, articleNumber, colour });
    if (processLotExist) {
        res.status(400);
        throw new Error('Process Lot Already exist with this data');
    }
    if ((handWorkerId || dupattaWorkerId || innerWorkerId) && !req.body.assignDate) {
        req.body.assignDate = new Date();
    }
    const processLot = await ProcessLot.create({ ...req.body });
    if (!processLot) {
        res.status(400);
        throw new Error('Invalid Process Lot Data');
    }
    if (handWorkerId) {
        await createWorkRecord(processLot._id, handWorkerId, 'HAND_WORK');
    }
    if (dupattaWorkerId) {
        await createWorkRecord(processLot._id, dupattaWorkerId, 'DUPATTA_WORK');
    }
    if (innerWorkerId) {
        await createWorkRecord(processLot._id, innerWorkerId, 'INNER_WORK');
    }
    res.status(200).json(processLot);
});

const deleteProcessLot = asyncHandler(async (req, res) => {
    const processLot = await ProcessLot.findById(req.params.id);
    if (!processLot) {
        res.status(400);
        throw new Error('Process Lot not found');
    }
    await processLot.deleteOne();
    res.status(200).json({ id: req.params.id });
});


const updateProcessLot = asyncHandler(async (req, res) => {
    const existingProcessLot = await ProcessLot.findById(req.params.id);
    if (!existingProcessLot) {
        res.status(400);
        throw new Error('Process lot not found');
    }
    if (!existingProcessLot.assignDate && (req.body.handWorkerId || req.body.dupattaWorkerId || req.body.innerWorkerId)) {
        req.body.assignDate = new Date();
    }
    const processLot = await ProcessLot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if ((!existingProcessLot?.handWorkerId && req.body.handWorkerId) || (existingProcessLot?.handWorkerId && (existingProcessLot?.handWorkerId.toString() && (existingProcessLot?.handWorkerId.toString() !== req.body.handWorkerId)))) {
        await createWorkRecord(processLot._id, req.body.handWorkerId, 'HAND_WORK', res);
    }
    if ((!existingProcessLot?.dupattaWorkerId && req.body.dupattaWorkerId) || (existingProcessLot?.dupattaWorkerId && (existingProcessLot?.dupattaWorkerId.toString() && (existingProcessLot?.dupattaWorkerId.toString() !== req.body.dupattaWorkerId)))) {
        await createWorkRecord(processLot._id, req.body.dupattaWorkerId, 'DUPATTA_WORK', res);
    }
    if ((!existingProcessLot?.innerWorkerId && req.body.innerWorkerId) || (existingProcessLot?.innerWorkerId && (existingProcessLot?.innerWorkerId.toString() && (existingProcessLot?.innerWorkerId.toString() !== req.body.innerWorkerId)))) {
        await createWorkRecord(processLot._id, req.body.innerWorkerId, 'INNER_WORK', res);
    }
    res.status(200).json({
        processLot
    });
});

module.exports = { getAllProcessLot, createProcessLot, deleteProcessLot, updateProcessLot };