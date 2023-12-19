import { Router } from "express";
import { isAuth } from '../../middleware/auth.js'
import isValid from '../../middleware/AdminValid.js'
import * as cartController from './controller/cart.js'
import * as CartValid from './cart.validation.js'

const router = Router();


router.post('/Cart', isAuth, isValid(CartValid.cart), cartController.CartCreate)
router.get('/Cart', isAuth, cartController.UserCart)
router.patch('/Cart',isAuth, isValid(CartValid.cart), cartController.CartUpdate)
router.patch('/CartClear', isAuth, cartController.CartClear)
router.patch('/:eventId', isAuth, isValid(CartValid.removeEventfromCart), cartController.removeEventfromCart)

export default router