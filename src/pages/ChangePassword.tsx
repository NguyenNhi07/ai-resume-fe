import { useTranslation } from "react-i18next";

export default function ChangePassword () {
    const { t } = useTranslation();
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
            
        </div>
    )
}