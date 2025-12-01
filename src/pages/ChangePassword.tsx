import { useUnsavedChanges } from "@/components/setting/context/UnsavedChangesContext";
import type { ChangePasswordForm } from "@/components/setting/type";
import { Button, Form, Input } from "antd";
import { useTranslation } from "react-i18next";

export default function ChangePassword() {
    const { t } = useTranslation();
    const [changePassForm] = Form.useForm<ChangePasswordForm>()
    const { setHasUnsavedChanges } = useUnsavedChanges()

    return (
        <div className="flex flex-col items-start p-0 sm:p-6 lg:p-8 gap-0 sm:gap-2 w-full max-w-full h-full md:h-auto bg-white">
            {/* Header Section */}
            <div className="flex flex-col items-start gap-1 sm:gap-0 w-full p-4 sm:p-0">
                <span className="text-4xl font-medium text-black/85 mb-2">
                    {t('Change Password')}
                </span>
                <p className="font-poppins font-normal text-sm leading-[22px] text-black/45 mt-1 sm:mt-0 hidden sm:block">
                    {t('Choose your preferred language')}
                </p>
            </div>

            {/* Form Section */}
            <Form
                name="changePassword"
                onFinish={() => {
                    console.log(123)
                }}
                layout="vertical"
                form={changePassForm}
                size="large"
                onValuesChange={() => {
                    setHasUnsavedChanges(true)
                }}
                className="grid grid-cols-1 text-sm gap-y-[10px] gap-x-10 !pt-4 min-h-fit w-full"
            >
                <Form.Item
                    name="oldPassword"
                    label={t("Your password")}
                    rules={[
                        { required: true, message: t("This field is required") },
                        {
                            validator: (_, value) => {
                                if (value && value.trim().length === 0) {
                                    return Promise.reject(t("Password cannot contain only whitespace"));
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Input.Password placeholder={t("Enter your password")} />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    label={t("New Password")}
                    rules={[
                        { required: true, message: t("This field is required") },
                        {
                            validator: (_, value) => {
                                if (value && value.trim().length === 0) {
                                    return Promise.reject(t("Password cannot contain only whitespace"));
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Input.Password placeholder={t("Enter your new password")} />
                </Form.Item>
            </Form>
            <div className="flex items-center gap-4 w-full justify-end max-sm:p-4 max-sm:justify-between max-sm:border-t-[1px] max-sm:border-[rgba(0,0,0,0.06)]">
                <Button
                    onClick={() => {
                        changePassForm.setFieldsValue({
                            oldPassword: undefined,
                            newPassword: undefined
                        })
                        setHasUnsavedChanges(false)
                    }}
                    className="h-8 w-[110px] max-sm:w-1/2"
                >
                    {t('Cancel')}
                </Button>
                <Button
                    onClick={async () => {
                        await changePassForm.validateFields()
                        //TODO: change password api
                        setHasUnsavedChanges(false)
                    }}
                    className="h-8 w-[110px] max-sm:w-1/2 !bg-purple-600 !text-white disabled:!text-white/65"
                    type="primary"
                >
                    {t('Save')}
                </Button>
            </div>
        </div>
    )
}