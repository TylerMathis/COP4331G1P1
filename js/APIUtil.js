/**
 * The JSON headers for each request.
 *
 * @type {Headers}
 */
const jsonHeader = new Headers({ "Content-Type": "application/json; charset=UTF-8" });

/**
 * A class used to encapsulate JSON-style error responses.
 */
class APIError extends Error {
    /**
     * @param {object} jsonError
     * @param {string} jsonError.title
     * @param {string} jsonError.detail
     * @param {int} jsonError.status
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
 * Make sure that the response is ok and routes any possible errors.
 *
 * @param {Response} response
 * @return {Response}
 * @throws {APIError} When response does not have a valid HTTP code.
 */
async function validateResponse(response) {
    if (!response.ok) {
        const jsonError = await response.json();
        throw new APIError(jsonError);
    }

    return response;
}

// Export relevant code
export { APIError, validateResponse, jsonHeader };
