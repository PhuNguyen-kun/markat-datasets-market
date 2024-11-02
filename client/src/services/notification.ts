import { ElNotification } from 'element-plus'

const notifySuccess = (message: string, title = 'Success') => {
  ElNotification({
    title: title,
    message: message,
    type: 'success',
  })
}

const notifyWarning = (message: string, title = 'Warning') => {
  ElNotification({
    title: title,
    message: message,
    type: 'warning',
  })
}

const notifyInfo = (message: string, title = 'Info') => {
  ElNotification({
    title: title,
    message: message,
    type: 'info',
  })
}

const notifyError = (message: string, title = 'Error') => {
  ElNotification({
    title: title,
    message: message,
    type: 'error',
  })
}

export { notifySuccess, notifyWarning, notifyInfo, notifyError }
