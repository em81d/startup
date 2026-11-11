// Tests for database.js.
//
// The MongoDB driver is replaced with a fake that records what each function
// asks for, so we can check the queries without a real database.
// dbConfig.json is also faked, so these tests never read your real credentials.

jest.mock('./dbConfig.json', () => ({ userName: 'u', password: 'p', hostname: 'example.test' }));

jest.mock('mongodb', () => {
  const mockCollections = {};
  const makeCollection = () => ({
    findOne: jest.fn(async () => null),
    find: jest.fn(() => ({ toArray: jest.fn(async () => []) })),
    insertOne: jest.fn(async () => ({})),
    insertMany: jest.fn(async () => ({})),
    updateOne: jest.fn(async () => ({})),
  });
  const mockDb = {
    command: jest.fn(async () => ({ ok: 1 })),
    collection: jest.fn((name) => (mockCollections[name] ??= makeCollection())),
  };
  const mockClient = { db: jest.fn(() => mockDb) };

  return {
    MongoClient: jest.fn(() => mockClient),
    __mocks: { mockClient, mockDb, mockCollections },
  };
});

const { MongoClient, __mocks } = require('mongodb');
const { mockClient, mockCollections } = __mocks;

let logSpy;
let DB;
beforeAll(() => {
  logSpy = jest.spyOn(console, 'log').mockImplementation(() => {}); // hide "Connect to database"
  DB = require('./database.js');
});
afterAll(() => logSpy.mockRestore());

test('connects with the config values and uses the chatty database', () => {
  expect(MongoClient).toHaveBeenCalledWith('mongodb+srv://u:p@example.test');
  expect(mockClient.db).toHaveBeenCalledWith('chatty');
  expect(Object.keys(mockCollections).sort()).toEqual(['chat', 'progress', 'user']);
});

describe('users', () => {
  test('getUser looks up by email', async () => {
    await DB.getUser('a@test.com');
    expect(mockCollections.user.findOne).toHaveBeenCalledWith({ email: 'a@test.com' });
  });

  test('getUserByToken looks up by token', async () => {
    await DB.getUserByToken('abc');
    expect(mockCollections.user.findOne).toHaveBeenCalledWith({ token: 'abc' });
  });

  test('addUser inserts the user', async () => {
    const user = { email: 'a@test.com', password: 'hash', token: 't' };
    await DB.addUser(user);
    expect(mockCollections.user.insertOne).toHaveBeenCalledWith(user);
  });

  test('updateUser sets fields on the matching email', async () => {
    const user = { email: 'a@test.com', token: 'new' };
    await DB.updateUser(user);
    expect(mockCollections.user.updateOne).toHaveBeenCalledWith({ email: 'a@test.com' }, { $set: user });
  });

  test('updateUserRemoveAuth unsets the token', async () => {
    await DB.updateUserRemoveAuth({ email: 'a@test.com' });
    expect(mockCollections.user.updateOne).toHaveBeenCalledWith({ email: 'a@test.com' }, { $unset: { token: 1 } });
  });
});

describe('chat', () => {
  test('getChat finds the user\'s messages, oldest first, without _id or email', async () => {
    await DB.getChat('a@test.com');
    expect(mockCollections.chat.find).toHaveBeenCalledWith(
      { email: 'a@test.com' },
      { sort: { createdAt: 1 }, projection: { _id: 0, email: 0 } }
    );
  });

  test('addChatMessages inserts all messages at once', async () => {
    const messages = [{ id: '1' }, { id: '2' }];
    await DB.addChatMessages(messages);
    expect(mockCollections.chat.insertMany).toHaveBeenCalledWith(messages);
  });
});

describe('progress', () => {
  test('getProgress finds by email without _id or email', async () => {
    await DB.getProgress('a@test.com');
    expect(mockCollections.progress.findOne).toHaveBeenCalledWith(
      { email: 'a@test.com' },
      { projection: { _id: 0, email: 0 } }
    );
  });

  test('addProgress inserts the progress document', async () => {
    const progress = { email: 'a@test.com', known: [], learning: [], future: [] };
    await DB.addProgress(progress);
    expect(mockCollections.progress.insertOne).toHaveBeenCalledWith(progress);
  });
});
