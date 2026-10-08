import React from 'react';
import { NavLink } from 'react-router-dom';


export function Home() {
  return (
    <>
    <div className="scroll-bg" aria-hidden="true">
      <div className="blob" id="blob-1"></div>
      <div className="blob" id="blob-2"></div>
      <div className="blob" id="blob-3"></div>
    </div>

    <main className="page">
      <h2 className="mx-auto max-w-xl font-script font-normal mt-10 leading-relaxed">Learn a language by actually talking</h2>

      <div className="mx-auto mt-8 max-w-xl space-y-6 text-lg leading-relaxed">
        <p>
          We learn languages best by chatting with real speakers &mdash; not
          textbooks, not repetitive multiple choice questions. Those
          conversations are hard to find, so let's create them.
        </p>
        <p>
          Chat260 helps you learn a new language through dynamic practice and
          conversation. Chat with a personalized bot that introduces new words in
          your target language, stores your progress, and gives you tasks at the
          right difficulty. Review the vocabulary you have learned and answer
          short reading comprehension questions that match where you are in the
          process.
        </p>
        <p>
          No need to study, no need to stress, just chat :)
        </p>
      </div>

      <div className="mx-auto mt-8 flex max-w-xl flex-wrap gap-3">
        <NavLink className="btn" to="/chat">Start chatting</NavLink>
        <NavLink className="btn-secondary" to="/progress">See your progress</NavLink>
      </div>


      <h2 className="mx-auto mt-14 max-w-xl font-script font-normal">The Method</h2>

      <div className="mx-auto mt-8 max-w-xl space-y-6 text-lg leading-relaxed">
        <p>
          Each user starts off with a clean slate: a brand-new conversation partner 
          who speaks the language you want to learn. For each practice session, you 
          start a conversation and your AI-powered chat partner suggests a topic, brings 
          up new vocabulary, and teaches you concepts.
        </p>
        <p>
          The best part? It keeps track of your progress, and can evaluate you in realtime. 
          That way, you don't have to figure out where you left off every time, and you can 
          trust that the lesson structure is being pulled from a real curriculum adapted to you. 
        </p>
        <p>
          You can spend more time on concepts you're just not getting, and when you're on a roll
           you won't be held back by a system that can't match your pace.
        </p>
      </div>

      <h2 className="mx-auto mt-14 max-w-xl font-script font-normal">The Research</h2>

      <div className="mx-auto mt-8 max-w-xl space-y-6 text-lg leading-relaxed">
        <p>
          Conversation is its own skill, not just vocabulary and grammar put
          together. McCarthy and McCarten (2018) describe the strategies
          fluent speakers use without thinking about it: managing turns,
          showing they're listening, and adjusting what they say to the other
          person. They argue that learners only develop these by practising
          real conversation, which is exactly what most study methods leave out.
        </p>
        <p>
          Getting that practice is the hard part. Stewart and File (2007)
          found that early and intermediate learners often struggle with
          simple social conversations because they've had so few chances to
          rehearse them. Their answer was a computer dialogue partner that
          let learners practise without needing another person, and they point
          to research showing that picking up whole phrases in context builds
          fluency. Chat260 takes the same idea further: a conversation partner
          that's always available, adapts to your level, and keeps track of
          what you've learned.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-xl border-t border-mist-200 pt-4 text-sm text-mist-600">
        <h3 className="text-base">References</h3>
        <ul className="mt-2 space-y-2">
          <li>
            McCarthy, M., &amp; McCarten, J. (2018). Now you're talking!
            Practising conversation in second language learning. In C. Jones
            (Ed.), <cite>Practice in second language learning</cite>
            (pp. 7&ndash;29). Cambridge University Press.
            <a href="https://doi.org/10.1017/9781316443118.003">https://doi.org/10.1017/9781316443118.003</a>
          </li>
          <li>
            Stewart, I. A. D., &amp; File, P. (2007). Let's Chat: A
            conversational dialogue system for second language practice.
            <cite>Computer Assisted Language Learning, 20</cite>(2),
            97&ndash;116.
            <a href="https://doi.org/10.1080/09588220701331386">https://doi.org/10.1080/09588220701331386</a>
          </li>
        </ul>
      </div>

    </main>
    </>
  );
}