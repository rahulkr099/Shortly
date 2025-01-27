import dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken";

// Modularized function for generating JWT
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '2h',
    });
};
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload,process.env.REFRESH_TOKEN_SEC,{
        expiresIn: '5h',
    })
}
export const generateGoogleMiddlewareToken = (payload) => {
    return jwt.sign(payload,process.env.Google_Middleware_TOKEN_SECRET,{
        expiresIn: '2h',
    })
}
