const asyncHandler = require('express-async-handler');
const ProcessLot = require('../models/processLotModel');


const getAllProcessLot = asyncHandler(
    async(req,res) => {
        const processLot = await ProcessLot.find({}).sort({createdAt: -1}).populate('handWorkerId dupattaWorkerId innerWorkerId');
        res.status(200).json(processLot);
    }
);

const  createProcessLot = asyncHandler( async(req,res) => {
    const {pageNumber,articleNumber,colour,billNumber,quantity,handWorkerId,dupattaWorkerId,innerWorkerId,assignDate} = req.body;
    const processLotExist = await ProcessLot.findOne({pageNumber,articleNumber,colour});    
    if(processLotExist) {
        res.status(400);
        throw new Error('Process Lot Already exist with this data');
    }
    if(handWorkerId || dupattaWorkerId || innerWorkerId) {
        req.body.assignDate = new Date();
    }
    const processLot = await ProcessLot.create({...req.body});
        if(!processLot) {
        res.status(400);
        throw new Error('Invalid Process Lot Data');
    }
    res.status(200).json(processLot);
});

const deleteProcessLot = asyncHandler(async(req,res) => {
    const processLot = await ProcessLot.findById(req.params.id);
    if(!processLot) {
        res.status(400);
        throw new Error('Process Lot not found');
    }
    await processLot.deleteOne();
    res.status(200).json({id:req.params.id});
});


const updateProcessLot = asyncHandler(async(req,res) => {
    const existingProcessLot = await ProcessLot.findById(req.params.id);
    if (!existingProcessLot) {
        res.status(400);
        throw new Error('Process lot not found');
    }   
    if (!existingProcessLot.assignDate && (req.body.handWorkerId || req.body.dupattaWorkerId || req.body.innerWorkerId)) {
        req.body.assignDate = new Date();
    }
    const processLot = await ProcessLot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
        processLot
    });
});

module.exports = {getAllProcessLot,createProcessLot,deleteProcessLot,updateProcessLot};