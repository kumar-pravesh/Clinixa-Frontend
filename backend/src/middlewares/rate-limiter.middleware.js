/**
 * In-memory rate limiter middleware.
 * 
 * Sliding window counter per IP address.
 * No external dependencies (Redis-ready interface for future migration).
 */

class RateLimiterStore {
    constructor() {
        this.clients = new Map();
        // Cleanup expired entries every 5 minutes
        this._cleanupInterval = setInterval(() => this._cleanup(), 5 * 60 * 1000);
        if (this._cleanupInterval.unref) this._cleanupInterval.unref();
    }

    _cleanup() {
        const now = Date.now();
        for (const [key, record] of this.clients.entries()) {
            if (now > record.windowStart + record.windowMs) {
                this.clients.delete(key);
            }
        }
    }

    /**
     * Check and increment request count for a key.
     * @param {string} key - Identifier (e.g., IP address or IP:route)
     * @param {number} maxRequests - Max requests allowed in window
     * @param {number} windowMs - Window duration in milliseconds
     * @returns {{ allowed: boolean, remaining: number, retryAfterMs: number }}
     */
    check(key, maxRequests, windowMs) {
        const now = Date.now();
        let record = this.clients.get(key);

        if (!record || now > record.windowStart + windowMs) {
            // New window
            record = { count: 1, windowStart: now, windowMs };
            this.clients.set(key, record);
            return { allowed: true, remaining: maxRequests - 1, retryAfterMs: 0 };
        }

        record.count++;

        if (record.count > maxRequests) {
            const retryAfterMs = (record.windowStart + windowMs) - now;
            return { allowed: false, remaining: 0, retryAfterMs };
        }

        return { allowed: true, remaining: maxRequests - record.count, retryAfterMs: 0 };
    }
}

// Shared store instance
const store = new RateLimiterStore();

/**
 * Create a rate-limiting middleware.
 * @param {{ maxRequests: number, windowMs: number, keyPrefix?: string, message?: string }} options
 * @returns {Function} Express middleware
 */
const createRateLimiter = ({ maxRequests = 10, windowMs = 15 * 60 * 1000, keyPrefix = '', message = 'Too many requests. Please try again later.' } = {}) => {
    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress || 'unknown';
        const key = `${keyPrefix}:${ip}`;

        const result = store.check(key, maxRequests, windowMs);

        // Set rate limit headers
        res.set('X-RateLimit-Limit', String(maxRequests));
        res.set('X-RateLimit-Remaining', String(result.remaining));

        if (!result.allowed) {
            res.set('Retry-After', String(Math.ceil(result.retryAfterMs / 1000)));
            console.warn(`[RateLimiter] 429 for ${key} — limit ${maxRequests}/${windowMs}ms exceeded`);
            return res.status(429).json({ message });
        }

        next();
    };
};

module.exports = { createRateLimiter, RateLimiterStore };
