import mongoose from "mongoose";
import { nanoid } from "nanoid";

// Define schema for URL shortening
const urlSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // Unique identifier for the shortened URL (can be custom)
    nanoId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => nanoid(),
    },
    // Original URL
    redirectURL: {
      type: String,
      required: true,
      unique: true,
    },
    // Expiration date
    expiresAt: {
      type: Date,
      default: null,
    },
    // History of visits with additional tracking data
    visitHistory: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
        },
        referrer: {
          type: String,
          default: "Direct",
        },
        device: {
          type: String,
          default: "Unknown",
        },
        browser: {
          type: String,
          default: "Unknown",
        },
        ip: {
          type: String,
          default: "Unknown",
        },
      },
    ],
    // Click stats
    totalClicks: {
      type: Number,
      default: 0,
    },
    // Last visit timestamp
    lastVisited: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

const URL = mongoose.model("URL", urlSchema);

export default URL;
