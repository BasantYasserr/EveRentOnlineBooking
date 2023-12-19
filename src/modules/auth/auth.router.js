import { Router } from 'express'
import {multerCloudFunction,allowedExtensions} from '../../utlis/multer.js'
import Joivalidation from '../../middleware/validation.js'
import * as UserMailConfirm from './controller/Mails.js'
import * as Joi from './auth.validation.js'
import * as PasswordC from './controller/Password.js'
import * as UserStart from './controller/User.Start.js'
const router = Router()

router.post('/signup',multerCloudFunction(allowedExtensions.image).single('image'),Joivalidation(Joi.signup),UserStart.Signup )
router.get('/confirmEmail/:email', UserMailConfirm.confirmEmail);
router.get('/newConfirmEmail/:email',UserMailConfirm.newConfirmEmail);
router.post('/login',Joivalidation(Joi.login),UserStart.Login );
router.post ('/forget',PasswordC.forgetPassword);
router.post ('/reset/:token',PasswordC.ResetPassword);

export default router