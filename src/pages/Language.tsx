import { LANGUAGE_OPTIONS } from "@/constants/languageOptions";
import { Select } from "antd";
import { Globe } from "lucide-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Language() {
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = React.useState<string>(i18n.language || "en");

    // Update language state when i18n language changes
    useEffect(() => {
        setLanguage(i18n.language || "en");
    }, [i18n.language]);

    return (
        <div className="flex flex-col items-start p-0 lg:p-8 gap-6 w-full max-w-full h-full bg-white">
            {/* Header Section */}
            <div className="flex flex-col items-start w-full p-4 sm:p-0">
                <span className="text-4xl font-medium text-black/85 mb-2">
                    {t('Language')}
                </span>
                <p className="font-poppins font-normal text-sm leading-[22px] text-black/45 mt-1 sm:mt-0 hidden sm:block">
                    {t('Choose your preferred language')}
                </p>
            </div>

            {/* Form Section */}
            <div className="flex flex-col items-start gap-0 w-full gap-3">
                <span className="text-sm">{t("Your language")}</span>
                <Select
                    style={{ width: "300px" }}
                    value={language}
                    onChange={(value) => {
                        setLanguage(value);
                        i18n.changeLanguage(value);
                    }}
                    options={LANGUAGE_OPTIONS}
                    suffixIcon={<Globe size={18} color="rgba(0,0,0,0.6)" />}
                />
            </div>
        </div>
    )
}