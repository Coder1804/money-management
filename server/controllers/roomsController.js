import asyncHandler from 'express-async-handler'
import Room from '../models/roomModel.js';
// @desc room user/create user room
// @route Post /api/rooms/
// @access Private

export const createRoom = asyncHandler(async(req, res)=>{
    const { roomName } = req.body;
    const roomExists = await Room.findOne({name:roomName});
    if(roomExists)
    {
        res.status(400);
        throw new Error ('Xona allaqachon yaratilgan!');
    }
    const room = await Room.create({
        name:roomName,
        userRef:req.user._id
    });
    room.save();
    if(room)
    {
        res.status(201).json({
            name:room.name,
        })
    }
    else
    {
        res.status(400);
        throw new Error('invalid user data!')
    }
})


// @desc get specific room
// @route Get /api/rooms/:roomName
// @access Private

export const getRoom = asyncHandler(async (req,res)=>{
    const {roomName} = req.params;

    const room = await Room.findOne({name:roomName , userRef:req.user._id}).select('name createdAt updatedAt');
    if(!room)
    {
        res.status(400);
        throw new Error("Bunday xona mavjud emas!")
    }
    else{
        res.json(room)
    }
})


// @desc room get/get all user's rooms
// @route Get /api/rooms/
// @access Private

export const getAllRooms = asyncHandler(async (req,res)=>{
    const rooms = await Room.find({userRef:req.user._id}).select('-userRef');
    
    let statistics = {
        allCreditsPrice:0,
        allDebitsPrice:0
    }
    for(const room of rooms)
    {
        const statistic = await room.transactionStatistics();
        statistics = {
            allCreditsPrice:statistics.allCreditsPrice + statistic.allCreditsPrice,
            allDebitsPrice:statistics.allDebitsPrice + statistic.allDebitsPrice
        }
    }

   

    if(rooms)
   {
    res.status(200).json({
        rooms,
        statistics
    })
   }
   else
   {
    res.json({})
   }
})


// @desc room change/change room's name
// @route put /api/rooms/:roomName
// @access Private


export const updateRoom = asyncHandler(async (req,res)=>{
    const {newRoomName} = req.body;
    const {roomName} = req.params;
    const room = await Room.findOne({name:newRoomName , userRef:req.user._id});
    if(room)
    {
        res.status(400);
        throw new Error("Bu xona allaqachon mavjud!")
    }
    const newRoom = await Room.findOne({name:roomName})
    newRoom.name = newRoomName;
    const updateRoom = await newRoom.save();
    if(updateRoom)
    {
        res.status(201).json("Xona nomi o'zgartirildi!")
    }
    else
    {
        res.status(400);
        throw new Error('foydalanuvchi ma\'lumotlari noto\'g\'ri!')
    }
})


// @desc room delete
// @route delete /api/rooms/:roomId
// @access Private

export const deleteRoom = asyncHandler(async (req,res)=>{
    const {roomName} = req.params;

    const room = await Room.findOneAndDelete({name:roomName});
    if(!room)
    {
        res.status(404);
        throw new Error("Bunday xona mavjud emas!")
    }
    else
    {
        res.status(200).json("Xona o'chirildi!")
    }
    
})