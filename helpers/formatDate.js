const moment = require('moment');

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
        // time: moment().tz("America/Los_Angeles").format('h:mm a')
    };
}

module.exports = formatMessage;