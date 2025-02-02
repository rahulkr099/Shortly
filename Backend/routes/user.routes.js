//Require express.Router() 
import express from 'express';
const router = express.Router();
// console.log('fstadfafda',import.meta.url);
//Require Models, Controllers and Middlewares as per need
import { login, signup, logout, refreshAccessToken } from "../controllers/user.controller.js";
import {signupSchema, loginSchema} from "../validations/user.validation.js";
import {validateRequest} from "../middlewares/validation.middleware.js";
import { auth } from '../middlewares/auth.middleware.js';
import {resetPasswordToken, resetPassword} from "../services/resetPassword.services.js";
import { authStatus } from '../services/authStatus.services.js';
import {googleLogin} from "../services/googleLogin.services.js";
import { checkGoogleAccessToken, authenticateGoogleRequest } from '../services/googleAuth.services.js';
import {revokeGoogleToken} from '../services/revokeGoogleToken.services.js';
import { generateAvatar } from '../controllers/avatar.controller.js';

//  Authentication routes
router.post("/signup",validateRequest(signupSchema),signup);
router.post("/login",validateRequest(loginSchema),login);
//Auth Test
router.get("/test",auth,(req,res)=>{
    res.json({
        success: true,
        message: "Test Successful"
    });
});
router.get("/avatar/:firstName/:lastName?",generateAvatar);//? makes lastName optional
router.post("/logout",logout);
router.post("/auth/status",authStatus);
router.post("/refresh-token",refreshAccessToken)

// Forgot Password routes
router.post("/reset-password-token", resetPasswordToken)
router.post("/reset-password", resetPassword)

//Google Auth Routes
router.get('/google/auth',googleLogin);
router.post('/google/auth/status',checkGoogleAccessToken);
router.post('/google/auth/refresh',authenticateGoogleRequest);
router.post('/google/auth/revoke',revokeGoogleToken);

export default router;
