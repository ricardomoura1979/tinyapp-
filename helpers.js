const bcrypt = require('bcryptjs');


function urlsForUser(id, urlDatabase) {
  let userURL = {}
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userURL[shortURL] = urlDatabase[shortURL];
    };
  };
  return userURL
};

function getUserByEmail(email, users) {
  for (let item in users) {
    if (email === users[item].email) {
      return true;
    };
  } return false;
}

function findUserObject(users, email, password) {
  for (let user in users) {
    const hashedPassword = users[user].password
    const findEmail = getUserByEmail(email, users)
    console.log(findEmail)
    console.log(bcrypt.compareSync(password, hashedPassword))
    if (findEmail && bcrypt.compareSync(password, hashedPassword)) {
      return users[user]
    }
  }
  return false
};

function generateRandomString() {
  let generateShortLink = "";
  let options = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    generateShortLink += options.charAt(Math.random() * options.length)

  }
  return generateShortLink
}

module.exports = { urlsForUser, getUserByEmail, findUserObject, generateRandomString }


