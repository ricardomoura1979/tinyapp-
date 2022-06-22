const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
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



const testURLs = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

describe('urlsForUser', function() {
  it('should return a user\'s URLs', function() {
    const user = urlsForUser("aJ48lW", testURLs);
    const expectedOutput = {
      b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
      i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
    };
    assert.deepEqual(user, expectedOutput);
  });
});


describe('findUserObject', function() {
  it('should return the user object if the email and password match', function() {
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
    const email = "user@example.com"
    const password = "purple-monkey-dinosaur"
    const expectedOutput = {
      id: "userRandomID",
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    }
    assert.deepEqual(findUserObject(users, email, password), expectedOutput)
  });
});

describe('generateRandomString', function() {
  it('should return a string', function() {
    expect(typeof generateRandomString()).to.equal('string');
  });
  it('should return a string of length 6', function() {
    expect(generateRandomString().length).to.equal(6);
  });
});




module.exports = { getUserByEmail }

 
