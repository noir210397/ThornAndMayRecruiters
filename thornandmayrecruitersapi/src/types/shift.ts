import { Types } from "mongoose";

export interface IShift {
    client?: Types.ObjectId
    startTime: Date,
    endTime: Date,
    agentsRequired: number,
    isPublic: boolean
}