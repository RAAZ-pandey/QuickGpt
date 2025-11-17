import express from "express";
import { protect } from "../middlewares/auth.js";
import { imageMessageContoller, textMessageContoller } from "../controllers/messageController.js";

const messageRouter = express.Router()

messageRouter.post('/text', protect, textMessageContoller)
messageRouter.post('/image', protect, imageMessageContoller)

export default messageRouter