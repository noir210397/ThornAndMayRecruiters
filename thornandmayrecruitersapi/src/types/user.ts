export interface IUser {
    firstName: string,
    lastName: string,
    age: number,
    shareCode: string,
    accNumber: string,
    sortCode: string,
    gender: string,
    mobileNumber: string,
    email: string,
    streetAddress: string,
    postCode: string,
    town: string,
    hashedPassword: string
    role: Role,
    mustChangePassword: boolean
    isDeleted: boolean
}

