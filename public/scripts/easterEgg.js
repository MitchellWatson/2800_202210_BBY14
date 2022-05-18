const button = document.getElementById("secret-click");
const toasts = document.getElementById('toasts')

const messages = [
    'Message One', 
    'Message Two',
    'Message Three',
    'Message Four'
]

const types = ['info', 'success', 'error']

button.addEventListener('click', () => createNotification())

function createNotification(message = null, type = null) {
    const notif = document.createElement('div')
    notif.classList.add('toast')
    notif.classList.add(type ? type : getType())

    notif.innerText = message ? message : getMessage()

    toasts.appendChild(notif)

    setTimeout(() => {
        notif.remove()
    }, 3000)
}

function getMessage() {
    return messages[Math.floor(Math.random() * messages.length)]
}
function getType() {
    return types[Math.floor(Math.random() * types.length)]
}