function urlsForUser(id) {
  let userURL = {}
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userURL[shortURL] = urlDatabase[shortURL];
    };
  };
  return userURL
};

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.com",
    userID: "a1"
  }
};

const users = {
  "a1": {
    id: "a1",
    email: "a@a.com",
    password: bcrypt.hashSync("123456", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
};
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

module.exports = { urlsForUser, urlDatabase, users, findUserObject, generateRandomString }

 
