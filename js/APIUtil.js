/**
 * The JSON headers for each request.
 *
 * @type {Headers}
 */
const jsonHeader = new Headers({ "Content-Type": "application/json; charset=UTF-8" });

/**
 * @typedef {object} JSONError
 * @property {string} title
 * @property {string} detail
 * @property {int} status
 */

/**
 * A class used to encapsulate JSON-style error responses.
 */
class APIError extends Error {
    /**
     * @param {JSONError} jsonError
     */
    constructor(jsonError) {
        super(jsonError.title);

        /**
         * The detail associated with the title error.
         * @type {string}
         */
        this.detail = jsonError.detail;
    }
}

/**
 * Handles response given from server.
 *
 * @param {Response} response
 * @return {Response}
 */
async function handleResponse(response) {
    if (!response.ok) {
        const jsonError = await response.json();
        throw new APIError(jsonError);
    }

    return response;
}

// Export relevant code
export { APIError, handleResponse, jsonHeader };
