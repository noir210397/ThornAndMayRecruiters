import { Schema, model, } from 'mongoose';
import { IJob, JobType } from 'src/types/jobs';
const jobSchema = new Schema<IJob>({
    canApplyViaIndeed: { type: Boolean, default: false },
    details: {
        location: String,
    },
    type: { type: String, default: JobType.Perm },
    pay: {
        minPay: Number,
        maxPay: Number
    },
    sector: String,
    roleDescription: String,
    whatYouNeed: [String],
    requirements: {
        days: { type: [String] },
        timeDescription: String,
    },
    applicationEmail: String
}, {
    timestamps: true
});
const Job = model('Jobs', jobSchema);
export default Job
