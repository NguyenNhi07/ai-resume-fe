import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input, Modal, Tag } from "antd";
import {
  ArrowLeftIcon,
  FileText,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { extractSkillsFromJD } from "@/lib/utils";
import type { Resume } from "@/lib/type";
import { ResumePreview } from "@/components/ResumePreview";
import { TailoredResumePreview } from "@/components/TailoredResumePreview";
import { resumeApi, aiApi } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

const { TextArea } = Input;

type SourceMode = "existing" | "plain-text";

export default function TailorByJD() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resumeId } = useParams();
  const toast = useToast();

  const [sourceMode] = useState<SourceMode>("existing");
  const [baseResume, setBaseResume] = useState<Resume | null>(null);
  const [rawCVText] = useState<string>("");
  const [jdText, setJdText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [tailoredResume, setTailoredResume] = useState<Resume | null>(null);
  const [tailoredInfo, setTailoredInfo] = useState<{
    language: string;
    matchedPosition?: string;
    summary: { original: string; optimized: string };
    sections: {
      section: string;
      title: string;
      original: string;
      optimized: string;
      changes: string[];
    }[];
    overallSuggestions: string[];
  } | null>(null);
  const [jdSkills, setJdSkills] = useState<string[]>([]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveAsNewTitle, setSaveAsNewTitle] = useState<string>("");

  useEffect(() => {
    if (!resumeId) return;
    resumeApi
      .detail(resumeId)
      .then((res) => setBaseResume(res))
      .catch(() => setBaseResume(null));
  }, [resumeId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAnalyzeAndTailor = async () => {
    if (!jdText.trim()) {
      return;
    }

    setIsProcessing(true);
    try {
      let resumeSource: Resume | null = baseResume;

      // Nếu người dùng chọn dán CV dạng text, tạo 1 resume đơn giản từ text
      if (sourceMode === "plain-text") {
        resumeSource = {
          id: "",
          title: t("CVFromText"),
          personal_info: {},
          professional_summary: rawCVText.slice(0, 2000),
          experience: [],
          education: [],
          project: [],
          skills: [],
          template: "classic",
          accent_color: "#3B82F6",
          public: false,
        };
      }

      if (!resumeSource) {
        return;
      }

      const skills = extractSkillsFromJD(jdText, resumeSource.skills || []);
      setJdSkills(skills);

      // Build plain-text CV để gửi cho AI (giống CoverLetter/MockInterview)
      const parts: string[] = [];
      if (resumeSource.personal_info?.full_name) {
        parts.push(`Name: ${resumeSource.personal_info.full_name}`);
      }
      if (resumeSource.personal_info?.profession) {
        parts.push(`Profession: ${resumeSource.personal_info.profession}`);
      }
      if (resumeSource.professional_summary) {
        parts.push(`Summary: ${resumeSource.professional_summary}`);
      }
      if (resumeSource.experience?.length) {
        parts.push(
          "Experience:",
          ...resumeSource.experience.map((e) =>
            `- ${e.position || ""} at ${e.company || ""} (${e.start_date || ""} - ${e.is_current ? "Present" : e.end_date || ""
            }) ${e.description || ""}`,
          ),
        );
      }
      if (resumeSource.education?.length) {
        parts.push(
          "Education:",
          ...resumeSource.education.map((ed) =>
            `- ${ed.degree || ""} in ${ed.field || ""} at ${ed.institution || ""} (${ed.graduation_date || ""
            }) GPA: ${ed.gpa || ""}`,
          ),
        );
      }
      if (resumeSource.certifications?.length) {
        parts.push(
          "Certifications:",
          ...resumeSource.certifications.map((cert) =>
            `- ${cert.name || ""}${cert.issuer ? ` from ${cert.issuer}` : ""}${cert.issueDate ? ` (${cert.issueDate})` : ""}${cert.credentialId ? ` ID: ${cert.credentialId}` : ""}`,
          ),
        );
      }
      if (resumeSource.project?.length) {
        parts.push(
          "Projects:",
          ...resumeSource.project.map((p) =>
            `- ${p.name || ""}: ${p.description || ""} (Tech: ${(p.technologies || []).join(
              ", ",
            )})`,
          ),
        );
      }
      if (resumeSource.skills?.length) {
        parts.push(`Skills: ${resumeSource.skills.join(", ")}`);
      }
      const resumeText = parts.join("\n");

      const tailoredInfoResult = await aiApi.tailorResumeByJD(resumeText, jdText);
      setTailoredInfo(tailoredInfoResult);

      // Initialize tailoredResume với baseResume (chưa apply changes)
      // Changes sẽ được apply qua TailoredResumePreview component
      setTailoredResume(resumeSource);

      // Dùng AI thật để chấm điểm CV đã tailor
      // const scored = await aiApi.scoreResumeByJD(resumeText, jdText);
      // setScoreResult(scored);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentPreview = tailoredResume || baseResume;

  const canSave = Boolean(tailoredResume && (baseResume || sourceMode === "plain-text"));

  const handleSaveOverwrite = async () => {
    if (!tailoredResume || !baseResume || !baseResume.id) return;
    try {
      await resumeApi.update(String(baseResume.id), tailoredResume);
      toast.success(t("Resume saved successfully"));
      navigate(`/app/builder/${baseResume.id}`);
    } catch (error) {
      console.error("Failed to save resume:", error);
      toast.error(t("Failed to save resume"));
    }
  };

  const handleSaveAsNew = () => {
    if (!tailoredResume) return;
    setSaveAsNewTitle(tailoredResume.title || "");
    setIsSaveModalOpen(true);
  };

  const handleConfirmSaveAsNew = async () => {
    if (!tailoredResume) return;

    const title = saveAsNewTitle.trim() || tailoredResume.title || t("UntitledResume");
    setIsSaveModalOpen(false);
    try {
      const newResume = { ...tailoredResume, id: "", title };
      const created = await resumeApi.create(newResume);
      toast.success(t("Resume created successfully"));
      navigate(`/app/builder/${created.id}`);
    } catch (error) {
      console.error("Failed to create new resume:", error);
      toast.error(t("Failed to create new resume"));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={handleBack}
          className="!border-0 !bg-[#f9fafb] hover:!text-purple-600 !text-lg !shadow-none !px-0"
        >
          <ArrowLeftIcon className="size-4" /> {t("Back")}
        </Button>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs text-purple-700">
            <Sparkles className="size-3" />
            <span>{t("AIFeatureAdded")}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <Wand2 className="size-6 text-purple-600" />
          {t("TailorCVByJDTitle")}
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          {t("TailorCVByJDDescription")}
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                {t("SourceCV")}
              </span>
            </div>

            {sourceMode === "existing" && (
              <div className="mt-3 rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3">
                {baseResume ? (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-md bg-purple-100 p-2">
                      <FileText className="size-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {baseResume.title || t("UntitledResume")}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {t("UsingResumeAsBase")}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-red-500">
                    {t("BaseResumeNotFound")}
                  </p>
                )}
              </div>
            )}

            {/* {sourceMode === "plain-text" && (
              <div className="mt-3">
                <p className="text-xs text-slate-500 mb-1">
                  {t("PasteYourExistingCVDescription")}
                </p>
                <TextArea
                  value={rawCVText}
                  onChange={(e) => setRawCVText(e.target.value)}
                  rows={6}
                  placeholder={t("PasteYourExistingCVPlaceholder")}
                  autoSize={{ minRows: 6, maxRows: 10 }}
                  showCount
                />
              </div>
            )} */}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                {t("JobDescription")}
              </span>
            </div>

            <TextArea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              rows={10}
              placeholder={t("PasteJDPlaceholder")}
              autoSize={{ minRows: 8, maxRows: 14 }}
              showCount
            />

            <div className="flex justify-between items-center mt-2">
              <div className="flex flex-wrap gap-1">
                {jdSkills.map((skill) => (
                  <Tag key={skill} color="purple">
                    {skill}
                  </Tag>
                ))}
              </div>
              <Button
                type="primary"
                className="!bg-purple-600 disabled:!bg-purple-300"
                loading={isProcessing}
                onClick={handleAnalyzeAndTailor}
                disabled={
                  isProcessing ||
                  !jdText.trim() ||
                  (sourceMode === "existing" && !baseResume) ||
                  (sourceMode === "plain-text" && !rawCVText.trim())
                }
              >
                <Sparkles className="size-4 mr-1" />
                {t("GenerateTailoredCV")}
              </Button>
            </div>

            {/* {scoreResult && (
              <div className="mt-4 border border-slate-200 rounded-lg p-3 bg-slate-50">
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
                  <Tag color={scoreResult.score >= 75 ? "green" : scoreResult.score >= 60 ? "blue" : "orange"}>
                    {scoreResult.score}/100
                  </Tag>
                </div>

                <div className="space-y-2 text-sm text-slate-700">
                  {scoreResult.missingSkills.length > 0 && (
                    <div>
                      <p className="font-medium text-slate-800">{t("MissingSkills")}</p>
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
                      <p className="font-medium text-slate-800">{t("WeakSections")}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {scoreResult.weakSections.map((s) => (
                          <Tag key={s} color="gold">
                            {t(s) || s}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}

                  {scoreResult.suggestions.length > 0 && (
                    <div>
                      <p className="font-medium text-slate-800">{t("Suggestions")}</p>
                      <ul className="list-disc list-inside text-slate-700 space-y-1">
                        {scoreResult.suggestions.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )} */}
          </div>
        </div>

        {/* Right preview */}
        <div className="lg:col-span-7 max-lg:mt-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-3 gap-3">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  {t("PreviewTailoredCV")}
                </p>
                <p className="text-xs text-slate-500">
                  {tailoredResume
                    ? t("TailoredCVForThisJD")
                    : t("PreviewOriginalCV")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="small"
                  className="text-xs"
                  disabled={!canSave || !baseResume}
                  onClick={handleSaveOverwrite}
                >
                  {t("SaveOverOriginal")}
                </Button>
                <Button
                  size="small"
                  type="primary"
                  className="!bg-purple-600 text-xs disabled:!bg-purple-300"
                  disabled={!canSave}
                  onClick={handleSaveAsNew}
                >
                  {t("SaveAsNewCV")}
                </Button>
              </div>
            </div>

            {currentPreview ? (
              tailoredInfo && baseResume ? (
                <TailoredResumePreview
                  baseResume={baseResume}
                  tailoredInfo={tailoredInfo}
                  template={currentPreview.template || "classic"}
                  accentColor={currentPreview.accent_color || "#3B82F6"}
                  classes="shadow-lg"
                  onResumeChange={(updatedResume) => {
                    setTailoredResume(updatedResume);
                  }}
                />
              ) : (
                <ResumePreview
                  data={currentPreview}
                  template={currentPreview.template || "classic"}
                  accentColor={currentPreview.accent_color || "#3B82F6"}
                  classes="shadow-lg"
                />
              )
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
                {t("NoResumeToPreview")}
              </div>
            )}
          </div>

          <Modal
            open={isSaveModalOpen}
            onCancel={() => setIsSaveModalOpen(false)}
            onOk={handleConfirmSaveAsNew}
            okButtonProps={{
              style: { backgroundColor: "#9810fa" },
            }}
            okText={t("SaveTailoredCV")}
            title={t("NewTailoredCVTitle")}
          >
            <Input
              value={saveAsNewTitle}
              onChange={(e) => setSaveAsNewTitle(e.target.value)}
              placeholder={t("TailoredCVTitlePlaceholder")}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
}


