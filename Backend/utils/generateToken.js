import dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken";

// Modularized function for generating JWT
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
};
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    })
}
export const generateGoogleMiddlewareToken = (payload) => {
    return jwt.sign(payload,process.env.Google_Middleware_TOKEN_SECRET,{
        expiresIn: process.env.Google_Middleware_TOKEN_EXPIRY,
    })
}
