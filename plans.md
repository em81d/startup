# Plan: Stub out login with localStorage

## Context
Chat260 has a static Login page (`src/login/login.jsx`) with an email/password form that does nothing yet. Before building the real backend/database, we want a working demo flow:
- Any email/password is accepted as long as the format is valid (real-looking email, non-empty password). No real auth.
- Pressing **Login** or **Sign Up** "logs the user in" by saving their email to `localStorage`.
- Once logged in, the header nav label changes from **Login** → **Account**.
- The `/login` page then shows the user's email and a **Log out** button instead of the form.
- Refreshing the browser keeps you logged in (that's the point of `localStorage`).

Only two files change: `src/app.jsx` and `src/login/login.jsx`. No new dependencies.

---

## Key React ideas you'll use (read this first)

1. **State (`useState`)** — a value that, when changed, makes React re-render the component. `const [email, setEmail] = React.useState('')`.
2. **Lifting state up** — both the header (in `App`) and the Login page need to know "who is logged in". The rule in React: put shared state in the *closest common parent* — here, `App` — and pass it down as **props**.
3. **Passing functions as props** — the child (`Login`) can't change the parent's state directly, so `App` passes down callback functions (`onLogin`, `onLogout`) that the child calls.
4. **Controlled inputs** — an `<input>` whose `value` comes from state and whose `onChange` updates state. This is how React "reads" what the user typed.
5. **`localStorage`** — browser key/value storage that survives refreshes. Only strings: `localStorage.setItem('userEmail', email)`, `localStorage.getItem('userEmail')` (returns `null` if missing), `localStorage.removeItem('userEmail')`.
6. **Conditional rendering** — `{userEmail ? <A/> : <B/>}` shows one thing or another based on state.

---

## Step 1 — `src/app.jsx`: hold the logged-in user in state

### 1a. Create the state, initialized from localStorage
Inside `export default function App() {`, before `return`, add:

```jsx
const [userEmail, setUserEmail] = React.useState(localStorage.getItem('userEmail') || '');
```
- On first load, if someone logged in earlier, we read their email back out. Otherwise `''` (empty = logged out).
- `''` is "falsy" in JavaScript, so later `userEmail ? ... : ...` works as a logged-in check.

### 1b. Write the login/logout functions
Right below the state line:

```jsx
function login(email) {
  localStorage.setItem('userEmail', email);
  setUserEmail(email);
}

function logout() {
  localStorage.removeItem('userEmail');
  setUserEmail('');
}
```
- We update **both** places: `localStorage` (so it survives refresh) and React state (so the UI re-renders *now*). localStorage alone would NOT cause a re-render — that's a common beginner gotcha.

### 1c. Change the nav label (line 18)
Replace:
```jsx
<li><NavLink className="nav-link" to="/login">Login</NavLink></li>
```
with:
```jsx
<li><NavLink className="nav-link" to="/login">{userEmail ? 'Account' : 'Login'}</NavLink></li>
```
- Curly braces `{}` in JSX mean "run this JavaScript expression". The ternary picks the label.
- The URL stays `/login` — only the text changes. (Optional later: rename the route to `/account`.)

### 1d. Pass state + functions to the Login page (line 30)
Replace:
```jsx
<Route path='/login' element={<Login />} />
```
with:
```jsx
<Route path='/login' element={<Login userEmail={userEmail} onLogin={login} onLogout={logout} />} />
```
- These attributes become the `props` object inside `Login`.

---

## Step 2 — `src/login/login.jsx`: form when logged out, account view when logged in

### 2a. Accept the props
Change the function signature:
```jsx
export function Login({ userEmail, onLogin, onLogout }) {
```
- `{ userEmail, onLogin, onLogout }` is **destructuring**: shorthand for `props.userEmail`, etc.

### 2b. Add state for the form inputs
At the top of the function body:
```jsx
const [email, setEmail] = React.useState('');
const [password, setPassword] = React.useState('');
```
- This is *local* state — only the Login page cares about what's mid-typing. It's separate from `userEmail` in `App`, which only gets set once they actually submit.

### 2c. Handle the form submit
```jsx
function handleSubmit(e) {
  e.preventDefault();   // stop the browser from reloading the page (default form behavior)
  onLogin(email);       // tell App "this person is logged in"
  setPassword('');      // don't keep the password around
}
```
- **"Fits the format" validation comes free from HTML:** the inputs will have `type="email"` and `required` (and `minLength` on password). The browser blocks the submit and shows a message if the email is malformed or a field is empty, so `handleSubmit` only runs on valid input.
- Both **Login** and **Sign Up** are `type="submit"` buttons in the same form, so both trigger `handleSubmit`. For this stub they do the same thing — that's fine. When you add the database, you'll split them (e.g. give each button its own `onClick` that calls a different endpoint).

### 2d. Logged-in view (early return)
Right after `handleSubmit`, before the existing `return`:
```jsx
if (userEmail) {
  return (
    <main className="page flex flex-col items-center justify-center">
      <h2 className="text-center">Account</h2>
      <section className="card mt-6 w-full max-w-sm space-y-4 text-center">
        <p>Logged in as</p>
        <p className="font-medium">{userEmail}</p>
        <button className="btn" type="button" onClick={onLogout}>Log out</button>
      </section>
    </main>
  );
}
```
- An **early return** is a clean way to do conditional rendering when the two views are totally different.
- Reuses the existing `page`, `card`, `btn` classes from `src/input.css` so it matches the site style.
- `onClick={onLogout}` — pass the function itself, don't call it (`onLogout()` would run it immediately on every render!).

### 2e. Wire up the existing form (logged-out view)
Modify the existing JSX:
- `<form className="space-y-4">` → `<form className="space-y-4" onSubmit={handleSubmit}>`
- Email input — add:
  ```jsx
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  ```
- Password input — add:
  ```jsx
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
  minLength={4}
  ```
  (`minLength={4}` is an arbitrary demo rule — tweak or remove.)
- Buttons stay as they are.

---

## What the finished flow looks like
1. Visit `/login` → nav says **Login**, form shows.
2. Type `bad-email` → browser shows "Please include an '@'…" and nothing happens.
3. Type `me@test.com` / `abcd` → click **Login** (or **Sign Up**).
4. `onLogin` runs in `App` → saves to localStorage + sets state → React re-renders → nav now says **Account**, page shows "Logged in as me@test.com" + **Log out**.
5. Refresh → still logged in (state was initialized from localStorage).
6. Click **Log out** → localStorage cleared, state reset → nav says **Login**, form returns.

## Verification
1. `npm run dev`, open the printed localhost URL.
2. Walk through steps 1–6 above.
3. DevTools → **Application** tab → **Local Storage** → your localhost origin: confirm a `userEmail` key appears after login and disappears after logout.
4. Check the Console tab for no React errors/warnings (e.g. "uncontrolled to controlled input" would mean a `value` was `undefined`).

## Later, when you add the database (not part of this change)
- Replace the body of `handleSubmit` with a `fetch('/api/auth/login', …)` (or `/create` for Sign Up), and only call `onLogin` if the server says OK.
- Logout would also call the server to end the session, then call `onLogout`.
- The `App`/props structure from this plan stays the same — that's why lifting state up now pays off.

---

# Plan 2: Add a user name (separate from email)

## Context
The localStorage login stub (Plan 1) only stores an email. We want a **name** too, so pages can greet the user personally. The Account page still says "Logged in as {email}", but the Progress page heading becomes a greeting:

```
hi, {name}.
Here's your progress.
```

Files changed: `src/app.jsx`, `src/login/login.jsx`, `src/progress/progress.jsx`.

---

## Key React ideas in this change

1. **Same pattern, second piece of state.** You already lifted `userEmail` up to `App`. A name is just another piece of shared state, so it goes in the same place, handled the same way. Once you've learned the pattern you can repeat it.
2. **Passing props to a *different* child.** Before, only `Login` got user info. Now `Progress` needs it too. That's the payoff of lifting state up: any page `App` renders can be handed the data.
3. **Functions can take more than one argument.** `onLogin(email)` becomes `onLogin(email, name)`. The parent defines what the callback expects and the child supplies those values.
4. **Fallback values with `||`.** `userName || 'there'` means "use `userName` if it's truthy, otherwise use `'there'`". An empty string is falsy, so a logged-out visitor sees "hi, there." instead of "hi, ."
5. **Why two localStorage keys instead of one?** You *could* store `{ email, name }` as one JSON string (`JSON.stringify` / `JSON.parse`). Two plain keys are simpler to read in DevTools and need no parsing, which is good while learning. If the user object grows (avatar, language, level…), switch to one JSON key.

---

## Step 1: `src/app.jsx`

### 1a. Add a second state variable
Right under the existing `userEmail` line:

```jsx
const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
```
This works exactly like `userEmail`: it starts from localStorage so a refresh keeps it.

### 1b. Update `login` and `logout`
```jsx
function login(email, name) {
  localStorage.setItem('userEmail', email);
  localStorage.setItem('userName', name);
  setUserEmail(email);
  setUserName(name);
}

function logout() {
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  setUserEmail('');
  setUserName('');
}
```
- Every place that touches the email now touches the name too, so the two always stay in sync.
- Forgetting `removeItem('userName')` in logout is an easy bug to make: the next person to log in would briefly see the old name.

### 1c. Pass the name to Progress
Change:
```jsx
<Route path='/progress' element={<Progress />} />
```
to:
```jsx
<Route path='/progress' element={<Progress userName={userName} />} />
```
The nav label logic (`userEmail ? 'Account' : 'Login'`) doesn't change. Email is still the "am I logged in?" check.

---

## Step 2: `src/login/login.jsx`

### 2a. Add form state for the name
At the top with the other `useState` lines:
```jsx
const [name, setName] = React.useState('');
```

### 2b. Send the name to `App` on submit
In `handleSubmit`, change `onLogin(email)` to:
```jsx
onLogin(email, name.trim());
```
`.trim()` strips leading/trailing spaces, so `"  Emeline "` is saved as `"Emeline"`.

### 2c. Add a Name input to the form
Put it as the first field inside the `<form>`, above Email. Copy the same structure as the other fields:
```jsx
<div>
  <label className="field-label" htmlFor="name">Name</label>
  <input
    className="field-input"
    type="text"
    id="name"
    name="name"
    placeholder="your name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
  />
</div>
```
- `htmlFor="name"` on the label matches `id="name"` on the input. Clicking the label focuses the input, and screen readers announce them together. (In JSX it's `htmlFor`, not `for`, because `for` is a reserved word in JavaScript.)
- `required` makes the browser block submit if the name is empty, the same validation you already have on email and password.

### 2d. Account view: no change
It still shows `{userEmail}`, as requested.

---

## Step 3: `src/progress/progress.jsx`

### 3a. Accept the prop
```jsx
export function Progress({ userName }) {
```

### 3b. Replace the heading
Replace `<h2>Progress</h2>` with:
```jsx
<h2>hi, {userName || 'there'}.</h2>
<h3>Here's your progress.</h3>
```
- `{userName || 'there'}` is a JS expression inside JSX. See idea #4 above.
- The apostrophe in `Here's` is fine in JSX text. (Some linters prefer `&apos;`, but React renders it either way.)
- Heading levels: `src/input.css` already styles `h2` (3xl bold) and `h3` (xl semibold). `h1` has **no** custom style, and Tailwind's reset makes an unstyled `h1` look like plain body text. That's why this uses `h2`/`h3`. If you want a real `<h1>`, add an `h1 { @apply ... }` rule in the `@layer base` block of `input.css`.

---

## Known limitation (because there's no database yet)
The **Name** field shows for both Login and Sign Up. Logically, only Sign Up should ask for a name: on Login, the server would look up the name that goes with the email. Without a backend there's nowhere to look it up, so for now the form asks every time. When you add the database:
- Show the Name field only for Sign Up (e.g. a `mode` state toggled by the buttons, or a separate sign-up form).
- On Login, the server response returns the user's name, and you call `onLogin(email, response.name)`.

## Verification
1. `npm run dev`
2. **Logged out:** visit `/progress` and you should see "hi, there."
3. Go to `/login`, submit with an empty Name. The browser should block it ("Please fill out this field").
4. Enter `Emeline` / `me@test.com` / `abcd` → **Login**. The nav changes to **Account**, and the page shows "Logged in as me@test.com".
5. Visit `/progress` and you should see "hi, Emeline." / "Here's your progress."
6. Refresh. The name should still be there.
7. DevTools → Application → Local Storage: `userEmail` and `userName` both exist.
8. **Log out**, then check `/progress` says "hi, there." again and both keys are gone from Local Storage.

---

# Plan 3: Text chat interface (localStorage, no backend)

## Context
The Chat page (`src/chat/chat.jsx`) was static: a "Click to start conversation" button that did nothing, and a "Focus for this conversation" card. We want a working demo of the chat UI before there's a backend:
- A chat window with message bubbles. Your messages are on the right; the other side's are on the left.
- Type a message and press **Enter** (or click **Send**) to add a bubble.
- Nothing replies yet. There's one hardcoded bubble from the other side: **"Hi, let's get started."**
- Messages are saved in `localStorage`, so they survive a reload.
- The chat only shows when logged in. Logged-out visitors see a "Log in to start chatting" card instead.

Files changed: `src/app.jsx`, `src/chat/chat.jsx`, `src/input.css`.

---

## Key React ideas in this change

1. **Rendering a list with `.map()`.** React turns an array of data into an array of elements: `messages.map((m) => <div>{m.text}</div>)`. This is the most common pattern in React.
2. **The `key` prop.** Every item in a mapped list needs a unique, stable `key` so React can tell which items changed. Use an ID, not the array index. Indexes shift when items are inserted or removed.
3. **Updating arrays immutably.** Never `messages.push(...)`. React only re-renders when state is set to a *new* value, and `push` changes the old array in place. Instead, copy it with the **spread operator**: `[...messages, newMessage]`.
4. **Storing arrays/objects in localStorage.** localStorage only holds strings, so you convert going in and coming out: `JSON.stringify(array)` to save, `JSON.parse(string)` to load.
5. **Lazy initial state.** `useState(() => expensiveThing())` with a *function* runs that function only on the first render. Without the arrow, `JSON.parse(localStorage...)` would run on every keystroke, wasted work.
6. **Rules of Hooks.** Hooks (`useState`, `useEffect`, `useRef`) must be called in the same order every render, so you can't put them after an `if (...) return`. The fix is to split the page into two components: `Chat` decides logged-in vs. logged-out, and `ChatWindow` owns the hooks. React only creates `ChatWindow` when you're logged in, so its hooks always run in order.
7. **`useRef`.** Gives you a handle to an actual DOM element (`ref={scrollRef}` → `scrollRef.current` is the `<div>`). It's for things React doesn't manage, like scroll position.
8. **`useEffect`.** Runs code *after* React updates the screen. With `[messages]` as the dependency array, it runs whenever `messages` changes. We use it to scroll the chat to the bottom once the new bubble exists.
9. **Enter-to-send comes free from `<form>`.** Pressing Enter in a text input inside a form submits the form. One `onSubmit` handler covers both the Enter key and the Send button.

---

## Step 1: `src/app.jsx`

Give Chat the logged-in user. Change:
```jsx
<Route path='/chat' element={<Chat />} />
```
to:
```jsx
<Route path='/chat' element={<Chat userEmail={userEmail} />} />
```
Chat uses `userEmail` for two things: deciding whether to show the chat, and naming the localStorage key so each user has their own history.

---

## Step 2: `src/chat/chat.jsx`

### 2a. Imports and the intro message
At the top of the file:
```jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const introMessage = { id: 'intro', from: 'them', text: "Hi, let's get started." };
```
- Each message is an object: `id` (for the `key` prop), `from` (`'me'` or `'them'`, which decides left/right), and `text`.
- `introMessage` lives **outside** the component because it never changes. Constants don't need state.
- It is **not** saved to localStorage. It's always shown first, so storing it would only duplicate it.
- The text uses double quotes because it contains an apostrophe (`let's`).

### 2b. `Chat`: the page shell
```jsx
export function Chat({ userEmail }) {
  return (
    <main className="page">
      <h2>Chat</h2>

      {userEmail ? (
        <ChatWindow userEmail={userEmail} />
      ) : (
        <section className="card mt-6 max-w-2xl">
          <h3>Log in to start chatting</h3>
          <p className="mt-2 text-mist-600">
            Your conversation picks up right where you left off.
          </p>
          <NavLink className="btn mt-5" to="/login">Go to login</NavLink>
        </section>
      )}

      {/* "Focus for this conversation" card stays unchanged here */}
    </main>
  );
}
```
- The ternary `{condition ? (A) : (B)}` picks which JSX to show. Parentheses let each branch span several lines.
- The logged-out card replaces the old "Ready when you are" card and its do-nothing button. `NavLink` with the `btn` class looks like a button but navigates to `/login`.
- `Chat` has **no hooks**, which is what lets it branch safely (idea #6).

### 2c. `ChatWindow`: state and refs
Below `Chat`, in the same file (not exported, since only `Chat` uses it):
```jsx
function ChatWindow({ userEmail }) {
  const storageKey = `chatMessages:${userEmail}`;
  const [messages, setMessages] = React.useState(() => JSON.parse(localStorage.getItem(storageKey) || '[]'));
  const [draft, setDraft] = React.useState('');
  const scrollRef = React.useRef(null);
```
- **Template literal**: the backticks plus `${...}` build a string like `chatMessages:me@test.com`, so each user gets their own history. Log out, log in as someone else, and you get a fresh chat.
- `localStorage.getItem(...) || '[]'`: on the first visit there's nothing saved (`null`), so fall back to the string `'[]'`, which parses to an empty array.
- `draft` is what's currently typed in the box: a controlled input, the same pattern as the login form.

### 2d. Auto-scroll with `useEffect`
```jsx
  // Keep the newest message in view
  React.useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);
```
`scrollHeight` is the full height of the content, so setting `scrollTop` to it scrolls to the very bottom. This also runs on first load, so a long saved history opens at the latest message.

### 2e. Sending a message
```jsx
  function handleSubmit(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const newMessages = [...messages, { id: crypto.randomUUID(), from: 'me', text }];
    setMessages(newMessages);
    localStorage.setItem(storageKey, JSON.stringify(newMessages));
    setDraft('');
  }
```
- `if (!text) return;` ignores empty or spaces-only messages.
- `crypto.randomUUID()` is built into the browser and makes a unique ID string for the `key`.
- `{ ..., text }` is **shorthand** for `text: text`.
- Note: we save `newMessages`, **not** `messages`. `setMessages` doesn't change the `messages` variable until the next render, so `messages` here is still the *old* array. This is one of the most common React surprises.
- `setDraft('')` clears the input after sending.

### 2f. Rendering the bubbles and input
```jsx
  const allMessages = [introMessage, ...messages];

  return (
    <section className="card mt-6 max-w-2xl">
      <div className="chat-window" ref={scrollRef}>
        {allMessages.map((message) => (
          <div key={message.id} className={message.from === 'me' ? 'bubble bubble-me' : 'bubble bubble-them'}>
            {message.text}
          </div>
        ))}
      </div>

      <form className="mt-4 flex gap-3" onSubmit={handleSubmit}>
        <input
          className="field-input"
          type="text"
          aria-label="Message"
          placeholder="Type a message..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button className="btn" type="submit">Send</button>
      </form>
    </section>
  );
}
```
- `[introMessage, ...messages]` puts the hardcoded bubble first, then everything you've sent.
- `className={... ? 'bubble bubble-me' : 'bubble bubble-them'}` gives every bubble the shared `bubble` look, plus a side-specific class.
- `{message.text}` is rendered as **text**, never as HTML, so typing `<b>hi</b>` shows those literal characters. React escapes it for you, which prevents a whole class of security bugs (XSS).
- There's no visible label, so `aria-label="Message"` tells screen readers what the input is for.

---

## Step 3: `src/input.css`: bubble styles

Add a Chat section inside `@layer components`, just above `/* ---- Footer ---- */`:
```css
/* ---- Chat ---- */
.chat-window {
  @apply flex h-96 flex-col gap-2 overflow-y-auto rounded-lg bg-mist-50 p-4;
}

.bubble {
  @apply max-w-[75%] rounded-2xl px-4 py-2 wrap-break-word;
}

.bubble-me {
  @apply self-end rounded-br-sm bg-accent text-white;
}

.bubble-them {
  @apply self-start rounded-bl-sm bg-accent-2 text-mist-900;
}
```
- `.chat-window`: a fixed height (`h-96`) with `overflow-y-auto` makes the window scroll internally instead of growing the page. `flex flex-col gap-2` stacks the bubbles with even spacing.
- `self-end` / `self-start`: in a flex column, these push one item to the right or left edge. That's what puts your bubbles on the right and theirs on the left.
- `max-w-[75%]`: square brackets are Tailwind's syntax for a custom value. Bubbles never span the full width.
- `wrap-break-word`: a very long word (like a URL) wraps instead of overflowing the bubble.
- `rounded-br-sm` / `rounded-bl-sm`: one less-rounded corner gives each bubble a little "tail" pointing at its sender.
- The colors reuse the site's theme tokens (`accent` = teal, `accent-2` = violet) so the chat matches the rest of the site.

---

## Later, when you add the backend (not part of this change)
- Replace the localStorage load with a `fetch` inside a `useEffect` that runs once on mount (`[]` dependency array), then `setMessages` with the result.
- In `handleSubmit`, `POST` the message to the server instead of saving to localStorage.
- Replies from the other side would arrive over a WebSocket and be appended with `setMessages((prev) => [...prev, reply])`. Use the **function form** of the setter there, because the reply comes in asynchronously and `messages` may be stale by then.
- The intro message would come from the server instead of being hardcoded.

## Verification
1. `npm run dev`
2. **Logged out:** `/chat` shows "Log in to start chatting" and a **Go to login** button that works. No chat window.
3. Log in, then go to `/chat`. You see the left-side bubble "Hi, let's get started."
4. Type `hola` and press **Enter**. A teal bubble appears on the right and the input clears.
5. Type and click **Send**. That works too.
6. Press Enter on an empty input or just spaces. Nothing is added.
7. Send ~15 messages. The window scrolls internally and stays pinned to the newest.
8. Paste a very long word. It wraps inside the bubble.
9. **Reload.** Your messages are still there, below the intro bubble.
10. DevTools → Application → Local Storage: there's a `chatMessages:<your email>` key holding a JSON array.
11. Log out and log in with a **different** email. The chat is fresh (only the intro bubble). Switch back to the first email and the old history returns.

---

# Plan 4: Mock LLM response (hard-coded reply)

## Context
The chat (Plan 3) lets you send messages, but nothing ever answers, so it doesn't feel like a conversation. The real app will send your message to an LLM and show its reply. Before that service exists, we **mock** it: a function shaped exactly like the future LLM call, but it always returns the same canned reply, **"thanks for sharing!"**.

This follows the course's "hard coded responses" pattern:
```js
function getWeather() {
  // This will be replaced with a 3rd party service call
  return { date: '2026-05-20', outlook: 'fair' };
}
const weather = getWeather();
```
The idea is that the rest of the app calls `getWeather()` and uses what comes back without knowing or caring that it's fake. Later you only rewrite the **inside** of that one function, and nothing else has to change.

File changed: `src/chat/chat.jsx` (only).

---

## Key ideas in this change

1. **Mocking / stubbing.** A stub is a placeholder that returns realistic fake data. It lets you build and test the UI flow now, and it marks *exactly one place* where the real service plugs in later.
2. **Design the return value to match the real thing.** The mock returns a full message object, `{ id, from, text }`, the same shape as every other message in the chat. Because of that, the reply can go straight into the `messages` array and be rendered, saved and reloaded with zero special-casing.
3. **Design the parameters to match the real thing too.** The real LLM call will need to know what you said, so the mock takes `message` as an argument even though it ignores it for now. Your editor flags it as "declared but never read". That's expected and harmless. It's a reminder that the parameter is waiting for the real implementation.
4. **Adding two items to an array at once.** `[...messages, myMessage, reply]` copies the old array and appends both new items in one step, so there's one state update and one re-render.

---

## Step 1: Add the mock function

In `src/chat/chat.jsx`, right below `introMessage` (outside any component):

```jsx
function getChatResponse(message) {
  // This will be replaced with a call to the LLM service
  return { id: crypto.randomUUID(), from: 'them', text: 'thanks for sharing!' };
}
```
- **Outside the component:** it doesn't use any React state or props, so it doesn't belong inside `ChatWindow`. Keeping it at the top of the file also makes it easy to find when you replace it.
- **`from: 'them'`** makes it render as a left-side violet bubble, the same as the intro message.
- **New `id` every call:** each reply is a separate message, so each needs its own unique `key`. If it returned a fixed id like `'reply'`, React would warn about duplicate keys after the second reply.
- **The comment** follows the template: it tells future-you (and graders) that this is intentionally fake.

---

## Step 2: Call it when the user sends a message

In `ChatWindow`'s `handleSubmit`, replace:
```jsx
const newMessages = [...messages, { id: crypto.randomUUID(), from: 'me', text }];
```
with:
```jsx
const myMessage = { id: crypto.randomUUID(), from: 'me', text };
const reply = getChatResponse(text);

const newMessages = [...messages, myMessage, reply];
```
The full function now reads:
```jsx
function handleSubmit(e) {
  e.preventDefault();
  const text = draft.trim();
  if (!text) return;

  const myMessage = { id: crypto.randomUUID(), from: 'me', text };
  const reply = getChatResponse(text);

  const newMessages = [...messages, myMessage, reply];
  setMessages(newMessages);
  localStorage.setItem(storageKey, JSON.stringify(newMessages));
  setDraft('');
}
```
- Pulling `myMessage` into its own variable makes the line that builds `newMessages` read like a sentence: "the old messages, then mine, then the reply."
- The order in the array matters: `myMessage` before `reply` means your bubble appears first, then the response under it.
- **The replies get saved too.** Because `reply` is in `newMessages`, it's stored in localStorage with everything else, so after a reload the whole back-and-forth is still there.
- Nothing else changes. `.map()` already renders any `from: 'them'` message as a left bubble, and the `useEffect` already scrolls to the bottom whenever `messages` changes. This is the payoff of matching the data shape (idea #2).

---

## Later, when the real LLM service exists (not part of this change)
A real LLM call goes over the network, so it's **asynchronous**: you have to wait for the answer. The change would look like this:
```jsx
async function getChatResponse(message) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  const data = await response.json();
  return { id: crypto.randomUUID(), from: 'them', text: data.text };
}
```
And in `handleSubmit`:
1. Make it `async function handleSubmit(e)`.
2. Show your own bubble **immediately**: `setMessages((prev) => [...prev, myMessage])`.
3. Then `const reply = await getChatResponse(text);` and append it with `setMessages((prev) => [...prev, reply])`.
4. Use the **function form** `(prev) => ...` of the setter, because by the time the reply arrives, `messages` from this render is out of date.
5. Optional: a "typing..." bubble while waiting, and a `try/catch` that shows an error bubble if the request fails.

If you want the mock to *feel* more realistic before then, you can fake the wait with `setTimeout`. That has the same async shape as the real call, so it's good practice for the steps above.

## Verification
1. `npm run dev`, log in, go to `/chat`.
2. Send `hola`. Your teal bubble appears on the right, and directly below it a violet **"thanks for sharing!"** bubble on the left.
3. Send a few more. Every message gets exactly one reply, in order, and the window stays scrolled to the bottom.
4. Press Enter on an empty input. No message and **no** reply. The `if (!text) return;` runs before `getChatResponse` is ever called.
5. Reload. The full back-and-forth is still there.
6. DevTools → Application → Local Storage → `chatMessages:<your email>`: the array alternates `"from":"me"` and `"from":"them"` entries.
7. DevTools Console: no "two children with the same key" warnings, which confirms each reply gets its own id.
8. Note: messages you sent **before** this change have no replies in the saved history. That's expected, since they were saved before the mock existed.
