// Import the URL model for database interactions
import URL from "../models/url.model.js";
import { nanoid } from "nanoid";
import dotenv from 'dotenv';
import useragent from 'useragent';
dotenv.config();

export async function handleUserAnalytics(req, res) {
  try {
    const userId = req.user.id;

    const urlEntry = await URL.find({ userId });
    if (!urlEntry)
      return res.status(404).json({ error: "URL not found for this user" });
    // console.log("urlEntry of user status", urlEntry);
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
    const { url, customNanoId, expiresAt } = req.body;
    const userId = req.user.id;
    if (!url) return res.status(400).json({ error: "URL is required" });
    // console.log('expiresAt in handleShortenURL',expiresAt)
    const urlPattern = new RegExp("^(https?:\\/\\/)?(([a-z\\d]([a-z\\d-]*[a-z\\d])*)" +
      "(\\.[a-z]{2,})+|((\\d{1,3}\\.){3}\\d{1,3}))(:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$", "i");
    if (!urlPattern.test(url)) return res.status(400).json({ error: "Invalid URL format" });

    const existingUrl = await URL.findOne({ redirectURL: url });
    if (existingUrl) {
      return res.status(200).json({
        id: existingUrl.nanoId,
        shortUrl: `${process.env.BASE_URL || "http://localhost:4000"}/url/${existingUrl.nanoId}`,
        message: "URL already shortened",
      });
    }

    const nanoID = customNanoId || nanoid(8);
    if (customNanoId) {
      const existingCustomId = await URL.findOne({ nanoId: customNanoId });
      if (existingCustomId) return res.status(400).json({ error: "Custom URL already exists" });
    }

    const newUrl = await URL.create({
      userId,
      nanoId: nanoID,
      redirectURL: url,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    return res.status(201).json({
      id: nanoID,
      shortUrl: `${process.env.BASE_URL || "http://localhost:4000"}/url/${nanoID}`,
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
      redirectURL: urlEntry.redirectURL,
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
    if (!nanoId) return res.status(400).json({ error: "Nano ID is required" });

    const urlEntry = await URL.findOne({ nanoId });
    if (!urlEntry) return res.status(404).json({ error: "URL not found" });

    if (urlEntry.expiresAt && new Date() > urlEntry.expiresAt) {
      return res.status(410).json({ error: "This URL has expired" });
    }

    const referrer = req.get('Referrer') || 'Direct';
    const userAgent = useragent.parse(req.get('User-Agent'));
    const device = userAgent.device.family;
    const browser = userAgent.toAgent();
    const ip = req.ip;

    urlEntry.visitHistory.push({ 
      timestamp: new Date(), 
      referrer, 
      device, 
      browser, 
      ip 
    });
    urlEntry.totalClicks += 1;
    urlEntry.lastVisited = new Date();
    await urlEntry.save();

    return res.redirect(urlEntry.redirectURL);
  } catch (error) {
    console.error("Error during redirect:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
