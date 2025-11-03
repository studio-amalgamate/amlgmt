import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import InfoModal from './components/InfoModal';
import Home from './pages/Home';
import Project from './pages/Project';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import ProjectEditor from './pages/Admin/ProjectEditor';
import Settings from './pages/Admin/Settings';
import { Toaster } from './components/ui/toaster';

function App() {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleBack = () => {
    setIsInfoOpen(false);
    setIsMobileMenuOpen(true);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Sidebar 
                onInfoClick={() => setIsInfoOpen(true)} 
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
              />
              <InfoModal 
                isOpen={isInfoOpen} 
                onClose={() => setIsInfoOpen(false)}
                onBack={window.innerWidth < 1024 ? handleBack : null}
              />
              <Home />
            </>
          } />
          <Route path="/project/:id" element={
            <>
              <Sidebar 
                onInfoClick={() => setIsInfoOpen(true)} 
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
              />
              <InfoModal 
                isOpen={isInfoOpen} 
                onClose={() => setIsInfoOpen(false)}
                onBack={window.innerWidth < 1024 ? handleBack : null}
              />
              <Project />
            </>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/project/:id" element={<ProjectEditor />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;