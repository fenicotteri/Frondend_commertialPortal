import axiosClient from './axiosClient';
import { User, UserLoginData, UserRegistrationData, BusinessRegistrationData, BusinessProfile } from '../types';

// Авторизация
export const loginApi = async (credentials: UserLoginData): Promise<{ accessToken: string }> => {
  const response = await axiosClient.post('/api/users/login', credentials);
  return response.data;
};

// Регистрация обычного пользователя
export const registerUserApi = async (
  userData: UserRegistrationData
): Promise<{ accessToken: string }> => {
  const response = await axiosClient.post('/api/users/client/register', userData);
  return response.data;
};

export const getBusinessById = async (id: number): Promise<BusinessProfile> => {
    const response = await axiosClient.get<BusinessProfile>(`/business-profile/${id}`);
    return response.data;
  };

// Регистрация бизнес-пользователя
export const registerBusinessApi = async (
  data: BusinessRegistrationData
): Promise<{ accessToken: string }> => {
  const response = await axiosClient.post('/api/users/business/register', data);
  return response.data;
};

// Получить текущего пользователя по токену
export const getMeApi = async (): Promise<User> => {
  const response = await axiosClient.get('/api/users/me');
  return response.data;
};