// Import the URL model for database interactions
import URL from "../models/url.model.js";
import { nanoid } from "nanoid";


// async function createUrl(userId, redirectURL, customUrl = null) {
//   try {
//     const shortUrl = await URL.createShortUrl({
//       userId,
//       redirectURL,
//       customUrl,
//     });
//     console.log("Short URL created:", shortUrl);
//   } catch (error) {
//     console.error("Error creating short URL:", error.message);
//   }
// }

export async function handleUserAnalytics(req, res) {
  try {
    const userId = req.user.id;

    const urlEntry = await URL.find({ userId });
    if (!urlEntry)
      return res.status(404).json({ error: "URL not found for this user" });
    console.log("urlEntry of user status", urlEntry);
    // Respond with analytics
    return res.status(200).json({
      urlEntry,
      message: "your analytics",
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


export async function handleShortenURL(req, res) {
  try {
    const { url, customNanoId } = req.body; // Extract original URL and optional custom ID
    const userId = req.user.id; // Get the authenticated user's ID

    // let userObjectId;
    // if (mongoose.Types.ObjectId.isValid(userId)) {
    //   userObjectId = new mongoose.Types.ObjectId(userId);
    // } else {
    //   // If userId is not a valid ObjectId, handle it appropriately
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid userId format. Please provide a valid ObjectId.",
    //   });
    // }

    console.log('customNanoid',customNanoId);
    // Validate the URL
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*))" +
        "(\\.[a-z]{2,})+|((\\d{1,3}\\.){3}\\d{1,3}))(:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$",
      "i"
    );
    if (!urlPattern.test(url)) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    // Check if the original URL already exists
    const existingUrl = await URL.findOne({ redirectURL: url});
    if (existingUrl) {
      return res.status(200).json({
        id: existingUrl.nanoId,
        shortUrl: `${process.env.BASE_URL || "http://localhost:4000"}/${
          existingUrl.nanoId
        }`,
        message: "URL already shortened",
      });
    }

    // Generate or validate the custom ID
    const nanoID = customNanoId || nanoid();
    if (customNanoId) {
      const existingCustomId = await URL.findOne({ nanoId: customNanoId });
      if (existingCustomId) {
        return res.status(400).json({ error: "Custom URL already exists" });
      }
    }

    // Create a new URL urlEntry
    const newUrl = await URL.create({
      userId,
      nanoId: nanoID,
      redirectURL: url,
    });

    // Respond with the shortened URL
    return res.status(201).json({
      id: nanoID,
      shortUrl: `${process.env.BASE_URL || "http://localhost:4000"}/${nanoID}`,
      message: "Short URL generated successfully",
    });
  } catch (error) {
    console.error("Error generating short URL:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


// Get analytics for a short URL
export async function handleGetAnalytics(req, res) {
  try {
    const { nanoId } =  req.params;
    // const userId = req.user.id;
    // console.log("Received nanoId:", nanoId);
    // Validate nanoId
    if (!nanoId) return res.status(400).json({ error: "Nano ID is required" });

    // Fetch the URL urlEntry
    const urlEntry = await URL.findOne({ nanoId });
    if (!urlEntry)
      return res.status(404).json({ error: "URL not found for this user" });

    // Respond with analytics
    return res.status(200).json({
      nanoId: urlEntry.nanoId,
      redirectUrl: urlEntry.redirectURL,
      totalClicks: urlEntry.totalClicks,
      lastVisited: urlEntry.lastVisited,
      visitHistory: urlEntry.visitHistory,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Redirect to the original URL
export async function handleRedirect(req, res) {
  try {
    const { nanoId } = req.params;
    
    // Validate nanoId
    if (!nanoId) return res.status(400).json({ error: "Nano ID is required" });

    // Fetch the URL urlEntry
    const urlEntry = await URL.findOne({ nanoId });
    if (!urlEntry) return res.status(404).json({ error: "URL not found" });

    // Update visit history and analytics
    urlEntry.visitHistory.push({ timestamp: new Date() });
    urlEntry.totalClicks += 1;
    urlEntry.lastVisited = new Date();
    await urlEntry.save();

    // Redirect to the original URL
    return res.redirect(urlEntry.redirectURL);
  } catch (error) {
    console.error("Error during redirect:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
