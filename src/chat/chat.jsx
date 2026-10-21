import React from 'react';
import { NavLink } from 'react-router-dom';

const introMessage = { id: 'intro', from: 'them', text: "Hi, let's get started." };

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

function ChatWindow({ userEmail }) {
  const storageKey = `chatMessages:${userEmail}`;
  const [messages, setMessages] = React.useState(() => JSON.parse(localStorage.getItem(storageKey) || '[]'));
  const [draft, setDraft] = React.useState('');
  const scrollRef = React.useRef(null);

  // Keep the newest message in view
  React.useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  function handleSubmit(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const newMessages = [...messages, { id: crypto.randomUUID(), from: 'me', text }];
    setMessages(newMessages);
    localStorage.setItem(storageKey, JSON.stringify(newMessages));
    setDraft('');
  }

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
