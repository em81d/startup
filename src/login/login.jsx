import React from 'react';

export function Login({ userEmail, onLogin, onLogout }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [displayError, setDisplayError] = React.useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (e.nativeEvent.submitter?.value === 'signup') {
      createUser();
    } else {
      loginUser();
    }
  }

  async function loginUser() {
    await loginOrCreate('/api/auth/login');
  }

  async function createUser() {
    await loginOrCreate('/api/auth/create');
  }

  async function loginOrCreate(endpoint) {
    setDisplayError('');
    const response = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify({ email: email, password: password }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response.ok) {
      onLogin(email, name.trim());
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
    setPassword('');
  }

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

  return (
    <main className="page flex flex-col items-center justify-center">
      <h2 className="text-center">Login</h2>

      {displayError && <p className="text-red-600 text-sm">{displayError}</p>}

      <section className="card mt-6 w-full max-w-sm">
        <form className="space-y-4" onSubmit={handleSubmit}>
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
          <div>
            <label className="field-label" htmlFor="email">Email</label>
            <input
              className="field-input"
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="field-label" htmlFor="password">Password</label>
            <input
              className="field-input"
              type="password"
              id="password"
              name="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
            />
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button className="btn" type="submit" value="login">Login</button>
            <button className="btn-secondary" type="submit" value="signup">Sign Up</button>
          </div>
        </form>
      </section>
    </main>
  );
}
