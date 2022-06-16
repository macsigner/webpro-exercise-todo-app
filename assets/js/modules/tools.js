/**
 * Delegate event according to selector.
 * @param selector
 * @param fn
 * @returns {(function(*): void)|*}
 */
export const delegate = function (selector, fn) {
    return function (e) {
        if(e.target.closest(selector)) {
            fn(e);
        }
    }
}
