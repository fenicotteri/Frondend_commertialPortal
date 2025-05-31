// src/api/postApi.ts
import axiosClient from './axiosClient';
import { BusinessProfile, Post, BusinessBranch } from '../types/index';

export const getPostById = async (id: number): Promise<Post> => {
  const response = await axiosClient.get<Post>(`/api/post/${id}`);
  return response.data;
};

export const getBusinessById = async (id: number): Promise<BusinessProfile> => {
  const response = await axiosClient.get<BusinessProfile>(`/api/business/${id}`);
  return response.data;
};

export const getBusinessesApi = async (): Promise<BusinessProfile[]> => {
    const response = await axiosClient.get<BusinessProfile[]>('/api/business');
    return response.data;
  };

export const getPostsApi = async (): Promise<Post[]> => {
    const response = await axiosClient.get<Post[]>('/api/Post');
    return response.data;
  };

  export const getBranchesApi = async (): Promise<BusinessBranch[]> => {
    const response = await axiosClient.get<BusinessBranch[]>('/api/branch');
    return response.data;
  };

  export const registerPromoCopy = async (id: number) => {
    const response = await axiosClient.post(`/api/Analitics/${id}/promo-copy`);
    return response.data;
  };

  export const getBranchesByBusinessId = async (businessId: number): Promise<BusinessBranch[]> => {
    const response = await axiosClient.get<BusinessBranch[]>(`/api/business/${businessId}/branches`);
    return response.data;
  };
