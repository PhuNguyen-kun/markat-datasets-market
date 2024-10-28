import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import router from '@/router'

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  onStart?: () => void
  onEnd?: () => void
}

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8888',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 5000,
})

axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token')

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    if (config.onStart) {
      config.onStart()
    }

    return config
  },
  error => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as CustomAxiosRequestConfig

    if (config.onEnd) {
      config.onEnd()
    }
    return response
  },
  error => {
    const config = error.config as CustomAxiosRequestConfig

    if (config && config.onEnd) {
      config.onEnd()
    }

    if (error.response && error.response.status === 403) {
      localStorage.removeItem('authToken')
      router.push('/login')
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
