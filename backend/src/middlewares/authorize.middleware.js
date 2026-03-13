import ApiError from "../utils/ApiError.js";

/**
 * Middleware to authorize user based on roles
 * @param  {...string} allowedRoles - List of allowed roles
 * @returns {import("express").RequestHandler} Express middleware function
 */
const authorize = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user) {
            throw new ApiError(401, "Authentication required");
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new ApiError(403, `Unauthorized access`, [`Role ${req.user.role} is not authorized to access this resource`]);
        }

        next();
    };
};

export default authorize;
