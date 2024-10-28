import express from 'express'
import { addtoCart, updateCart, getUserCart } from '../controllers/cartController.js'
import authUser from '../middleware/auth.js'

const cartRouter = express.Router()

cartRouter.post('/getCart', authUser, getUserCart)
cartRouter.post('/addToCart', authUser, addtoCart)
cartRouter.post('/updateCart', authUser, updateCart)

export default cartRouter