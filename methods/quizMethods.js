const fs = require("fs")
const textCodification = "utf8"
const storageLocation = "./storage/"
const crypto = require('crypto')

/**
 * 
 
/**
 * Quiz
 * Name
 * Id
 * Perguntas
 * Opcoes
 * Resposta
 * Imagem da capa
 * Image{
 *  url,
 *  questionId
 * }
 * 
 * 
 */
/* class Quiz {
    constructor(name, id, questions, options, answers, coverImage, images) {
        this.name = name;
        this.id = id;
        this.questions = questions;
        this.options = options;
        this.answers = answers;
        this.coverImage = coverImage;
        this.images = images;
    }
}
 */

function createQuiz(quiz) {
  const promise = new Promise((resolve, reject) => {
    if (!quiz.name || !quiz.questions || !quiz.options || !quiz.answers) {
      return "Missing data"
    }
    fs.readFile(storageLocation + "quizzes.json", textCodification, (err, data) => {
      if (err) {
        console.log(err)
      }
      else {
        let quizzes = JSON.parse(data)
        let index = quizzes.findIndex((q) => q.name == quiz.name)
        let id = quizzes.length + 1;
        quiz.id = id;
        if (index == -1) {
          quizzes.push(quiz)
          fs.writeFile(storageLocation + "quizzes.json", JSON.stringify(quizzes), textCodification, (err) => {
            if (err) {
              console.log(err)
              reject(err)
            }
          })
          resolve("Quiz created")

        }
        else {
          var error = "Quiz name already in use"
          reject(new Error(error));
        }
      }
    })
  }
  )
  return promise;
}
function updateQuiz(quiz) {
  const promise = new Promise((resolve, reject) => {
    fs.readFile(storageLocation + "quizzes.json", textCodification, (err, data) => {
      if (err) {
        reject(err)
      }
      else {
        let quizzes = JSON.parse(data)
        let index = quizzes.findIndex((q) => q.id == quiz.id);
        if (index == -1) {
          reject(new Error("Quiz not found"))
          return
        }
        if (quiz.name) {
          quizzes[index].name = quiz.name
        }
        if (quiz.questions) {
          quizzes[index].questions = quiz.questions
        }
        if (quiz.options) {
          quizzes[index].options = quiz.options
        }
        if (quiz.answers) {
          quizzes[index].answers = quiz.answers
        }
        if (quiz.coverImage) {
          quizzes[index].coverImage = quiz.coverImage
        }
        if (quiz.images) {
          quizzes[index].images = quiz.images
        }
        fs.writeFile(storageLocation + "quizzes.json", JSON.stringify(quizzes), textCodification, (err) => {
          if (err) {
            reject(err)
          }
          resolve("Quiz updated")
        })
      }
    })
  }
  )
  return promise;
}
function deleteQuiz(quiz) {
  const promise = new Promise((resolve, reject) => {
    fs.readFile
      (storageLocation + "quizzes.json", textCodification, (err, data) => {
        if (err) {
          reject(err)
        }
        else {
          let quizzes = JSON.parse(data)
          let index = quizzes.findIndex((q) => q.id == quiz.id)
          if (index == -1) {
            reject(new Error("Quiz not found"))
            return
          }
          quizzes.splice(index, 1)
          fs.writeFile(storageLocation + "quizzes.json", JSON.stringify(quizzes), textCodification, (err) => {
            if (err) {
              reject(err)
            }
            resolve("Quiz deleted")
          })
        }
      })
  }
  )
  return promise;
}
function getQuizzes() {
  const promise = new Promise((resolve, reject) => {
    fs.readFile(storageLocation + "quizzes.json", textCodification, (err, data) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(data)
      }
    })
  })
  return promise;
}
function getQuiz(quiz) {
  const promise = new Promise((resolve, reject) => {
    fs.readFile(storageLocation + "quizzes.json", textCodification, (err, data) => {
      if (err) {
        reject(err)
      }
      else {
        let quizzes = JSON.parse(data)
        let index = quizzes.findIndex((q) => q.id == quiz.id)
        if (index == -1) {
          reject(new Error("Quiz not found"))
          return
        }
        resolve(quizzes[index])
      }
    })
  })
  return promise;
}
module.exports = { createQuiz, updateQuiz, deleteQuiz, getQuizzes, getQuiz }
