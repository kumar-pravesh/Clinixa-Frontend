const jwt = require('jsonwebtoken');

/**
 * Authenticate JWT token from Authorization header or cookie
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    // Fallback to cookie if no Authorization header
    if (!token && req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        console.log('[DEBUG] Decoded User from Token:', user); // DEBUG LOG
        req.user = user;
        next();
    });
};

/**
 * Authorize specific roles
 * Usage: router.use(authorizeRoles('admin', 'doctor'));
 */
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
            });
        }

        next();
    };
};

/**
 * Authorize a single role (helper for cleaner syntax)
 * Usage: router.use(authorizeRole('admin'));
 */
const authorizeRole = (role) => {
    return authorizeRoles(role);
};

module.exports = { authenticateToken, authorizeRoles, authorizeRole };
