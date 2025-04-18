import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    appointmentId: { type: String, required: true },
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    senderId: { type: String, required: true },
    content: { type: String, required: true },
    fileUrl: { type: String, default: '' },
    fileType: { type: String, default: '' },
    fileName: { type: String, default: '' },
    timestamp: { type: Number, default: Date.now }
})

const messageModel = mongoose.models.message || mongoose.model("message", messageSchema)
export default messageModel 