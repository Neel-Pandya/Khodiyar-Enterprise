/**
 * Standard API success response wrapper.
 * Ensures all successful responses share a consistent shape.
 */
class ApiResponse {
    /**
     * @param {number} statusCode - HTTP status code (e.g. 200, 201)
     * @param {string} message    - Human-readable success message
     * @param {*}      data       - Payload to send back to the client
     */
    constructor(statusCode, message = "Success", data = []) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400;
    }
}

export default ApiResponse ;
