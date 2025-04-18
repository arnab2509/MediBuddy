import messageModel from "../models/messageModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from "cloudinary";

// Get all messages for a specific appointment
const getMessages = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        
        // Check if appointment exists and user/doctor has access
        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.json({ success: false, message: "Appointment not found" });
        }
        
        // Verify that the requesting user is either the patient or the doctor
        if (req.body.userId && req.body.userId !== appointment.userId && 
            req.body.docId && req.body.docId !== appointment.docId) {
            return res.json({ success: false, message: "Unauthorized access" });
        }
        
        // Get messages for this appointment
        const messages = await messageModel.find({ appointmentId }).sort({ timestamp: 1 });
        
        res.json({ success: true, messages });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Send a new message
const sendMessage = async (req, res) => {
    try {
        const { appointmentId, content, senderId } = req.body;
        
        // Check if appointment exists
        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.json({ success: false, message: "Appointment not found" });
        }
        
        // Create message data
        const messageData = {
            appointmentId,
            userId: appointment.userId,
            docId: appointment.docId,
            senderId,
            content,
            timestamp: Date.now()
        };
        
        // Save message to database
        const newMessage = new messageModel(messageData);
        await newMessage.save();
        
        res.json({ success: true, message: newMessage });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Upload file and send message with file
const sendFileMessage = async (req, res) => {
    try {
        const { appointmentId, content, senderId } = req.body;
        const file = req.file;
        
        if (!file) {
            return res.json({ success: false, message: "No file uploaded" });
        }
        
        // Check if appointment exists
        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.json({ success: false, message: "Appointment not found" });
        }
        
        // Upload file to cloudinary
        const fileUpload = await cloudinary.uploader.upload(file.path, { resource_type: "auto" });
        const fileUrl = fileUpload.secure_url;
        
        // Determine file type from mimetype
        const fileType = file.mimetype.split('/')[0]; // 'image', 'application', etc.
        
        // Create message data with file
        const messageData = {
            appointmentId,
            userId: appointment.userId,
            docId: appointment.docId,
            senderId,
            content: content || "Sent a file", // Default message if no content provided
            fileUrl,
            fileType,
            fileName: file.originalname,
            timestamp: Date.now()
        };
        
        // Save message to database
        const newMessage = new messageModel(messageData);
        await newMessage.save();
        
        res.json({ success: true, message: newMessage });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { getMessages, sendMessage, sendFileMessage }; 