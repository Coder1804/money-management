import asyncHandler from 'express-async-handler';
import Room from '../models/roomModel.js'

// @desc Create transition 
// @route Post /api/transactions/
// @access Private

const createTransaction = asyncHandler(async (req, res)=>{
    const {name,price,credit,roomName} = req.body;
    
    const room = await Room.findOne({name:roomName,userRef:req.user._id});
    if(!room) {
        res.status(401);
        throw new Error("Xona topillmadi!")
    };
 
    room.transactions.push({
        name,
        price,
        credit,
    })

    const updateRoom = await room.save();
    if(updateRoom)
    {
        return res.status(201).json("O'tkazma yaratildi!")
    }
    else
    {
        res.status(400);
        throw new Error("Kiritilgan ma'lumotlar xato");
    }
})

// @desc Get transitions
// @route Get /api/transactions/
// @access Private
const getAllTransactions = asyncHandler(async (req, res)=>{
    const {roomName} = req.params;
    const room = await Room.findOne({name:roomName , userRef:req.user._id});
    if(!room) {
        res.status(401);
        throw new Error("Xona topillmadi!")
    };
    res.json({
        transactions: await room.transactions
        ,
        count:{
            ...await room.transactionCount()
        },
        statistics:{
            ...await room.transactionStatistics()
        }
    });
})



// @desc update transaction
// @route put /api/transactions/
// @access Private
const updateTransaction = asyncHandler(async (req, res)=>{
    const {roomName,name,price,credit} = req.body;
    const {transactionId}=req.params;
    const room = await Room.findOne({name:roomName , userRef:req.user._id});
    if(!room) {
        res.status(401);
        throw new Error("Xona topilmadi!")
    };
    const transaction = room.transactions.find((transaction)=>transaction._id.toString() === transactionId.toString());
    
    if(!transaction)
    {
        res.status(401);
        throw new Error("O'tkazma topilmadi!");
    }

    transaction.name = name || transaction.name;
    transaction.price = price || transaction.price;
    transaction.credit = credit || transaction.credit;

    const updatedRoom = await room.save();

    if(updatedRoom)
    {
        return res.status(201).json("O'tkazma yangilandi!")
    }
    else
    {
        res.status(400);
        throw new Error("Kiritilgan ma'lumotlar xato");
    }
})

// @desc get specific transaction
// @route get /api/transactions/transactionId
// @access Private

const getTransaction = asyncHandler(async (req, res)=>{
    const {roomName} = req.body;
    const {transactionId} = req.params;
    const room = await Room.findOne({name:roomName , userRef:req.user._id});
    if(!room) {
        res.status(401);
        throw new Error("Xona topilmadi!")
    };
    const transaction = room.transactions.find((transaction)=>transaction._id.toString() === transactionId.toString());
    if(!transaction)
    {
        res.status(401);
        throw new Error("O'tkazma topilmadi!");
    }
    res.json(transaction);
})

// @desc delete specific transaction
// @route delete /api/transactions/
// @access Private

const deleteTransaction = asyncHandler(async (req, res)=>{
    const {roomName} = req.body;
    const {transactionId}=req.params;
    const room = await Room.findOne({name:roomName , userRef:req.user._id});
    if(!room) {
        res.status(401);
        throw new Error("Xona topilmadi!")
    };
    const transaction = room.transactions.find((transaction)=>transaction._id.toString() === transactionId.toString());
    if(!transaction)
    {
        res.status(401);
        throw new Error("O'tkazma topilmadi!");
    }
    room.transactions = room.transactions.filter((transaction)=>transaction._id.toString() !== transactionId.toString());
    
    const updateRoom = await room.save();
    if(updateRoom)
    {
        return res.status(201).json("O'tkazma muvaffaqqiyatli o'chirildi!")
    }
    else
    {
        res.status(400);
        throw new Error("Kiritilgan ma'lumotlar xato");
    }
})


export {createTransaction , getAllTransactions , updateTransaction , getTransaction , deleteTransaction};