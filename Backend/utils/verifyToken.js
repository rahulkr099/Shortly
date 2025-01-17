const jwt = require('jsonwebtoken');

// Helper function to verify JWT token
export const verifyToken = async (token,secret, req, res) => {
  try {
    //1. Verify the JWT using the secret key
    const decoded = await jwt.verify(token, secret);
    // console.log(decoded);
    if(!decoded){
      return res.status(401).json({
        success:false,
        message: "Invalid Token",
      })
    }

    //2. Storing the decoded in the request object
    req.user = decoded;

    return res.status(200).json({
      success: true,
      user:decoded, //send user info from the token
    });  
    // Verification successful

  } catch (error) {
    return res.status(401).json({ success: false, message: "Token is invalid" });
  }
};

