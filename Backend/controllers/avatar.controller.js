import { createCanvas } from "canvas";

const avatarCache = new Map(); // In-memory cache

function getInitials(firstName, lastName) {
  return (firstName[0] + (lastName ? lastName[0] : "")).toUpperCase();
}

function generateColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 50%)`; // Unique color
}

export const generateAvatar = async (req, res) => {
  try {
    const { firstName, lastName } = req.params;

    if (!firstName) {
      return res.status(400).json({
        success: false,
        message: "First name is required",
      });
    }

    const initials = getInitials(firstName, lastName);
    const key = `${firstName}_${lastName || ""}`.toLowerCase();

    // Check cache
    if (avatarCache.has(key)) {
      res.setHeader("Content-Type", "image/png");
      return res.send(avatarCache.get(key));
    }

    const backgroundColor = generateColor(firstName + (lastName || ""));
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff"; // White text
    ctx.font = "bold 80px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initials, canvas.width / 2, canvas.height / 2);

    // Convert to PNG buffer
    const imageBuffer = canvas.toBuffer("image/png");

    // Store in cache
    avatarCache.set(key, imageBuffer);

    res.setHeader("Content-Type", "image/png");
    res.send(imageBuffer);
  } catch (err) {
    console.error("Error generating avatar:", err);
    res.status(500).json({
      success: false,
      message: "Failed to generate avatar",
    });
  }
};
