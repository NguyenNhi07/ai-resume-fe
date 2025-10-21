import type { Resume } from "@/lib/type"
import { User } from "lucide-react"
import { useTranslation } from "react-i18next"

export const PersonalInfoForm = ({data, onChange, removeBackground, setRemoveBackground} : {
    data: Resume
    onChange: (value: any) => void,
    removeBackground: boolean,
    setRemoveBackground: (value: boolean) => void
}) => {
    const { t } = useTranslation()
    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900">{t('personalInfomation')}</h3>
            <p className="text-sm text-gray-600">{t('getStartedWithThePersonalInfomation')}</p>
            <div className="flex items-center gap-2">
                <label htmlFor="">
                    {data.image ? (
                        <img src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)} alt="user-image" className="w-16 h-16 rounded-full object-cover mt-5 ring ring-slate-300 hover:opacity-80" />
                    ) : (
                        <div className="inline-flex items-center gap-2 mt-5 text-slate-600 hover:text-slate-700 cursor-pointer">
                            <User className="size-10 p-2.5 border rounded-full" />
                            {t('uploadUserImage')}
                        </div> 
                    )}
                </label>
            </div>
        </div>
    )
}