import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createRoom , getAllRooms, updateRoom , deleteRoom, getRoom } from '../controllers/roomsController.js';
const router = express.Router();

router.route('/').get(protect,getAllRooms).post(protect, createRoom);
router.route('/:roomName' ).put(protect,updateRoom).delete(protect,deleteRoom).get(protect,getRoom);




export default router;