import { Router } from "express";
import {multerCloudFunction , allowedExtensions} from '../../utlis/multer.js'
import * as couponControler from './controller/coupon.js'
import Joivalidation from '../../middleware/validation.js'
import * as couponValidation from './coupon.validation.js'
import { isAuth } from "../../middleware/auth.js";

const router = Router();


router.post('/create',isAuth,multerCloudFunction(allowedExtensions.image).single('image'),Joivalidation(couponValidation.CouponCreate),couponControler.CouponCreate)
router.put('/update/:CouponId',isAuth,multerCloudFunction(allowedExtensions.image).single('image'),Joivalidation(couponValidation.CouponUpdate), couponControler.CouponUpdate)
router.get('/byID', isAuth,couponControler.getCoupon)

export default router