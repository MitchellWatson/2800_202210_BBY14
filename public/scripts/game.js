/** This file contains the client-side Javascript for the featured game which is a simple trivia gam
 *      designed for seniors.
 * 
 * @author Mitchell Watson
 * 
 */
"use strict";
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

// Start game
function startGame() {
  score = 0;
  num.innerHTML = "Score: " + score
  start.classList.add('hidden')
  shuffle = questions.sort(() => Math.random() - 0.5)
  index = 0
  question.classList.remove('hidden')
  setNextQuestion()
}
// Shows the next question randomly
function setNextQuestion() {
  resetState()
  showQuestion(shuffle[index])
}
// Displays Question and answers
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
// Allert users if wrong or right when answering the game
function selectAnswer(e) {
  const selectedButton = e.target
  const correct = selectedButton.dataset.correct
  if (correct && increment) {
      score += 10
      num.innerHTML = "Score: " + score
      result.innerHTML = "Correct! <span class='material-symbols-outlined'> done </span>"
  } else {
      result.innerHTML = "Inccorect. <span class='material-symbols-outlined'> close </span>"
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

// List of questions and answers
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
  {
    question: 'Who were the first two astronauts to walk on the moon?',
    answers: [
      { text: 'Eugene Cernan and Pete Conrad', correct: false },
      { text: 'Sally Ride and Michael Collins', correct: false },
      { text: 'Neil Armstrong and Buzz Aldrin', correct: true },
      { text: 'Jim Lovell and Fred Haise', correct: false }
    ]
  },
  {
    question: 'Disco emerged as a popular genre of dance music in the late 1970s following the success of what film that starred actor John Travolta?',
    answers: [
      { text: 'Saturday Night Fever', correct: true },
      { text: 'Dirty Dancing', correct: false },
      { text: 'Can\'t Stop the Music', correct: false },
      { text: 'Xanadu', correct: false }
    ]
  },
  {
    question: 'Rock music changed mainstream sounds and gained popularity among American youths. What British rock band performed for American audiences for the first time in 1964 on the Ed Sullivan Show?',
    answers: [
      { text: 'Led Zeppelin', correct: false },
      { text: 'The Rolling Stones', correct: false },
      { text: 'The Who', correct: false },
      { text: 'The Beatles', correct: true }
    ]
  },
  {
    question: 'Which famous American comedian rose to fame on the popular 70s show Mork & Mindy?',
    answers: [
      { text: 'Rodney Dangerfield', correct: false },
      { text: 'Chris Rock', correct: false },
      { text: 'Aisha Tyler', correct: false },
      { text: 'Robin Williams', correct: true }
    ]
  },
  {
    question: 'Before he changed it to Muhammad Ali, by what name was the World Heavyweight Boxing champion known?',
    answers: [
      { text: 'Cassius Clay', correct: true },
      { text: 'Sugar Ray Robinson', correct: false },
      { text: 'Joe Louis', correct: false },
      { text: 'Sugar Ray Leonard', correct: false }
    ]
  },
  {
    question: 'What iconic music and pop culture magazine was founded in San Francisco in 1967?',
    answers: [
      { text: 'The Atlantic', correct: false },
      { text: 'Rolling Stone', correct: true },
      { text: 'The New Yorker', correct: false },
      { text: 'Entertainment Weekly', correct: false }
    ]
  },
  {
    question: 'President John F. Kennedy was assassinated in 1963 by Lee Harvey Oswald while traveling in the presidential motorcade in what state?',
    answers: [
      { text: 'Alabama', correct: false },
      { text: 'Arkansas', correct: false },
      { text: 'Texas', correct: true },
      { text: 'Oklahoma', correct: false }
    ]
  },
  {
    question: 'What popular comedic sketch show began in 1975 and introduced such famous cast members as Chevy Chase, Eddie Murphy, and Gilda Radner?',
    answers: [
      { text: 'The Kids in the Hall', correct: false },
      { text: 'In Living Color', correct: false },
      { text: 'MADtv', correct: false },
      { text: 'Saturday Night Live', correct: true }
    ]
  },
  {
    question: '1975\'s blockbuster thriller \'Jaws\' is considered one of the best movies ever made. Who directed this hugely successful film?',
    answers: [
      { text: 'Ridley Scott', correct: false },
      { text: 'George Lucas', correct: false },
      { text: 'James Cameron', correct: false },
      { text: 'Steven Spielberg', correct: true }
    ]
  },
]