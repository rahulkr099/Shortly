//Importing required modules
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config();

export const auth = (req, res, next) => {
  try {
    // Retrieve token from request body, cookies, or headers
    const token =
      req?.cookies?.accessToken ||
      req?.body?.accessToken ||
      req?.headers?.["authorization"]?.replace("Bearer ", "");

    // Check if the token is missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing. Please provide a valid token.",
      });
    }

    // Verify the token
    try {
      const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      // console.log(decode);
      if (!decode) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid or Expired Token" });
      }
      req.user = decode;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid.",
      });
    }

    next();
  } catch (err) {
    console.error("Error in authentication middleware:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing the token.",
    });
  }
};
