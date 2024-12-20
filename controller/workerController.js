const asyncHandler = require('express-async-handler');
const Worker = require('../models/workerModel');


const getAllWorkers = asyncHandler(
    async (req, res) => {
        let query = {};
        if (req.query.search) {
            query.workerName = { $regex: req.query.search, $options: 'i' };
        }
        const workers = await Worker.find(query).sort({ createdAt: -1 });
        res.status(200).json(workers);
    }
);

const getWorkerById = asyncHandler(async (req, res) => {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
        res.status(400);
        throw new Error('Worker not Found');
    }
    res.status(200).json(worker);
});

const createWorker = asyncHandler(async (req, res) => {
    const { workerName, workerType, phoneNumber, balance, initialBalanceType } = req.body;
    const workerExist = await Worker.findOne({ workerName, workerType });
    if (workerExist) {
        res.status(400);
        throw new Error('Worker Already exist with this data');
    }
    const worker = await Worker.create({ workerName, workerType, phoneNumber, balance,initialBalanceType });
    if (!worker) {
        res.status(400);
        throw new Error('Invalid Worker Data');
    }
    res.status(200).json(worker);
});

const deleteWorker = asyncHandler(async (req, res) => {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
        res.status(400);
        throw new Error('Worker not found');
    }
    await worker.deleteOne();
    res.status(200).json({ id: req.params.id });
});


const updateWorker = asyncHandler(async (req, res) => {
    const { workerName, workerType, phoneNumber, extraInfo, balance } = req.body;
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
        res.status(400);
        throw new Error('Worker not found');
    }
    worker.workerName = workerName || worker.workerName;
    worker.workerType = workerType || worker.workerType;
    worker.phoneNumber = phoneNumber || worker.phoneNumber;
    worker.balance = balance || worker.balance;
    worker.extraInfo = extraInfo;
    const updatedWorker = await worker.save();

    res.status(200).json({
        updatedWorker
    });
});

module.exports = { getAllWorkers, createWorker, deleteWorker, updateWorker, getWorkerById };