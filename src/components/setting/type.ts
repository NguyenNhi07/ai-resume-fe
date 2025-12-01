import { Dayjs } from 'dayjs'

export interface ProfileForm {
	name?: string
	dateOfBirth?: Dayjs | null
	phoneNumber?: string
	gender?: string
	email?: string
	profession?: string
}

export interface ChangePasswordForm {
	oldPassword?: string
	newPassword?: string
}