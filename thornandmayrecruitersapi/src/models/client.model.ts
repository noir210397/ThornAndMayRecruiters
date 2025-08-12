import { model, Schema } from "mongoose";
import { IClient } from "src/types/client";

const clientSchema = new Schema<IClient>({
    address: String,
    companyName: String,
    postCode: String,
    town: String
})
const Client = model("Clients", clientSchema)
export default Client