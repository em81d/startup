import React from 'react';

export function Login() {
  return (
    <main className="page flex flex-col items-center justify-center">
      <h2 className="text-center">Login</h2>

      <section className="card mt-6 w-full max-w-sm">
        <form className="space-y-4">
          <div>
            <label className="field-label" for="email">Email</label>
            <input className="field-input" type="email" id="email" name="email" placeholder="your@email.com" />
          </div>
          <div>
            <label className="field-label" for="password">Password</label>
            <input className="field-input" type="password" id="password" name="password" placeholder="password" />
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button className="btn" type="submit">Login</button>
            <button className="btn-secondary" type="submit">Sign Up</button>
          </div>
        </form>
      </section>
    </main>
  );
}