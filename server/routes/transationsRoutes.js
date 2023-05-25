import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createTransaction , getAllTransactions,updateTransaction , getTransaction , deleteTransaction } from '../controllers/transactionController.js';
const router = express.Router();

router.get('/all/:roomName' , protect , getAllTransactions)
router.route('/' ).post(protect,createTransaction);
router.route('/:transactionId').get( protect , getTransaction).put(protect,updateTransaction).delete(protect,deleteTransaction);


export default router;