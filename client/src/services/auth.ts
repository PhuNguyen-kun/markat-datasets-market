import axiosInstance from '@/utils/axiosInstance'
import type { LoginPayload } from '@/types/auth.d.ts'

export const login = (payload: LoginPayload) => {
  return axiosInstance.post('/auth/login', payload)
}

export const logout = () => {
  return axiosInstance.post('/logout')
}
