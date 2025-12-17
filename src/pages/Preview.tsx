import { Loader } from "@/components/Loader"
import { ResumePreview } from "@/components/ResumePreview"
import type { Resume } from "@/lib/type"
import { resumeApi } from "@/lib/api"
import { ArrowLeftIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

export default function Preview() {
    const { t } = useTranslation();
    const { resumeId } = useParams()

    const [isLoading, setIsLoading] = useState(true)

    const [resumeData, setResumeData] = useState<Resume | null>(null)

    const loadResume = async () => {
        try {
            if (!resumeId) return;
            const found = await resumeApi.publicDetail(resumeId)
            setResumeData(found ?? null)
        } catch (e) {
            setResumeData(null)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadResume()
    }, [])

    return resumeData ? (
        <div className="bg-slate-100">
            <div className="max-w-3xl mx-auto py-10">
                <ResumePreview data={resumeData} template={resumeData.template || ''} accentColor={resumeData.accent_color || ''} classes="bg-white" />
            </div>
        </div>
    ) : (
        <div >
            {isLoading ? <Loader /> : (
                <div className="flex flex-col items-center justify-center h-screen">
                    <p className="text-center text-6xl text-slate-400 font-medium">{t("Resume not found")}</p>
                    <a href="/" className="mt-6 bg-purple-500 hover:bg-purple-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-purple-300 flex items-center transition-colors">
                        <ArrowLeftIcon className="mr-2 size-4" />
                        {t("Go to home page")}
                    </a>
                </div>
            )}
        </div>
    )
}