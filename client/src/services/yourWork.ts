import axiosInstance from '@/utils/axiosInstance'

export const fetchYourWorkData = async (id_user: number) => {
  try {
    const response = await axiosInstance.get('/yourwork', {
      params: {
        id_user,
      },
    })
    return response.data
  } catch (error) {
    console.error('Failed to fetch your work data:', error)
    throw error
  }
}
