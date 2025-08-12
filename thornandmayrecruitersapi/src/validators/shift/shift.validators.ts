import { z } from "zod";
import dayjs, { Dayjs } from "dayjs";


const zDayjs: z.ZodType<Dayjs> = z.union([z.date(), z.string(), z.number()])
    .transform((val, ctx) => {
        const d = dayjs(val as any);
        if (!d.isValid()) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid date" });
            return z.NEVER;
        }
        return d;
    });

export const shiftSchema = z.object({
    agentsRequired: z.number().int().min(0, "agentsRequired must be >= 0"),
    clients: z.array(z.email().trim()),
    startTime: zDayjs,                    // Dayjs
    endTime: zDayjs,                      // Dayjs
    isPublic: z.boolean().default(false),
})
    .superRefine((data, ctx) => {
        // 1) start > now
        if (!data.startTime.isAfter(dayjs())) {
            ctx.addIssue({
                code: "custom",
                message: "startTime must be later than now",
                path: ["startTime"],
            });
        }

        // 2) end > start
        if (!data.endTime.isAfter(data.startTime)) {
            ctx.addIssue({
                code: "custom",
                message: "endTime must be after startTime",
                path: ["endTime"],
            });
        }
    });

export type CreateShiftRequest = z.infer<typeof shiftSchema>

export const bookAgentsSchema = shiftSchema.pick({
    clients: true
}).extend({
    shiftId: z.string().trim().min(1, "minimum of a character")
})
export type bookMultipleUsers = z.infer<typeof bookAgentsSchema>
export const bookSingleSchema = z.object({
    shiftId: z.string().trim().min(1, "minimum of a character"),
    email: z.email("Invalid Email Address").trim(),
});
export type BookUser = z.infer<typeof bookSingleSchema>;

