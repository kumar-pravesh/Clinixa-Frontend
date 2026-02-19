/**
 * Domain Event Bus — Singleton EventEmitter for decoupled notification dispatch.
 * 
 * Events emitted AFTER database commits. Listeners are fire-and-forget.
 * If no listeners are registered, emit is a no-op.
 * Listener errors are isolated — one failure does not affect others.
 */
const { EventEmitter } = require('events');

class DomainEventBus extends EventEmitter {
    constructor() {
        super();
        // Increase max listeners to avoid warnings with many event types
        this.setMaxListeners(50);
    }

    /**
     * Safely emit an event. Catches any synchronous errors from listeners.
     * Async listener errors are caught internally by each listener's try-catch.
     * @param {string} eventName 
     * @param {object} payload 
     */
    safeEmit(eventName, payload) {
        try {
            this.emit(eventName, payload);
        } catch (error) {
            console.error(`[EventBus] Error emitting "${eventName}":`, error.message);
        }
    }

    /**
     * Register an async-safe listener. Wraps the handler in try-catch
     * so that async errors do not propagate.
     * @param {string} eventName 
     * @param {Function} handler - async function(payload)
     */
    safeOn(eventName, handler) {
        this.on(eventName, async (payload) => {
            try {
                await handler(payload);
            } catch (error) {
                console.error(`[EventBus] Listener error for "${eventName}":`, error.message);
            }
        });
    }
}

const eventBus = new DomainEventBus();

module.exports = eventBus;
