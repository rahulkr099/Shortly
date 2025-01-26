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
    // console.log("googleAccessToken", googleAccessToken);
    const googleRefreshToken = googleRes.tokens.refresh_token;
    // console.log('googleRefreshToken',googleRefreshToken);
    const id_token = googleRes.tokens.id_token;

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
      sameSite: 'None',
      secure: true // Only if your site has HTTPS
    };
    // Step 5: Send the response
    return res
      .status(200)
      .cookie("googleAccessToken", googleAccessToken, cookieOptions)
      .cookie("googleRefreshToken",googleRefreshToken,cookieOptions)
      .cookie("googleMiddlewareToken",googleMiddlewareToken,cookieOptions)
      // .cookie("id_token",id_token,cookieOptions) //used for google auth middleware
      .json({
        success: true,
        message: "Authentication successful",
        // token,
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
