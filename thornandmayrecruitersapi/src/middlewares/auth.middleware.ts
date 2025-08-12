import { RequestHandler } from "express";
import { StatusCode } from "src/constants/http";
import { AccessTokenPayload } from "src/types/token";
import { verifyToken } from "src/utils/jwthelper";

function authorize(allowedRoles?: string) {
    const authMiddleware: RequestHandler = (req, res, next) => {
        const bearer = req.headers.authorization
        if (!bearer) return res.sendStatus(StatusCode.Status401Unauthorized)
        const token = bearer.split(" ")[1]
        if (!token) return res.sendStatus(StatusCode.Status401Unauthorized)
        const payload = verifyToken(token) as AccessTokenPayload
        if (!allowedRoles) {
            req.user = payload
            next()
        }
        else {
            const isAuthorized = allowedRoles.split(",").find((role) => role === payload.role)
            if (!isAuthorized) return res.sendStatus(StatusCode.Status403Forbidden)
            req.user = payload
            next()
        }
    }
    return authMiddleware
}
export { authorize }