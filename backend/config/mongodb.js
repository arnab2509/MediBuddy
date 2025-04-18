import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"))
        mongoose.connection.on('error', (err) => console.error("MongoDB Connection Error:", err))
        
        await mongoose.connect(`${process.env.MONGODB_URI}/medibuddy`)
        console.log("Connected to medibuddy database")
    } catch (error) {
        console.error("Database connection failed:", error)
        process.exit(1) // Exit with failure
    }
}

export default connectDB;

// Do not use '@' symbol in your databse user's password else it will show an error.