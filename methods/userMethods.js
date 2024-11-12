/** crie os modificadores, para criar, modificar e apagar o usuario no arquivo users.json. */
const fs = require("fs")
const textCodification = "utf8"
const storageLocation = "./storage/"
const crypto = require('crypto')
/** Importando função que testa os arquivos */

function createUser(user) {
  /** Não deixe users com o email ja usado serem criados */
  const promise = new Promise((resolve, reject) => {
    if (!user.email || !user.password || !user.name) {
      reject(403)
      return
    }
    user.password = crypto.createHash
      ('sha256').update(user.password
      ).digest('hex')
    fs.readFile(storageLocation + "users.json", textCodification, (err, data) => {
      if (err) {
        console.log(err)
      }
      else {
        let users = JSON.parse(data)
        let index = users.findIndex((u) => u.email == user.email)
        let id = users.length + 1;
        user.id = id;
        if (index == -1) {
          users.push(user)
          fs.writeFile(storageLocation + "users.json", JSON.stringify(users), textCodification, (err) => {
            if (err) {
              console.log(err)
              reject(err)
            }
          })
          resolve("User created")

        }
        else {
          console.log("Email already used")
          reject(409);
        }
      }
    })
  })
  return promise;


}
function updateUser(user) {
  const promise = new Promise((resolve, reject) => {
    user.password ? user.password = crypto.createHash
      ('sha256').update(user.password).digest('hex') : null
    fs.readFile(storageLocation + "users.json", textCodification, (err, data) => {
      if (err) {
        reject(err)
      }
      else {
        let users = JSON.parse(data)
        let index = users.findIndex((u) => u.id == user.id);
        if (index == -1) {
          reject(new Error("User not found"))
          return
        }
        if (user.email) {
          users[index].email = user.email
        }
        if (user.name) {
          users[index].name = user.name
        }
        if (user.password) {
          users[index].password = user.password
        }
        fs.writeFile(storageLocation + "users.json", JSON.stringify(users), textCodification, (err) => {
          if (err) {
            console.log(err)
            reject(err)
          }
          else {
            resolve("User updated")
          }
        })
      }

    })
  })
  return promise;
}
function deleteUser(user) {
  const promise = new Promise((resolve, reject) => {
    fs.readFile
      (storageLocation + "users.json", textCodification, (err, data) => {
        if (err) {
          console.log(err)
          reject(err)
        }
        else {
          let users = JSON.parse(data)
          let index = users.findIndex((u) => u.id == user.id)
          if (index == -1) {
            reject(new Error("User not found"))
            return
          }
          users.splice(index, 1)
          fs.writeFile(storageLocation + "users.json", JSON.stringify(users), textCodification, (err) => {
            if (err) {
              console.log(err)
              reject(err)
            }
            else {
              resolve("User deleted")
            }
          })
        }
      })
  })
  return promise;
}
function checkPassword(user) {
  var userEmail = user.email
  const promise = new Promise((resolve, reject) => {
    fs.readFile(storageLocation + "users.json", textCodification, (err, data) => {
      if (err) {
        console.log(err)
        reject(err)
      }
      else {
        let users = JSON.parse(data)
        let index = users.findIndex((u) => u.email == userEmail)
        if (index == -1) {
          reject(new Error("User not found"))
          return
        }
        else {
          user.password = crypto.createHash
            ('sha256').update
            (user.password).digest('hex')
            

          if (users[index].password == user.password) {
            resolve("Password correct")
          }
          else {
            reject(new Error("Wrong password"))
          }
        }
      }
    })
  })
  return promise;
}
function getUser(email){
  const promise = new Promise((resolve, reject) => {
    fs.readFile(storageLocation + "users.json", textCodification, (err, data) => {
      if (err) {
        console.log(err)
        reject(err)
      }
      else {
        let users = JSON.parse(data)
        let index = users.findIndex((u) => u.email == email)
        if (index == -1) {
          reject(new Error("User not found"))
          return
        }
        else {
          resolve(users[index])
        }
      }
    })
  })
  return promise;
}
module.exports = { createUser, updateUser, deleteUser, checkPassword }