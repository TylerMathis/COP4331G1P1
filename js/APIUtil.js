/**
 * A class used to encapsulate JSON-style error responses.
 */
class APIError extends Error {
    constructor(title, detail) {
        super(title);
        this.detail = detail;
    }
}

/**
 * Handles reponse given from server.
 *
 * @param response
 * @return {Promise<Response>}
 */
function handleResponse(response) {
    if (!response.ok) {
        return response.json().then(json => {throw new APIError(json.title, json.detail)});
    }

    return response;
}
