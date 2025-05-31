import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserLoginData, UserRegistrationData, BusinessRegistrationData, AuthState } from '../types/index';
import { loginApi, registerUserApi, registerBusinessApi, getMeApi } from './AuthApi';

interface AuthContextType {
  authState: AuthState;
  login: (credentials: UserLoginData) => Promise<void>;
  logout: () => void;
  registerRegularUser: (userData: UserRegistrationData) => Promise<void>;
  registerBusinessUser: (data: BusinessRegistrationData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isBusinessOwner: false,
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await getMeApi();
          const isBusinessOwner = user.userType === 'Business';

          setAuthState({
            user,
            isAuthenticated: true,
            isBusinessOwner,
            ownedBusinessId: isBusinessOwner ? user.profileId : undefined,
          });
        } catch (error) {
          console.error('Ошибка восстановления сессии', error);
          logout();
        }
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: UserLoginData) => {
    const { accessToken } = await loginApi(credentials);
    localStorage.setItem('token', accessToken);

    const user = await getMeApi();
    const isBusinessOwner = user.userType === 'Business';

    setAuthState({
      user,
      isAuthenticated: true,
      isBusinessOwner,
      ownedBusinessId: isBusinessOwner ? user.profileId : undefined,
    });
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isBusinessOwner: false,
    });
    localStorage.removeItem('token');
  };

  const registerRegularUser = async (userData: UserRegistrationData) => {
    const { accessToken } = await registerUserApi(userData);
    localStorage.setItem('token', accessToken);
    const user = await getMeApi();
    setAuthState({
      user,
      isAuthenticated: true,
      isBusinessOwner: false,
    });
  };

  const registerBusinessUser = async (data: BusinessRegistrationData) => {
    const { accessToken } = await registerBusinessApi(data);
    localStorage.setItem('token', accessToken);
    const user = await getMeApi();
    const isBusinessOwner = user.userType === 'Business';
    setAuthState({
      user,
      isAuthenticated: true,
      isBusinessOwner,
      ownedBusinessId: isBusinessOwner ? user.profileId : undefined,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, registerRegularUser, registerBusinessUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
