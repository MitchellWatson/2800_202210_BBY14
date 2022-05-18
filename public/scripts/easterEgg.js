const button = document.getElementById("secret-click");
const toasts = document.getElementById('toasts')
let count = 0;
const messages = [
    'Age is just a number for those who know how to make the most of their lives', 
    'Anyone who keeps learning stays young',
    'Enjoy your day, you deserve it',
    'The spirit never ages. It stays forever young',
    'Wrinkles should merely indicate where smiles have been',
    'You’re only as old as you feel',
    'With old age comes wisdom… and discounts!'
]

const types = ['purple', 'green', 'red']

button.addEventListener('click', () => {
    count += 1;
    if (count < 3) {
    createNotification()
    } else {
        count = 0;
    }
})

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