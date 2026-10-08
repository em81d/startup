import React from 'react';
import './input.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Home } from './home/home';
import { Progress } from './progress/progress';
import { Chat } from './chat/chat';

export default function App() {
  return (
    <BrowserRouter>
        <header className="site-header">
        <div className="site-header-inner">
            <NavLink className="site-title" to="/">Chat260</NavLink>
            <nav>
            <ul className="site-nav">
                <li><NavLink className="nav-link" to="/" end>Home</NavLink></li>
                <li><NavLink className="nav-link" to="/login">Login</NavLink></li>
                <li><NavLink className="nav-link" to="/chat">Chat</NavLink></li>
                <li><NavLink className="nav-link" to="/progress">Progress</NavLink></li>
            </ul>
            </nav>
        </div>
        </header>

        <Routes>
            <Route path='/' element={<Home />} exact />
            <Route path='/chat' element={<Chat />} />
            <Route path='/progress' element={<Progress />} />
            <Route path='/login' element={<Login />} />
            <Route path='*' element={<NotFound />} />
        </Routes>


        <footer className="site-footer">
        <div className="site-footer-inner">
            <div className="flex items-center gap-3">
            <img src="/chatlogo.png" alt="Chat260 logo" width="64" height="64" className="rounded-lg" />
            <div>
                <p className="font-medium text-mist-700">Thanks for using Chat260!</p>
                <p>by Emeline MacJanet</p>
            </div>
            </div>
            <a href="https://github.com/em81d/startup">GitHub</a>
        </div>
        </footer>
    
    
    </BrowserRouter>
  );
}


function NotFound() {
  return <main className="">404: Return to sender. Address unknown.</main>;
}