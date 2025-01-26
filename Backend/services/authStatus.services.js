//Importing required modules
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
// const {extractToken} = require("../utils/extractToken");

export const authStatus = (req, res) => {
    try {
        // Retrieve token from request body, cookies, or headers
        const token = req?.cookies?.accessToken || req?.body?.accessToken || req?.headers?.['authorization']?.replace('Bearer ', '');
        console.log('auth ka token',token)
        // Check if the token is missing
        if (!token) {
            return res.status(403).json({
                success: false,
                message: "Token is missing. Please provide a valid token.",
            });
        }

        // Verify the token
        try {
			const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
			// console.log(decode);

			req.user = decode;
		} catch (error) {
            console.error('Error in decoding token',error);
			return res.status(401).json({
				success:false,
				message:"access token is invalid or expired."
			});
		}
	res.status(200).json({
        success:true,
        message:"User is logged in"
    })	
   

    } catch (err) {
        console.error("Error in authentication middleware:", err);
        return res.status(500).json({
            success: false,
            message: "An error occurred while processing the token.",
        });
    }
};
