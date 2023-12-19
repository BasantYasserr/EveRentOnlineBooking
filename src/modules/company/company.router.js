import { Router } from "express";
import {multerCloudFunction , allowedExtensions} from '../../utlis/multer.js'
import * as companyControler from './controller/company.js'
import Joivalidation from '../../middleware/validation.js'
import * as companyValidation from './company.validation.js'
import { isAuth } from "../../middleware/auth.js";
import CouponRouter from '../coupon/coupon.router.js'
const router = Router();

router.use('/:companyid/coupon',CouponRouter )

router.post('/create',isAuth,multerCloudFunction(allowedExtensions.image).single('image'),Joivalidation(companyValidation.companyCreate),companyControler.CompanyCreate);
router.put('/:companyId',isAuth,multerCloudFunction(allowedExtensions.image).single('image'),Joivalidation(companyValidation.companyUpdate),companyControler.CompanyUpdate);
router.get('/all' , Joivalidation(companyValidation.companyAllSearch),companyControler.GetAllCompany);


export default router 