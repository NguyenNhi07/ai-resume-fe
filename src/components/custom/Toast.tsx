'use client'

import { AlertCircle, Info, X } from 'lucide-react'
import React, { createContext, useContext, useState } from 'react'
import { CheckCircleIcon } from './../icons/CheckCircleIcon'
import { CloseCircleIcon } from './../icons/CloseCircleIcon'

type ToastVariant = 'success' | 'info' | 'error' | 'warning'

type ToastParams = {
	title: string
	message: string | React.ReactNode
	variant?: ToastVariant
	hiddenTime?: number
}

type ToastContextType = {
	toast: (params: ToastParams) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false)
	const [title, setTitle] = useState('')
	const [message, setMessage] = useState<string | React.ReactNode>('')
	const [variant, setVariant] = useState<ToastVariant>('success')
	const [hiddenTime, setHiddenTime] = useState(5000)

	const toast = ({
		title,
		message,
		variant = 'success',
		hiddenTime = 5000,
	}: ToastParams) => {
		setTitle(title)
		setMessage(message)
		setVariant(variant)
		setHiddenTime(hiddenTime)
		setOpen(true)
	}

	const handleClose = () => setOpen(false)

	React.useEffect(() => {
		if (open && hiddenTime > 0) {
			const timer = setTimeout(() => {
				setOpen(false)
			}, hiddenTime)
			return () => clearTimeout(timer)
		}
	}, [open, hiddenTime])

	const getToastStyles = (variant: ToastVariant) => {
		switch (variant) {
			case 'success':
				return {
					bgColor: 'bg-[#F6FFED]',
					iconColor: 'text-[#52C41A]',
					borderColor: 'border-[#B7EB8F]',
					icon: <CheckCircleIcon />,
				}
			case 'info':
				return {
					bgColor: 'bg-[#E6F7FF]',
					iconColor: 'text-[#1890FF]',
					borderColor: 'border-[#91D5FF]',
					icon: <Info className="h-6 w-6" />,
				}
			case 'error':
				return {
					bgColor: 'bg-[#FFF1F0]',
					iconColor: 'text-[#FF4D4F]',
					borderColor: 'border-[#FFCCC7]',
					icon: <CloseCircleIcon />,
				}
			case 'warning':
				return {
					bgColor: 'bg-[#FFFBE6]',
					iconColor: 'text-[#FAAD14]',
					borderColor: 'border-[#FFE58F]',
					icon: <AlertCircle className="h-6 w-6" />,
				}
		}
	}

	const toastStyles = getToastStyles(variant)

	return (
		<ToastContext.Provider value={{ toast }}>
			{children}
			{
				<div
					className={`
			fixed top-5 right-5 z-9999 max-w-md transition-all duration-300 ease-out transform
			${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
		`}
				>
					<div
						className={`rounded-lg shadow-md ${toastStyles.bgColor} ${toastStyles.borderColor} border-[1px] overflow-hidden`}
					>
						<div className="flex items-center p-4 justify-center">
							<div className={`mr-3 flex-shrink-0 ${toastStyles.iconColor}`}>
								{toastStyles.icon}
							</div>
							<div className="flex-1">
								<h3 className="font-normal text-base text-[rgba(0,0,0,0.85)]">
									{title}
								</h3>
								{message !== '' && (
									<div className="mt-1 font-normal text-sm text-[rgba(0,0,0,0.85)]">
										{message}
									</div>
								)}
							</div>
							<button
								type="button"
								className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
								onClick={handleClose}
							>
								<X className="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>
			}
		</ToastContext.Provider>
	)
}

export function useToast() {
	const context = useContext(ToastContext)
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider')
	}
	return context
}