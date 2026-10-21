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
