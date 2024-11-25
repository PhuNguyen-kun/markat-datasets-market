import axiosInstance from '@/utils/axiosInstance'
import { notifyError } from '@/services/notification'

const fetchKat = async (
    id_user : number,
) => {
  try {
    const response = await axiosInstance.get(
        `/users/kat`, {
            params: {
              id_user
          }
      }
    )
    return response.data.data
  } catch (error) {
    console.error('Failed to fetch version data:', error)
  }
}

export {
    fetchKat
};