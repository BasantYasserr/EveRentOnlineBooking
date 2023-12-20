import { Router } from "express";
import { isAuth } from '../../middleware/auth.js'
import isValid from '../../middleware/AdminValid.js'
import * as cartController from './controller/cart.js'
import * as CartValid from './cart.validation.js'

const router = Router();


router.post('/Create', isAuth, isValid(CartValid.cart), cartController.CartCreate)
router.get('/UserCart', isAuth, cartController.UserCart)
router.patch('/Update',isAuth, isValid(CartValid.cart), cartController.CartUpdate)
router.patch('/CartClear', isAuth, cartController.CartClear)
router.patch('/:eventId', isAuth, isValid(CartValid.removeEventfromCart), cartController.removeEventfromCart)

export default router