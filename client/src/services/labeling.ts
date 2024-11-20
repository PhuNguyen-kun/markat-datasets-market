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

export const fetchLabelingDetailData = async (
  id_user: number,
  id_part: number,
) => {
  try {
    const response = await axiosInstance.get('/labeling/datas', {
      params: {
        id_user,
        id_part,
      },
    })
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error('Failed to fetch labeling detail data', error)
  }
}

export const updateLabel = async (
  id_data: string,
  id_labeler: string,
  label: string,
) => {
  try {
    const response = await axiosInstance.patch('/labeling/label', {
      id_data,
      id_labeler,
      label,
    })
    return response.data
  } catch (error) {
    console.error('Failed to update label', error)
    throw error
  }
}
