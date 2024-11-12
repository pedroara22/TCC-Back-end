const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createUser, updateUser, deleteUser, checkPassword } = require('./methods/userMethods.js');
const testFile = require('./tests.js');
const { styleText } = require("util");

const app = express();
const storageLocation = "./storage/"; // Localização da pasta de armazenamento
const textCodification = "utf8"; // Codificação dos arquivos de texto

// Adicionando o middleware CORS para permitir requisições de http://localhost:5173
app.use(cors({ origin: 'http://localhost:5173' }));

// Middleware para análise do JSON do corpo da requisição
app.use(bodyParser.json());

// Variável global para gerenciar o estado dos testes
global.tests = false;

// Rota para testar se os arquivos necessários estão presentes
app.get("/testarArquivos", (req, res) => {
  res.sendFile(__dirname + "/setup.html");
});

// Rota para configurar e rodar os testes
app.get("/setupTests", async (req, res) => {
  const fileToTest = global.tests ? "quizes.json" : "users.json";
  testFile(storageLocation, fileToTest, textCodification);
  res.status(200).send("Test Completed");
});

// Rota para resetar o status dos testes
app.get("/resetTests", (req, res) => {
  global.tests = false;
  res.status(200).send("Tests Reset");
});

// Rota para criação de usuário
app.post("/createUser", (req, res) => {
  console.log(req.body)
  createUser(req.body)
    .then((result) => {
      res.status(201).send("User Created"); // Retorna 201 se o usuário for criado com sucesso
    })
    .catch((err) => {
      if(err == 400)  res.status(400).send("Falta data"); // Retorna 400 com a mensagem de erro em caso de dados faltantes
      else if(err == 409)  res.status(409).send("Email já usado");
      else{
        res.status(400).send("Emo"); // Retorna 409 com a mensagem de erro em caso de falha
      }  // Retorna 409 com a mensagem de erro em caso de falha
    });
});

// Rota para atualização de usuário
app.post("/updateUser", (req, res) => {
  updateUser(req.body)
    .then((result) => {
      res.status(200).send("User Updated");
    })
    .catch((err) => {
      res.status(404).send(err.message);
    });
});

// Rota para exclusão de usuário
app.post("/deleteUser", (req, res) => {
  deleteUser(req.body)
    .then((result) => {
      res.status(200).send("User Deleted");
    })
    .catch((err) => {
      res.status(404).send(err.message);
    });
});

// Rota para checar a senha do usuário
app.post("/checkPassword", (req, res) => {
  checkPassword(req.body)
    .then((result) => {
      res.status(200).send("Password Correct");
    })
    .catch((err) => {
      res.status(403).send(err.message);
    });
});
app.get("/getUser/:email", (req, res) => {
  fs.readFile(storageLocation + "users.json", textCodification, (err, data) => {
    if (err) {
      res.status(404).send("Erro ao ler arquivo");
    }
    else {
      let users = JSON.parse(data);
      let user = users.find((u) => u.email == req.params.email);
      if (user) {
        res.status(200).send(user);
      }
      else {
        res.status(404).send("Usuário não encontrado");
      }
    }
  });
});

// Servidor escuta na porta 3000
app.listen(3000, () => {
  const msg = "Servidor rodando na porta " + styleText("blue", "3000 \n") + 
              "Para rodar os testes, acesse " + styleText("blue", "http://localhost:3000/testarArquivos");
  console.log(msg);
});
