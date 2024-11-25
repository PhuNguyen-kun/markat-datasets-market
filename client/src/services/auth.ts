import axiosInstance from '@/utils/axiosInstance'
import type { LoginPayload } from '@/types/auth.d.ts'


const isTokenExpired = (token: string): boolean => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Invalid token format:", error);
    return true;
  }
};

const login = (payload: LoginPayload) => {
  return axiosInstance.post('/auth/login', payload)
}

const logout = () => {
  localStorage.removeItem('access_token');
}

export {
  isTokenExpired,
  login,
  logout
};
