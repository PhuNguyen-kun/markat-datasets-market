import axiosInstance from '@/utils/axiosInstance'

export const fetchLabelingData = async (
  id_user: number,
  id_version: number,
) => {
  try {
    const response = await axiosInstance.get('/labeling', {
      params: {
        id_user,
        id_version,
      },
    })
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error('Failed to fetch labeling data:', error)
  }
}
