/** This file contains the helper method used for formatting time in the chat features./**
 * Block of code adapted from Youtube tutorials.
 * 
 * @author Web Dev Simplified
 * @see https://www.youtube.com/watch?v=ZKEqqIO7n-k
 * @see https://www.youtube.com/watch?v=rxzOqP9YwmM
 * @author Traversy Media
 * @see https://www.youtube.com/watch?v=jD7FnbI76Hg
 *
 * @author Basil Kim
 */

//An array for the users in the chat room.
const users = [];

// Join user to chat
function newUser(id, username) {
  const user = { id, username};

  users.push(user);

  return user;
}

// Get current user
function getActiveUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function exitRoom(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getIndividualRoomUsers(room) {
  return users.filter(user => user.room === room);
}

//Exporting the modules to be used in other files
module.exports = {
  newUser,
  getActiveUser,
  exitRoom,
  getIndividualRoomUsers
};