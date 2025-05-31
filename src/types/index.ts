// src/types/models.ts

// Типы постов
export type PostType = 'event' | 'promotion' | 'discount';

// Тип скидки
export interface DiscountInfo {
  id: number;
  percentage?: number;
  amount?: number;
  code?: string;
}

// Связь между постом и филиалом
export interface PostBusinessBranch {
  postId: number;
  businessBranchId: number;
}

// Филиал бизнеса
export interface BusinessBranch {
  id: number;
  businessProfileId: number;
  description: string;
  location: string;
  postBranches: PostBusinessBranch[];
  imageUrl: string;
}

// Пост (событие / акция / скидка)
export interface Post {
  id: number;
  title: string;
  content: string;
  type: PostType;
  imageUrl?: string;
  startDate: string; // ISO строка
  endDate?: string;
  createdAt?: string;
  location: string,
  businessId: number;
  discount?: DiscountInfo;
  postBranches: PostBusinessBranch[];
}

// Бизнес-профиль пользователя
export interface BusinessProfile {
  id: number;
  userId: string;
  companyName: string;
  branches: BusinessBranch[];
  posts: Post[];
  logo?: string;
  description?: string,
  contactInfo: {
    email?: string;
    phone?: string;
    website?: string;
  };
}

// Подписка клиента на бизнес
export interface ClientSubscription {
  id: number;
  clientProfileId: string;
  businessProfileId: string;
  businessProfile: BusinessProfile;
}

// Клиентский профиль пользователя
export interface ClientProfile {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  favouritePosts: Post[];
  subscriptions: ClientSubscription[];
}

// Новый тип пользователя
export interface User {
  id: string;
  email: string;
  userName: string;
  userType?: 'Client' | 'Business'; // твой enum UserType
  businessProfile?: BusinessProfile;
  clientProfile?: ClientProfile;
  profileId: number
}

// Тип авторизационного состояния
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isBusinessOwner: boolean;
  ownedBusinessId?: number;
}

// DTO для логина
export interface UserLoginData {
  email: string;
  password: string;
}

// DTO для регистрации пользователя
export interface UserRegistrationData {
  email: string;
  userName: string;
  password: string;
  userType: 'Client';
  firstName: string;
  lastName: string;
}

// DTO для регистрации бизнеса
export interface BusinessRegistrationData {
  email: string;
  userName: string;
  password: string;
  userType: 'Business';
  companyName: string;
}
