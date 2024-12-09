const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { styleText } = require("util");
const user = require('./classes/user.js');
const quiz = require('./classes/quiz.js');
const crypto = require('crypto');

const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://tcc300104:cSR.u4KFAd7q_us@cluster0.pvlxo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

app.use(cors());
//user password = cSR.u4KFAd7q_us
// Middleware para análise do JSON do corpo da requisição
app.use(bodyParser.json());

// Rota para criação de usuário
app.post("/createUser", (req, res) => {
  //Verificação de parâmetros
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
    newUser.score = 0;

    newUser.save()
      .then(() => {
        res.status(200).send("User Created");
      })
  }).catch((err) => {
    res.status(400).send(err.message);
  });
});

// Rota para atualização de usuário
app.post("/updateUser", (req, res) => {
  if (!req.body.id) {
    res.status(400).send("Missing parameters");
    return;
  }
  user.findOne({ _id: req.body.id }).then((result) => {
    if (!result) {
      res.status(404).send("User not found");
      return;
    }
    var body = req.body
    if (req.body.password) {
      body.password = crypto.createHash('sha256').update(req.body.password).digest('base64');
    }
    else{
      body.password = result.password;
    }
    user.findOneAndUpdate({ _id: req.body.id }, body, { new: true })
      .then(() => {
        res.status(200).send("User Updated");
      })
      .catch((err) => {
        res.status(404).send(err.message);
      })
  });
});

app.post("/createQuiz", (req, res) => {
  if (!req.body.name || !req.body.questions || !req.body.description || !req.body.authorId) {
    res.status(400).send("Missing parameters");
    return;
  }
  let newQuiz = new quiz(req.body);
  newQuiz.save()
    .then(() => {
      res.status(200).send("Quiz Created");
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
});

app.post("/updateQuiz", (req, res) => {
  if (!req.body.id) {
    res.status(400).send("Missing parameters");
    return;
  }
  quiz.findOne({ _id: req.body.id }).then((result) => {
    if (!result) {
      res.status(404).send("Quiz not found");
      return;
    }
    quiz.findOneAndUpdate({
      _id: req.body.id
    }, req.body, { new: true })
      .then(() => {
        res.status(200).send("Quiz Updated");
      })
      .catch((err) => {
        res.status(404).send(err.message);
      });
  });
});

app.post("/deleteQuiz", (req, res) => {
  if (!req.body.id) {
    res.status(400).send("Missing parameters");
    return;
  }
  quiz.findOne({ _id: req.body.id }).then((result) => {
    if (!result) {
      res.status(404).send("Quiz not found");
      return;
    }
    quiz.findOneAndDelete({ _id: req.body.id })
      .then(() => {
        res.status(200).send("Quiz Deleted");
      })
      .catch((err) => {
        res.status(404).send(err.message);
      });
  });
});

app.get("/getQuiz/:id", (req, res) => {
  quiz.findOne({ _id: req.params.id }).then((result) => {
    if (!result) {
      res.status(404).send("Quiz not found");
    } else {
      res.status(200).send(result);
    }
  }).catch((err) => {
    res.status(400).send(err.message);
  });
});

app.get("/getQuizzes", (req, res) => {
  quiz.find().then((result) => {
    res.status(200).send(result);

  }).catch((err) => {

    res.status(400).send(err.message);
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
      .then(() => {
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
      res.status(404).send("User not found");
    } else {
      res.status(200).send(result);
    }
  }).catch((err) => {
    res.status(400).send(err.message);
  });
});

// Servidor escuta na porta 3000
app.listen(3000, () => {
  const msg = "Servidor rodando na porta " + styleText("blue", "3000 \n") +
    "Para rodar os testes, acesse " + styleText("blue", "http://localhost:3000/testarArquivos");
  console.log(msg);
});
