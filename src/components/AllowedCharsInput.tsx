'use client'

import { Input, type InputProps } from 'antd'
import type React from 'react'

interface AllowedCharsInputProps extends InputProps {
	allowedPattern: RegExp
	maxLength?: number
}

export const AllowedCharsInput: React.FC<AllowedCharsInputProps> = ({
	allowedPattern,
	maxLength,
	onChange,
	onKeyDown,
	...restProps
}) => {
	const triggerValueChange = (input: HTMLInputElement, newValue: string) => {
		// Gán giá trị DOM
		const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
			window.HTMLInputElement.prototype,
			'value'
		)?.set
		nativeInputValueSetter?.call(input, newValue)

		// Tạo sự kiện input cho React
		const event = new Event('input', { bubbles: true })
		input.dispatchEvent(event)

		// Gọi onChange nếu có (để đồng bộ với Form)
		if (onChange) {
			const syntheticEvent = {
				...event,
				target: input,
				currentTarget: input,
			} as unknown as React.ChangeEvent<HTMLInputElement>
			onChange(syntheticEvent)
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const controlKeys = [
			'Backspace',
			'Delete',
			'ArrowLeft',
			'ArrowRight',
			'ArrowUp',
			'ArrowDown',
			'Tab',
			'Enter',
			'Home',
			'End',
			'PageUp',
			'PageDown',
			'Meta',
			'Control',
			'Alt',
			'Shift',
		]

		if (!controlKeys.includes(e.key) && !allowedPattern.test(e.key)) {
			e.preventDefault()
		}
		onKeyDown?.(e)
	}

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		const pastedText = e.clipboardData.getData('text')
		let filteredText = pastedText
			.split('')
			.filter((char) => allowedPattern.test(char))
			.join('')

		const input = e.target as HTMLInputElement
		const start = input.selectionStart || 0
		const end = input.selectionEnd || 0
		const currentValue = input.value
		const remainingLength =
			(maxLength ?? Infinity) - (currentValue.length - (end - start))

		filteredText = filteredText.slice(0, remainingLength)

		if (filteredText !== pastedText) {
			e.preventDefault()
			const newValue =
				currentValue.slice(0, start) + filteredText + currentValue.slice(end)

			triggerValueChange(input, newValue)
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value
		const filteredValue = rawValue
			.split('')
			.filter((char) => allowedPattern.test(char))
			.join('')

		if (filteredValue !== rawValue) {
			const input = e.target
			triggerValueChange(input, filteredValue)
			return
		}

		onChange?.(e)
	}

	return (
		<Input
			{...restProps}
			maxLength={maxLength}
			onKeyDown={handleKeyDown}
			onPaste={handlePaste}
			onChange={handleChange}
		/>
	)
}
