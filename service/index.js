const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
// Starter word lists given to new users. (Step 5 renames the function in
// stubProgress.js to getStarterProgress, and then this becomes a plain import.)
const { getProgress: getStarterProgress } = require('./stubProgress');
const { getChatResponse } = require('./chatModel');
const DB = require('./database.js');
const app = express();

const authCookieName = 'token';

const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);



//service endpoints here

//copied from simon

// CreateAuth a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);

    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
});

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      await DB.updateUser(user); // save the new auth token
      setAuthCookie(res, user.token);
      res.send({ email: user.email });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    await DB.updateUserRemoveAuth(user);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    req.user = user; // let the endpoint know who is calling
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

// GetProgress returns the logged-in user's vocab progress
apiRouter.get('/progress', verifyAuth, async (req, res) => {
  const progress = await DB.getProgress(req.user.email);
  // Fall back to the starter lists for users who signed up before progress was saved
  res.send(progress || getStarterProgress());
});

// GetChat returns the logged-in user's chat messages
apiRouter.get('/chat', verifyAuth, async (req, res) => {
  res.send(await DB.getChat(req.user.email));
});

// SendChat saves the user's message, generates a reply, and returns both
apiRouter.post('/chat', verifyAuth, async (req, res) => {
  const text = req.body.text?.trim();
  if (!text) {
    res.status(400).send({ msg: 'Message text is required' });
    return;
  }

  const email = req.user.email;
  const history = chats[email] || [];

  let replyText;
  try {
    replyText = await getChatResponse(history, text);
  } catch (err) {
    console.error('Chat model error:', err.message);
    res.status(502).send({ msg: 'The chat model is unavailable right now' });
    return;
  }

  // Only save the messages once the model has replied, so a failed request
  // doesn't leave an unanswered message in the history
  const myMessage = { id: uuid.v4(), from: 'me', text: text };
  const reply = { id: uuid.v4(), from: 'them', text: replyText };
  chats[email] = [...history, myMessage, reply];

  res.send([myMessage, reply]);
});


async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  users.push(user);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  return users.find((u) => u[field] === value);
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}


// **will need to add more, such as fetching user's chat history or progress?


// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});


// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});





app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});