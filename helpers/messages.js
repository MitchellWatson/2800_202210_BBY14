/**
 * Global live chat room.
 * Block of code adapted from Youtube tutorials.
 * 
 * @author Web Dev Simplified
 * @see https://www.youtube.com/watch?v=ZKEqqIO7n-k
 * @see https://www.youtube.com/watch?v=rxzOqP9YwmM
 * @author Traversy Media
 * @see https://www.youtube.com/watch?v=jD7FnbI76Hg
 */

"use strict";

const moment = require('moment');

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}

module.exports = formatMessage;