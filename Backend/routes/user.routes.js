//Require express.Router() 
import express from 'express';
const router = express.Router();

//Require Models, Controllers and Middlewares as per need
import { login, signup, logout, refreshAccessToken } from "../controllers/user.controller";
import {signupSchema, loginSchema} from "../validations/user.validation";
import {validateRequest} from "../middlewares/validation.middleware";
import { auth } from '../middlewares/auth.middleware';
import {resetPasswordToken, resetPassword} from "../services/resetPassword.services";
import { authStatus } from '../services/authStatus.services';
import {googleLogin} from "../services/googleLogin.services";
import { checkGoogleAccessToken, authenticateGoogleRequest } from '../services/googleAuth.services';
import {revokeGoogleToken} from '../services/revokeGoogleToken.services';
// **********************************************************
//  Authentication routes
// **********************************************************

//create Routes using HTTP methods
router.post("/signup",validateRequest(signupSchema),signup);
router.post("/login",validateRequest(loginSchema),login);
//Auth Test
router.get("/test",auth,(req,res)=>{
    res.json({
        success: true,
        message: "Test Successful"
    });
});
router.post("/logout",logout);
router.post("/auth/status",authStatus);

// **************************************************************
// Forgot Password routes
// **************************************************************
// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)
router.post("/refresh-token",refreshAccessToken)
router.get('/google/auth',googleLogin);
router.get('/google/auth/status',checkGoogleAccessToken);
router.get('/google/auth/refresh',authenticateGoogleRequest);
router.post('/google/auth/revoke',revokeGoogleToken);

export default router;
