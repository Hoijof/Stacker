window.loger = false;

module.exports = {
    log: function(message) {
        if (window.loger) {
            console.log(message);
        }
    },
    warn: function(message) {
        if (window.loger) {
            console.warn(message);
        }
    },
    error: function(message) {
        if (window.loger) {
            console.error(message);
        }
    }
};