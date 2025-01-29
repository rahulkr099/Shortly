export const revokeGoogleToken = async (req, res) => {
  try {
    const accessToken =
      req?.cookies?.googleAccessToken || req?.body?.googleAccessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Access token is expired or invalid",
      });
    }

    // Rename this variable to avoid conflict
    const response = await fetch(
      `https://oauth2.googleapis.com/revoke?token=${accessToken}`,
      { method: "POST" }
    );

    if (!response.ok) {
      throw new Error(`Failed to revoke token: ${response.statusText}`);
    }
    res.clearCookie("googleAccessToken").clearCookie("googleRefreshToken", {
      path: "/",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
      secure: process.env.NODE_ENV === "production" ? true : false,
    });
    console.log("Token revoked successfully");
    res.status(200).json({
      success: true,
      message: "User Logged Out Successfully",
    });
  } catch (error) {
    console.error("Error revoking token:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while revoking google token",
    });
  }
};
