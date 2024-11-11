import axiosInstance from '@/utils/axiosInstance'

export const fetchYourWorkData = async (id_user: number) => {
  try {
    const response = await axiosInstance.get('/yourwork', {
      params: {
        id_user,
      },
    })
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error('Failed to fetch your work data:', error)
    throw error
  }
}

export const fetchYourCollectionData = async (id_user: number) => {
  try {
    const response = await axiosInstance.get('/collections', {
      params: id_user,
    })
    return response.data
  } catch (error) {
    console.error('Failed to fetch your collection data:', error)
  }
}

export const fetchYourWorkDetailData = async (
  id_user: number,
  id_dataset: number,
) => {
  try {
    const response = await axiosInstance.get('/yourwork/yourwork_detail', {
      params: { id_user, id_dataset },
    })
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error('Failed to fetch your work detail data:', error)
    throw error
  }
}
