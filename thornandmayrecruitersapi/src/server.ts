import 'dotenv/config';
import { connectDB } from './config/db.config';
import app from './config/app.config';
const PORT = process.env.PORT || 3000
const ENV = process.env.ENV

async function startServer() {
    try {
        await connectDB()
        app.listen(PORT)
        // console.log(`server running on port ${PORT}`);
        if (ENV === "DEV") console.log(`url: http://localhost:${PORT}`);
    }
    catch (err) {
        console.log(err);
    }
}
startServer()