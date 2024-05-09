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
    const processLot = await ProcessLot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!processLot) {
        res.status(400);
        throw new Error('Process lot not found');
    }    
    res.status(200).json({
        processLot
    });
});

module.exports = {getAllProcessLot,createProcessLot,deleteProcessLot,updateProcessLot};