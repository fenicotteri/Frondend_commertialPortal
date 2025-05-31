import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { authState, logout } = useAuth();
  const { isAuthenticated, isBusinessOwner, user, ownedBusinessId } = authState;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Коммер
            </Link>
          </div>
          
          <nav className="flex space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">
              Главная страница
            </Link>
            <Link to="/businesses" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">
              Бизнесы
            </Link>
            
            {isAuthenticated && !isBusinessOwner && (
              <>
                <Link to="/favorites" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">
                  Любимое
                </Link>
              </>
            )}
            
            {isAuthenticated && isBusinessOwner && (
              <>
                <Link to={`/business/${ownedBusinessId}`} className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">
                  Мой профиль
                </Link>
                 <Link to="/analitics" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">
              Аналитика
            </Link>
              </>
            )}
          </nav>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Привет, {user?.userName}
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-gray-700 hover:text-blue-600"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">
                  Войти
                </Link>
                <Link to="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md font-medium">
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;