import fetch from "node-fetch";
import { oauth2Client } from "../utils/oauth2Client.js";
import User from "../models/user.model.js";
import dotenv from 'dotenv';
import { generateGoogleMiddlewareToken } from "../utils/generateToken.js";
dotenv.config();
/* GET Google Authentication API */
export const googleLogin = async (req, res) => {
  const code = req.query.code;
  // console.log("backend google controller:", code);
  if (!code) {
    return res.status(400).json({
      message: "Authorization code is missing",
    });
  }
  try {
    // Step 1: Exchange authorization code for access tokens
    const googleRes = await oauth2Client.getToken(code);
    // console.log('tokens in googlecontroller:',googleRes)
    oauth2Client.setCredentials(googleRes.tokens);

    // Step 2: Fetch user info from Google API
    const userRes = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    if (!userRes.ok) {
      const errorText = await userRes.text();
      throw new Error(`Failed to fetch user info: ${errorText}`);
    }

    const { email, name } = await userRes.json();
    if (!email || !name) {
      throw new Error("Incomplete user data received from Google");
    }

    // Extract firstName and lastName from Google's name
    const [firstName, ...lastNameArray] = name.split(" ");
    const lastName = lastNameArray.join(" ");

    // Step 3: Check if user exists in the database
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        firstName,
        lastName: lastName || "", // Default to empty string if lastName is missing
        authType: "google",
        email,
        role: "user", // Default role as 'user'
        // accessToken: googleRes.tokens.access_token,
        // refreshToken: googleRes.tokens.refresh_token,
      });
    }
    const googleAccessToken = googleRes.tokens.access_token;
    console.log("googleAccessToken in googleLogin", googleAccessToken);
    const googleRefreshToken = googleRes.tokens.refresh_token;
    console.log('googleRefreshToken in googleLogin',googleRefreshToken);
    // const id_token = googleRes.tokens.id_token;
//googleMiddlewareToken is used to store google authenticated user details. So that we can 
//verify authenticated user is accessing the services.
    const googleMiddlewareToken = generateGoogleMiddlewareToken({
          firstName:user.firstName,
          lastName:user.lastName,
          email: user.email,
          id: user._id,
          role: user.role,
        });
    const cookieOptions = {
      expires: new Date(Date.now() + 12 * 60 * 60 * 1000), //12 hr
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production'?'None':'strict',
      secure: process.env.NODE_ENV === 'production'? true : false,
    };
    // Step 5: Send the response
    return res
      .status(200)
      .cookie("googleAccessToken", googleAccessToken, cookieOptions)
      .cookie("googleRefreshToken",googleRefreshToken,cookieOptions)
      .cookie("googleMiddlewareToken",googleMiddlewareToken,cookieOptions)
      .json({
        success: true,
        message: "Authentication successful",
        googleRefreshToken,
        googleAccessToken,
        googleMiddlewareToken,
        user,
      });
  } catch (err) {
    console.error("Google Authentication Error:", err.message);

    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
