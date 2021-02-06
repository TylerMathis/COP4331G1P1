// debounce.js - Source: https://levelup.gitconnected.com/debounce-in-javascript-improve-your-applications-performance-5b01855e086
// Credits:
// - David Walsh
// - Trey Huffine

/**
 * Creates a debouncer for high frequency function calls.
 *
 * @param handler The method to debounce
 * @param delay The amount of time to wait before the method should execute again.
 * @returns {function(...[*]): void}
 */
const debounce = (handler, delay) => {
    let timeout;

    // Return a function that runs the handler.
    return function executedFunction(...args) {
        // Store deferred function for later when delay is finished
        const later = () => {
            timeout = null;
            handler(...args);
        }

        // Reset and previous timeout and execute handler.
        clearTimeout(timeout);
        timeout = setTimeout(later, delay);
    }

}