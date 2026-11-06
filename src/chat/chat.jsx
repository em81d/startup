import React from 'react';
import { NavLink } from 'react-router-dom';

const introMessage = { id: 'intro', from: 'them', text: "Hi, let's get started." };

export function Chat({ userEmail }) {
  return (
    <main className="page">
      <h2>Chat</h2>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        {userEmail ? (
          <ChatWindow />
        ) : (
          <section className="card min-w-0 flex-1">
            <h3>Log in to start chatting</h3>
            <p className="mt-2 text-mist-600">
              Your conversation picks up right where you left off.
            </p>
            <NavLink className="btn mt-5" to="/login">Go to login</NavLink>
          </section>
        )}

        <section className="card card-accent lg:w-72 lg:shrink-0">
          <h3>Focus for this conversation</h3>
          <ul className="mt-3 list-inside list-disc space-y-1 text-mist-700">
            <li>Using past tense</li>
            <li>Talking about professions</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

function ChatWindow() {
  const [messages, setMessages] = React.useState([]);
  const [loadError, setLoadError] = React.useState('');
  const [sendError, setSendError] = React.useState('');
  const [draft, setDraft] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const scrollRef = React.useRef(null);

  // Load this user's chat history from the service when the page opens
  React.useEffect(() => {
    fetch('/api/chat')
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json();
      })
      .then(setMessages)
      .catch((err) => setLoadError(err.message));
  }, []);

  // Keep the newest message in view
  React.useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, sending]);

  async function handleSubmit(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;

    setSendError('');
    setSending(true);
    try {
      // The service saves the message and returns [myMessage, reply]
      const res = await fetch('/api/chat', {
        method: 'post',
        body: JSON.stringify({ text: text }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.msg || `Request failed (${res.status})`);
      }

      const newMessages = await res.json();
      setMessages((prev) => [...prev, ...newMessages]);
      setDraft('');
    } catch (err) {
      setSendError(`Couldn't send your message: ${err.message}`);
    } finally {
      setSending(false);
    }
  }

  const allMessages = [introMessage, ...messages];

  return (
    <section className="card min-w-0 flex-1">
      <div className="chat-window" ref={scrollRef}>
        {allMessages.map((message) => (
          <div key={message.id} className={message.from === 'me' ? 'bubble bubble-me' : 'bubble bubble-them'}>
            {message.text}
          </div>
        ))}
        {sending && <div className="bubble bubble-them text-mist-500">...</div>}
        {loadError && <p className="text-sm text-red-600">Couldn't load your messages: {loadError}</p>}
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
        <button className="btn" type="submit" disabled={sending}>
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
      {sendError && <p className="mt-2 text-sm text-red-600">{sendError}</p>}
    </section>
  );
}
