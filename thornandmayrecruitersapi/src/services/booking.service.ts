import mongoose from "mongoose";
import { StatusCode } from "src/constants/http";
import Booking from "src/models/booking.model";
import Shift from "src/models/shift.model";
import { Role } from "src/types/roles";
import { AccessTokenPayload } from "src/types/token";
import { CustomError } from "src/utils/customerror";
import { formatJSON } from "src/utils/formatData";
import { UpdateBooking } from "src/validators/booking/booking.validators";

export async function getBookings(user: AccessTokenPayload) {
    const { role, sub } = user
    if (role === Role.AGENT.toString()) {
        const bookings = await Booking.find({ agentId: sub }).lean()
        return formatJSON(bookings)
    }
    else {
        const bookings = await Booking.find().lean()
        return formatJSON(bookings)
    }
}
export async function deleteBooking(bookingId: string) {
    const { deletedCount } = await Booking.deleteOne({ _id: bookingId })
    if (deletedCount === 0) throw new CustomError(StatusCode.Status404NotFound, null, `booking with id:${bookingId} not found`)
}
export async function cancelBooking(user: AccessTokenPayload, bookingId: string) {
    const { sub } = user
    const session = await mongoose.startSession()
    try {
        const booking = await Booking.findOneAndUpdate({ agentId: sub, _id: bookingId }, { status: "cancelled" }, { new: true }).lean().session(session)
        if (!booking) {
            throw new CustomError(StatusCode.Status404NotFound, null, "booking was not found")
        }
        await Shift.findByIdAndUpdate(booking._id, { $inc: { agentsBooked: -1, availableSlots: 1 } }).session(session)
    } catch (err) {
        if (err instanceof CustomError) throw err
        else throw new CustomError(StatusCode.Status500ServerError, null, "unableto delete booking try again")
    }
    finally {
        await session.endSession()
    }
}
export async function updateBooking(update: UpdateBooking, bookingId: string) {
    const updated = await Booking.findOneAndUpdate({ _id: bookingId }, update, { new: true }).lean()
    if (!updated) {
        throw new CustomError(StatusCode.Status404NotFound, null, "booking was not found")
    }
}
export async function getSingleBooking(bookingId: string, user: AccessTokenPayload) {
    const booking = await Booking.findOne({ _id: bookingId, }).lean()
    if (!booking)
        throw new CustomError(StatusCode.Status404NotFound, null, "booking was not found")
    if (user.role !== Role.AGENT.toString()) {
        return formatJSON(booking)
    }
    else {
        if (booking.agentId.toString() === user.sub) return formatJSON(booking)
        throw new CustomError(StatusCode.Status401Unauthorized)
    }

}