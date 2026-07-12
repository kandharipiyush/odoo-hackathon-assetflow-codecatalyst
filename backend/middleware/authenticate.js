const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check if the Authorization header is present and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    // 2. Extract the token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Invalid token format."
      });
    }

    // 3. Verify the token using the JWT secret
    const jwtSecret = process.env.JWT_SECRET || "hackathon_super_secret_jwt_key_2026";
    const decoded = jwt.verify(token, jwtSecret);

    // 4. Attach the decoded payload to req.user
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    // 5. Proceed to the next middleware/route handler
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Invalid or expired token.",
      error: error.message
    });
  }
};
