import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export function getImageUrl(postId: number, position: number = 1) {
  return `${BASE_URL}/posts/image/${postId}/${position}`;
}

export function getUserProfileImageUrl(userId: number) {
  return `${BASE_URL}/users/image/picture/${userId}`;
}

export function getUserBannerImageUrl(userId: number) {
  return `${BASE_URL}/users/image/banner/${userId}`;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ status: number; data: T }> {
  const url = `${BASE_URL}${endpoint}`;

  const token = await AsyncStorage.getItem('token');
  const headers: HeadersInit = {
    ...(options.headers || {}),
    'Authorization': token ? `Bearer ${token}` : '',
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    console.warn('Token expired. Redirecting to login.');
    await AsyncStorage.removeItem('token');
    router.push('/auth/login');
    throw new Error('Unauthorized. Token expired.');
  }

  const contentType = res.headers.get('Content-Type') || '';
  const body = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    const error = new Error(typeof body === 'string' ? body : body?.error || 'Request failed');
    (error as any).status = res.status;
    (error as any).data = body;
    throw error;
  }

  return {
    status: res.status,
    data: body
  };
}
