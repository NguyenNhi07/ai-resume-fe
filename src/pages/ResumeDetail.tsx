import { ResumePreview } from "@/components/ResumePreview";
import ShareDialog from "@/components/ShareDialog";
import ScoreHistoryModal from "@/components/ScoreHistoryModal";
import { useToast } from "@/hooks/useToast";
import { aiApi, resumeApi } from "@/lib/api";
import type { Experience, Resume } from "@/lib/type";
import { cn } from "@/lib/utils";
import { Button, Form, Input, Modal, Popover, Tag } from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
    AlertCircle,
    ArrowLeftIcon,
    Clock,
    DownloadIcon,
    EyeIcon,
    FileDown,
    GlobeIcon,
    LockIcon,
    PencilIcon,
    PrinterIcon,
    Share2Icon,
    Sparkles,
    TrashIcon
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// Interface cho form data với dayjs object
interface FormResume
    extends Omit<
        Resume,
        "personal_info" | "experience" | "education" | "project"
    > {
    personal_info: Omit<Resume["personal_info"], "birthDate"> & {
        birthDate?: Dayjs;
    };
    experience?: Array<
        Omit<Experience, "start_date" | "end_date"> & {
            start_date?: Dayjs;
            end_date?: Dayjs;
        }
    >;
    education?: Array<
        Omit<Resume["education"][0], "graduation_date"> & {
            graduation_date?: Dayjs;
        }
    >;
    project?: Resume["project"];
}

