import { useTranslation } from "react-i18next"

export const Banner = () => {
    const {t} = useTranslation()
    return (
        <div className="fixed top-0 left-0 right-0 z-50">
            <div className="w-full h-10 flex items-center justify-center font-semibold text-sm text-white text-center bg-gradient-to-r from-violet-400 via-[#9938CA] to-[#FFFFFF]">
                <p className="!mb-0"><span className="px-3 py-1 rounded-lg text-[#9938CA] bg-white mr-2">{t('new')}</span>{t('AIFeatureAdded')}</p>
            </div>
        </div>
    )
}