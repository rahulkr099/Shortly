import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { passwordUpdated } from "../mail/passwordUpdate.js";
import dotenv from 'dotenv'
dotenv.config();
import {mailSender} from "../utils/mailSender.js";

export const resetPasswordToken = async (req, res) => {
  try {
    //1. Extract email from req
    const email = req.body.email;
    // Regex for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email Format",
      });
    }
    //2. Check user exists or not
    const user = await User.findOne({ email });
    //3.Validate data
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email is Not Registered",
      });
    }
    //4.Generate Token and hash it
    const resetPasswordToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetPasswordToken)
      .digest("hex");
    //5.Update User by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email }, //find Details using email parameter
      {
        //update token and resetPasswordExpires to respective details
        resetPasswordToken: hashedToken,
        resetPasswordExpires: Date.now() + 3 * 60 * 1000,
      },
      { new: true }
    );
    //6.Create url
    const BASE_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    const url = `${BASE_URL}/reset-password?token=${resetPasswordToken}&email=${encodeURIComponent(
      email
    )}`;
    //send mail containing url
    await mailSender(email, "Password Reset", passwordUpdated(email, url));

    return res.status(200).json({
      success: true,
      message: "Check Your Mail for Resseting the password",
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing the request",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    //1.Fetch data from req.body
    const { password, confirmPassword, email } = req.body;
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }
    if (confirmPassword !== password) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password Does not Match.",
      });
    }
    // const token = req?.cookies?.urltoken;
    // const tokenInUrl = req?.params?.token;
    const tokenInUrl = req?.query?.token;
    // console.log('\nreset password:',token,tokenInUrl);

    if (!tokenInUrl) {
      return res.json({
        success: false,
        message: "url has invalid token",
      });
    }
    //2.Validate data

    //3.Get userDetails from DB using hashedToken
    const hashedToken = crypto
      .createHash("sha256")
      .update(tokenInUrl)
      .digest("hex");
    const userDetails = await User.findOne({
      email,
      resetPasswordToken: hashedToken,
    });
    //4.Validate userDetails
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is Invalid ",
      });
    }
    //5.Check token time - if expires
    if (!(userDetails.resetPasswordExpires > Date.now())) {
      return res.status(403).json({
        success: false,
        message: `Token is Expired, Please Regenerate Your Token.`,
      });
    }
    //6.Hash the password
    const encryptedPassword = await bcrypt.hash(password, 10);
    //7.Update the password
    await User.findOneAndUpdate(
      { email, resetPasswordToken: hashedToken },
      {
        password: encryptedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
      { new: true }
    );
    //8.Send status code 200
    return res.status(200).json({
      success: true,
      message: `Password Reset Successful`,
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({
      error: error.message,
      success: false,
      message: `An error occurred while resetting the password`,
    });
  }
};
