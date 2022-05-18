const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { application } = require("express");
//const { parseForESLint } = require("babel-eslint");

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

function generateRandomString() {
  let generateShortLink = "";
  let options = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    generateShortLink += options.charAt(Math.random() * options.length)

  }
  return generateShortLink
}


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);

});

app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"] }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  console.log("abc")
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});


app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie("username", username);
  res.redirect("/urls");

});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});


app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id
  const longURL = req.body.newlongurl
  urlDatabase[shortURL] = longURL
  res.redirect("/urls")
})

app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(req.params)
  const shortURL = req.params.shortURL
  console.log(shortURL)
  delete urlDatabase[shortURL]
});

app.get("/register", (req, res) => {
const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("register", templateVars);

}) 




app.post("/register", (req, res) => {
  const id = generateRandomString()
  const email = req.body.email
  const password = req.body.password
  users[id] = {
    id: id,
    email: email,
    password: password,


  }
  res.cookie("user_id", id);
  res.redirect("/urls")
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


