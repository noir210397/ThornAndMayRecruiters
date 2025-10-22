import { model, Schema, Types } from "mongoose";
import { IBooking } from "src/types/booking";

const bookingSchema = new Schema<IBooking>({
    client: {
        companyName: String,
        address: {
            postCode: String,
            streetAddress: String,
            town: String
        }
    },
    startTime: { type: Date },
    endTime: { type: Date },
    wasPresent: { type: Boolean, default: false },
    shiftId: Types.ObjectId,
    agentId: Types.ObjectId,
    agentDetails: {
        fullName: String,
        email: String
    },
    status: { type: String, default: "active" },
    isActive: { type: Boolean, default: true },
    isCancelled: { type: Boolean, default: true }
})
const Booking = model("Bookings", bookingSchema)
export default Booking
