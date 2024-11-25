import axiosInstance from '@/utils/axiosInstance'
import { notifyError } from '@/services/notification'

export const fetchDatasets = async (quantity : number, topic : string) => {
  try {
    const response = await axiosInstance.get('/datasets', {
      params: {
        quantity,
        topic,
      }
    });

    const datasets = response?.data?.data?.datasets || []
    return datasets.map((item: any) => {
      if (item.avatar) {
        item.avatar = `${item.avatar}`
      }
      return item
    })
  } catch (error) {
    notifyError('Fail to get datasets!')
    console.error('Failed to fetch data:', error)
    return []
  }
}

export const fetchDatasetsDetail = async (id_dataset: number) => {
  try {
    const response = await axiosInstance.get(`/datasets/${id_dataset}`)
    return response.data
  } catch (error) {
    notifyError('Failed to load dataset details!')
    console.error('Failed to load dataset details:', error)
  }
}

export const fetchVersionData = async (
  id_version: number,
) => {
  try {
    const response = await axiosInstance.get(
      `/datasets/version/${id_version}`,
    )
    return response.data
  } catch (error) {
    console.error('Failed to fetch version data:', error)
  }
}

export const updateDatasetView = async (id_dataset: number) => {
  try {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      throw new Error("Access token not found");
    }
    const response = await axiosInstance.post(
      `/datasets/view`,
      {
        id_dataset,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to update dataset view:", error);
    throw error;
  }
};
