import type { Resume } from "@/lib/type"
import { dummyResumeData } from "@/lib/utils"
import { ArrowLeftIcon, FileText, User, Briefcase, GraduationCap, FolderIcon, Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { Link, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { PersonalInfoForm } from "@/components/PersonalInfoForm"
import { ResumePreview } from "@/components/ResumePreview"
import { Form } from "antd"
import { profileDefault } from "@/lib/constant"
import dayjs, { Dayjs } from 'dayjs'
import { TemplateSelector } from "@/components/TemplateSelector"
import { ColorPicker } from "@/components/ColorPicker"

// Interface cho form data với dayjs object
interface FormResume extends Omit<Resume, 'personal_info'> {
    personal_info: Omit<Resume['personal_info'], 'birthDate'> & {
        birthDate?: Dayjs
    }
}

export default function ResumeBuilder() {
    const { t } = useTranslation()
    const { resumeId } = useParams()

    const [resumeData, setResumeData] = useState<Resume>({
        id: '',
        title: '',
        personal_info: {},
        professional_sumary: '',
        experience: [],
        education: [],
        project: [],
        skills: [],
        template: "classic",
        accent_color: "#3B82F6",
        public: false
    })

    const [form] = Form.useForm<FormResume>()
    const isFormInitialized = useRef(false)
    const currentResumeId = useRef(resumeId)

    const loadExitstingResume = async () => {
        const resume = dummyResumeData.find(resume => resume.id === resumeId)
        if (resume) {
            setResumeData(resume)
            document.title = resume.title
            currentResumeId.current = resumeId
        }
    }

    const [activeSectionIndex, setActiveSectionIndex] = useState(0)
    const [removeBackground, setRemoveBackground] = useState(false)

    const sections = [
        { id: "personal", name: "Personal Info", icon: User },
        { id: "summary", name: "Summary", icon: FileText },
        { id: "experience", name: "Experience", icon: Briefcase },
        { id: "education", name: "Education", icon: GraduationCap },
        { id: "projects", name: "Projetcs", icon: FolderIcon },
        { id: "skills", name: "Skills", icon: Sparkles },
    ]

    const activeSection = sections[activeSectionIndex]

    useEffect(() => {
        loadExitstingResume()
    }, [resumeId])

    useEffect(() => {
        if (resumeId !== currentResumeId.current) {
            isFormInitialized.current = false
            currentResumeId.current = resumeId
        }

        if (!isFormInitialized.current && resumeData && resumeData.id === resumeId && Object.keys(resumeData.personal_info || {}).length > 0) {
            const formData = {
                ...resumeData,
                personal_info: {
                    ...resumeData.personal_info,
                    birthDate: resumeData.personal_info?.birthDate ? dayjs(resumeData.personal_info.birthDate, 'DD/MM/YYYY') : undefined
                }
            }
            form.setFieldsValue(formData)
            isFormInitialized.current = true
        }
    }, [resumeId, resumeData, form])

    return (
        <div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <Link to={'/app'} className="inline-flex gap-2 items-center text-slate-500">
                    <ArrowLeftIcon className="size-4" /> {t('backToDashboard')}
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-8">
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* left form */}
                    <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
                            {/* progress */}
                            <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
                            <hr className="absolute top-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600 border-none transition-all duration-2000" style={{ width: `${activeSectionIndex * 100 / (sections.length - 1)}%` }} />

                            {/* section navigation */}
                            <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                                <div className="flex items-center gap-3">
                                    <TemplateSelector selectedTemplate={resumeData.template || 'classic'} onChange={(template) => setResumeData(prev => ({...prev, template}))} />
                                    <ColorPicker selectedColor={resumeData.accent_color || ''} onChange={(color) => setResumeData(prev => ({...prev, accent_color: color}))}/>
                                </div>
                                <div className="flex items-center">
                                    {activeSectionIndex !== 0 && (
                                        <button onClick={() => setActiveSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0))} className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all" disabled={activeSectionIndex === 0}>
                                            <ChevronLeft className="size-4" /> {t('previous')}
                                        </button>
                                    )}
                                    <button onClick={() => setActiveSectionIndex((prevIndex) => Math.min(prevIndex + 1, sections.length - 1))} className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 && 'opacity-50'}`} disabled={activeSectionIndex === sections.length - 1}>
                                        {t('next')} <ChevronRight className="size-4" />
                                    </button>
                                </div>
                            </div>

                            {/* form content */}
                            <Form<FormResume>
                                form={form}
                                layout="vertical"
                                initialValues={resumeData ? resumeData : profileDefault}
                                autoComplete="off"
                                onValuesChange={(_, allValues) => {
                                    console.log('Form values changed:', allValues)
                                    const formData: Resume = {
                                        ...allValues,
                                        personal_info: {
                                            ...allValues.personal_info,
                                            birthDate: allValues.personal_info?.birthDate
                                                ? (typeof allValues.personal_info.birthDate === 'string'
                                                    ? allValues.personal_info.birthDate
                                                    : allValues.personal_info.birthDate.format('DD/MM/YYYY'))
                                                : undefined
                                        }
                                    }
                                    console.log('Setting resumeData:', formData)
                                    setResumeData(formData)
                                }}
                            >
                                <div className="space-y-6">
                                    {activeSection.id === 'personal' && (
                                        <PersonalInfoForm
                                            data={resumeData.personal_info}
                                            onChange={(data) => {
                                                const updatedResume: Resume = {
                                                    ...resumeData,
                                                    personal_info: data
                                                }
                                                setResumeData(updatedResume)
                                                form.setFieldsValue({
                                                    personal_info: data
                                                })
                                            }}
                                            removeBackground={removeBackground}
                                            setRemoveBackground={setRemoveBackground}
                                        />
                                    )}
                                </div>
                            </Form>
                        </div>
                    </div>

                    {/* right preview */}
                    <div className="lg:col-span-7 max-lg:mt-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors">
                                        Download PDF
                                    </button>
                                    <button className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors">
                                        Print
                                    </button>
                                </div>
                            </div>

                            <ResumePreview
                                data={resumeData}
                                template={resumeData.template}
                                accentColor={resumeData.accent_color || '#3B82F6'}
                                classes="shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}