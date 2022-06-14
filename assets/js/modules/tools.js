export const delegate = function (selector, fn) {
    return function (e) {
        if(e.target.closest(selector)) {
            fn(e);
        }
    }
}