export default function ResumeDetail() {
    const { t } = useTranslation();
    const { resumeId } = useParams();
    const navigate = useNavigate();

    const [resumeData, setResumeData] = useState<Resume>({
        id: "",
        title: "",
        personal_info: {},
        professional_summary: "",
        experience: [],
        education: [],
        project: [],
        skills: [],
        template: "classic",
        accent_color: "#3B82F6",
        public: false,
        font_family: "inter",
    });

    const [form] = Form.useForm<FormResume>();
    const isFormInitialized = useRef(false);
    const currentResumeId = useRef(resumeId);
    const toast = useToast();
    const [isDirty, setIsDirty] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
    const initialFormData = useRef<Resume | null>(null);
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [jdText, setJdText] = useState("");
    const [isScoring, setIsScoring] = useState(false);
    const [showScoreModal, setShowScoreModal] = useState(false);
    const [scoreResult, setScoreResult] = useState<{
        score: number;
        missingSkills: string[];
        weakSections: string[];
        suggestions: string[];
        matchedRole?: string;
    } | null>(null);
    const [deleteResume, setDeleteResume] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);

    const loadExitstingResume = async () => {
        if (!resumeId) return;
        try {
            const resume = await resumeApi.detail(resumeId);
            setResumeData(resume);
            initialFormData.current = { ...resume };
            document.title = resume.title;
            currentResumeId.current = resumeId;
            setIsDirty(false);
        } catch (e) {
            // Fallback to default for new resume
            const newResume: Resume = {
                id: "",
                title: "",
                personal_info: {},
                professional_summary: "",
                experience: [],
                education: [],
                project: [],
                skills: [],
                template: "classic",
                accent_color: "#3B82F6",
                public: false,
            };
            setResumeData(newResume);
            initialFormData.current = { ...newResume };
            setIsDirty(false);
        }
    };

    const handleScoreByJD = async () => {
        if (!jdText.trim()) return;
        setIsScoring(true);
        try {
            const parts: string[] = [];
            if (resumeData.personal_info?.full_name) {
                parts.push(`Name: ${resumeData.personal_info.full_name}`);
            }
            if (resumeData.personal_info?.profession) {
                parts.push(`Profession: ${resumeData.personal_info.profession}`);
            }
            if (resumeData.professional_summary) {
                parts.push(`Summary: ${resumeData.professional_summary}`);
            }
            if (resumeData.experience?.length) {
                parts.push(
                    "Experience:",
                    ...resumeData.experience.map((e) =>
                        `- ${e.position || ""} at ${e.company || ""} (${e.start_date || ""} - ${e.is_current ? "Present" : e.end_date || ""}) ${e.description || ""}`,
                    ),
                );
            }
            if (resumeData.education?.length) {
                parts.push(
                    "Education:",
                    ...resumeData.education.map((ed) =>
                        `- ${ed.degree || ""} in ${ed.field || ""} at ${ed.institution || ""} (${ed.graduation_date || ""}) GPA: ${ed.gpa || ""}`,
                    ),
                );
            }
            if (resumeData.project?.length) {
                parts.push(
                    "Projects:",
                    ...resumeData.project.map((p) =>
                        `- ${p.name || ""}: ${p.description || ""} (Tech: ${(p.technologies || []).join(", ")})`,
                    ),
                );
            }
            if (resumeData.skills?.length) {
                parts.push(`Skills: ${resumeData.skills.join(", ")}`);
            }
            const resumeText = parts.join("\n");

            const scored = await aiApi.scoreResumeByJD(resumeText, jdText);
            setScoreResult(scored);
            setShowScoreModal(true);

            // Save score to history
            if (resumeId) {
                try {
                    await resumeApi.createScore({
                        resumeId: Number(resumeId),
                        score: scored.score,
                        jdText: jdText,
                        matchedRole: scored.matchedRole,
                        missingSkills: scored.missingSkills,
                        weakSections: scored.weakSections,
                        suggestions: scored.suggestions,
                    });
                } catch (error) {
                    console.error("Failed to save score history:", error);
                    // Don't show error to user, just log it
                }
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || t("Failed to score resume by JD"));
        } finally {
            setIsScoring(false);
        }
    };

    useEffect(() => {
        loadExitstingResume();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resumeId]);

    useEffect(() => {
        if (resumeId !== currentResumeId.current) {
            isFormInitialized.current = false;
            currentResumeId.current = resumeId;
        }

        if (
            !isFormInitialized.current &&
            resumeData &&
            resumeData.id === resumeId &&
            Object.keys(resumeData.personal_info || {}).length > 0
        ) {
            const formData = {
                ...resumeData,
                personal_info: {
                    ...resumeData.personal_info,
                    birthDate: resumeData.personal_info?.birthDate
                        ? dayjs(resumeData.personal_info.birthDate, "DD/MM/YYYY")
                        : undefined,
                },
                experience: resumeData.experience
                    ? resumeData.experience.map((exp) => ({
                        ...exp,
                        start_date: exp.start_date
                            ? dayjs(exp.start_date, "MM/YYYY")
                            : undefined,
                        end_date: exp.end_date
                            ? dayjs(exp.end_date, "MM/YYYY")
                            : undefined,
                    }))
                    : [],
                education: resumeData.education
                    ? resumeData.education.map((edu) => ({
                        ...edu,
                        graduation_date: edu.graduation_date
                            ? dayjs(edu.graduation_date, "MM/YYYY")
                            : undefined,
                    }))
                    : [],
            };
            form.setFieldsValue(formData);
            initialFormData.current = { ...resumeData };
            isFormInitialized.current = true;
            setIsDirty(false);
        }
    }, [resumeId, resumeData, form]);

    const handleDeleteResume = async (resumeId: number) => {
        try {
            await resumeApi.remove(String(resumeId));
            toast.success(t("deleteResumeSuccess"));
            navigate("/app");
        } catch (e) {
            console.error(e);
        } finally {
            setDeleteResume(false);
        }
    };

    const buildResumeFromForm = (allValues: FormResume, current: Resume): Resume => {
        return {
            ...current,
            ...allValues,
            personal_info: {
                ...current.personal_info,
                ...allValues.personal_info,
                birthDate: allValues.personal_info?.birthDate
                    ? typeof allValues.personal_info.birthDate === "string"
                        ? allValues.personal_info.birthDate
                        : allValues.personal_info.birthDate.format("DD/MM/YYYY")
                    : current.personal_info?.birthDate,
            },
            professional_summary:
                allValues.professional_summary !== undefined
                    ? allValues.professional_summary
                    : current.professional_summary,
            experience: allValues.experience
                ? allValues.experience.map((exp) => {
                    const startDate = exp.start_date
                        ? typeof exp.start_date === "string"
                            ? exp.start_date
                            : (exp.start_date as Dayjs).format("MM/YYYY")
                        : "";
                    const endDate = exp.is_current
                        ? ""
                        : exp.end_date
                            ? typeof exp.end_date === "string"
                                ? exp.end_date
                                : (exp.end_date as Dayjs).format("MM/YYYY")
                            : "";
                    return {
                        company: exp.company,
                        position: exp.position,
                        description: exp.description,
                        is_current: exp.is_current || false,
                        start_date: startDate,
                        end_date: endDate,
                    };
                })
                : current.experience || [],
            education: allValues.education
                ? allValues.education.map((edu) => {
                    const graduationDate = edu.graduation_date
                        ? typeof edu.graduation_date === "string"
                            ? edu.graduation_date
                            : (edu.graduation_date as Dayjs).format("MM/YYYY")
                        : "";
                    return {
                        institution: edu.institution,
                        degree: edu.degree,
                        field: edu.field,
                        graduation_date: graduationDate,
                        gpa: edu.gpa,
                    };
                })
                : current.education || [],
            project: allValues.project
                ? allValues.project.map((proj) => ({
                    name: proj.name,
                    description: proj.description,
                    technologies: proj.technologies || [],
                }))
                : current.project || [],
            skills:
                allValues.skills !== undefined && Array.isArray(allValues.skills)
                    ? allValues.skills
                    : current.skills || [],
            // Preserve template and accent_color from current state (set by TemplateSelector/ColorPicker)
            template: current.template || 'classic',
            accent_color: current.accent_color || '#3B82F6',
        };
    };

    const changeResumeVisibility = async () => {
        if (!resumeId) return;
        try {
            const updated = await resumeApi.setVisibility(resumeId, !resumeData.public);
            setResumeData((prev) => ({
                ...prev,
                public: updated.public,
            }));
            toast.success(
                updated.public ? t("Resume is now public") : t("Resume is now private"),
            );
        } catch (error) {
            console.error("Failed to change visibility", error);
            toast.error(t("Failed to change visibility"));
        }
    };

    const handleShare = () => {
        setShowShareDialog(true);
    };

    const onPrint = () => {
        window.print();
    };

    const onDownloadPdf = async () => {
        try {
            if (!resumeId) return;
            const blob = await resumeApi.downloadPdf(resumeId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            const fileName = resumeData.title
                ? `${resumeData.title.replace(/[^a-z0-9]/gi, "_")}.pdf`
                : `resume_${Date.now()}.pdf`;
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading PDF:", error);
        }
    };

    return (
        <div>
            <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
                <Button
                    onClick={() => navigate("/app")}
                    className="!border-0 !bg-[#f9fafb] hover:!text-purple-600 !text-lg !shadow-none !px-0"
                >
                    <ArrowLeftIcon className="size-4" /> {t("backToDashboard")}
                </Button>

                <div className="flex items-center gap-2">
                    {resumeData.public && (
                        <Button
                            onClick={handleShare}
                            className="!bg-blue-100 !text-blue-500
             hover:!border-blue-400 !border-blue-300 cursor-pointer"
                        >
                            <Share2Icon className="size-4" /> {t("Share")}
                        </Button>
                    )}

                    <Button
                        onClick={() => {
                            navigate(`/app/preview/${resumeId}`);
                        }}
                        className="!bg-yellow-100 !text-yellow-500
             hover:!border-yellow-400 !border-yellow-300 cursor-pointer"
                    >
                        <EyeIcon className="size-4" />
                        {t("Preview")}
                    </Button>

                    <Button
                        onClick={() => navigate(`/app/builder/${resumeId}/edit`)}
                        className="!bg-purple-100 !text-purple-500
             hover:!border-purple-400 !border-purple-300 cursor-pointer"
                    >
                        <PencilIcon className="size-4" /> {t("Edit")}
                    </Button>
                    <Button
                        onClick={() => {
                            setDeleteResume(true);
                        }}
                        className="!bg-red-100 !text-red-500
             hover:!border-red-400 !border-red-300 cursor-pointer"
                    >
                        <TrashIcon className="size-4" /> {t("Delete")}
                    </Button>

                    <Button
                        onClick={changeResumeVisibility}
                        className={cn(resumeData.public ? "!bg-green-100 !text-green-500 hover:!border-green-400 !border-green-300 cursor-pointer" : "!bg-slate-100 !text-slate-500 hover:!border-slate-400 !border-slate-300 cursor-pointer")}
                    >
                        {resumeData.public ? (
                            <span className="flex items-center gap-2">
                                <GlobeIcon className="size-4" /> {t("Public")}
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <LockIcon className="size-4" /> {t("Private")}
                            </span>
                        )}

                    </Button>

                    <Popover
                        content={
                            <div className="flex flex-col gap-2">
                                <Button
                                    type="text"
                                    icon={<PrinterIcon className="size-4" />}
                                    onClick={onPrint}
                                    className="flex !justify-start"
                                >
                                    {t("Print")}
                                </Button>

                                <Button
                                    type="text"
                                    icon={<FileDown className="size-4" />}
                                    onClick={onDownloadPdf}
                                    className="flex !justify-start"
                                >
                                    {t("Download PDF")}
                                </Button>
                            </div>
                        }
                        trigger="click"
                        placement="bottom"
                    >
                        <Button
                            className="!bg-slate-100 !text-slate-500
             hover:!border-slate-400 !border-slate-300 cursor-pointer"
                        >
                            <DownloadIcon className="size-4" /> {t("Download")}
                        </Button>
                    </Popover>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-8">
                <div className="grid lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                {/* Labels */}
                                <div className="flex flex-col gap-2 text-slate-500">
                                    <span>{t("Title")}</span>
                                    <span>{t("Created at")}</span>
                                    <span>{t("Updated at")}</span>
                                    <span>{t("Public")}</span>
                                </div>

                                {/* Values */}
                                <div className="flex flex-col gap-2 text-slate-800">
                                    <span className="font-semibold text-base">
                                        {resumeData.title}
                                    </span>

                                    <span>
                                        {dayjs(resumeData.createdAt).format("DD/MM/YYYY")}
                                    </span>

                                    <span>
                                        {dayjs(resumeData.updatedAt).format("DD/MM/YYYY")}
                                    </span>

                                    <span
                                        className={`inline-flex w-fit items-center rounded-md px-2 py-0.5 text-xs font-medium
                ${resumeData.public
                                                ? "bg-green-100 text-green-700"
                                                : "bg-slate-100 text-slate-600"
                                            }`}
                                    >
                                        {resumeData.public ? t("Yes") : t("No")}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => setShowScoreModal(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-md text-orange-600 hover:bg-orange-50 transition-colors"
                                >
                                    <Sparkles className="size-4 text-orange-600 transition-colors" />
                                    {t("AnalyzeScoreWithAI")}
                                </button>
                                <button
                                    onClick={() => {
                                        navigate(`/app/tailor/${resumeId}`);
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-md text-violet-600 hover:bg-violet-50 transition-colors"
                                >
                                    <Sparkles className="size-4 text-violet-600 transition-colors" />
                                    {t("TailorCVByJDMenu")}
                                </button>
                                <button
                                    onClick={() => {
                                        navigate(`/app/mock-interview/${resumeId}`);
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors"
                                >
                                    <Sparkles className="size-4 text-indigo-600 transition-colors" />
                                    {t("MockInterviewMenu")}
                                </button>
                                <button
                                    onClick={() => {
                                        navigate(`/app/cover-letter/${resumeId}`);
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
                                >
                                    <Sparkles className="size-4 text-emerald-600 transition-colors" />
                                    {t("CoverLetterMenu")}
                                </button>
                            </div>

                        </div>
                    </div>
                    {/* right preview */}
                    <div className="lg:col-span-8 max-lg:mt-6">
                        <ResumePreview
                            data={resumeData}
                            template={resumeData.template || "classic"}
                            accentColor={resumeData.accent_color || "#3B82F6"}
                        />
                    </div>


                </div>
            </div>

            <Modal
                open={showScoreModal}
                onCancel={() => { setShowScoreModal(false); setJdText(""); setScoreResult(null); }}
                footer={null}
                title={
                    <span className="flex items-center gap-2">
                        <Sparkles className="size-4 text-orange-600" />
                        {t("ScoreAgainstJD")}
                    </span>
                }
            >
                <div className="space-y-3">
                    <Input.TextArea
                        value={jdText}
                        onChange={(e) => setJdText(e.target.value)}
                        rows={5}
                        placeholder={t("PasteJDPlaceholder")}
                        autoSize={{ minRows: 5, maxRows: 10 }}
                        showCount
                    />
                    <div className="flex items-center mt-4 justify-between">
                        <div className="flex items-center gap-2">
                            <div className="text-xs text-gray-500">{t("JDScoreHelper")}</div>
                            <Button
                                size="small"
                                type="text"
                                className="!text-purple-600 hover:!bg-purple-50"
                                onClick={() => setShowHistoryModal(true)}
                            >
                                <Clock className="size-3 mr-1" />
                                {t("History")}
                            </Button>
                        </div>
                        <Button
                            size="small"
                            type="primary"
                            className="!bg-orange-200 !text-orange-600 disabled:!bg-slate-300 disabled:!text-slate-600"
                            loading={isScoring}
                            disabled={isScoring || !jdText.trim()}
                            onClick={handleScoreByJD}
                        >
                            <Sparkles className="size-4 mr-1" />
                            {t("AnalyzeJDButton")}
                        </Button>
                    </div>

                    {scoreResult && (
                        <div className="border border-slate-200 rounded-lg p-3 bg-white">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="size-4 text-purple-600" />
                                    <p className="text-sm font-semibold text-slate-800">
                                        {t("CVScoreTitle", {
                                            score: scoreResult.score,
                                            role: scoreResult.matchedRole || "",
                                        })}
                                    </p>
                                </div>
                                <Tag
                                    color={
                                        scoreResult.score >= 75
                                            ? "green"
                                            : scoreResult.score >= 60
                                                ? "blue"
                                                : "orange"
                                    }
                                >
                                    {scoreResult.score}/100
                                </Tag>
                            </div>

                            <div className="space-y-2 text-sm text-slate-700">
                                {scoreResult.missingSkills.length > 0 && (
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            {t("MissingSkills")}
                                        </p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {scoreResult.missingSkills.map((s) => (
                                                <Tag key={s} color="red">
                                                    {s}
                                                </Tag>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {scoreResult.weakSections.length > 0 && (
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            {t("WeakSections")}
                                        </p>
                                        <div className="flex flex-wrap gap-1 mt-1 overflow-hidden">
                                            {scoreResult.weakSections.map((s) => (
                                                <Tag 
                                                    key={s} 
                                                    color="gold"
                                                    style={{ 
                                                        maxWidth: '100%',
                                                        wordBreak: 'break-word',
                                                        whiteSpace: 'normal',
                                                        display: 'inline-block'
                                                    }}
                                                >
                                                    <span className="break-words">{t(s) || s}</span>
                                                </Tag>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {scoreResult.suggestions.length > 0 && (
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            {t("Suggestions")}
                                        </p>
                                        <ul className="list-disc list-inside text-slate-700 space-y-1">
                                            {scoreResult.suggestions.map((s, idx) => (
                                                <li key={idx}>{s}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            <Modal
                title={
                    <span className="flex items-center gap-2">
                        <AlertCircle style={{ color: "#dc2626" }} />
                        {t("deleteResume")}
                    </span>
                }
                open={deleteResume}
                onCancel={() => {
                    setDeleteResume(false);
                }}
                width={"500px"}
                onOk={() => handleDeleteResume(Number(resumeId))}
                okButtonProps={{
                    style: { backgroundColor: "#dc2626" },
                }}
                okText={t("delete")}
            >
                <p>{t("areYouSureYouWantToDeleteThisResume")}</p>
            </Modal>

            <ShareDialog
                open={showShareDialog}
                onOpenChange={setShowShareDialog}
                resumeId={resumeId || ""}
            />

            <ScoreHistoryModal
                open={showHistoryModal}
                onCancel={() => setShowHistoryModal(false)}
                resumeId={resumeId}
            />
        </div>
    );
}
