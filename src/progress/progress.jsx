import React from 'react';

export function Progress({ userEmail, userName }) {
  if (!userEmail) {
    return (
      <main className="page">
        <h2>Progress</h2>
        <section className="card mt-6">
          <h3>Log in to see your progress</h3>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <h2>hi, {userName || 'there'}.</h2>
      <h3>Here's your progress.</h3>

      <ProgressTables />
    </main>
  );
}

function ProgressTables() {
  const [progress, setProgress] = React.useState(null);
  const [error, setError] = React.useState('');

  // Load this user's progress from the service when the page opens
  React.useEffect(() => {
    fetch('/api/progress')
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json();
      })
      .then(setProgress)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <p className="mt-6 text-mist-600">Couldn't load your progress: {error}</p>;
  }
  if (!progress) {
    return <p className="mt-6 text-mist-600">Loading...</p>;
  }

  return (
    <>
      <VocabTable title="Words you know" words={progress.known} />
      <VocabTable title="Words you are learning" words={progress.learning} open />
      <VocabTable title="Future vocab" words={progress.future} />
    </>
  );
}

function VocabTable({ title, words, open }) {
  return (
    <details className="card collapsible mt-6" open={open}>
      <summary className="collapsible-summary"><h3>{title}</h3></summary>
      <div className="table-scroll mt-4">
        <table className="vocab-table">
          <thead>
            <tr>
              <th>Spanish</th>
              <th>English</th>
            </tr>
          </thead>
          <tbody>
            {words.map((word) => (
              <tr key={word.spanish}>
                <td>{word.spanish}</td>
                <td>{word.english}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
