import { showAntToast } from '@/lib/toast'
import type { AlertProps } from 'antd'
import type { ReactNode } from 'react'
import { toast } from 'sonner'

type ToastOptions = {
	description?: string | ReactNode
	duration?: number
	position?:
		| 'top-left'
		| 'top-center'
		| 'top-right'
		| 'bottom-left'
		| 'bottom-center'
		| 'bottom-right'
	dismissible?: boolean
	action?: {
		label: string
		onClick: () => void
	}
	alertProps?: Omit<AlertProps, 'type' | 'message' | 'description'>
}

type CustomToast = {
	success: (message: string, options?: ToastOptions) => void
	error: (message: string, options?: ToastOptions) => void
	info: (message: string, options?: ToastOptions) => void
	warning: (message: string, options?: ToastOptions) => void
	loading: (
		message: string,
		options?: Omit<ToastOptions, 'description'>
	) => void
	promise: typeof toast.promise
	custom: typeof toast.custom
	dismiss: typeof toast.dismiss
}

export function useToast(): CustomToast {
	return {
		success: (message, options) =>
			showAntToast(
				'success',
				message,
				options?.description,
				options?.alertProps
			),
		error: (message, options) =>
			showAntToast('error', message, options?.description, options?.alertProps),
		info: (message, options) =>
			showAntToast('info', message, options?.description, options?.alertProps),
		warning: (message, options) =>
			showAntToast(
				'warning',
				message,
				options?.description,
				options?.alertProps
			),
		loading: (message, options) => toast.loading(message, options),
		promise: toast.promise,
		custom: toast.custom,
		dismiss: toast.dismiss,
	}
}
