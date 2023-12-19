import express from 'express'
import { Router } from 'express'
import { isAuth } from '../../middleware/auth.js'
import isValid from '../../middleware/AdminValid.js'
import * as bookingControllerStart from './controller/booking.Start.js'
import * as bookingSchemas from './booking.validation.js'

const router = Router();

router.post("/", isAuth, isValid(bookingSchemas.CreateBooking), bookingControllerStart.CreateBooking)

router.patch("/:bookingId", isAuth, isValid(bookingSchemas.CancelBooking), bookingControllerStart.cancelBooking)


export default router