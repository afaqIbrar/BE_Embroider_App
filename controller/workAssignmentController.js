const asyncHandler = require('express-async-handler');
const WorkAssignment = require('../models/workAssignmentModel');


const getAllWork = asyncHandler(
    async(req,res) => {
        const works = await WorkAssignment.find({}).sort({createdAt: -1}).populate({
            path: 'processLotId',
            select: '_id pageNumber articleNumber colour billNumber quantity' 
        }).populate({
            path:'workerId',
            select: '_id workerName workerType'
        });        
        res.status(200).json(works);
    }
);
const getWorkById = asyncHandler(
    async(req,res) => {
        const works = await WorkAssignment.find({workerId:req.params.id}).sort({createdAt: -1}).populate({
            path: 'processLotId',
            select: '_id pageNumber articleNumber colour billNumber quantity' 
        }).populate({
            path:'workerId',
            select: '_id workerName workerType'
        });
        res.status(200).json(works);
    }
);

const  createWork = asyncHandler( async(req,res) => {
    const {processLotId,workerId} = req.body;
    const workExist = await WorkAssignment.findOne({processLotId,workerId});    
    if(workExist) {
        res.status(400);
        throw new Error('Work Already exist with this data');
    }
    const work = await WorkAssignment.create({processLotId,workerId});
        if(!work) {
        res.status(400);
        throw new Error('Invalid Work Data');
    }
    res.status(200).json({work});
});

const deleteWork = asyncHandler(async(req,res) => {
    const work = await WorkAssignment.findById(req.params.id);
    if(!work) {
        res.status(400);
        throw new Error('Work not found');
    }
    await work.deleteOne();
    res.status(200).json({id:req.params.id});
});


const updateWork = asyncHandler(async(req,res) => {
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
    if (existingWork.processLotId.quantity === req.body.quantityReturned) {
        req.body.lotClearDate = new Date();
    }
    const work = await WorkAssignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
        work
    });
});

module.exports = {getAllWork,getWorkById,createWork,deleteWork,updateWork};