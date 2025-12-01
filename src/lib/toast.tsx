import { Alert, type AlertProps } from 'antd'
import type { ReactNode } from 'react'
import { toast } from 'sonner'

type ToastType = 'success' | 'error' | 'info' | 'warning'

export function showAntToast(
  type: ToastType,
  message: string,
  description?: ReactNode,
  alertProps?: Omit<AlertProps, 'type' | 'message' | 'description'>
) {
  toast.custom((t) => (
    <Alert
      message={message}
      description={description}
      type={type}
      showIcon
      closable
      {...alertProps}
    />
  ))
}
