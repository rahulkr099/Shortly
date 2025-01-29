//Importing required modules
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config();
export const auth = (req, res, next) => {
  try {
    let googleToken;
    // Retrieve token from request body, cookies, or headers
    const token =
      req?.cookies?.accessToken ||
      req?.body?.accessToken ||
      req?.headers?.["authorization"]?.replace("Bearer ", "");
      console.log('token in authMiddleware.js',token)
    if(!token){
       googleToken = req?.body?.googleMiddlewareToken || req?.cookies?.googleMiddlewareToken;
       console.log('googleMiddlewareToken in authMiddleware.js',googleToken)

      // Check if the token is missing
    if (!googleToken && !token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing. Please provide a valid token.",
      });
    }
    }
    // Verify the token
    try {
      let decode;
      if(token){
       decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      }else{
        decode = jwt.verify(googleToken, process.env.Google_Middleware_TOKEN_SECRET);
      }
      console.log(decode);
      if (!decode) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid or Expired Token" });
      }
      req.user = decode;//user data is inserted in req so that we can check authenticated user is using our services
      //eg. while shortening our url we can check who is requesting for shortening service 
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
