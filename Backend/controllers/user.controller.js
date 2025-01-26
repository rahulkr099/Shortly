import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import dotenv from 'dotenv'
import jwt from "jsonwebtoken";
dotenv.config();
//sign up route handler
/*
1. fetch data from req.body
2. validate input
3. check if user already exists
4. hash the password in try and catch
5. create a new user in the database
6. send a success response
*/
export const signup = async (req, res) => {
  try {
    //1. Fetch data from req.body
    const { firstName, lastName, email, password, role } = req.body;

    //2. Validate input
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (firstName, lastName, email, password, role) are required",
      });
    }

    //3. Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    //4. Hash the password in try and catch
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      console.error(`Error hashing password: ${err.message}`);
      return res.status(500).json({
        success: false,
        message:
          "An error occurred while hashing the password. Please try again.",
      });
    }
    //5. Create a new user in the database
    let user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role,
    });
    //6. Send a success response
    return res.status(201).json({
      success: true,
      message: "User Created Successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "User cannot be register, Please try again later",
    });
  }
};
//Login
/*
1. fetch email, password from req.body
2. validate data
3. check if user exists or not
4. validate password using bcrypt.compare
5. Generate JWT token
6. Remove sensitive data before sending response
7. Set token as an HTTP-only cookie
8. set the cookie and send response
*/
export const login = async (req, res) => {
  try {
    //1.fetch email, password from req.body
    const { email, password } = req.body;

    //2. validate data
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }
    //3.check if user exists or not
    let user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Email.",
      });
    }
    //4.validate password using bcrypt.compare
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({
        success: false,
        message: "Incorrect Password",
      });
    }
    //5.Generate JWT
    const accessToken = generateAccessToken({
      /*username:user.username,
             firstName:user.firstName,
             lastName:user.lastName */
      email: user.email,
      id: user._id,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      email: user.email,
      id: user._id,
    });
    //save the refreshToken in db to check further
    await User.findByIdAndUpdate(
      user._id, //use user id to find the user
      { refreshToken }, //update the refreshToken field
      { new: true }
    ); //Return the updated document
    //6.Remove sensitive data before sending response
    const sanitizedUser = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
    //7.Set token as an HTTP-only cookie
    const cookieOptions = {
      domain:"shortly-f-rahul-kumars-projects-cdeca0dc.vercel.app",
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), //3 days
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      secure: process.env.NODE_ENV === 'production'
    };
    console.log("Setting cookies...");
console.log("Access Token Cookie Options:", cookieOptions);
console.log("Refresh Token Cookie Options:", cookieOptions);
    //8.set the cookie and send response
    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        success: true,
        accessToken,
        refreshToken,
        user: sanitizedUser,
        message: "User logged in successfully",
      });
  } catch (err) {
    console.error(`Error during login process: ${err.message}`);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login. Please try again later.",
    });
  }
};
export const logout = async (req, res) => {
  try {
    //Invalidate the token so that no one can misuse it
    // const {email} = req.body;

    // await User.findByIdAndUpdate({email},{refreshToken:null});
    //clear the "token" cookie
    res.clearCookie("accessToken").clearCookie("refreshToken", {
      path: "/",
      httpOnly: true,
    });
    //Respond with a success message
    return res.status(200).json({
      success: true,
      message: "User Logged out successfully",
    });
  } catch (error) {
    console.error("Error during logout", error);
    return res.status(500).json({
      success: false,
      message: "Failed to log out. Please try again.",
    });
  }
};
export const refreshAccessToken = async (req, res) => {
  const incomingRefreshToken =
    req?.cookies?.refreshToken ||
    req?.body?.refreshToken ||
    req?.headers?.["authorization"]?.replace("Bearer ", "");

  if (!incomingRefreshToken) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized request: Refresh Token is missing",
    });
  }
  try {
    let decodedToken;
    try {
    decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    // console.log("Decoded Token:", decodedToken);
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({
        success:false,
        message: "Refresh token is expired or invalid"
      })
    }

    const userById = await User.findById(decodedToken?.id);
    // const userByEmail = await User.findOne({ email: decodedToken?.email });

    console.log("User by ID:", userById);
    // console.log("User by Email:", userByEmail);

    // const user = userById || userByEmail;
    // console.log("Final User:", user);
    const user = userById;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token.",
      });
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token.",
      });
    }

    const newAccessToken = generateAccessToken({
      email: user.email,
      id: user._id,
      role: user.role,
    });
    const newRefreshToken = generateRefreshToken({
      email: user.email,
      id: user._id,
    });
    await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });

    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), //1 days
      httpOnly: true,
    };
    return res
      .status(200)
      .cookie("accessToken", newAccessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json({
        success: true,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        message: "Access Token Refreshed",
      });
  } catch (error) {
    console.error(`Error in refreshing the token: ${error}`);
    return res.status(401).json({
      success: false,
      message: "Invalid Refresh token or Server error",
    });
  }
};
