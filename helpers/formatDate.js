/** This file contains the helper method used for formatting time in the chat features.
 * 
 * Block of code adapted from Youtube tutorials.
 * 
 * @author Web Dev Simplified
 * @see https://www.youtube.com/watch?v=ZKEqqIO7n-k
 * @see https://www.youtube.com/watch?v=rxzOqP9YwmM
 * @author Traversy Media
 * @see https://www.youtube.com/watch?v=jD7FnbI76Hg
 * @author Basil Kim
 */

//moment module used for time.
const moment = require('moment');

/**
 * 
 * @param {*} username as the name of the user in the chatroom
 * @param {*} text as the message the user is sending in the chatroom
 * @returns an object with user, text, and time of the message sent
 */
function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    };
}

//Exports this function to be used as a module in other files.
module.exports = formatMessage;