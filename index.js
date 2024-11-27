const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const testFile = require('./tests.js');
const { styleText } = require("util");
const user = require('./classes/user.js');
const crypto = require('crypto');

const app = express();
const storageLocation = "./storage/"; // Localização da pasta de armazenamento
const textCodification = "utf8"; // Codificação dos arquivos de texto
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://tcc300104:cSR.u4KFAd7q_us@cluster0.pvlxo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

// Adicionando o middleware CORS para permitir requisições de http://localhost:5173
app.use(cors());
//user password = cSR.u4KFAd7q_us
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
  //Verificação de parâmetros
  var functionError = false;
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.status(400).send("Missing parameters");
    return;
  }
  user.findOne({ email: req.body.email }).then((result) => {
    if (result) {
      res.status(400).send("Email already in use");
      return;
    }
    req.body.password = crypto.createHash('sha256').update(req.body.password).digest('base64');
    //Criando o usuário
    let newUser = new user(req.body);
    newUser.save()
      .then((result) => {
        res.status(200).send("User Created");
      })
  }).catch((err) => {
    res.status(400).send(err.message);
  });
});

// Rota para atualização de usuário
app.post("/updateUser", (req, res) => {
  if (!req.body._id) {
    res.status(400).send("Missing parameters");
    return;
  }
  user.findOne({ id: req.body.id }).then((result) => {
    if (!result) {
      res.status(404).send("User not found");
      return;
    }
    if (req.body.password) {
      req.body.password = crypto.createHash('sha256').update(req.body.password).digest('base64');
    }
    user.findOneAndUpdate({ id: req.body.id }, req.body, { new: true })
      .then((result) => {
        res.status(200).send("User Updated");
      })
      .catch((err) => {
        res.status(404).send(err.message);
      })
  });
});
// Rota para exclusão de usuário
app.post("/deleteUser", (req, res) => {
  if (!req.body.id) {
    res.status(400).send("Missing parameters");
    return;
  }
  user.findOne({ _id: req.body.id }).then((result) => {
    if (!result) {
      res.status(404).send("User not found");
      return;
    }
    user.findOneAndDelete({ _id: req.body.id })
    .then((result) => {
      res.status(200).send("User Deleted");
    })
    .catch((err) => {
      res.status(404).send(err.message);
    });
  });
});

// Rota para checar a senha do usuário
app.post("/checkPassword", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send("Missing parameters");
    return;
  }
  user.findOne({ email: req.body.email }).then((result) => {
    if (!result) {
      res.status(404).send("User not found");
      return;
    }
    if (result.password == crypto.createHash('sha256').update(req.body.password).digest('base64')) {
      res.status(200).send("Password Correct");
    }
    else {
      res.status(400).send("Password Incorrect");
    }
  }
  );
});
app.get("/getUser/:email", (req, res) => {
  user.findOne({ email: req.params.email }).then((result) => {
    if (!result) {
      res.status(404).send(err.message);
    }
    res.status(200).send(result);
  });
});

// Servidor escuta na porta 3000
app.listen(3000, () => {
  const msg = "Servidor rodando na porta " + styleText("blue", "3000 \n") +
    "Para rodar os testes, acesse " + styleText("blue", "http://localhost:3000/testarArquivos");
  console.log(msg);
});
