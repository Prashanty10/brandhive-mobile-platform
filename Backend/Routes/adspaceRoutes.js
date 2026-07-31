import express from "express";
import { adspacecontroller, adSpaceInfo } from "../Controller/adspaceController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const adspaceRouter = express.Router();

adspaceRouter.post("/", authMiddleware, adspacecontroller);


adspaceRouter.get("/my-advertisements", authMiddleware, adSpaceInfo);

export default adspaceRouter;