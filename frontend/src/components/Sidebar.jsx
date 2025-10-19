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
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-6 left-6 z-50 text-charcoal"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Sidebar */}
      <aside
        className={
          `fixed left-0 top-0 h-screen w-64 bg-white overflow-y-auto z-40 transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`
        }
      >
        <div className="p-8">
          <Link to="/" className="block mb-12" onClick={handleProjectClick}>
            <h1 className="text-xl font-normal tracking-wide uppercase">
              Your Name
            </h1>
          </Link>

          <nav className="space-y-3">
            {mockProjects.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                onClick={handleProjectClick}
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

          {/* Information moved to bottom */}
          <div className="mt-16">
            <button
              onClick={handleInfoClick}
              className="block text-sm font-normal tracking-wide opacity-50 hover:opacity-100 transition-opacity duration-200 text-left"
            >
              INFORMATION
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;