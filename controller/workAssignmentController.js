const asyncHandler = require('express-async-handler');
const WorkAssignment = require('../models/workAssignmentModel');
const mongoose = require('mongoose');

const getAllWork = asyncHandler(
    async (req, res) => {
        let query = {};
        const works = await WorkAssignment.find({}).sort({ createdAt: -1 }).populate({
            path: 'processLotId',
            select: '_id pageNumber articleNumber colour billNumber quantity'
        }).populate({
            path: 'workerId',
            select: '_id workerName workerType'
        });
        res.status(200).json(works);
    }
);
// const getWorkById = asyncHandler(
//     async (req, res) => {
//         const works = await WorkAssignment.find({ workerId: req.params.id }).sort({ createdAt: -1 }).populate({
//             path: 'processLotId',
//             select: '_id pageNumber articleNumber colour billNumber quantity assignDate'
//         }).populate({
//             path: 'workerId',
//             select: '_id workerName workerType'
//         });
//         res.status(200).json(works);
//     }
// );

// const getWorkById = asyncHandler(
//     async (req, res) => {
//         try {
//             const { search } = req.query;
//             const workerId = req.params.id;

//             // Find the work assignments for the worker
//             const works = await WorkAssignment.find({ workerId })
//                 .sort({ createdAt: -1 })
//                 .populate({
//                     path: 'processLotId',
//                     select: '_id pageNumber articleNumber colour billNumber quantity assignDate'
//                 })
//                 .populate({
//                     path: 'workerId',
//                     select: '_id workerName workerType'
//                 });

//             // If there's a search query, filter the populated processLotId
//             const filteredWorks = search
//                 ? works.filter(work => work.processLotId.articleNumber.toLowerCase().includes(search.toLowerCase()))
//                 : works;

//             res.status(200).json(filteredWorks);
//         } catch (error) {
//             res.status(500).json({ message: error.message });
//         }
//     }
// );
const getWorkById = asyncHandler(
    async (req, res) => {
        try {
            const { search } = req.query;
            const workerId = req.params.id;

            const pipeline = [
                {
                    $match: { workerId: new mongoose.Types.ObjectId(workerId) }
                },
                {
                    $lookup: {
                        from: 'processlots',
                        localField: 'processLotId',
                        foreignField: '_id',
                        as: 'processLotId'
                    }
                },
                {
                    $unwind: '$processLotId'
                },
                {
                    $lookup: {
                        from: 'workers',
                        localField: 'workerId',
                        foreignField: '_id',
                        as: 'workerId'
                    }
                },
                {
                    $unwind: '$workerId'
                },
                {
                    $sort: { 'processLotId.assignDate': -1 }
                },
                {
                    $project: {
                        processLotId: {
                            _id: 1,
                            pageNumber: 1,
                            articleNumber: 1,
                            colour: 1,
                            billNumber: 1,
                            quantity: 1,
                            assignDate: 1
                        },
                        workerId: {
                            _id: 1,
                            workerName: 1,
                            workerType: 1
                        },
                        createdAt: 1,
                        quantityLog: 1,
                        workType: 1,
                        quantityReturned: 1,
                        rate: 1,
                        total: 1,
                        lotClearDate: 1,
                        paymentGiven: 1,
                        paymentMode: 1,
                        paymentDate: 1,
                        reference: 1
                    }
                }
            ];

            if (search) {
                pipeline.splice(3, 0, {
                    $match: {
                        'processLotId.articleNumber': { $regex: search, $options: 'i' }
                    }
                });
            }

            const works = await WorkAssignment.aggregate(pipeline);

            res.status(200).json(works);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);


const createWork = asyncHandler(async (req, res) => {
    const { processLotId, workerId } = req.body;
    const workExist = await WorkAssignment.findOne({ processLotId, workerId });
    if (workExist) {
        res.status(400);
        throw new Error('Work Already exist with this data');
    }
    const work = await WorkAssignment.create({ processLotId, workerId });
    if (!work) {
        res.status(400);
        throw new Error('Invalid Work Data');
    }
    res.status(200).json({ work });
});

const deleteWork = asyncHandler(async (req, res) => {
    const work = await WorkAssignment.findById(req.params.id);
    if (!work) {
        res.status(400);
        throw new Error('Work not found');
    }
    await work.deleteOne();
    res.status(200).json({ id: req.params.id });
});


const updateWork = asyncHandler(async (req, res) => {
    const existingWork = await WorkAssignment.findById(req.params.id).populate({
        path: 'processLotId',
        select: '_id quantity',
        options: { lean: false }
    });
    if (!existingWork) {
        res.status(400);
        throw new Error('Work not found');
    }
    if (!existingWork.paymentGiven && req.body.paymentGiven) {
        req.body.paymentDate = new Date();
    }
    if (!existingWork.lotClearDate && (existingWork.processLotId.quantity === req.body?.quantityReturned?.toString())) {
        req.body.lotClearDate = new Date();
    }
    const work = await WorkAssignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
        work
    });
});

module.exports = { getAllWork, getWorkById, createWork, deleteWork, updateWork };