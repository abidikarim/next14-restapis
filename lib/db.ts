import mongoose from "mongoose";
const MONGODB_URL = process.env.MONGODB_URL;

const connect = async () => {
    const connectionState = mongoose.connection.readyState;
    if(connectionState === 1) {
        console.log("Already connected")
        return
    }
    if(connectionState === 2 ) {
        console.log("Connecting...")
        return 
    }
    try {
        mongoose.connect(MONGODB_URL!,{
            dbName:'next-rest-api',
            bufferCommands:true
        })
        console.log('Connected')
    } catch (error) {
        console.log("Connected Error",error)
        throw new Error("Error",error!)
    }
}
export default connect