// Tests for the HTTP endpoints in index.js.
//
// The real database.js (MongoDB) and chatModel.js (OpenAI) are replaced with
// fakes, so these tests run offline and never touch your real data.

const request = require('supertest');

// Fake database: same functions as database.js, but stored in plain arrays.
// (jest.mock factories can only use variables whose names start with "mock")
jest.mock('./database.js', () => {
  const mockDb = { users: [], chats: [], progress: [] };
  const copy = (obj) => (obj ? structuredClone(obj) : null);

  return {
    getUser: jest.fn(async (email) => copy(mockDb.users.find((u) => u.email === email))),
    getUserByToken: jest.fn(async (token) => copy(mockDb.users.find((u) => u.token === token))),
    addUser: jest.fn(async (user) => {
      mockDb.users.push(copy(user));
    }),
    updateUser: jest.fn(async (user) => {
      const stored = mockDb.users.find((u) => u.email === user.email);
      Object.assign(stored, copy(user));
    }),
    updateUserRemoveAuth: jest.fn(async (user) => {
      delete mockDb.users.find((u) => u.email === user.email).token;
    }),
    getChat: jest.fn(async (email) =>
      mockDb.chats
        .filter((m) => m.email === email)
        .sort((a, b) => a.createdAt - b.createdAt)
        .map(({ email, ...rest }) => copy(rest))
    ),
    addChatMessages: jest.fn(async (messages) => {
      mockDb.chats.push(...messages.map(copy));
    }),
    getProgress: jest.fn(async (email) => {
      const found = mockDb.progress.find((p) => p.email === email);
      if (!found) return null;
      const { email: _e, ...rest } = copy(found);
      return rest;
    }),
    addProgress: jest.fn(async (progress) => {
      mockDb.progress.push(copy(progress));
    }),
    // test helpers
    __data: mockDb,
    __reset: () => {
      mockDb.users = [];
      mockDb.chats = [];
      mockDb.progress = [];
    },
  };
});

// uuid v14 is ESM-only, which Jest can't require, so use Node's built-in generator in tests
jest.mock('uuid', () => ({ v4: () => require('crypto').randomUUID() }));

// Fake chat model: replies instantly instead of calling OpenAI
jest.mock('./chatModel', () => ({
  getChatResponse: jest.fn(async (history, text) => `echo: ${text}`),
}));

const DB = require('./database.js');
const { getChatResponse } = require('./chatModel');
const { getStarterProgress } = require('./stubProgress');
const app = require('./index');

// Pull the "token=..." part out of the Set-Cookie response header
function authCookie(res) {
  const cookies = res.headers['set-cookie'] || [];
  const tokenCookie = cookies.find((c) => c.startsWith('token='));
  return tokenCookie ? tokenCookie.split(';')[0] : undefined;
}

async function signUp(email = 'a@test.com', password = 'secret') {
  const res = await request(app).post('/api/auth/create').send({ email, password });
  return { res, cookie: authCookie(res) };
}

beforeEach(() => {
  DB.__reset();
  jest.clearAllMocks();
});

describe('auth', () => {
  test('signup creates a user, sets a cookie, and stores a hashed password', async () => {
    const { res, cookie } = await signUp('a@test.com', 'secret');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ email: 'a@test.com' });
    expect(cookie).toMatch(/^token=.+/);

    const stored = DB.__data.users[0];
    expect(stored.email).toBe('a@test.com');
    expect(stored.password).not.toBe('secret'); // bcrypt hash, not plain text
    expect(`token=${stored.token}`).toBe(cookie);
  });

  test('signup seeds the new user with starter progress', async () => {
    await signUp('a@test.com');

    expect(DB.addProgress).toHaveBeenCalledWith({ email: 'a@test.com', ...getStarterProgress() });
  });

  test('signup with an existing email returns 409', async () => {
    await signUp('a@test.com');
    const { res } = await signUp('a@test.com');

    expect(res.status).toBe(409);
    expect(DB.__data.users).toHaveLength(1);
  });

  test('login with the right password saves a new token to the database', async () => {
    const { cookie: oldCookie } = await signUp('a@test.com', 'secret');

    const res = await request(app).post('/api/auth/login').send({ email: 'a@test.com', password: 'secret' });
    const newCookie = authCookie(res);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ email: 'a@test.com' });
    expect(newCookie).not.toBe(oldCookie);
    expect(DB.updateUser).toHaveBeenCalled();

    // The new token works on a protected endpoint, the old one doesn't
    expect((await request(app).get('/api/chat').set('Cookie', newCookie)).status).toBe(200);
    expect((await request(app).get('/api/chat').set('Cookie', oldCookie)).status).toBe(401);
  });

  test('login with the wrong password returns 401', async () => {
    await signUp('a@test.com', 'secret');
    const res = await request(app).post('/api/auth/login').send({ email: 'a@test.com', password: 'wrong' });

    expect(res.status).toBe(401);
    expect(authCookie(res)).toBeUndefined();
  });

  test('login with an unknown email returns 401', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nobody@test.com', password: 'x' });

    expect(res.status).toBe(401);
  });

  test('logout removes the token so it stops working', async () => {
    const { cookie } = await signUp('a@test.com');

    const res = await request(app).delete('/api/auth/logout').set('Cookie', cookie);

    expect(res.status).toBe(204);
    expect(DB.__data.users[0].token).toBeUndefined();
    expect((await request(app).get('/api/chat').set('Cookie', cookie)).status).toBe(401);
  });

  test('logout without a cookie still succeeds', async () => {
    const res = await request(app).delete('/api/auth/logout');

    expect(res.status).toBe(204);
    expect(DB.updateUserRemoveAuth).not.toHaveBeenCalled();
  });
});

