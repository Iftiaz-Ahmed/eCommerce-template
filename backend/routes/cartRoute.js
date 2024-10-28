import express from 'express'
import { addtoCart, updateCart, getUserCart } from '../controllers/cartController.js'
import authUser from '../middleware/auth.js'

const cartRouter = express.Router()

cartRouter.post('/getCart', authUser, getUserCart)
cartRouter.post('/getCart', authUser, addtoCart)
cartRouter.post('/getCart', authUser, updateCart)

export default cartRouter