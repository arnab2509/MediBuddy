import express from "express";
import multer from "multer";
import path from "path";
import { getMessages, sendMessage, sendFileMessage } from "../controllers/chatController.js";
import authUser from "../middleware/authUser.js";
import authDoctor from "../middleware/authDoctor.js";

const chatRouter = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
    },
});

const upload = multer({ storage });

// Chat routes for patients (users)
chatRouter.post("/user/messages", authUser, getMessages);
chatRouter.post("/user/send", authUser, sendMessage);
chatRouter.post("/user/send-file", authUser, upload.single("file"), sendFileMessage);

// Chat routes for doctors
chatRouter.post("/doctor/messages", authDoctor, getMessages);
chatRouter.post("/doctor/send", authDoctor, sendMessage);
chatRouter.post("/doctor/send-file", authDoctor, upload.single("file"), sendFileMessage);

export default chatRouter; 