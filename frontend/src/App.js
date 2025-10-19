import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import InfoModal from './components/InfoModal';
import Home from './pages/Home';
import Project from './pages/Project';

function App() {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    // Load Google Fonts
    const link1 = document.createElement('link');
    link1.href = 'https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500&display=swap';
    link1.rel = 'stylesheet';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap';
    link2.rel = 'stylesheet';
    document.head.appendChild(link2);
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Sidebar onInfoClick={() => setIsInfoOpen(true)} />
        <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<Project />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;