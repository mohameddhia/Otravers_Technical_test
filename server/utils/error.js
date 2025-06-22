
/**
 * Custom class for error management
 *
 * @class ApplicationError
 * @typedef {ApplicationError}
 * @extends {Error}
 */
class ApplicationError extends Error {
    
    /**
     * Creates an instance of ApplicationError.
     *
     * @constructor
     * @param {string} message 
     * @param {number} [statusCode=500] 
     */
    constructor(message, statusCode = 500) {
        super(message);
        this.name = 'ApplicationError';
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {
    ApplicationError
};