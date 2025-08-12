import { JsonWebTokenError } from "jsonwebtoken";
import { StatusCode } from "src/constants/http";
import PasswordResetModel from "src/models/passwordreset.model";
import User from "src/models/user.model";
import { RefreshTokenPayload, ResetPasswordTokenPayload } from "src/types/token";
import { CustomError } from "src/utils/customerror";
import { generateAccessToken, generatePasswordResetToken, generateRefreshToken, verifyToken } from "src/utils/jwthelper";
import { hashPassword, isPasswordValid } from "src/utils/passwordhelper";
import { createAdminorManagerRequest, createAgentRequest, LoginRequest, PasswordResetRequest, RefreshTokenRequest, ResetTokenRequest } from "src/validators/user/user.validators";

async function signInUser({ email, password }: LoginRequest) {
    const user = await User.findOne({ email: email }).exec()
    if (!user) {
        throw new CustomError(StatusCode.Status404NotFound, { email: `no user with email: ${email}` })
    }
    const validPassword = await isPasswordValid(user.password, password)
    if (!validPassword) throw new CustomError(StatusCode.Status400BadRequest, { password: "invalid password" })
    if (user.mustChangePassword) {
        const passwordReset = await PasswordResetModel.create({ email: email })
        const resetToken = generatePasswordResetToken(email, passwordReset._id.toString())
        //redirect with this
        return { resetToken }
    }
    const jwtPayload = {
        sub: user._id.toString(),
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role
    };
    const accessToken = generateAccessToken(jwtPayload)
    const refreshToken = generateRefreshToken({ sub: jwtPayload.sub, email: jwtPayload.email, })
    return {
        accessToken, refreshToken
    }
}
async function createAdmin(admin: createAdminorManagerRequest) {
    const user = await User.findOne({ email: admin.email }).exec()
    if (user) {
        throw new CustomError(StatusCode.Status400BadRequest, { email: `user with this email address already exists` })
    }
    await User.create({ ...admin, mustChangePassword: true })
    return {
        email: admin.email, password: admin.password
    }
}
async function createManager(manager: createAdminorManagerRequest) {
    const user = await User.findOne({ email: manager.email }).exec()
    if (user) {
        throw new CustomError(StatusCode.Status400BadRequest, { email: `user with this email address already exists` })
    }
    await User.create({ ...manager, mustChangePassword: true })
    return {
        email: manager.email, password: manager.password
    }
}
async function createAgent(agent: createAgentRequest) {
    const user = await User.findOne({ email: agent.email }).exec()
    if (user) {
        throw new CustomError(StatusCode.Status400BadRequest, { email: `user with this email address already exists` })
    }
    agent.password = await hashPassword(agent.password)
    const createdUser = await User.create(agent)
    const jwtPayload = {
        sub: createdUser._id.toString(),
        email: createdUser.email,
        name: `${createdUser.firstName} ${createdUser.lastName}`,
        role: createdUser.role
    };
    const accessToken = generateAccessToken(jwtPayload)
    const refreshToken = generateRefreshToken({ sub: jwtPayload.sub, email: jwtPayload.email, })
    return {
        accessToken, refreshToken
    }
}
async function changeUserPassword(email: string, password: string) {
    // if (!(userDetails.email === authorizedEmail)) throw new CustomError(StatusCode.Status401Unauthorized)
    const user = await User.findOne({ email: email }).exec()
    if (!user) {
        throw new CustomError(StatusCode.Status400BadRequest, { email: `no user was foun with email ${email}` })
    }
    user.password = await hashPassword(password)
    user.save()
}
async function getResetPasswordToken(userDetails: ResetTokenRequest) {
    const user = await User.findOne({ email: userDetails.email }).exec()
    if (!user) {
        throw new CustomError(StatusCode.Status400BadRequest, { email: `no user was found with email ${userDetails.email}` })
    }
    const passwordReset = await PasswordResetModel.create({ email: userDetails.email })
    const resetToken = generatePasswordResetToken(userDetails.email, passwordReset._id.toString())
    // send resetToken via email with baseUrl
}
async function resetPassword({ password, resetToken }: PasswordResetRequest) {
    const payload = verifyToken(resetToken, "reset") as ResetPasswordTokenPayload
    const reset = await PasswordResetModel.findByIdAndDelete(payload.jti).exec();
    const user = await User.findOne({ email: payload.sub }).exec()
    if (!reset) {
        throw new CustomError(StatusCode.Status400BadRequest, null, "invalid or expired token")
    }
    if (!user) {
        throw new CustomError(StatusCode.Status400BadRequest, null, `no user with Email:${payload.sub}`)
    }
    user.password = await hashPassword(password)
    await user.save()
}
async function getNewAccessToken({ refreshToken }: RefreshTokenRequest) {
    const { email } = verifyToken(refreshToken, "refresh") as RefreshTokenPayload
    const user = await User.findOne({ email: email }).exec()
    if (!user) {
        throw new CustomError(StatusCode.Status404NotFound, { email: `no user with email: ${email}` })
    }
    const jwtPayload = {
        sub: user._id.toString(),
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role
    };
    const accessToken = generateAccessToken(jwtPayload)
    //change later so tokens to be used just once add sessions
    // const refreshToken = generateRefreshToken({ sub: jwtPayload.sub, email: jwtPayload.email, })
    return {
        accessToken, refreshToken
    }

}
export { getNewAccessToken, changeUserPassword, createAdmin, createAgent, createManager, resetPassword, getResetPasswordToken, signInUser }