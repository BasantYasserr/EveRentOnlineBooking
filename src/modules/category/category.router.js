import { Router } from "express";
import {multerCloudFunction , allowedExtensions} from '../../utlis/multer.js'
import * as categoryControler from './controller/category.js'
import Joivalidation from '../../middleware/validation.js'
import * as categoryValidation from './category.validation.js'
import { isAuth, roles} from "../../middleware/auth.js";
import { endPoint } from "./category.endPoint.js";
const router = Router();


router.post('/create',isAuth(endPoint.create),multerCloudFunction(allowedExtensions.image).single('image'),Joivalidation(categoryValidation.CategoryCreate),categoryControler.createCategory)
router.put('/:categoryId',isAuth(endPoint.update),multerCloudFunction(allowedExtensions.image).single('image'),Joivalidation(categoryValidation.CategoryUpdate))
router.get('/byID',categoryControler.getCategory)
router.get('/all', Joivalidation(categoryValidation.CategoryAllSearch),categoryControler.GetAllCategory);


export default router