module.exports = (allowedRoles) => {
  return (req, res, next) => {
    // 1. Verify that user details exist (attached by the authenticate middleware)
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Access denied. User authentication details missing."
      });
    }

    // 2. Check if the user's role is in the list of allowed roles
    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    // 3. Reject access if user does not possess allowed permissions
    return res.status(403).json({
      success: false,
      message: "Access denied. Insufficient permissions."
    });
  };
};
