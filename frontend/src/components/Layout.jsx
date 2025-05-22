import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {isAuthenticated && (
        <nav className="bg-gray-800 border-b border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold">
                  SmartPark SIMS
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/spare-parts" className="px-3 py-2 rounded-md hover:bg-gray-700">
                  Spare Parts
                </Link>
                <Link to="/stock-in" className="px-3 py-2 rounded-md hover:bg-gray-700">
                  Stock In
                </Link>
                <Link to="/stock-out" className="px-3 py-2 rounded-md hover:bg-gray-700">
                  Stock Out
                </Link>
                <Link to="/reports" className="px-3 py-2 rounded-md hover:bg-gray-700">
                  Reports
                </Link>
                <div className="px-3 py-2 text-gray-400">
                  Logged in as: <span className="text-gray-200">{user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
