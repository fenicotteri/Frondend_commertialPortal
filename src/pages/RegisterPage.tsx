import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRegistrationData, BusinessRegistrationData } from '../types/index';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerRegularUser, registerBusinessUser } = useAuth();

  const [accountType, setAccountType] = useState<'client' | 'business'>('client');

  const [userData, setUserData] = useState<UserRegistrationData>({
    email: '',
    password: '',
    userName: '',
    firstName: '',
    lastName: '',
    userType: 'Client'
  });

  const [businessData, setBusinessData] = useState<{ companyName: string }>({
    companyName: '',
  });

  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (accountType === 'client') {
        await registerRegularUser(userData);
      } else {
        const registrationData: BusinessRegistrationData = {
          email: userData.email,
          password: userData.password,
          userName: userData.userName,
          userType: 'Business',
          companyName: businessData.companyName,
        };
        await registerBusinessUser(registrationData);
      }

      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleBusinessDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusinessData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Register</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => setAccountType('client')}
              className={`px-4 py-2 rounded-md ${accountType === 'client' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              Regular User
            </button>
            <button
              type="button"
              onClick={() => setAccountType('business')}
              className={`px-4 py-2 rounded-md ${accountType === 'business' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              Business Account
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">User Information</h2>

            <div>
              <label htmlFor="userName" className="label">Username</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={userData.userName}
                onChange={handleUserDataChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="firstName" className="label">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={userData.firstName}
                onChange={handleUserDataChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="lastName" className="label">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={userData.lastName}
                onChange={handleUserDataChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleUserDataChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={userData.password}
                onChange={handleUserDataChange}
                className="input"
                required
                minLength={6}
              />
            </div>
          </div>

          {accountType === 'business' && (
            <div className="space-y-6 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Business Information</h2>

              <div>
                <label htmlFor="companyName" className="label">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={businessData.companyName}
                  onChange={handleBusinessDataChange}
                  className="input"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
