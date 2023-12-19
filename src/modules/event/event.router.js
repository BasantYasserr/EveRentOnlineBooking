import { Router } from 'express'
import {multerCloudFunction , allowedExtensions} from '../../utlis/multer.js'
import { isAuth } from '../../middleware/auth.js'
import Joivalidation from '../../middleware/validation.js'
import * as eventValidators from './event.validation.js'
import * as EventStart from './controller/event.Start.js'
import * as EventEdit from './controller/event.Edit.js'
import * as EventSearch from './controller/event.Search.js'
const router = Router();

router.post ('/create', isAuth, multerCloudFunction(allowedExtensions.image).array('image',4),Joivalidation(eventValidators.EventCreate),EventStart.Create)
router.post ('/update', isAuth, multerCloudFunction(allowedExtensions.image).array('image',4),Joivalidation(eventValidators.EventUpdate),EventEdit.Update)
router.get('/search/all',EventSearch.allEvents)
router.get('/search/',EventSearch.eventsbytitle)


export default router