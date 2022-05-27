/** This file contains the client-side Javascript for the modal functionality that upon activation 
 *      populates the user's screen with a random quote from the array of quotes generated from below.
 *          Quotes are designed with the persona of the senior in mind. 
 * 
 * @author Basillio Kim
 * 
 */

// Getting the button from the html page. 
const button = document.getElementById("secret-click");
// Getting the div to be populated with quotes from the html page. 
const toasts = document.getElementById('quotes')

//Keeping count of the number of clicks.
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

//Array containing the different types of colours for the modal windows. 
const types = ['purple', 'green', 'red']

/** Event listener for clicks and increments the number of clicks by one.
 */
button.addEventListener('click', () => {
    count += 1;
    if (count < 3) {
    createNotification()
    } else {
        count = 0;
    }
})

/** Function to create a notfification or modal window upon activation. 
 * @param {*} message as the text to populate the modal window from the messages array.
 * @param {*} type as the color to make the modal window. 
 */
function createNotification(message = null, type = null) {

    const notif = document.createElement('div')
    notif.classList.add('quote')
    notif.classList.add(type ? type : getType())

    notif.innerText = message ? message : getMessage()

    toasts.appendChild(notif)
    


    setTimeout(() => {
        notif.remove()
    }, 3000)


    
}

/**
 * 
 * @returns 
 */
function getMessage() {
    return messages[Math.floor(Math.random() * messages.length)]
}
function getType() {
    return types[Math.floor(Math.random() * types.length)]
}