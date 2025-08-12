import { model, Schema, Types } from "mongoose";
import { CreateShiftRequest } from "src/validators/shift/shift.validators";

interface IShift extends Pick<CreateShiftRequest, "agentsRequired" | "isPublic"> {
    startTime: Date,
    endTime: Date
    clients: [Types.ObjectId]
}


const shiftSchema = new Schema<IShift>({
    agentsRequired: Number,
    clients: [{ type: Types.ObjectId, ref: "Clients" }],
    startTime: Date,
    endTime: Date,
    isPublic: { type: Boolean, default: false }
})
const Shift = model("Shifts", shiftSchema)
export default Shift