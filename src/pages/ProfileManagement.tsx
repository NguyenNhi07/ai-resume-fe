'use client'

import { AllowedCharsInput } from '@/components/AllowedCharsInput'
import { isValidPhoneNumber } from '@/lib/phone-utils'
import { cn } from '@/lib/utils'
import { Button, DatePicker, Form, Radio } from 'antd'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUnsavedChanges } from '@/components/setting/context/UnsavedChangesContext'
import { PhoneInput } from '@/components/PhoneInput'
import EditIcon from '@/components/icons/EditIcon'
import type { ProfileForm } from '@/components/setting/type'

export default function ProfileManagement() {
    const { t } = useTranslation();
	// const userQ = useMyInfo()
	// const { mutate: updateUserProfile } = useUpdateUserProfile()
	const [isEdit, setIsEdit] = useState(false)
	const [profileForm] = Form.useForm<ProfileForm>()
	const [isDirty, setIsDirty] = useState(false)
	const [errorPhone, setErrorPhone] = useState(false)
	const { setHasUnsavedChanges } = useUnsavedChanges()
	const router = useRouter()
	const formValues = Form.useWatch([], profileForm)

	// useEffect(() => {
	// 	if (userQ.data) {
	// 		profileForm.setFieldsValue({
	// 			firstName: userQ.data.firstName,
	// 			lastName: userQ.data.lastName,
	// 			dateOfBirth: userQ.data.dateOfBirth
	// 				? dayjs(userQ.data.dateOfBirth)
	// 				: null,
	// 			phoneNumber: userQ.data.phoneNumber,
	// 			gender: userQ.data.gender,
	// 		})
	// 	}
	// }, [userQ.data, profileForm])

	const validateAge = (_: any, value: any) => {
		if (!value) return Promise.reject(new Error(t('this_field_is_required')))
		if (value.isAfter(dayjs(), 'day')) {
			return Promise.reject(new Error(t('date_cannot_be_in_the_future')))
		}
		const age = dayjs().diff(value, 'year')
		if (age < 18) {
			return Promise.reject(new Error(t('age_must_be_at_least_18_years')))
		}
		return Promise.resolve()
	}

	const checkDisable = () => {
		if (!isDirty) return true
		const check =
			!formValues.firstName ||
			!formValues.lastName ||
			!formValues.dateOfBirth ||
			!formValues.phoneNumber ||
			!formValues.gender ||
			formValues.dateOfBirth.isAfter(dayjs(), 'day') ||
			dayjs().diff(formValues.dateOfBirth, 'year') < 18
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
							<p className="font-medium text-3xl leading-10 text-black/85 max-sm:text-xl">
								{!isEdit ? t('my_profile') : t('edit_profile')}
							</p>
							<p className="text-sm text-black/45 max-sm:text-xs max-sm:hidden">
								{!isEdit && t('manage_your_profile')}
							</p>
						</div>
					</div>
					<div className="max-sm:hidden">
						{!isEdit && (
							<Button
								type="default"
								onClick={() => {
									setIsEdit(true)
								}}
								className="!text-primary-500 !border-primary-500"
								icon={<EditIcon fill={'#393ce5'} />}
							>
								{t('edit')}
							</Button>
						)}
					</div>
					<div className="sm:hidden">
						{!isEdit && (
							<Button
								type="link"
								onClick={() => {
									setIsEdit(true)
								}}
								icon={<EditIcon size={20} fill={'#393ce5'} />}
							></Button>
						)}
					</div>
				</div>
				{!isEdit ? (
					<div className="grid grid-cols-2 text-sm gap-y-[10px] max-sm:h-full max-sm:flex max-sm:flex-col max-sm:p-4 max-sm:rounded-xl max-sm:gap-4">
						<div className="flex flex-col">
							<span className="text-sm text-black/45">
								{t('Name')}
							</span>
							<span className="text-base text-black/85">
								{/* {userQ.data?.firstName} */} AAAA
							</span>
						</div>
						<div className="flex flex-col">
							<span className="text-sm text-black/45">
								{t('date_of_birth')}
							</span>
							<span className="text-base text-black/85">
								{/* {dayjs(userQ.data?.dateOfBirth).format('DD/MM/YYYY')} */}
							</span>
						</div>
						<div className="flex flex-col">
							<span className="text-sm text-black/45">{t('phone_number')}</span>
							<span className="text-base text-black/85">
								{/* {userQ.data?.phoneNumber ? userQ.data?.phoneNumber : 'No Data'} */}
							</span>
						</div>
						<div className="flex flex-col">
							<span className="text-sm text-black/45">{t('gender')}</span>
							<span className="text-base text-black/85">
								{/* {userQ.data?.gender} */}
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
								name="firstName"
								label={t('legal_first_name')}
								required={false}
								rules={[
									{ required: true, message: t('this_field_is_required') },
									{
										validator: (_, value) => {
											if (!value) return Promise.resolve()
											const hasLetterOrNumber = /[A-Za-z0-9]/.test(value)
											if (!hasLetterOrNumber) {
												return Promise.reject(
													new Error(
														t('first_name_cant_contain_only_special_characters')
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
									placeholder={t('enter_your_first_name')}
								/>
							</Form.Item>
							<Form.Item
								name="lastName"
								label={t('legal_last_name')}
								required={false}
								rules={[
									{ required: true, message: t('this_field_is_required') },
									{
										validator: (_, value) => {
											if (!value) return Promise.resolve()
											const hasLetterOrNumber = /[A-Za-z0-9]/.test(value)
											if (!hasLetterOrNumber) {
												return Promise.reject(
													new Error(
														t('last_name_cant_contain_only_special_characters')
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
									placeholder={t('enter_your_last_name')}
								/>
							</Form.Item>
							<Form.Item
								name="dateOfBirth"
								label={t('date_of_birth')}
								required={false}
								rules={[
									{ required: true, message: '' },
									{ validator: validateAge },
								]}
							>
								<DatePicker
									format={'DD/MM/YYYY'}
									placeholder={t('select_date')}
									allowClear
									className="w-full"
								/>
							</Form.Item>
							<Form.Item
								name="phoneNumber"
								label={t('phone_number')}
								required={false}
								rules={[
									{ required: true, message: t('this_field_is_required') },
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
														'please_enter_a_valid_phone_number_in_the_correct_format'
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
									placeholder={t('enter_your_phone_number')}
									error={errorPhone}
								/>
							</Form.Item>
							<Form.Item
								name="gender"
								label={t('gender')}
								required={false}
								rules={[
									{ required: true, message: t('this_field_is_required') },
								]}
							>
								<Radio.Group
									className=""
									options={[
										{ value: 'Male', label: t('male') },
										{ value: 'Female', label: t('female') },
										{ value: 'Other', label: t('other') },
									]}
								/>
							</Form.Item>
						</Form>
						<div className="flex items-center gap-4 w-full justify-end max-sm:p-4 max-sm:justify-between max-sm:border-t-[1px] max-sm:border-[rgba(0,0,0,0.06)]">
							<Button
								onClick={() => {
									// if (userQ.data) {
									// 	profileForm.setFieldsValue({
									// 		firstName: userQ.data.firstName,
									// 		lastName: userQ.data.lastName,
									// 		dateOfBirth: userQ.data.dateOfBirth
									// 			? dayjs(userQ.data.dateOfBirth)
									// 			: null,
									// 		phoneNumber: userQ.data.phoneNumber,
									// 		gender: userQ.data.gender,
									// 	})
									// }
									setIsDirty(false)
									setHasUnsavedChanges(false)
									setIsEdit(false)
								}}
								className="h-8 w-[110px] max-sm:w-1/2"
							>
								{t('cancel')}
							</Button>
							<Button
								onClick={async () => {
									await profileForm.validateFields()
									// updateUserProfile({
									// 	data: {
									// 		firstName: profileForm.getFieldValue('firstName'),
									// 		lastName: profileForm.getFieldValue('lastName'),
									// 		dateOfBirth: dayjs(
									// 			profileForm.getFieldValue('dateOfBirth')
									// 		).format('YYYY-MM-DD'),
									// 		phoneNumber: profileForm.getFieldValue('phoneNumber'),
									// 		gender: profileForm.getFieldValue('gender'),
									// 	},
									// })
									setHasUnsavedChanges(false)
									setIsDirty(false)
									setIsEdit(false)
								}}
								className="h-8 w-[110px] max-sm:w-1/2"
								type="primary"
								disabled={checkDisable()}
							>
								{t('save')}
							</Button>
						</div>
					</>
				)}
			</div>
	)
}
