import { AllowedCharsInput } from '@/components/AllowedCharsInput'
import { PhoneInput } from '@/components/PhoneInput'
import EditIcon from '@/components/icons/EditIcon'
import { useUnsavedChanges } from '@/components/setting/context/UnsavedChangesContext'
import type { ProfileForm } from '@/components/setting/type'
import { isValidPhoneNumber } from '@/lib/phone-utils'
import { cn } from '@/lib/utils'
import { userApi } from '@/lib/api'
import { useToast } from '@/hooks/useToast'
import { Button, DatePicker, Form, Radio } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ProfileManagement() {
	const { t } = useTranslation();
	const [isEdit, setIsEdit] = useState(false)
	const [profile, setProfile] = useState<{
		name?: string
		email?: string
		dateOfBirth?: string | null
		phoneNumber?: string
		gender?: string
		profession?: string
	} | null>(null)
	const [profileForm] = Form.useForm<ProfileForm>()
	const [isDirty, setIsDirty] = useState(false)
	const [errorPhone, setErrorPhone] = useState(false)
	const { setHasUnsavedChanges } = useUnsavedChanges()
	const formValues = (Form.useWatch([], profileForm) || {}) as ProfileForm
	const toast = useToast()

	useEffect(() => {
		const loadProfile = async () => {
			try {
				const me = await userApi.me()
				setProfile({
					name: me.fullName,
					email: me.email,
					dateOfBirth: me.dob || null,
					phoneNumber: me.phoneNumber,
					gender: me.gender,
					profession: me.profession,
				})
				profileForm.setFieldsValue({
					name: me.fullName,
					email: me.email,
					dateOfBirth: me.dob ? dayjs(me.dob) : null,
					phoneNumber: me.phoneNumber,
					gender: me.gender,
					profession: me.profession,
				} as any)
				setIsDirty(false)
				setHasUnsavedChanges(false)
			} catch (error) {
				console.error('Failed to load profile', error)
			}
		}
		loadProfile()
	}, [profileForm, setHasUnsavedChanges])

	const validateAge = (_: any, value: any) => {
		if (!value) return Promise.reject(new Error(t('This field is required')))
		if (value.isAfter(dayjs(), 'day')) {
			return Promise.reject(new Error(t('Date can not be in the future')))
		}
		const age = dayjs().diff(value, 'year')
		if (age < 18) {
			return Promise.reject(new Error(t('Age must be at least 18 years')))
		}
		return Promise.resolve()
	}

	const checkDisable = () => {
		if (!isDirty) return true
		const check =
			!formValues.name ||
			!formValues.email
		return check
	}

	return (
		<div
			className={cn(
				'sm:p-6 flex flex-col gap-3 sm:gap-8 h-full',
				isEdit && 'max-sm:!bg-white'
			)}
		>
			<div className="flex justify-between items-center max-sm:border-b-[1px] max-sm:border-[rgba(0,0,0,0.06)] max-sm:px-4 max-sm:py-2">
				<div className="max-sm:flex max-sm:w-full items-center">
					<div className="max-sm:w-full max-sm:text-center">
						<p className="font-medium text-3xl text-black/85 max-sm:text-xl">
							{!isEdit ? t('My Profile') : t('Edit Profile')}
						</p>
						<p className="text-sm text-black/45 max-sm:text-xs max-sm:hidden">
							{!isEdit && t('Manage your profile')}
						</p>
					</div>
				</div>
				{!isEdit && (
					<Button
						type="default"
						onClick={() => {
							setIsEdit(true)
						}}
						className="!text-[#393ce5] !border-[#393ce5]"
						icon={<EditIcon fill={'#393ce5'} />}
					>
						{t('Edit')}
					</Button>
				)}
			</div>
			{!isEdit ? (
				<div className="grid grid-cols-2 text-sm gap-y-[10px] max-sm:h-full max-sm:flex max-sm:flex-col max-sm:p-4 max-sm:rounded-xl max-sm:gap-4">
					<div className="flex flex-col">
						<span className="text-sm text-black/45">
							{t('Name')}
						</span>
						<span className="text-base text-black/85">
							{profile?.name || '-'}
						</span>
					</div>
					<div className="flex flex-col">
						<span className="text-sm text-black/45">{t('Email')}</span>
						<span className="text-base text-black/85">
							{profile?.email || '-'}
						</span>
					</div>
					<div className="flex flex-col">
						<span className="text-sm text-black/45">
							{t('Date of birth')}
						</span>
						<span className="text-base text-black/85">
							{profile?.dateOfBirth
								? dayjs(profile.dateOfBirth).format('DD/MM/YYYY')
								: '-'}
						</span>
					</div>
					<div className="flex flex-col">
						<span className="text-sm text-black/45">{t('Phone number')}</span>
						<span className="text-base text-black/85">
							{profile?.phoneNumber || '-'}
						</span>
					</div>
					<div className="flex flex-col">
						<span className="text-sm text-black/45">{t('Gender')}</span>
						<span className="text-base text-black/85">
							{profile?.gender || '-'}
						</span>
					</div>
					<div className="flex flex-col">
						<span className="text-sm text-black/45">{t('Profession')}</span>
						<span className="text-base text-black/85">
							{profile?.profession || '-'}
						</span>
					</div>
				</div>
			) : (
				<>
					<Form
						name="profile"
						onFinish={() => {
							console.log(123)
						}}
						layout="vertical"
						form={profileForm}
						size="large"
						onValuesChange={() => {
							setIsDirty(true)
							setHasUnsavedChanges(true)
						}}
						className="grid grid-cols-2 text-sm gap-y-[10px] gap-x-10 max-sm:bg-white max-sm:h-full max-sm:flex max-sm:flex-col max-sm:rounded-xl min-h-fit max-sm:!px-4"
					>
						<Form.Item
							name="name"
							label={t('Name')}
							rules={[
								{ required: true, message: t('This field is required') },
								{
									validator: (_, value) => {
										if (!value) return Promise.resolve()
										const hasLetterOrNumber = /[A-Za-z0-9]/.test(value)
										if (!hasLetterOrNumber) {
											return Promise.reject(
												new Error(
													t('Name can not contain only special characters')
												)
											)
										}
										return Promise.resolve()
									},
								},
							]}
						>
							<AllowedCharsInput
								allowedPattern={/^[A-Za-z\s]+$/}
								maxLength={50}
								placeholder={t('Enter your name')}
							/>
						</Form.Item>
						<Form.Item
							name="email"
							label={t('Email')}
							rules={[
								{ required: true, message: t('This field is required') },
								{ type: "email", message: t("Please enter a valid email address") },
							]}
						>
							<AllowedCharsInput
								allowedPattern={/^[A-Za-z0-9@._-]+$/}
								maxLength={50}
								placeholder={t('Enter your email')}
							/>
						</Form.Item>
						<Form.Item
							name="dateOfBirth"
							label={t('Date of birth')}
							rules={[
								{ validator: validateAge },
							]}
						>
							<DatePicker
								format={'DD/MM/YYYY'}
								placeholder={t('Select date')}
								allowClear
								className="w-full"
							/>
						</Form.Item>
						<Form.Item
							name="phoneNumber"
							label={t('Phone number')}
							rules={[
								{
									validator: async (_, value) => {
										if (!value) {
											setErrorPhone(false)
											return Promise.resolve()
										}
										const isValid = isValidPhoneNumber(value)
										if (!isValid) {
											setErrorPhone(true)
											return Promise.reject(
												t(
													'Please enter a valid phone number in the correct format'
												)
											)
										}
										setErrorPhone(false)
										return Promise.resolve()
									},
								},
							]}
						>
							<PhoneInput
								className="flex-1 w-full"
								placeholder={t('Enter your phone number')}
								error={errorPhone}
							/>
						</Form.Item>
						<Form.Item
							name="gender"
							label={t('Gender')}
						>
							<Radio.Group
								className=""
								options={[
									{ value: 'Male', label: t('Male') },
									{ value: 'Female', label: t('Female') },
									{ value: 'Other', label: t('Other') },
								]}
							/>
						</Form.Item>

						<Form.Item
							name="profession"
							label={t('Profession')}
						>
							<AllowedCharsInput
								allowedPattern={/^[A-Za-z\s]+$/}
								maxLength={100}
								placeholder={t('Enter your profession')}
							/>
						</Form.Item>
					</Form>
					<div className="flex items-center gap-4 w-full justify-end max-sm:p-4 max-sm:justify-between max-sm:border-t-[1px] max-sm:border-[rgba(0,0,0,0.06)]">
						<Button
							onClick={() => {
								setIsDirty(false)
								setHasUnsavedChanges(false)
								setIsEdit(false)
							}}
							className="h-8 w-[110px] max-sm:w-1/2"
						>
							{t('Cancel')}
						</Button>
						<Button
							onClick={async () => {
								await profileForm.validateFields()
								const values = profileForm.getFieldsValue()
								try {
									const updated = await userApi.updateProfile({
										name: values.name,
										email: values.email,
										dateOfBirth: values.dateOfBirth
											? dayjs(values.dateOfBirth).format('DD/MM/YYYY')
											: undefined,
										phoneNumber: values.phoneNumber,
										gender: values.gender,
										profession: values.profession,
									})
									setProfile({
										name: updated.fullName,
										email: updated.email,
										dateOfBirth: updated.dob || null,
										phoneNumber: updated.phoneNumber,
										gender: updated.gender,
										profession: updated.profession,
									})
									setHasUnsavedChanges(false)
									setIsDirty(false)
									setIsEdit(false)
									toast.success(t('Profile updated successfully'))
								} catch (error) {
									console.error('Failed to update profile', error)
									toast.error(t('Failed to update profile'))
								}
							}}
							className="h-8 w-[110px] max-sm:w-1/2 !bg-purple-600 !text-white disabled:!text-white/65"
							type="primary"
							disabled={checkDisable()}
						>
							{t('Save')}
						</Button>
					</div>
				</>
			)}
		</div>
	)
}
