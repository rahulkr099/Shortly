// Import the Mongoose library for MongoDB interactions
import mongoose from "mongoose";

import { nanoid } from "nanoid";

// Define a new Mongoose schema for storing URL data
const urlSchema = new mongoose.Schema(
  { 
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      required:true,
      ref:"User",
    },
    // Unique identifier for the shortened URL
    nanoId: {
      type: String, // Data type for nanoId
      required: true, // Ensure nanoId is always provided
      unique: true, // Prevent duplicate nanoIds
      index: true, // Add an index for faster lookups
      default: () => nanoid(),
    },
    // Original URL to redirect to
    redirectURL: {
      type: String, // Data type for redirectURL
      required: true, // Ensure redirectURL is always provided
      unique: true,
      message: "Invalid URL format",
    },
    // Record of visits with timestamps
    visitHistory: [
      {
        timestamp: {
          type: Date, // Use Date for visit timestamp
          default: Date.now, // Default to current date/time
        },
      },
    ],
    // Total number of clicks for this short URL
    totalClicks: {
      type: Number,
      default: 0, // Default to 0 clicks
    },
    // Timestamp of the last visit
    lastVisited: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create a Mongoose model named "URL" based on the urlSchema
const URL = mongoose.model("URL", urlSchema);

// Export the URL model for use in other files
export default URL;
