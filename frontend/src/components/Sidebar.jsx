import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { mockProjects } from '../mock';

const Sidebar = ({ onInfoClick }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto z-10">
      <div className="p-8">
        <Link to="/" className="block mb-12">
          <h1 className="text-xl font-normal tracking-wide uppercase">
            Your Name
          </h1>
        </Link>

        <nav className="space-y-3">
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

          <div className="pt-8 space-y-3 border-t border-gray-200 mt-8">
            <button
              onClick={onInfoClick}
              className="block text-sm font-normal tracking-wide opacity-50 hover:opacity-100 transition-opacity duration-200 text-left"
            >
              INFORMATION
            </button>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm font-normal tracking-wide opacity-50 hover:opacity-100 transition-opacity duration-200"
            >
              INSTAGRAM
            </a>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;