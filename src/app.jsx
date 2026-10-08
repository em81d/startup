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
        <header class="site-header">
        <div class="site-header-inner">
            <a class="site-title" href="index.html">Chat260</a>
            <nav>
            <ul class="site-nav">
                <li><a class="nav-link nav-link-active" href="index.html">Home</a></li>
                <li><a class="nav-link" href="login.html">Login</a></li>
                <li><a class="nav-link" href="chat.html">Chat</a></li>
                <li><a class="nav-link" href="progress.html">Progress</a></li>
            </ul>
            </nav>
        </div>
        </header>

        <main>App components go here</main>


        <footer class="site-footer">
        <div class="site-footer-inner">
            <div class="flex items-center gap-3">
            <img src="chatlogo.png" alt="Chat260 logo" width="64" height="64" class="rounded-lg" />
            <div>
                <p class="font-medium text-mist-700">Thanks for using Chat260!</p>
                <p>by Emeline MacJanet</p>
            </div>
            </div>
            <a href="https://github.com/em81d/startup">GitHub</a>
        </div>
        </footer>
    
    
    </BrowserRouter>
  );
}