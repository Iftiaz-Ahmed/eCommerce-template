import { response } from "express";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Place COD order
const placeOrderCOD = async (req, res) => {
    try {
        const {userId, items, amount, address} = req.body;
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:'COD',
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, {cartData: {}})

        res.json({success:true, message: "Order Placed Successfully!"})

    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

// Get all orders
const allOrders = async (req, res) => {

}

// Get order by userID
const getOrdersByUserId = async (req, res) => {
    try {
        const {userId} = req.body

        const orders = await orderModel.find({userId})
        res.json({success: true, orders})
    
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})    
    }
}

// Update order status from Admin panel
const updateOrderStatus = async (req, res) => {

}

export {placeOrderCOD, allOrders, getOrdersByUserId, updateOrderStatus}