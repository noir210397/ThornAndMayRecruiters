import { RequestHandler } from "express";
import { StatusCode } from "src/constants/http";
import { changeUserPassword, createAdmin, createManager, getResetPasswordToken, resetPassword, signInUser } from "src/services/auth.service";
import { CustomError } from "src/utils/customerror";
import { changePasswordSchema, createAdminOrManagerSchema, loginSchema, passwordResetSchema, resetTokenSchema } from "src/validators/user/user.validators";

export const signInUserHandler: RequestHandler = async (req, res) => {
    const { success, data, error } = loginSchema.safeParse(req.body)
    if (!success) {
        throw new CustomError(StatusCode.Status400BadRequest, error)
    }
    const tokens = await signInUser(data)
    if (tokens.resetToken) throw new CustomError(
        StatusCode.Status403Forbidden,
        tokens,
        'Password change required'
    );
    return res.json(tokens)
}
export const createAdminHandler: RequestHandler = async (req, res) => {
    const { success, data, error } = createAdminOrManagerSchema.safeParse(req.body)
    if (!success) {
        throw new CustomError(StatusCode.Status400BadRequest, error)
    }
    res.json(await createAdmin(data))
}
export const createManagerHandler: RequestHandler = async (req, res) => {
    const { success, data, error } = createAdminOrManagerSchema.safeParse(req.body)
    if (!success) {
        throw new CustomError(StatusCode.Status400BadRequest, error)
    }
    res.json(await createManager(data))
}
export const getResetTokenHandler: RequestHandler = async (req, res) => {
    const { success, data, error } = resetTokenSchema.safeParse(req.body)
    if (!success) {
        throw new CustomError(StatusCode.Status400BadRequest, error)
    }
    res.json(await getResetPasswordToken(data))
}
export const resetPasswordHandler: RequestHandler = async (req, res) => {
    const { success, data, error } = passwordResetSchema.safeParse(req.body)
    if (!success) {
        throw new CustomError(StatusCode.Status400BadRequest, error)
    }
    res.json(await resetPassword(data))
}
export const changePasswordHandler: RequestHandler = async (req, res) => {
    const { success, data, error } = changePasswordSchema.safeParse(req.body)
    if (!success) {
        throw new CustomError(StatusCode.Status400BadRequest, error)
    }

    await changeUserPassword(req.user!.email, data.password)
    return res.sendStatus(StatusCode.Status204NoContent)
}


