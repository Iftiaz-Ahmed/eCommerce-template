import express from 'express'
import {placeOrderCOD, allOrders, getOrdersByUserId, updateOrderStatus} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

//Payment Features
orderRouter.post('/placeOrder', authUser, placeOrderCOD)

//User Feature
orderRouter.post('/userOrders', authUser, getOrdersByUserId)

//Admin Features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/updateStatus', adminAuth, updateOrderStatus)

export default orderRouter