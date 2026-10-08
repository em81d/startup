import React from 'react';

export function Chat() {
  return (
    <main className="page">
      <h2>Chat</h2>

      <section className="card mt-6 max-w-2xl">
        <h3>Ready when you are</h3>
        <p className="mt-2 text-mist-600">
          Picks up right where you left off.
        </p>
        <button className="btn mt-5" type="button">Click to start conversation</button>
      </section>

      <section className="card card-accent mt-6 max-w-2xl">
        <h3>Focus for this conversation</h3>
        <ul className="mt-3 list-inside list-disc space-y-1 text-mist-700">
          <li>Using past tense</li>
          <li>Talking about professions</li>
        </ul>
      </section>
    </main>
  );
}