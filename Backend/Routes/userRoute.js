import express from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import {
  LoginHandler,
  RegisterHandler,
  verifyotp,
  ProfileHandler,
  ForgetEmailHandler,
  verifyforgetpasswordHandler,
  NewpasswordHandler,
  LogOutHandler,
  GetCurrentUserHandler,
  RefreshTokenHandler,
  SwitchRoleHandler,
} from "../Controller/userController.js";

const router = express.Router();

router.post("/register", RegisterHandler);
router.post("/login", LoginHandler);
router.post("/verify-otp", verifyotp);
router.put("/profile", authMiddleware, ProfileHandler);
router.post("/forgot-password", ForgetEmailHandler);
router.post("/verify-forgot-password", verifyforgetpasswordHandler);
router.put("/new-password", authMiddleware, NewpasswordHandler);
router.patch("/logout", authMiddleware, LogOutHandler);
router.get("/me", authMiddleware, GetCurrentUserHandler);
router.post("/refresh-token", RefreshTokenHandler);
router.post("/switch-role", authMiddleware, SwitchRoleHandler);
export default router;
