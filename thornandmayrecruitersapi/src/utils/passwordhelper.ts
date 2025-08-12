import bcrypt from "bcrypt";
const SALT_ROUNDS = 12
export async function hashPassword(password: string) {
    return await bcrypt.hash(password, SALT_ROUNDS)
}
export async function isPasswordValid(hashedPassword: string, password: string) {
    return await bcrypt.compare(password, hashedPassword)
}