describe('progress', () => {
  test('requires login', async () => {
    const res = await request(app).get('/api/progress');
    expect(res.status).toBe(401);
  });

  test('returns the progress saved for the user', async () => {
    const { cookie } = await signUp('a@test.com');
    DB.__data.progress[0].known = [{ spanish: 'uno', english: 'one' }];

    const res = await request(app).get('/api/progress').set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.known).toEqual([{ spanish: 'uno', english: 'one' }]);
    expect(res.body.email).toBeUndefined();
  });

  test('falls back to the starter lists when the user has no progress saved', async () => {
    const { cookie } = await signUp('a@test.com');
    DB.__data.progress = []; // like a user who signed up before progress existed

    const res = await request(app).get('/api/progress').set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(getStarterProgress());
  });
});

describe('chat', () => {
  test('requires login', async () => {
    expect((await request(app).get('/api/chat')).status).toBe(401);
    expect((await request(app).post('/api/chat').send({ text: 'hola' })).status).toBe(401);
  });

  test('a new user has an empty chat', async () => {
    const { cookie } = await signUp();
    const res = await request(app).get('/api/chat').set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('empty or blank text returns 400 and saves nothing', async () => {
    const { cookie } = await signUp();

    expect((await request(app).post('/api/chat').set('Cookie', cookie).send({})).status).toBe(400);
    expect((await request(app).post('/api/chat').set('Cookie', cookie).send({ text: '   ' })).status).toBe(400);
    expect(DB.__data.chats).toHaveLength(0);
  });

  test('sending a message saves it and the reply, and returns both without email', async () => {
    const { cookie } = await signUp('a@test.com');

    const res = await request(app).post('/api/chat').set('Cookie', cookie).send({ text: '  hola  ' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toMatchObject({ from: 'me', text: 'hola' });
    expect(res.body[1]).toMatchObject({ from: 'them', text: 'echo: hola' });
    expect(res.body[0].email).toBeUndefined();

    // Saved in the database with the user's email, reply timestamped after the message
    expect(DB.__data.chats).toHaveLength(2);
    expect(DB.__data.chats.every((m) => m.email === 'a@test.com')).toBe(true);
    expect(DB.__data.chats[1].createdAt > DB.__data.chats[0].createdAt).toBe(true);
  });

  test('GET returns the conversation in order, and history is passed to the model', async () => {
    const { cookie } = await signUp();
    await request(app).post('/api/chat').set('Cookie', cookie).send({ text: 'uno' });
    await request(app).post('/api/chat').set('Cookie', cookie).send({ text: 'dos' });

    // The second call should have received the first exchange as history
    const historySent = getChatResponse.mock.calls[1][0];
    expect(historySent.map((m) => m.text)).toEqual(['uno', 'echo: uno']);

    const res = await request(app).get('/api/chat').set('Cookie', cookie);
    expect(res.body.map((m) => m.text)).toEqual(['uno', 'echo: uno', 'dos', 'echo: dos']);
  });

  test('users only see their own messages', async () => {
    const { cookie: cookieA } = await signUp('a@test.com');
    const { cookie: cookieB } = await signUp('b@test.com');
    await request(app).post('/api/chat').set('Cookie', cookieA).send({ text: 'from A' });

    const res = await request(app).get('/api/chat').set('Cookie', cookieB);
    expect(res.body).toEqual([]);
  });

  test('if the model fails, returns 502 and saves nothing', async () => {
    const { cookie } = await signUp();
    getChatResponse.mockRejectedValueOnce(new Error('OpenAI is down'));
    jest.spyOn(console, 'error').mockImplementation(() => {}); // keep test output quiet

    const res = await request(app).post('/api/chat').set('Cookie', cookie).send({ text: 'hola' });

    expect(res.status).toBe(502);
    expect(DB.__data.chats).toHaveLength(0);
    console.error.mockRestore();
  });
});
