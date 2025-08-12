// src/models/job.ts


export enum JobType {
    Temp = 'temp',
    Perm = 'perm'
}

export interface IJob {
    canApplyViaIndeed: boolean;
    details: {
        location: string;
    };
    type: JobType;
    pay: {
        minPay: number,
        maxPay: number
    }
    sector: string;
    roleDescription: string;
    whatYouNeed: string[];  // e.g. ["CV", "Cover letter"]
    requirements: {
        days: string[];           // e.g. ["Monday", "Wednesday"]
        timeDescription: string;  // e.g. "9am–5pm"
    };
    applicationEmail: string
}




