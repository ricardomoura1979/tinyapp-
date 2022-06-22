//added bcrypt to hash all clients password
const bcrypt = require('bcryptjs');

// added and declared app below until line 5 to tell the express app to use EJS as its templating engine.
const express = require("express"); // import express framework / library

const { urlsForUser, urlDatabase, users, findUserObject, generateRandomString } = require('./helpers');

const app = express(); // instatiate the express server and we call it app //view engine setup 

const PORT = 8080; // default port 8080.


app.set("view engine", "ejs");

// added cookie encryption for the browser to protect client password.
const cookieSession = require("cookie-session");

// added body parser to convert the request body from a buffer into string to be read. Added cookie-parser to work with cookies to read values from them.
const bodyParser = require("body-parser");

//const { application } = require("express");


//module installation - function to take in both the users email and the users database.
const { getUserByEmail } = require("./helpers")

//const { parseForESLint } = require("babel-eslint");

app.use(cookieSession({
  name: 'session',
  keys: ["ergfer", "odnmvosdf"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(bodyParser.urlencoded({ extended: true }));


// added /urls route until line 103
app.get("/urls", (req, res) => {

  if (req.session.user_id) {
    const user_id = req.session.user_id;
    const user = users[user_id];
    const userUrls = urlsForUser (user_id);
    const templateVars = { urls: userUrls, user };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/register");
  }


});

// added new field to new registers.  
app.get("/urls/new", (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];
  if (!user) {
    res.redirect("/login");
    return;
  }
  const templateVars = { user }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  if (!userID) {
    res.send("You are not allowed to access this page")
  }

  const shortUrl = req.params.shortURL;
  const urlObj = urlDatabase[shortUrl];

  if (!urlObj) {
    res.send("URL is not valid!");
  }

  if (urlObj.userID !== userID) {
    res.send("Permission Denied!")
  }


  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user };
  res.render("urls_show", templateVars);
});

// cookie updated
app.get("/login", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  const templateVars = { user };
  res.render("login", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(400).send("ID doesn't exist");
  }
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

// added app.post to receive the form submission 

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    // return status code
    return res.status(400).send("error when filling the input form");
  };
  const findUser = findUserObject(users, email, password);
  if (!findUser) {
    return res.send("userNotFound");
  }

  const id = findUser.id;
  req.session.user_id = id;
  res.redirect("/urls");


});

app.post("/logout", (req, res) => {
  //res.clearCookie("user_id");
  req.session = null;
  res.redirect("/urls");
});


app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  // check if user as logged in
  const userID = req.session.user_id;
  console.log(userID)
  if (userID) {
    urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID: userID
    };
    res.redirect(`/urls/${shortURL}`)
  } else if (userID === undefined) {
    res.render("You must be logged in")
  }


});

app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const userID = req.session.user_id;
  if (!userID) {
    res.render("You must be logged in")
  } else {
    const longURL = req.body.newlongurl;
    //urlDatabase[shortURL] = longURL;
    urlDatabase[shortURL].longURL = longURL;
    res.redirect("/urls");
  }

});

app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  const shortURL = req.params.shortURL;
  const urlObject = urlDatabase[shortURL]

  if (!user || !urlObject || urlObject.userID !== userID) {
    return res.send("You don't have permission to Delete!")
  } 
  delete urlDatabase[shortURL];
  res.redirect("/urls");

});

//endpoint to returns the registration page template.
app.get("/register", (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];
  if (user) {
    res.redirect("/urls");
    return;
  }
  const templateVars = { urls: urlDatabase, user:{} };
  res.render("register", templateVars);


});




// added register field for future clients and password encryption.

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {

    res.status(400).send("error when filling the input form");
  };
  if (getUserByEmail(email, users)) {
    res.status(400).send("Email already exists!");
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  users[id] = {
    id: id,
    email: email,
    password: hashedPassword
  };

  //res.cookie("user_id", id);
  req.session.user_id = id;
  res.redirect("/urls")
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


