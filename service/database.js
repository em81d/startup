const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('chatty');
const userCollection = db.collection('user');
const chatCollection = db.collection('chat');
const progressCollection = db.collection('progress');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connect to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

// ----- Users -----

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne({ email: user.email }, { $set: user });
}

async function updateUserRemoveAuth(user) {
  await userCollection.updateOne({ email: user.email }, { $unset: { token: 1 } });
}

// ----- Chat -----

// Returns the user's messages oldest first, as [{ id, from, text, createdAt }, ...]
function getChat(email) {
  const options = {
    sort: { createdAt: 1 },
    projection: { _id: 0, email: 0 },
  };
  return chatCollection.find({ email: email }, options).toArray();
}

// messages: [{ id, email, from, text, createdAt }, ...]
async function addChatMessages(messages) {
  await chatCollection.insertMany(messages);
}

// ----- Progress -----

// Returns { known, learning, future }, or null if the user has no progress yet
function getProgress(email) {
  return progressCollection.findOne({ email: email }, { projection: { _id: 0, email: 0 } });    //projection excludes the id and email fields
}

// progress: { email, known, learning, future }
async function addProgress(progress) {
  await progressCollection.insertOne(progress);
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  updateUserRemoveAuth,
  getChat,
  addChatMessages,
  getProgress,
  addProgress,
};
