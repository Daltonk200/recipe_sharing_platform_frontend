import { Link } from 'react-router-dom';
import type { User } from '../api/auth';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Recipe Share
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Recipes
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/create-recipe" 
                  className="btn-primary"
                >
                  Create Recipe
                </Link>
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <span className="text-lg">👤</span>
                    <span>{user.username}</span>
                  </Link>
                  <button
                    onClick={onLogout}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
