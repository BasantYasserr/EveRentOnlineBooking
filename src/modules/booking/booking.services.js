// import CartModel from "../../../DB/models/cart.model.js"
import EventModel from "../../../DB/model/event.model.js"


// export const clearCart = async (userId) => {
//     await CartModel.findOneAndUpdate({user: userId} , {events : []})
// }

export const updateSock = async (events, placeBooking) => {
    if (placeBooking) {
        for (const event of events) {

            await EventModel.findByIdAndUpdate(event.eventId , {
                $inc : {
                    availableTickets : -event.quantity,
                    soldTickets : event.quantity
                }
            })
        } 
    } else {
        for (const event of events) {

            await EventModel.findByIdAndUpdate(event.eventId , {
                $inc : {
                    availableTickets : event.quantity,
                    soldTickets : -event.quantity
                }
            })
        } 
    }
}