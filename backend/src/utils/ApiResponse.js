/**
 * Standard API success response wrapper.
 * Ensures all successful responses share a consistent shape.
 */
class ApiResponse {
    /**
     * @param {number} statusCode - HTTP status code (e.g. 200, 201)
     * @param {*}      data       - Payload to send back to the client
     * @param {string} message    - Human-readable success message
     */
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export { ApiResponse };
