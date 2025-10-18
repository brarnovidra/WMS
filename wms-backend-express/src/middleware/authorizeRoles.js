export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role || !req.user.role.name) {
      return res.status(403).json({
        status: "error",
        message: "User role not found or not authenticated",
      });
    }

    const userRole = req.user.role.name?.toLowerCase();

    if (!allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
      return res.status(403).json({
        status: "error",
        message: "Access denied: insufficient permissions",
      });
    }

    next();
  };
};