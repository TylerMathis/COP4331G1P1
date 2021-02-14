/**
 * A class used to encapsulate JSON-style error responses.
 */
class APIError extends Error {
    /**
     * @param {string} title
     * @param {string} detail
     */
    constructor(title, detail) {
        super(title);
        this.detail = detail;
    }
}

/**
 * Handles response given from server.
 *
 * @param {Response} response
 * @return {Response}
 */
function handleResponse(response) {
    if (!response.ok) {
        return response.json().then(json => {throw new APIError(json.title, json.detail)});
    }

    return response;
}

// Export relevant code
export { APIError, handleResponse };
