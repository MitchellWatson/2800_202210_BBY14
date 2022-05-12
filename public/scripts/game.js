
const num = document.getElementById('score')
const result = document.getElementById('status')

let score = 0
let unique = true
let increment = true
num.innerHTML = "Score: " + score
let shuffle, index

const start = document.getElementById('start')
const next = document.getElementById('next')
const question = document.getElementById('questions')
const questionElement = document.getElementById('question')
const answerElement = document.getElementById('answer')
start.addEventListener('click', startGame)
next.addEventListener('click', () => {
    increment = true;
    index++
  setNextQuestion()
})

function startGame() {
  score = 0;
  num.innerHTML = "Score: " + score
  start.classList.add('hidden')
  shuffle = questions.sort(() => Math.random() - 0.5)
  index = 0
  question.classList.remove('hidden')
  setNextQuestion()
}

function setNextQuestion() {
  resetState()
  showQuestion(shuffle[index])
}

function showQuestion(question) {
  questionElement.innerText = question.question
  question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.innerText = answer.text
    button.classList.add('btn')
    if (answer.correct) {
      button.dataset.correct = answer.correct
    }
    button.addEventListener('click', selectAnswer)
    answerElement.appendChild(button)
  })
}

function resetState() {
  result.innerText = ""
  clearStatusClass(document.body)
  next.classList.add('hidden')
  while (answerElement.firstChild) {
    answerElement.removeChild(answerElement.firstChild)
  }
}

function selectAnswer(e) {
  const selectedButton = e.target
  const correct = selectedButton.dataset.correct
  if (correct && increment) {
      score += 10
      num.innerHTML = "Score: " + score
      result.innerHTML = "Correct!"
  } else {
      result.innerHTML = "Inccorect."
  }
  setStatusClass(document.body, correct)
  Array.from(answerElement.children).forEach(button => {
    setStatusClass(button, button.dataset.correct)
  })
  if (shuffle.length > index + 1) {
    next.classList.remove('hidden')
  } else {
    start.innerText = 'Restart'
    start.style.backgroundColor = "#efb800"
    start.style.color = "'white'"
    start.classList.remove('hidden')
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element)
  if (correct) {
    element.classList.add('success')
  } else {
    element.classList.add('incorrect')
  }
}

function clearStatusClass(element) {
  element.classList.remove('success')
  element.classList.remove('incorrect')
}

const questions = [
  {
    question: 'What year did Evlis Presley release his great hit \'Hound Dog\'?',
    answers: [
      { text: '1968', correct: false },
      { text: '1964', correct: false },
      { text: '1965', correct: true },
      { text: '1967', correct: false }
    ]
  },
  {
    question: 'What are the names of all four members of \'The Beatles\'?',
    answers: [
      { text: 'John Lennon, Paul McCartney, George Harrison, Ringo Starr', correct: true },
      { text: 'George Harrison, John Lennon, Paul McCartney, Quandale Dingle', correct: false },
      { text: 'George Harrison, Ringo Starr, Paul McCallum, John Legend', correct: false },
      { text: 'Paul McCartney, George Woody, Patrick Bateman, Saul Goodman', correct: false }
    ]
  },
  {
    question: 'What year did NASA land the first man on the moon?',
    answers: [
      { text: '1968', correct: false },
      { text: '1970', correct: false },
      { text: '1969', correct: true },
      { text: '1967', correct: false }
    ]
  },
  {
    question: 'When did Elvis Presley serve his 2 years in the US Milatary?',
    answers: [
      { text: '1961-1963', correct: false },
      { text: '1959-1961', correct: false },
      { text: '1956-1968', correct: false },
      { text: '1958-1960', correct: true }
    ]
  },
  {
    question: 'Who had the BillBoard Top-single of the 60\'s?',
    answers: [
      { text: '\“The Twist,\” Chubby Checker', correct: true },
      { text: '\“Tossin\’ And Turnin,\’\” Bobby Lewis', correct: false },
      { text: '\“The Theme From \‘A Summer Place,\’\” Percy Faith', correct: false },
      { text: '\“Hey Jude,\” The Beatles', correct: false }
    ]
  },
  {
    question: 'What year did John F. Kennedy become President of the United States?',
    answers: [
      { text: '1961', correct: false },
      { text: '1960', correct: true },
      { text: '1956', correct: false },
      { text: '1958', correct: false }
    ]
  },
]