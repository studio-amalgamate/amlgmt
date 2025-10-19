import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { mockProjects } from '../mock';

const Sidebar = ({ onInfoClick, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation();

  const handleProjectClick = () => {
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleInfoClick = () => {
    onInfoClick();
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 bg-white">
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
          <h1 className="text-xl font-normal tracking-wide uppercase">
            Your Name
          </h1>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-charcoal"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-64 bg-white overflow-y-auto z-40">
        <div className="p-8 h-full flex flex-col">
          <Link to="/" className="block mb-12">
            <h1 className="text-xl font-normal tracking-wide uppercase">
              Your Name
            </h1>
          </Link>

          <nav className="space-y-3 flex-grow">
            {mockProjects.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                className={
                  `block text-sm font-normal tracking-wide transition-opacity duration-200 ${
                    location.pathname === `/project/${project.id}`
                      ? 'opacity-100'
                      : 'opacity-50 hover:opacity-100'
                  }`
                }
              >
                {project.title.toUpperCase()}
              </Link>
            ))}
          </nav>

          {/* Information at the absolute bottom */}
          <div className="pt-8 mt-auto">
            <button
              onClick={handleInfoClick}
              className="block text-sm font-normal tracking-wide opacity-50 hover:opacity-100 transition-opacity duration-200 text-left"
            >
              INFORMATION
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu - Full Screen White Popup */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 flex flex-col"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            transition: 'background-color 0.5s ease'
          }}
        >
          <div className="flex items-center justify-between p-6">
            <h1 className="text-xl font-normal tracking-wide uppercase">
              Your Name
            </h1>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-charcoal hover:opacity-70 transition-opacity"
              aria-label="Close"
            >
              <X size={32} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex-grow flex flex-col justify-between px-8 py-8 overflow-y-auto">
            <div className="flex-grow flex items-center">
              <nav className="space-y-5 text-charcoal w-full">
                {mockProjects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/project/${project.id}`}
                    onClick={handleProjectClick}
                    className={
                      `block text-lg font-normal tracking-wide transition-opacity duration-200 ${
                        location.pathname === `/project/${project.id}`
                          ? 'opacity-100'
                          : 'opacity-50 hover:opacity-100'
                      }`
                    }
                  >
                    {project.title.toUpperCase()}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-8 mt-8">
              <button
                onClick={handleInfoClick}
                className="block text-lg font-normal tracking-wide opacity-50 hover:opacity-100 transition-opacity duration-200 text-left"
              >
                INFORMATION
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;