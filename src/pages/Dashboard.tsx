import type { Resume } from "@/lib/type";
import { dummyResumeData } from "@/lib/utils";
import { Input, Modal } from "antd";
import { FilePenLineIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloud, UploadCloudIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"]
    const [allResumes, setAllResumes] = useState<Resume[]>([])
    const [showCreateResume, setShowCreateResume] = useState(false)
    const [showUploadResume, setShowUploadResume] = useState(false)
    const [title, setTitle] = useState('')
    const [resume, setResume] = useState<any>(null)
    const [editResumeId, setEditResumeId] = useState('')
    const [deleteResumeId, setDeleteResumeId] = useState<number | undefined>()
    const [deleteResume, setDeleteResume] = useState(false)

    const loadAllResumes = async () => {
        setAllResumes(dummyResumeData)
    }

    const createResume = async (event: any) => {
        event.preventDefault()
        setShowCreateResume(false)
        navigate(`/app/builder/resume123`)
    }

    const uploadResume = async (event: any) => {
        event.preventDefault()
        setShowUploadResume(false)
        navigate(`/app/builder/resume123`)
    }

    const editTitle = async (event: any) => {
        event.preventDefault()
    }

    const handleDeleteResume = async (resumeId: number) => {
        setAllResumes(prev => prev.filter(resume => Number(resume.id) !== resumeId))
        setDeleteResume(false)
    }

    useEffect(() => {
        loadAllResumes()
    }, [])

    return (
        <div>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <p className="text-2xl font-medium mb-6 bg-grandient-to-r from-slate-500 to-slate-700 bg-clip-text text-transparent sm:hidden">{t('welcome')}, Joe Doe</p>

                <div className="flex gap-4">
                    <button onClick={() => setShowCreateResume(true)} className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
                        <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />
                        <p className="text-sm group hover:text-indigo-600 transition-all duration-300">{t('createResume')}</p>
                    </button>

                    <button onClick={() => setShowUploadResume(true)} className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hober:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
                        <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-purple-500 text-white rounded-full" />
                        <p className="text-sm group hover:text-purple-600 transition-all duration-300">{t('uploadExisting')}</p>
                    </button>
                </div>

                <hr className="border-slate-300 my-6 sm:w-[305px]" />

                <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
                    {allResumes.map((resume: any, index: number) => {
                        const baseColor = colors[index % colors.length]

                        return (
                            <button onClick={() => navigate(`/app/builder/${resume.id}`)} key={index} className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group group-hover:shadow-lg transition-all duration-300 cursor-pointer" style={{
                                background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                                borderColor: baseColor + '40',
                            }}>
                                <FilePenLineIcon className="size-7 group-hover:scale-105 transition-all:" style={{ color: baseColor }} />
                                <p className="text-sm group-hover:scale-105 transition-all px-2 text-center" style={{ color: baseColor }}>
                                    {resume.title}
                                </p>
                                <p className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center" style={{ color: baseColor + '90' }}>
                                    {t('updatedOn')} {new Date(resume.updatedAt).toLocaleDateString()}
                                </p>
                                <div onClick={(e) => e.stopPropagation()} className="absolute top-1 right-1 hidden group-hover:flex items-center ">
                                    <TrashIcon onClick={() => {setDeleteResume(true); setDeleteResumeId(resume.id)}} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors" />
                                    <PencilIcon onClick={() => {
                                        setEditResumeId(resume.id);
                                        setTitle(resume.title)
                                    }} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors" />
                                </div>
                            </button>
                        )
                    })}
                </div>

                <Modal
                    title={t('createResume')}
                    open={showCreateResume}
                    onCancel={() => { setShowCreateResume(false); setTitle('') }}
                    width={'500px'}
                    onOk={createResume}
                    okButtonProps={{
                        style: { backgroundColor: '#9810fa' },
                    }}
                    okText={t('createResume')}
                >
                    <Input
                        placeholder={t('enterResumeTitle')}
                        size="large"
                        maxLength={100}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Modal>

                <Modal
                    title={t('uploadResume')}
                    open={showUploadResume}
                    onCancel={() => { setShowUploadResume(false); setTitle('') }}
                    width={'500px'}
                    onOk={uploadResume}
                    okButtonProps={{
                        style: { backgroundColor: '#9810fa' },
                    }}
                    okText={t('uploadResume')}
                >
                    <Input
                        placeholder={t('enterResumeTitle')}
                        size="large"
                        maxLength={100}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className="mt-4">
                        <label htmlFor="resume-input" className="block text-sm text-slate-700">
                            {t('selectResumeFile')}
                            <div className="flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover::border-purple-500 hover:text-purple-700 cursor-pointer transition-colors">
                                {resume ? (
                                    <p className="text-purple-700">{resume.name}</p>
                                ) : (
                                    <>
                                        <UploadCloud className="size-14 stroke-1" />
                                        <p>{t('uploadResume')}</p>
                                    </>
                                )}
                            </div>
                        </label>
                        <input 
                            onChange={(e:React.ChangeEvent<HTMLInputElement>) => setResume(e.target.files?.[0] ?? null)} type="file" 
                            id="resume-input" 
                            accept=".pdf" 
                            hidden 
                        />
                    </div>
                </Modal>

                <Modal
                    title={t('editResumeTitle')}
                    open={!!editResumeId}
                    onCancel={() => { setEditResumeId(''); setTitle('') }}
                    width={'500px'}
                    onOk={editTitle}
                    okButtonProps={{
                        style: { backgroundColor: '#9810fa' },
                    }}
                    okText={t('update')}
                >
                    <Input
                        placeholder={t('enterResumeTitle')}
                        size="large"
                        maxLength={100}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Modal>

                <Modal
                    title={t('deleteResume')}
                    open={deleteResume}
                    onCancel={() => { setDeleteResume(false); setTitle('') }}
                    width={'500px'}
                    onOk={() => handleDeleteResume(deleteResumeId as number)}
                    okButtonProps={{
                        style: { backgroundColor: '#9810fa' },
                    }}
                    okText={t('delete')}
                >
                    <p>{t('areYouSureYouWantToDeleteThisResume')}</p>
                </Modal>
            </div>
        </div>
    )
}