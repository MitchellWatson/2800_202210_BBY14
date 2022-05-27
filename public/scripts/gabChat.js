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

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = "Your chat";
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
 console.log({users})
 let count = 1;
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = '';
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../main.html';
  } else {
  }
});


let buttonUpdate = document.getElementsByClassName("add");
buttonUpdate.addEventListener("click", update);



function update() {
  // e.preventDefault();
  let id = this.target;
  
  let queryString = "id=" + id;
  ajaxPOST("/updateFriends", function (data) {
      if (data) {
          let dataParsed = JSON.parse(data);

          if (dataParsed.status == "fail") {
              document.getElementById("errorMsg").innerHTML = dataParsed.msg;
          } else {
              window.location.replace("/friendFinder");
          }
      }

  }, queryString);
}