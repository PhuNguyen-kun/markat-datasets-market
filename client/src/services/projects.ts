import axiosInstance from '@/utils/axiosInstance'
import { notifyError } from '@/services/notification'

export const fetchProjects = async (limit : number, offset : number, topic : string) => {
  try {
    const response = await axiosInstance.get('/projects', {
      params: {
        limit,
        offset,
        topic,
      }
    });

    const projects = response?.data?.data?.projects || []
    return projects.map((item: any) => {
      if (item.avatar) {
        item.avatar = `${item.avatar}`
      }
      return item
    })
  } catch (error) {
    notifyError('Fail to get projects!')
    console.error('Failed to fetch data:', error)
    return []
  }
}