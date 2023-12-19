import connectDB from '../DB/connection.js'
import authRouter from './modules/auth/auth.router.js'
import bookingRouter from './modules/booking/booking.router.js'
import cartRouter from './modules/cart/cart.router.js'
import categoryRouter from './modules/category/category.router.js'
import companyRouter from './modules/company/company.router.js'
import eventRouter from './modules/event/event.router.js'
//import reviewsRouter from './modules/reviews/reviews.router.js'
import couponRouter from './modules/coupon/coupon.router.js'
import { globalErrorHandling } from './utlis/errorHandling.js'
import cors from 'cors'


const initApp = async(app, express) => {

    app.use(cors())      //allow access from anywhere

    //Convert Buffer Data
    app.use(express.json({}))

    //Set API Routing
    app.use(`/auth`, authRouter)
   
    app.use(`/booking`, bookingRouter)
   
    app.use(`/cart`, cartRouter)
   
    app.use(`/category`, categoryRouter)

    app.use(`/company`, companyRouter)

    app.use(`/coupon`, couponRouter)
   
    app.use(`/event`,eventRouter)
   
    // app.use(`/reviews`)

    app.all('*', (req, res, next) => {
       return res.send("hello mother fucker")
    })
    
    app.use(globalErrorHandling)
    
    connectDB()
}
 

export default initApp