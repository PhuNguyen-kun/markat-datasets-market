import axiosInstance from '@/utils/axiosInstance'
import { notifyError } from '@/services/notification'

export const fetchDatasets = async () => {
  try {
    const response = await axiosInstance.get('/datasets')
    return response.data.items
  } catch (error) {
    notifyError('Fail to get datasets!')
    console.error('Failed to fetch data:', error)
  }
}
