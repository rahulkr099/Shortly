// Import the URL model for database interactions
import URL from '../models/url.model';
import { nanoid } from 'nanoid';


// Generate a new short URL
export async function handleGenerateNewShortURL(req, res) {
  try {
    const { url, customNanoId } = req.body;
    // console.log('url and customId',url,customNanoId);
    // console.log('request object is',req);

    const userId = req.user.id;

    // Validate the URL
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*))' + // domain name
      '(\\.[a-z]{2,})+|' + // domain extension
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', // fragment locator
      'i'
    );
    if (!urlPattern.test(url)) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Check if the URL already exists
    const existingEntry = await URL.findOne({ redirectURL: url });
    if (existingEntry) {
      return res.status(200).json({
        id: existingEntry.nanoId,
        shortUrl: `${process.env.BASE_URL || 'http://localhost:4000'}/${existingEntry.nanoId}`,
        message: 'URL already shortened',
      });
    }

    // Generate or use a custom nano ID
    const nanoID = customNanoId || nanoid();
    console.log('nanoId',nanoID);
    // Ensure custom ID is unique
    if (customNanoId) {
      const idExists = await URL.findOne({ nanoId: customNanoId, userId });
      if (idExists) {
        return res.status(400).json({ error: 'Custom nano ID already exists for this user' });
      }
    }

    // Create a new URL entry in the database
    const newEntry = await URL.create({
      userId,
      nanoId: nanoID,
      redirectURL: url,
    //   visitHistory: [],
    //   totalClicks: 0,
    //   lastVisited: null,
    });

    // Respond with the short URL
    const baseUrl = process.env.BASE_URL || 'http://localhost:4000';
    return res.status(201).json({
      id: nanoID,
      shortUrl: `${baseUrl}/${nanoID}`,
      message: 'Short URL generated successfully',
    });
  } catch (error) {
    console.error('Error generating short URL:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Get analytics for a short URL
export async function handleGetAnalytics(req, res) {
  try {
    const { nanoId } = req.params;
    const userId = req.user.id;

    // Validate nanoId
    if (!nanoId) return res.status(400).json({ error: 'Nano ID is required' });

    // Fetch the URL entry
    const entry = await URL.findOne({ nanoId,userId });
    if (!entry) return res.status(404).json({ error: 'URL not found for this user' });

    // Respond with analytics
    return res.status(200).json({
      nanoId: entry.nanoId,
      totalClicks: entry.totalClicks,
      lastVisited: entry.lastVisited,
      visitHistory: entry.visitHistory,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Redirect to the original URL
export async function handleRedirect(req, res) {
  try {
    const { nanoId } = req.params;
    const userId = req.user.id;

    // Validate nanoId
    if (!nanoId) return res.status(400).json({ error: 'Nano ID is required' });

    // Fetch the URL entry
    const entry = await URL.findOne({ nanoId, userId });
    if (!entry) return res.status(404).json({ error: 'URL not found' });

    // Update visit history and analytics
    entry.visitHistory.push({ timestamp: new Date() });
    entry.totalClicks += 1;
    entry.lastVisited = new Date();
    await entry.save();

    // Redirect to the original URL
    return res.redirect(entry.redirectURL);
  } catch (error) {
    console.error('Error during redirect:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
