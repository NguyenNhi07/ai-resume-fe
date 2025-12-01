import { Dayjs } from 'dayjs'

export interface ProfileForm {
	firstName?: string
	lastName?: string
	dateOfBirth?: Dayjs | null
	phoneNumber?: string
	gender?: string
}